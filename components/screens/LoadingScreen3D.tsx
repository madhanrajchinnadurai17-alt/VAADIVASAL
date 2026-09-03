import React, { useEffect, useState } from 'react';
import { useGameStore } from '../../store/useGameStore';
import { soundManager } from '../../utils/soundSynthesizer';
import { Trophy, Heart } from 'lucide-react';

export const LoadingScreen3D: React.FC = () => {
  const [progress, setProgress] = useState(10);
  const { setScreen, currentReputation, careStats } = useGameStore();

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setScreen('main_menu');
          }, 350);
          return 100;
        }
        return prev + 5;
      });
    }, 80);

    return () => clearInterval(interval);
  }, [setScreen]);

  const totalSegments = 24;
  const activeSegments = Math.round((progress / 100) * totalSegments);

  return (
    <div className="relative w-full h-full min-h-[500px] flex flex-col justify-between p-6 md:p-8 bg-gradient-to-b from-[#2b170e] via-[#1a0f0a] to-[#0f0704] text-white overflow-hidden select-none">
      {/* Subtle Dust & Kolam Backdrop */}
      <div className="absolute inset-0 kolam-pattern pointer-events-none opacity-10" />

      {/* Warm Sunlight & Ambient Dust Gradient */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Left Branding matching Image 5 */}
      <div className="relative z-10 flex justify-between items-start">
        <div>
          <h1 className="text-4xl md:text-5xl font-black tracking-wider text-[#f5ebe0] font-serif uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
            JALLIKATTU
          </h1>
          <p className="text-xs md:text-sm font-bold text-amber-200/90 tracking-widest uppercase mt-0.5 font-sans">
            - THE BULL&apos;S JOURNEY
          </p>
        </div>

        {/* Persistent Meta Stats */}
        <div className="flex items-center space-x-2.5 text-xs bg-black/60 px-3.5 py-1.5 rounded-full border border-amber-500/30 backdrop-blur-md shadow-lg">
          <span className="flex items-center gap-1 font-bold text-amber-400">
            <Trophy className="w-3.5 h-3.5" />
            <span>Rep: {currentReputation}</span>
          </span>
          <span className="text-zinc-600">|</span>
          <span className="flex items-center gap-1 font-bold text-emerald-400">
            <Heart className="w-3.5 h-3.5" />
            <span>Care: {Math.round((careStats.hunger + careStats.hydration + careStats.health) / 3)}%</span>
          </span>
        </div>
      </div>

      {/* Center Cinematic Bull Silhouette / Chute Artwork Card */}
      <div className="relative z-10 my-auto flex flex-col items-center justify-center text-center space-y-3">
        <div className="relative w-36 h-36 md:w-44 md:h-44 rounded-3xl bg-gradient-to-tr from-[#381a0e] via-[#1f0f08] to-[#120804] border-2 border-amber-500/40 p-2 shadow-2xl flex items-center justify-center group overflow-hidden">
          <div className="absolute inset-0 bg-radial-gradient from-amber-500/20 to-transparent pointer-events-none" />
          <span className="text-7xl md:text-8xl drop-shadow-[0_10px_20px_rgba(0,0,0,0.9)] animate-pulse">
            🐂
          </span>
        </div>
        <p className="text-xs text-amber-100/70 font-serif italic max-w-sm">
          &quot;Entering the sacred Vaadivasal chute... Honor, Timing &amp; Cultural Heritage.&quot;
        </p>
      </div>

      {/* Bottom Segmented Golden Loading Bar matching Image 5 */}
      <div className="relative z-10 max-w-xl mx-auto w-full space-y-2">
        <div className="flex justify-between text-[11px] font-bold text-amber-300 font-mono">
          <span>LOADING: {progress < 45 ? 'ARENA CHUTE & CROWD...' : progress < 85 ? 'THAVIL & KOMBU SYNTHESIS...' : 'VAADIVASAL GATE OPENING...'}</span>
          <span>{progress}%</span>
        </div>

        {/* Segmented Golden Bar */}
        <div className="w-full h-4 bg-black/80 rounded-md border border-amber-500/50 p-0.5 flex gap-0.5 shadow-2xl overflow-hidden backdrop-blur-md">
          {Array.from({ length: totalSegments }).map((_, idx) => {
            const isFilled = idx < activeSegments;
            return (
              <div
                key={idx}
                className={`flex-1 h-full rounded-[1px] transition-all duration-150 ${
                  isFilled
                    ? 'bg-gradient-to-t from-[#c27803] via-[#f59e0b] to-[#fef08a] shadow-[0_0_8px_#f59e0b]'
                    : 'bg-zinc-900/60'
                }`}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};
