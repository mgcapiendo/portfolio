'use client';

import React, { useState, useEffect } from 'react';

const WelcomeBubble = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 1000);

        
        const hideTimer = setTimeout(() => {
            setIsVisible(false);
        }, 11000);

        return () => {
            clearTimeout(timer);
            clearTimeout(hideTimer);
        };
    }, []);

    return (
        <div className={`fixed z-50 transition-all duration-700 transform
            left-6 top-6 sm:left-8 sm:top-8
            ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full'}`}
        >
            <div className="relative bg-background/20 backdrop-blur-sm border border-accent/30 
                p-4 rounded-xl shadow-glass-inset hover:shadow-glass-sm
                max-w-[280px] sm:max-w-xs">
                
                <p className="text-sm sm:text-base leading-relaxed">
                    Hi, welcome to my realm...
                    <br /><br />
                    You&apos;ll find everything you need about me in these floating orbs. Choose your path and it will take you there.
                    <br /><br />
                    Enjoy your stay! ✨
                </p>
            </div>
        </div>
    );
};

export default WelcomeBubble;