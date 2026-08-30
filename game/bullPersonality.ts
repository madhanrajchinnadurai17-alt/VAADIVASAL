export type BullPersonalityType =
  | 'Calm'
  | 'Nervous'
  | 'Fast'
  | 'Aggressive'
  | 'Highly Reactive'
  | 'Strong'
  | 'Agile'
  | 'Unpredictable';

export interface BullPersonality {
  type: BullPersonalityType;
  tamilName: string;
  badge: string;
  color: string;
  description: string;
  // Arena Steering & AI params
  speed: number;
  veerIntervalMin: number;
  veerIntervalMax: number;
  veerAngleMagnitude: number;
  evasionRadius: number;
  evasionStrength: number; // weight of steering away from nearest tamer
  // Taming Minigame params
  targetStages: number;
  targetZoneMultiplier: number;
  needleSpeedMultiplier: number;
  staminaResistance: number;
}

export const BULL_PERSONALITIES: Record<BullPersonalityType, BullPersonality> = {
  Calm: {
    type: 'Calm',
    tamilName: 'அமைதியான காளை (Sober & Steady)',
    badge: '🧘 Calm',
    color: '#38bdf8',
    description: 'Moves steadily with long hold durations and predictable turns. Easy to pace.',
    speed: 135,
    veerIntervalMin: 1000,
    veerIntervalMax: 1600,
    veerAngleMagnitude: 0.9,
    evasionRadius: 100,
    evasionStrength: 0.4,
    targetStages: 4,
    targetZoneMultiplier: 1.15,
    needleSpeedMultiplier: 0.9,
    staminaResistance: 0.9,
  },
  Nervous: {
    type: 'Nervous',
    tamilName: 'பதட்டமான காளை (Skittish & Wary)',
    badge: '⚡ Nervous',
    color: '#facc15',
    description: 'Easily startled by approaching tamers. Veers away quickly when crowded.',
    speed: 165,
    veerIntervalMin: 450,
    veerIntervalMax: 900,
    veerAngleMagnitude: 1.5,
    evasionRadius: 150,
    evasionStrength: 1.4,
    targetStages: 4,
    targetZoneMultiplier: 1.0,
    needleSpeedMultiplier: 1.1,
    staminaResistance: 1.0,
  },
  Fast: {
    type: 'Fast',
    tamilName: 'மின்னல் வேகக் காளை (Lightning Surge)',
    badge: '💨 Fast',
    color: '#fb923c',
    description: 'Unmatched acceleration and top speed. Demands instant reaction.',
    speed: 215,
    veerIntervalMin: 350,
    veerIntervalMax: 700,
    veerAngleMagnitude: 1.2,
    evasionRadius: 120,
    evasionStrength: 0.8,
    targetStages: 4,
    targetZoneMultiplier: 0.95,
    needleSpeedMultiplier: 1.35,
    staminaResistance: 1.05,
  },
  Aggressive: {
    type: 'Aggressive',
    tamilName: 'முரட்டுக் காளை (Fierce Charger)',
    badge: '🔥 Aggressive',
    color: '#ef4444',
    description: 'Sharp, violent turns and sudden shifts in direction. High resistance.',
    speed: 185,
    veerIntervalMin: 400,
    veerIntervalMax: 750,
    veerAngleMagnitude: 2.2,
    evasionRadius: 130,
    evasionStrength: 1.2,
    targetStages: 4,
    targetZoneMultiplier: 0.85,
    needleSpeedMultiplier: 1.25,
    staminaResistance: 1.2,
  },
  'Highly Reactive': {
    type: 'Highly Reactive',
    tamilName: 'துரித எதிர்வினைக் காளை (Hyper-Reflex)',
    badge: '👁️ Highly Reactive',
    color: '#e879f9',
    description: 'Constantly reads nearby tamers and sharply pivots away from the closest flank.',
    speed: 175,
    veerIntervalMin: 300,
    veerIntervalMax: 650,
    veerAngleMagnitude: 2.0,
    evasionRadius: 165,
    evasionStrength: 1.8,
    targetStages: 4,
    targetZoneMultiplier: 0.9,
    needleSpeedMultiplier: 1.2,
    staminaResistance: 1.1,
  },
  Strong: {
    type: 'Strong',
    tamilName: 'திண்மையான காளை (Iron Titan)',
    badge: '🛡️ Strong',
    color: '#a855f7',
    description: 'Heavy, resolute build. Requires an extra 5th grip lock to fully tame.',
    speed: 150,
    veerIntervalMin: 700,
    veerIntervalMax: 1300,
    veerAngleMagnitude: 1.1,
    evasionRadius: 110,
    evasionStrength: 0.6,
    targetStages: 5, // Extra 5th stage required for Strong
    targetZoneMultiplier: 0.8,
    needleSpeedMultiplier: 1.05,
    staminaResistance: 1.4,
  },
  Agile: {
    type: 'Agile',
    tamilName: 'சுறுசுறுப்பான காளை (Swift Acrobat)',
    badge: '🌀 Agile',
    color: '#2dd4bf',
    description: 'Nimble footwork and rapid zig-zags across the sand. Keeps you on your toes.',
    speed: 190,
    veerIntervalMin: 350,
    veerIntervalMax: 650,
    veerAngleMagnitude: 1.8,
    evasionRadius: 140,
    evasionStrength: 1.3,
    targetStages: 4,
    targetZoneMultiplier: 0.88,
    needleSpeedMultiplier: 1.3,
    staminaResistance: 1.05,
  },
  Unpredictable: {
    type: 'Unpredictable',
    tamilName: 'கணிக்க முடியாத காளை (Wild Enigma)',
    badge: '🎲 Unpredictable',
    color: '#f43f5e',
    description: 'Erratic timing—alternates between long pauses and explosive, sudden veers.',
    speed: 180,
    veerIntervalMin: 200,
    veerIntervalMax: 1500,
    veerAngleMagnitude: 2.4,
    evasionRadius: 150,
    evasionStrength: 1.5,
    targetStages: 4,
    targetZoneMultiplier: 0.88,
    needleSpeedMultiplier: 1.25,
    staminaResistance: 1.15,
  },
};

export const PERSONALITY_TYPES: BullPersonalityType[] = [
  'Calm',
  'Nervous',
  'Fast',
  'Aggressive',
  'Highly Reactive',
  'Strong',
  'Agile',
  'Unpredictable',
];

export function getRandomBullPersonality(): BullPersonality {
  const randType = PERSONALITY_TYPES[Math.floor(Math.random() * PERSONALITY_TYPES.length)];
  return BULL_PERSONALITIES[randType];
}
