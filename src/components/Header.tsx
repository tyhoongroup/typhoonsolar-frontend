'use client';

import React, { useState, useEffect } from 'react';
import { getRoleTheme } from '@/lib/role-theme';
import { BrandLogo } from './BrandLogo';
import { ProfileModal } from './ProfileModal';
import { NotificationModal } from './NotificationModal';

interface HeaderProps {
  initials?: string;
  roleTitle?: string;
  subtitle?: string;
  role?: string;
  onAvatarClick?: () => void;
  onBellClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  initials,
  roleTitle,
  subtitle,
  role,
  onAvatarClick,
  onBellClick,
}) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('user');
      if (stored) {
        setCurrentUser(JSON.parse(stored));
      }
    } catch {}
  }, []);

  const theme = getRoleTheme(role || currentUser?.role);
  const displayInitials = initials || theme.tag;
  const displayTitle = roleTitle || theme.roleName;
  const displaySubtitle = subtitle || theme.subtitle;

  const handleAvatarClick = () => {
    if (onAvatarClick) onAvatarClick();
    setIsProfileOpen(true);
  };

  const handleBellClick = () => {
    if (onBellClick) {
      onBellClick();
      return;
    }
    setIsNotificationOpen(true);
  };

  const todayStr = new Intl.DateTimeFormat('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(new Date());

  const sColor = theme.hex.cardDarkBg || '#111827';
  const aColor = theme.hex.accentBg || '#6366F1';
  const cColor = theme.hex.lightBg || '#F5F5F7';

  return (
    <>
      <header
        style={{
          background: theme.hex.headerGradient || `linear-gradient(180deg, color-mix(in srgb, ${aColor} 38%, ${cColor}) 0%, color-mix(in srgb, ${aColor} 14%, ${cColor}) 100%)`,
          borderRadius: '0 0 50% 50% / 0 0 34px 34px',
          padding: '14px 16px 62px',
          color: sColor,
        }}
        className="relative transition-all duration-300"
      >
        {/* Top Bar: Avatar, Brand Logo, Bell */}
        <div className="flex items-center justify-between">
          <button
            onClick={handleAvatarClick}
            style={{
              color: sColor,
              backgroundColor: 'rgba(255, 255, 255, 0.75)',
              borderColor: `color-mix(in srgb, ${sColor} 15%, transparent)`,
            }}
            className="w-9 h-9 rounded-full border flex items-center justify-center text-xs font-bold active:scale-95 transition cursor-pointer"
            title="Profile & Settings"
          >
            {displayInitials}
          </button>

          <BrandLogo
            accentColor={aColor}
            textColor={sColor}
            size={24}
          />

          <button
            onClick={handleBellClick}
            style={{
              color: sColor,
              backgroundColor: 'rgba(255, 255, 255, 0.55)',
            }}
            className="relative w-9 h-9 rounded-full flex items-center justify-center hover:opacity-85 active:scale-95 transition cursor-pointer"
            aria-label="Alerts"
            title="Alerts"
          >
            <svg
              width="17"
              height="17"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ color: sColor }}
            >
              <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
              <path d="M10.3 21a1.9 1.9 0 0 0 3.4 0" />
            </svg>
            <span
              style={{
                backgroundColor: aColor,
                borderColor: '#ffffff',
              }}
              className="absolute top-[7px] right-[8px] w-2 h-2 rounded-full border-[1.5px]"
            />
          </button>
        </div>

        {/* Date, Title, Subtitle */}
        <div className="text-[11px] font-medium opacity-70 mt-4">
          {todayStr}
        </div>
        <div className="text-2xl font-extrabold tracking-[-0.02em] mt-1.5 leading-[1.1]">
          {displayTitle}
        </div>
        <div className="text-xs font-medium opacity-70 mt-1">
          {displaySubtitle}
        </div>
      </header>

      {/* Profile & Logout Dialog */}
      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        user={currentUser || { fullName: displayTitle, role: role || 'OPS_MANAGER' }}
      />

      {/* In-App Notifications Modal */}
      <NotificationModal
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
      />
    </>
  );
};
