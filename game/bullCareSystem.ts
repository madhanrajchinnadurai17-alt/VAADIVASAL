import { BullPersonalityType, BULL_PERSONALITIES } from './bullPersonality';

export type GrowthStage = 'Young Bull' | 'Growing Bull' | 'Trained Bull' | 'Champion Kangayam';

export interface BullStats {
  name: string;
  tamilName: string;
  breed: string; // 'Kangayam' | 'Pulikulam' | 'Alambadi'
  growthStage: GrowthStage;
  personality: BullPersonalityType;
  ageYears: number;
  weightKg: number;
  
  // Dynamic Care Meters (0 to 100)
  energy: number;
  health: number;
  hydration: number;
  hygiene: number;
  trust: number;
  
  // In-Game Athletic Attributes
  strength: number; // 20 - 100
  stamina: number; // 20 - 100
  speed: number; // 20 - 100
  reaction: number; // 20 - 100
  agility: number; // 20 - 100
  
  // Training Records
  waterTrainingSessions: number;
  sprintTrainingSessions: number;
  reactionTrainingSessions: number;
  tournamentsParticipated: number;
  escapesWon: number;
}

export interface FoodItem {
  id: string;
  name: string;
  tamilName: string;
  icon: string;
  cost: number;
  description: string;
  effects: {
    energy?: number;
    health?: number;
    hydration?: number;
    strength?: number;
    stamina?: number;
    trust?: number;
  };
}

export const TRADITIONAL_FEEDS: FoodItem[] = [
  {
    id: 'green_fodder',
    name: 'Fresh Green Fodder',
    tamilName: 'பச்சைப் புல் (Green Grass)',
    icon: '🌿',
    cost: 15,
    description: 'Fresh organic green grass cut from the river banks. Rejuvenates vital health and hydration.',
    effects: { health: 15, energy: 12, hydration: 10, trust: 5 },
  },
  {
    id: 'millet_mash',
    name: 'Millet & Corn Mash',
    tamilName: 'கம்பு சோளக் கூழ் (Millet Mash)',
    icon: '🥣',
    cost: 30,
    description: 'Nutrient-rich warm boiled pearl millet and sorghum porridge. Builds core cardiovascular stamina.',
    effects: { stamina: 8, energy: 25, health: 10, strength: 4 },
  },
  {
    id: 'cottonseed_cake',
    name: 'Cottonseed & Oilcake',
    tamilName: 'பருத்திக் கொட்டை & புண்ணாக்கு',
    icon: '🌰',
    cost: 50,
    description: 'High-protein soaked cottonseed and sesame cake. Solidifies the hump (திமில்) and muscle density.',
    effects: { strength: 10, stamina: 6, health: 8, energy: 20 },
  },
  {
    id: 'rice_bran',
    name: 'Rice Bran & Mineral Mix',
    tamilName: 'தவிடு & கனிமக் கலவை',
    icon: '🌾',
    cost: 25,
    description: 'Fine rice bran with salt and natural mineral supplements. Aids rapid post-workout recovery.',
    effects: { energy: 18, health: 12, stamina: 5 },
  },
  {
    id: 'spring_water',
    name: 'Fresh Well Spring Water',
    tamilName: 'ஊற்றுத் தண்ணீர் (Spring Water)',
    icon: '💧',
    cost: 5,
    description: 'Pure, chilled groundwater from the farm well. Completely restores hydration.',
    effects: { hydration: 40, energy: 10, health: 5 },
  },
];

export const INITIAL_PLAYER_BULL: BullStats = {
  name: 'Karuppan (கருப்பன்)',
  tamilName: 'கருப்பன்',
  breed: 'Kangayam (காங்கேயம்)',
  growthStage: 'Young Bull',
  personality: 'Nervous',
  ageYears: 2.0,
  weightKg: 340,
  energy: 85,
  health: 90,
  hydration: 80,
  hygiene: 75,
  trust: 60,
  strength: 35,
  stamina: 40,
  speed: 45,
  reaction: 38,
  agility: 42,
  waterTrainingSessions: 0,
  sprintTrainingSessions: 0,
  reactionTrainingSessions: 0,
  tournamentsParticipated: 0,
  escapesWon: 0,
};

export function updateBullGrowth(bull: BullStats): BullStats {
  const avgStats = (bull.strength + bull.stamina + bull.speed + bull.reaction + bull.agility) / 5;
  let stage: GrowthStage = 'Young Bull';
  let weight = 340;
  let age = 2.0;

  if (avgStats >= 80) {
    stage = 'Champion Kangayam';
    weight = 540;
    age = 4.5;
  } else if (avgStats >= 60) {
    stage = 'Trained Bull';
    weight = 460;
    age = 3.5;
  } else if (avgStats >= 45) {
    stage = 'Growing Bull';
    weight = 400;
    age = 2.8;
  }

  return {
    ...bull,
    growthStage: stage,
    weightKg: weight,
    ageYears: age,
  };
}
