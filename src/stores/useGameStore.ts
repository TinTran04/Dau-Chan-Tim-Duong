import { create } from 'zustand';

export type EndGameStatus = {
  type: 'win' | 'lose';
  title: string;
  message: string;
};

export interface CorrectDetail {
  chapter: number;
  question: string;
  answer: string;
}

export interface SessionStats {
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  bonusUnlocked: number;
  chapterReached: number;
  correctDetails: CorrectDetail[];
}

export interface LocalPlayerData {
  name: string;
  bestScore: number;
  bestEnding: string;
  totalPlays: number;
  lastSession: SessionStats | null;
}

interface GameState {
  isStarted: boolean;
  chapter: 1 | 2 | 3 | 4;
  ideology: number;
  forces: number;
  playerName: string;
  endGameStatus: EndGameStatus | null;
  sessionStats: SessionStats;
  
  startGame: (name: string) => void;
  setChapter: (ch: 1 | 2 | 3 | 4) => void;
  setEndGameStatus: (status: EndGameStatus | null) => void;
  setPlayerName: (name: string) => void;
  updateSessionStat: (updater: (stats: SessionStats) => SessionStats) => void;
  saveProgress: (score: number, endingType: string) => void;
}

const initialSessionStats: SessionStats = {
  totalQuestions: 0,
  correctAnswers: 0,
  wrongAnswers: 0,
  bonusUnlocked: 0,
  chapterReached: 1,
  correctDetails: []
};

export const useGameStore = create<GameState>((set, get) => ({
  isStarted: false,
  chapter: 1,
  ideology: 50,
  forces: 1000,
  playerName: '',
  endGameStatus: null,
  sessionStats: { ...initialSessionStats },
  
  startGame: (name: string) => set({ 
    isStarted: true, 
    chapter: 1, 
    ideology: 50, 
    forces: 1000, 
    endGameStatus: null, 
    playerName: name,
    sessionStats: { ...initialSessionStats }
  }),
  setChapter: (ch) => set(state => ({ 
    chapter: ch,
    sessionStats: { ...state.sessionStats, chapterReached: Math.max(state.sessionStats.chapterReached, ch) }
  })),
  setEndGameStatus: (status) => set({ endGameStatus: status }),
  setPlayerName: (name) => set({ playerName: name }),
  updateSessionStat: (updater) => set((state) => ({ sessionStats: updater(state.sessionStats) })),
  
  saveProgress: (score: number, endingType: string) => {
    const { playerName, sessionStats } = get();
    if (!playerName) return;
    
    const LOCAL_KEY = 'dau_chan_tim_duong_player';
    const existingStr = localStorage.getItem(LOCAL_KEY);
    let player: LocalPlayerData = {
      name: playerName,
      bestScore: 0,
      bestEnding: '',
      totalPlays: 0,
      lastSession: null
    };
    
    if (existingStr) {
       const parsed = JSON.parse(existingStr);
       if (parsed.name === playerName) {
           player = parsed;
       }
    }
    
    player.totalPlays += 1;
    player.lastSession = sessionStats;
    if (score > player.bestScore) {
       player.bestScore = score;
       player.bestEnding = endingType;
    }
    
    localStorage.setItem(LOCAL_KEY, JSON.stringify(player));
  }
}));
