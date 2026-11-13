'use client';

import React from 'react';
import Link from 'next/navigation';
import { Home, List, Users, BarChart3, User, Calendar, Phone, Package, ShieldAlert } from 'lucide-react';
import { getRoleTheme } from '@/lib/role-theme';

export interface NavItem {
  id: string;
  label: string;
  iconName: string;
  href: string;
}

interface BottomNavProps {
  items: NavItem[];
  activeId: string;
  onTabChange: (id: string) => void;
  role?: string;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  items,
  activeId,
  onTabChange,
  role,
}) => {
  const theme = getRoleTheme(role);

  const renderIcon = (name: string, isActive: boolean) => {
    const className = `w-5 h-5 ${isActive ? theme.navActiveText : 'text-white/70'}`;
    switch (name) {
      case 'home':
        return <Home className={className} />;
      case 'list':
      case 'inquiries':
        return <List className={className} />;
      case 'team':
        return <Users className={className} />;
      case 'stats':
        return <BarChart3 className={className} />;
      case 'visits':
      case 'calendar':
        return <Calendar className={className} />;
      case 'calls':
      case 'customers':
        return <Phone className={className} />;
      case 'planning':
      case 'jobs':
        return <Package className={className} />;
      case 'complaints':
        return <ShieldAlert className={className} />;
      default:
        return <User className={className} />;
    }
  };

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 max-w-md mx-auto">
      <nav className={`${theme.navBg} backdrop-blur-md rounded-full px-3 py-2 flex items-center justify-around shadow-floating border border-white/10`}>
        {items.map((item) => {
          const isActive = item.id === activeId;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`flex items-center gap-1.5 transition-all ${
                isActive
                  ? `${theme.navActiveBg} ${theme.navActiveText} px-4 py-2 rounded-full font-bold text-xs shadow-sm`
                  : 'p-2 text-white/70 hover:text-white'
              }`}
            >
              {renderIcon(item.iconName, isActive)}
              {isActive && <span>{item.label}</span>}
            </button>
          );
        })}
      </nav>
    </div>
  );
};

