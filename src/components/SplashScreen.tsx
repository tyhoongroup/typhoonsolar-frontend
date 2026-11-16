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
    // Check if splash already ran during this browser/PWA session
    const hasRun = sessionStorage.getItem('typhoon_splash_shown');
    if (hasRun) {
      setIsVisible(false);
      if (onFinish) onFinish();
      return;
    }

    const timer = setTimeout(() => {
      setIsFading(true);
      setTimeout(() => {
        setIsVisible(false);
        sessionStorage.setItem('typhoon_splash_shown', 'true');
        if (onFinish) onFinish();
      }, 500); // 500ms smooth fade transition
    }, minDuration);

    return () => clearTimeout(timer);
  }, [minDuration, onFinish]);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] bg-[#0B192C] flex flex-col items-center justify-center overflow-hidden transition-opacity duration-500 ease-out select-none ${
        isFading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Top Concentric Solar Rings (exact match to Image 2) */}
      <div className="absolute -top-36 -left-28 w-96 h-96 rounded-full border border-white/[0.08] pointer-events-none" />
      <div className="absolute -top-24 -left-16 w-[480px] h-[480px] rounded-full border border-white/[0.06] pointer-events-none" />
      <div className="absolute -top-12 -left-4 w-[640px] h-[640px] rounded-full border border-white/[0.04] pointer-events-none" />

      {/* Bottom Concentric Solar Rings (exact match to Image 2) */}
      <div className="absolute -bottom-48 -right-40 w-[520px] h-[520px] rounded-full border border-white/[0.08] pointer-events-none" />
      <div className="absolute -bottom-32 -right-24 w-[680px] h-[680px] rounded-full border border-white/[0.06] pointer-events-none" />
      <div className="absolute -bottom-16 -right-8 w-[840px] h-[840px] rounded-full border border-white/[0.04] pointer-events-none" />

      {/* Center Branding Block (exact match to Image 2) */}
      <div className="relative z-10 flex flex-col items-center text-center px-6">
        {/* Circular Gold Ring with Big Radiant Solar Emblem (Image 2) */}
        <div className="mb-8">
          <div className="w-32 h-32 sm:w-36 sm:h-36 rounded-full border border-[#F5A623] bg-[#0B192C] flex items-center justify-center relative">
            {/* Big Radiant Sun Emblem matching Image 2 */}
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="#F5A623"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-16 h-16 sm:w-18 sm:h-18 text-[#F5A623]"
            >
              <circle cx="12" cy="12" r="4.2" stroke="#F5A623" strokeWidth="2" />
              <line x1="12" y1="2" x2="12" y2="4.5" strokeWidth="2.4" />
              <line x1="12" y1="19.5" x2="12" y2="22" strokeWidth="2.4" />
              <line x1="4.93" y1="4.93" x2="6.7" y2="6.7" strokeWidth="2.4" />
              <line x1="17.3" y1="17.3" x2="19.07" y2="19.07" strokeWidth="2.4" />
              <line x1="2" y1="12" x2="4.5" y2="12" strokeWidth="2.4" />
              <line x1="19.5" y1="12" x2="22" y2="12" strokeWidth="2.4" />
              <line x1="4.93" y1="19.07" x2="6.7" y2="17.3" strokeWidth="2.4" />
              <line x1="17.3" y1="6.7" x2="19.07" y2="4.93" strokeWidth="2.4" />
            </svg>
          </div>
        </div>

        {/* Brand Name in elegant serif (Image 2) */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-white tracking-tight">
          Typhoon Solar
        </h1>

        {/* Subtitle in tracked gold uppercase (Image 2) */}
        <p className="text-xs sm:text-sm font-bold tracking-[0.35em] text-[#F5A623] uppercase mt-2.5">
          TEAM APP
        </p>
      </div>
    </div>
  );
}
