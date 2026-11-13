'use client';

import React from 'react';
import { ChevronRight } from 'lucide-react';

export interface DataRowItem {
  id: string;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  badgeText: string;
  badgeStyle?: string;
}

interface DataTableProps {
  filterChips: { id: string; label: string }[];
  activeChip: string;
  onChipSelect: (id: string) => void;
  items: DataRowItem[];
  onRowClick: (id: string) => void;
}

export const DataTable: React.FC<DataTableProps> = ({
  filterChips,
  activeChip,
  onChipSelect,
  items,
  onRowClick,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-typhoon-border shadow-soft p-5">
      {/* Filter Chips Bar */}
      <div className="flex items-center gap-2 pb-4 mb-2 border-b border-typhoon-border overflow-x-auto">
        {filterChips.map((chip) => {
          const isActive = chip.id === activeChip;
          return (
            <button
              key={chip.id}
              onClick={() => onChipSelect(chip.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-typhoon-navy text-white shadow-soft'
                  : 'bg-typhoon-sand hover:bg-typhoon-sand-dark text-typhoon-navy'
              }`}
            >
              {chip.label}
            </button>
          );
        })}
      </div>

      {/* Rows List */}
      <div className="divide-y divide-typhoon-border">
        {items.length === 0 ? (
          <div className="py-12 text-center text-xs text-typhoon-muted">
            No records found.
          </div>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              onClick={() => onRowClick(item.id)}
              className="py-3.5 px-3 flex items-center justify-between hover:bg-typhoon-sand/40 rounded-xl cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-typhoon-sand flex items-center justify-center text-typhoon-navy flex-shrink-0">
                  {item.icon}
                </div>
                <div className="truncate">
                  <p className="text-xs font-bold text-typhoon-navy truncate">
                    {item.title}
                  </p>
                  <p className="text-[11px] text-typhoon-muted truncate">
                    {item.subtitle}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 flex-shrink-0 ml-4">
                <span
                  className={`text-[11px] font-semibold px-3 py-1 rounded-full ${
                    item.badgeStyle || 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {item.badgeText}
                </span>
                <ChevronRight className="w-4 h-4 text-typhoon-muted" />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

