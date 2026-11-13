'use client';

import React from 'react';
import { Sun, LogOut, LayoutDashboard, Users, FileText, Package, Wrench, CreditCard, HelpCircle } from 'lucide-react';

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
  const renderIcon = (name: string, isActive: boolean) => {
    const cls = `w-4 h-4 ${isActive ? 'text-typhoon-navy' : 'text-white/70'}`;
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
    <aside className="w-[240px] bg-typhoon-navy flex flex-col justify-between h-screen fixed left-0 top-0 text-white z-40 border-r border-white/5">
      {/* Brand Header */}
      <div>
        <div className="p-6 border-b border-white/10 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-typhoon-gold flex items-center justify-center text-typhoon-navy">
            <Sun className="w-5 h-5 fill-current" />
          </div>
          <div>
            <span className="text-xs font-bold tracking-widest text-typhoon-gold uppercase block">
              TYPHOON SOLAR
            </span>
            <span className="text-[10px] text-white/50">{roleName}</span>
          </div>
        </div>

        {/* Menu Navigation */}
        <nav className="p-3 space-y-1">
          {menuItems.map((item) => {
            const isActive = item.id === activeItem;
            return (
              <button
                key={item.id}
                onClick={() => onSelect(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-full text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-typhoon-gold text-typhoon-navy shadow-soft'
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
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-full text-xs font-semibold text-white/60 hover:text-rose-400 hover:bg-white/5 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

