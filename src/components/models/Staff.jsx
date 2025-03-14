import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'

export default function Staff(props) {
  const { nodes, materials } = useGLTF('/models/egg.glb')
  return (
    <group {...props} dispose={null}>
      <group rotation={[-Math.PI / 2, 0, 0]}>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.defaultMaterial.geometry}
          material={materials.phong2SG}
          rotation={[Math.PI / 2, 0, 0]}
        />
      </group>
    </group>
  )
}

useGLTF.preload('/models/egg.glb')