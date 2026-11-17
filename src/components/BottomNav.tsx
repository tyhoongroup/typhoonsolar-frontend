'use client';

import React from 'react';
import {
  Home,
  List,
  Users,
  BarChart3,
  User,
  Calendar,
  Phone,
  Package,
  ShieldAlert,
  ShieldCheck,
  Calculator,
  Truck,
  Wrench,
  IndianRupee,
  FileText,
  CheckCircle2,
  PlusCircle,
  FileSpreadsheet,
  MoreHorizontal,
} from 'lucide-react';
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
  onMoreClick?: () => void;
  role?: string;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  items,
  activeId,
  onTabChange,
  onMoreClick,
  role,
}) => {
  const theme = getRoleTheme(role);

  const renderIcon = (name: string, isActive: boolean) => {
    const className = 'w-5 h-5 flex-shrink-0';
    switch (name) {
      case 'home':
        return <Home className={className} />;
      case 'portal':
      case 'govt':
        return <ShieldCheck className={className} />;
      case 'docs':
      case 'sr':
      case 'meter':
        return <FileText className={className} />;
      case 'subsidy':
        return <CheckCircle2 className={className} />;
      case 'planning':
      case 'stock':
      case 'material':
        return <Package className={className} />;
      case 'unload':
      case 'dispatch':
        return <Truck className={className} />;
      case 'jobs':
      case 'installation':
      case 'checklist':
        return <Wrench className={className} />;
      case 'payments':
      case 'accounts':
      case 'milestones':
      case 'ledger':
        return <IndianRupee className={className} />;
      case 'inquiries':
      case 'leads':
        return <PlusCircle className={className} />;
      case 'quotations':
      case 'calculator':
        return <Calculator className={className} />;
      case 'pipeline':
      case 'list':
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
      case 'tickets':
      case 'complaints':
        return <ShieldAlert className={className} />;
      case 'more':
      case 'menu':
        return <MoreHorizontal className={className} />;
      default:
        return <User className={className} />;
    }
  };

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 max-w-md mx-auto">
      <nav
        style={{
          background: theme.hex.navGradient || theme.hex.navBg,
          borderColor: '#2d2f36',
          boxShadow: '0 12px 35px -5px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.08) inset',
        }}
        className="rounded-full px-3 py-2 flex items-center justify-around border transition-all duration-300"
      >
        {items.map((item) => {
          const isActive = item.id === activeId;
          return (
            <button
              key={item.id}
              onClick={() => {
                if (item.id === 'more' && onMoreClick) {
                  onMoreClick();
                } else {
                  onTabChange(item.id);
                }
              }}
              style={
                isActive
                  ? {
                      background: theme.hex.accentGradient || theme.hex.accentBg,
                      color: theme.hex.accentTextColor,
                      boxShadow: theme.hex.accentShadow || '0 4px 14px -2px rgba(36, 72, 255, 0.4)',
                    }
                  : {
                      color: 'rgba(255, 255, 255, 0.75)',
                    }
              }
              className={`flex items-center gap-1.5 transition-all text-xs sm:text-sm font-semibold cursor-pointer ${
                isActive
                  ? 'px-4 py-2 rounded-full shadow-md font-bold'
                  : 'p-2.5 rounded-full hover:text-white hover:bg-white/10 active:scale-95'
              }`}
              title={item.label}
            >
              {renderIcon(item.iconName, isActive)}
              {isActive && <span className="tracking-wide text-xs sm:text-sm font-bold">{item.label}</span>}
            </button>
          );
        })}
      </nav>
    </div>
  );
};
