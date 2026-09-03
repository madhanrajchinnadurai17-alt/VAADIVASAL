import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameStore } from '../../store/useGameStore';
import { BULL_TIERS } from './BullGrowthTiers';

// ================= 1. KANGAYAM NATIVE BULL 3D (CHARGING FROM VAADIVASAL) =================
export const Bull3D: React.FC<{
  position?: [number, number, number];
  isReleased?: boolean;
  isTurntable?: boolean;
}> = ({ position = [0, 0, -4], isReleased = true, isTurntable = false }) => {
  const groupRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);
  const humpRef = useRef<THREE.Mesh>(null);
  const frontLeftLegRef = useRef<THREE.Group>(null);
  const frontRightLegRef = useRef<THREE.Group>(null);
  const backLeftLegRef = useRef<THREE.Group>(null);
  const backRightLegRef = useRef<THREE.Group>(null);

  const { bullTier } = useGameStore();
  const tierConfig = BULL_TIERS[bullTier] || BULL_TIERS.young;

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    const time = state.clock.getElapsedTime();

    if (isTurntable) {
      groupRef.current.rotation.y += delta * 0.7;
      return;
    }

    if (isReleased) {
      // Galloping charge towards the camera/player
      const gallop = Math.sin(time * 12);
      groupRef.current.position.y = position[1] + Math.abs(gallop) * 0.15;

      if (frontLeftLegRef.current) frontLeftLegRef.current.rotation.x = Math.sin(time * 12) * 0.7;
      if (frontRightLegRef.current) frontRightLegRef.current.rotation.x = -Math.sin(time * 12) * 0.7;
      if (backLeftLegRef.current) backLeftLegRef.current.rotation.x = -Math.sin(time * 12) * 0.6;
      if (backRightLegRef.current) backRightLegRef.current.rotation.x = Math.sin(time * 12) * 0.6;

      if (headRef.current) {
        headRef.current.rotation.x = 0.2 + Math.sin(time * 12) * 0.15;
        headRef.current.rotation.y = Math.sin(time * 4) * 0.25;
      }
    } else {
      const breath = Math.sin(time * 3) * 0.04;
      groupRef.current.position.y = position[1] + breath;
      if (headRef.current) {
        headRef.current.rotation.y = Math.sin(time * 2) * 0.2;
        headRef.current.rotation.x = 0.1 + Math.sin(time * 4) * 0.08;
      }
    }
  });

  return (
    <group
      ref={groupRef}
      position={position}
      scale={[tierConfig.scale, tierConfig.scale, tierConfig.scale]}
    >
      {/* 1. Muscular Torso - Dappled Black/Grey/White Kangayam Coat */}
      <mesh position={[0, 1.4, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.1, 1.3, 2.2]} />
        <meshStandardMaterial
          color="#383838"
          roughness={0.7}
          metalness={0.15}
        />
      </mesh>

      {/* 2. Distinctive Kangayam Hump */}
      <mesh
        ref={humpRef}
        position={[0, 2.2, -0.4]}
        scale={[1, tierConfig.humpScale / 0.55, 1]}
        castShadow
      >
        <sphereGeometry args={[0.55, 16, 16]} />
        <meshStandardMaterial
          color="#1f1f1f"
          roughness={0.75}
        />
      </mesh>

      {/* 3. Bull Neck & Head Group */}
      <group ref={headRef} position={[0, 1.7, -1.2]}>
        {/* Head Base */}
        <mesh position={[0, 0, -0.3]} castShadow>
          <boxGeometry args={[0.7, 0.75, 0.8]} />
          <meshStandardMaterial color="#262626" roughness={0.7} />
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

        {/* Massive Sharp Upward Curved Horns (Kangayam Breed) */}
        {/* Left Horn */}
        <group position={[-0.35, 0.4, -0.1]} rotation={[-0.2, 0, -0.6]}>
          <mesh position={[0, 0.6, 0]} castShadow>
            <cylinderGeometry args={[0.04, 0.12, 1.3, 10]} />
            <meshStandardMaterial color="#fef08a" roughness={0.3} />
          </mesh>
          <mesh position={[0, 1.25, 0]}>
            <sphereGeometry args={[0.07, 8, 8]} />
            <meshStandardMaterial color="#dc2626" roughness={0.2} />
          </mesh>
        </group>

        {/* Right Horn */}
        <group position={[0.35, 0.4, -0.1]} rotation={[-0.2, 0, 0.6]}>
          <mesh position={[0, 0.6, 0]} castShadow>
            <cylinderGeometry args={[0.04, 0.12, 1.3, 10]} />
            <meshStandardMaterial color="#fef08a" roughness={0.3} />
          </mesh>
          <mesh position={[0, 1.25, 0]}>
            <sphereGeometry args={[0.07, 8, 8]} />
            <meshStandardMaterial color="#dc2626" roughness={0.2} />
          </mesh>
        </group>

        {/* Marigold Garland & Neck Bell */}
        <mesh position={[0, -0.3, 0.3]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.45, 0.08, 8, 16]} />
          <meshStandardMaterial color="#f97316" roughness={0.6} />
        </mesh>
        <mesh position={[0, -0.7, 0.3]}>
          <sphereGeometry args={[0.12, 8, 8]} />
          <meshStandardMaterial color="#facc15" metalness={0.9} roughness={0.2} />
        </mesh>
      </group>

      {/* 4 Sturdy Legs */}
      <group ref={frontLeftLegRef} position={[-0.45, 1.0, -0.8]}>
        <mesh position={[0, -0.5, 0]} castShadow>
          <cylinderGeometry args={[0.12, 0.14, 1.0, 8]} />
          <meshStandardMaterial color="#1f1f23" />
        </mesh>
      </group>

      <group ref={frontRightLegRef} position={[0.45, 1.0, -0.8]}>
        <mesh position={[0, -0.5, 0]} castShadow>
          <cylinderGeometry args={[0.12, 0.14, 1.0, 8]} />
          <meshStandardMaterial color="#1f1f23" />
        </mesh>
      </group>

      <group ref={backLeftLegRef} position={[-0.45, 1.0, 0.8]}>
        <mesh position={[0, -0.5, 0]} castShadow>
          <cylinderGeometry args={[0.14, 0.15, 1.0, 8]} />
          <meshStandardMaterial color="#1f1f23" />
        </mesh>
      </group>

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

// ================= 2. THIRD-PERSON PLAYER CHARACTER (YELLOW "JALLIKATTU 07" JERSEY) =================
export const Player3D: React.FC<{
  position?: [number, number, number];
}> = ({ position = [0, 0, 2.5] }) => {
  const groupRef = useRef<THREE.Group>(null);
  const leftLegRef = useRef<THREE.Group>(null);
  const rightLegRef = useRef<THREE.Group>(null);
  const leftArmRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);

  const { joystick, isSprinting, actionTrigger, screen } = useGameStore();

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    const time = state.clock.getElapsedTime();

    const isMoving = joystick.x !== 0 || joystick.y !== 0;
    const moveSpeed = (isSprinting ? 7.0 : 4.5);

    if (isMoving && screen === 'arena_interaction') {
      groupRef.current.position.x += joystick.x * moveSpeed * delta;
      groupRef.current.position.z += joystick.y * moveSpeed * delta;

      // Bound within arena fences
      groupRef.current.position.x = Math.max(-8, Math.min(8, groupRef.current.position.x));
      groupRef.current.position.z = Math.max(-12, Math.min(12, groupRef.current.position.z));

      // Face movement direction
      const angle = Math.atan2(joystick.x, joystick.y);
      groupRef.current.rotation.y = angle;

      // Running swing
      if (leftLegRef.current) leftLegRef.current.rotation.x = Math.sin(time * 14) * 0.8;
      if (rightLegRef.current) rightLegRef.current.rotation.x = -Math.sin(time * 14) * 0.8;
      if (leftArmRef.current) leftArmRef.current.rotation.x = -Math.sin(time * 14) * 0.8;
      if (rightArmRef.current) rightArmRef.current.rotation.x = Math.sin(time * 14) * 0.8;
    } else if (screen === 'taming_minigame' || actionTrigger === 'GRAB') {
      groupRef.current.position.set(0.7, 0, -3.8);
      groupRef.current.rotation.y = -Math.PI / 2;
      if (leftArmRef.current) leftArmRef.current.rotation.x = -1.4;
      if (rightArmRef.current) rightArmRef.current.rotation.x = -1.4;
    } else {
      // Athletic Stance facing bull matching uploaded image
      if (leftLegRef.current) leftLegRef.current.rotation.x = 0.2;
      if (rightLegRef.current) rightLegRef.current.rotation.x = -0.2;
      if (leftArmRef.current) leftArmRef.current.rotation.x = -0.4;
      if (rightArmRef.current) rightArmRef.current.rotation.x = -0.4;
    }
  });

  return (
    <group ref={groupRef} position={position}>
      {/* Head */}
      <mesh position={[0, 1.8, 0]} castShadow>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial color="#8d5b4c" roughness={0.7} />
      </mesh>
      {/* Hair */}
      <mesh position={[0, 1.9, -0.04]}>
        <sphereGeometry args={[0.21, 12, 12]} />
        <meshStandardMaterial color="#18181b" roughness={0.9} />
      </mesh>

      {/* Yellow Jersey (JALLIKATTU 07) matching image */}
      <mesh position={[0, 1.25, 0]} castShadow>
        <boxGeometry args={[0.55, 0.7, 0.32]} />
        <meshStandardMaterial color="#eab308" roughness={0.5} />
      </mesh>

      {/* Dark Text "07" on Back of Jersey */}
      <mesh position={[0, 1.3, 0.17]}>
        <planeGeometry args={[0.25, 0.25]} />
        <meshBasicMaterial color="#18181b" />
      </mesh>

      {/* Left Arm */}
      <group ref={leftArmRef} position={[-0.38, 1.5, 0]}>
        <mesh position={[0, -0.3, 0]} castShadow>
          <cylinderGeometry args={[0.07, 0.08, 0.6, 8]} />
          <meshStandardMaterial color="#8d5b4c" />
        </mesh>
      </group>

      {/* Right Arm */}
      <group ref={rightArmRef} position={[0.38, 1.5, 0]}>
        <mesh position={[0, -0.3, 0]} castShadow>
          <cylinderGeometry args={[0.07, 0.08, 0.6, 8]} />
          <meshStandardMaterial color="#8d5b4c" />
        </mesh>
      </group>

      {/* Black Athletic Shorts */}
      <mesh position={[0, 0.8, 0]}>
        <boxGeometry args={[0.5, 0.35, 0.3]} />
        <meshStandardMaterial color="#18181b" />
      </mesh>

      {/* Bare Legs */}
      <group ref={leftLegRef} position={[-0.18, 0.65, 0]}>
        <mesh position={[0, -0.35, 0]} castShadow>
          <cylinderGeometry args={[0.09, 0.08, 0.7, 8]} />
          <meshStandardMaterial color="#8d5b4c" />
        </mesh>
      </group>

      <group ref={rightLegRef} position={[0.18, 0.65, 0]}>
        <mesh position={[0, -0.35, 0]} castShadow>
          <cylinderGeometry args={[0.09, 0.08, 0.7, 8]} />
          <meshStandardMaterial color="#8d5b4c" />
        </mesh>
      </group>
    </group>
  );
};

// ================= 3. AI TAMERS IN ARENA (MATCHING YELLOW JERSEYS) =================
export const AITamers3D: React.FC = () => {
  const tamers = [
    { id: '1', pos: [-5, 0, -3], rot: 0.8, bib: '01' },
    { id: '2', pos: [-3, 0, -5], rot: 0.4, bib: '02' },
    { id: '3', pos: [3.5, 0, -4.5], rot: -0.6, bib: '03' },
    { id: '4', pos: [5.2, 0, -2.5], rot: -1.1, bib: '04' },
    { id: '5', pos: [2.5, 0, -7], rot: 0.2, bib: '05' },
  ];

  return (
    <group>
      {tamers.map((t) => (
        <group key={t.id} position={t.pos as [number, number, number]} rotation={[0, t.rot, 0]}>
          <mesh position={[0, 1.8, 0]} castShadow>
            <sphereGeometry args={[0.18, 12, 12]} />
            <meshStandardMaterial color="#784b3d" />
          </mesh>
          <mesh position={[0, 1.25, 0]} castShadow>
            <boxGeometry args={[0.5, 0.65, 0.3]} />
            <meshStandardMaterial color="#ca8a04" />
          </mesh>
          <mesh position={[0, 0.8, 0]}>
            <boxGeometry args={[0.45, 0.3, 0.28]} />
            <meshStandardMaterial color="#18181b" />
          </mesh>
          <mesh position={[-0.15, 0.35, 0]} castShadow>
            <cylinderGeometry args={[0.08, 0.07, 0.65, 8]} />
            <meshStandardMaterial color="#784b3d" />
          </mesh>
          <mesh position={[0.15, 0.35, 0]} castShadow>
            <cylinderGeometry args={[0.08, 0.07, 0.65, 8]} />
            <meshStandardMaterial color="#784b3d" />
          </mesh>
        </group>
      ))}
    </group>
  );
};

// ================= 4. AUTHENTIC VAADIVASAL GATE WITH "வாடிவாசல்", "அன்பே", "அறம்" PLAQUES =================
export const VaadivasalGate3D: React.FC = () => {
  const leftDoorRef = useRef<THREE.Group>(null);
  const rightDoorRef = useRef<THREE.Group>(null);
  const { screen } = useGameStore();

  useFrame((_, delta) => {
    const isOpening = screen === 'vaadivasal_release' || screen === 'arena_interaction' || screen === 'taming_minigame';
    if (leftDoorRef.current && rightDoorRef.current) {
      if (isOpening) {
        leftDoorRef.current.rotation.y = THREE.MathUtils.lerp(leftDoorRef.current.rotation.y, -Math.PI / 1.8, delta * 3);
        rightDoorRef.current.rotation.y = THREE.MathUtils.lerp(rightDoorRef.current.rotation.y, Math.PI / 1.8, delta * 3);
      } else {
        leftDoorRef.current.rotation.y = THREE.MathUtils.lerp(leftDoorRef.current.rotation.y, 0, delta * 4);
        rightDoorRef.current.rotation.y = THREE.MathUtils.lerp(rightDoorRef.current.rotation.y, 0, delta * 4);
      }
    }
  });

  return (
    <group position={[0, 0, -12]}>
      {/* Striped Red/White Stone Left Pillar matching image */}
      <mesh position={[-3.6, 2.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.6, 5.0, 1.6]} />
        <meshStandardMaterial color="#dc2626" roughness={0.8} />
      </mesh>
      {/* White Stripes on Pillar */}
      <mesh position={[-3.6, 2.5, 0.81]}>
        <planeGeometry args={[1.5, 1.2]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>

      {/* Striped Red/White Stone Right Pillar */}
      <mesh position={[3.6, 2.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.6, 5.0, 1.6]} />
        <meshStandardMaterial color="#dc2626" roughness={0.8} />
      </mesh>
      <mesh position={[3.6, 2.5, 0.81]}>
        <planeGeometry args={[1.5, 1.2]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>

      {/* Center Arch Header with "வாடிவாசல்" Signboard */}
      <mesh position={[0, 5.2, 0]} castShadow>
        <boxGeometry args={[7.6, 1.3, 1.6]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.6} />
      </mesh>

      {/* Left Yellow Plaque: "அன்பே" matching image */}
      <mesh position={[-2.4, 4.2, 0.82]}>
        <boxGeometry args={[1.8, 0.8, 0.1]} />
        <meshStandardMaterial color="#eab308" />
      </mesh>

      {/* Right Yellow Plaque: "அறம்" matching image */}
      <mesh position={[2.4, 4.2, 0.82]}>
        <boxGeometry args={[1.8, 0.8, 0.1]} />
        <meshStandardMaterial color="#eab308" />
      </mesh>

      {/* Blue Iron Lattice Gate Doors */}
      <group ref={leftDoorRef} position={[-2.2, 0, 0]}>
        <mesh position={[1.1, 2.0, 0]} castShadow>
          <boxGeometry args={[2.2, 4.0, 0.15]} />
          <meshStandardMaterial color="#1d4ed8" metalness={0.7} roughness={0.3} />
        </mesh>
      </group>

      <group ref={rightDoorRef} position={[2.2, 0, 0]}>
        <mesh position={[-1.1, 2.0, 0]} castShadow>
          <boxGeometry args={[2.2, 4.0, 0.15]} />
          <meshStandardMaterial color="#1d4ed8" metalness={0.7} roughness={0.3} />
        </mesh>
      </group>
    </group>
  );
};

// ================= 5. ARENA ENVIRONMENT 3D =================
export const ArenaEnvironment3D: React.FC = () => {
  const { isNightJallikattu } = useGameStore();

  return (
    <group>
      {/* Sandy Arena Ground matching image */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[44, 54]} />
        <meshStandardMaterial
          color={isNightJallikattu ? "#8c6239" : "#dfb37c"}
          roughness={0.9}
          metalness={0.02}
        />
      </mesh>

      {/* Blue Perimeter Double Barricades */}
      <mesh position={[-9, 1.5, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <boxGeometry args={[44, 3, 0.2]} />
        <meshStandardMaterial color="#2563eb" metalness={0.4} roughness={0.6} />
      </mesh>
      <mesh position={[9, 1.5, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <boxGeometry args={[44, 3, 0.2]} />
        <meshStandardMaterial color="#2563eb" metalness={0.4} roughness={0.6} />
      </mesh>

      {/* Wooden Spectator Galleries with Crowds */}
      <mesh position={[-11.5, 2.5, 0]}>
        <boxGeometry args={[3.5, 5.5, 42]} />
        <meshStandardMaterial color="#1c1917" roughness={0.9} />
      </mesh>
      <mesh position={[11.5, 2.5, 0]}>
        <boxGeometry args={[3.5, 5.5, 42]} />
        <meshStandardMaterial color="#1c1917" roughness={0.9} />
      </mesh>
    </group>
  );
};
