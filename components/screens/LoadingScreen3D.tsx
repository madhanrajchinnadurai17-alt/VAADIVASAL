import React, { useEffect, useState } from 'react';
import { useGameStore } from '../../store/useGameStore';
import { soundManager } from '../../utils/soundSynthesizer';
import { Trophy, Heart, Sparkles } from 'lucide-react';

export const LoadingScreen3D: React.FC = () => {
  const [progress, setProgress] = useState(15);
  const { setScreen, currentReputation, careStats } = useGameStore();

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setScreen('main_menu');
          }, 400);
          return 100;
        }
        return prev + 6;
      });
    }, 90);

    return () => clearInterval(interval);
  }, [setScreen]);

  return (
    <div className="relative w-full h-full min-h-[500px] flex flex-col justify-between p-6 bg-gradient-to-b from-[#2D1B16] via-[#1a0f0a] to-[#120B09] text-white overflow-hidden select-none">
      <div className="absolute inset-0 kolam-pattern pointer-events-none opacity-20" />

      {/* Top Header with Persistent Player Stats */}
      <div className="relative z-10 flex justify-between items-center border-b border-white/10 pb-3">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-tamil-saffron animate-pulse" />
          <span className="text-xs font-bold text-amber-300 uppercase tracking-widest font-display">
            ஜல்லிக்கட்டு • VAADIVASAL 3D
          </span>
        </div>

        {/* Persistent Meta Stats */}
        <div className="flex items-center space-x-3 text-xs bg-black/60 px-3 py-1.5 rounded-full border border-white/10">
          <span className="flex items-center gap-1 font-bold text-amber-400">
            <Trophy className="w-3.5 h-3.5" />
            <span>Reputation: {currentReputation}</span>
          </span>
          <span className="text-gray-500">|</span>
          <span className="flex items-center gap-1 font-bold text-emerald-400">
            <Heart className="w-3.5 h-3.5" />
            <span>Bull Care: {Math.round((careStats.hunger + careStats.hydration + careStats.health) / 3)}%</span>
          </span>
        </div>
      </div>

      {/* Center Illustrated Vaadivasal Gate Graphic */}
      <div className="relative z-10 text-center my-auto space-y-4 max-w-lg mx-auto">
        <div className="w-24 h-24 mx-auto rounded-3xl bg-gradient-to-tr from-tamil-saffron to-amber-400 p-0.5 shadow-2xl flex items-center justify-center">
          <div className="w-full h-full rounded-[22px] bg-[#1a0f0a] flex items-center justify-center text-5xl">
            🐂
          </div>
        </div>

        <div>
          <h1 className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-tamil-saffron font-display">
            வாடிவாசல் 3D
          </h1>
          <p className="text-xs md:text-sm text-gray-300 mt-1 font-sans">
            Cultural Heritage Simulation • Zero Animal Harm • Pure Skill & Honor
          </p>
        </div>
      </div>

      {/* Bottom Contextual Progress Bar */}
      <div className="relative z-10 space-y-2 max-w-md mx-auto w-full">
        <div className="flex justify-between text-xs font-bold font-mono">
          <span className="text-amber-300">
            {progress < 40 ? 'LOADING 3D ARENA TEXTURES...' : progress < 85 ? 'SYNTHESIZING THAVIL & KOMBU AUDIO...' : 'LOADING: VAADIVASAL OPENING...'}
          </span>
          <span className="text-amber-400">{progress}%</span>
        </div>

        <div className="w-full h-3 bg-zinc-900 rounded-full overflow-hidden border border-tamil-saffron/40 p-0.5">
          <div
            className="h-full bg-gradient-to-r from-tamil-saffron via-tamil-marigold to-yellow-400 rounded-full transition-all duration-150 shadow-[0_0_12px_#F26A1B]"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
};
