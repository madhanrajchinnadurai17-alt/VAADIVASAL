import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import { VaadivasalGame3D } from '../components/VaadivasalGame3D';
import { VillageMapModal } from '../components/VillageMapModal';
import { TamerProfileModal } from '../components/TamerProfileModal';
import { TAMIL_VILLAGES, VillageEvent } from '../game/villageSystem';
import {
  GameSaveData,
  loadGameData,
  saveGameData,
} from '../game/playerProgression';
import { Info, ShieldCheck, Flag, MapPin, Trophy, Box } from 'lucide-react';

export default function Home() {
  const [saveData, setSaveData] = useState<GameSaveData | null>(null);

  // Modals
  const [showVillageMap, setShowVillageMap] = useState(false);
  const [showTamerProfile, setShowTamerProfile] = useState(false);
  const [showPitchModal, setShowPitchModal] = useState(false);

  // Load save on mount
  useEffect(() => {
    const loaded = loadGameData();
    setSaveData(loaded);
  }, []);

  if (!saveData) {
    return (
      <div className="min-h-screen bg-tamil-night flex items-center justify-center text-tamil-sand">
        <div className="text-center space-y-2">
          <div className="w-10 h-10 border-4 border-tamil-saffron border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="font-bold text-sm">ஏற்றப்படுகிறது... Loading Vaadivasal 3D...</p>
        </div>
      </div>
    );
  }

  const currentVillage =
    TAMIL_VILLAGES.find((v) => v.id === saveData.currentVillageId) || TAMIL_VILLAGES[0];

  const updateSave = (newData: Partial<GameSaveData>) => {
    const updated: GameSaveData = { ...saveData, ...newData };
    setSaveData(updated);
    saveGameData(updated);
  };

  const handleSelectVillage = (village: VillageEvent) => {
    updateSave({ currentVillageId: village.id });
    setShowVillageMap(false);
  };

  return (
    <>
      <Head>
        <title>வாடிவாசல் 3D | JALLIKATTU: THE BULL&apos;S JOURNEY</title>
        <meta
          name="description"
          content="Full 3D Tamil Nadu Jallikattu Simulation built with Next.js, Three.js, React Three Fiber, Zustand, and Tailwind CSS."
        />
      </Head>

      <main className="min-h-screen bg-[#0e0705] text-tamil-sand flex flex-col justify-between p-2 md:p-5 selection:bg-tamil-saffron selection:text-black">
        {/* Top Header Bar */}
        <header className="w-full max-w-5xl mx-auto flex flex-wrap items-center justify-between py-2 px-4 rounded-2xl bg-black/60 border border-tamil-saffron/30 backdrop-blur-md mb-3 gap-2">
          <div className="flex items-center space-x-3">
            <span className="text-2xl md:text-3xl">🐂</span>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-sm md:text-lg font-black tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-tamil-gold via-amber-400 to-tamil-saffron font-display">
                  VAADIVASAL 3D
                </h1>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[9px] font-black uppercase flex items-center gap-1">
                  <Box className="w-3 h-3" />
                  <span>Phase 1 (R3F)</span>
                </span>
              </div>
              <p className="text-[10px] text-tamil-sand/70">
                {currentVillage.tamilName} • {currentVillage.name} Circuit | Rank: {saveData.ownerRankTitle}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowVillageMap(true)}
              className="flex items-center space-x-1 px-2.5 py-1.5 rounded-xl bg-black/60 hover:bg-tamil-saffron/20 text-tamil-gold border border-tamil-saffron/30 text-xs font-bold transition-all"
            >
              <MapPin className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Village Map</span>
            </button>

            <button
              onClick={() => setShowTamerProfile(true)}
              className="flex items-center space-x-1 px-2.5 py-1.5 rounded-xl bg-black/60 hover:bg-tamil-saffron/20 text-tamil-gold border border-tamil-saffron/30 text-xs font-bold transition-all"
            >
              <Trophy className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Trophies & Profile</span>
            </button>

            <button
              onClick={() => setShowPitchModal(true)}
              className="flex items-center space-x-1 px-2.5 py-1.5 rounded-xl bg-tamil-saffron/20 hover:bg-tamil-saffron/30 text-tamil-gold border border-tamil-saffron/40 text-xs font-bold transition-all"
            >
              <Info className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Vision</span>
            </button>
          </div>
        </header>

        {/* 3D Game Canvas & Layered HUD Overlay */}
        <div className="flex-1 flex items-center justify-center w-full max-w-5xl mx-auto">
          <VaadivasalGame3D />
        </div>

        {/* Footer */}
        <footer className="w-full max-w-5xl mx-auto mt-3 pt-2.5 border-t border-tamil-saffron/20 flex flex-col sm:flex-row items-center justify-between text-[11px] text-tamil-sand/60 gap-1.5">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Culturally authentic 3D simulation of Tamil Nadu Jallikattu (ஏறு தழுவுதல்). Non-violent, zero animal harm.</span>
          </div>
          <div>
            <span>Circuit: <strong>{currentVillage.name} ({currentVillage.district})</strong></span>
          </div>
        </footer>

        {/* Modals */}
        {showVillageMap && (
          <VillageMapModal
            unlockedIndex={saveData.unlockedVillageIndex}
            currentVillageId={saveData.currentVillageId}
            onSelectVillage={handleSelectVillage}
            onClose={() => setShowVillageMap(false)}
          />
        )}

        {showTamerProfile && (
          <TamerProfileModal
            tamer={saveData.tamer}
            prizes={saveData.prizeShowcase}
            reputationTitle={saveData.ownerRankTitle}
            totalMatches={saveData.totalMatchesPlayed}
            totalWins={saveData.totalTamesWon}
            onClose={() => setShowTamerProfile(false)}
          />
        )}

        {showPitchModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <div className="relative w-full max-w-2xl rounded-3xl border-2 border-tamil-saffron/60 bg-[#1f120d] p-6 text-left shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-tamil-saffron/30 pb-3">
                <div className="flex items-center space-x-2">
                  <Flag className="w-5 h-5 text-tamil-gold" />
                  <h3 className="text-lg font-bold text-tamil-gold font-display">
                    VAADIVASAL 3D: Architecture & Phase 1
                  </h3>
                </div>
                <button
                  onClick={() => setShowPitchModal(false)}
                  className="px-2.5 py-1 text-xs rounded-lg bg-black/50 hover:bg-tamil-saffron/30 text-tamil-sand"
                >
                  ✕ Close
                </button>
              </div>

              <div className="space-y-3 text-xs md:text-sm text-tamil-sand/90 leading-relaxed max-h-[65vh] overflow-y-auto pr-2">
                <div className="bg-black/40 p-3 rounded-xl border border-tamil-saffron/20">
                  <strong className="text-tamil-gold block mb-1">1. Three.js & React Three Fiber (R3F)</strong>
                  <p>
                    Clean stylized low-poly 3D geometric meshes (Kangayam bull with curved horns & prominent hump, Player #07 with yellow jersey, Vaadivasal striped stone gate, and sandy arena with Kolam decals).
                  </p>
                </div>

                <div className="bg-black/40 p-3 rounded-xl border border-tamil-saffron/20">
                  <strong className="text-emerald-400 block mb-1">2. Layered Tailwind HUD Overlay</strong>
                  <p>
                    Accurate DOM overlay matching Image 1: Top-Left Bull Card & Target (`HOLD FOR 10 SECONDS`), Top-Center Hexagonal Timer (`ROUND 1 | 00:54`), Top-Right Leaderboard (`PLAYERS: 6`), Bottom-Left Virtual Joystick, and Bottom-Right Action Buttons (`RUN`, `DIVE`, `GRAB`).
                  </p>
                </div>

                <div className="bg-black/40 p-3 rounded-xl border border-tamil-saffron/20">
                  <strong className="text-cyan-400 block mb-1">3. Non-Violent Respectful Heritage</strong>
                  <p>
                    Recreated as an athletic test of agility, balance, and mutual respect. Zero weapons, zero harm, zero blood.
                  </p>
                </div>
              </div>

              <div className="pt-2 text-right">
                <button
                  onClick={() => setShowPitchModal(false)}
                  className="px-5 py-2 rounded-xl bg-tamil-saffron text-black font-bold text-xs hover:bg-tamil-gold transition-colors"
                >
                  Back to 3D Game
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
}
