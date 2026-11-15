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
        {/* Large Circular Gold Ring with Big Radiant Solar Emblem (Image 2) */}
        <div className="relative mb-8">
          <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-full border-2 sm:border-[2.5px] border-[#F5A623] bg-[#0B192C] flex items-center justify-center shadow-[0_0_60px_rgba(245,166,35,0.35)] relative">
            {/* Big Radiant Sun Emblem matching Image 2 */}
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="#F5A623"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-20 h-20 sm:w-24 sm:h-24 text-[#F5A623] drop-shadow-[0_0_20px_rgba(245,166,35,0.7)]"
            >
              <circle cx="12" cy="12" r="4.5" stroke="#F5A623" strokeWidth="2" />
              <path d="M12 2v2.5" strokeWidth="2.5" />
              <path d="M12 19.5v2.5" strokeWidth="2.5" />
              <path d="m4.93 4.93 1.77 1.77" strokeWidth="2.5" />
              <path d="m17.3 17.3 1.77 1.77" strokeWidth="2.5" />
              <path d="M2 12h2.5" strokeWidth="2.5" />
              <path d="M19.5 12h2.5" strokeWidth="2.5" />
              <path d="m6.7 17.3-1.77 1.77" strokeWidth="2.5" />
              <path d="m19.07 4.93-1.77 1.77" strokeWidth="2.5" />
            </svg>
          </div>
          {/* Subtle outer radiating pulse ring */}
          <div className="absolute inset-0 rounded-full border border-[#F5A623]/30 animate-ping duration-1000 pointer-events-none" />
        </div>

        {/* Brand Name in elegant serif (Image 2) */}
        <h1 className="text-4xl sm:text-5xl font-serif font-bold text-white tracking-tight drop-shadow-md">
          Typhoon Solar
        </h1>

        {/* Subtitle in tracked gold uppercase (Image 2) */}
        <p className="text-xs sm:text-sm font-bold tracking-[0.35em] text-[#F5A623] uppercase mt-3">
          TEAM APP
        </p>

        {/* Small subtle loading spinner at bottom */}
        <div className="mt-12 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#F5A623] animate-bounce" style={{ animationDelay: '0ms' }} />
          <span className="w-2 h-2 rounded-full bg-[#F5A623] animate-bounce" style={{ animationDelay: '150ms' }} />
          <span className="w-2 h-2 rounded-full bg-[#F5A623] animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  );
}
