import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameStore } from '../../store/useGameStore';
import { BULL_TIERS } from './BullGrowthTiers';

// ============================================================================
// 1. KANGAYAM NATIVE BULL 3D (HIGH-FIDELITY ANATOMICAL SCULPT WITH ANIMATION)
// ============================================================================
export const Bull3D: React.FC<{
  position?: [number, number, number];
  isReleased?: boolean;
  isTurntable?: boolean;
}> = ({ position = [0, 0, -4], isReleased = true, isTurntable = false }) => {
  const groupRef = useRef<THREE.Group>(null);
  const bodyRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);
  const humpRef = useRef<THREE.Mesh>(null);
  const frontLeftLegRef = useRef<THREE.Group>(null);
  const frontRightLegRef = useRef<THREE.Group>(null);
  const backLeftLegRef = useRef<THREE.Group>(null);
  const backRightLegRef = useRef<THREE.Group>(null);
  const tailRef = useRef<THREE.Group>(null);
  const dewlapRef = useRef<THREE.Mesh>(null);

  const {
    bullTier,
    bullAIState,
    bullWorldPos,
    bullRotationY,
    screen,
    holdSeconds,
  } = useGameStore();

  const tierConfig = BULL_TIERS[bullTier] || BULL_TIERS.young;

  // Materials with PBR textures and lighting response
  const coatMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#2a2826', // Authentic steel grey / black Kangayam coat
        roughness: 0.65,
        metalness: 0.12,
        bumpScale: 0.05,
      }),
    []
  );

  const underbellyMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#3a3632',
        roughness: 0.75,
        metalness: 0.05,
      }),
    []
  );

  const hornMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#f6eedb', // Polished ivory horn
        roughness: 0.28,
        metalness: 0.25,
      }),
    []
  );

  const brassMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#f59e0b',
        roughness: 0.2,
        metalness: 0.85,
      }),
    []
  );

  const kumkumMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#b91c1c',
        roughness: 0.35,
        metalness: 0.1,
      }),
    []
  );

  const garlandMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#ea580c',
        roughness: 0.7,
        metalness: 0.05,
      }),
    []
  );

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    const time = state.clock.getElapsedTime();

    // Turntable selection preview
    if (isTurntable) {
      groupRef.current.rotation.y += delta * 0.7;
      groupRef.current.position.set(0, 0, 0);
      return;
    }

    // In Arena: Position & Rotation are managed by the Physics/AI Live Coordinator
    if (screen === 'arena_interaction' || screen === 'taming_minigame') {
      groupRef.current.position.set(bullWorldPos.x, bullWorldPos.y, bullWorldPos.z);
      groupRef.current.rotation.y = bullRotationY;
    } else {
      groupRef.current.position.set(position[0], position[1], position[2]);
      groupRef.current.rotation.y = 0;
    }

    // Dynamic Multi-Joint Animation Based on AI State
    if (screen === 'taming_minigame') {
      // Violent Thrashing & Bucking during taming grip
      const buckFreq = 16;
      const buck = Math.sin(time * buckFreq);
      groupRef.current.position.y = bullWorldPos.y + Math.abs(buck) * 0.35;

      if (headRef.current) {
        headRef.current.rotation.x = 0.4 + buck * 0.35;
        headRef.current.rotation.y = Math.sin(time * 8) * 0.45;
        headRef.current.rotation.z = Math.cos(time * 8) * 0.25;
      }
      if (bodyRef.current) {
        bodyRef.current.rotation.z = Math.sin(time * 10) * 0.18;
      }
      if (frontLeftLegRef.current) frontLeftLegRef.current.rotation.x = buck * 0.8;
      if (frontRightLegRef.current) frontRightLegRef.current.rotation.x = -buck * 0.8;
      if (backLeftLegRef.current) backLeftLegRef.current.rotation.x = -buck * 0.9;
      if (backRightLegRef.current) backRightLegRef.current.rotation.x = buck * 0.9;
      if (tailRef.current) tailRef.current.rotation.z = Math.sin(time * 20) * 0.8;
    } else if (bullAIState === 'charge' || (isReleased && screen === 'arena_interaction')) {
      // Powerful Sprint & Charge Gallop
      const speed = 14;
      const gallop = Math.sin(time * speed);
      groupRef.current.position.y = bullWorldPos.y + Math.abs(gallop) * 0.2;

      // Leg stride cycles
      if (frontLeftLegRef.current) frontLeftLegRef.current.rotation.x = Math.sin(time * speed) * 0.85;
      if (frontRightLegRef.current) frontRightLegRef.current.rotation.x = -Math.sin(time * speed) * 0.85;
      if (backLeftLegRef.current) backLeftLegRef.current.rotation.x = -Math.sin(time * speed) * 0.75;
      if (backRightLegRef.current) backRightLegRef.current.rotation.x = Math.sin(time * speed) * 0.75;

      // Low aggressive head posture
      if (headRef.current) {
        headRef.current.rotation.x = 0.35 + Math.sin(time * speed) * 0.12;
        headRef.current.rotation.y = Math.sin(time * 4) * 0.15;
      }
      if (dewlapRef.current) {
        dewlapRef.current.rotation.z = Math.sin(time * speed) * 0.2;
      }
      if (tailRef.current) {
        tailRef.current.rotation.x = 0.6 + Math.sin(time * 12) * 0.3;
        tailRef.current.rotation.y = Math.sin(time * 8) * 0.4;
      }
    } else if (bullAIState === 'alert') {
      // Alert: Tense, stamping front hoof, flared nostrils
      const alertTime = time * 6;
      if (frontRightLegRef.current) frontRightLegRef.current.rotation.x = Math.max(0, Math.sin(alertTime) * 0.5);
      if (headRef.current) {
        headRef.current.rotation.x = 0.15 + Math.sin(time * 3) * 0.05;
        headRef.current.rotation.y = Math.sin(time * 2) * 0.3;
      }
      if (tailRef.current) tailRef.current.rotation.y = Math.sin(time * 5) * 0.4;
    } else {
      // Idle: Gentle breathing heave & subtle tail swish
      const breath = Math.sin(time * 2.5) * 0.03;
      groupRef.current.position.y = (screen === 'arena_interaction' ? bullWorldPos.y : position[1]) + breath;
      if (headRef.current) {
        headRef.current.rotation.y = Math.sin(time * 1.5) * 0.15;
        headRef.current.rotation.x = 0.08 + Math.sin(time * 3) * 0.04;
      }
      if (tailRef.current) {
        tailRef.current.rotation.y = Math.sin(time * 3) * 0.35;
      }
    }
  });

  return (
    <group
      ref={groupRef}
      scale={[tierConfig.scale, tierConfig.scale, tierConfig.scale]}
    >
      <group ref={bodyRef}>
        {/* 1. Main Muscular Torso with Rib & Shoulder Contours */}
        <mesh position={[0, 1.45, 0]} material={coatMaterial} castShadow receiveShadow>
          <boxGeometry args={[1.2, 1.35, 2.3]} />
        </mesh>

        {/* 2. Tapered Chest & Muscular Shoulders */}
        <mesh position={[0, 1.55, -0.6]} material={coatMaterial} castShadow>
          <sphereGeometry args={[0.72, 16, 16]} />
        </mesh>

        {/* 3. Tapered Muscular Flanks & Underbelly */}
        <mesh position={[0, 1.1, 0.1]} material={underbellyMaterial} receiveShadow>
          <boxGeometry args={[1.05, 0.7, 1.9]} />
        </mesh>

        {/* 4. Signature High-Arc Kangayam Dorsal Hump (திமில்) */}
        <mesh
          ref={humpRef}
          position={[0, 2.3, -0.45]}
          scale={[1, (tierConfig.humpScale / 0.55) * 1.15, 1.1]}
          material={coatMaterial}
          castShadow
        >
          <sphereGeometry args={[0.58, 20, 20]} />
        </mesh>

        {/* 5. Hanging Dewlap Skin Fold (அடிமடி / தாடி) under Neck */}
        <mesh
          ref={dewlapRef}
          position={[0, 1.05, -1.15]}
          rotation={[0.3, 0, 0]}
          material={underbellyMaterial}
        >
          <boxGeometry args={[0.18, 0.55, 0.9]} />
        </mesh>

        {/* 6. Muscular Neck */}
        <mesh position={[0, 1.6, -1.05]} rotation={[-0.35, 0, 0]} material={coatMaterial} castShadow>
          <cylinderGeometry args={[0.42, 0.62, 0.95, 12]} />
        </mesh>

        {/* 7. Head & Horn Assembly */}
        <group ref={headRef} position={[0, 1.82, -1.45]}>
          {/* Cranium / Forehead */}
          <mesh position={[0, 0, -0.25]} material={coatMaterial} castShadow>
            <boxGeometry args={[0.72, 0.72, 0.75]} />
          </mesh>

          {/* Tapered Snout & Dark Muzzle */}
          <mesh position={[0, -0.18, -0.65]} material={underbellyMaterial} castShadow>
            <boxGeometry args={[0.52, 0.44, 0.48]} />
          </mesh>

          {/* Detailed Dark Muzzle Plate */}
          <mesh position={[0, -0.18, -0.9]}>
            <sphereGeometry args={[0.22, 12, 12]} />
            <meshStandardMaterial color="#121214" roughness={0.8} />
          </mesh>

          {/* Flared Red Nostrils */}
          <mesh position={[-0.14, -0.18, -0.94]}>
            <sphereGeometry args={[0.055, 8, 8]} />
            <meshBasicMaterial color="#b91c1c" />
          </mesh>
          <mesh position={[0.14, -0.18, -0.94]}>
            <sphereGeometry args={[0.055, 8, 8]} />
            <meshBasicMaterial color="#b91c1c" />
          </mesh>

          {/* Glowing Expressive Eyes */}
          <mesh position={[-0.37, 0.1, -0.22]}>
            <sphereGeometry args={[0.085, 10, 10]} />
            <meshStandardMaterial color="#f59e0b" emissive="#78350f" emissiveIntensity={0.6} />
          </mesh>
          <mesh position={[0.37, 0.1, -0.22]}>
            <sphereGeometry args={[0.085, 10, 10]} />
            <meshStandardMaterial color="#f59e0b" emissive="#78350f" emissiveIntensity={0.6} />
          </mesh>

          {/* Left Ear */}
          <mesh position={[-0.44, 0.15, -0.05]} rotation={[0.2, 0.4, -0.6]} material={coatMaterial}>
            <coneGeometry args={[0.12, 0.38, 8]} />
          </mesh>

          {/* Right Ear */}
          <mesh position={[0.44, 0.15, -0.05]} rotation={[0.2, -0.4, 0.6]} material={coatMaterial}>
            <coneGeometry args={[0.12, 0.38, 8]} />
          </mesh>

          {/* Sacred Pongal Tilak / Vermilion & Vibhuti on Forehead */}
          <group position={[0, 0.22, -0.42]}>
            <mesh position={[0, 0, 0.05]} material={kumkumMaterial}>
              <sphereGeometry args={[0.12, 12, 12]} />
            </mesh>
            {[-0.05, 0, 0.05].map((y, idx) => (
              <mesh key={idx} position={[0, y, 0.045]}>
                <boxGeometry args={[0.34, 0.022, 0.02]} />
                <meshBasicMaterial color="#f8fafc" />
              </mesh>
            ))}
          </group>

          {/* Signature Kangayam Horns: Majestic, Upward-Swept, Sharp Tips */}
          {/* Left Horn */}
          <group position={[-0.38, 0.38, -0.08]} rotation={[-0.22, 0, -0.58]}>
            <mesh position={[0, 0.68, 0]} material={hornMaterial} castShadow>
              <cylinderGeometry args={[0.04, 0.13, 1.45, 14]} />
            </mesh>
            {/* Brass Ring Cap */}
            <mesh position={[0, 0.2, 0]} material={brassMaterial}>
              <torusGeometry args={[0.12, 0.025, 8, 16]} />
            </mesh>
            {/* Kumkum Painted Tip */}
            <mesh position={[0, 1.42, 0]} material={kumkumMaterial}>
              <sphereGeometry args={[0.065, 10, 10]} />
            </mesh>
          </group>

          {/* Right Horn */}
          <group position={[0.38, 0.38, -0.08]} rotation={[-0.22, 0, 0.58]}>
            <mesh position={[0, 0.68, 0]} material={hornMaterial} castShadow>
              <cylinderGeometry args={[0.04, 0.13, 1.45, 14]} />
            </mesh>
            {/* Brass Ring Cap */}
            <mesh position={[0, 0.2, 0]} material={brassMaterial}>
              <torusGeometry args={[0.12, 0.025, 8, 16]} />
            </mesh>
            {/* Kumkum Painted Tip */}
            <mesh position={[0, 1.42, 0]} material={kumkumMaterial}>
              <sphereGeometry args={[0.065, 10, 10]} />
            </mesh>
          </group>

          {/* Traditional Ceremonial Garland & Brass Neck Bell */}
          <mesh position={[0, -0.38, 0.28]} rotation={[Math.PI / 2, 0, 0]} material={garlandMaterial}>
            <torusGeometry args={[0.48, 0.09, 8, 20]} />
          </mesh>
          <mesh position={[0, -0.85, 0.28]} material={brassMaterial} castShadow>
            <sphereGeometry args={[0.13, 12, 12]} />
          </mesh>
        </group>

        {/* 8. Four Articulated Muscular Legs with Knees & Cleft Hooves */}
        {/* Front Left */}
        <group ref={frontLeftLegRef} position={[-0.48, 1.05, -0.75]}>
          <mesh position={[0, -0.32, 0]} material={coatMaterial} castShadow>
            <cylinderGeometry args={[0.15, 0.12, 0.65, 10]} />
          </mesh>
          <mesh position={[0, -0.78, 0]} material={underbellyMaterial} castShadow>
            <cylinderGeometry args={[0.11, 0.095, 0.55, 10]} />
          </mesh>
          <mesh position={[0, -1.08, 0.02]}>
            <boxGeometry args={[0.18, 0.12, 0.22]} />
            <meshStandardMaterial color="#111113" roughness={0.9} />
          </mesh>
        </group>

        {/* Front Right */}
        <group ref={frontRightLegRef} position={[0.48, 1.05, -0.75]}>
          <mesh position={[0, -0.32, 0]} material={coatMaterial} castShadow>
            <cylinderGeometry args={[0.15, 0.12, 0.65, 10]} />
          </mesh>
          <mesh position={[0, -0.78, 0]} material={underbellyMaterial} castShadow>
            <cylinderGeometry args={[0.11, 0.095, 0.55, 10]} />
          </mesh>
          <mesh position={[0, -1.08, 0.02]}>
            <boxGeometry args={[0.18, 0.12, 0.22]} />
            <meshStandardMaterial color="#111113" roughness={0.9} />
          </mesh>
        </group>

        {/* Back Left (Muscular Haunches) */}
        <group ref={backLeftLegRef} position={[-0.48, 1.05, 0.75]}>
          <mesh position={[0, -0.32, 0]} material={coatMaterial} castShadow>
            <cylinderGeometry args={[0.18, 0.13, 0.65, 10]} />
          </mesh>
          <mesh position={[0, -0.78, 0]} material={underbellyMaterial} castShadow>
            <cylinderGeometry args={[0.12, 0.1, 0.55, 10]} />
          </mesh>
          <mesh position={[0, -1.08, 0.02]}>
            <boxGeometry args={[0.19, 0.12, 0.23]} />
            <meshStandardMaterial color="#111113" roughness={0.9} />
          </mesh>
        </group>

        {/* Back Right (Muscular Haunches) */}
        <group ref={backRightLegRef} position={[0.48, 1.05, 0.75]}>
          <mesh position={[0, -0.32, 0]} material={coatMaterial} castShadow>
            <cylinderGeometry args={[0.18, 0.13, 0.65, 10]} />
          </mesh>
          <mesh position={[0, -0.78, 0]} material={underbellyMaterial} castShadow>
            <cylinderGeometry args={[0.12, 0.1, 0.55, 10]} />
          </mesh>
          <mesh position={[0, -1.08, 0.02]}>
            <boxGeometry args={[0.19, 0.12, 0.23]} />
            <meshStandardMaterial color="#111113" roughness={0.9} />
          </mesh>
        </group>

        {/* 9. Articulated Swishing Tufted Tail */}
        <group ref={tailRef} position={[0, 1.45, 1.25]} rotation={[0.35, 0, 0]}>
          <mesh position={[0, -0.5, 0]} material={coatMaterial}>
            <cylinderGeometry args={[0.04, 0.06, 1.1, 8]} />
          </mesh>
          {/* Black Tuft at Tip */}
          <mesh position={[0, -1.15, 0]}>
            <coneGeometry args={[0.11, 0.35, 8]} />
            <meshStandardMaterial color="#0a0a0c" roughness={0.9} />
          </mesh>
        </group>
      </group>
    </group>
  );
};

// ============================================================================
// 2. PLAYER CHARACTER 3D (ATHLETIC TAMER #07 WITH DYNAMIC BULL ATTACHMENT)
// ============================================================================
export const Player3D: React.FC<{
  position?: [number, number, number];
}> = ({ position = [0, 0, 2.5] }) => {
  const groupRef = useRef<THREE.Group>(null);
  const leftLegRef = useRef<THREE.Group>(null);
  const rightLegRef = useRef<THREE.Group>(null);
  const leftArmRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);
  const torsoRef = useRef<THREE.Group>(null);

  const {
    joystick,
    isSprinting,
    actionTrigger,
    screen,
    bullWorldPos,
    bullRotationY,
    playerWorldPos,
    playerStamina,
  } = useGameStore();

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    const time = state.clock.getElapsedTime();

    // ========================================================================
    // STEP 1 FIX: DYNAMIC LIVE ATTACHMENT TO BULL POSITION ANYWHERE IN ARENA
    // ========================================================================
    if (screen === 'taming_minigame' || actionTrigger === 'GRAB') {
      // Calculate attachment point relative to the bull's live heading and world position
      const flankOffsetLateral = 0.72; // Snug against bull's left flank
      const flankOffsetLongitudinal = -0.35; // Locked at the dorsal hump

      // Transform flank offset by the bull's current rotation angle Y
      const cosR = Math.cos(bullRotationY);
      const sinR = Math.sin(bullRotationY);
      const targetWorldX = bullWorldPos.x + (cosR * flankOffsetLateral - sinR * flankOffsetLongitudinal);
      const targetWorldZ = bullWorldPos.z + (sinR * flankOffsetLateral + cosR * flankOffsetLongitudinal);

      // Smoothly track the bull without harsh coordinate jumping
      groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, targetWorldX, delta * 18);
      groupRef.current.position.z = THREE.MathUtils.lerp(groupRef.current.position.z, targetWorldZ, delta * 18);
      groupRef.current.position.y = bullWorldPos.y + 0.12;

      // Rotate body to clamp inward facing the bull's hump
      groupRef.current.rotation.y = bullRotationY - Math.PI / 2.1;

      // Two-handed flank clamp hold posture
      if (leftArmRef.current) {
        leftArmRef.current.rotation.x = -1.35;
        leftArmRef.current.rotation.z = -0.4;
      }
      if (rightArmRef.current) {
        rightArmRef.current.rotation.x = -1.45;
        rightArmRef.current.rotation.z = 0.35;
      }
      if (torsoRef.current) {
        torsoRef.current.rotation.x = 0.28;
      }
      if (leftLegRef.current) leftLegRef.current.rotation.x = 0.45;
      if (rightLegRef.current) rightLegRef.current.rotation.x = -0.3;
      return;
    }

    // ========================================================================
    // ARENA RUNNING / FREE MOVEMENT CONTROLS
    // ========================================================================
    if (screen === 'arena_interaction') {
      // Sync with Physics & Live Coordinator position
      groupRef.current.position.set(playerWorldPos.x, playerWorldPos.y, playerWorldPos.z);

      const isMoving = joystick.x !== 0 || joystick.y !== 0;

      if (actionTrigger === 'DIVE') {
        // Dodging dive roll
        groupRef.current.rotation.x = Math.sin(time * 20) * 1.5;
        groupRef.current.position.y = 0.4;
      } else if (isMoving) {
        // Face moving direction
        const angle = Math.atan2(joystick.x, joystick.y);
        groupRef.current.rotation.y = angle;
        groupRef.current.rotation.x = 0;

        // Running swing rate
        const strideSpeed = isSprinting && playerStamina > 0 ? 16 : 10;
        const swing = Math.sin(time * strideSpeed);

        if (leftLegRef.current) leftLegRef.current.rotation.x = swing * 0.85;
        if (rightLegRef.current) rightLegRef.current.rotation.x = -swing * 0.85;
        if (leftArmRef.current) {
          leftArmRef.current.rotation.x = -swing * 0.8;
          leftArmRef.current.rotation.z = 0.1;
        }
        if (rightArmRef.current) {
          rightArmRef.current.rotation.x = swing * 0.8;
          rightArmRef.current.rotation.z = -0.1;
        }
        if (torsoRef.current) {
          torsoRef.current.rotation.x = 0.15; // Lean forward while running
        }
      } else {
        // Athletic Stance: Ready, crouched, hands up
        groupRef.current.rotation.x = 0;
        groupRef.current.position.y = 0;

        if (leftLegRef.current) leftLegRef.current.rotation.x = 0.22;
        if (rightLegRef.current) rightLegRef.current.rotation.x = -0.18;
        if (leftArmRef.current) {
          leftArmRef.current.rotation.x = -0.55;
          leftArmRef.current.rotation.z = 0.35;
        }
        if (rightArmRef.current) {
          rightArmRef.current.rotation.x = -0.55;
          rightArmRef.current.rotation.z = -0.35;
        }
        if (torsoRef.current) {
          torsoRef.current.rotation.x = 0.1;
        }
      }
    } else {
      // Default Spawn / Menu Pose
      groupRef.current.position.set(position[0], position[1], position[2]);
      groupRef.current.rotation.set(0, 0, 0);
    }
  });

  return (
    <group ref={groupRef} position={position}>
      <group ref={torsoRef}>
        {/* Head & Neck */}
        <mesh position={[0, 1.82, 0]} castShadow>
          <sphereGeometry args={[0.2, 16, 16]} />
          <meshStandardMaterial color="#8d5b4c" roughness={0.7} />
        </mesh>
        {/* Cropped Hair */}
        <mesh position={[0, 1.93, -0.04]}>
          <sphereGeometry args={[0.21, 14, 14]} />
          <meshStandardMaterial color="#18181b" roughness={0.9} />
        </mesh>

        {/* Yellow Jersey (JALLIKATTU #07) matching reference screenshot */}
        <mesh position={[0, 1.28, 0]} castShadow>
          <boxGeometry args={[0.56, 0.72, 0.34]} />
          <meshStandardMaterial color="#eab308" roughness={0.5} />
        </mesh>

        {/* Black Printed Number "07" on Back of Jersey */}
        <mesh position={[0, 1.34, 0.178]}>
          <planeGeometry args={[0.26, 0.26]} />
          <meshBasicMaterial color="#18181b" />
        </mesh>

        {/* Black Collar Trim */}
        <mesh position={[0, 1.64, 0]}>
          <boxGeometry args={[0.28, 0.05, 0.26]} />
          <meshStandardMaterial color="#18181b" />
        </mesh>

        {/* Muscular Left Arm */}
        <group ref={leftArmRef} position={[-0.38, 1.52, 0]}>
          {/* Shoulder / Deltoid */}
          <mesh position={[0, 0, 0]} castShadow>
            <sphereGeometry args={[0.1, 10, 10]} />
            <meshStandardMaterial color="#eab308" />
          </mesh>
          {/* Upper Arm & Forearm */}
          <mesh position={[0, -0.32, 0]} castShadow>
            <cylinderGeometry args={[0.075, 0.082, 0.62, 10]} />
            <meshStandardMaterial color="#8d5b4c" roughness={0.65} />
          </mesh>
          {/* Hand */}
          <mesh position={[0, -0.66, 0]}>
            <sphereGeometry args={[0.065, 8, 8]} />
            <meshStandardMaterial color="#8d5b4c" />
          </mesh>
        </group>

        {/* Muscular Right Arm */}
        <group ref={rightArmRef} position={[0.38, 1.52, 0]}>
          <mesh position={[0, 0, 0]} castShadow>
            <sphereGeometry args={[0.1, 10, 10]} />
            <meshStandardMaterial color="#eab308" />
          </mesh>
          <mesh position={[0, -0.32, 0]} castShadow>
            <cylinderGeometry args={[0.075, 0.082, 0.62, 10]} />
            <meshStandardMaterial color="#8d5b4c" roughness={0.65} />
          </mesh>
          <mesh position={[0, -0.66, 0]}>
            <sphereGeometry args={[0.065, 8, 8]} />
            <meshStandardMaterial color="#8d5b4c" />
          </mesh>
        </group>

        {/* Black Athletic Shorts */}
        <mesh position={[0, 0.82, 0]} castShadow>
          <boxGeometry args={[0.52, 0.36, 0.32]} />
          <meshStandardMaterial color="#18181b" roughness={0.8} />
        </mesh>

        {/* Left Athletic Bare Leg */}
        <group ref={leftLegRef} position={[-0.19, 0.68, 0]}>
          <mesh position={[0, -0.36, 0]} castShadow>
            <cylinderGeometry args={[0.095, 0.082, 0.72, 10]} />
            <meshStandardMaterial color="#8d5b4c" roughness={0.65} />
          </mesh>
          {/* Foot */}
          <mesh position={[0, -0.74, 0.06]}>
            <boxGeometry args={[0.1, 0.08, 0.2]} />
            <meshStandardMaterial color="#8d5b4c" />
          </mesh>
        </group>

        {/* Right Athletic Bare Leg */}
        <group ref={rightLegRef} position={[0.19, 0.68, 0]}>
          <mesh position={[0, -0.36, 0]} castShadow>
            <cylinderGeometry args={[0.095, 0.082, 0.72, 10]} />
            <meshStandardMaterial color="#8d5b4c" roughness={0.65} />
          </mesh>
          <mesh position={[0, -0.74, 0.06]}>
            <boxGeometry args={[0.1, 0.08, 0.2]} />
            <meshStandardMaterial color="#8d5b4c" />
          </mesh>
        </group>
      </group>
    </group>
  );
};

// ============================================================================
// 3. AI TAMER COMPETITORS 3D (AUTHENTIC YELLOW JERSEYS & RESPONSIVE AI)
// ============================================================================
export const AITamers3D: React.FC = () => {
  const { aiCoords, bullAIState, bullTargetId } = useGameStore();

  return (
    <group>
      {aiCoords.map((t) => {
        const isTargeted = bullTargetId === t.id && bullAIState === 'charge';

        return (
          <group key={t.id} position={[t.x, 0, t.z]}>
            {/* Head */}
            <mesh position={[0, 1.82, 0]} castShadow>
              <sphereGeometry args={[0.19, 12, 12]} />
              <meshStandardMaterial color="#784b3d" />
            </mesh>

            {/* Jersey */}
            <mesh position={[0, 1.28, 0]} castShadow>
              <boxGeometry args={[0.52, 0.68, 0.32]} />
              <meshStandardMaterial color={isTargeted ? '#ef4444' : '#ca8a04'} />
            </mesh>

            {/* Bib Number */}
            <mesh position={[0, 1.34, 0.165]}>
              <planeGeometry args={[0.22, 0.22]} />
              <meshBasicMaterial color="#ffffff" />
            </mesh>

            {/* Shorts */}
            <mesh position={[0, 0.82, 0]}>
              <boxGeometry args={[0.48, 0.32, 0.3]} />
              <meshStandardMaterial color="#18181b" />
            </mesh>

            {/* Legs */}
            <mesh position={[-0.16, 0.36, 0]} castShadow>
              <cylinderGeometry args={[0.085, 0.075, 0.68, 8]} />
              <meshStandardMaterial color="#784b3d" />
            </mesh>
            <mesh position={[0.16, 0.36, 0]} castShadow>
              <cylinderGeometry args={[0.085, 0.075, 0.68, 8]} />
              <meshStandardMaterial color="#784b3d" />
            </mesh>
          </group>
        );
      })}
    </group>
  );
};

// ============================================================================
// 4. HISTORIC VAADIVASAL GATE 3D (AUTHENTIC TAMIL TEMPLE ARCH & PLAQUES)
// ============================================================================
export const VaadivasalGate3D: React.FC = () => {
  const leftDoorRef = useRef<THREE.Group>(null);
  const rightDoorRef = useRef<THREE.Group>(null);
  const { screen } = useGameStore();

  useFrame((_, delta) => {
    const isOpening =
      screen === 'vaadivasal_release' ||
      screen === 'arena_interaction' ||
      screen === 'taming_minigame';

    if (leftDoorRef.current && rightDoorRef.current) {
      if (isOpening) {
        leftDoorRef.current.rotation.y = THREE.MathUtils.lerp(leftDoorRef.current.rotation.y, -Math.PI / 1.75, delta * 3);
        rightDoorRef.current.rotation.y = THREE.MathUtils.lerp(rightDoorRef.current.rotation.y, Math.PI / 1.75, delta * 3);
      } else {
        leftDoorRef.current.rotation.y = THREE.MathUtils.lerp(leftDoorRef.current.rotation.y, 0, delta * 4);
        rightDoorRef.current.rotation.y = THREE.MathUtils.lerp(rightDoorRef.current.rotation.y, 0, delta * 4);
      }
    }
  });

  return (
    <group position={[0, 0, -12]}>
      {/* Striped Red/White Granite Left Pillar */}
      <mesh position={[-3.8, 2.6, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.7, 5.2, 1.7]} />
        <meshStandardMaterial color="#b91c1c" roughness={0.8} />
      </mesh>
      {/* Alternating White Painted Bands */}
      {[-1.2, 0.5, 2.2].map((y, i) => (
        <mesh key={i} position={[-3.8, y, 0.86]}>
          <planeGeometry args={[1.65, 0.85]} />
          <meshBasicMaterial color="#f8fafc" />
        </mesh>
      ))}

      {/* Striped Red/White Granite Right Pillar */}
      <mesh position={[3.8, 2.6, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.7, 5.2, 1.7]} />
        <meshStandardMaterial color="#b91c1c" roughness={0.8} />
      </mesh>
      {[-1.2, 0.5, 2.2].map((y, i) => (
        <mesh key={i} position={[3.8, y, 0.86]}>
          <planeGeometry args={[1.65, 0.85]} />
          <meshBasicMaterial color="#f8fafc" />
        </mesh>
      ))}

      {/* Main Arch Header (வாடிவாசல்) */}
      <mesh position={[0, 5.4, 0]} castShadow>
        <boxGeometry args={[8.2, 1.4, 1.8]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.7} />
      </mesh>

      {/* Terracotta Clay Roof Tiles along Arch Canopy */}
      <mesh position={[0, 6.2, 0]} castShadow>
        <boxGeometry args={[8.8, 0.45, 2.2]} />
        <meshStandardMaterial color="#9a3412" roughness={0.65} />
      </mesh>

      {/* 3 Traditional Brass Kalasams at the Peak */}
      {[-2.2, 0, 2.2].map((x, i) => (
        <group key={i} position={[x, 6.7, 0]}>
          <mesh castShadow>
            <coneGeometry args={[0.22, 0.55, 10]} />
            <meshStandardMaterial color="#f59e0b" metalness={0.9} roughness={0.15} />
          </mesh>
          <mesh position={[0, -0.22, 0]}>
            <sphereGeometry args={[0.18, 10, 10]} />
            <meshStandardMaterial color="#f59e0b" metalness={0.9} roughness={0.15} />
          </mesh>
        </group>
      ))}

      {/* Left Yellow Plaque: "அன்பே" (Love) */}
      <mesh position={[-2.4, 4.4, 0.92]}>
        <boxGeometry args={[1.9, 0.85, 0.08]} />
        <meshStandardMaterial color="#eab308" />
      </mesh>

      {/* Right Yellow Plaque: "அறம்" (Righteousness) */}
      <mesh position={[2.4, 4.4, 0.92]}>
        <boxGeometry args={[1.9, 0.85, 0.08]} />
        <meshStandardMaterial color="#eab308" />
      </mesh>

      {/* Blue Iron Lattice Heavy Gate Doors */}
      <group ref={leftDoorRef} position={[-2.4, 0, 0]}>
        <mesh position={[1.2, 2.2, 0]} castShadow>
          <boxGeometry args={[2.4, 4.4, 0.16]} />
          <meshStandardMaterial color="#1d4ed8" metalness={0.75} roughness={0.25} />
        </mesh>
      </group>

      <group ref={rightDoorRef} position={[2.4, 0, 0]}>
        <mesh position={[-1.2, 2.2, 0]} castShadow>
          <boxGeometry args={[2.4, 4.4, 0.16]} />
          <meshStandardMaterial color="#1d4ed8" metalness={0.75} roughness={0.25} />
        </mesh>
      </group>
    </group>
  );
};

// ============================================================================
// 5. DYNAMIC PATH VISUALIZATION 3D (TACTICAL SPLINES & ESCAPE ARCS)
// ============================================================================
export const DynamicPath3D: React.FC = () => {
  const { showPathVisualization } = useGameStore();

  if (!showPathVisualization) return null;

  return (
    <group position={[0, 0.06, 0]}>
      {/* Route C: Escape Attempt Arc */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -4]}>
        <ringGeometry args={[4.8, 5.15, 32, 1, 0, Math.PI * 1.4]} />
        <meshBasicMaterial color="#ef4444" side={THREE.DoubleSide} transparent opacity={0.85} />
      </mesh>

      {[-3, -1, 1, 3].map((x, idx) => (
        <group key={idx} position={[x, 0.03, -2 - Math.abs(x) * 0.8]} rotation={[-Math.PI / 2, 0, idx * 0.5]}>
          <coneGeometry args={[0.35, 0.7, 3]} />
          <meshBasicMaterial color="#dc2626" />
        </group>
      ))}

      {/* Interception Spline */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -1]}>
        <ringGeometry args={[2.8, 3.05, 24, 1, Math.PI * 0.8, Math.PI * 0.9]} />
        <meshBasicMaterial color="#f59e0b" side={THREE.DoubleSide} transparent opacity={0.8} />
      </mesh>
    </group>
  );
};

// ============================================================================
// 6. ARENA ENVIRONMENT 3D (SANDY PBR GROUND, TIMBER BARRICADES, GALLERIES)
// ============================================================================
export const ArenaEnvironment3D: React.FC = () => {
  const { currentVillage, isNightJallikattu, screen } = useGameStore();
  const isGrandFinal = currentVillage.id === 'championship' || screen === 'grand_final';

  return (
    <group>
      {/* Textured Sandy Arena Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[44, 54]} />
        <meshStandardMaterial
          color={isNightJallikattu ? '#8c6239' : '#dfb37c'}
          roughness={0.92}
          metalness={0.03}
        />
      </mesh>

      {/* Sacred Central White Kolam Decal */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, -4]}>
        <ringGeometry args={[3.8, 4.05, 32]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.65} />
      </mesh>

      {/* Dynamic 3D Path Overlay */}
      <DynamicPath3D />

      {/* Blue Timber Perimeter Double Barricades */}
      <mesh position={[-8.8, 1.5, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <boxGeometry args={[46, 3.2, 0.22]} />
        <meshStandardMaterial color="#1e40af" metalness={0.4} roughness={0.6} />
      </mesh>
      <mesh position={[8.8, 1.5, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <boxGeometry args={[46, 3.2, 0.22]} />
        <meshStandardMaterial color="#1e40af" metalness={0.4} roughness={0.6} />
      </mesh>

      {/* Spectator Wooden Galleries */}
      <mesh position={[-11.5, 2.6, 0]}>
        <boxGeometry args={[3.8, 5.6, 44]} />
        <meshStandardMaterial color="#1c1917" roughness={0.9} />
      </mesh>
      <mesh position={[11.5, 2.6, 0]}>
        <boxGeometry args={[3.8, 5.6, 44]} />
        <meshStandardMaterial color="#1c1917" roughness={0.9} />
      </mesh>

      {/* Night Lanterns */}
      {isNightJallikattu && (
        <group>
          {[-8, -4, 0, 4, 8].map((z, idx) => (
            <group key={idx}>
              <pointLight position={[-8.6, 3.4, z]} intensity={2.0} color="#f59e0b" distance={9} />
              <pointLight position={[8.6, 3.4, z]} intensity={2.0} color="#f59e0b" distance={9} />
            </group>
          ))}
        </group>
      )}

      {/* Grand Final Championship Trophy Podium */}
      {isGrandFinal && (
        <group position={[0, 0, -4]}>
          <mesh position={[0, 0.45, 0]} castShadow>
            <cylinderGeometry args={[1.6, 1.9, 0.9, 16]} />
            <meshStandardMaterial color="#eab308" metalness={0.8} roughness={0.2} />
          </mesh>
          <mesh position={[0, 1.35, 0]} castShadow>
            <cylinderGeometry args={[0.32, 0.42, 1.0, 12]} />
            <meshStandardMaterial color="#fef08a" metalness={0.9} roughness={0.1} />
          </mesh>
          <mesh position={[0, 2.1, 0]} castShadow>
            <sphereGeometry args={[0.48, 14, 14]} />
            <meshStandardMaterial color="#ffd700" metalness={0.9} roughness={0.1} />
          </mesh>
        </group>
      )}
    </group>
  );
};
