import React, { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameStore } from '../../store/useGameStore';

export const CameraController: React.FC = () => {
  const { camera } = useThree();
  const { screen, actionTrigger } = useGameStore();

  const targetCameraPos = useRef(new THREE.Vector3(0, 4, 8));
  const targetLookAt = useRef(new THREE.Vector3(0, 1.5, -4));

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();

    if (screen === 'arena_entrance') {
      // Dolly forward toward gate
      targetCameraPos.current.set(0, 3.5, 4);
      targetLookAt.current.set(0, 3.0, -14);
    } else if (screen === 'vaadivasal_release') {
      // Low-angle perspective looking at opening gate + screen shake
      const shakeX = (Math.random() - 0.5) * 0.08;
      const shakeY = (Math.random() - 0.5) * 0.08;
      targetCameraPos.current.set(shakeX, 2.8 + shakeY, 2.5);
      targetLookAt.current.set(0, 2.2, -10);
    } else if (screen === 'arena_interaction') {
      // Third-person perspective behind player (as seen in Image 1)
      targetCameraPos.current.set(0, 4.2, 7.5);
      targetLookAt.current.set(0, 1.6, -3.5);
    } else if (screen === 'taming_minigame') {
      // Dynamic close-up flank angle
      targetCameraPos.current.set(3.5, 2.2, -1.0);
      targetLookAt.current.set(0, 1.8, -1.0);
    }

    // Smooth Lerp Camera Position
    camera.position.lerp(targetCameraPos.current, delta * 3.5);
    camera.lookAt(targetLookAt.current);
  });

  return null;
};
