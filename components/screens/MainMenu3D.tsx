import React, { useState } from 'react';
import { useGameStore } from '../../store/useGameStore';
import { soundManager } from '../../utils/soundSynthesizer';
import { Trophy, Heart, MapPin, Volume2, VolumeX, Moon, Sun, X } from 'lucide-react';

export const MainMenu3D: React.FC = () => {
  const {
    setScreen,
    resetToArena,
    soundMuted,
    toggleMute,
    currentVillage,
    isNightJallikattu,
    toggleNightMode,
    currentReputation,
    careStats,
  } = useGameStore();

  const [activeModal, setActiveModal] = useState<'settings' | 'credits' | null>(null);

  const handleStartArena = () => {
    soundManager.playThavilSnap(0.8);
    resetToArena();
  };

  const handleStartTrainBull = () => {
    soundManager.playThavilSnap(0.8);
    setScreen('bull_selection');
  };

  const handleOpenWorldMap = () => {
    soundManager.playThavilSnap(0.8);
    setScreen('world_map');
  };

  return (
    <div className="relative w-full h-full min-h-[520px] flex flex-col items-center justify-between p-4 md:p-6 bg-gradient-to-b from-[#2e1910] via-[#1c0f0a] to-[#100704] text-center overflow-hidden select-none">
      {/* Background Ambience & Soft Village Kolam Glow */}
      <div className="absolute inset-0 kolam-pattern pointer-events-none opacity-15" />
      <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Bar with Circuit Badge, Meta Stats, and Audio Controls */}
      <div className="relative z-10 w-full max-w-4xl flex justify-between items-center border-b border-white/10 pb-2.5">
        {/* Village Circuit Link */}
        <button
          onClick={handleOpenWorldMap}
          className="flex items-center space-x-1.5 px-3 py-1 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 hover:bg-amber-500/25 text-xs font-bold transition-all shadow-md"
        >
          <MapPin className="w-3.5 h-3.5" />
          <span>{currentVillage.name} ({currentVillage.tamilName})</span>
        </button>

        {/* Top-Right Meta Stats & Controls */}
        <div className="flex items-center space-x-2">
          {/* Reputation & Bull Care */}
          <div className="hidden sm:flex items-center space-x-2 text-[11px] bg-black/60 px-3 py-1 rounded-xl border border-amber-500/20 backdrop-blur-md">
            <span className="flex items-center gap-1 font-bold text-amber-400">
              <Trophy className="w-3 h-3" />
              <span>Rep: {currentReputation}</span>
            </span>
            <span className="text-zinc-600">|</span>
            <span className="font-bold text-emerald-400">
              <Heart className="w-3 h-3 inline mr-1" />
              Care: {Math.round((careStats.hunger + careStats.hydration + careStats.health) / 3)}%
            </span>
          </div>

          {/* Day / Night Toggle */}
          <button
            onClick={toggleNightMode}
            className={`flex items-center space-x-1 px-2.5 py-1 rounded-xl text-xs font-bold border transition-all ${
              isNightJallikattu
                ? 'bg-indigo-950/80 border-indigo-400 text-indigo-200'
                : 'bg-amber-950/80 border-amber-400 text-amber-200'
            }`}
          >
            {isNightJallikattu ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5" />}
          </button>

          {/* Sound Toggle */}
          <button
            onClick={toggleMute}
            className="flex items-center space-x-1 px-2.5 py-1 rounded-xl bg-black/50 border border-white/15 text-xs text-gray-300 hover:text-white"
          >
            {soundMuted ? <VolumeX className="w-3.5 h-3.5 text-red-400" /> : <Volume2 className="w-3.5 h-3.5 text-emerald-400" />}
          </button>
        </div>
      </div>

      {/* Main Title matching Image 2 */}
      <div className="relative z-10 space-y-1 my-auto max-w-2xl text-center">
        <h1 className="text-5xl md:text-6xl font-black text-[#f5ebe0] font-serif uppercase tracking-wider drop-shadow-[0_4px_8px_rgba(0,0,0,0.9)]">
          JALLIKATTU
        </h1>
        <p className="text-xs md:text-sm text-amber-200/90 font-serif italic max-w-md mx-auto">
          An Authentic Tamil Nadu Heritage Simulation
        </p>

        {/* Center Illustration Hero Spot */}
        <div className="py-2">
          <div className="w-24 h-24 mx-auto rounded-3xl bg-gradient-to-tr from-amber-600/30 to-black border-2 border-amber-400/40 p-2 flex items-center justify-center text-5xl shadow-2xl animate-pulse">
            🐂
          </div>
        </div>

        {/* Dual Ornate Buttons matching Image 2 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto pt-2">
          {/* OPTION 1 — TRAIN THE BULL (Green Plaque) */}
          <button
            onClick={handleStartTrainBull}
            className="group relative flex items-center p-2 rounded-2xl bg-[#1e3a24] hover:bg-[#25492d] border-2 border-[#528a5c] text-white shadow-2xl active:scale-[0.98] transition-all overflow-hidden"
          >
            {/* Thumbnail Box */}
            <div className="w-20 h-16 rounded-xl bg-[#122416] border border-[#528a5c]/50 flex items-center justify-center text-3xl mr-3 flex-shrink-0 group-hover:scale-105 transition-transform">
              👨‍🌾
            </div>
            {/* Plaque Text */}
            <div className="text-left flex-1">
              <div className="text-xs md:text-sm font-black text-[#e8f5e9] tracking-wider uppercase font-serif">
                OPTION 1 —
              </div>
              <div className="text-sm md:text-base font-black text-[#a5d6a7] font-serif uppercase tracking-wide">
                TRAIN THE BULL
              </div>
            </div>
          </button>

          {/* OPTION 2 — ENTER THE ARENA (Crimson Plaque) */}
          <button
            onClick={handleStartArena}
            className="group relative flex items-center p-2 rounded-2xl bg-[#521b18] hover:bg-[#66221e] border-2 border-[#9e4640] text-white shadow-2xl active:scale-[0.98] transition-all overflow-hidden"
          >
            {/* Thumbnail Box */}
            <div className="w-20 h-16 rounded-xl bg-[#2e0f0d] border border-[#9e4640]/50 flex items-center justify-center text-3xl mr-3 flex-shrink-0 group-hover:scale-105 transition-transform">
              🏃‍♂️
            </div>
            {/* Plaque Text */}
            <div className="text-left flex-1">
              <div className="text-xs md:text-sm font-black text-[#ffebee] tracking-wider uppercase font-serif">
                OPTION 2 —
              </div>
              <div className="text-sm md:text-base font-black text-[#ef9a9a] font-serif uppercase tracking-wide">
                ENTER THE ARENA
              </div>
            </div>
          </button>
        </div>

        {/* Clean Centered Menu Links matching Image 2 */}
        <div className="flex justify-center items-center space-x-6 pt-5 text-xs text-amber-200/80 font-serif font-bold">
          <button
            onClick={() => setActiveModal('settings')}
            className="hover:text-white hover:underline underline-offset-4 transition-colors"
          >
            Settings
          </button>
          <span className="text-zinc-600">•</span>
          <button
            onClick={() => setActiveModal('credits')}
            className="hover:text-white hover:underline underline-offset-4 transition-colors"
          >
            Credits
          </button>
          <span className="text-zinc-600">•</span>
          <button
            onClick={handleOpenWorldMap}
            className="hover:text-white hover:underline underline-offset-4 transition-colors text-amber-400"
          >
            World Map
          </button>
        </div>
      </div>

      {/* Footer Cultural Notice */}
      <div className="relative z-10 text-[10px] text-zinc-400 font-sans">
        Non-violent cultural heritage simulation • Zero animal harm • Pure skill, timing &amp; honor
      </div>

      {/* Modal Dialogs */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#1a0f0a] border-2 border-amber-400 rounded-3xl p-6 max-w-sm w-full space-y-3 shadow-2xl text-white text-left">
            <div className="flex justify-between items-center border-b border-white/10 pb-2">
              <h3 className="text-sm font-black text-amber-300 uppercase font-serif">
                {activeModal === 'settings' ? 'Settings' : 'Credits'}
              </h3>
              <button onClick={() => setActiveModal(null)}>
                <X className="w-5 h-5 text-gray-400 hover:text-white" />
              </button>
            </div>

            {activeModal === 'settings' ? (
              <div className="space-y-2 text-xs text-gray-300">
                <div className="flex justify-between items-center p-2 rounded-lg bg-black/40">
                  <span>Sound Synthesizer</span>
                  <span className="text-emerald-400 font-bold">Web Audio Active</span>
                </div>
                <div className="flex justify-between items-center p-2 rounded-lg bg-black/40">
                  <span>Graphics Tier</span>
                  <span className="text-cyan-400 font-bold">PBR + HDRI 3D</span>
                </div>
              </div>
            ) : (
              <div className="space-y-1.5 text-xs text-gray-300">
                <p><strong>Title:</strong> JALLIKATTU – The Bull&apos;s Journey</p>
                <p><strong>Stack:</strong> Next.js + Three.js + React Three Fiber + Tailwind</p>
                <p><strong>Heritage:</strong> Pongal Festival Eru Thazhuvuthal Tradition</p>
              </div>
            )}

            <button
              onClick={() => setActiveModal(null)}
              className="w-full py-2 rounded-xl bg-amber-500 text-black font-black text-xs font-serif shadow-md"
            >
              CLOSE
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
