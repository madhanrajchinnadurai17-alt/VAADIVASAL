import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import { IntroScreen } from '../components/IntroScreen';
import { ResultModal } from '../components/ResultModal';
import { BullDashboard } from '../components/BullDashboard';
import { VillageMapModal } from '../components/VillageMapModal';
import { TamerProfileModal } from '../components/TamerProfileModal';
import { GameResultData } from '../game/scenes/TamingScene';
import { soundManager } from '../utils/soundSynthesizer';
import { TAMIL_VILLAGES, VillageEvent } from '../game/villageSystem';
import { BullStats, updateBullGrowth } from '../game/bullCareSystem';
import {
  GameSaveData,
  loadGameData,
  saveGameData,
  WonPrize,
} from '../game/playerProgression';
import { Info, ShieldCheck, Flag, MapPin, Trophy, Utensils } from 'lucide-react';

const DynamicGameContainer = dynamic(
  () => import('../components/GameContainer').then((mod) => mod.GameContainer),
  { ssr: false }
);

type GameState =
  | 'intro'
  | 'bull_dashboard'
  | 'playing_arena'
  | 'training_water'
  | 'training_field'
  | 'village_travel'
  | 'result';

export default function Home() {
  const [saveData, setSaveData] = useState<GameSaveData | null>(null);
  const [gameState, setGameState] = useState<GameState>('intro');
  const [gameResult, setGameResult] = useState<GameResultData | null>(null);
  const [gameSessionId, setGameSessionId] = useState(1);
  const [isMuted, setIsMuted] = useState(false);

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
          <p className="font-bold text-sm">ஏற்றப்படுகிறது... Loading Vaadivasal...</p>
        </div>
      </div>
    );
  }

  const currentVillage =
    TAMIL_VILLAGES.find((v) => v.id === saveData.currentVillageId) || TAMIL_VILLAGES[0];

  // Helper to persist save
  const updateSave = (newData: Partial<GameSaveData>) => {
    const updated: GameSaveData = { ...saveData, ...newData };
    setSaveData(updated);
    saveGameData(updated);
  };

  // --- Handlers ---
  const handleStartArena = () => {
    setGameSessionId((prev) => prev + 1);
    setGameState('playing_arena');
    setGameResult(null);
  };

  const handleStartTraining = (mode: 'water' | 'field') => {
    setGameSessionId((prev) => prev + 1);
    if (mode === 'water') setGameState('training_water');
    else setGameState('training_field');
  };

  const handleTrainingFinished = (reward: any) => {
    if (!saveData) return;

    let updatedBull: BullStats = { ...saveData.bull };

    if (reward.type === 'water') {
      updatedBull.stamina = Math.min(100, updatedBull.stamina + (reward.staminaGain || 5));
      updatedBull.strength = Math.min(100, updatedBull.strength + (reward.strengthGain || 4));
      updatedBull.energy = Math.max(0, updatedBull.energy - (reward.energyCost || 15));
      updatedBull.hydration = Math.min(100, updatedBull.hydration + (reward.hydrationGain || 15));
      updatedBull.waterTrainingSessions += 1;
    } else if (reward.type === 'field') {
      updatedBull.agility = Math.min(100, updatedBull.agility + (reward.agilityGain || 6));
      updatedBull.reaction = Math.min(100, updatedBull.reaction + (reward.reactionGain || 5));
      updatedBull.speed = Math.min(100, updatedBull.speed + (reward.speedGain || 4));
      updatedBull.energy = Math.max(0, updatedBull.energy - (reward.energyCost || 20));
      updatedBull.reactionTrainingSessions += 1;
    }

    const grownBull = updateBullGrowth(updatedBull);
    updateSave({
      bull: grownBull,
      coins: saveData.coins + 25,
      ownerReputation: saveData.ownerReputation + 30,
    });

    setGameState('bull_dashboard');
  };

  const handleGameFinished = (result: GameResultData) => {
    setGameResult(result);
    setGameState('result');

    if (!saveData) return;

    let newCoins = saveData.coins;
    let newReputation = saveData.ownerReputation;
    let newPrizes = [...saveData.prizeShowcase];
    let newUnlockedIndex = saveData.unlockedVillageIndex;

    const currentIdx = TAMIL_VILLAGES.findIndex((v) => v.id === currentVillage.id);

    if (result.success && result.wonPrize) {
      newCoins += Math.round(result.wonPrize.value / 10);
      newReputation += 150;

      const prizeEntry: WonPrize = {
        id: `${result.villageName}_${Date.now()}`,
        name: result.wonPrize.name,
        tamilName: result.wonPrize.tamilName,
        icon: result.wonPrize.icon,
        villageName: result.villageName,
        awardedFor: 'Tamer Victory',
        timestamp: new Date().toLocaleDateString(),
      };
      newPrizes.unshift(prizeEntry);

      // Unlock next village in circuit if completed current highest
      if (currentIdx === saveData.unlockedVillageIndex && currentIdx < TAMIL_VILLAGES.length - 1) {
        newUnlockedIndex = currentIdx + 1;
      }
    } else if (!result.success && result.ownerReward) {
      newReputation += result.ownerReward.reputationBonus;
      newCoins += 40;

      const prizeEntry: WonPrize = {
        id: `${result.villageName}_escape_${Date.now()}`,
        name: result.ownerReward.name,
        tamilName: result.ownerReward.tamilName,
        icon: result.ownerReward.icon,
        villageName: result.villageName,
        awardedFor: 'Bull Escape Champion',
        timestamp: new Date().toLocaleDateString(),
      };
      newPrizes.unshift(prizeEntry);
    }

    // Tamer attribute progression nudge based on performance
    const updatedTamer = {
      ...saveData.tamer,
      timing: Math.min(100, saveData.tamer.timing + (result.success ? 2 : 1)),
      grip: Math.min(100, saveData.tamer.grip + (result.gripsAchieved >= 3 ? 2 : 0)),
      reflex: Math.min(100, saveData.tamer.reflex + 1),
    };

    updateSave({
      coins: newCoins,
      ownerReputation: newReputation,
      prizeShowcase: newPrizes,
      unlockedVillageIndex: newUnlockedIndex,
      tamer: updatedTamer,
      totalMatchesPlayed: saveData.totalMatchesPlayed + 1,
      totalTamesWon: saveData.totalTamesWon + (result.success ? 1 : 0),
      totalBullEscapes: saveData.totalBullEscapes + (result.success ? 0 : 1),
    });
  };

  const handleSelectVillage = (village: VillageEvent) => {
    updateSave({ currentVillageId: village.id });
    setShowVillageMap(false);
    setGameState('village_travel');
    setGameSessionId((prev) => prev + 1);
  };

  const handleUpdateBullCare = (updatedBull: BullStats, coinsDiff: number) => {
    updateSave({
      bull: updatedBull,
      coins: Math.max(0, saveData.coins + coinsDiff),
    });
  };

  const handleExitToMenu = () => {
    soundManager.stopFestiveDrums();
    setGameState('intro');
    setGameResult(null);
  };

  const handleToggleSound = () => {
    const muted = soundManager.toggleMute();
    setIsMuted(muted);
  };

  return (
    <>
      <Head>
        <title>வாடிவாசல் | JALLIKATTU: THE BULL&apos;S JOURNEY</title>
        <meta
          name="description"
          content="Realistic Tamil Nadu Jallikattu Simulation with Bull Owner Training, Village Circuits, Dynamic AI, and Authentic Heritage."
        />
      </Head>

      <main className="min-h-screen bg-tamil-night text-tamil-sand flex flex-col justify-between p-3 md:p-6 selection:bg-tamil-saffron selection:text-black">
        {/* Top Navigation Bar */}
        <header className="w-full max-w-5xl mx-auto flex flex-wrap items-center justify-between py-2.5 px-4 rounded-xl bg-black/50 border border-tamil-saffron/30 backdrop-blur-md mb-4 gap-2">
          <div className="flex items-center space-x-3">
            <span className="text-2xl md:text-3xl">🐂</span>
            <div>
              <h1 className="text-sm md:text-lg font-black tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-tamil-gold to-tamil-saffron font-display">
                JALLIKATTU: THE BULL&apos;S JOURNEY
              </h1>
              <p className="text-[10px] text-tamil-sand/70">
                {currentVillage.tamilName} • {currentVillage.name} Circuit | Rank: {saveData.ownerRankTitle}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowVillageMap(true)}
              className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-black/60 hover:bg-tamil-saffron/20 text-tamil-gold border border-tamil-saffron/30 text-xs font-bold transition-all"
            >
              <MapPin className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Village Map</span>
            </button>

            <button
              onClick={() => setShowTamerProfile(true)}
              className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-black/60 hover:bg-tamil-saffron/20 text-tamil-gold border border-tamil-saffron/30 text-xs font-bold transition-all"
            >
              <Trophy className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Trophies & Profile</span>
            </button>

            <button
              onClick={() => setShowPitchModal(true)}
              className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-tamil-saffron/20 hover:bg-tamil-saffron/30 text-tamil-gold border border-tamil-saffron/40 text-xs font-bold transition-all"
            >
              <Info className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Vision</span>
            </button>
          </div>
        </header>

        {/* Main View Area */}
        <div className="flex-1 flex items-center justify-center w-full max-w-5xl mx-auto">
          {gameState === 'intro' && (
            <IntroScreen
              onStartArena={handleStartArena}
              onOpenBullDashboard={() => setGameState('bull_dashboard')}
              onOpenVillageMap={() => setShowVillageMap(true)}
              onOpenTamerProfile={() => setShowTamerProfile(true)}
              currentVillage={currentVillage}
              bull={saveData.bull}
              coins={saveData.coins}
              isMuted={isMuted}
              onToggleSound={handleToggleSound}
            />
          )}

          {gameState === 'bull_dashboard' && (
            <BullDashboard
              bull={saveData.bull}
              coins={saveData.coins}
              onUpdateBull={handleUpdateBullCare}
              onStartTraining={handleStartTraining}
              onEnterArenaWithBull={handleStartArena}
              onBackToMenu={handleExitToMenu}
            />
          )}

          {gameState === 'playing_arena' && (
            <DynamicGameContainer
              key={`arena_${gameSessionId}`}
              initialScene="ReleaseScene"
              sceneData={{ village: currentVillage }}
              onGameFinished={handleGameFinished}
              onExitToMenu={handleExitToMenu}
            />
          )}

          {gameState === 'training_water' && (
            <DynamicGameContainer
              key={`pond_${gameSessionId}`}
              initialScene="TrainingPondScene"
              sceneData={{ bullStats: saveData.bull }}
              onGameFinished={handleGameFinished}
              onTrainingFinished={handleTrainingFinished}
              onExitToMenu={handleExitToMenu}
            />
          )}

          {gameState === 'training_field' && (
            <DynamicGameContainer
              key={`field_${gameSessionId}`}
              initialScene="TrainingFieldScene"
              sceneData={{ bullStats: saveData.bull }}
              onGameFinished={handleGameFinished}
              onTrainingFinished={handleTrainingFinished}
              onExitToMenu={handleExitToMenu}
            />
          )}

          {gameState === 'village_travel' && (
            <DynamicGameContainer
              key={`travel_${gameSessionId}`}
              initialScene="VillageTravelScene"
              sceneData={{ village: currentVillage }}
              onGameFinished={handleGameFinished}
              onExitToMenu={handleExitToMenu}
            />
          )}

          {gameState === 'result' && gameResult && (
            <>
              <DynamicGameContainer
                key={`result_bg_${gameSessionId}`}
                initialScene="ReleaseScene"
                sceneData={{ village: currentVillage }}
                onGameFinished={handleGameFinished}
                onExitToMenu={handleExitToMenu}
              />
              <ResultModal
                result={gameResult}
                onPlayAgain={handleStartArena}
                onOpenVillageMap={() => setShowVillageMap(true)}
              />
            </>
          )}
        </div>

        {/* Footer */}
        <footer className="w-full max-w-5xl mx-auto mt-4 pt-3 border-t border-tamil-saffron/20 flex flex-col sm:flex-row items-center justify-between text-xs text-tamil-sand/60 gap-2">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Culturally authentic simulation of Tamil Nadu Jallikattu (ஏறு தழுவுதல்). Non-violent, zero animal harm.</span>
          </div>
          <div className="flex items-center space-x-3">
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
            <div className="relative w-full max-w-2xl rounded-2xl border-2 border-tamil-saffron/60 bg-[#1f120d] p-6 text-left shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-tamil-saffron/30 pb-3">
                <div className="flex items-center space-x-2">
                  <Flag className="w-5 h-5 text-tamil-gold" />
                  <h3 className="text-lg font-bold text-tamil-gold font-display">
                    Cultural Vision & Master Architecture
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
                <div className="bg-black/40 p-3 rounded-lg border border-tamil-saffron/20">
                  <strong className="text-tamil-gold block mb-1">1. Two Interconnected Paths</strong>
                  <p>
                    <strong>Bull Owner / Training Mode:</strong> Feed traditional millet/cottonseed feeds, conduct pond water endurance and decoy agility training, and progress from Young Bull to Champion Kangayam.
                    <br />
                    <strong>Player / Tamer Mode:</strong> Compete in famous Tamil Nadu circuits with Participant #07.
                  </p>
                </div>

                <div className="bg-black/40 p-3 rounded-lg border border-tamil-saffron/20">
                  <strong className="text-emerald-400 block mb-1">2. 5-Village Championship Circuit</strong>
                  <p>
                    Avaniyapuram → Palamedu → Alanganallur → Siravayal → State Grand Championship. Distinct arenas, weather conditions, crowd densities, dynamic routes, and prestigious prizes (Silver vessels, cycles, gold coins, TV, royal motorcycles).
                  </p>
                </div>

                <div className="bg-black/40 p-3 rounded-lg border border-tamil-saffron/20">
                  <strong className="text-cyan-400 block mb-1">3. Non-Violent Respectful Heritage</strong>
                  <p>
                    Recreated as an athletic test of agility and mutual respect. Zero weapons, zero harm, zero health bars. Both successful taming and bull escapes are celebrated with traditional awards.
                  </p>
                </div>
              </div>

              <div className="pt-2 text-right">
                <button
                  onClick={() => setShowPitchModal(false)}
                  className="px-5 py-2 rounded-lg bg-tamil-saffron text-black font-bold text-xs hover:bg-tamil-gold transition-colors"
                >
                  Back to Simulation
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
}
