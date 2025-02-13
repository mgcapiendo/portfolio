'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

const WelcomeBubble = () => {
    const [showBubble, setShowBubble] = useState(true);
    const pathname = usePathname();

    useEffect(() => {
        // Only run the timer if we're on the home page
        if (pathname === '/') {
            const timer = setTimeout(() => {
                setShowBubble(false);
            }, 7000);

            return () => clearTimeout(timer);
        }
    }, [pathname]);

    // Return null if not on home page or bubble is hidden
    if (pathname !== '/' || !showBubble) return null;

    return (
        <div className="fixed top-4 sm:top-8 right-4 sm:right-8 z-50 w-[calc(100%-2rem)] sm:w-auto max-w-[500px] sm:max-w-sm animate-fade-in">
            <div className="relative bg-background/20 backdrop-blur-sm p-4 sm:p-6 rounded-lg border border-accent/30 text-foreground">
                <button 
                    onClick={() => setShowBubble(false)}
                    className="absolute -top-2 -right-2 w-6 sm:w-7 h-6 sm:h-7 rounded-full bg-accent/30 
                        flex items-center justify-center hover:bg-accent/50 transition-colors text-base sm:text-lg"
                >
                    ×
                </button>
                <p className="text-sm sm:text-base">
                    Welcome to my creative space! Feel free to explore and don&apos;t forget to turn on the sound for the full experience! 🎵
                </p>
            </div>
        </div>
    );
};

export default WelcomeBubble;  // Only one export statement