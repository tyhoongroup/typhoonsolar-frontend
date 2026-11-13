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
        className={`${theme.headerBg} text-white rounded-2xl p-4 shadow-soft cursor-pointer hover:opacity-95 transition-all flex items-center justify-between border ${theme.headerBorder}`}
      >
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white flex-shrink-0">
            {icon}
          </div>
          <div>
            <span className={`text-[10px] font-bold tracking-widest ${theme.accentText} uppercase block mb-0.5 opacity-90`}>
              PRIORITY
            </span>
            <h3 className="text-sm font-semibold text-white tracking-tight leading-snug">
              {title}
            </h3>
            <p className="text-xs text-white/70 mt-0.5">{subtitle}</p>
          </div>
        </div>

        <span className={`${theme.accentBg} ${theme.accentText} text-xs font-bold px-3 py-1.5 rounded-full flex-shrink-0 ml-2 shadow-xs`}>
          {badgeText}
        </span>
      </div>
    </div>
  );
};

