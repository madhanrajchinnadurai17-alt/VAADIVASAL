import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, RotateCcw, Zap, Timer, Flame, Award, HeartHandshake, MapPin } from 'lucide-react';
import { GameResultData } from '../game/scenes/TamingScene';
import { soundManager } from '../utils/soundSynthesizer';

interface ResultModalProps {
  result: GameResultData;
  onPlayAgain: () => void;
  onOpenVillageMap?: () => void;
}

export const ResultModal: React.FC<ResultModalProps> = ({ result, onPlayAgain, onOpenVillageMap }) => {
  useEffect(() => {
    if (result.success) {
      const count = 200;
      const defaults = { origin: { y: 0.7 } };

      const fire = (particleRatio: number, opts: confetti.Options) => {
        confetti({
          ...defaults,
          ...opts,
          particleCount: Math.floor(count * particleRatio),
          colors: ['#F26A1B', '#FFA000', '#FFD700', '#00F5D4', '#FFFFFF'],
        });
      };

      fire(0.25, { spread: 26, startVelocity: 55 });
      fire(0.2, { spread: 60 });
      fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
      fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
      fire(0.1, { spread: 120, startVelocity: 45 });
    }
  }, [result.success]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border-2 border-tamil-saffron/50 bg-gradient-to-b from-[#25150f] via-[#1a0f0a] to-[#120B09] p-6 text-center shadow-2xl festival-glow">
        <div className="absolute inset-0 kolam-pattern pointer-events-none opacity-20" />

        <div className="relative z-10 space-y-4">
          {/* Status Icon */}
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-tr from-tamil-saffron to-tamil-gold text-black shadow-lg">
            {result.success ? (
              <Trophy className="h-8 w-8 text-amber-950 animate-bounce" />
            ) : (
              <HeartHandshake className="h-8 w-8 text-amber-950" />
            )}
          </div>

          {/* Heading */}
          <div>
            <span className="inline-block rounded-full bg-tamil-saffron/20 px-3 py-0.5 text-xs font-bold text-tamil-gold uppercase border border-tamil-saffron/30">
              {result.villageTamilName} • {result.villageName}
            </span>
            <h2 className="mt-1 text-2xl md:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-tamil-marigold to-tamil-saffron font-display">
              {result.success ? 'வெற்றித் தழுவல்! WINNER #07!' : 'காளை தப்பியது • ESCAPE CHAMPION'}
            </h2>
            <p className="text-xs text-tamil-sand/80 mt-1">
              {result.success
                ? 'Held the hump with balance and agility! Festival Grand Prize Awarded!'
                : 'The bull showed superior stamina and escaped untouched! Bull Owner rewarded!'}
            </p>
          </div>

          {/* Won Prize Showcase Card */}
          {result.success && result.wonPrize && (
            <div className="p-3 rounded-xl bg-gradient-to-r from-amber-500/20 to-yellow-500/10 border-2 border-amber-400 flex items-center justify-between text-left">
              <div className="flex items-center space-x-3">
                <span className="text-3xl">{result.wonPrize.icon}</span>
                <div>
                  <div className="text-[10px] text-amber-300 uppercase font-bold tracking-wider">Tournament Grand Prize</div>
                  <div className="text-sm font-black text-white">{result.wonPrize.name}</div>
                  <div className="text-xs text-tamil-gold font-tamil">{result.wonPrize.tamilName}</div>
                </div>
              </div>
              <div className="text-right">
                <span className="px-2 py-1 rounded bg-black/60 text-xs font-bold text-amber-300 border border-amber-400/40">
                  +🪙 {result.wonPrize.value / 10} Coins
                </span>
              </div>
            </div>
          )}

          {/* Owner Escape Reward Card */}
          {!result.success && result.ownerReward && (
            <div className="p-3 rounded-xl bg-gradient-to-r from-purple-500/20 to-indigo-500/10 border-2 border-purple-400 flex items-center justify-between text-left">
              <div className="flex items-center space-x-3">
                <span className="text-3xl">{result.ownerReward.icon}</span>
                <div>
                  <div className="text-[10px] text-purple-300 uppercase font-bold tracking-wider">Bull Owner Escape Honor</div>
                  <div className="text-sm font-black text-white">{result.ownerReward.name}</div>
                  <div className="text-xs text-purple-200 font-tamil">{result.ownerReward.tamilName}</div>
                </div>
              </div>
              <div className="text-right">
                <span className="px-2 py-1 rounded bg-black/60 text-xs font-bold text-purple-300 border border-purple-400/40">
                  +{result.ownerReward.reputationBonus} Rep
                </span>
              </div>
            </div>
          )}

          {/* Honorary Title Badge */}
          <div className="rounded-xl border border-tamil-gold/30 bg-black/50 p-2.5 space-y-0.5">
            <div className="text-[10px] font-semibold text-tamil-sand/70 uppercase tracking-widest flex items-center justify-center gap-1">
              <Award className="w-3.5 h-3.5 text-tamil-gold" />
              <span>Conferred Honor</span>
            </div>
            <div className="text-sm font-bold text-tamil-gold font-tamil">
              {result.title}
            </div>
            {result.bullPersonality && (
              <div className="text-[11px] text-amber-300 font-semibold pt-0.5 border-t border-white/10">
                Opponent: <span className="text-white">{result.bullPersonality}</span>
              </div>
            )}
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-2 text-left">
            <div className="rounded-lg border border-tamil-saffron/20 bg-[#2b1710]/70 p-2">
              <div className="flex items-center text-tamil-gold text-[10px] font-semibold gap-1">
                <Flame className="w-3 h-3 text-amber-400" />
                <span>Score</span>
              </div>
              <div className="text-base font-black text-white mt-0.5">{result.score}</div>
            </div>

            <div className="rounded-lg border border-tamil-saffron/20 bg-[#2b1710]/70 p-2">
              <div className="flex items-center text-tamil-gold text-[10px] font-semibold gap-1">
                <Timer className="w-3 h-3 text-emerald-400" />
                <span>Reaction</span>
              </div>
              <div className="text-base font-black text-white mt-0.5">{result.avgReactionTimeMs}ms</div>
            </div>

            <div className="rounded-lg border border-tamil-saffron/20 bg-[#2b1710]/70 p-2">
              <div className="flex items-center text-tamil-gold text-[10px] font-semibold gap-1">
                <Zap className="w-3 h-3 text-cyan-400" />
                <span>Grips Locked</span>
              </div>
              <div className="text-base font-black text-white mt-0.5">{result.gripsAchieved}</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row gap-2">
            <button
              onClick={() => {
                soundManager.playThavilBass(0.9);
                onPlayAgain();
              }}
              className="flex-1 flex items-center justify-center space-x-2 rounded-xl bg-gradient-to-r from-amber-400 via-tamil-marigold to-tamil-saffron px-4 py-3 text-xs md:text-sm font-black text-black shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all border border-amber-200"
            >
              <RotateCcw className="h-4 w-4 text-black" />
              <span>மீண்டும் ஆடுக • PLAY AGAIN</span>
            </button>

            {onOpenVillageMap && (
              <button
                onClick={onOpenVillageMap}
                className="flex items-center justify-center space-x-1.5 px-4 py-3 rounded-xl bg-black/60 hover:bg-tamil-saffron/20 text-tamil-gold border border-tamil-saffron/40 text-xs md:text-sm font-bold transition-all"
              >
                <MapPin className="w-4 h-4" />
                <span>Village Map</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
