import React from 'react';
import NavButton from './NavButton';

const NavigationCircle = () => {
    // Navigation items in the order they should appear
    const navItems = [
        { icon: 'home', label: 'Home', link: '/' },
        { icon: 'about', label: 'About', link: '/about' },
        { icon: 'projects', label: 'Projects', link: '/projects' },
        { icon: 'contact', label: 'Contact', link: '/contact' },
        { icon: 'github', label: 'GitHub', link: 'https://github.com', newTab: true },
        { icon: 'linkedin', label: 'LinkedIn', link: 'https://linkedin.com', newTab: true },
        { icon: 'instagram', label: 'Instagram', link: 'https://instagram.com', newTab: true },
        { icon: 'resume', label: 'Resume', link: '/resume' }
    ];

    // Calculate positions in a circle
    const radius = 150; // Radius of the circle in pixels
    const getPosition = (index) => {
        const angle = (index / navItems.length) * 2 * Math.PI - Math.PI / 2; // Start from top
        const x = radius * Math.cos(angle);
        const y = radius * Math.sin(angle);
        return { x: `${x}px`, y: `${y}px` };
    };

    return (
        <div className="relative w-full h-full flex items-center justify-center">
            {navItems.map((item, index) => {
                const pos = getPosition(index);
                return (
                    <NavButton
                        key={item.icon}
                        x={pos.x}
                        y={pos.y}
                        icon={item.icon}
                        label={item.label}
                        link={item.link}
                        newTab={item.newTab}
                        index={index} // This controls the fade-in sequence
                    />
                );
            })}
            
            {/* Center element (3D model) placeholder */}
            <div className="w-32 h-32 rounded-full bg-accent/10 backdrop-blur-sm">
                {/* Your 3D model goes here */}
            </div>
        </div>
    );
};

export default NavigationCircle;