import React, { useState } from 'react';
import { BullStats, TRADITIONAL_FEEDS, FoodItem, updateBullGrowth } from '../game/bullCareSystem';
import { Sparkles, Utensils, Waves, Shield, Activity, Heart, Droplets, Trophy, ArrowRight, ArrowLeft } from 'lucide-react';
import { soundManager } from '../utils/soundSynthesizer';

interface BullDashboardProps {
  bull: BullStats;
  coins: number;
  onUpdateBull: (updated: BullStats, coinsDiff: number) => void;
  onStartTraining: (mode: 'water' | 'field') => void;
  onEnterArenaWithBull: () => void;
  onBackToMenu: () => void;
}

export const BullDashboard: React.FC<BullDashboardProps> = ({
  bull,
  coins,
  onUpdateBull,
  onStartTraining,
  onEnterArenaWithBull,
  onBackToMenu,
}) => {
  const [activeTab, setActiveTab] = useState<'care' | 'training' | 'profile'>('care');
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleFeed = (food: FoodItem) => {
    if (coins < food.cost) {
      setFeedback('⚠️ போதுமான பொற்காசுகள் இல்லை! (Not enough coins!)');
      setTimeout(() => setFeedback(null), 2500);
      return;
    }

    soundManager.playThavilSnap(0.7);
    const updatedBull: BullStats = {
      ...bull,
      energy: Math.min(100, bull.energy + (food.effects.energy || 0)),
      health: Math.min(100, bull.health + (food.effects.health || 0)),
      hydration: Math.min(100, bull.hydration + (food.effects.hydration || 0)),
      trust: Math.min(100, bull.trust + (food.effects.trust || 0)),
      strength: Math.min(100, bull.strength + (food.effects.strength || 0)),
      stamina: Math.min(100, bull.stamina + (food.effects.stamina || 0)),
    };

    const grownBull = updateBullGrowth(updatedBull);
    onUpdateBull(grownBull, -food.cost);

    setFeedback(`✨ ${food.name} ஊட்டப்பட்டது! (+Health, +Energy)`);
    setTimeout(() => setFeedback(null), 2500);
  };

  const handleBathing = () => {
    soundManager.playGripSuccess(1);
    const updatedBull: BullStats = {
      ...bull,
      hygiene: 100,
      trust: Math.min(100, bull.trust + 8),
      health: Math.min(100, bull.health + 5),
    };
    onUpdateBull(updatedBull, 0);
    setFeedback('🚿 ஆற்றுக்குளியல் நிறைவடைந்தது! Hygiene & Trust Restored!');
    setTimeout(() => setFeedback(null), 2500);
  };

  return (
    <div className="relative w-full max-w-5xl mx-auto rounded-2xl overflow-hidden border border-tamil-saffron/40 bg-gradient-to-b from-[#25150f] via-[#1a0f0a] to-[#120B09] shadow-2xl p-4 md:p-8 festival-glow">
      <div className="absolute inset-0 kolam-pattern pointer-events-none opacity-20" />

      {/* Header bar */}
      <div className="relative z-10 flex flex-wrap items-center justify-between border-b border-tamil-saffron/30 pb-4 mb-6 gap-3">
        <div className="flex items-center space-x-3">
          <button
            onClick={onBackToMenu}
            className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-black/40 hover:bg-tamil-saffron/20 text-tamil-gold border border-tamil-saffron/30 text-xs font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Main Menu</span>
          </button>
          <div>
            <h2 className="text-xl md:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-tamil-gold to-tamil-saffron font-display">
              {bull.name} • காளை பண்ணை
            </h2>
            <p className="text-xs text-tamil-sand/70">
              {bull.breed} • {bull.growthStage} ({bull.ageYears} Yrs, {bull.weightKg} Kg)
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg bg-black/60 border border-tamil-gold/40 text-tamil-gold font-bold text-sm">
            <span>🪙 {coins} Coins</span>
          </div>

          <button
            onClick={onEnterArenaWithBull}
            className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-tamil-saffron to-tamil-marigold text-black font-black text-xs md:text-sm shadow-lg hover:scale-105 active:scale-95 transition-all border border-amber-200"
          >
            <span>வாடிவாசல் களம் • ENTER ARENA</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {feedback && (
        <div className="relative z-10 mb-4 p-2.5 rounded-lg bg-tamil-saffron/20 border border-tamil-saffron text-tamil-gold text-xs font-bold text-center animate-pulse">
          {feedback}
        </div>
      )}

      {/* Tabs */}
      <div className="relative z-10 flex space-x-2 mb-6 border-b border-white/10 pb-2">
        <button
          onClick={() => setActiveTab('care')}
          className={`flex items-center space-x-1.5 px-4 py-2 rounded-lg text-xs md:text-sm font-bold transition-all ${
            activeTab === 'care'
              ? 'bg-tamil-saffron text-black shadow-md'
              : 'bg-black/40 text-tamil-sand hover:bg-tamil-saffron/20'
          }`}
        >
          <Utensils className="w-4 h-4" />
          <span>Care & Traditional Feed</span>
        </button>

        <button
          onClick={() => setActiveTab('training')}
          className={`flex items-center space-x-1.5 px-4 py-2 rounded-lg text-xs md:text-sm font-bold transition-all ${
            activeTab === 'training'
              ? 'bg-tamil-saffron text-black shadow-md'
              : 'bg-black/40 text-tamil-sand hover:bg-tamil-saffron/20'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>Interactive Training</span>
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`flex items-center space-x-1.5 px-4 py-2 rounded-lg text-xs md:text-sm font-bold transition-all ${
            activeTab === 'profile'
              ? 'bg-tamil-saffron text-black shadow-md'
              : 'bg-black/40 text-tamil-sand hover:bg-tamil-saffron/20'
          }`}
        >
          <Trophy className="w-4 h-4" />
          <span>Growth & Attributes</span>
        </button>
      </div>

      {/* Tab 1: Care & Feed */}
      {activeTab === 'care' && (
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Daily Care Meters */}
          <div className="bg-black/40 border border-tamil-saffron/30 rounded-xl p-4 space-y-3">
            <h3 className="text-sm font-bold text-tamil-gold flex items-center gap-1.5">
              <Heart className="w-4 h-4 text-red-400" />
              <span>Daily Vital Meters (உடல் நிலை)</span>
            </h3>

            {/* Meter 1: Energy */}
            <div>
              <div className="flex justify-between text-xs text-tamil-sand mb-1">
                <span>Energy (ஆற்றல்)</span>
                <span className="font-bold">{bull.energy}%</span>
              </div>
              <div className="w-full h-2.5 bg-black/60 rounded-full overflow-hidden border border-white/10">
                <div className="h-full bg-amber-400 rounded-full" style={{ width: `${bull.energy}%` }} />
              </div>
            </div>

            {/* Meter 2: Health */}
            <div>
              <div className="flex justify-between text-xs text-tamil-sand mb-1">
                <span>Health & Vigor (உடல் நலம்)</span>
                <span className="font-bold">{bull.health}%</span>
              </div>
              <div className="w-full h-2.5 bg-black/60 rounded-full overflow-hidden border border-white/10">
                <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${bull.health}%` }} />
              </div>
            </div>

            {/* Meter 3: Hydration */}
            <div>
              <div className="flex justify-between text-xs text-tamil-sand mb-1">
                <span>Hydration (நீர்ச்சத்து)</span>
                <span className="font-bold">{bull.hydration}%</span>
              </div>
              <div className="w-full h-2.5 bg-black/60 rounded-full overflow-hidden border border-white/10">
                <div className="h-full bg-cyan-400 rounded-full" style={{ width: `${bull.hydration}%` }} />
              </div>
            </div>

            {/* Meter 4: Trust */}
            <div>
              <div className="flex justify-between text-xs text-tamil-sand mb-1">
                <span>Trust & Bond (நம்பிக்கை)</span>
                <span className="font-bold">{bull.trust}%</span>
              </div>
              <div className="w-full h-2.5 bg-black/60 rounded-full overflow-hidden border border-white/10">
                <div className="h-full bg-purple-400 rounded-full" style={{ width: `${bull.trust}%` }} />
              </div>
            </div>

            {/* Grooming action */}
            <div className="pt-2">
              <button
                onClick={handleBathing}
                className="w-full flex items-center justify-center space-x-2 py-2.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-bold transition-all"
              >
                <Droplets className="w-4 h-4" />
                <span>ஆற்றுக் குளியல் • Groom & River Bath</span>
              </button>
            </div>
          </div>

          {/* Traditional Feeds List */}
          <div className="md:col-span-2 space-y-3">
            <h3 className="text-sm font-bold text-tamil-gold flex items-center gap-1.5">
              <Utensils className="w-4 h-4 text-amber-400" />
              <span>Authentic Traditional Tamil Feeds (தீவனம்)</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {TRADITIONAL_FEEDS.map((food) => (
                <div
                  key={food.id}
                  className="bg-[#24140e]/90 border border-tamil-saffron/20 rounded-xl p-3 flex flex-col justify-between hover:border-tamil-saffron/50 transition-all"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xl">{food.icon}</span>
                      <span className="text-xs font-bold text-tamil-gold px-2 py-0.5 bg-black/40 rounded border border-tamil-gold/30">
                        🪙 {food.cost}
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-white mt-1.5">{food.name}</h4>
                    <p className="text-[11px] text-amber-300 font-tamil">{food.tamilName}</p>
                    <p className="text-[10px] text-tamil-sand/70 mt-1">{food.description}</p>
                  </div>

                  <button
                    onClick={() => handleFeed(food)}
                    className="mt-3 w-full py-1.5 bg-tamil-saffron/20 hover:bg-tamil-saffron text-tamil-gold hover:text-black font-bold text-xs rounded-lg border border-tamil-saffron/40 transition-all"
                  >
                    ஊட்டுக • Feed Bull
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Interactive Training */}
      {activeTab === 'training' && (
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Pond Training Card */}
          <div className="bg-[#1f1510] border-2 border-blue-500/40 rounded-2xl p-5 space-y-4 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="w-12 h-12 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center text-2xl border border-blue-500/40">
                🌊
              </div>
              <h3 className="text-base font-extrabold text-white">
                Pond Water Resistance Training (குளத்துப் பயிற்சி)
              </h3>
              <p className="text-xs text-tamil-sand/80 leading-relaxed">
                Take the bull into deep water to build massive cardiovascular stamina, leg strength, and water balance.
              </p>
              <div className="p-2.5 rounded-lg bg-black/40 border border-blue-500/20 text-xs text-blue-300 space-y-0.5">
                <div>• +5 to +8 Stamina (கார்டியோ திடம்)</div>
                <div>• +4 Strength (கால் வலிமை)</div>
                <div>• Energy Cost: -15</div>
              </div>
            </div>

            <button
              onClick={() => onStartTraining('water')}
              disabled={bull.energy < 15}
              className={`w-full py-3 rounded-xl font-black text-xs md:text-sm flex items-center justify-center space-x-2 transition-all ${
                bull.energy >= 15
                  ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-black hover:scale-[1.02] shadow-lg border border-blue-300'
                  : 'bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-700'
              }`}
            >
              <Waves className="w-4 h-4" />
              <span>{bull.energy >= 15 ? 'START WATER TRAINING' : 'TOO TIRED (REST/FEED FIRST)'}</span>
            </button>
          </div>

          {/* Sand Field Decoy Training Card */}
          <div className="bg-[#1f1510] border-2 border-amber-500/40 rounded-2xl p-5 space-y-4 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center text-2xl border border-amber-500/40">
                🏃
              </div>
              <h3 className="text-base font-extrabold text-white">
                Human Reaction & Sprint Training (ஆள் மிரட்சிப் பயிற்சி)
              </h3>
              <p className="text-xs text-tamil-sand/80 leading-relaxed">
                Simulate moving decoy trainers in a sandy field to train evasive cutting, reaction reflex, and high agility.
              </p>
              <div className="p-2.5 rounded-lg bg-black/40 border border-amber-500/20 text-xs text-amber-300 space-y-0.5">
                <div>• +6 Agility (சுறுசுறுப்பு)</div>
                <div>• +5 Reaction (துரித எதிர்வினை)</div>
                <div>• +4 Speed (வேகம்)</div>
                <div>• Energy Cost: -20</div>
              </div>
            </div>

            <button
              onClick={() => onStartTraining('field')}
              disabled={bull.energy < 20}
              className={`w-full py-3 rounded-xl font-black text-xs md:text-sm flex items-center justify-center space-x-2 transition-all ${
                bull.energy >= 20
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-black hover:scale-[1.02] shadow-lg border border-amber-300'
                  : 'bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-700'
              }`}
            >
              <Activity className="w-4 h-4" />
              <span>{bull.energy >= 20 ? 'START AGILITY TRAINING' : 'TOO TIRED (REST/FEED FIRST)'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Tab 3: Growth & Attributes */}
      {activeTab === 'profile' && (
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Growth Stage Progress */}
          <div className="bg-black/40 border border-tamil-saffron/30 rounded-xl p-4 space-y-3">
            <h3 className="text-sm font-bold text-tamil-gold flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-tamil-gold" />
              <span>Growth Stage & Maturation (வளர்ச்சிப் பருவம்)</span>
            </h3>

            <div className="p-3 rounded-lg bg-tamil-earth/80 border border-amber-500/30">
              <div className="text-xs text-tamil-sand/70">Current Stage:</div>
              <div className="text-lg font-black text-amber-300">{bull.growthStage}</div>
              <div className="text-xs text-tamil-sand/80 mt-1">
                Age: <strong>{bull.ageYears} Years</strong> | Weight: <strong>{bull.weightKg} Kg</strong>
              </div>
            </div>

            {/* 4 Stage Timeline */}
            <div className="space-y-2 pt-1 text-xs">
              <div className={`p-2 rounded border ${bull.growthStage === 'Young Bull' ? 'bg-amber-500/20 border-amber-400 font-bold text-white' : 'bg-black/30 border-white/10 text-tamil-sand/60'}`}>
                1. Young Bull (இளம் காளை) • Baseline training & trust
              </div>
              <div className={`p-2 rounded border ${bull.growthStage === 'Growing Bull' ? 'bg-amber-500/20 border-amber-400 font-bold text-white' : 'bg-black/30 border-white/10 text-tamil-sand/60'}`}>
                2. Growing Bull (வளரும் காளை) • Expanding hump & muscle
              </div>
              <div className={`p-2 rounded border ${bull.growthStage === 'Trained Bull' ? 'bg-amber-500/20 border-amber-400 font-bold text-white' : 'bg-black/30 border-white/10 text-tamil-sand/60'}`}>
                3. Trained Bull (பயிற்சி பெற்ற காளை) • High stamina & arena ready
              </div>
              <div className={`p-2 rounded border ${bull.growthStage === 'Champion Kangayam' ? 'bg-amber-500/20 border-amber-400 font-bold text-white' : 'bg-black/30 border-white/10 text-tamil-sand/60'}`}>
                4. Champion Kangayam (வீரக் காளை) • Elite horns & legendary power
              </div>
            </div>
          </div>

          {/* Bull Athletic Attributes */}
          <div className="bg-black/40 border border-tamil-saffron/30 rounded-xl p-4 space-y-3">
            <h3 className="text-sm font-bold text-tamil-gold flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span>In-Arena Combat Attributes (வீரத் தகுதிகள்)</span>
            </h3>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="p-2.5 rounded-lg bg-black/50 border border-white/10">
                <div className="text-[11px] text-tamil-sand/70">Strength (திமில் வலிமை)</div>
                <div className="text-base font-black text-amber-300">{bull.strength}/100</div>
              </div>
              <div className="p-2.5 rounded-lg bg-black/50 border border-white/10">
                <div className="text-[11px] text-tamil-sand/70">Stamina (திடம்)</div>
                <div className="text-base font-black text-emerald-300">{bull.stamina}/100</div>
              </div>
              <div className="p-2.5 rounded-lg bg-black/50 border border-white/10">
                <div className="text-[11px] text-tamil-sand/70">Speed (வேகம்)</div>
                <div className="text-base font-black text-cyan-300">{bull.speed}/100</div>
              </div>
              <div className="p-2.5 rounded-lg bg-black/50 border border-white/10">
                <div className="text-[11px] text-tamil-sand/70">Reaction (எதிர்வினை)</div>
                <div className="text-base font-black text-purple-300">{bull.reaction}/100</div>
              </div>
              <div className="p-2.5 rounded-lg bg-black/50 border border-white/10 col-span-2">
                <div className="text-[11px] text-tamil-sand/70">Agility & Evasion (சுறுசுறுப்பு)</div>
                <div className="text-base font-black text-rose-300">{bull.agility}/100</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
