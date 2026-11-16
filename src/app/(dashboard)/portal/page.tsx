'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  FileText,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Search,
  Filter,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { useCurrentUser } from '@/lib/use-current-user';

interface PortalProjectItem {
  id: string;
  inquiryCode: string;
  customerName: string;
  phone: string;
  capacityKw: number;
  city: string;
  consumerNo: string;
  stage: 'DOCS_UPLOADED' | 'SR_PENDING' | 'METER_FILE_DUE' | 'SUBSIDY_CLAIM';
  stageLabel: string;
  stageBadgeStyle: string;
  docsCount: string;
  srNumber?: string;
  queryPending?: boolean;
}

export default function PortalQueuePage() {
  const router = useRouter();
  const { user, theme } = useCurrentUser();
  const [activeTab, setActiveTab] = useState<'all' | 'docs' | 'sr' | 'meter' | 'subsidy'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const projects: PortalProjectItem[] = [
    {
      id: 'TYP-2026-1024',
      inquiryCode: 'F-1024',
      customerName: 'Ramesh Patel',
      phone: '+91 98250 12345',
      capacityKw: 6.0,
      city: 'Anand',
      consumerNo: 'MGVCL-88491029',
      stage: 'DOCS_UPLOADED',
      stageLabel: 'Docs Ready for Portal',
      stageBadgeStyle: 'bg-amber-50 text-amber-700 border-amber-200',
      docsCount: '4/4 Collected',
    },
    {
      id: 'TYP-2026-1021',
      inquiryCode: 'F-1021',
      customerName: 'Nilesh Desai',
      phone: '+91 98250 99881',
      capacityKw: 6.0,
      city: 'Vadodara',
      consumerNo: 'MGVCL-33291044',
      stage: 'SR_PENDING',
      stageLabel: 'Verification & SR Pending',
      stageBadgeStyle: 'bg-blue-50 text-blue-700 border-blue-200',
      docsCount: '4/4 Verified',
      queryPending: false,
    },
    {
      id: 'TYP-2026-1015',
      inquiryCode: 'F-1015',
      customerName: 'Diwan Zakirbhai',
      phone: '+91 98250 44332',
      capacityKw: 10.0,
      city: 'Anand',
      consumerNo: 'MGVCL-77291022',
      stage: 'METER_FILE_DUE',
      stageLabel: 'Meter File Required',
      stageBadgeStyle: 'bg-purple-50 text-purple-700 border-purple-200',
      docsCount: '4/4 Verified',
      srNumber: 'SR-2026-MGVCL-4821',
    },
    {
      id: 'TYP-2026-1012',
      inquiryCode: 'F-1012',
      customerName: 'Harishbhai Shah',
      phone: '+91 98250 77665',
      capacityKw: 4.5,
      city: 'Vadodara',
      consumerNo: 'MGVCL-99281011',
      stage: 'SUBSIDY_CLAIM',
      stageLabel: 'Subsidy Claim Queue',
      stageBadgeStyle: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      docsCount: 'All Complete',
      srNumber: 'SR-2026-MGVCL-3109',
    },
  ];

  const filtered = projects.filter((p) => {
    const matchesSearch =
      p.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.city.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;
    if (activeTab === 'docs') return p.stage === 'DOCS_UPLOADED';
    if (activeTab === 'sr') return p.stage === 'SR_PENDING';
    if (activeTab === 'meter') return p.stage === 'METER_FILE_DUE';
    if (activeTab === 'subsidy') return p.stage === 'SUBSIDY_CLAIM';
    return true;
  });

  return (
    <div className="min-h-screen bg-typhoon-sand pb-16">
      {/* Top Header with dynamic active user role theme */}
      <div
        style={{
          backgroundColor: theme.hex.headerBg,
          borderColor: theme.hex.headerBorder,
        }}
        className="text-white pt-6 pb-8 px-6 rounded-b-[32px] shadow-soft border-b transition-colors duration-300"
      >
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <ShieldCheck
                  style={{ color: theme.hex.accentBg }}
                  className="w-4 h-4"
                />
                <span
                  style={{ color: theme.hex.accentBg }}
                  className="text-[11px] font-bold tracking-widest uppercase"
                >
                  {user?.role === 'PORTAL_USER'
                    ? 'GOVERNMENT PORTAL LIAISON (RAHUL BHAI)'
                    : `${theme.roleName.toUpperCase()} · GOVT PORTAL OVERVIEW`}
                </span>
              </div>
              <h1 className="text-2xl lg:text-3xl font-serif font-bold text-white tracking-tight">
                Surya Gujarat & PM Surya Ghar Queue
              </h1>
              <p className="text-xs text-white/70 mt-1">
                Manage KYC approvals, SR generation, CEI meter files & direct DBT subsidy claims
              </p>
            </div>

            <div className="flex items-center gap-2">
              <a
                href="https://suryagujarat.guvnl.com"
                target="_blank"
                rel="noreferrer"
                className="bg-white/10 hover:bg-white/20 text-white font-semibold px-4 py-2 rounded-xl text-xs flex items-center gap-2 transition"
              >
                <span>Surya Gujarat Portal</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 lg:px-6 -mt-3 space-y-4">
        {/* Filter Chips & Search Bar */}
        <div className="bg-white rounded-2xl p-4 border border-typhoon-border shadow-soft flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex flex-wrap gap-1.5 text-xs">
            {[
              { id: 'all', label: 'All Projects (4)' },
              { id: 'docs', label: 'Docs Uploaded (1)' },
              { id: 'sr', label: 'SR Pending (1)' },
              { id: 'meter', label: 'Meter Files (1)' },
              { id: 'subsidy', label: 'Subsidy Claims (1)' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                style={
                  activeTab === tab.id
                    ? { backgroundColor: '#00bfa5', color: '#063a42' }
                    : undefined
                }
                className={`px-3 py-1.5 rounded-xl font-bold transition ${
                  activeTab === tab.id
                    ? 'shadow-sm'
                    : 'bg-typhoon-sand/60 text-typhoon-navy hover:bg-typhoon-sand'
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

        {/* Project Queue List */}
        <div className="space-y-3">
          {filtered.map((proj) => (
            <div
              key={proj.id}
              onClick={() => router.push(`/portal/projects/${proj.inquiryCode}`)}
              className="bg-white rounded-2xl p-5 border border-typhoon-border shadow-soft hover:border-typhoon-gold transition cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 group"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-typhoon-sand flex items-center justify-center text-typhoon-navy font-bold text-sm shrink-0">
                  <FileText className="w-6 h-6 text-typhoon-gold" />
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-sm font-bold text-typhoon-navy group-hover:text-typhoon-gold transition-colors">
                      {proj.id} · {proj.customerName}
                    </h3>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${proj.stageBadgeStyle}`}>
                      {proj.stageLabel}
                    </span>
                    {proj.srNumber && (
                      <span className="text-[10px] font-semibold bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-md border border-emerald-200">
                        SR: {proj.srNumber}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-typhoon-muted mt-1">
                    {proj.capacityKw} kW · {proj.city} · Consumer No: {proj.consumerNo} · Phone: {proj.phone}
                  </p>

                  <div className="flex items-center gap-3 mt-2 text-[11px] text-typhoon-navy/80">
                    <span className="flex items-center gap-1 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      KYC: {proj.docsCount}
                    </span>
                    <span>•</span>
                    <span className="text-typhoon-muted">Click to open document verification & filing</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end md:self-center">
                <span className="text-xs font-bold text-typhoon-gold group-hover:translate-x-1 transition-transform flex items-center gap-1">
                  <span>Open Filing</span>
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

