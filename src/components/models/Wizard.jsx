"use client"
import React, { useRef, useState } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from 'three';

export default function Wizard(props) {
  const { nodes, materials } = useGLTF('/models/scene-transformed.glb');
  const modelRef = useRef();
  const { mouse } = useThree();
  const [scale, setScale] = useState(1.7);

  // Handle mouse tracking and floating animation
  useFrame((state, delta) => {
    if (!modelRef.current) return;

    // Enhanced floating animation
    const floatingY = -1.4 + Math.sin(state.clock.elapsedTime * 2) * 0.08;
    
    // Rotation calculations
    const targetRotationY = (mouse.x * Math.PI) / 4;
    const targetRotationX = 0.29 - (mouse.y * Math.PI) / 4;
    
    // Apply transformations
    modelRef.current.position.y = floatingY;
    modelRef.current.rotation.y = THREE.MathUtils.lerp(
      modelRef.current.rotation.y,
      targetRotationY,
      0.05
    );
    modelRef.current.rotation.x = THREE.MathUtils.lerp(
      modelRef.current.rotation.x,
      targetRotationX,
      0.05
    );

    // Smooth scale transitions
    modelRef.current.scale.x = THREE.MathUtils.lerp(modelRef.current.scale.x, scale, 0.1);
    modelRef.current.scale.y = THREE.MathUtils.lerp(modelRef.current.scale.y, scale, 0.1);
    modelRef.current.scale.z = THREE.MathUtils.lerp(modelRef.current.scale.z, scale, 0.1);
  });

  const handlePointerOver = () => {
    setScale(1.8);
    document.body.style.cursor = 'pointer';
  };

  const handlePointerOut = () => {
    setScale(1.7);
    document.body.style.cursor = 'auto';
  };

  return (
    <group
      {...props}
      dispose={null}
      ref={modelRef}
      position={[0, -1.3, 0]}
      scale={[1.7, 1.7, 1.7]}
      rotation={[0.29, 0, 0]}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    >
      <primitive object={nodes.Hips} />
      <skinnedMesh
        name="EyeLeft"
        geometry={nodes.EyeLeft.geometry}
        material={materials.Wolf3D_Eye}
        skeleton={nodes.EyeLeft.skeleton}
        morphTargetDictionary={nodes.EyeLeft.morphTargetDictionary}
        morphTargetInfluences={nodes.EyeLeft.morphTargetInfluences}
      />
      <skinnedMesh
        name="EyeRight"
        geometry={nodes.EyeRight.geometry}
        material={materials.Wolf3D_Eye}
        skeleton={nodes.EyeRight.skeleton}
        morphTargetDictionary={nodes.EyeRight.morphTargetDictionary}
        morphTargetInfluences={nodes.EyeRight.morphTargetInfluences}
      />
      <skinnedMesh
        name="Wolf3D_Head"
        geometry={nodes.Wolf3D_Head.geometry}
        material={materials.Wolf3D_Skin}
        skeleton={nodes.Wolf3D_Head.skeleton}
        morphTargetDictionary={nodes.Wolf3D_Head.morphTargetDictionary}
        morphTargetInfluences={nodes.Wolf3D_Head.morphTargetInfluences}
        position={[0, 0, -0.014]}
      />
      <skinnedMesh
        name="Wolf3D_Teeth"
        geometry={nodes.Wolf3D_Teeth.geometry}
        material={materials.Wolf3D_Teeth}
        skeleton={nodes.Wolf3D_Teeth.skeleton}
        morphTargetDictionary={nodes.Wolf3D_Teeth.morphTargetDictionary}
        morphTargetInfluences={nodes.Wolf3D_Teeth.morphTargetInfluences}
      />
      <skinnedMesh
        geometry={nodes.Wolf3D_Hair.geometry}
        material={materials.Wolf3D_Hair}
        skeleton={nodes.Wolf3D_Hair.skeleton}
      />
      <skinnedMesh
        geometry={nodes.Wolf3D_Glasses.geometry}
        material={materials.Wolf3D_Glasses}
        skeleton={nodes.Wolf3D_Glasses.skeleton}
      />
      <skinnedMesh
        geometry={nodes.Wolf3D_Outfit_Top.geometry}
        material={materials.Wolf3D_Outfit_Top}
        skeleton={nodes.Wolf3D_Outfit_Top.skeleton}
      />
      <skinnedMesh
        geometry={nodes.Wolf3D_Outfit_Bottom.geometry}
        material={materials.Wolf3D_Outfit_Bottom}
        skeleton={nodes.Wolf3D_Outfit_Bottom.skeleton}
      />
      <skinnedMesh
        geometry={nodes.Wolf3D_Outfit_Footwear.geometry}
        material={materials.Wolf3D_Outfit_Footwear}
        skeleton={nodes.Wolf3D_Outfit_Footwear.skeleton}
      />
      <skinnedMesh
        geometry={nodes.Wolf3D_Body.geometry}
        material={materials.Wolf3D_Body}
        skeleton={nodes.Wolf3D_Body.skeleton}
      />
    </group>
  );
}

useGLTF.preload('/models/scene-transformed.glb');