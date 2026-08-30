import { BullStats, INITIAL_PLAYER_BULL } from './bullCareSystem';

export interface WonPrize {
  id: string;
  name: string;
  tamilName: string;
  icon: string;
  villageName: string;
  awardedFor: 'Tamer Victory' | 'Bull Escape Champion';
  timestamp: string;
}

export interface PlayerTamerAttributes {
  speed: number;
  reflex: number;
  balance: number;
  stamina: number;
  courage: number;
  timing: number;
  grip: number;
  agility: number;
  tamerNumber: number; // e.g. #07
}

export interface GameSaveData {
  coins: number;
  ownerReputation: number;
  ownerRankTitle: string;
  unlockedVillageIndex: number;
  currentVillageId: string;
  bull: BullStats;
  tamer: PlayerTamerAttributes;
  prizeShowcase: WonPrize[];
  totalMatchesPlayed: number;
  totalTamesWon: number;
  totalBullEscapes: number;
}

const STORAGE_KEY = 'VAADIVASAL_SAVE_DATA_V2';

export const INITIAL_TAMER_ATTRIBUTES: PlayerTamerAttributes = {
  speed: 40,
  reflex: 45,
  balance: 42,
  stamina: 50,
  courage: 55,
  timing: 48,
  grip: 44,
  agility: 46,
  tamerNumber: 7, // Traditional player bib #07
};

export const INITIAL_SAVE_DATA: GameSaveData = {
  coins: 250,
  ownerReputation: 120,
  ownerRankTitle: 'Village Novice • கிராமத்து வளர்ப்பாளர்',
  unlockedVillageIndex: 0, // Starts at Avaniyapuram
  currentVillageId: 'avaniyapuram',
  bull: INITIAL_PLAYER_BULL,
  tamer: INITIAL_TAMER_ATTRIBUTES,
  prizeShowcase: [],
  totalMatchesPlayed: 0,
  totalTamesWon: 0,
  totalBullEscapes: 0,
};

export function getOwnerRankTitle(reputation: number): string {
  if (reputation >= 3000) return 'Legend of Tamil Nadu • தமிழகத்தின் மாபெரும் ஜல்லிக்கட்டு நாயகன்';
  if (reputation >= 1800) return 'Grand Arena Champion • மாநில சாம்பியன்';
  if (reputation >= 1000) return 'District Master Trainer • மாவட்டத் தலைவர்';
  if (reputation >= 450) return 'Experienced Bull Master • அனுபவமிக்க மாட்டுக்காரர்';
  return 'Village Bull Owner • கிராமத்து வளர்ப்பாளர்';
}

export function loadGameData(): GameSaveData {
  if (typeof window === 'undefined') return INITIAL_SAVE_DATA;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return INITIAL_SAVE_DATA;
    const parsed = JSON.parse(raw);
    return { ...INITIAL_SAVE_DATA, ...parsed };
  } catch (err) {
    console.error('Failed to load save data from localStorage:', err);
    return INITIAL_SAVE_DATA;
  }
}

export function saveGameData(data: GameSaveData): void {
  if (typeof window === 'undefined') return;
  try {
    const updated = {
      ...data,
      ownerRankTitle: getOwnerRankTitle(data.ownerReputation),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to save data to localStorage:', err);
  }
}
