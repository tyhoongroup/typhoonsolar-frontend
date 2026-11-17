'use client';

import React, { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { getRoleTheme } from '@/lib/role-theme';
import { ProfileModal } from './ProfileModal';
import { NotificationModal } from './NotificationModal';
import { toast } from 'sonner';
import { requestNotificationPermission } from '@/lib/fcm-client';

interface HeaderProps {
  initials?: string;
  roleTitle: string;
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

  const headerTextColor = theme.hex.headerTextColor || '#ffffff';
  const headerSubtextColor = theme.hex.headerSubtextColor || 'rgba(255, 255, 255, 0.85)';
  const isLightHeader = headerTextColor === '#1E1F24';

  return (
    <>
      <header
        style={{ backgroundColor: theme.hex.headerBg, color: headerTextColor }}
        className="relative pt-6 pb-16 px-4 rounded-b-[32px] overflow-hidden shadow-soft transition-colors duration-300 border-b border-black/5"
      >
        {/* Decorative concentric solar ripples in background */}
        <div
          className={`absolute -top-12 -right-12 w-48 h-48 rounded-full border pointer-events-none ${
            isLightHeader ? 'border-black/5' : 'border-white/5'
          }`}
        />
        <div
          className={`absolute -top-6 -right-6 w-36 h-36 rounded-full border pointer-events-none ${
            isLightHeader ? 'border-black/10' : 'border-white/10'
          }`}
        />

        {/* Top Bar with Avatar and Official Brand Logo */}
        <div className="relative flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <button
              onClick={handleAvatarClick}
              style={{
                color: headerTextColor,
                borderColor: isLightHeader ? 'rgba(30, 31, 36, 0.25)' : 'rgba(255, 255, 255, 0.2)',
                backgroundColor: isLightHeader ? 'rgba(30, 31, 36, 0.08)' : 'rgba(255, 255, 255, 0.1)',
              }}
              className="w-11 h-11 rounded-full border font-bold flex items-center justify-center text-sm tracking-wider hover:ring-2 hover:ring-black/20 active:scale-95 transition cursor-pointer"
              title="Click for Profile & Logout"
            >
              {displayInitials}
            </button>
            <img
              src={isLightHeader ? '/images/typhoon-logo.png' : '/images/typhoon-logo-white.png'}
              alt="Typhoon Solar"
              className="h-7 w-auto object-contain drop-shadow-sm opacity-95"
            />
          </div>

          <button
            onClick={handleBellClick}
            style={{
              color: headerTextColor,
              backgroundColor: isLightHeader ? 'rgba(30, 31, 36, 0.08)' : 'rgba(255, 255, 255, 0.1)',
            }}
            className="relative w-11 h-11 rounded-full hover:opacity-85 flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Lead Alerts & Notifications"
            title="Lead Alerts & Notifications"
          >
            <Bell className="w-5 h-5" style={{ color: headerTextColor }} />
            <span
              style={{ backgroundColor: theme.hex.accentBg }}
              className={`absolute top-2.5 right-2.5 w-2 h-2 rounded-full ring-2 ${
                isLightHeader ? 'ring-black/30' : 'ring-white/40'
              }`}
            />
          </button>
        </div>

        {/* Role Title and Subtitle with clear readable typography */}
        <div className="relative">
          <p style={{ color: headerSubtextColor }} className="text-xs sm:text-sm font-medium mb-1">
            {todayStr}
          </p>
          <h1
            style={{ color: headerTextColor }}
            className="text-3xl sm:text-4xl font-serif font-bold tracking-tight"
          >
            {displayTitle}
          </h1>
          <p style={{ color: headerSubtextColor }} className="text-sm sm:text-base font-medium mt-1">
            {displaySubtitle}
          </p>
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
