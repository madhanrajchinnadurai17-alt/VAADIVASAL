import React, { useState, useEffect } from 'react';
import { useGameStore } from '../../store/useGameStore';
import { soundManager } from '../../utils/soundSynthesizer';
import { Sparkles, ArrowRight } from 'lucide-react';

export const LoadingScreen3D: React.FC = () => {
  const { setScreen } = useGameStore();
  const [progress, setProgress] = useState(0);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsReady(true);
          return 100;
        }
        return prev + 12;
      });
    }, 120);

    return () => clearInterval(interval);
  }, []);

  const handleStart = () => {
    soundManager.startFestiveDrums(120);
    soundManager.playKombuHorn();
    setScreen('main_menu');
  };

  return (
    <div className="relative w-full h-full min-h-[500px] flex flex-col items-center justify-center p-6 bg-gradient-to-b from-[#2D1B16] via-[#1a0f0a] to-[#120B09] text-center overflow-hidden">
      <div className="absolute inset-0 kolam-pattern pointer-events-none opacity-20" />

      <div className="relative z-10 max-w-md w-full space-y-6">
        {/* Logo / Icon */}
        <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-tamil-saffron to-amber-400 p-0.5 shadow-2xl flex items-center justify-center">
          <div className="w-full h-full rounded-[22px] bg-[#1a0f0a] flex items-center justify-center text-4xl">
            🐂
          </div>
        </div>

        {/* Title */}
        <div className="space-y-1">
          <p className="text-amber-400 text-xs font-bold uppercase tracking-widest">
            3D TAMIL HERITAGE SIMULATION
          </p>
          <h1 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-tamil-saffron font-display">
            வாடிவாசல்
          </h1>
          <h2 className="text-sm font-extrabold text-gray-300 tracking-wider">
            VAADIVASAL 3D: THE BULL&apos;S JOURNEY
          </h2>
        </div>

        {/* Progress Bar or Start Button */}
        {!isReady ? (
          <div className="space-y-2 pt-4">
            <div className="w-full h-3 bg-black/60 rounded-full overflow-hidden border border-white/10 p-0.5">
              <div
                className="h-full bg-gradient-to-r from-tamil-saffron to-amber-400 rounded-full transition-all duration-150"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs text-amber-200/70 font-mono">
              Loading 3D Arena Assets... {progress}%
            </p>
          </div>
        ) : (
          <div className="pt-4">
            <button
              onClick={handleStart}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-400 via-tamil-marigold to-tamil-saffron text-black font-black text-sm md:text-base shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center space-x-2 border border-amber-200"
            >
              <Sparkles className="w-5 h-5" />
              <span>உள்ளே நுழைக • ENTER GAME</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
