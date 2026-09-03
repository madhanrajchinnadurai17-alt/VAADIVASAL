import React from 'react';
import dynamic from 'next/dynamic';
import { useGameStore } from '../store/useGameStore';
import { LoadingScreen3D } from './screens/LoadingScreen3D';
import { MainMenu3D } from './screens/MainMenu3D';
import { ResultScreen3D } from './screens/ResultScreen3D';
import { GameHUDOverlay } from './hud/GameHUDOverlay';
import { BullDashboard } from './BullDashboard';
import { INITIAL_PLAYER_BULL } from '../game/bullCareSystem';

// Dynamic import for Three.js Canvas to prevent SSR issues
const DynamicVaadivasalCanvas = dynamic(
  () => import('./three/VaadivasalCanvas').then((mod) => mod.VaadivasalCanvas),
  { ssr: false }
);

export const VaadivasalGame3D: React.FC = () => {
  const { screen, setScreen, resetToArena } = useGameStore();

  return (
    <div className="relative w-full max-w-5xl mx-auto aspect-[16/10] min-h-[480px] max-h-[640px] rounded-2xl overflow-hidden shadow-2xl border-2 border-tamil-saffron/40 bg-[#120B09]">
      {/* 1. Loading Screen */}
      {screen === 'loading' && <LoadingScreen3D />}

      {/* 2. Main Menu */}
      {screen === 'main_menu' && <MainMenu3D />}

      {/* 3. Bull Owner Dashboard */}
      {screen === 'bull_dashboard' && (
        <div className="w-full h-full overflow-y-auto p-2 bg-[#120B09]">
          <BullDashboard
            bull={INITIAL_PLAYER_BULL}
            coins={250}
            onUpdateBull={() => {}}
            onStartTraining={() => {}}
            onEnterArenaWithBull={() => resetToArena()}
            onBackToMenu={() => setScreen('main_menu')}
          />
        </div>
      )}

      {/* 4. 3D Arena Screens (Entrance, Gate Release, Arena Interaction, Taming Minigame, Result) */}
      {(screen === 'arena_entrance' ||
        screen === 'vaadivasal_release' ||
        screen === 'arena_interaction' ||
        screen === 'taming_minigame' ||
        screen === 'round_result') && (
        <div className="relative w-full h-full">
          <DynamicVaadivasalCanvas />
          
          {/* Full DOM HUD Overlay matching reference image */}
          {screen !== 'round_result' && <GameHUDOverlay />}

          {/* Round Result Modal */}
          {screen === 'round_result' && <ResultScreen3D />}
        </div>
      )}
    </div>
  );
};
