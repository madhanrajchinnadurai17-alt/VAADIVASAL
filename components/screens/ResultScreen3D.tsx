import React, { useEffect } from 'react';
import { useGameStore } from '../../store/useGameStore';
import { soundManager } from '../../utils/soundSynthesizer';
import confetti from 'canvas-confetti';
import { Trophy, RotateCcw, Award, ArrowRight } from 'lucide-react';

export const ResultScreen3D: React.FC = () => {
  const { isTameSuccess, score, resetToArena, setScreen } = useGameStore();

  useEffect(() => {
    if (isTameSuccess) {
      soundManager.stopFestiveDrums();
      soundManager.playVictoryFanfare();
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#F26A1B', '#FFA000', '#FFD700', '#00F5D4'],
      });
    } else {
      soundManager.stopFestiveDrums();
      soundManager.playBullSnort();
    }
  }, [isTameSuccess]);

  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-md rounded-3xl border-2 border-amber-400/80 bg-gradient-to-b from-[#2a1710] via-[#1a0f0a] to-[#120B09] p-6 text-center shadow-2xl space-y-4">
        <div className="absolute inset-0 kolam-pattern pointer-events-none opacity-20" />

        <div className="relative z-10 space-y-3">
          {/* Trophy Icon */}
          <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-tr from-tamil-saffron to-amber-400 p-0.5 shadow-2xl flex items-center justify-center">
            <div className="w-full h-full rounded-full bg-[#1a0f0a] flex items-center justify-center text-3xl">
              {isTameSuccess ? '🏆' : '🐂'}
            </div>
          </div>

          <div>
            <span className="px-3 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[10px] font-bold uppercase tracking-wider border border-amber-400/40">
              {isTameSuccess ? 'ROUND COMPLETE • வெற்றி' : 'TIME ELAPSED • முயற்சி'}
            </span>
            <h2 className="text-2xl md:text-3xl font-black text-white font-display mt-1">
              {isTameSuccess ? 'வெற்றி வீரர் #07!' : 'காளை தப்பியது!'}
            </h2>
            <p className="text-xs text-gray-300 mt-0.5">
              {isTameSuccess
                ? 'Embraced the hump with skill, agility, and balance for 10 seconds!'
                : 'The bull showed superior agility and escaped untouched!'}
            </p>
          </div>

          {/* Score & Participant Card */}
          <div className="p-3 rounded-2xl bg-black/60 border border-white/10 flex items-center justify-between text-left">
            <div>
              <div className="text-[10px] text-gray-400 font-bold uppercase">Participant</div>
              <div className="text-sm font-black text-amber-300">06 YOU #07</div>
            </div>
            <div className="text-right">
              <div className="text-[10px] text-gray-400 font-bold uppercase">Final Score</div>
              <div className="text-base font-black text-white">{score} PTS</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row gap-2">
            <button
              onClick={resetToArena}
              className="flex-1 py-3 rounded-xl bg-gradient-to-r from-amber-400 via-tamil-marigold to-tamil-saffron text-black font-black text-xs md:text-sm shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center space-x-1.5"
            >
              <RotateCcw className="w-4 h-4" />
              <span>மீண்டும் ஆடுக • PLAY AGAIN</span>
            </button>

            <button
              onClick={() => setScreen('main_menu')}
              className="py-3 px-4 rounded-xl bg-black/60 border border-white/20 text-xs font-bold text-gray-300 hover:text-white"
            >
              Main Menu
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
