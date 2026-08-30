export interface VillageEvent {
  id: string;
  name: string;
  tamilName: string;
  district: string;
  description: string;
  historicalSignificance: string;
  arenaTheme: {
    groundTint: number;
    skyColors: [number, number];
    timeOfDay: 'Morning' | 'Noon' | 'Sunset';
    weather: 'Sunny' | 'Dusty' | 'Golden Overcast';
    crowdDensity: number;
    fenceColor: number;
  };
  difficultyMultiplier: number;
  bullSpeedBonus: number;
  aiCompetitorCount: number;
  prize: {
    name: string;
    tamilName: string;
    icon: string;
    value: number;
    description: string;
  };
  ownerReward: {
    name: string;
    tamilName: string;
    icon: string;
    reputationBonus: number;
  };
}

export const TAMIL_VILLAGES: VillageEvent[] = [
  {
    id: 'avaniyapuram',
    name: 'Avaniyapuram',
    tamilName: 'அவனியாபுரம்',
    district: 'Madurai District',
    description: 'The traditional Pongal season opener. Narrow streets and high-energy crowd test early reflexes.',
    historicalSignificance: 'Kickstarts the legendary Pongal Jallikattu festival season on Thai Pongal day.',
    arenaTheme: {
      groundTint: 0xdeb887,
      skyColors: [0x8b3a2b, 0xf59e0b],
      timeOfDay: 'Morning',
      weather: 'Sunny',
      crowdDensity: 1.0,
      fenceColor: 0x8b4513,
    },
    difficultyMultiplier: 1.0,
    bullSpeedBonus: 0,
    aiCompetitorCount: 4,
    prize: {
      name: 'Brass & Silver Pot',
      tamilName: 'பித்தளை அண்டா',
      icon: '🏺',
      value: 500,
      description: 'Traditional heavy brass festival vessel gifted by the village elders.',
    },
    ownerReward: {
      name: 'Pattu Ponnada',
      tamilName: 'பட்டுப் பொன்னாடை',
      icon: '🧣',
      reputationBonus: 100,
    },
  },
  {
    id: 'palamedu',
    name: 'Palamedu',
    tamilName: 'பாலமேடு',
    district: 'Madurai District',
    description: 'Held near the Manjalaru river banks. Famous for swift, spirited bulls that excel in turning.',
    historicalSignificance: 'Celebrated on Mattu Pongal day, drawing the fiercest Kangayam and Pulikulam bulls.',
    arenaTheme: {
      groundTint: 0xd2b48c,
      skyColors: [0x78350f, 0xd97706],
      timeOfDay: 'Noon',
      weather: 'Dusty',
      crowdDensity: 1.25,
      fenceColor: 0x7c2d12,
    },
    difficultyMultiplier: 1.25,
    bullSpeedBonus: 15,
    aiCompetitorCount: 5,
    prize: {
      name: 'Hero Mountain Bicycle',
      tamilName: 'வீர சைக்கிள்',
      icon: '🚲',
      value: 1200,
      description: 'Prestigious sports cycle awarded for courage and precision grip.',
    },
    ownerReward: {
      name: 'Silver Horn Caps',
      tamilName: 'வெள்ளி கொம்புக் குப்பி',
      icon: '🥈',
      reputationBonus: 250,
    },
  },
  {
    id: 'alanganallur',
    name: 'Alanganallur',
    tamilName: 'அலங்காநல்லூர்',
    district: 'Madurai District',
    description: 'The world-famous cathedral of Jallikattu. Massive crowd gallery and veteran tamers.',
    historicalSignificance: 'Globally celebrated epicenter where only the most elite bulls and tamers compete.',
    arenaTheme: {
      groundTint: 0xc89b65,
      skyColors: [0x991b1b, 0xfbbf24],
      timeOfDay: 'Sunset',
      weather: 'Golden Overcast',
      crowdDensity: 1.6,
      fenceColor: 0x581c87,
    },
    difficultyMultiplier: 1.5,
    bullSpeedBonus: 25,
    aiCompetitorCount: 6,
    prize: {
      name: 'Gold Sovereign Coin',
      tamilName: 'தங்கக் காசு',
      icon: '🪙',
      value: 3000,
      description: 'Pure gold coin presented by temple dignitaries for the Best Tamer.',
    },
    ownerReward: {
      name: 'Golden Vaadivasal Shield',
      tamilName: 'வீரக் கேடயம்',
      icon: '🛡️',
      reputationBonus: 500,
    },
  },
  {
    id: 'siravayal',
    name: 'Siravayal',
    tamilName: 'சிராவயல்',
    district: 'Sivagangai District',
    description: 'Expansive open field Manju Virattu. Bulls charge across open terrain with lightning veering.',
    historicalSignificance: 'Centuries-old open arena tradition attracting hundreds of royal breed bulls.',
    arenaTheme: {
      groundTint: 0xbfa070,
      skyColors: [0xb45309, 0xfde047],
      timeOfDay: 'Morning',
      weather: 'Sunny',
      crowdDensity: 1.4,
      fenceColor: 0x9a3412,
    },
    difficultyMultiplier: 1.75,
    bullSpeedBonus: 35,
    aiCompetitorCount: 6,
    prize: {
      name: 'Smart LED TV',
      tamilName: 'தொலைக்காட்சிப் பெட்டி',
      icon: '📺',
      value: 5000,
      description: 'Modern grand prize awarded for multi-round domination.',
    },
    ownerReward: {
      name: 'Champion Cow Breed Award',
      tamilName: 'சிறந்த நாட்டு மாடு விருது',
      icon: '🏆',
      reputationBonus: 800,
    },
  },
  {
    id: 'championship',
    name: 'State Grand Championship',
    tamilName: 'மாபெரும் மாநில இறுதிப் போட்டி',
    district: 'Tamil Nadu Finals Arena',
    description: 'The pinnacle arena. The most powerful champion bulls and legendary tamers clash for eternal glory.',
    historicalSignificance: 'Crowns the undisputed Valorous Tamer and Champion Bull of Tamil Nadu.',
    arenaTheme: {
      groundTint: 0xbf8b53,
      skyColors: [0x450a0a, 0xf59e0b],
      timeOfDay: 'Sunset',
      weather: 'Golden Overcast',
      crowdDensity: 2.0,
      fenceColor: 0xb45309,
    },
    difficultyMultiplier: 2.1,
    bullSpeedBonus: 50,
    aiCompetitorCount: 6,
    prize: {
      name: 'Royal Motorcycle & Crown',
      tamilName: 'வீர மோட்டார் பைக்',
      icon: '🏍️',
      value: 12000,
      description: 'Supreme tournament grand prize and honorary title of Tamil Nadu Veera Tamizhan.',
    },
    ownerReward: {
      name: 'Grand State Kangayam Trophy',
      tamilName: 'மாநில சாம்பியன் கோப்பை',
      icon: '👑',
      reputationBonus: 1500,
    },
  },
];
