import React, { useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import {
  Bull3D,
  Player3D,
  AITamers3D,
  VaadivasalGate3D,
  ArenaEnvironment3D,
} from './3DModels';
import { CameraController } from './CameraController';
import { useGameStore } from '../../store/useGameStore';
import { soundManager } from '../../utils/soundSynthesizer';

export const VaadivasalCanvas: React.FC = () => {
  const {
    screen,
    setScreen,
    actionTrigger,
    advanceGripStage,
    updateTimer,
    timerSeconds,
    isPaused,
    setTargetObjective,
  } = useGameStore();

  // Entrance & Release Sequence Timers
  useEffect(() => {
    if (screen === 'arena_entrance') {
      soundManager.startFestiveDrums(120);
      soundManager.playKombuHorn();
      const timer = setTimeout(() => {
        setScreen('vaadivasal_release');
      }, 2400);
      return () => clearTimeout(timer);
    }

    if (screen === 'vaadivasal_release') {
      soundManager.playBullSnort();
      soundManager.playCrowdCheer(3);
      const timer = setTimeout(() => {
        setScreen('arena_interaction');
        setTargetObjective('HOLD THE BULL FOR 10 SECONDS');
      }, 2600);
      return () => clearTimeout(timer);
    }
  }, [screen, setScreen, setTargetObjective]);

  // In-Game Countdown Timer (54s)
  useEffect(() => {
    if (screen !== 'arena_interaction' && screen !== 'taming_minigame') return;
    if (isPaused) return;

    const interval = setInterval(() => {
      const current = useGameStore.getState().timerSeconds;
      if (current > 0) {
        updateTimer(current - 1);
      } else {
        useGameStore.getState().completeRound(false);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [screen, isPaused, updateTimer]);

  // GRAB / DIVE Action Trigger Response
  useEffect(() => {
    if (actionTrigger === 'GRAB' && screen === 'arena_interaction') {
      setScreen('taming_minigame');
      setTargetObjective('TIMING LOCK: TAP GRAB TO HOLD!');
      soundManager.playGripSuccess(1);
    } else if (actionTrigger === 'GRAB' && screen === 'taming_minigame') {
      advanceGripStage();
      soundManager.playGripSuccess(2);
    }
  }, [actionTrigger, screen, setScreen, advanceGripStage, setTargetObjective]);

  return (
    <div className="relative w-full h-full bg-[#120B09] overflow-hidden">
      <Canvas
        shadows
        camera={{ position: [0, 4, 8], fov: 50 }}
        className="w-full h-full"
      >
        {/* Warm Tamil Nadu Sunlight & Ambient Arena Lighting */}
        <ambientLight intensity={0.7} color="#fff1e6" />
        <directionalLight
          position={[10, 18, 12]}
          intensity={1.4}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
          shadow-camera-near={0.5}
          shadow-camera-far={40}
          shadow-camera-left={-15}
          shadow-camera-right={15}
          shadow-camera-top={15}
          shadow-camera-bottom={-15}
          color="#ffedd5"
        />
        <pointLight position={[0, 4, -10]} intensity={0.8} color="#f59e0b" />

        {/* Dynamic Fog for Depth */}
        <fog attach="fog" args={['#deb887', 15, 38]} />

        {/* 3D Scene Components */}
        <CameraController />
        <ArenaEnvironment3D />
        <VaadivasalGate3D />
        <Bull3D position={[0, 0, screen === 'arena_entrance' ? -13 : -4]} />
        <Player3D position={[0, 0, 2.5]} />
        <AITamers3D />
      </Canvas>
    </div>
  );
};
