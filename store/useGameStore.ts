import { create } from 'zustand';
import { BullPersonality, getRandomBullPersonality } from '../game/bullPersonality';
import { TAMIL_VILLAGES, VillageEvent } from '../game/villageSystem';
import { BullTier, getTierForStats, BULL_TIERS } from '../components/three/BullGrowthTiers';

export type GameScreen =
  | 'loading'
  | 'main_menu'
  | 'bull_selection'
  | 'bull_care'
  | 'training_pond'
  | 'training_sprint'
  | 'training_reaction'
  | 'bull_reward'
  | 'world_map'
  | 'travel_transition'
  | 'arena_entrance'
  | 'vaadivasal_release'
  | 'arena_interaction'
  | 'taming_minigame'
  | 'round_result'
  | 'season_reward'
  | 'grand_final'
  | 'trophy_hall'
  | 'victory_celebration'
  | 'epilogue'
  | 'bull_dashboard';

export type ControlPhase = 'approach' | 'closing' | 'active_grip';

export interface CompetitorPlayer {
  id: string;
  bib: string;
  name: string;
  isUser: boolean;
  completed: boolean;
  score: number;
}

export interface BullAthleticStats {
  strength: number;
  speed: number;
  stamina: number;
  aggression: number;
}

export interface BullCareStats {
  hunger: number;
  hydration: number;
  health: number;
}

export interface TrainingGain {
  statName: 'strength' | 'speed' | 'stamina' | 'aggression';
  amount: number;
  title: string;
  tierUp?: boolean;
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
  teamName: string;
  rivalTeamName: string;
  
  // HUD Addendum: Player Stat & Reputation Panel
  playerHealth: number;
  playerMaxHealth: number;
  playerStamina: number;
  playerMaxStamina: number;
  playerGripStrength: number;
  currentReputation: number;
  maxReputation: number;

  // Dynamic Control Prompts
  controlPhase: ControlPhase;
  gripSkillPercent: number;
  timingWindowSeconds: number;

  // Dynamic Path Visualization
  showPathVisualization: boolean;
  activePathRouteName: string;

  // AI Competition Interaction
  isAIInteractionActive: boolean;
  activeAIName: string | null;
  activeAIBib: string | null;

  // Live 2D Minimap Coordinates
  playerCoords: { x: number; z: number };
  bullCoords: { x: number; z: number };
  aiCoords: Array<{ id: string; x: number; z: number; bib: string }>;

  // Utility Modals
  showHelpModal: boolean;
  showInfoModal: boolean;
  showSettingsModal: boolean;
  showComingSoonModal: string | null;
  
  // Bull Growth & Care Stats
  bullStats: BullAthleticStats;
  careStats: BullCareStats;
  bullTier: BullTier;
  lastTrainingGain: TrainingGain | null;

  // Phase 3 & 4 Progression
  unlockedVillageIndex: number;
  destinationVillage: VillageEvent | null;
  isNightJallikattu: boolean;
  championshipProgress: number;
  rewardInventory: string[];

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
  setControlPhase: (phase: ControlPhase) => void;
  togglePathVisualization: () => void;
  triggerAIInteraction: (name: string, bib: string) => void;
  endAIInteraction: () => void;
  updateLiveCoords: (player: { x: number; z: number }, bull: { x: number; z: number }, ai?: Array<{ id: string; x: number; z: number; bib: string }>) => void;
  setShowHelpModal: (show: boolean) => void;
  setShowInfoModal: (show: boolean) => void;
  setShowSettingsModal: (show: boolean) => void;
  setShowComingSoonModal: (modeName: string | null) => void;

  // Care Screen 4 items -> 3 stats
  feedBullFodder: () => void;
  feedQualityFodder: () => void;
  feedFoodGrains: () => void;
  giveFreshWater: () => void;

  // Training Action
  completeTraining: (stat: 'strength' | 'speed' | 'stamina' | 'aggression', amount: number, title: string) => boolean;

  // Phase 3 & 4 Actions
  travelToVillage: (village: VillageEvent) => void;
  toggleNightMode: () => void;
}

// Team PARTIKAIR with authentic bib numbers
const INITIAL_PLAYERS: CompetitorPlayer[] = [
  { id: '1', bib: '01', name: 'MURUGAN', isUser: false, completed: true, score: 210 },
  { id: '2', bib: '02', name: 'SIVA', isUser: false, completed: true, score: 230 },
  { id: '3', bib: '03', name: 'KARTHIK', isUser: false, completed: true, score: 195 },
  { id: '4', bib: '04', name: 'AJITH', isUser: false, completed: true, score: 220 },
  { id: '5', bib: '05', name: 'DINESH', isUser: false, completed: true, score: 240 },
  { id: '6', bib: '06', name: 'YOU', isUser: true, completed: false, score: 250 },
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
  teamName: 'PARTIKAIR',
  rivalTeamName: 'VALLAKKOTTAI',

  // Player Stat & Reputation Panel
  playerHealth: 250,
  playerMaxHealth: 250,
  playerStamina: 200,
  playerMaxStamina: 200,
  playerGripStrength: 21,
  currentReputation: 10,
  maxReputation: 100,

  // Dynamic Control Prompts
  controlPhase: 'approach',
  gripSkillPercent: 75,
  timingWindowSeconds: 0.2,

  // Dynamic Path Visualization
  showPathVisualization: false,
  activePathRouteName: 'ROUTE C: ESCAPE ATTEMPT',

  // AI Competition Interaction
  isAIInteractionActive: false,
  activeAIName: null,
  activeAIBib: null,

  // Live 2D Minimap Coordinates
  playerCoords: { x: 0, z: 2.5 },
  bullCoords: { x: 0, z: -4 },
  aiCoords: [
    { id: '1', x: -4, z: -4, bib: '18' },
    { id: '2', x: -2.5, z: -6, bib: '24' },
    { id: '3', x: 3.5, z: -5, bib: '31' },
    { id: '4', x: 5, z: -3, bib: '42' },
    { id: '5', x: 2, z: -8, bib: '55' },
  ],

  // Utility Modals
  showHelpModal: false,
  showInfoModal: false,
  showSettingsModal: false,
  showComingSoonModal: null,

  // Bull Stats & Care Stats
  bullStats: {
    strength: 48,
    speed: 45,
    stamina: 50,
    aggression: 42,
  },
  careStats: {
    hunger: 80,
    hydration: 85,
    health: 75,
  },
  bullTier: 'young',
  lastTrainingGain: null,

  // Phase 3 & 4 Progression
  unlockedVillageIndex: 1,
  destinationVillage: null,
  isNightJallikattu: false,
  championshipProgress: 65,
  rewardInventory: ['double_kalash_pot', 'hero_bicycle', 'gold_coin', 'ceremonial_lamp'],
  
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
  setControlPhase: (controlPhase) => set({ controlPhase }),
  togglePathVisualization: () => set((s) => ({ showPathVisualization: !s.showPathVisualization })),

  triggerAIInteraction: (name, bib) => {
    set({
      isAIInteractionActive: true,
      activeAIName: name,
      activeAIBib: bib,
    });
  },

  endAIInteraction: () => {
    set({
      isAIInteractionActive: false,
      activeAIName: null,
      activeAIBib: null,
    });
  },

  updateLiveCoords: (player, bull, ai) => {
    set({
      playerCoords: player,
      bullCoords: bull,
      ...(ai ? { aiCoords: ai } : {}),
    });
  },

  setShowHelpModal: (showHelpModal) => set({ showHelpModal }),
  setShowInfoModal: (showInfoModal) => set({ showInfoModal }),
  setShowSettingsModal: (showSettingsModal) => set({ showSettingsModal }),
  setShowComingSoonModal: (showComingSoonModal) => set({ showComingSoonModal }),
  
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
    const currentIdx = TAMIL_VILLAGES.findIndex((v) => v.id === get().currentVillage.id);
    let nextUnlocked = get().unlockedVillageIndex;
    let nextReputation = get().currentReputation + (success ? 15 : 5);

    if (success && currentIdx >= get().unlockedVillageIndex && currentIdx < TAMIL_VILLAGES.length - 1) {
      nextUnlocked = currentIdx + 1;
    }

    const isFinalStage = currentIdx === TAMIL_VILLAGES.length - 1;

    set((state) => ({
      isTameSuccess: success,
      unlockedVillageIndex: nextUnlocked,
      currentReputation: Math.min(100, nextReputation),
      championshipProgress: isFinalStage ? 100 : Math.min(95, state.championshipProgress + 15),
      screen: isFinalStage && success
        ? 'victory_celebration'
        : (success ? 'season_reward' : 'round_result'),
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
      controlPhase: 'approach',
      isAIInteractionActive: false,
    });
  },

  toggleMute: () => {
    const muted = !get().soundMuted;
    set({ soundMuted: muted });
    return muted;
  },

  togglePause: () => set((state) => ({ isPaused: !state.isPaused })),

  // Care Screen 4 items -> 3 stats
  feedBullFodder: () => {
    set((state) => ({
      careStats: {
        ...state.careStats,
        hunger: Math.min(100, state.careStats.hunger + 30),
      },
    }));
  },

  feedQualityFodder: () => {
    set((state) => ({
      careStats: {
        ...state.careStats,
        hunger: Math.min(100, state.careStats.hunger + 25),
        health: Math.min(100, state.careStats.health + 15),
      },
    }));
  },

  feedFoodGrains: () => {
    set((state) => ({
      careStats: {
        ...state.careStats,
        hunger: Math.min(100, state.careStats.hunger + 15),
      },
    }));
  },

  giveFreshWater: () => {
    set((state) => ({
      careStats: {
        ...state.careStats,
        hydration: Math.min(100, state.careStats.hydration + 35),
        health: Math.min(100, state.careStats.health + 5),
      },
    }));
  },

  // Training Action
  completeTraining: (stat, amount, title) => {
    const currentStats = get().bullStats;
    const care = get().careStats;

    // Soft penalty if care stats are low (< 40%)
    const careMultiplier = (care.hunger < 40 || care.hydration < 40 || care.health < 40) ? 0.7 : 1.0;
    const finalAmount = Math.max(2, Math.round(amount * careMultiplier));

    const updatedStats = {
      ...currentStats,
      [stat]: Math.min(100, currentStats[stat] + finalAmount),
    };

    // Deduct care stats slightly
    const updatedCare = {
      hunger: Math.max(10, care.hunger - 15),
      hydration: Math.max(10, care.hydration - 15),
      health: Math.max(10, care.health - 10),
    };

    const total = updatedStats.strength + updatedStats.speed + updatedStats.stamina + updatedStats.aggression;
    const oldTier = get().bullTier;
    const newTier = getTierForStats(total);
    const tierUp = oldTier !== newTier;

    set({
      bullStats: updatedStats,
      careStats: updatedCare,
      bullTier: newTier,
      lastTrainingGain: {
        statName: stat,
        amount: finalAmount,
        title,
        tierUp,
      },
      screen: 'bull_reward',
    });

    return tierUp;
  },

  // Phase 3 & 4 Village Travel Actions
  travelToVillage: (village: VillageEvent) => {
    set({
      destinationVillage: village,
      currentVillage: village,
      screen: 'travel_transition',
    });
  },

  toggleNightMode: () => {
    set((state) => ({ isNightJallikattu: !state.isNightJallikattu }));
  },
}));
