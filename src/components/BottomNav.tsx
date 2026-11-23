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
  const sColor = theme.hex.cardDarkBg || '#111827';
  const aColor = theme.hex.accentBg || '#6366F1';
  const cColor = theme.hex.lightBg || '#F5F5F7';
  const onColor = theme.hex.accentTextColor || '#FFFFFF';

  const renderIcon = (name: string, isActive: boolean) => {
    const className = 'w-4 h-4 flex-none';
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
    <div className="fixed bottom-3 left-3 right-3 z-50 max-w-[340px] sm:max-w-md mx-auto">
      <nav
        style={{
          backgroundColor: sColor,
          height: '52px',
          borderRadius: '999px',
          boxShadow: `0 8px 20px color-mix(in srgb, ${sColor} 30%, transparent)`,
        }}
        className="px-2 flex items-center justify-between transition-all duration-300"
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
                      backgroundColor: aColor,
                      color: onColor,
                    }
                  : {
                      color: cColor,
                    }
              }
              className={`flex items-center justify-center transition-all cursor-pointer ${
                isActive
                  ? 'gap-1.5 px-3.5 py-2 rounded-full text-xs font-medium'
                  : 'w-10 opacity-85 hover:opacity-100'
              }`}
              title={item.label}
            >
              {renderIcon(item.iconName, isActive)}
              {isActive && <span className="text-xs font-medium font-sans">{item.label}</span>}
            </button>
          );
        })}
      </nav>
    </div>
  );
};
