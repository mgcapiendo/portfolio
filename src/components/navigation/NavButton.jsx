
import React from 'react'
import Link from 'next/link'
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
    return (
        <div 
            className='absolute cursor-pointer pointer-events-auto z-50'
            style={{transform: `translate(${x}, ${y})`}}
        >
            <div className="animate-spin-slow">
                <div className="animate-spin-slow-reverse">
                    <Link 
                        href={link} 
                        target={newTab ? '_blank' : '_self'} 
                        className="text-foreground group rounded-full flex items-center justify-center
                        bg-background/20 border border-accent/30 border-solid backdrop-blur-sm 
                        shadow-glass-inset hover:shadow-glass-sm"
                        aria-label={label} 
                        name={label}
                    >
                        <span className="relative flex items-center justify-center w-10 h-10 md:w-14 md:h-14 
                            hover:text-accent animate-spin-slow-reverse">
                            <div className="w-5 h-5 md:w-6 md:h-6">
                                {getIcon(icon)}
                            </div>

                            <span className="peer bg-transparent absolute top-0 left-0 w-full h-full"/>
                        
                            <span className="absolute hidden peer-hover:block px-2 py-1 left-full mx-2 
                                top-1/2 -translate-y-1/2 bg-background text-foreground text-sm 
                                rounded-md shadow-lg whitespace-nowrap">
                                {label}
                            </span>
                        </span>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default NavButton