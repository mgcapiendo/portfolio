import React, { useEffect, useRef } from 'react'
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

const NavButton = ({x, y, label, link, icon, newTab}) => {
    const containerRef = useRef(null);
    const spinRef = useRef(null);
    const spinReverseRef = useRef(null);

    const resetAnimations = () => {
        // Only reset the spin animations, not the container position
        [spinRef.current, spinReverseRef.current].forEach(element => {
            if (element) {
                element.style.animation = 'none';
                element.offsetHeight;
                element.style.animation = '';
            }
        });
    };

    useEffect(() => {
        if (containerRef.current) {
            // Set initial position
            containerRef.current.style.transform = `translate3d(${x}, ${y}, 0)`;
            containerRef.current.style.WebkitTransform = `translate3d(${x}, ${y}, 0)`;
        }
        
        resetAnimations();

        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                // Ensure position is maintained while resetting animations
                if (containerRef.current) {
                    containerRef.current.style.transform = `translate3d(${x}, ${y}, 0)`;
                    containerRef.current.style.WebkitTransform = `translate3d(${x}, ${y}, 0)`;
                }
                resetAnimations();
            }
        };

        const handleFocus = () => {
            if (containerRef.current) {
                containerRef.current.style.transform = `translate3d(${x}, ${y}, 0)`;
                containerRef.current.style.WebkitTransform = `translate3d(${x}, ${y}, 0)`;
            }
            resetAnimations();
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        window.addEventListener('focus', handleFocus);
        window.addEventListener('pageshow', (event) => {
            if (event.persisted) {
                if (containerRef.current) {
                    containerRef.current.style.transform = `translate3d(${x}, ${y}, 0)`;
                    containerRef.current.style.WebkitTransform = `translate3d(${x}, ${y}, 0)`;
                }
                resetAnimations();
            }
        });

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            window.removeEventListener('focus', handleFocus);
        };
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
                perspective: '1000px'
            }}
        >
            <div 
                ref={spinRef}
                className="animate-spin-slow"
                style={{
                    transformStyle: 'preserve-3d',
                    WebkitTransformStyle: 'preserve-3d',
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden'
                }}
            >
                <div 
                    ref={spinReverseRef}
                    className="animate-spin-slow-reverse"
                    style={{
                        transformStyle: 'preserve-3d',
                        WebkitTransformStyle: 'preserve-3d',
                        backfaceVisibility: 'hidden',
                        WebkitBackfaceVisibility: 'hidden'
                    }}
                >
                    <a 
                        href={link} 
                        target={newTab ? '_blank' : '_self'} 
                        rel={newTab ? "noopener noreferrer" : undefined}
                        className="text-foreground group rounded-full flex items-center justify-center
                            bg-background/20 border border-accent/30 border-solid backdrop-blur-sm 
                            shadow-glass-inset hover:shadow-glass-sm"
                        aria-label={label}
                        onClick={() => {
                            setTimeout(resetAnimations, 0);
                        }}
                    >
                        <span className="relative flex items-center justify-center w-10 h-10 md:w-14 md:h-14 
                            hover:text-accent animate-spin-slow-reverse"
                        >
                            <div className="w-5 h-5 md:w-6 md:h-6">
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
        </div>
    );
};

export default NavButton;