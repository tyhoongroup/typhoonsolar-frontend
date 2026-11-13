'use client';

import React from 'react';
import { Clock, Phone, AlertCircle, MessageSquare, ChevronRight, User } from 'lucide-react';

export interface PriorityTask {
  title: string;
  subtitle: string;
  badgeText: string;
  onClick?: () => void;
}

export interface TeamFollowupItem {
  id: string;
  salespersonName?: string;
  name?: string; // backward compatibility
  role: string;
  inquiryCode?: string;
  customerName?: string;
  customerReaction?: 'Very Positive' | 'Negotiating' | 'Needs Subsidy Info' | 'Callback Later' | 'Hesitant';
  statusText: string;
  isOverdue?: boolean;
  notes?: string; // Follow-up description clearly visible to Operations Manager
  nextAction?: string;
  committedDate?: string;
}

interface SidePanelProps {
  priorityTask?: PriorityTask;
  teamStatuses: TeamFollowupItem[];
  onFollowupClick?: (id: string) => void;
  onMemberClick?: (id: string) => void;
}

export const SidePanel: React.FC<SidePanelProps> = ({
  priorityTask,
  teamStatuses,
  onFollowupClick,
  onMemberClick,
}) => {
  const handleClick = (id: string) => {
    if (onFollowupClick) onFollowupClick(id);
    else if (onMemberClick) onMemberClick(id);
  };

  return (
    <div className="space-y-4">
      {/* 1. Navy Priority Card (Matches Web layout guide) */}
      {priorityTask && (
        <div
          onClick={priorityTask.onClick}
          className="bg-typhoon-navy text-white rounded-2xl p-5 shadow-soft cursor-pointer hover:bg-typhoon-navy-light transition-all group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold tracking-widest text-typhoon-gold uppercase">
              PRIORITY
            </span>
            <span className="bg-typhoon-gold text-typhoon-navy text-[11px] font-bold px-2.5 py-0.5 rounded-full">
              {priorityTask.badgeText}
            </span>
          </div>
          <h3 className="text-sm font-bold text-white tracking-tight group-hover:text-typhoon-gold transition-colors">
            {priorityTask.title}
          </h3>
          <p className="text-xs text-white/70 mt-1 leading-relaxed">
            {priorityTask.subtitle}
          </p>
        </div>
      )}

      {/* 2. Today's Team Follow-Ups with Visible Description for Operations Manager */}
      <div className="bg-white rounded-2xl border border-typhoon-border shadow-soft p-5">
        <div className="flex items-center justify-between mb-3.5">
          <div>
            <h4 className="text-[11px] font-bold tracking-widest text-typhoon-muted uppercase">
              TEAM FOLLOW-UPS (TODAY)
            </h4>
            <p className="text-[10px] text-typhoon-muted">
              Live notes & call logs for Ops Manager oversight
            </p>
          </div>
          <Clock className="w-4 h-4 text-typhoon-muted" />
        </div>

        <div className="space-y-3">
          {teamStatuses.map((item) => (
            <div
              key={item.id}
              onClick={() => handleClick(item.id)}
              className="p-3 rounded-xl hover:bg-typhoon-sand/50 transition-colors cursor-pointer border border-typhoon-border/60 bg-white"
            >
              {/* Header row: Salesperson + Inquiry badge */}
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-typhoon-sand flex items-center justify-center text-typhoon-navy">
                    <User className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-typhoon-navy">
                      {item.salespersonName || item.name}
                    </span>
                    {item.customerName && (
                      <span className="text-[11px] text-typhoon-muted ml-1">
                        → {item.customerName} {item.inquiryCode ? `(${item.inquiryCode})` : ''}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  {item.isOverdue && (
                    <AlertCircle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                  )}
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      item.isOverdue
                        ? 'bg-rose-50 text-rose-700 border border-rose-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}
                  >
                    {item.statusText}
                  </span>
                </div>
              </div>

              {/* Explicit Follow-up Description Box (Seen by Operations Manager) */}
              {item.notes && (
                <div className="my-2 text-[11px] text-typhoon-navy bg-typhoon-sand/60 border border-typhoon-border/70 p-2.5 rounded-lg flex items-start gap-1.5 leading-relaxed">
                  <MessageSquare className="w-3.5 h-3.5 text-typhoon-gold shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-typhoon-navy/90">Call Note: </span>
                    <span className="italic text-typhoon-navy/80">"{item.notes}"</span>
                  </div>
                </div>
              )}

              {/* Next Action & Committed Date */}
              {(item.nextAction || item.committedDate) && (
                <div className="flex items-center justify-between text-[10px] text-typhoon-muted pt-1 border-t border-typhoon-border/40 mt-1">
                  <span>
                    <strong className="text-typhoon-navy font-semibold">Next: </strong>
                    {item.nextAction || 'Follow up'}
                  </span>
                  {item.committedDate && (
                    <span className="font-medium text-typhoon-gold">
                      Due: {item.committedDate}
                    </span>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
