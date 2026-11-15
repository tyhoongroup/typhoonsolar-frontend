'use client';

import React, { useState, useEffect } from 'react';
import { Download, X, Share2, PlusSquare, MoreVertical, Smartphone, CheckCircle } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export function PwaInstallModal() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showManualGuide, setShowManualGuide] = useState(false);

  useEffect(() => {
    // 1. Check if already installed & running in standalone mode
    if (typeof window !== 'undefined') {
      const isStandalone =
        window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as any).standalone === true ||
        document.referrer.includes('android-app://');

      if (isStandalone) {
        setIsInstalled(true);
        return;
      }

      // 2. Detect iOS device
      const userAgent = window.navigator.userAgent.toLowerCase();
      const isApple = /iphone|ipad|ipod/.test(userAgent);
      setIsIOS(isApple);

      // 3. Listen for browser native install prompt event
      const handleBeforeInstallPrompt = (e: Event) => {
        e.preventDefault();
        setDeferredPrompt(e as BeforeInstallPromptEvent);
        // Show install modal automatically on screen refresh/load
        setIsOpen(true);
      };

      window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

      // 4. Also listen for appinstalled event
      window.addEventListener('appinstalled', () => {
        setIsInstalled(true);
        setIsOpen(false);
        setDeferredPrompt(null);
      });

      // 5. On page refresh / load: if not standalone and not installed, show modal after brief delay
      const timer = setTimeout(() => {
        const dismissedRecently = sessionStorage.getItem('typhoon_pwa_dismissed');
        if (!dismissedRecently) {
          setIsOpen(true);
        }
      }, 1000);

      return () => {
        window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        clearTimeout(timer);
      };
    }
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      try {
        await deferredPrompt.prompt();
        const choice = await deferredPrompt.userChoice;
        if (choice.outcome === 'accepted') {
          setIsInstalled(true);
          setIsOpen(false);
        }
        setDeferredPrompt(null);
      } catch (err) {
        setShowManualGuide(true);
      }
    } else {
      // If native deferredPrompt is unavailable (e.g. iOS or plain HTTP), show 2-step guide
      setShowManualGuide(true);
    }
  };

  const handleDismiss = () => {
    setIsOpen(false);
    sessionStorage.setItem('typhoon_pwa_dismissed', 'true');
  };

  if (isInstalled || !isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-[28px] max-w-sm w-full p-6 shadow-2xl border border-typhoon-border relative overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Decorative Top Solar Glow */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-typhoon-gold via-orange-400 to-amber-500" />

        {/* Close Button */}
        <button
          onClick={handleDismiss}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-typhoon-sand hover:bg-typhoon-sand-dark flex items-center justify-center text-typhoon-muted hover:text-typhoon-navy transition"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* App Logo & Title */}
        <div className="text-center pt-2 pb-4">
          <div className="w-20 h-20 mx-auto mb-3 rounded-2xl bg-[#0B192C] p-2.5 shadow-lg border border-typhoon-gold/30 flex items-center justify-center">
            <img
              src="/icons/icon-192x192.png"
              alt="Typhoon Solar"
              className="w-full h-full object-contain"
            />
          </div>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-typhoon-gold border border-amber-200 mb-2">
            <Smartphone className="w-3 h-3" /> Official Mobile App
          </span>

          <h3 className="text-xl font-serif font-bold text-typhoon-navy">
            Install Typhoon Solar
          </h3>
          <p className="text-xs text-typhoon-muted mt-1 px-2 leading-relaxed">
            Install the app on your home screen for instant 1-tap launch, full screen view, and lightning-fast speed.
          </p>
        </div>

        {/* Benefits List */}
        <div className="bg-typhoon-sand/60 rounded-2xl p-3 mb-5 space-y-2 border border-typhoon-border/60 text-left">
          <div className="flex items-center gap-2 text-xs text-typhoon-navy font-medium">
            <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>Opens instantly like a native Android & iOS app</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-typhoon-navy font-medium">
            <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>Works in clean full-screen mode without browser bars</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-typhoon-navy font-medium">
            <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>Remembers your login and role colors securely</span>
          </div>
        </div>

        {/* Manual Step Guide (Shown if native prompt needs browser action or on iOS) */}
        {showManualGuide && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-4 text-left animate-in fade-in duration-200">
            <p className="text-xs font-bold text-amber-900 mb-2 flex items-center gap-1.5">
              Follow these 2 quick steps:
            </p>
            {isIOS ? (
              <ol className="text-xs text-amber-900/90 space-y-2 pl-1">
                <li className="flex items-start gap-2">
                  <span className="font-bold bg-amber-200 text-amber-900 w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-[11px]">
                    1
                  </span>
                  <span>
                    Tap the <strong>Share</strong> button <Share2 className="w-3.5 h-3.5 inline mx-1" /> at the bottom of Safari.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold bg-amber-200 text-amber-900 w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-[11px]">
                    2
                  </span>
                  <span>
                    Scroll down and tap <strong>Add to Home Screen</strong> <PlusSquare className="w-3.5 h-3.5 inline mx-1" />.
                  </span>
                </li>
              </ol>
            ) : (
              <ol className="text-xs text-amber-900/90 space-y-2 pl-1">
                <li className="flex items-start gap-2">
                  <span className="font-bold bg-amber-200 text-amber-900 w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-[11px]">
                    1
                  </span>
                  <span>
                    Tap the browser menu <MoreVertical className="w-3.5 h-3.5 inline mx-0.5" /> (3 dots at top-right of Chrome).
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold bg-amber-200 text-amber-900 w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-[11px]">
                    2
                  </span>
                  <span>
                    Tap <strong>"Install app"</strong> or <strong>"Add to Home screen"</strong>.
                  </span>
                </li>
              </ol>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-2">
          {!showManualGuide ? (
            <button
              onClick={handleInstallClick}
              className="w-full py-3.5 px-4 rounded-2xl bg-typhoon-navy text-white font-bold text-sm shadow-md hover:bg-typhoon-navy-light active:scale-98 transition flex items-center justify-center gap-2 group cursor-pointer"
            >
              <Download className="w-4 h-4 text-typhoon-gold group-hover:translate-y-0.5 transition" />
              <span>Install App Now</span>
            </button>
          ) : (
            <button
              onClick={() => setShowManualGuide(false)}
              className="w-full py-3 px-4 rounded-2xl bg-amber-500 text-white font-bold text-sm shadow hover:bg-amber-600 active:scale-98 transition text-center cursor-pointer"
            >
              Got It
            </button>
          )}

          <button
            onClick={handleDismiss}
            className="w-full py-2.5 text-xs text-typhoon-muted hover:text-typhoon-navy transition font-medium text-center cursor-pointer"
          >
            Continue in Browser
          </button>
        </div>
      </div>
    </div>
  );
}
