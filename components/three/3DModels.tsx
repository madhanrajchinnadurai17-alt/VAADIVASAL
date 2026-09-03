import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameStore } from '../../store/useGameStore';
import { soundManager } from '../../utils/soundSynthesizer';

import { BULL_TIERS } from './BullGrowthTiers';

// ================= 1. KANGAYAM BULL 3D MODEL =================
export const Bull3D: React.FC<{
  position?: [number, number, number];
  isReleased?: boolean;
  isTurntable?: boolean;
}> = ({ position = [0, 0, -12], isReleased = true, isTurntable = false }) => {
  const groupRef = useRef<THREE.Group>(null);
  const leftHornRef = useRef<THREE.Mesh>(null);
  const rightHornRef = useRef<THREE.Mesh>(null);
  const frontLeftLegRef = useRef<THREE.Group>(null);
  const frontRightLegRef = useRef<THREE.Group>(null);
  const backLeftLegRef = useRef<THREE.Group>(null);
  const backRightLegRef = useRef<THREE.Group>(null);

  const { screen, bullPersonality, bullTier, isSprinting } = useGameStore();
  const tierConfig = BULL_TIERS[bullTier] || BULL_TIERS.young;

  // Internal AI Steering state
  const targetPos = useRef(new THREE.Vector3(0, 0, -5));
  const nextVeerTime = useRef(0);
  const velocity = useRef(new THREE.Vector3(0, 0, 0));

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    const time = state.clock.getElapsedTime();

    // Apply Tier Scale
    groupRef.current.scale.setScalar(tierConfig.scale);

    if (isTurntable) {
      groupRef.current.rotation.y = time * 0.4;
      return;
    }

    // 1. Walking / Galloping Leg Animation
    const strideSpeed = isReleased ? (screen === 'taming_minigame' ? 18 : 12) : 4;
    const legAngle = Math.sin(time * strideSpeed) * 0.45;

    if (frontLeftLegRef.current) frontLeftLegRef.current.rotation.x = legAngle;
    if (frontRightLegRef.current) frontRightLegRef.current.rotation.x = -legAngle;
    if (backLeftLegRef.current) backLeftLegRef.current.rotation.x = -legAngle;
    if (backRightLegRef.current) backRightLegRef.current.rotation.x = legAngle;

    // Head bobbing & breathing
    groupRef.current.position.y = Math.abs(Math.sin(time * strideSpeed)) * 0.15;

    // 2. Arena AI Steering behavior
    if (screen === 'arena_interaction' && isReleased) {
      if (time > nextVeerTime.current) {
        // Pick new random waypoint in arena
        targetPos.current.set(
          (Math.random() - 0.5) * 14,
          0,
          -12 + Math.random() * 12
        );
        nextVeerTime.current = time + (bullPersonality.veerIntervalMin / 1000 + Math.random() * 0.8);
      }

      // Smooth steering toward targetPos
      const dir = targetPos.current.clone().sub(groupRef.current.position);
      dir.y = 0;
      if (dir.length() > 0.5) {
        dir.normalize();
        const speed = (bullPersonality.speed / 100) * (isSprinting ? 5.5 : 4.2);
        groupRef.current.position.addScaledVector(dir, speed * delta);

        // Face forward
        const targetRot = Math.atan2(dir.x, dir.z);
        groupRef.current.rotation.y = THREE.MathUtils.lerp(
          groupRef.current.rotation.y,
          targetRot,
          delta * 4.5
        );
      }
    } else if (screen === 'vaadivasal_release') {
      // Sprints straight out of Vaadivasal gate toward player
      groupRef.current.position.z = THREE.MathUtils.lerp(groupRef.current.position.z, -3, delta * 2.5);
      groupRef.current.rotation.y = 0;
    } else if (screen === 'taming_minigame') {
      // Bucking / Resisting close-up motion
      groupRef.current.rotation.z = Math.sin(time * 12) * 0.1;
      groupRef.current.rotation.y = Math.cos(time * 6) * 0.15;
    }
  });

  return (
    <group ref={groupRef} position={position}>
      {/* Torso / Body (Muscular dappled charcoal grey) */}
      <mesh position={[0, 1.2, 0]} castShadow>
        <boxGeometry args={[1.3, 1.2, 2.4]} />
        <meshStandardMaterial color="#2d2d30" roughness={0.7} />
      </mesh>

      {/* Prominent Kangayam HUMP (திமில்) */}
      <mesh position={[0, 2.0, -0.4]} castShadow>
        <sphereGeometry args={[0.55, 12, 12]} />
        <meshStandardMaterial color="#1e1e20" roughness={0.6} />
      </mesh>

      {/* White Dappled Hide Patch */}
      <mesh position={[0, 1.35, 0.2]}>
        <boxGeometry args={[1.32, 0.8, 1.2]} />
        <meshStandardMaterial color="#f3f4f6" roughness={0.8} />
      </mesh>

      {/* Head & Neck */}
      <group position={[0, 1.5, -1.3]}>
        {/* Head Block */}
        <mesh castShadow>
          <boxGeometry args={[0.7, 0.8, 1.0]} />
          <meshStandardMaterial color="#1c1917" roughness={0.7} />
        </mesh>

        {/* Snout & Muzzle */}
        <mesh position={[0, -0.2, -0.6]} castShadow>
          <boxGeometry args={[0.5, 0.4, 0.4]} />
          <meshStandardMaterial color="#0c0a09" roughness={0.8} />
        </mesh>

        {/* Nostrils */}
        <mesh position={[-0.14, -0.2, -0.81]}>
          <sphereGeometry args={[0.05, 8, 8]} />
          <meshStandardMaterial color="#dc2626" />
        </mesh>
        <mesh position={[0.14, -0.2, -0.81]}>
          <sphereGeometry args={[0.05, 8, 8]} />
          <meshStandardMaterial color="#dc2626" />
        </mesh>

        {/* Eyes */}
        <mesh position={[-0.36, 0.1, -0.2]}>
          <sphereGeometry args={[0.08, 8, 8]} />
          <meshStandardMaterial color="#f59e0b" emissive="#78350f" />
        </mesh>
        <mesh position={[0.36, 0.1, -0.2]}>
          <sphereGeometry args={[0.08, 8, 8]} />
          <meshStandardMaterial color="#f59e0b" emissive="#78350f" />
        </mesh>

        {/* Massive Sharp Upward Curved Horns (Kangayam Breed Trademark) */}
        {/* Left Horn */}
        <group position={[-0.35, 0.4, -0.1]} rotation={[-0.2, 0, -0.6]}>
          <mesh ref={leftHornRef} position={[0, 0.6, 0]} castShadow>
            <cylinderGeometry args={[0.04, 0.12, 1.3, 10]} />
            <meshStandardMaterial color="#fef08a" roughness={0.3} />
          </mesh>
          {/* Red Kunkumam Tip */}
          <mesh position={[0, 1.25, 0]}>
            <sphereGeometry args={[0.07, 8, 8]} />
            <meshStandardMaterial color="#dc2626" roughness={0.2} />
          </mesh>
        </group>

        {/* Right Horn */}
        <group position={[0.35, 0.4, -0.1]} rotation={[-0.2, 0, 0.6]}>
          <mesh ref={rightHornRef} position={[0, 0.6, 0]} castShadow>
            <cylinderGeometry args={[0.04, 0.12, 1.3, 10]} />
            <meshStandardMaterial color="#fef08a" roughness={0.3} />
          </mesh>
          {/* Red Kunkumam Tip */}
          <mesh position={[0, 1.25, 0]}>
            <sphereGeometry args={[0.07, 8, 8]} />
            <meshStandardMaterial color="#dc2626" roughness={0.2} />
          </mesh>
        </group>

        {/* Marigold Garland / Neck Bell */}
        <mesh position={[0, -0.3, 0.3]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.45, 0.08, 8, 16]} />
          <meshStandardMaterial color="#f97316" roughness={0.6} />
        </mesh>
        <mesh position={[0, -0.7, 0.3]}>
          <sphereGeometry args={[0.12, 8, 8]} />
          <meshStandardMaterial color="#eab308" metalness={0.8} roughness={0.2} />
        </mesh>
      </group>

      {/* 4 Animated Legs */}
      {/* Front Left */}
      <group ref={frontLeftLegRef} position={[-0.45, 1.0, -0.8]}>
        <mesh position={[0, -0.5, 0]} castShadow>
          <cylinderGeometry args={[0.12, 0.14, 1.0, 8]} />
          <meshStandardMaterial color="#1f1f23" />
        </mesh>
      </group>

      {/* Front Right */}
      <group ref={frontRightLegRef} position={[0.45, 1.0, -0.8]}>
        <mesh position={[0, -0.5, 0]} castShadow>
          <cylinderGeometry args={[0.12, 0.14, 1.0, 8]} />
          <meshStandardMaterial color="#1f1f23" />
        </mesh>
      </group>

      {/* Back Left */}
      <group ref={backLeftLegRef} position={[-0.45, 1.0, 0.8]}>
        <mesh position={[0, -0.5, 0]} castShadow>
          <cylinderGeometry args={[0.14, 0.15, 1.0, 8]} />
          <meshStandardMaterial color="#1f1f23" />
        </mesh>
      </group>

      {/* Back Right */}
      <group ref={backRightLegRef} position={[0.45, 1.0, 0.8]}>
        <mesh position={[0, -0.5, 0]} castShadow>
          <cylinderGeometry args={[0.14, 0.15, 1.0, 8]} />
          <meshStandardMaterial color="#1f1f23" />
        </mesh>
      </group>

      {/* Tail */}
      <mesh position={[0, 1.4, 1.3]} rotation={[0.4, 0, 0]}>
        <cylinderGeometry args={[0.03, 0.05, 1.0, 6]} />
        <meshStandardMaterial color="#09090b" />
      </mesh>
    </group>
  );
};

// ================= 2. THIRD-PERSON PLAYER CHARACTER (JALLIKATTU 07) =================
export const Player3D: React.FC<{
  position?: [number, number, number];
}> = ({ position = [0, 0, 2] }) => {
  const groupRef = useRef<THREE.Group>(null);
  const leftLegRef = useRef<THREE.Group>(null);
  const rightLegRef = useRef<THREE.Group>(null);
  const leftArmRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);

  const { joystick, isSprinting, actionTrigger, screen } = useGameStore();

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    const time = state.clock.getElapsedTime();

    // 1. Move Player in 3D Arena via Joystick / Keyboard
    const isMoving = joystick.x !== 0 || joystick.y !== 0;
    const moveSpeed = (isSprinting ? 7.0 : 4.5);

    if (isMoving && screen === 'arena_interaction') {
      groupRef.current.position.x += joystick.x * moveSpeed * delta;
      groupRef.current.position.z += joystick.y * moveSpeed * delta;

      // Clamp player within arena bounds
      groupRef.current.position.x = THREE.MathUtils.clamp(groupRef.current.position.x, -8, 8);
      groupRef.current.position.z = THREE.MathUtils.clamp(groupRef.current.position.z, -10, 5);

      // Rotate to face movement direction
      const angle = Math.atan2(joystick.x, joystick.y);
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, angle + Math.PI, delta * 12);

      // Running Stride Animation
      const legStride = Math.sin(time * (isSprinting ? 18 : 12)) * 0.6;
      if (leftLegRef.current) leftLegRef.current.rotation.x = legStride;
      if (rightLegRef.current) rightLegRef.current.rotation.x = -legStride;
      if (leftArmRef.current) leftArmRef.current.rotation.x = -legStride;
      if (rightArmRef.current) rightArmRef.current.rotation.x = legStride;
    } else {
      // Idle Ready Stance
      if (leftLegRef.current) leftLegRef.current.rotation.x = 0.2;
      if (rightLegRef.current) rightLegRef.current.rotation.x = -0.2;
      if (leftArmRef.current) leftArmRef.current.rotation.x = -0.4;
      if (rightArmRef.current) rightArmRef.current.rotation.x = -0.4;
    }

    // Action Pose (DIVE or GRAB)
    if (actionTrigger === 'DIVE') {
      groupRef.current.rotation.x = -0.6;
      groupRef.current.position.y = 0.4;
    } else if (actionTrigger === 'GRAB') {
      if (leftArmRef.current) leftArmRef.current.rotation.x = -1.2;
      if (rightArmRef.current) rightArmRef.current.rotation.x = -1.2;
    } else {
      groupRef.current.rotation.x = 0;
      groupRef.current.position.y = 0;
    }
  });

  return (
    <group ref={groupRef} position={position}>
      {/* Torso with Yellow "JALLIKATTU 07" Jersey */}
      <mesh position={[0, 1.25, 0]} castShadow>
        <boxGeometry args={[0.65, 0.75, 0.35]} />
        <meshStandardMaterial color="#eab308" roughness={0.6} />
      </mesh>

      {/* Green Collar */}
      <mesh position={[0, 1.62, 0]}>
        <boxGeometry args={[0.35, 0.08, 0.36]} />
        <meshStandardMaterial color="#15803d" />
      </mesh>

      {/* Black Athletic Shorts */}
      <mesh position={[0, 0.8, 0]} castShadow>
        <boxGeometry args={[0.55, 0.35, 0.36]} />
        <meshStandardMaterial color="#18181b" />
      </mesh>

      {/* Head */}
      <mesh position={[0, 1.85, 0]} castShadow>
        <sphereGeometry args={[0.22, 12, 12]} />
        <meshStandardMaterial color="#78350f" roughness={0.7} />
      </mesh>
      {/* Short black hair */}
      <mesh position={[0, 1.95, 0]}>
        <sphereGeometry args={[0.23, 10, 10]} />
        <meshStandardMaterial color="#09090b" roughness={0.9} />
      </mesh>

      {/* Left Leg */}
      <group ref={leftLegRef} position={[-0.18, 0.65, 0]}>
        <mesh position={[0, -0.35, 0]} castShadow>
          <cylinderGeometry args={[0.08, 0.07, 0.7, 8]} />
          <meshStandardMaterial color="#8d5524" />
        </mesh>
      </group>

      {/* Right Leg */}
      <group ref={rightLegRef} position={[0.18, 0.65, 0]}>
        <mesh position={[0, -0.35, 0]} castShadow>
          <cylinderGeometry args={[0.08, 0.07, 0.7, 8]} />
          <meshStandardMaterial color="#8d5524" />
        </mesh>
      </group>

      {/* Left Arm */}
      <group ref={leftArmRef} position={[-0.42, 1.5, 0]}>
        <mesh position={[0, -0.3, 0]} castShadow>
          <cylinderGeometry args={[0.07, 0.06, 0.6, 8]} />
          <meshStandardMaterial color="#8d5524" />
        </mesh>
      </group>

      {/* Right Arm */}
      <group ref={rightArmRef} position={[0.42, 1.5, 0]}>
        <mesh position={[0, -0.3, 0]} castShadow>
          <cylinderGeometry args={[0.07, 0.06, 0.6, 8]} />
          <meshStandardMaterial color="#8d5524" />
        </mesh>
      </group>
    </group>
  );
};

// ================= 3. AI COMPETITOR TAMERS 3D =================
export const AITamers3D: React.FC = () => {
  const competitorPositions = [
    [-4, 0, -4],
    [-2.5, 0, -6],
    [3.5, 0, -5],
    [5, 0, -3],
    [2, 0, -8],
  ];

  return (
    <group>
      {competitorPositions.map((pos, idx) => (
        <group key={idx} position={pos as [number, number, number]}>
          {/* Yellow Jersey */}
          <mesh position={[0, 1.15, 0]} castShadow>
            <boxGeometry args={[0.55, 0.65, 0.3]} />
            <meshStandardMaterial color="#eab308" />
          </mesh>
          {/* Black Shorts */}
          <mesh position={[0, 0.75, 0]}>
            <boxGeometry args={[0.48, 0.3, 0.32]} />
            <meshStandardMaterial color="#18181b" />
          </mesh>
          {/* Head */}
          <mesh position={[0, 1.65, 0]} castShadow>
            <sphereGeometry args={[0.18, 10, 10]} />
            <meshStandardMaterial color="#78350f" />
          </mesh>
        </group>
      ))}
    </group>
  );
};

// ================= 4. VAADIVASAL GATE ARCH 3D =================
export const VaadivasalGate3D: React.FC = () => {
  const { screen } = useGameStore();
  const leftDoorRef = useRef<THREE.Group>(null);
  const rightDoorRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    // Open Gate during release sequence
    if (screen === 'vaadivasal_release' || screen === 'arena_interaction' || screen === 'taming_minigame') {
      if (leftDoorRef.current) {
        leftDoorRef.current.rotation.y = THREE.MathUtils.lerp(leftDoorRef.current.rotation.y, -1.8, delta * 3);
      }
      if (rightDoorRef.current) {
        rightDoorRef.current.rotation.y = THREE.MathUtils.lerp(rightDoorRef.current.rotation.y, 1.8, delta * 3);
      }
    }
  });

  return (
    <group position={[0, 0, -14]}>
      {/* Left Striped Pillar */}
      <mesh position={[-2.8, 3.0, 0]} castShadow>
        <boxGeometry args={[1.2, 6.0, 1.2]} />
        <meshStandardMaterial color="#f8fafc" />
      </mesh>
      {/* Red Stripes on Left Pillar */}
      <mesh position={[-2.8, 1.5, 0]}>
        <boxGeometry args={[1.22, 0.6, 1.22]} />
        <meshStandardMaterial color="#dc2626" />
      </mesh>
      <mesh position={[-2.8, 3.5, 0]}>
        <boxGeometry args={[1.22, 0.6, 1.22]} />
        <meshStandardMaterial color="#dc2626" />
      </mesh>

      {/* Right Striped Pillar */}
      <mesh position={[2.8, 3.0, 0]} castShadow>
        <boxGeometry args={[1.2, 6.0, 1.2]} />
        <meshStandardMaterial color="#f8fafc" />
      </mesh>
      {/* Red Stripes on Right Pillar */}
      <mesh position={[2.8, 1.5, 0]}>
        <boxGeometry args={[1.22, 0.6, 1.22]} />
        <meshStandardMaterial color="#dc2626" />
      </mesh>
      <mesh position={[2.8, 3.5, 0]}>
        <boxGeometry args={[1.22, 0.6, 1.22]} />
        <meshStandardMaterial color="#dc2626" />
      </mesh>

      {/* Top Arch Beam */}
      <mesh position={[0, 5.5, 0]} castShadow>
        <boxGeometry args={[7.2, 1.2, 1.4]} />
        <meshStandardMaterial color="#f8fafc" />
      </mesh>

      {/* Center Tamil Signboard Board ("வாடிவாசல்") */}
      <mesh position={[0, 5.5, 0.72]}>
        <boxGeometry args={[3.2, 0.7, 0.1]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>

      {/* Blue Iron Gate Doors (Opening) */}
      <group ref={leftDoorRef} position={[-2.2, 0, 0]}>
        <mesh position={[1.1, 2.0, 0]} castShadow>
          <boxGeometry args={[2.2, 4.0, 0.15]} />
          <meshStandardMaterial color="#1d4ed8" metalness={0.6} />
        </mesh>
      </group>

      <group ref={rightDoorRef} position={[2.2, 0, 0]}>
        <mesh position={[-1.1, 2.0, 0]} castShadow>
          <boxGeometry args={[2.2, 4.0, 0.15]} />
          <meshStandardMaterial color="#1d4ed8" metalness={0.6} />
        </mesh>
      </group>
    </group>
  );
};

// ================= 5. ARENA ENVIRONMENT 3D =================
export const ArenaEnvironment3D: React.FC = () => {
  return (
    <group>
      {/* Sandy Arena Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[40, 50]} />
        <meshStandardMaterial color="#d4a373" roughness={0.9} />
      </mesh>

      {/* Central Sacred Kolam Ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, -4]}>
        <ringGeometry args={[3.8, 4.0, 32]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.6} />
      </mesh>

      {/* Blue Perimeter Double Barricades */}
      {/* Left Fence */}
      <mesh position={[-9, 1.5, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <boxGeometry args={[40, 3, 0.2]} />
        <meshStandardMaterial color="#2563eb" wireframe={false} />
      </mesh>

      {/* Right Fence */}
      <mesh position={[9, 1.5, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <boxGeometry args={[40, 3, 0.2]} />
        <meshStandardMaterial color="#2563eb" wireframe={false} />
      </mesh>

      {/* Spectator Galleries on Sides */}
      <mesh position={[-11, 2.5, 0]}>
        <boxGeometry args={[3, 5, 38]} />
        <meshStandardMaterial color="#18181b" />
      </mesh>
      <mesh position={[11, 2.5, 0]}>
        <boxGeometry args={[3, 5, 38]} />
        <meshStandardMaterial color="#18181b" />
      </mesh>
    </group>
  );
};
