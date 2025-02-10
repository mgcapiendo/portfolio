"use client"
import { BtnList } from '@/app/data'
import React from 'react'
import NavButton from './NavButton'
import {motion} from "framer-motion"

const Navigation = () => {
    const angleIncrement = 360/BtnList.length;
    

    return (
        <div className='w-full fixed h-screen flex items-center justify-center pointer-events-none' style={{ zIndex: 1000 }}>
            <motion.div
            
            initial={{scale: 0}}
            whileInView={{scale:1}}

            className='flex items-center justify-center relative hover:pause animate-spin-slow group'>
                {
                    BtnList.map((btn, index) => {
                        const angleRad = (index*angleIncrement*Math.PI)/180
                        const radius = '350px'
                        const x = `calc(${radius}*${Math.cos(angleRad)})`;
                        const y = `calc(${radius}*${Math.sin(angleRad)})`;

                        return <NavButton key={btn.label} x={x} y={y} {...btn} />
                    })
                }
            </motion.div>
        </div>
    )
}

export default Navigation