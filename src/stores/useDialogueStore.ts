import { create } from 'zustand';
import chapter1Data from '../data/chapter1.json';
import chapter2Data from '../data/chapter2.json';
import chapter3Data from '../data/chapter3.json';
import chapter4Data from '../data/chapter4.json';
import { useGameStore } from './useGameStore';
import { submitScore } from '../services/leaderboard';

export type DialogueOption = {
  key: string;
  label: string;
  consequence: string;
  ideologyDelta: number;
  forcesDelta: number;
};

export type DialogueNode = {
  id: string;
  type: 'line' | 'choice';
  speaker?: string;
  text?: string;
  prompt?: string;
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

export const useDialogueStore = create<DialogueState>((set, get) => ({
  currentNode: null,
  nodesMap: {},
  
  loadChapter: (chapterNum: number) => {
    let data;
    let startNode = 'ch1_start';
    if (chapterNum === 1) { data = chapter1Data; startNode = 'ch1_start'; }
    else if (chapterNum === 2) { data = chapter2Data; startNode = 'ch2_start'; }
    else if (chapterNum === 3) { data = chapter3Data; startNode = 'ch3_start'; }
    else if (chapterNum === 4) { data = chapter4Data; startNode = 'ch4_start'; }
    
    if (!data) return;

    const map: Record<string, DialogueNode> = {};
    data.nodes.forEach((n: any) => {
      map[n.id] = n;
    });
    set({ nodesMap: map, currentNode: map[startNode] });
    useGameStore.getState().setChapter(chapterNum as 1|2|3|4);
  },
  
  advance: (nextNodeId?: string) => {
    const { currentNode, nodesMap, loadChapter } = get();
    if (!currentNode) return;
    
    let nextId = nextNodeId || currentNode.next;
    
    if (nextId === 'ending') {
      const state = useGameStore.getState();
      // Điểm hồ sơ chưa đạt: trọng số nhận thức thấp (x10) cộng với tư liệu còn lại.
      const failScore = Math.max(0, state.ideology * 10) + state.forces;
      
      const localKey = 'dau_chan_tim_duong_player';
      const localDataStr = localStorage.getItem(localKey);
      let isNewHighScore = true;
      if (localDataStr) {
         const localData = JSON.parse(localDataStr);
         if (localData.name === state.playerName && failScore <= localData.bestScore) {
             isNewHighScore = false;
         }
      }
      
      if (isNewHighScore) {
         submitScore(state.playerName, failScore);
      }
      state.saveProgress(failScore, 'game_over');

      state.setEndGameStatus({
        type: 'lose',
        title: 'HỒ SƠ CẦN ÔN TẬP',
        message: currentNode.text || "Hồ sơ lập luận chưa đủ chứng cứ. Hãy quay lại, đọc kỹ bối cảnh và thử phân tích lại."
      });
      set({ currentNode: null });
      return;
    }
    
    if (nextId === 'next_chapter') {
      const currentCh = useGameStore.getState().chapter;
      if (currentCh < 4) {
         loadChapter(currentCh + 1);
      }
      return;
    }

    if (nextId === 'true_ending') {
      const state = useGameStore.getState();
      const finalScore = state.ideology * 100 + state.forces;
      
      const localKey = 'dau_chan_tim_duong_player';
      const localDataStr = localStorage.getItem(localKey);
      let isNewHighScore = true;
      if (localDataStr) {
         const localData = JSON.parse(localDataStr);
         if (localData.name === state.playerName && finalScore <= localData.bestScore) {
             isNewHighScore = false;
         }
      }
      
      if (isNewHighScore) {
         submitScore(state.playerName, finalScore);
      }
      state.saveProgress(finalScore, 'true_ending');
      
      state.setEndGameStatus({
        type: 'win',
        title: 'HỒ SƠ HOÀN CHỈNH',
        message: currentNode.text || "Bạn đã hoàn thiện hồ sơ học tập với bối cảnh, chứng cứ và quan hệ nhân quả rõ ràng."
      });
      set({ currentNode: null });
      return;
    }

    if (nextId === 'normal_ending') {
      const state = useGameStore.getState();
      const finalScore = state.ideology * 50 + state.forces;
      
      const localKey = 'dau_chan_tim_duong_player';
      const localDataStr = localStorage.getItem(localKey);
      let isNewHighScore = true;
      if (localDataStr) {
         const localData = JSON.parse(localDataStr);
         if (localData.name === state.playerName && finalScore <= localData.bestScore) {
             isNewHighScore = false;
         }
      }
      
      if (isNewHighScore) {
         submitScore(state.playerName, finalScore);
      }
      state.saveProgress(finalScore, 'normal_ending');
      
      state.setEndGameStatus({
        type: 'win',
        title: 'HỒ SƠ ĐẠT YÊU CẦU',
        message: currentNode.text || "Bạn đã nắm được hướng phân tích chính, nhưng vẫn còn tư liệu hoặc nhánh giải thích có thể bổ sung."
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
    const { advance, currentNode } = get();
    // Update game stats
    const gameStore = useGameStore.getState();
    const newIdeology = Math.max(0, Math.min(100, gameStore.ideology + option.ideologyDelta));
    const newForces = Math.max(0, gameStore.forces + option.forcesDelta);
    
    // Update Session Stats
    if (currentNode && currentNode.type === 'choice') {
       gameStore.updateSessionStat((stats) => {
           const newStats = { ...stats, totalQuestions: stats.totalQuestions + 1 };
           if (option.ideologyDelta > 0) {
               newStats.correctAnswers += 1;
               if (currentNode.id.includes('bonus')) {
                   newStats.bonusUnlocked += 1;
               }
               newStats.correctDetails = [
                 ...newStats.correctDetails,
                 {
                    chapter: gameStore.chapter,
                    question: currentNode.prompt || 'Câu hỏi',
                    answer: option.label
                 }
               ];
           } else {
               newStats.wrongAnswers += 1;
           }
           return newStats;
       });
    }
    
    useGameStore.setState({ ideology: newIdeology, forces: newForces });
    
    if (newIdeology <= 0) {
       advance('ending'); // Nhận thức lịch sử về 0 -> cần ôn tập lại.
    } else {
       advance(option.consequence);
    }
  }
}));
