import React, { useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
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

// ============================================================================
// ARENA PHYSICS & BULL AI STATE MACHINE COORDINATOR (STEP 1, 2, 3)
// ============================================================================
const ArenaLivePhysicsAndAICoordinator: React.FC = () => {
  const {
    screen,
    joystick,
    isSprinting,
    actionTrigger,
    playerStamina,
    depletePlayerStamina,
    recoverPlayerStamina,
    bullStamina,
    updateBullStamina,
    setBullAIState,
    setBullTargetId,
    setLiveWorldTransforms,
    applyKnockback,
    triggerAIInteraction,
    endAIInteraction,
    updateLiveCoords,
  } = useGameStore();

  // Internal Physics Vectors (reused to avoid GC stutter)
  const playerPosRef = useRef(new THREE.Vector3(0, 0, 2.5));
  const playerVelRef = useRef(new THREE.Vector3(0, 0, 0));
  const bullPosRef = useRef(new THREE.Vector3(0, 0, -4.0));
  const bullVelRef = useRef(new THREE.Vector3(0, 0, 0));
  const bullRotationYRef = useRef(0);

  // Bull AI State Machine Timers & Internal Targets
  const aiStateRef = useRef<'idle' | 'alert' | 'charge' | 'attack' | 'flee'>('idle');
  const aiStateTimerRef = useRef(0);
  const currentTargetPosRef = useRef(new THREE.Vector3(0, 0, 2.5));
  const currentTargetIdRef = useRef<string | null>('player');

  // Competitor AI Tamers World Positions
  const aiTamersRef = useRef([
    { id: '1', pos: new THREE.Vector3(-4.5, 0, -3.0), bib: '01', name: 'MURUGAN' },
    { id: '2', pos: new THREE.Vector3(-2.8, 0, -5.5), bib: '02', name: 'SIVA' },
    { id: '3', pos: new THREE.Vector3(3.2, 0, -4.5), bib: '03', name: 'KARTHIK' },
    { id: '4', pos: new THREE.Vector3(5.0, 0, -2.5), bib: '04', name: 'AJITH' },
    { id: '5', pos: new THREE.Vector3(2.2, 0, -7.0), bib: '05', name: 'DINESH' },
  ]);

  useFrame((state, delta) => {
    // Only simulate during active arena gameplay
    if (screen !== 'arena_interaction' && screen !== 'taming_minigame') return;

    const clampedDelta = Math.min(delta, 0.05); // Prevent huge time steps on tab switch
    const time = state.clock.getElapsedTime();

    // ========================================================================
    // 1. PLAYER PHYSICS SIMULATION (ACCELERATION, MOMENTUM, SPRINT & STAMINA)
    // ========================================================================
    if (screen === 'arena_interaction') {
      const isMoving = joystick.x !== 0 || joystick.y !== 0;
      const canSprint = isSprinting && playerStamina > 5;
      const maxSpeed = canSprint ? 7.2 : 4.2;

      // Deplete stamina while sprinting; recover while walking/standing
      if (isMoving && canSprint) {
        depletePlayerStamina(clampedDelta * 18);
      } else {
        recoverPlayerStamina(clampedDelta * 12);
      }

      // Desired velocity from joystick inputs
      const targetVx = joystick.x * maxSpeed;
      const targetVz = joystick.y * maxSpeed;

      // Realistic Inertia: Accelerate towards target velocity
      const accelRate = 14.0;
      playerVelRef.current.x = THREE.MathUtils.lerp(playerVelRef.current.x, targetVx, clampedDelta * accelRate);
      playerVelRef.current.z = THREE.MathUtils.lerp(playerVelRef.current.z, targetVz, clampedDelta * accelRate);

      // Integrate position
      playerPosRef.current.x += playerVelRef.current.x * clampedDelta;
      playerPosRef.current.z += playerVelRef.current.z * clampedDelta;

      // Arena boundary collision with elastic bounce restitution
      const boundX = 8.0;
      const boundZ = 11.5;
      if (playerPosRef.current.x > boundX) {
        playerPosRef.current.x = boundX;
        playerVelRef.current.x *= -0.3;
      } else if (playerPosRef.current.x < -boundX) {
        playerPosRef.current.x = -boundX;
        playerVelRef.current.x *= -0.3;
      }

      if (playerPosRef.current.z > boundZ) {
        playerPosRef.current.z = boundZ;
        playerVelRef.current.z *= -0.3;
      } else if (playerPosRef.current.z < -boundZ) {
        playerPosRef.current.z = -boundZ;
        playerVelRef.current.z *= -0.3;
      }
    }

    // ========================================================================
    // 2. COMPETITOR AI TAMERS AGENT SIMULATION
    // ========================================================================
    const aiListForMinimap = aiTamersRef.current.map((tamer, idx) => {
      // Tamers maintain circular positions, dodging if bull charges near them
      const distToBull = tamer.pos.distanceTo(bullPosRef.current);
      if (distToBull < 2.5 && aiStateRef.current === 'charge') {
        // Evade away from bull
        const evadeDir = new THREE.Vector3().subVectors(tamer.pos, bullPosRef.current).normalize();
        tamer.pos.addScaledVector(evadeDir, clampedDelta * 4.5);
      } else {
        // Gentle circling patrol
        const baseAngle = (idx * Math.PI * 2) / 5 + time * 0.15;
        const targetRadiusX = 4.0 + Math.sin(time * 0.5 + idx) * 1.5;
        const targetRadiusZ = 5.0 + Math.cos(time * 0.5 + idx) * 1.5;
        const targetX = Math.cos(baseAngle) * targetRadiusX;
        const targetZ = -4.0 + Math.sin(baseAngle) * targetRadiusZ;
        tamer.pos.x = THREE.MathUtils.lerp(tamer.pos.x, targetX, clampedDelta * 1.2);
        tamer.pos.z = THREE.MathUtils.lerp(tamer.pos.z, targetZ, clampedDelta * 1.2);
      }

      // Clamp within barricades
      tamer.pos.x = Math.max(-7.8, Math.min(7.8, tamer.pos.x));
      tamer.pos.z = Math.max(-11.0, Math.min(11.0, tamer.pos.z));

      return {
        id: tamer.id,
        x: tamer.pos.x,
        z: tamer.pos.z,
        bib: tamer.bib,
      };
    });

    // ========================================================================
    // 3. BULL AI STATE MACHINE & INERTIAL PHYSICS (MASS ~500KG)
    // ========================================================================
    if (screen === 'taming_minigame') {
      // In Taming minigame: Bull thrashes, bucks, and attempts to dislodge player
      aiStateRef.current = 'attack';
      setBullAIState('attack');

      // Lateral thrash movement
      bullPosRef.current.x += Math.sin(time * 8) * 0.05;
      bullPosRef.current.z += Math.cos(time * 6) * 0.04;
      bullRotationYRef.current += Math.sin(time * 6) * 0.06;
      updateBullStamina(Math.max(0, bullStamina - clampedDelta * 6));
    } else {
      aiStateTimerRef.current += clampedDelta;

      // State Machine Transitions
      switch (aiStateRef.current) {
        case 'idle': {
          // Bull catches breath, snorts, scans for targets
          updateBullStamina(Math.min(100, bullStamina + clampedDelta * 8));

          if (aiStateTimerRef.current > 1.8) {
            // Pick next target (Player #07 or one of the 5 AI Tamers)
            const candidates = [
              { id: 'player', pos: playerPosRef.current, dist: bullPosRef.current.distanceTo(playerPosRef.current) },
              ...aiTamersRef.current.map((t) => ({
                id: t.id,
                pos: t.pos,
                dist: bullPosRef.current.distanceTo(t.pos),
              })),
            ];

            // Weight target selection: Closer targets and sprinting targets attract more aggro
            candidates.sort((a, b) => {
              const weightA = a.dist - (a.id === 'player' && isSprinting ? 3.0 : 0);
              const weightB = b.dist - (b.id === 'player' && isSprinting ? 3.0 : 0);
              return weightA - weightB;
            });

            const chosen = candidates[0];
            currentTargetIdRef.current = chosen.id;
            currentTargetPosRef.current.copy(chosen.pos);
            setBullTargetId(chosen.id);

            aiStateRef.current = 'alert';
            setBullAIState('alert');
            aiStateTimerRef.current = 0;
            soundManager.playBullSnort();
          }
          break;
        }

        case 'alert': {
          // Lock eyes with target, lower horns, stamp hoof
          const dir = new THREE.Vector3().subVectors(currentTargetPosRef.current, bullPosRef.current);
          const targetAngle = Math.atan2(dir.x, dir.z);

          // Rotate towards target with realistic turning rate
          bullRotationYRef.current = THREE.MathUtils.lerp(
            bullRotationYRef.current,
            targetAngle,
            clampedDelta * 4.5
          );

          if (aiStateTimerRef.current > 1.0) {
            aiStateRef.current = 'charge';
            setBullAIState('charge');
            aiStateTimerRef.current = 0;
            soundManager.playCrowdCheer(1);
          }
          break;
        }

        case 'charge': {
          // Explosive acceleration along heading
          const chargeSpeed = bullStamina > 30 ? 8.2 : 5.0;
          updateBullStamina(Math.max(0, bullStamina - clampedDelta * 12));

          // Move target tracking position if target is player
          if (currentTargetIdRef.current === 'player') {
            currentTargetPosRef.current.copy(playerPosRef.current);
          }

          // Inertial turning: heavy bull cannot change direction instantaneously
          const toTarget = new THREE.Vector3().subVectors(currentTargetPosRef.current, bullPosRef.current);
          const desiredAngle = Math.atan2(toTarget.x, toTarget.z);

          // Angular velocity limit (~2.2 rad/sec)
          let angleDiff = desiredAngle - bullRotationYRef.current;
          while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
          while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
          const maxTurn = clampedDelta * 2.4;
          bullRotationYRef.current += Math.max(-maxTurn, Math.min(maxTurn, angleDiff));

          // Forward thrust along rotation
          bullPosRef.current.x += Math.sin(bullRotationYRef.current) * chargeSpeed * clampedDelta;
          bullPosRef.current.z += Math.cos(bullRotationYRef.current) * chargeSpeed * clampedDelta;

          // Check if reached target
          const distToTarget = bullPosRef.current.distanceTo(currentTargetPosRef.current);

          // Player collision during charge
          const distToPlayer = bullPosRef.current.distanceTo(playerPosRef.current);
          if (distToPlayer < 1.4 && actionTrigger !== 'DIVE') {
            // Bull hits player! Knockback impulse & crowd reaction
            const knockbackDir = new THREE.Vector3()
              .subVectors(playerPosRef.current, bullPosRef.current)
              .normalize();
            applyKnockback(knockbackDir.x * 9.0, knockbackDir.z * 9.0);
            soundManager.playGripMiss();

            aiStateRef.current = 'attack';
            setBullAIState('attack');
            aiStateTimerRef.current = 0;
            break;
          }

          if (distToTarget < 1.5 || aiStateTimerRef.current > 3.8 || bullStamina <= 10) {
            aiStateRef.current = bullStamina <= 15 ? 'flee' : 'attack';
            setBullAIState(aiStateRef.current);
            aiStateTimerRef.current = 0;
          }
          break;
        }

        case 'attack': {
          // Violent horn sweep / buck
          if (aiStateTimerRef.current > 1.2) {
            aiStateRef.current = 'idle';
            setBullAIState('idle');
            aiStateTimerRef.current = 0;
          }
          break;
        }

        case 'flee': {
          // Bull tires and wheels away from tamers toward open space
          updateBullStamina(Math.min(100, bullStamina + clampedDelta * 10));

          // Trot forward avoiding center
          const fleeSpeed = 4.2;
          bullPosRef.current.x += Math.sin(bullRotationYRef.current) * fleeSpeed * clampedDelta;
          bullPosRef.current.z += Math.cos(bullRotationYRef.current) * fleeSpeed * clampedDelta;

          if (aiStateTimerRef.current > 2.8 && bullStamina > 40) {
            aiStateRef.current = 'idle';
            setBullAIState('idle');
            aiStateTimerRef.current = 0;
          }
          break;
        }
      }

      // Bull Arena Boundary Clamping with steering deflection
      const arenaBoundX = 7.8;
      const arenaBoundZ = 11.0;
      if (Math.abs(bullPosRef.current.x) > arenaBoundX || Math.abs(bullPosRef.current.z) > arenaBoundZ) {
        bullPosRef.current.x = Math.max(-arenaBoundX, Math.min(arenaBoundX, bullPosRef.current.x));
        bullPosRef.current.z = Math.max(-arenaBoundZ, Math.min(arenaBoundZ, bullPosRef.current.z));
        // Deflect heading away from wall
        bullRotationYRef.current += Math.PI * 0.6;
        aiStateRef.current = 'idle';
        setBullAIState('idle');
      }
    }

    // ========================================================================
    // 4. OMNIDIRECTIONAL COLLISION & THIMIL FLANK GRAB DETECTION
    // ========================================================================
    const distancePlayerToBull = playerPosRef.current.distanceTo(bullPosRef.current);

    // Relative displacement vector from bull to player
    const relX = playerPosRef.current.x - bullPosRef.current.x;
    const relZ = playerPosRef.current.z - bullPosRef.current.z;

    // Bull's forward facing direction
    const bullForwardX = Math.sin(bullRotationYRef.current);
    const bullForwardZ = Math.cos(bullRotationYRef.current);

    // Forward alignment dot product (-1 = rear/tail, 0 = pure flank, +1 = direct cranium/horns)
    const forwardDot = distancePlayerToBull > 0.05
      ? (relX * bullForwardX + relZ * bullForwardZ) / distancePlayerToBull
      : 0;

    // Jallikattu Rules: Touching horns or tail is prohibited/foul.
    // Only the Thimil (dorsal hump) flanked approach is valid for embracing.
    const isFlankAligned = Math.abs(forwardDot) <= 0.82;
    const isHeadOnFoul = distancePlayerToBull <= 2.2 && forwardDot > 0.82;
    const canGrab = distancePlayerToBull <= 2.05 && isFlankAligned;

    // Sync high-precision live transforms to master Zustand store
    setLiveWorldTransforms(
      { x: playerPosRef.current.x, y: 0, z: playerPosRef.current.z },
      { x: bullPosRef.current.x, y: 0, z: bullPosRef.current.z },
      bullRotationYRef.current,
      canGrab,
      distancePlayerToBull,
      isHeadOnFoul
    );

    updateLiveCoords(
      { x: playerPosRef.current.x, z: playerPosRef.current.z },
      { x: bullPosRef.current.x, z: bullPosRef.current.z },
      aiListForMinimap
    );
  });

  return null;
};

// ============================================================================
// MASTER THREE.JS CANVAS CONTAINER
// ============================================================================
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
    canGrabBull,
    weather,
  } = useGameStore();

  // Dynamic Lighting and Fog parameters based on Weather & Night Mode
  const lightColor = isNightJallikattu
    ? '#93c5fd'
    : weather === 'overcast'
    ? '#e2e8f0'
    : weather === 'dust_storm'
    ? '#f59e0b'
    : '#ffedd5';

  const lightIntensity = isNightJallikattu
    ? 0.8
    : weather === 'overcast'
    ? 0.85
    : weather === 'dust_storm'
    ? 0.7
    : 1.6;

  const fogColor = isNightJallikattu
    ? '#090d16'
    : weather === 'overcast'
    ? '#94a3b8'
    : weather === 'dust_storm'
    ? '#b45309'
    : '#deb887';

  const fogNear = isNightJallikattu ? 10 : weather === 'dust_storm' ? 5 : 14;
  const fogFar = isNightJallikattu ? 42 : weather === 'dust_storm' ? 22 : 44;

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
        setTargetObjective('APPROACH THE FLANK & HOLD FOR 10 SECONDS');
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

  // Dynamic Action Response: GRAB attaches anywhere in arena when in proximity
  useEffect(() => {
    if (actionTrigger === 'GRAB' && screen === 'arena_interaction') {
      if (canGrabBull) {
        setScreen('taming_minigame');
        setTargetObjective('TIMING LOCK: TAP GRAB TO MAINTAIN HOLD!');
        soundManager.playGripSuccess(1);
      } else {
        // Near miss sound if too far
        soundManager.playGripMiss();
      }
    } else if (actionTrigger === 'GRAB' && screen === 'taming_minigame') {
      advanceGripStage();
      soundManager.playGripSuccess(2);
    }
  }, [actionTrigger, screen, canGrabBull, setScreen, advanceGripStage, setTargetObjective]);

  return (
    <div className="relative w-full h-full bg-[#120B09] overflow-hidden">
      <Canvas
        shadows
        camera={{ position: [0, 4.5, 8.5], fov: 50 }}
        className="w-full h-full"
      >
        {/* Realistic PBR Environment Lighting */}
        <Environment preset={isNightJallikattu ? 'night' : 'sunset'} />

        {/* Ambient & Directional Sun/Moonlight */}
        <ambientLight
          intensity={isNightJallikattu ? 0.35 : weather === 'overcast' ? 0.5 : 0.7}
          color={isNightJallikattu ? '#60a5fa' : weather === 'overcast' ? '#cbd5e1' : '#fff1e6'}
        />
        <directionalLight
          position={isNightJallikattu ? [5, 15, -8] : [10, 18, 12]}
          intensity={lightIntensity}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
          shadow-camera-near={0.5}
          shadow-camera-far={40}
          shadow-camera-left={-15}
          shadow-camera-right={15}
          shadow-camera-top={15}
          shadow-camera-bottom={-15}
          color={lightColor}
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
          args={[fogColor, fogNear, fogFar]}
        />

        {/* Physics and AI Simulation Coordinator */}
        <ArenaLivePhysicsAndAICoordinator />

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
