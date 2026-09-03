import React from 'react';
import dynamic from 'next/dynamic';
import { useGameStore } from '../store/useGameStore';
import { LoadingScreen3D } from './screens/LoadingScreen3D';
import { MainMenu3D } from './screens/MainMenu3D';
import { BullSelection3D } from './screens/BullSelection3D';
import { BullCare3D } from './screens/BullCare3D';
import { PondTraining3D } from './screens/training/PondTraining3D';
import { SprintTraining3D } from './screens/training/SprintTraining3D';
import { ReactionTraining3D } from './screens/training/ReactionTraining3D';
import { BullOwnerReward3D } from './screens/BullOwnerReward3D';
import { WorldMap3D } from './screens/WorldMap3D';
import { TravelTransition3D } from './screens/TravelTransition3D';
import { GrandFinal3D } from './screens/GrandFinal3D';
import { SeasonReward3D } from './screens/SeasonReward3D';
import { TrophyHall3D } from './screens/TrophyHall3D';
import { VictoryCelebration3D } from './screens/VictoryCelebration3D';
import { Epilogue3D } from './screens/Epilogue3D';
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

      {/* 3. Phase 2: Bull Selection (Turntable 3D) */}
      {screen === 'bull_selection' && <BullSelection3D />}

      {/* 4. Phase 2: Bull Care & Paddock Management */}
      {screen === 'bull_care' && <BullCare3D />}

      {/* 5. Phase 2: Training Mini-Games */}
      {screen === 'training_pond' && <PondTraining3D />}
      {screen === 'training_sprint' && <SprintTraining3D />}
      {screen === 'training_reaction' && <ReactionTraining3D />}

      {/* 6. Phase 2: Bull Owner Reward / Stat Gains */}
      {screen === 'bull_reward' && <BullOwnerReward3D />}

      {/* 7. Phase 3: World Map & Circuit Journey */}
      {screen === 'world_map' && <WorldMap3D />}

      {/* 8. Phase 3: Travel Transition */}
      {screen === 'travel_transition' && <TravelTransition3D />}

      {/* 9. Phase 3: State Grand Championship Screen */}
      {screen === 'grand_final' && <GrandFinal3D />}

      {/* 10. Phase 4: Season Champion Reward Screen */}
      {screen === 'season_reward' && <SeasonReward3D />}

      {/* 11. Phase 4: Trophy Hall / Championship Legacy */}
      {screen === 'trophy_hall' && <TrophyHall3D />}

      {/* 12. Phase 4: Victory Celebration (Crowd Hoist) */}
      {screen === 'victory_celebration' && <VictoryCelebration3D />}

      {/* 13. Phase 4: Epilogue & Unlocked Modes */}
      {screen === 'epilogue' && <Epilogue3D />}

      {/* 14. Bull Owner Legacy Dashboard */}
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

      {/* 15. 3D Arena Screens (Entrance, Gate Release, Arena Interaction, Taming Minigame, Result) */}
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
