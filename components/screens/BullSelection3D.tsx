import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Bull3D } from '../three/3DModels';
import { useGameStore } from '../../store/useGameStore';
import { BULL_TIERS, BullTier } from '../three/BullGrowthTiers';
import { soundManager } from '../../utils/soundSynthesizer';
import { ArrowLeft, Sparkles, Utensils, Award, Shield, Zap, Heart, Activity } from 'lucide-react';

export const BullSelection3D: React.FC = () => {
  const {
    bullName,
    bullStats,
    bullTier,
    setScreen,
    resetToArena,
  } = useGameStore();

  const [selectedTierKey, setSelectedTierKey] = useState<BullTier>(bullTier);
  const activeTier = BULL_TIERS[selectedTierKey];

  const tiersList: BullTier[] = ['young', 'trained', 'mature', 'championship'];

  // Stat baseline generator for comparison preview
  const getTierStats = (tier: BullTier) => {
    switch (tier) {
      case 'young':
        return { strength: 25, speed: 20, stamina: 35, aggression: 15 };
      case 'trained':
        return { strength: 50, speed: 45, stamina: 55, aggression: 35 };
      case 'mature':
        return { strength: 75, speed: 65, stamina: 80, aggression: 65 };
      case 'championship':
        return { strength: 95, speed: 90, stamina: 95, aggression: 90 };
    }
  };

  const renderSegmentedBar = (val: number) => {
    const totalSegments = 16;
    const activeSegments = Math.round((val / 100) * totalSegments);
    return (
      <div className="w-full h-3 bg-black/80 rounded border border-amber-500/40 p-0.5 flex gap-0.5">
        {Array.from({ length: totalSegments }).map((_, i) => (
          <div
            key={i}
            className={`flex-1 h-full rounded-[1px] transition-all duration-200 ${
              i < activeSegments
                ? 'bg-gradient-to-t from-amber-600 via-amber-400 to-yellow-200 shadow-[0_0_4px_#f59e0b]'
                : 'bg-zinc-800/60'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="relative w-full h-full min-h-[520px] flex flex-col justify-between p-4 md:p-6 bg-gradient-to-b from-[#25150e] via-[#1a0f09] to-[#0f0704] text-white overflow-hidden select-none">
      <div className="absolute inset-0 kolam-pattern pointer-events-none opacity-10" />

      {/* Top Header */}
      <div className="relative z-20 flex items-center justify-between border-b border-white/10 pb-2">
        <button
          onClick={() => {
            soundManager.playThavilSnap(0.5);
            setScreen('main_menu');
          }}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-black/50 border border-white/15 text-xs text-gray-300 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Main Menu</span>
        </button>

        <div className="text-right">
          <div className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">
            BULL REPUTATION &amp; GROWTH
          </div>
          <div className="text-sm font-black text-amber-300 font-serif">
            {bullName} ({BULL_TIERS[bullTier].englishTitle})
          </div>
        </div>
      </div>

      {/* Script Title matching Image 1: "BULL GROWTH VISUAL" */}
      <div className="relative z-10 text-center my-1">
        <h2 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-orange-300 font-serif italic tracking-wide drop-shadow-md">
          BULL GROWTH VISUAL
        </h2>
        <p className="text-[11px] text-amber-100/70 font-sans">
          Select and inspect the 4 developmental athletic tiers of Kangayam heritage bulls
        </p>
      </div>

      {/* 4 Growth Stages Cards Grid matching Image 1 */}
      <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-2.5 my-2">
        {tiersList.map((t) => {
          const cfg = BULL_TIERS[t];
          const isCurrentPlayerTier = bullTier === t;
          const isSelected = selectedTierKey === t;
          const stats = isCurrentPlayerTier ? bullStats : getTierStats(t);

          return (
            <div
              key={t}
              onClick={() => {
                soundManager.playThavilSnap(0.6);
                setSelectedTierKey(t);
              }}
              className={`rounded-2xl border-2 p-3 transition-all cursor-pointer flex flex-col justify-between shadow-xl ${
                isSelected
                  ? 'bg-[#2b170e] border-amber-400 shadow-amber-500/20 ring-1 ring-amber-400 scale-[1.02]'
                  : 'bg-black/60 border-amber-500/20 hover:border-amber-500/40 opacity-85 hover:opacity-100'
              }`}
            >
              {/* Tier Header Label */}
              <div className="text-center mb-2 pb-1.5 border-b border-white/10">
                <div className="text-xs font-black uppercase tracking-wider text-white font-serif">
                  {cfg.englishTitle}
                </div>
                <div className="text-[10px] text-amber-400 font-tamil font-bold">
                  {cfg.tamilName}
                </div>
                {isCurrentPlayerTier && (
                  <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[8px] font-black border border-emerald-400/40">
                    CURRENT TIER
                  </span>
                )}
              </div>

              {/* Stat Bars matching Image 1 */}
              <div className="space-y-2 text-[10px] font-bold text-amber-200">
                {/* STRENGTH */}
                <div>
                  <div className="flex justify-between mb-0.5">
                    <span className="uppercase text-[9px] text-gray-300 font-mono">STRENGTH</span>
                    <span className="font-mono text-amber-300">{stats.strength}</span>
                  </div>
                  {renderSegmentedBar(stats.strength)}
                </div>

                {/* SPEED */}
                <div>
                  <div className="flex justify-between mb-0.5">
                    <span className="uppercase text-[9px] text-gray-300 font-mono">SPEED</span>
                    <span className="font-mono text-amber-300">{stats.speed}</span>
                  </div>
                  {renderSegmentedBar(stats.speed)}
                </div>

                {/* STAMINA */}
                <div>
                  <div className="flex justify-between mb-0.5">
                    <span className="uppercase text-[9px] text-gray-300 font-mono">STAMINA</span>
                    <span className="font-mono text-amber-300">{stats.stamina}</span>
                  </div>
                  {renderSegmentedBar(stats.stamina)}
                </div>

                {/* AGGRESSION */}
                <div>
                  <div className="flex justify-between mb-0.5">
                    <span className="uppercase text-[9px] text-gray-300 font-mono">AGGRESSION</span>
                    <span className="font-mono text-amber-300">{stats.aggression}</span>
                  </div>
                  {renderSegmentedBar(stats.aggression)}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Center Description of Selected Tier */}
      <div className="relative z-10 bg-black/60 border border-amber-500/30 rounded-xl p-2.5 text-center max-w-xl mx-auto w-full">
        <p className="text-xs text-amber-100/90 font-serif">
          &quot;{activeTier.description}&quot;
        </p>
      </div>

      {/* Bottom Action CTAs */}
      <div className="relative z-20 pt-2 flex flex-col sm:flex-row gap-2.5 max-w-xl mx-auto w-full">
        <button
          onClick={() => {
            soundManager.playThavilSnap(0.8);
            setScreen('bull_care');
          }}
          className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-amber-400 via-tamil-marigold to-tamil-saffron text-black font-black text-xs md:text-sm shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center space-x-2 border border-amber-200 font-serif"
        >
          <Utensils className="w-4 h-4" />
          <span>பராமரிப்பு &amp; பயிற்சி • GO TO PADDOCK CARE</span>
        </button>

        <button
          onClick={() => {
            soundManager.playThavilSnap(0.8);
            resetToArena();
          }}
          className="py-3.5 px-5 rounded-xl bg-black/60 hover:bg-black border border-amber-400/40 text-amber-300 hover:text-white font-bold text-xs md:text-sm transition-all font-serif"
        >
          ENTER ARENA ➔
        </button>
      </div>
    </div>
  );
};
