"use client"

import { BtnList } from '@/app/data'
import React, { useEffect, useState } from 'react'
import NavButton from './NavButton'
import { motion } from "framer-motion"

const Navigation = () => {
    const [radius, setRadius] = useState('350px');
    
    useEffect(() => {
        const updateRadius = () => {
            // Get the smallest viewport dimension
            const minViewportSize = Math.min(window.innerWidth, window.innerHeight);
            
            // Set radius based on screen size
            let newRadius;
            if (minViewportSize < 640) { // mobile
                newRadius = minViewportSize * 0.35;
            } else if (minViewportSize < 1024) { // tablet
                newRadius = minViewportSize * 0.38;
            } else { // desktop
                newRadius = Math.min(minViewportSize * 0.4, 350);
            }
            
            setRadius(`${newRadius}px`);
        };

        // Set initial radius
        updateRadius();

        // Update radius when window is resized
        window.addEventListener('resize', updateRadius);
        
        // Cleanup
        return () => window.removeEventListener('resize', updateRadius);
    }, []);

    const angleIncrement = 360 / BtnList.length;

    return (
        <div className='w-full fixed h-screen flex items-center justify-center pointer-events-none'
            style={{ zIndex: 1000 }}
        >
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className='flex items-center justify-center relative hover:pause animate-spin-slow group'
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