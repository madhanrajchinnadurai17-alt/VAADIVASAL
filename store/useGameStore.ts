import { create } from 'zustand';
import { BullPersonality, getRandomBullPersonality } from '../game/bullPersonality';
import { TAMIL_VILLAGES, VillageEvent } from '../game/villageSystem';

export type GameScreen =
  | 'loading'
  | 'main_menu'
  | 'arena_entrance'
  | 'vaadivasal_release'
  | 'arena_interaction'
  | 'taming_minigame'
  | 'round_result'
  | 'bull_dashboard';

export interface CompetitorPlayer {
  id: string;
  bib: string;
  name: string;
  isUser: boolean;
  completed: boolean;
  score: number;
}

interface GameState {
  screen: GameScreen;
  round: number;
  timerSeconds: number;
  score: number;
  bullName: string;
  bullStamina: number;
  bullPersonality: BullPersonality;
  currentVillage: VillageEvent;
  targetObjective: string;
  players: CompetitorPlayer[];
  
  // Controls & Physics state
  joystick: { x: number; y: number };
  isSprinting: boolean;
  actionTrigger: 'RUN' | 'DIVE' | 'GRAB' | null;
  
  // Taming / Grip minigame state
  holdSeconds: number;
  targetHoldSeconds: number;
  currentGripStage: number;
  targetGripStages: number;
  isTameSuccess: boolean;
  attemptsUsed: number;
  soundMuted: boolean;
  isPaused: boolean;

  // Actions
  setScreen: (screen: GameScreen) => void;
  setJoystick: (joystick: { x: number; y: number }) => void;
  setIsSprinting: (sprint: boolean) => void;
  triggerAction: (action: 'RUN' | 'DIVE' | 'GRAB' | null) => void;
  updateTimer: (seconds: number) => void;
  updateBullStamina: (stamina: number) => void;
  setTargetObjective: (text: string) => void;
  incrementHold: (dt: number) => void;
  advanceGripStage: () => void;
  completeRound: (success: boolean) => void;
  resetToArena: () => void;
  toggleMute: () => boolean;
  togglePause: () => void;
}

const INITIAL_PLAYERS: CompetitorPlayer[] = [
  { id: '1', bib: '01', name: 'MURUGAN', isUser: false, completed: true, score: 210 },
  { id: '2', bib: '02', name: 'SIVA', isUser: false, completed: true, score: 230 },
  { id: '3', bib: '03', name: 'KARTHIK', isUser: false, completed: true, score: 195 },
  { id: '4', bib: '04', name: 'AJITH', isUser: false, completed: true, score: 220 },
  { id: '5', bib: '05', name: 'DINESH', isUser: false, completed: true, score: 240 },
  { id: '6', bib: '06', name: 'YOU #07', isUser: true, completed: false, score: 250 },
];

export const useGameStore = create<GameState>((set, get) => ({
  screen: 'loading',
  round: 1,
  timerSeconds: 54,
  score: 250,
  bullName: 'KARUPPI',
  bullStamina: 100,
  bullPersonality: getRandomBullPersonality(),
  currentVillage: TAMIL_VILLAGES[0],
  targetObjective: 'HOLD THE BULL FOR 10 SECONDS',
  players: INITIAL_PLAYERS,
  
  joystick: { x: 0, y: 0 },
  isSprinting: false,
  actionTrigger: null,
  
  holdSeconds: 0,
  targetHoldSeconds: 10,
  currentGripStage: 0,
  targetGripStages: 4,
  isTameSuccess: false,
  attemptsUsed: 1,
  soundMuted: false,
  isPaused: false,

  setScreen: (screen) => set({ screen }),
  setJoystick: (joystick) => set({ joystick }),
  setIsSprinting: (isSprinting) => set({ isSprinting }),
  triggerAction: (actionTrigger) => set({ actionTrigger }),
  updateTimer: (timerSeconds) => set({ timerSeconds }),
  updateBullStamina: (bullStamina) => set({ bullStamina: Math.max(0, Math.min(100, bullStamina)) }),
  setTargetObjective: (targetObjective) => set({ targetObjective }),
  
  incrementHold: (dt) => {
    const current = get().holdSeconds + dt;
    set({ holdSeconds: current });
    if (current >= get().targetHoldSeconds) {
      get().completeRound(true);
    }
  },

  advanceGripStage: () => {
    const nextStage = get().currentGripStage + 1;
    set({
      currentGripStage: nextStage,
      score: get().score + 100,
      bullStamina: Math.max(0, get().bullStamina - 20),
    });
    if (nextStage >= get().targetGripStages) {
      get().completeRound(true);
    }
  },

  completeRound: (success) => {
    set((state) => ({
      isTameSuccess: success,
      screen: 'round_result',
      players: state.players.map((p) => (p.isUser ? { ...p, completed: true, score: state.score } : p)),
    }));
  },

  resetToArena: () => {
    set({
      screen: 'arena_entrance',
      timerSeconds: 54,
      holdSeconds: 0,
      currentGripStage: 0,
      bullStamina: 100,
      bullPersonality: getRandomBullPersonality(),
      actionTrigger: null,
      targetObjective: 'HOLD THE BULL FOR 10 SECONDS',
    });
  },

  toggleMute: () => {
    const muted = !get().soundMuted;
    set({ soundMuted: muted });
    return muted;
  },

  togglePause: () => set((state) => ({ isPaused: !state.isPaused })),
}));
