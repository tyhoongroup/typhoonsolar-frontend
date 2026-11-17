import React from 'react';
import { getRoleTheme } from '@/lib/role-theme';

interface PriorityCardProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  badgeText: string;
  role?: string;
  onClick?: () => void;
}

export const PriorityCard: React.FC<PriorityCardProps> = ({
  icon,
  title,
  subtitle,
  badgeText,
  role,
  onClick,
}) => {
  const theme = getRoleTheme(role);

  return (
    <div className="px-4 my-3">
      <div
        onClick={onClick}
        style={{
          background: theme.hex.cardDarkGradient || theme.hex.cardDarkBg || theme.hex.headerBg,
          borderColor: theme.hex.cardDarkBg ? '#2d2f36' : theme.hex.headerBorder,
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.35)',
        }}
        className="text-white rounded-2xl p-4 cursor-pointer hover:opacity-95 transition-all flex items-center justify-between border"
      >
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white flex-shrink-0">
            {icon}
          </div>
          <div>
            <span
              style={{ color: theme.role === 'OPS_MANAGER' ? '#D9A23A' : theme.hex.accentBg }}
              className="text-xs font-bold tracking-widest uppercase block mb-1"
            >
              PRIORITY
            </span>
            <h3 className="text-base font-bold text-white tracking-tight leading-snug">
              {title}
            </h3>
            <p className="text-sm text-white/80 mt-0.5">{subtitle}</p>
          </div>
        </div>

        <span
          style={{
            background: theme.hex.accentGradient || theme.hex.accentBg,
            color: theme.hex.accentTextColor,
            boxShadow: theme.hex.accentShadow || '0 4px 12px -2px rgba(36, 72, 255, 0.4)',
          }}
          className="text-xs font-bold px-3 py-1.5 rounded-full flex-shrink-0 ml-2"
        >
          {badgeText}
        </span>
      </div>
    </div>
  );
};

