'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Wrench,
  Clock,
  CheckCircle2,
  AlertCircle,
  Search,
  MapPin,
  ChevronRight,
  Sun,
  ShieldCheck,
  Layers,
} from 'lucide-react';
import { Header } from '@/components/Header';
import { SummaryTiles } from '@/components/SummaryTiles';
import { useCurrentUser } from '@/lib/use-current-user';

interface InstallationProjectItem {
  id: string;
  inquiryCode: string;
  customerName: string;
  phone: string;
  capacityKw: number;
  city: string;
  address: string;
  panelsCount: number;
  inverterModel: string;
  materialUnloadedDate: string;
  paymentStatus: 'PAID' | 'PENDING';
  stage: 'READY_TO_FIT' | 'IN_PROGRESS' | 'COMPLETED';
  stageLabel: string;
  stageBadgeStyle: string;
}

export default function InstallationQueuePage() {
  const router = useRouter();
  const { user, theme } = useCurrentUser();
  const [activeTab, setActiveTab] = useState<'all' | 'ready' | 'progress' | 'done'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const projects: InstallationProjectItem[] = [
    {
      id: 'TYP-2026-1015',
      inquiryCode: 'F-1015',
      customerName: 'Diwan Zakirbhai',
      phone: '+91 98250 44332',
      capacityKw: 10.0,
      city: 'Anand',
      address: '77 Sunni Muslim Society, Near Station Road',
      panelsCount: 18,
      inverterModel: '10 kW Growatt On-Grid',
      materialUnloadedDate: 'Yesterday 11:30 AM',
      paymentStatus: 'PAID',
      stage: 'READY_TO_FIT',
      stageLabel: 'Ready for Fitting',
      stageBadgeStyle: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
    {
      id: 'TYP-2026-1012',
      inquiryCode: 'F-1012',
      customerName: 'Harishbhai Shah',
      phone: '+91 98250 77665',
      capacityKw: 4.5,
      city: 'Vadodara',
      address: 'Plot 12, Vasna Road',
      panelsCount: 8,
      inverterModel: '5 kW Solis Inverter',
      materialUnloadedDate: '3 days ago',
      paymentStatus: 'PAID',
      stage: 'COMPLETED',
      stageLabel: 'Installation Completed',
      stageBadgeStyle: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    },
  ];

  const filtered = projects.filter((p) => {
    const matchesSearch =
      p.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.city.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;
    if (activeTab === 'ready') return p.stage === 'READY_TO_FIT';
    if (activeTab === 'progress') return p.stage === 'IN_PROGRESS';
    if (activeTab === 'done') return p.stage === 'COMPLETED';
    return true;
  });

  return (
    <div className="min-h-screen bg-typhoon-sand pb-20">
      {/* 1. Unified Responsive Header matching Home */}
      <Header
        role={user?.role || 'OPS_MANAGER'}
        initials={theme.tag}
        roleTitle="Control tower"
        subtitle="Rooftop Installation & Electrical Execution Queue"
      />

      <div className="max-w-6xl mx-auto px-4 lg:px-6 pt-3 space-y-4">
        {/* 2. Summary Tiles matching Home */}
        <SummaryTiles
          tiles={[
            {
              icon: <Wrench className="w-4 h-4 text-amber-600" />,
              value: '1',
              label: 'Ready to fit',
            },
            {
              icon: <Clock className="w-4 h-4 text-sky-600" />,
              value: '0',
              label: 'In progress',
            },
            {
              icon: <CheckCircle2 className="w-4 h-4 text-emerald-600" />,
              value: '1',
              label: 'Completed sites',
            },
            {
              icon: <Layers className="w-4 h-4 text-typhoon-gold" />,
              value: '2',
              label: 'Total active sites',
            },
          ]}
        />

        {/* Title row */}
        <div className="bg-white p-4 rounded-2xl border border-typhoon-border shadow-soft">
          <h1 className="text-xl sm:text-2xl font-serif font-bold text-typhoon-navy tracking-tight">
            Rooftop Installation Jobs Queue
          </h1>
          <p className="text-xs text-typhoon-muted mt-0.5">
            Sites with verified material unloads & 1st payment collected ready for structure fitting, panels & inverter wiring
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl p-4 border border-typhoon-border shadow-soft flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex flex-wrap gap-1.5 text-xs">
            {[
              { id: 'all', label: 'All Jobs (2)' },
              { id: 'ready', label: 'Ready to Fit (1)' },
              { id: 'progress', label: 'In Progress (0)' },
              { id: 'done', label: 'Completed (1)' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3.5 py-1.5 rounded-xl font-bold text-xs transition cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-typhoon-navy text-white shadow-soft'
                    : 'bg-typhoon-sand/40 text-typhoon-navy border border-typhoon-border hover:bg-typhoon-sand'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="relative flex items-center min-w-[240px]">
            <Search className="w-4 h-4 text-typhoon-muted absolute left-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by customer or project ID..."
              className="w-full pl-9 pr-3 py-2 bg-typhoon-sand/40 rounded-xl text-xs text-typhoon-navy border border-typhoon-border focus:border-typhoon-gold focus:outline-none"
            />
          </div>
        </div>

        {/* Project List */}
        <div className="space-y-3">
          {filtered.map((proj) => (
            <div
              key={proj.id}
              onClick={() => router.push(`/installation/projects/${proj.inquiryCode}`)}
              className="bg-white rounded-2xl p-5 border border-typhoon-border shadow-soft hover:border-typhoon-gold transition cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 group"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-typhoon-sand flex items-center justify-center text-typhoon-navy font-bold text-sm shrink-0">
                  <Sun className="w-6 h-6 text-typhoon-gold" />
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-sm font-bold text-typhoon-navy group-hover:text-typhoon-gold transition-colors">
                      {proj.id} · {proj.customerName}
                    </h3>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${proj.stageBadgeStyle}`}>
                      {proj.stageLabel}
                    </span>
                    <span className="text-[10px] font-semibold bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-md border border-emerald-200">
                      1st Payment: Verified
                    </span>
                  </div>

                  <p className="text-xs text-typhoon-muted mt-1">
                    {proj.capacityKw} kW · {proj.city} · {proj.panelsCount}x Panels · {proj.inverterModel}
                  </p>

                  <p className="text-[11px] text-typhoon-navy/90 mt-1 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-typhoon-gold shrink-0" />
                    <span>{proj.address}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end md:self-center">
                <span className="text-xs font-bold text-typhoon-gold group-hover:translate-x-1 transition-transform flex items-center gap-1">
                  <span>Start Installation</span>
                  <ChevronRight className="w-4 h-4" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

