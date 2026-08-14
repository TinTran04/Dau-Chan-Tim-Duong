import { create } from 'zustand';
import chapter1Data from '../data/chapter1.json';
import chapter2Data from '../data/chapter2.json';
import chapter3Data from '../data/chapter3.json';
import { useGameStore } from './useGameStore';
import { submitScore } from '../services/leaderboard';

export type ChoiceQuality = 'best' | 'partial' | 'wrong';

export type DialogueOption = {
  key: string;
  label: string;
  consequence: string;
  ideologyDelta: number;
  forcesDelta: number;
  quality?: ChoiceQuality;
  feedback?: string;
};

export type DialogueNode = {
  id: string;
  type: 'line' | 'choice';
  speaker?: string;
  text?: string;
  prompt?: string;
  sceneCode?: string;
  timerSeconds?: number;
  timeoutFallback?: string;
  options?: DialogueOption[];
  next?: string;
};

interface DialogueState {
  currentNode: DialogueNode | null;
  nodesMap: Record<string, DialogueNode>;

  loadChapter: (chapterNum: number) => void;
  advance: (nextNodeId?: string) => void;
  makeChoice: (option: DialogueOption) => void;
}

const chapters = {
  1: { data: chapter1Data, startNode: 'ch1_start' },
  2: { data: chapter2Data, startNode: 'ch2_start' },
  3: { data: chapter3Data, startNode: 'ch3_start' },
} as const;

function getFinalScore(ideology: number, forces: number) {
  return Math.max(0, ideology * 100) + forces;
}

function submitIfHighScore(score: number) {
  const state = useGameStore.getState();
  const localDataStr = localStorage.getItem('dau_chan_tim_duong_player');
  let isNewHighScore = true;

  if (localDataStr) {
    const localData = JSON.parse(localDataStr);
    if (localData.name === state.playerName && score <= localData.bestScore) {
      isNewHighScore = false;
    }
  }

  if (isNewHighScore) {
    submitScore(state.playerName, score);
  }
}

export const useDialogueStore = create<DialogueState>((set, get) => ({
  currentNode: null,
  nodesMap: {},

  loadChapter: (chapterNum: number) => {
    const chapterConfig = chapters[chapterNum as 1 | 2 | 3];
    if (!chapterConfig) return;

    const map: Record<string, DialogueNode> = {};
    chapterConfig.data.nodes.forEach((node: DialogueNode) => {
      map[node.id] = node;
    });

    set({ nodesMap: map, currentNode: map[chapterConfig.startNode] });
    useGameStore.getState().setChapter(chapterNum as 1 | 2 | 3);
  },

  advance: (nextNodeId?: string) => {
    const { currentNode, nodesMap, loadChapter } = get();
    if (!currentNode) return;

    const nextId = nextNodeId || currentNode.next;

    if (nextId === 'ending') {
      const state = useGameStore.getState();
      const failScore = Math.max(0, state.ideology * 10) + state.forces;

      submitIfHighScore(failScore);
      state.saveProgress(failScore, 'review_needed');
      state.setEndGameStatus({
        type: 'lose',
        title: 'HO SO CAN ON TAP',
        message: currentNode.text || 'Ho so da sai lech qua nhieu. Hay quay lai doi chieu tu lieu va khoi phuc mach lich su.'
      });
      set({ currentNode: null });
      return;
    }

    if (nextId === 'next_chapter') {
      const currentCh = useGameStore.getState().chapter;
      if (currentCh < 3) {
        loadChapter((currentCh + 1) as 1 | 2 | 3);
      }
      return;
    }

    if (nextId === 'true_ending') {
      const state = useGameStore.getState();
      const finalScore = getFinalScore(state.ideology, state.forces);

      submitIfHighScore(finalScore);
      state.saveProgress(finalScore, 'complete_profile');
      state.setEndGameStatus({
        type: 'win',
        title: 'HO SO HOAN THIEN',
        message: currentNode.text || 'Nhung dau chan roi rac da duoc noi thanh mot hanh trinh co phuong huong.'
      });
      set({ currentNode: null });
      return;
    }

    if (nextId && nodesMap[nextId]) {
      set({ currentNode: nodesMap[nextId] });
    } else {
      set({ currentNode: null });
    }
  },

  makeChoice: (option: DialogueOption) => {
    const { currentNode } = get();
    if (!currentNode) return;

    const gameStore = useGameStore.getState();
    const newIdeology = Math.max(0, Math.min(100, gameStore.ideology + option.ideologyDelta));
    const newForces = Math.max(0, gameStore.forces + option.forcesDelta);

    if (currentNode.type === 'choice') {
      gameStore.updateSessionStat((stats) => {
        const isBest = option.quality === 'best';
        const isWrong = option.quality === 'wrong';
        return {
          ...stats,
          totalQuestions: stats.totalQuestions + 1,
          correctAnswers: stats.correctAnswers + (isBest ? 1 : 0),
          wrongAnswers: stats.wrongAnswers + (isWrong ? 1 : 0),
          bonusUnlocked: stats.bonusUnlocked + (option.quality === 'partial' ? 1 : 0),
          correctDetails: isBest
            ? [
                ...stats.correctDetails,
                {
                  chapter: gameStore.chapter,
                  question: currentNode.prompt || 'Ho so',
                  answer: option.label,
                }
              ]
            : stats.correctDetails,
        };
      });
    }

    useGameStore.setState({ ideology: newIdeology, forces: newForces });

    if (newIdeology <= 0) {
      gameStore.setEndGameStatus({
        type: 'lose',
        title: 'HO SO CAN ON TAP',
        message: 'Ho so da sai lech qua nhieu. Hay quay lai doi chieu tu lieu va khoi phuc mach lich su.'
      });
      set({ currentNode: null });
      return;
    }

    set({
      currentNode: {
        id: `${currentNode.id}_${option.key}_feedback`,
        type: 'line',
        speaker: option.quality === 'best'
          ? 'Ho so duoc khoi phuc'
          : option.quality === 'partial'
            ? 'Nhan dinh chua du'
            : 'Moi lien ket sai lech',
        text: option.feedback || 'Lua chon da duoc ghi vao ho so.',
        next: option.consequence,
        sceneCode: currentNode.sceneCode,
      }
    });
  }
}));
