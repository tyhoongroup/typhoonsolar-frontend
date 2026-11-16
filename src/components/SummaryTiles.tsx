import React from 'react';

interface TileData {
  icon: React.ReactNode;
  value: string | number;
  label: string;
}

interface SummaryTilesProps {
  tiles: TileData[];
}

export const SummaryTiles: React.FC<SummaryTilesProps> = ({ tiles }) => {
  return (
    <div className={`relative -mt-10 px-4 grid gap-3 z-10 ${tiles.length === 2 ? 'grid-cols-2' : tiles.length === 3 ? 'grid-cols-3' : 'grid-cols-2 lg:grid-cols-4'}`}>
      {tiles.map((tile, idx) => (
        <div
          key={idx}
          className="bg-typhoon-card rounded-2xl p-4 shadow-soft border border-typhoon-border flex flex-col justify-between"
        >
          <div className="w-8 h-8 rounded-full bg-typhoon-sand flex items-center justify-center text-typhoon-navy mb-2">
            {tile.icon}
          </div>
          <div>
            <span className="text-3xl sm:text-4xl font-bold font-serif text-typhoon-navy tracking-tight block">
              {tile.value}
            </span>
            <span className="text-sm font-semibold text-typhoon-muted block mt-0.5">
              {tile.label}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

