import React from 'react';
import { getRoleTheme } from '@/lib/role-theme';

interface PriorityCardProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  badgeText?: string;
  role?: string;
  onClick?: () => void;
}

export const PriorityCard: React.FC<PriorityCardProps> = ({
  icon,
  title,
  subtitle,
  badgeText = 'Today',
  role,
  onClick,
}) => {
  const theme = getRoleTheme(role);
  const sColor = theme.hex.cardDarkBg || '#111827';
  const aColor = theme.hex.accentBg || '#6366F1';
  const cColor = theme.hex.lightBg || '#F5F5F7';
  const onColor = theme.hex.accentTextColor || '#FFFFFF';

  return (
    <div className="px-3.5 mt-3">
      <div
        onClick={onClick}
        style={{
          background: theme.hex.cardDarkGradient || `radial-gradient(circle at 100% 0, rgba(255, 255, 255, 0.14), transparent 55%), ${sColor}`,
          color: cColor,
          borderRadius: '18px',
          boxShadow: `0 8px 20px color-mix(in srgb, ${sColor} 28%, transparent)`,
        }}
        className="p-3.5 flex items-center gap-3 cursor-pointer hover:opacity-95 transition-all"
      >
        <div
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.12)',
            color: cColor,
            borderRadius: '12px',
          }}
          className="w-[38px] h-[38px] flex items-center justify-center flex-none"
        >
          {icon}
        </div>

        <div className="flex-1 min-w-0">
          <div
            style={{ color: aColor }}
            className="text-[10px] font-medium tracking-[0.08em] uppercase font-sans"
          >
            PRIORITY
          </div>
          <div
            style={{ color: cColor }}
            className="text-sm font-medium mt-0.5 truncate font-sans"
          >
            {title}
          </div>
          <div
            style={{ color: cColor }}
            className="text-[11px] opacity-75 mt-0.5 truncate font-sans"
          >
            {subtitle}
          </div>
        </div>

        <span
          style={{
            backgroundColor: aColor,
            color: onColor,
          }}
          className="text-[11px] font-medium px-[11px] py-[5px] rounded-full flex-none font-sans"
        >
          {badgeText}
        </span>
      </div>
    </div>
  );
};
