"use client"

import { BtnList } from '@/app/data'
import React, { useEffect, useState } from 'react'
import NavButton from './NavButton'
import { motion } from "framer-motion"

const Navigation = () => {
    const [radius, setRadius] = useState('350px');
    
    useEffect(() => {
        const updateRadius = () => {
            const minViewportSize = Math.min(window.innerWidth, window.innerHeight);
            
            let newRadius;
            if (minViewportSize < 640) {
                newRadius = minViewportSize * 0.35;
            } else if (minViewportSize < 1024) {
                newRadius = minViewportSize * 0.38;
            } else {
                newRadius = Math.min(minViewportSize * 0.4, 350);
            }
            
            setRadius(`${newRadius}px`);
        };

        updateRadius();
        window.addEventListener('resize', updateRadius);
        return () => window.removeEventListener('resize', updateRadius);
    }, []);

    const angleIncrement = 360 / BtnList.length;

    return (
        <div className='w-full fixed inset-0 flex items-center justify-center pointer-events-none'
            style={{ 
                zIndex: 1000,
                height: '100dvh' // Use dynamic viewport height
            }}
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
                className='flex items-center justify-center relative animate-spin-slow'
                style={{
                    position: 'fixed',  // Keep it fixed in viewport
                    left: '50%',        // Center horizontally
                    top: '50%',         // Center vertically
                    transform: 'translate(-50%, -50%)'  // Perfect centering
                }}
            >
                {BtnList.map((btn, index) => {
                    const angleRad = (index * angleIncrement * Math.PI) / 180;
                    const x = `calc(${radius}*${Math.cos(angleRad)})`;
                    const y = `calc(${radius}*${Math.sin(angleRad)})`;

                    return <NavButton key={btn.label} x={x} y={y} {...btn} />;
                })}
            </motion.div>
        </div>
    )
}

export default Navigation