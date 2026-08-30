import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, RotateCcw, Zap, Timer, Flame, Award, HeartHandshake } from 'lucide-react';
import { GameResultData } from '../game/scenes/TamingScene';
import { soundManager } from '../utils/soundSynthesizer';

interface ResultModalProps {
  result: GameResultData;
  onPlayAgain: () => void;
}

export const ResultModal: React.FC<ResultModalProps> = ({ result, onPlayAgain }) => {
  useEffect(() => {
    if (result.success) {
      // Fire celebratory festival confetti bursts
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

        <div className="relative z-10 space-y-5">
          {/* Status Icon */}
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-tr from-tamil-saffron to-tamil-gold text-black shadow-lg">
            {result.success ? (
              <Trophy className="h-9 w-9 text-amber-950 animate-bounce" />
            ) : (
              <HeartHandshake className="h-9 w-9 text-amber-950" />
            )}
          </div>

          {/* Heading */}
          <div>
            <span className="inline-block rounded-full bg-tamil-saffron/20 px-3 py-0.5 text-xs font-bold text-tamil-gold uppercase border border-tamil-saffron/30">
              {result.success ? 'வீர சாதனை • Glorious Feat' : 'மரியாதைக்குரிய போட்டி • Respectful Contender'}
            </span>
            <h2 className="mt-1 text-2xl md:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-tamil-marigold to-tamil-saffron font-display">
              {result.success ? 'வெற்றித் தழுவல்! SUCCESSFUL TAME!' : 'காளை தப்பியது • The Bull Escaped'}
            </h2>
            <p className="text-xs md:text-sm text-tamil-sand/80 mt-1">
              {result.success
                ? 'You held the hump with agility and honor without causing harm!'
                : 'The mighty Kangayam bull showed supreme speed today. Try again next round!'}
            </p>
          </div>

          {/* Honorary Title & Bull Personality Badge */}
          <div className="rounded-xl border border-tamil-gold/30 bg-black/50 p-3 space-y-1">
            <div className="text-[11px] font-semibold text-tamil-sand/70 uppercase tracking-widest flex items-center justify-center gap-1">
              <Award className="w-3.5 h-3.5 text-tamil-gold" />
              <span>Conferred Honor</span>
            </div>
            <div className="text-base font-bold text-tamil-gold font-tamil">
              {result.title}
            </div>
            {result.bullPersonality && (
              <div className="text-xs text-amber-300 font-semibold pt-1 border-t border-white/10">
                Opponent: <span className="text-white">{result.bullPersonality}</span>
              </div>
            )}
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-2.5 text-left">
            <div className="rounded-lg border border-tamil-saffron/20 bg-[#2b1710]/70 p-2.5">
              <div className="flex items-center text-tamil-gold text-[11px] font-semibold gap-1">
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                <span>Score</span>
              </div>
              <div className="text-lg font-black text-white mt-1">{result.score}</div>
              <div className="text-[10px] text-tamil-sand/60">Valour Points</div>
            </div>

            <div className="rounded-lg border border-tamil-saffron/20 bg-[#2b1710]/70 p-2.5">
              <div className="flex items-center text-tamil-gold text-[11px] font-semibold gap-1">
                <Timer className="w-3.5 h-3.5 text-emerald-400" />
                <span>Reaction</span>
              </div>
              <div className="text-lg font-black text-white mt-1">{result.avgReactionTimeMs}ms</div>
              <div className="text-[10px] text-tamil-sand/60">Avg Timing</div>
            </div>

            <div className="rounded-lg border border-tamil-saffron/20 bg-[#2b1710]/70 p-2.5">
              <div className="flex items-center text-tamil-gold text-[11px] font-semibold gap-1">
                <Zap className="w-3.5 h-3.5 text-cyan-400" />
                <span>Grips Locked</span>
              </div>
              <div className="text-lg font-black text-white mt-1">{result.gripsAchieved}/4</div>
              <div className="text-[10px] text-tamil-sand/60">Attempt #{result.attemptsUsed}</div>
            </div>
          </div>

          {/* Play Again Button */}
          <div className="pt-2">
            <button
              onClick={() => {
                soundManager.playThavilBass(0.9);
                onPlayAgain();
              }}
              className="w-full flex items-center justify-center space-x-2 rounded-xl bg-gradient-to-r from-amber-400 via-tamil-marigold to-tamil-saffron px-6 py-3.5 text-sm md:text-base font-black text-black shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all border border-amber-200"
            >
              <RotateCcw className="h-4 w-4 text-black" />
              <span>மீண்டும் விளையாடுக • PLAY AGAIN</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
