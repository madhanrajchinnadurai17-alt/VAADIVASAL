export type BullTier = 'young' | 'trained' | 'mature' | 'championship';

export interface TierConfig {
  tier: BullTier;
  tamilName: string;
  englishTitle: string;
  minCumulativeStats: number;
  scale: number;
  humpScale: number;
  hornScale: number;
  borderColor: string;
  badgeBg: string;
  badgeTextColor: string;
  description: string;
}

export const BULL_TIERS: Record<BullTier, TierConfig> = {
  young: {
    tier: 'young',
    tamilName: 'இளம் காளை',
    englishTitle: 'Young Bull',
    minCumulativeStats: 0,
    scale: 0.8,
    humpScale: 0.42,
    hornScale: 0.7,
    borderColor: 'border-amber-700/60',
    badgeBg: 'bg-amber-900/40',
    badgeTextColor: 'text-amber-400',
    description: 'Energetic calf building baseline strength and trust in the village paddock.',
  },
  trained: {
    tier: 'trained',
    tamilName: 'பயிற்சி பெற்ற காளை',
    englishTitle: 'Trained Bull',
    minCumulativeStats: 180,
    scale: 1.0,
    humpScale: 0.55,
    hornScale: 1.0,
    borderColor: 'border-slate-300/80',
    badgeBg: 'bg-slate-700/40',
    badgeTextColor: 'text-slate-200',
    description: 'Disciplined athlete with developed leg muscles and pond water endurance.',
  },
  mature: {
    tier: 'mature',
    tamilName: 'திமில் காளை',
    englishTitle: 'Mature Bull',
    minCumulativeStats: 260,
    scale: 1.2,
    humpScale: 0.72,
    hornScale: 1.35,
    borderColor: 'border-amber-400',
    badgeBg: 'bg-amber-500/20',
    badgeTextColor: 'text-amber-300',
    description: 'Formidable arena bull with prominent hump and razor-sharp turning reflexes.',
  },
  championship: {
    tier: 'championship',
    tamilName: 'வீரக் காளை சாம்பியன்',
    englishTitle: 'Championship Kangayam',
    minCumulativeStats: 340,
    scale: 1.4,
    humpScale: 0.9,
    hornScale: 1.65,
    borderColor: 'border-cyan-400 ring-2 ring-cyan-400/50 shadow-cyan-500/50',
    badgeBg: 'bg-cyan-500/30',
    badgeTextColor: 'text-cyan-300',
    description: 'Legendary festival bull. Feared by tamers across all Tamil Nadu arenas.',
  },
};

export function getTierForStats(totalStats: number): BullTier {
  if (totalStats >= BULL_TIERS.championship.minCumulativeStats) return 'championship';
  if (totalStats >= BULL_TIERS.mature.minCumulativeStats) return 'mature';
  if (totalStats >= BULL_TIERS.trained.minCumulativeStats) return 'trained';
  return 'young';
}
