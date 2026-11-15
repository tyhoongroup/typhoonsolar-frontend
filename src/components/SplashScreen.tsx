'use client';

import React, { useState, useEffect } from 'react';

interface SplashScreenProps {
  onFinish?: () => void;
  minDuration?: number;
}

export function SplashScreen({ onFinish, minDuration = 1800 }: SplashScreenProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    // Only show on first visit / app launch per session
    const timer = setTimeout(() => {
      setIsFading(true);
      setTimeout(() => {
        setIsVisible(false);
        if (onFinish) onFinish();
      }, 600); // 600ms fade transition
    }, minDuration);

    return () => clearTimeout(timer);
  }, [minDuration, onFinish]);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-[999] bg-[#0B192C] flex flex-col items-center justify-center overflow-hidden transition-opacity duration-700 ease-out select-none ${
        isFading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Top Concentric Solar Rings (exact match to Image 2) */}
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full border border-white/10 pointer-events-none animate-pulse duration-1000" />
      <div className="absolute -top-20 -left-20 w-[480px] h-[480px] rounded-full border border-white/5 pointer-events-none" />
      <div className="absolute -top-8 -left-8 w-[640px] h-[640px] rounded-full border border-white/5 pointer-events-none" />

      {/* Bottom Concentric Solar Rings (exact match to Image 2) */}
      <div className="absolute -bottom-48 -right-48 w-[500px] h-[500px] rounded-full border border-white/10 pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-[650px] h-[650px] rounded-full border border-white/5 pointer-events-none" />
      <div className="absolute -bottom-16 -right-16 w-[800px] h-[800px] rounded-full border border-white/5 pointer-events-none" />

      {/* Center Branding Block (exact match to Image 2) */}
      <div className="relative z-10 flex flex-col items-center text-center px-6">
        {/* Circular Gold Ring with Official Logo / Solar Icon */}
        <div className="relative mb-6">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-2 border-[#F5A623] bg-[#0B192C] p-4 flex items-center justify-center shadow-[0_0_40px_rgba(245,166,35,0.25)] relative">
            <img
              src="/icons/icon-192x192.png"
              alt="Typhoon Solar"
              className="w-full h-full object-contain drop-shadow"
            />
          </div>
          {/* Subtle outer radiating pulse ring */}
          <div className="absolute inset-0 rounded-full border border-[#F5A623]/30 animate-ping duration-1000 pointer-events-none" />
        </div>

        {/* Brand Name in elegant serif */}
        <h1 className="text-4xl sm:text-5xl font-serif font-bold text-white tracking-tight drop-shadow-md">
          Typhoon Solar
        </h1>

        {/* Subtitle in tracked gold uppercase */}
        <p className="text-xs sm:text-sm font-bold tracking-[0.3em] text-[#F5A623] uppercase mt-3">
          TEAM APP
        </p>

        {/* Small subtle loading spinner at bottom */}
        <div className="mt-12 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#F5A623] animate-bounce" style={{ animationDelay: '0ms' }} />
          <span className="w-1.5 h-1.5 rounded-full bg-[#F5A623] animate-bounce" style={{ animationDelay: '150ms' }} />
          <span className="w-1.5 h-1.5 rounded-full bg-[#F5A623] animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  );
}
