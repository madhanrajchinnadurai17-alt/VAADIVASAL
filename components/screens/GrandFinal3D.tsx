import React, { useEffect } from 'react';
import { useGameStore } from '../../store/useGameStore';
import { soundManager } from '../../utils/soundSynthesizer';
import confetti from 'canvas-confetti';
import { Trophy, Crown, Sparkles, MapPin, RotateCcw, ArrowRight } from 'lucide-react';

export const GrandFinal3D: React.FC = () => {
  const { score, setScreen, resetToArena } = useGameStore();

  useEffect(() => {
    soundManager.stopFestiveDrums();
    soundManager.playVictoryFanfare();

    const fireConfetti = () => {
      confetti({
        particleCount: 250,
        spread: 100,
        origin: { y: 0.5 },
        colors: ['#FFD700', '#FFA000', '#F26A1B', '#00F5D4', '#FFFFFF'],
      });
    };

    fireConfetti();
    const timer = setTimeout(fireConfetti, 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md select-none overflow-hidden">
      <div className="relative w-full max-w-lg rounded-3xl border-2 border-amber-400 bg-gradient-to-b from-[#2d1808] via-[#1a0f0a] to-[#120B09] p-6 text-center shadow-2xl space-y-4">
        <div className="absolute inset-0 kolam-pattern pointer-events-none opacity-20" />

        <div className="relative z-10 space-y-3">
          {/* Crown & Trophy Badge */}
          <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-amber-400 via-yellow-300 to-tamil-saffron p-0.5 shadow-2xl flex items-center justify-center animate-bounce">
            <div className="w-full h-full rounded-[22px] bg-[#1a0f0a] flex items-center justify-center text-4xl">
              👑
            </div>
          </div>

          <div>
            <span className="px-4 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-black uppercase tracking-widest border border-amber-400/50">
              TAMIL NADU STATE GRAND CHAMPIONSHIP
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-tamil-saffron font-display mt-2">
              மாநில இறுதிப் போட்டி வெற்றி!
            </h2>
            <p className="text-xs text-gray-200 mt-1">
              You conquered all 5 iconic festival arenas across Tamil Nadu as Participant #07!
            </p>
          </div>

          {/* Grand Prize Card (Royal Motorcycle) */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/20 to-yellow-500/10 border-2 border-amber-400 flex items-center justify-between text-left shadow-xl">
            <div className="flex items-center space-x-3.5">
              <span className="text-4xl">🏍️</span>
              <div>
                <div className="text-[10px] uppercase font-bold text-amber-300 tracking-wider">
                  Supreme Festival Grand Prize
                </div>
                <div className="text-base font-black text-white">Royal Sports Motorcycle & Gold Crown</div>
                <div className="text-xs text-amber-300 font-tamil">வீர மோட்டார் பைக் & தங்க கிரீடம்</div>
              </div>
            </div>
          </div>

          {/* Score Card */}
          <div className="p-3 rounded-2xl bg-black/60 border border-white/10 flex items-center justify-between text-xs">
            <span className="text-gray-400 font-bold">Championship Score:</span>
            <span className="text-base font-black text-amber-300 font-mono">{score} PTS</span>
          </div>

          {/* Action CTAs */}
          <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
            <button
              onClick={() => {
                soundManager.playThavilSnap(0.8);
                setScreen('world_map');
              }}
              className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-tamil-marigold to-tamil-saffron text-black font-black text-xs md:text-sm shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center space-x-2 border border-amber-200"
            >
              <MapPin className="w-4 h-4" />
              <span>VIEW WORLD MAP (உலக வரைபடம்)</span>
            </button>

            <button
              onClick={() => {
                soundManager.playThavilSnap(0.8);
                resetToArena();
              }}
              className="py-3.5 px-5 rounded-2xl bg-black/60 hover:bg-black border border-white/20 text-xs font-bold text-gray-300 hover:text-white transition-all"
            >
              Play Arena Again
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
