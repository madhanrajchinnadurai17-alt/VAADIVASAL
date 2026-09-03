import React, { useEffect } from 'react';
import { useGameStore } from '../../store/useGameStore';
import { soundManager } from '../../utils/soundSynthesizer';
import confetti from 'canvas-confetti';
import { Trophy, Sparkles, ArrowRight, Award, Crown } from 'lucide-react';

export const VictoryCelebration3D: React.FC = () => {
  const { setScreen, teamName } = useGameStore();

  useEffect(() => {
    soundManager.startFestiveDrums(140);
    soundManager.playKombuHorn();
    soundManager.playCrowdCheer(5);

    const fireInterval = setInterval(() => {
      confetti({
        particleCount: 80,
        spread: 100,
        origin: { y: 0.6 },
        colors: ['#FFD700', '#FFA000', '#F26A1B', '#00F5D4', '#FFFFFF'],
      });
    }, 900);

    return () => clearInterval(fireInterval);
  }, []);

  return (
    <div className="relative w-full h-full min-h-[520px] flex items-center justify-center p-4 md:p-6 bg-black/90 backdrop-blur-md overflow-hidden select-none">
      <div className="relative w-full max-w-lg rounded-3xl border-2 border-amber-400 bg-gradient-to-b from-[#2e170c] via-[#1a0f0a] to-[#120B09] p-6 text-center shadow-2xl space-y-4">
        <div className="absolute inset-0 kolam-pattern pointer-events-none opacity-20" />

        <div className="relative z-10 space-y-3">
          {/* Top Banner */}
          <div>
            <span className="px-4 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-black uppercase tracking-widest border border-amber-400/50">
              THE VICTORY CELEBRATION • வெற்றிப் பெருவிழா
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-tamil-saffron font-display mt-2">
              வாகை சூடிய வீரர்!
            </h2>
          </div>

          {/* Crowd-Hoist Visual Composition Graphic */}
          <div className="bg-black/60 border-2 border-amber-500/40 rounded-2xl p-5 shadow-2xl space-y-3">
            {/* Visual Icons representing crowd hoisting player on shoulders + trophy */}
            <div className="relative flex justify-center items-end gap-2 h-28">
              {/* Drummers & Horn Players */}
              <div className="text-3xl animate-bounce">🥁</div>
              <div className="text-3xl">🎺</div>

              {/* Player Hoisted Overhead with Trophy */}
              <div className="flex flex-col items-center -translate-y-4 animate-pulse">
                <span className="text-4xl">🏆</span>
                <span className="text-4xl">🏃‍♂️</span>
                <div className="flex text-2xl -mt-2">
                  <span>🙌</span>
                  <span>🙌</span>
                  <span>🙌</span>
                </div>
              </div>

              {/* Decorated Championship Bull */}
              <div className="text-4xl animate-bounce">🐂</div>
              <div className="text-3xl">🪔</div>
            </div>

            <div className="p-2.5 rounded-xl bg-amber-500/20 border border-amber-400/50 text-xs font-black text-amber-300 uppercase tracking-wider">
              CHAMPIONSHIP SECURED! JOURNEY ACCOMPLISHED!
            </div>
            <p className="text-xs text-gray-200">
              The entire village roars with festive pride as Participant #07 and Team {teamName} receive the sacred victory garland!
            </p>
          </div>

          {/* Bottom Action CTA */}
          <div className="pt-2">
            <button
              onClick={() => {
                soundManager.playThavilSnap(0.8);
                setScreen('epilogue');
              }}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-400 via-tamil-marigold to-tamil-saffron text-black font-black text-sm shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center space-x-2 border border-amber-200"
            >
              <span>CONTINUE TO EPILOGUE (நிறைவுப் பகுதி)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
