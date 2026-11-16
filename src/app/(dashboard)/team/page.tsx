'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, MessageSquare, AlertCircle } from 'lucide-react';
import { useCurrentUser } from '@/lib/use-current-user';

export default function TeamTrackerPage() {
  const router = useRouter();
  const { theme } = useCurrentUser();
  const [activeChip, setActiveChip] = useState('All');

  React.useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token || token === 'null' || token === 'undefined') {
      localStorage.clear();
      router.push('/');
    }
  }, [router]);

  const teamList = [
    {
      id: '1',
      initials: 'AM',
      name: 'Amit',
      role: 'Salesperson',
      task: 'Quotation for F-1022',
      dueLabel: '3 days',
      status: 'on_track',
    },
    {
      id: '2',
      initials: 'SB',
      name: 'Soheil bhai',
      role: 'Material',
      task: 'Plan material F-1018',
      dueLabel: 'Today',
      status: 'today',
    },
    {
      id: '3',
      initials: 'RB',
      name: 'Rahul bhai',
      role: 'Portal',
      task: 'Upload documents F-1015',
      dueLabel: 'Overdue',
      status: 'overdue',
    },
    {
      id: '4',
      initials: 'MA',
      name: 'Meera',
      role: 'Accountant',
      task: 'Payment follow-up F-1011',
      dueLabel: 'Tomorrow',
      status: 'on_track',
    },
    {
      id: '5',
      initials: 'IT',
      name: 'Installation team',
      role: 'Wiring',
      task: 'Wiring proof F-1009',
      dueLabel: 'On track',
      status: 'on_track',
    },
  ];

  const getStatusBadge = (status: string, label: string) => {
    switch (status) {
      case 'overdue':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'today':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      default:
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
    }
  };

  return (
    <div className="min-h-screen bg-typhoon-sand pb-16">
      {/* Top Header with dynamic active user role theme */}
      <div
        style={{
          backgroundColor: theme.hex.headerBg,
          borderColor: theme.hex.headerBorder,
        }}
        className="text-white pt-8 pb-10 px-5 rounded-b-[32px] relative shadow-soft border-b transition-colors duration-300"
      >
        <button
          onClick={() => router.back()}
          className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white mb-4 hover:bg-white/20 transition-colors cursor-pointer"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <span
          style={{ color: theme.hex.accentBg }}
          className="text-[10px] font-bold tracking-widest uppercase block mb-1"
        >
          {theme.roleName.toUpperCase()} · TEAM SLA MONITOR
        </span>
        <h1 className="text-2xl font-serif font-bold text-white tracking-tight">
          Team tracker
        </h1>
        <p className="text-xs text-white/70 mt-0.5">
          Current task and follow-up date of everyone
        </p>
      </div>

      <div className="px-5 py-5 space-y-4">
        {/* Filter Chips */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {['All', 'Sales', 'Accounts', 'Portal', 'Material'].map((chip) => {
            const isActive = chip === activeChip;
            return (
              <button
                key={chip}
                onClick={() => setActiveChip(chip)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-typhoon-navy text-white shadow-soft'
                    : 'bg-white text-typhoon-navy border border-typhoon-border'
                }`}
              >
                {chip}
              </button>
            );
          })}
        </div>

        {/* SLA Status Summary (Screen 21) */}
        <div className="text-center py-1">
          <span className="text-[11px] font-bold tracking-widest text-typhoon-navy uppercase">
            <span className="text-rose-600">1 OVERDUE</span> ·{' '}
            <span className="text-amber-600">1 DUE TODAY</span> ·{' '}
            <span className="text-emerald-600">3 ON TRACK</span>
          </span>
        </div>

        {/* Team Members List */}
        <div className="bg-white rounded-2xl border border-typhoon-border shadow-soft divide-y divide-typhoon-border/60">
          {teamList.map((m) => (
            <div
              key={m.id}
              className="p-4 flex items-center justify-between hover:bg-typhoon-sand/30 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-typhoon-navy text-white font-bold text-xs flex items-center justify-center flex-shrink-0">
                  {m.initials}
                </div>
                <div>
                  <p className="text-xs font-bold text-typhoon-navy">
                    {m.name} · <span className="text-typhoon-muted font-medium">{m.role}</span>
                  </p>
                  <p className="text-[11px] text-typhoon-muted">{m.task}</p>
                </div>
              </div>

              <span
                className={`text-[11px] font-bold px-3 py-1 rounded-full border flex-shrink-0 ${getStatusBadge(
                  m.status,
                  m.dueLabel,
                )}`}
              >
                {m.dueLabel}
              </span>
            </div>
          ))}
        </div>

        {/* Single Gold Action Button */}
        <div className="pt-2">
          <button className="w-full py-4 bg-typhoon-gold hover:bg-typhoon-gold-light text-typhoon-navy font-bold text-sm rounded-2xl shadow-soft flex items-center justify-center gap-2 transition-all">
            <MessageSquare className="w-4 h-4" />
            <span>Log a team follow-up</span>
          </button>
        </div>
      </div>
    </div>
  );
}

