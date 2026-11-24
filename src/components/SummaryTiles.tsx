import React from 'react';
import { getRoleTheme } from '@/lib/role-theme';

export interface TileData {
  icon: React.ReactNode;
  value: string | number;
  label: string;
}

interface SummaryTilesProps {
  tiles: TileData[];
  role?: string;
}

export const SummaryTiles: React.FC<SummaryTilesProps> = ({ tiles, role }) => {
  const theme = getRoleTheme(role);
  const sColor = theme.hex.cardDarkBg || '#111827';
  const aColor = theme.hex.accentBg || '#6366F1';
  const count = tiles.length;

  return (
    <div
      className={`relative -mt-[42px] px-2.5 sm:px-3.5 flex ${
        count > 3 ? 'gap-1.5 sm:gap-2.5' : 'gap-2 sm:gap-2.5'
      } z-10 w-full max-w-full`}
    >
      {tiles.map((tile, idx) => (
        <div
          key={idx}
          style={{
            backgroundColor: '#ffffff',
            borderRadius: count > 3 ? '14px' : '18px',
            boxShadow: `0 4px 14px color-mix(in srgb, ${sColor} 10%, transparent)`,
            border: `0.5px solid color-mix(in srgb, ${sColor} 8%, transparent)`,
          }}
          className="flex-1 min-w-0 p-2 sm:p-3 flex flex-col justify-between transition-all"
        >
          <div
            style={{
              backgroundColor: `color-mix(in srgb, ${aColor} 20%, #ffffff)`,
              color: sColor,
            }}
            className="w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center flex-none"
          >
            <span className="flex items-center justify-center [&>svg]:w-3.5 [&>svg]:h-3.5 sm:[&>svg]:w-4 sm:[&>svg]:h-4">
              {tile.icon}
            </span>
          </div>
          <div className="mt-1.5 sm:mt-2 min-w-0">
            <div
              style={{ color: sColor }}
              className="text-xl sm:text-2xl font-serif font-normal leading-none tracking-tight truncate"
            >
              {tile.value}
            </div>
            <div
              style={{ color: sColor }}
              className="text-[10px] sm:text-xs font-normal opacity-75 mt-0.5 sm:mt-1 font-sans leading-tight line-clamp-2"
              title={typeof tile.label === 'string' ? tile.label : undefined}
            >
              {tile.label}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
