'use client';

import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import clsx from 'clsx';
import { Environment } from '@react-three/drei';

const RenderModel = ({ children, className }) => {  
  return (
    <Canvas
      className={clsx("w-screen h-screen relative", className)}
      camera={{
        
      }}
    >
      <Suspense fallback={null}>
        {children}
      </Suspense>
      <Environment preset='lobby'/>

      
    </Canvas>
  );
};

export default RenderModel;