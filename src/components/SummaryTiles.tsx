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

  return (
    <div className="relative -mt-[42px] px-3.5 flex gap-2.5 z-10">
      {tiles.map((tile, idx) => (
        <div
          key={idx}
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '18px',
            boxShadow: `0 6px 18px color-mix(in srgb, ${sColor} 12%, transparent)`,
            border: `0.5px solid color-mix(in srgb, ${sColor} 8%, transparent)`,
          }}
          className="flex-1 p-3 flex flex-col justify-between"
        >
          <div
            style={{
              backgroundColor: `color-mix(in srgb, ${aColor} 22%, #ffffff)`,
              color: sColor,
            }}
            className="w-[30px] h-[30px] rounded-full flex items-center justify-center flex-none"
          >
            {tile.icon}
          </div>
          <div>
            <div
              style={{ color: sColor }}
              className="text-[26px] font-extrabold mt-2.5 leading-none"
            >
              {tile.value}
            </div>
            <div
              style={{ color: sColor }}
              className="text-xs font-medium opacity-70 mt-1"
            >
              {tile.label}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
