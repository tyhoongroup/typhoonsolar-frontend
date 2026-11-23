'use client';

import React from 'react';
import { Sun, LogOut, LayoutDashboard, Users, FileText, Package, Wrench, CreditCard, HelpCircle } from 'lucide-react';
import { getRoleTheme } from '@/lib/role-theme';

interface MenuItem {
  id: string;
  label: string;
  iconName: string;
}

interface SidebarProps {
  roleName: string;
  activeItem: string;
  menuItems: MenuItem[];
  onSelect: (id: string) => void;
  onSignOut: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  roleName,
  activeItem,
  menuItems,
  onSelect,
  onSignOut,
}) => {
  const theme = getRoleTheme(roleName);
  const sColor = theme.hex.cardDarkBg || '#0B192C';
  const aColor = theme.hex.accentBg || '#F5A623';
  const onColor = theme.hex.accentTextColor || '#FFFFFF';

  const renderIcon = (name: string, isActive: boolean) => {
    const cls = `w-4 h-4 ${isActive ? '' : 'text-white/70'}`;
    const activeStyle = isActive ? { color: onColor } : undefined;
    switch (name) {
      case 'dashboard':
      case 'inquiries':
        return <LayoutDashboard className={cls} style={activeStyle} />;
      case 'team':
        return <Users className={cls} style={activeStyle} />;
      case 'portal':
        return <FileText className={cls} style={activeStyle} />;
      case 'material':
        return <Package className={cls} style={activeStyle} />;
      case 'install':
      case 'service':
        return <Wrench className={cls} style={activeStyle} />;
      case 'accounts':
        return <CreditCard className={cls} style={activeStyle} />;
      default:
        return <HelpCircle className={cls} style={activeStyle} />;
    }
  };

  return (
    <aside
      style={{
        backgroundColor: sColor,
      }}
      className="w-[240px] flex flex-col justify-between h-screen fixed left-0 top-0 text-white z-40 border-r border-white/10 transition-colors duration-300"
    >
      {/* Brand Header */}
      <div>
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <img
            src="/images/typhoon-logo-white.png"
            alt="Typhoon Solar"
            className="h-8 w-auto object-contain"
          />
          <span
            style={{
              backgroundColor: `color-mix(in srgb, ${aColor} 20%, transparent)`,
              color: aColor,
              borderColor: `color-mix(in srgb, ${aColor} 30%, transparent)`,
            }}
            className="text-[10px] uppercase font-medium px-2 py-0.5 rounded-full border"
          >
            {theme.roleName}
          </span>
        </div>

        {/* Menu Navigation */}
        <nav className="p-3 space-y-1">
          {menuItems.map((item) => {
            const isActive = item.id === activeItem;
            return (
              <button
                key={item.id}
                onClick={() => onSelect(item.id)}
                style={
                  isActive
                    ? {
                        backgroundColor: aColor,
                        color: onColor,
                        boxShadow: `0 4px 14px color-mix(in srgb, ${aColor} 35%, transparent)`,
                      }
                    : undefined
                }
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                  isActive
                    ? ''
                    : 'text-white/70 hover:bg-white/5 hover:text-white'
                }`}
              >
                {renderIcon(item.iconName, isActive)}
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Sign Out */}
      <div className="p-4 border-t border-white/10">
        <button
          onClick={onSignOut}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-full text-xs font-medium text-white/60 hover:text-rose-400 hover:bg-white/5 transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

