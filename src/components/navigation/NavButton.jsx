"use client"

import React, { useEffect, useRef, useState } from 'react'
import { Home, Palette, Phone, User, Github, Linkedin, Instagram, Notebook } from 'lucide-react';

const getIcon = (icon) => {
    switch (icon) {
        case "home":
            return <Home strokeWidth={1.5} size="100%" />
        case "about":
            return <User strokeWidth={1.5} size="100%" />
        case "projects":
            return <Palette strokeWidth={1.5} size="100%" />
        case "contact":
            return <Phone strokeWidth={1.5} size="100%" />
        case "github":
            return <Github strokeWidth={1.5} size="100%" />
        case "linkedin":
            return <Linkedin strokeWidth={1.5} size="100%" />
        case "instagram":
            return <Instagram strokeWidth={1.5} size="100%" />
        case "resume":
            return <Notebook strokeWidth={1.5} size="100%" />
        default:
            return <Home strokeWidth={1.5} size="100%" />
    }
}

const NavButton = ({x, y, label, link, icon, newTab, index = 0, isParentVisible, startOrbit}) => {
    const containerRef = useRef(null);
    const [isVisible, setIsVisible] = useState(false);
    const [isFlashing, setIsFlashing] = useState(false);

    useEffect(() => {
        if (isParentVisible) {
            // Fade in sequence
            const fadeTimer = setTimeout(() => {
                setIsVisible(true);
                // Start flash effect after fade in
                setTimeout(() => {
                    setIsFlashing(true);
                    // Remove flash after short duration
                    setTimeout(() => {
                        setIsFlashing(false);
                    }, 200);
                }, 200);
            }, index * 300);
            
            return () => clearTimeout(fadeTimer);
        }
    }, [isParentVisible, index]);

    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.style.transform = `translate3d(${x}, ${y}, 0)`;
            containerRef.current.style.WebkitTransform = `translate3d(${x}, ${y}, 0)`;
        }
    }, [x, y]);

    return (
        <div 
            ref={containerRef}
            className="absolute cursor-pointer pointer-events-auto z-50"
            style={{
                transform: `translate3d(${x}, ${y}, 0)`,
                WebkitTransform: `translate3d(${x}, ${y}, 0)`,
                transformStyle: 'preserve-3d',
                WebkitTransformStyle: 'preserve-3d',
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden',
                WebkitPerspective: '1000px',
                perspective: '1000px',
                opacity: isVisible ? 1 : 0,
                transition: 'opacity 500ms ease-out',
                transitionDelay: `${index * 50}ms`
            }}
        >
            <div className={startOrbit ? 'animate-spin-slow-reverse' : ''}>
                <a 
                    href={link} 
                    target={newTab ? '_blank' : '_self'} 
                    rel={newTab ? "noopener noreferrer" : undefined}
                    className={`text-foreground group rounded-full flex items-center justify-center
                        bg-background/20 border border-accent/30 border-solid backdrop-blur-sm 
                        shadow-glass-inset hover:shadow-glass-sm transition-all duration-200
                        ${isFlashing ? 'bg-accent/40 shadow-accent/40' : ''}`}
                    aria-label={label}
                >
                    <span className="relative flex items-center justify-center w-10 h-10 md:w-14 md:h-14 
                        hover:text-accent"
                    >
                        <div className={`w-5 h-5 md:w-6 md:h-6 transition-transform duration-200 
                            ${isFlashing ? 'scale-125' : ''}`}>
                            {getIcon(icon)}
                        </div>

                        <span className="peer bg-transparent absolute top-0 left-0 w-full h-full"/>
                    
                        <span 
                            className="absolute hidden peer-hover:block px-2 py-1 left-full mx-2 
                                top-1/2 -translate-y-1/2 bg-background text-foreground text-sm 
                                rounded-md shadow-lg whitespace-nowrap"
                        >
                            {label}
                        </span>
                    </span>
                </a>
            </div>
        </div>
    );
};

export default NavButton;