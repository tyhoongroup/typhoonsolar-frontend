import React from 'react';
import { Bell } from 'lucide-react';
import { getRoleTheme } from '@/lib/role-theme';

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
  const theme = getRoleTheme(role);
  const displayInitials = initials || theme.tag;
  const displayTitle = roleTitle || theme.roleName;
  const displaySubtitle = subtitle || theme.subtitle;

  const todayStr = new Intl.DateTimeFormat('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(new Date());

  return (
    <header
      style={{ backgroundColor: theme.hex.headerBg }}
      className={`relative ${theme.headerBg} text-white pt-6 pb-16 px-4 rounded-b-[32px] overflow-hidden shadow-soft transition-colors duration-300 border-b border-white/5`}
    >
      {/* Decorative concentric solar ripples in background */}
      <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full border border-white/5 pointer-events-none" />
      <div className="absolute -top-6 -right-6 w-36 h-36 rounded-full border border-white/10 pointer-events-none" />

      {/* Top Bar with Avatar and Bell */}
      <div className="relative flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onAvatarClick}
            style={{ color: theme.hex.accentBg }}
            className={`w-10 h-10 rounded-full border border-white/20 bg-white/10 font-bold flex items-center justify-center text-xs tracking-wider`}
          >
            {displayInitials}
          </button>
          <span className="text-[11px] font-semibold tracking-widest text-white/90 uppercase">
            TYPHOON SOLAR
          </span>
        </div>

        <button
          onClick={onBellClick}
          className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5 text-white/90" />
        </button>
      </div>

      {/* Role Title and Subtitle */}
      <div className="relative">
        <p className="text-xs text-white/60 mb-1">{todayStr}</p>
        <h1 className="text-3xl font-serif font-bold text-white tracking-tight">
          {displayTitle}
        </h1>
        <p className="text-xs text-white/70 mt-1">{displaySubtitle}</p>
      </div>
    </header>
  );
};

