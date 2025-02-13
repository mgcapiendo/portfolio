"use client"

import React from 'react';
import { ChevronDown } from 'lucide-react';

const ScrollIndicator = () => {
  return (
    <div className=" bottom-10 left-1/25 -translate-x-1/2 animate-bounce">
      <div className="flex flex-col items-center gap-2 text-accent/80 hover:text-accent cursor-pointer transition-colors"
           onClick={() => window.scrollTo({
             top: window.innerHeight,
             behavior: 'smooth'
           })}>
        <span className="text-sm font-light">Scroll Down</span>
        <ChevronDown size={30} strokeWidth={5} />
      </div>
    </div>
  );
};

export default ScrollIndicator;