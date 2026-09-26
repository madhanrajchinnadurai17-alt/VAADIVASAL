import React, { useEffect } from 'react';
import { useGameStore } from '../../store/useGameStore';
import { soundManager } from '../../utils/soundSynthesizer';
import confetti from 'canvas-confetti';
import { Trophy, RotateCcw, Award, ArrowRight } from 'lucide-react';

export const ResultScreen3D: React.FC = () => {
  const { isTameSuccess, score, resetToArena, setScreen } = useGameStore();

  useEffect(() => {
    soundManager.stopFestiveDrums();
    if (isTameSuccess) {
      soundManager.playVictoryFanfare();
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#F26A1B', '#FFA000', '#FFD700', '#00F5D4'],
      });
    } else {
      // Celebrating the Bull's victory with crowd roar & flower petals
      soundManager.playKombuHorn();
      soundManager.playCrowdCheer(2.5);
      confetti({
        particleCount: 120,
        spread: 75,
        origin: { y: 0.6 },
        colors: ['#ea580c', '#eab308', '#22c55e', '#ffffff'],
      });
    }
  }, [isTameSuccess]);

  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-md rounded-3xl border-2 border-amber-400/80 bg-gradient-to-b from-[#2a1710] via-[#1a0f0a] to-[#120B09] p-6 text-center shadow-2xl space-y-4">
        <div className="absolute inset-0 kolam-pattern pointer-events-none opacity-20" />

        <div className="relative z-10 space-y-3">
          {/* Honor Crest Icon */}
          <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-tr from-tamil-saffron to-amber-400 p-0.5 shadow-2xl flex items-center justify-center">
            <div className="w-full h-full rounded-full bg-[#1a0f0a] flex items-center justify-center text-3xl">
              {isTameSuccess ? '🏆' : '🐂'}
            </div>
          </div>

          <div>
            <span className="px-3 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[10px] font-bold uppercase tracking-wider border border-amber-400/40 font-serif">
              {isTameSuccess ? 'வீரத் தழுவல் • TAMER HONORED' : 'காளை வெற்றி • BULL CHAMPION CELEBRATED'}
            </span>
            <h2 className="text-xl md:text-2xl font-black text-white font-serif mt-1">
              {isTameSuccess ? 'வெற்றி வீரர் #07!' : 'ஏறு வீரன் • காளை வெற்றி!'}
            </h2>
            <p className="text-xs text-amber-100/90 font-serif mt-1 leading-relaxed">
              {isTameSuccess
                ? 'Tamer #07 skillfully embraced the sacred Thimil (hump) with poise, balance, and respect for 10 seconds!'
                : 'The native Kangayam bull demonstrated majestic speed and power, crossing the arena untouched! The crowd erupts in celebration of the champion bull.'}
            </p>
          </div>

          {/* Cultural Respect Quote */}
          <div className="px-3 py-2 rounded-xl bg-amber-950/40 border border-amber-500/30 text-[11px] text-amber-300/90 font-serif italic text-center">
            &quot;In Tamil tradition, the bull is never defeated — only embraced in courage or celebrated in untamed glory.&quot;
          </div>

          {/* Score & Honor Stats Card */}
          <div className="p-3 rounded-2xl bg-black/60 border border-white/10 flex items-center justify-between text-left">
            <div>
              <div className="text-[10px] text-gray-400 font-bold uppercase">Heritage Event</div>
              <div className="text-xs font-black text-amber-300 font-serif">
                {isTameSuccess ? 'Thimil Embrace Verified' : 'Bull Untamed Champion'}
              </div>
            </div>
            <div className="text-right">
              <div className="text-[10px] text-gray-400 font-bold uppercase">Festival Honor</div>
              <div className="text-sm font-black text-white font-mono">{score} PTS</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row gap-2">
            <button
              onClick={resetToArena}
              className="flex-1 py-3 rounded-xl bg-gradient-to-r from-amber-400 via-tamil-marigold to-tamil-saffron text-black font-black text-xs md:text-sm shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center space-x-1.5 font-serif"
            >
              <RotateCcw className="w-4 h-4" />
              <span>மீண்டும் ஆடுக • PLAY AGAIN</span>
            </button>

            <button
              onClick={() => setScreen('main_menu')}
              className="py-3 px-4 rounded-xl bg-black/60 border border-white/20 text-xs font-bold text-gray-300 hover:text-white font-serif"
            >
              Main Menu
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
