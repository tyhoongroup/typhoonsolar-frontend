import React from 'react';
import { ChevronRight } from 'lucide-react';

export interface UpNextItem {
  id: string;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  badgeText: string;
  badgeType?: 'active' | 'docs' | 'due' | 'waiting' | 'today' | 'pending';
  onClick?: () => void;
}

interface UpNextListProps {
  title?: string;
  items: UpNextItem[];
}

export const UpNextList: React.FC<UpNextListProps> = ({
  title = 'UP NEXT',
  items,
}) => {
  const getBadgeStyle = (type?: string) => {
    switch (type) {
      case 'active':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'docs':
        return 'bg-purple-50 text-purple-800 border-purple-200';
      case 'due':
        return 'bg-rose-50 text-rose-800 border-rose-200';
      case 'waiting':
        return 'bg-indigo-50 text-indigo-800 border-indigo-200';
      case 'today':
        return 'bg-orange-50 text-orange-800 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="px-4 my-3">
      <div className="bg-typhoon-card rounded-2xl p-4 shadow-soft border border-typhoon-border">
        <h4 className="text-xs font-bold tracking-widest text-typhoon-muted uppercase mb-3">
          {title}
        </h4>

        <div className="divide-y divide-typhoon-border/60">
          {items.map((item) => (
            <div
              key={item.id}
              onClick={item.onClick}
              className="py-3 flex items-center justify-between cursor-pointer hover:bg-typhoon-sand/40 -mx-2 px-2 rounded-xl transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-typhoon-sand flex items-center justify-center text-typhoon-navy flex-shrink-0">
                  {item.icon}
                </div>
                <div className="truncate">
                  <p className="text-sm font-bold text-typhoon-navy truncate">
                    {item.title}
                  </p>
                  <p className="text-xs text-typhoon-muted truncate mt-0.5">
                    {item.subtitle}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                <span
                  className={`text-xs font-semibold px-3 py-1 rounded-full border ${getBadgeStyle(
                    item.badgeType,
                  )}`}
                >
                  {item.badgeText}
                </span>
                <ChevronRight className="w-4 h-4 text-typhoon-muted" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

