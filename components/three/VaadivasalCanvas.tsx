import React, { useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, ContactShadows } from '@react-three/drei';
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
    isPaused,
    setTargetObjective,
    isNightJallikattu,
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
        {/* Realistic PBR Environment Lighting */}
        <Environment preset={isNightJallikattu ? "night" : "sunset"} />

        {/* Ambient & Directional Sun/Moonlight */}
        <ambientLight intensity={isNightJallikattu ? 0.35 : 0.65} color={isNightJallikattu ? "#60a5fa" : "#fff1e6"} />
        <directionalLight
          position={isNightJallikattu ? [5, 15, -8] : [10, 18, 12]}
          intensity={isNightJallikattu ? 0.8 : 1.5}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
          shadow-camera-near={0.5}
          shadow-camera-far={40}
          shadow-camera-left={-15}
          shadow-camera-right={15}
          shadow-camera-top={15}
          shadow-camera-bottom={-15}
          color={isNightJallikattu ? "#93c5fd" : "#ffedd5"}
        />

        {/* Soft Ground Contact Ambient Occlusion Shadows */}
        <ContactShadows
          position={[0, 0.01, 0]}
          opacity={0.65}
          scale={38}
          blur={2.0}
          far={8}
          color="#000000"
        />

        {/* Dynamic Fog for Atmospheric Depth */}
        <fog
          attach="fog"
          args={[isNightJallikattu ? '#090d16' : '#deb887', isNightJallikattu ? 10 : 16, 42]}
        />

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
