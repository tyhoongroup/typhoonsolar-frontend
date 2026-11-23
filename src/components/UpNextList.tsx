import React from 'react';
import { getRoleTheme } from '@/lib/role-theme';

export interface UpNextItem {
  id: string;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  badgeText: string;
  badgeType?: 'urgent' | 'bu' | 'bn' | 'bg' | 'active' | 'docs' | 'due' | 'waiting' | 'today' | 'pending';
  onClick?: () => void;
}

interface UpNextListProps {
  title?: string;
  items: UpNextItem[];
  role?: string;
}

export const UpNextList: React.FC<UpNextListProps> = ({
  title = 'UP NEXT',
  items,
  role,
}) => {
  const theme = getRoleTheme(role);
  const sColor = theme.hex.cardDarkBg || '#111827';
  const aColor = theme.hex.accentBg || '#6366F1';

  return (
    <div className="px-3.5 mt-3">
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '18px',
          padding: '14px 14px 4px',
          border: `0.5px solid color-mix(in srgb, ${sColor} 8%, transparent)`,
          boxShadow: `0 6px 18px color-mix(in srgb, ${sColor} 8%, transparent)`,
        }}
      >
        <div
          style={{ color: sColor }}
          className="text-[10px] font-medium tracking-[0.08em] opacity-60 mb-1 font-sans"
        >
          {title}
        </div>

        <div>
          {items.map((item, idx) => {
            const isUrgent =
              item.badgeType === 'urgent' ||
              item.badgeType === 'bu' ||
              item.badgeType === 'due' ||
              item.badgeText.toLowerCase().includes('urgent') ||
              item.badgeText.toLowerCase().includes('overdue');

            const isDone =
              item.badgeType === 'bg' ||
              item.badgeText.toLowerCase() === 'done';

            // Tile background
            const tileBg = isUrgent
              ? '#FDECEC'
              : `color-mix(in srgb, ${aColor} 22%, #ffffff)`;
            const tileColor = isUrgent ? '#B42318' : sColor;

            // Badge styling
            let badgeBg = `color-mix(in srgb, ${aColor} 24%, #ffffff)`;
            let badgeText = sColor;
            if (isUrgent) {
              badgeBg = '#FDECEC';
              badgeText = '#B42318';
            } else if (isDone) {
              badgeBg = '#E6F6EE';
              badgeText = '#137A4B';
            }

            return (
              <div
                key={item.id || idx}
                onClick={item.onClick}
                style={{
                  borderTop:
                    idx > 0
                      ? `0.5px solid color-mix(in srgb, ${sColor} 10%, transparent)`
                      : 'none',
                }}
                className="flex items-center gap-2.5 py-2.5 cursor-pointer hover:opacity-90 transition-opacity"
              >
                <div
                  style={{
                    backgroundColor: tileBg,
                    color: tileColor,
                    borderRadius: '12px',
                  }}
                  className="w-[34px] h-[34px] flex items-center justify-center flex-none"
                >
                  {item.icon}
                </div>

                <div className="flex-1 min-w-0">
                  <div
                    style={{ color: sColor }}
                    className="text-[13px] font-medium leading-snug truncate font-sans"
                  >
                    {item.title}
                  </div>
                  <div
                    style={{ color: sColor }}
                    className="text-[11px] opacity-65 mt-0.5 truncate font-sans"
                  >
                    {item.subtitle}
                  </div>
                </div>

                <span
                  style={{
                    backgroundColor: badgeBg,
                    color: badgeText,
                  }}
                  className="text-[11px] font-medium px-2.5 py-1 rounded-full flex-none font-sans"
                >
                  {item.badgeText}
                </span>

                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ color: sColor, flex: 'none' }}
                >
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
