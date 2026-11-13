'use client';

import React from 'react';
import { Search, Bell } from 'lucide-react';
import { BackendStatusBadge } from '../BackendStatusBadge';

interface TopBarProps {
  roleName: string;
  userName: string;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onBellClick?: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  roleName,
  userName,
  searchQuery,
  onSearchChange,
  onBellClick,
}) => {
  return (
    <div className="h-16 bg-white border-b border-typhoon-border px-8 flex items-center justify-between sticky top-0 z-30">
      {/* Left Search Bar */}
      <div className="relative w-96">
        <Search className="w-4 h-4 text-typhoon-muted absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search customer name, phone, or Follow-up ID..."
          className="w-full pl-9 pr-4 py-2 bg-typhoon-sand rounded-xl text-xs text-typhoon-navy placeholder:text-typhoon-muted border border-transparent focus:border-typhoon-gold focus:outline-none transition-all"
        />
      </div>

      {/* Right Notifications and User Info */}
      <div className="flex items-center gap-4">
        <BackendStatusBadge />

        <button
          onClick={onBellClick}
          className="w-9 h-9 rounded-full bg-typhoon-sand hover:bg-typhoon-sand-dark flex items-center justify-center text-typhoon-navy transition-colors"
        >
          <Bell className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 pl-2 border-l border-typhoon-border">
          <div className="w-8 h-8 rounded-full bg-typhoon-navy text-typhoon-gold font-bold text-xs flex items-center justify-center">
            {userName.slice(0, 2).toUpperCase()}
          </div>
          <div className="text-left">
            <span className="text-xs font-bold text-typhoon-navy block leading-tight">
              {userName}
            </span>
            <span className="text-[10px] text-typhoon-muted block">
              {roleName}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

