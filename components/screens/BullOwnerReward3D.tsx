import React, { useEffect } from 'react';
import { useGameStore } from '../../store/useGameStore';
import { soundManager } from '../../utils/soundSynthesizer';
import { BULL_TIERS } from '../three/BullGrowthTiers';
import confetti from 'canvas-confetti';
import { Trophy, Sparkles, ArrowRight, RotateCcw, Award, CheckCircle } from 'lucide-react';

export const BullOwnerReward3D: React.FC = () => {
  const {
    bullName,
    bullTier,
    bullStats,
    lastTrainingGain,
    setScreen,
    resetToArena,
  } = useGameStore();

  const tier = BULL_TIERS[bullTier] || BULL_TIERS.young;

  useEffect(() => {
    soundManager.playVictoryFanfare();
    confetti({
      particleCount: lastTrainingGain?.tierUp ? 220 : 120,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#F26A1B', '#FFA000', '#FFD700', '#00F5D4', '#38BDF8'],
    });
  }, [lastTrainingGain?.tierUp]);

  return (
    <div className="relative w-full h-full min-h-[520px] flex items-center justify-center p-4 md:p-6 bg-black/80 backdrop-blur-md overflow-hidden select-none">
      <div className={`relative w-full max-w-md rounded-3xl border-2 ${tier.borderColor} bg-gradient-to-b from-[#2a1710] via-[#1a0f0a] to-[#120B09] p-6 text-center shadow-2xl space-y-4`}>
        <div className="absolute inset-0 kolam-pattern pointer-events-none opacity-20" />

        <div className="relative z-10 space-y-3">
          {/* Trophy / Star Icon */}
          <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-tr from-tamil-saffron to-amber-400 p-0.5 shadow-2xl flex items-center justify-center">
            <div className="w-full h-full rounded-full bg-[#1a0f0a] flex items-center justify-center text-3xl animate-bounce">
              {lastTrainingGain?.tierUp ? '🌟' : '💪'}
            </div>
          </div>

          <div>
            <span className={`px-3 py-0.5 rounded-full ${tier.badgeBg} ${tier.badgeTextColor} text-[10px] font-black uppercase tracking-wider border border-white/10`}>
              {lastTrainingGain?.tierUp ? 'GROWTH TIER UPGRADE!' : 'TRAINING COMPLETE'}
            </span>
            <h2 className="text-2xl md:text-3xl font-black text-white font-display mt-1">
              {lastTrainingGain?.tierUp
                ? `பருவம் உயர்ந்தது: ${tier.englishTitle}!`
                : 'பயிற்சி நிறைவடைந்தது!'}
            </h2>
            <p className="text-xs text-gray-300 mt-0.5">
              {lastTrainingGain?.title || 'Daily paddock training accomplished!'}
            </p>
          </div>

          {/* Stat Gain Card */}
          <div className="p-3.5 rounded-2xl bg-black/60 border border-white/10 space-y-2 text-left">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-300">Bull Name</span>
              <span className="text-xs font-black text-amber-300">{bullName}</span>
            </div>

            {lastTrainingGain && (
              <div className="p-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-300 uppercase">
                  +{lastTrainingGain.amount} {lastTrainingGain.statName.toUpperCase()}
                </span>
                <CheckCircle className="w-4 h-4 text-emerald-400" />
              </div>
            )}

            {/* Quick Stat Summary */}
            <div className="grid grid-cols-2 gap-2 pt-1 text-[11px] font-bold">
              <div className="p-1.5 rounded-lg bg-zinc-900 border border-white/5 flex justify-between">
                <span className="text-gray-400">Speed:</span>
                <span className="text-cyan-300">{bullStats.speed}</span>
              </div>
              <div className="p-1.5 rounded-lg bg-zinc-900 border border-white/5 flex justify-between">
                <span className="text-gray-400">Stamina:</span>
                <span className="text-emerald-300">{bullStats.stamina}</span>
              </div>
              <div className="p-1.5 rounded-lg bg-zinc-900 border border-white/5 flex justify-between">
                <span className="text-gray-400">Strength:</span>
                <span className="text-amber-300">{bullStats.strength}</span>
              </div>
              <div className="p-1.5 rounded-lg bg-zinc-900 border border-white/5 flex justify-between">
                <span className="text-gray-400">Reflex:</span>
                <span className="text-rose-300">{bullStats.temperament}</span>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="pt-2 flex flex-col sm:flex-row gap-2">
            <button
              onClick={() => {
                soundManager.playThavilSnap(0.8);
                setScreen('bull_care');
              }}
              className="flex-1 py-3 rounded-xl bg-gradient-to-r from-amber-400 via-tamil-marigold to-tamil-saffron text-black font-black text-xs md:text-sm shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center space-x-1.5"
            >
              <RotateCcw className="w-4 h-4" />
              <span>CONTINUE TRAINING</span>
            </button>

            <button
              onClick={() => {
                soundManager.playThavilSnap(0.8);
                resetToArena();
              }}
              className="py-3 px-4 rounded-xl bg-black/60 border border-amber-400/40 text-xs font-bold text-amber-300 hover:text-white"
            >
              ENTER ARENA ➔
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
