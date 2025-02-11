'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

const AudioPlayer = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(30);
    const [showVolume, setShowVolume] = useState(false);
    const audioRef = useRef(null);
    
    useEffect(() => {
        audioRef.current = new Audio('/audio/birds39-forest-20772.mp3');
        audioRef.current.loop = true;
        audioRef.current.volume = volume / 100;

        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
        };
    }, []);

    const toggleSound = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const handleVolumeChange = (e) => {
        const newVolume = Number(e.target.value);
        setVolume(newVolume);
        if (audioRef.current) {
            audioRef.current.volume = newVolume / 100;
        }
    };

    return (
        <div 
            className="fixed bottom-6 right-6 z-50 flex items-center gap-4"
            onMouseEnter={() => setShowVolume(true)}
            onMouseLeave={() => setShowVolume(false)}
        >
            {/* Volume Slider - appears on hover */}
            <div className={`transition-all duration-300 ${showVolume ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
                <input
                    type="range"
                    min="0"
                    max="100"
                    value={volume}
                    onChange={handleVolumeChange}
                    className="w-24 h-1 bg-accent/30 rounded-lg appearance-none cursor-pointer
                    [&::-webkit-slider-thumb]:appearance-none
                    [&::-webkit-slider-thumb]:w-3
                    [&::-webkit-slider-thumb]:h-3
                    [&::-webkit-slider-thumb]:rounded-full
                    [&::-webkit-slider-thumb]:bg-accent"
                />
            </div>

            {/* Play/Pause Button */}
            <button
                onClick={toggleSound}
                className="p-3 rounded-full bg-background/20 
                    border border-accent/30 border-solid backdrop-blur-sm shadow-glass-inset 
                    hover:shadow-glass-sm transition-all duration-300"
                aria-label={isPlaying ? "Mute sound" : "Unmute sound"}
            >
                {isPlaying ? (
                    <Volume2 className="w-6 h-6 text-accent" />
                ) : (
                    <VolumeX className="w-6 h-6 text-accent" />
                )}
            </button>
        </div>
    );
};

export default AudioPlayer;