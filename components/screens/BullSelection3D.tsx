import React from 'react';
import { Canvas } from '@react-three/fiber';
import { Bull3D } from '../three/3DModels';
import { useGameStore } from '../../store/useGameStore';
import { BULL_TIERS } from '../three/BullGrowthTiers';
import { soundManager } from '../../utils/soundSynthesizer';
import { ArrowLeft, Sparkles, Utensils, Award, Zap, Heart, Shield, Activity } from 'lucide-react';

export const BullSelection3D: React.FC = () => {
  const {
    bullName,
    bullStats,
    bullTier,
    setScreen,
    resetToArena,
  } = useGameStore();

  const tier = BULL_TIERS[bullTier] || BULL_TIERS.young;

  return (
    <div className="relative w-full h-full min-h-[520px] flex flex-col justify-between p-4 md:p-6 bg-gradient-to-b from-[#25150f] via-[#1a0f0a] to-[#120B09] text-white overflow-hidden select-none">
      <div className="absolute inset-0 kolam-pattern pointer-events-none opacity-20" />

      {/* Top Header Bar */}
      <div className="relative z-20 flex items-center justify-between border-b border-white/10 pb-3">
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
          <div className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
            BULL OWNER TURNTABLE
          </div>
          <div className="text-sm font-black text-amber-300">
            {bullName}
          </div>
        </div>
      </div>

      {/* Center 3D Turntable View */}
      <div className="relative z-10 flex-1 flex flex-col md:flex-row items-center justify-between gap-4 my-2">
        {/* Left: 3D Bull Turntable Canvas */}
        <div className="relative w-full md:w-1/2 h-56 md:h-80 rounded-2xl bg-black/40 border border-white/10 overflow-hidden shadow-2xl flex items-center justify-center">
          <div className="absolute top-3 left-3 z-10 px-2.5 py-1 rounded-lg bg-black/70 border border-white/15 text-[10px] font-bold text-amber-300 flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            <span>360° Turntable View</span>
          </div>

          <Canvas camera={{ position: [0, 1.8, 4.2], fov: 45 }}>
            <ambientLight intensity={0.9} color="#fff1e6" />
            <directionalLight position={[5, 8, 5]} intensity={1.5} color="#ffedd5" />
            <pointLight position={[-4, 3, -2]} intensity={0.6} color="#f59e0b" />
            <Bull3D position={[0, -0.4, 0]} isTurntable={true} isReleased={false} />
          </Canvas>
        </div>

        {/* Right: Bull Stats & Growth Tier Card */}
        <div className="w-full md:w-1/2 space-y-3">
          {/* Growth Tier Card */}
          <div className={`p-4 rounded-2xl bg-black/60 border-2 ${tier.borderColor} shadow-xl space-y-2`}>
            <div className="flex items-center justify-between">
              <span className={`px-2.5 py-0.5 rounded-full ${tier.badgeBg} ${tier.badgeTextColor} text-[10px] font-black uppercase tracking-wider`}>
                {tier.englishTitle}
              </span>
              <span className="text-xs text-amber-400 font-tamil font-bold">
                {tier.tamilName}
              </span>
            </div>
            <p className="text-xs text-gray-300 leading-relaxed">
              {tier.description}
            </p>
          </div>

          {/* 4 Athletic Stat Bars */}
          <div className="p-3.5 rounded-2xl bg-black/60 border border-white/10 space-y-2.5 shadow-xl">
            {/* Speed */}
            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="flex items-center gap-1 text-cyan-300">
                  <Zap className="w-3.5 h-3.5" />
                  <span>Speed (வேகம்)</span>
                </span>
                <span className="text-white font-mono">{bullStats.speed}/100</span>
              </div>
              <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden border border-white/10">
                <div className="h-full bg-cyan-400 rounded-full transition-all duration-300" style={{ width: `${bullStats.speed}%` }} />
              </div>
            </div>

            {/* Stamina */}
            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="flex items-center gap-1 text-emerald-300">
                  <Heart className="w-3.5 h-3.5" />
                  <span>Stamina (திடம்)</span>
                </span>
                <span className="text-white font-mono">{bullStats.stamina}/100</span>
              </div>
              <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden border border-white/10">
                <div className="h-full bg-emerald-400 rounded-full transition-all duration-300" style={{ width: `${bullStats.stamina}%` }} />
              </div>
            </div>

            {/* Strength */}
            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="flex items-center gap-1 text-amber-300">
                  <Shield className="w-3.5 h-3.5" />
                  <span>Strength (வலிமை)</span>
                </span>
                <span className="text-white font-mono">{bullStats.strength}/100</span>
              </div>
              <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden border border-white/10">
                <div className="h-full bg-amber-400 rounded-full transition-all duration-300" style={{ width: `${bullStats.strength}%` }} />
              </div>
            </div>

            {/* Temperament */}
            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="flex items-center gap-1 text-rose-300">
                  <Activity className="w-3.5 h-3.5" />
                  <span>Temperament & Reflex (எதிர்வினை)</span>
                </span>
                <span className="text-white font-mono">{bullStats.temperament}/100</span>
              </div>
              <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden border border-white/10">
                <div className="h-full bg-rose-400 rounded-full transition-all duration-300" style={{ width: `${bullStats.temperament}%` }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Action CTAs */}
      <div className="relative z-20 pt-2 flex flex-col sm:flex-row gap-2.5">
        <button
          onClick={() => {
            soundManager.playThavilSnap(0.8);
            setScreen('bull_care');
          }}
          className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-amber-400 via-tamil-marigold to-tamil-saffron text-black font-black text-xs md:text-sm shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center space-x-2 border border-amber-200"
        >
          <Utensils className="w-4 h-4" />
          <span>பராமரிப்பு & பயிற்சி • BEGIN CARE & TRAINING</span>
        </button>

        <button
          onClick={() => {
            soundManager.playThavilSnap(0.8);
            resetToArena();
          }}
          className="py-3.5 px-5 rounded-xl bg-black/60 hover:bg-black border border-amber-400/40 text-amber-300 hover:text-white font-bold text-xs md:text-sm transition-all"
        >
          ENTER ARENA WITH THIS BULL
        </button>
      </div>
    </div>
  );
};
