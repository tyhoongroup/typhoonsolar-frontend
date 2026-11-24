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
  const brandNavy = '#0E2038';
  const brandGold = '#F5A623';

  const renderIcon = (name: string, isActive: boolean) => {
    const cls = `w-4 h-4 ${isActive ? 'text-[#0E2038]' : 'text-white/70'}`;
    switch (name) {
      case 'dashboard':
      case 'inquiries':
        return <LayoutDashboard className={cls} />;
      case 'team':
        return <Users className={cls} />;
      case 'portal':
        return <FileText className={cls} />;
      case 'material':
        return <Package className={cls} />;
      case 'install':
      case 'service':
        return <Wrench className={cls} />;
      case 'accounts':
        return <CreditCard className={cls} />;
      default:
        return <HelpCircle className={cls} />;
    }
  };

  return (
    <aside
      style={{
        backgroundColor: brandNavy,
      }}
      className="w-[240px] flex flex-col justify-between h-screen fixed left-0 top-0 text-white z-40 border-r border-white/10"
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
              backgroundColor: 'rgba(245, 166, 35, 0.15)',
              color: brandGold,
              borderColor: 'rgba(245, 166, 35, 0.3)',
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
                        backgroundColor: brandGold,
                        color: '#0E2038',
                        boxShadow: '0 4px 14px rgba(245, 166, 35, 0.35)',
                      }
                    : undefined
                }
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                  isActive
                    ? 'font-medium'
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
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

