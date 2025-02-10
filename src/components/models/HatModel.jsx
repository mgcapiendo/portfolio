"use client"
import React, { useRef, useState } from 'react';
import { useGLTF, SpotLight, PointLight, DirectionalLight } from '@react-three/drei';
import { useFrame } from "@react-three/fiber";

export default function HatModel(props) {
  const { nodes, materials } = useGLTF('/models/sun-shroom.glb')
  const modelRef = useRef();
  const [timePassed, setTimePassed] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);
  const [isPausing, setIsPausing] = useState(false);
  const [pauseTimer, setPauseTimer] = useState(0);

  useFrame((state, delta) => {
    if (!modelRef.current) return;

    // Regular bobbing animation and rotation
    if (!isFlipping) {
      modelRef.current.position.y = 2 + Math.sin(state.clock.elapsedTime * 2) * 0.1;
      modelRef.current.rotation.y += 0.004; // Slightly faster rotation (was 0.003)
    }

    // Timer for the flip sequence
    setTimePassed(prev => prev + delta);

    // Start the sequence after 10 seconds
    if (timePassed >= 10 && !isFlipping && !isPausing) {
      setIsPausing(true);
      setTimePassed(0);
    }

    // Handle pause before flip
    if (isPausing) {
      setPauseTimer(prev => prev + delta);
      if (pauseTimer >= 0.5) { // Shorter pause (0.5 seconds)
        setPauseTimer(0);
        setIsPausing(false);
        setIsFlipping(true);
      }
    }

    // Handle flip
    if (isFlipping) {
      modelRef.current.rotation.x += 0.1;
      if (modelRef.current.rotation.x >= Math.PI * 2) {
        modelRef.current.rotation.x = 0;
        setIsFlipping(false);
      }
    }
  });

  return (
    <>
      <ambientLight intensity={0.5} /> 
      <directionalLight 
        position={[10, 10, 5]} 
        intensity={0} 
      />
      <group {...props} dispose={null} ref={modelRef} scale={[0.8,0.8,0.8]} position={[0, 2, 0]}>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Object_4.geometry}
          material={materials['sun-shroom']}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Object_5.geometry}
          material={materials.Outline}
        />
      </group>
    </>
  )
}

useGLTF.preload('/models/sun-shroom.glb')