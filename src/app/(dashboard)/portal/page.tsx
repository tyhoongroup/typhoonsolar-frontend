'use client';

import React, { useState, useEffect } from 'react';
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
  Wrench,
} from 'lucide-react';
import { Header } from '@/components/Header';
import { SummaryTiles } from '@/components/SummaryTiles';
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

  // Sync tab with URL query parameter (e.g. /portal?tab=meter)
  useEffect(() => {
    const handleUrlChange = () => {
      if (typeof window !== 'undefined') {
        const params = new URLSearchParams(window.location.search);
        const tab = params.get('tab');
        if (tab === 'meter' || tab === 'subsidy' || tab === 'sr' || tab === 'docs' || tab === 'all') {
          setActiveTab(tab as any);
        }
      }
    };
    handleUrlChange();
    window.addEventListener('popstate', handleUrlChange);
    return () => window.removeEventListener('popstate', handleUrlChange);
  }, []);

  const [projects, setProjects] = useState<PortalProjectItem[]>([
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
  ]);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) return;

    fetch('/api/v1/portal/applications', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        const list = Array.isArray(data) ? data : (data?.data || []);
        if (Array.isArray(list) && list.length > 0) {
          setProjects(
            list.map((inq: any) => {
              let stage: PortalProjectItem['stage'] = 'DOCS_UPLOADED';
              let stageLabel = 'Docs Ready for Portal';
              let stageBadgeStyle = 'bg-amber-50 text-amber-700 border-amber-200';

              if (inq.currentStage === 'SR_NUMBER_ISSUED') {
                stage = 'SR_PENDING';
                stageLabel = 'SR Number Issued';
                stageBadgeStyle = 'bg-blue-50 text-blue-700 border-blue-200';
              } else if (inq.currentStage === 'INSTALLATION_DONE') {
                stage = 'METER_FILE_DUE';
                stageLabel = 'Installation Done · Prepare Meter File';
                stageBadgeStyle = 'bg-emerald-50 text-emerald-800 border-emerald-300 font-medium';
              } else if (inq.currentStage === 'METER_FILE_SUBMITTED') {
                stage = 'METER_FILE_DUE';
                stageLabel = 'Meter File Submitted';
                stageBadgeStyle = 'bg-purple-50 text-purple-700 border-purple-200';
              } else if (inq.currentStage === 'SUBSIDY_CLAIMED' || inq.currentStage === 'SUBSIDY_RECEIVED') {
                stage = 'SUBSIDY_CLAIM';
                stageLabel = inq.currentStage === 'SUBSIDY_RECEIVED' ? 'Subsidy Received' : 'Subsidy Claimed';
                stageBadgeStyle = 'bg-emerald-50 text-emerald-700 border-emerald-200';
              }

              return {
                id: inq.id.startsWith('TYP-') ? inq.id : `TYP-2026-${(inq.followupId || inq.id).replace('F-', '')}`,
                inquiryCode: inq.followupId || inq.id,
                customerName: inq.customerName,
                phone: inq.customerPhone,
                capacityKw: Number(inq.requestedKw) || 6,
                city: inq.city || 'Gujarat',
                consumerNo: inq.portalApplication?.consumerNumber || 'MGVCL-88491029',
                stage,
                stageLabel,
                stageBadgeStyle,
                docsCount: inq.documents ? `${inq.documents.length} Uploaded` : '4/4 Collected',
                srNumber: inq.portalApplication?.srNumber,
                queryPending: inq.portalApplication?.subsidyStatus === 'QUERY',
              };
            })
          );
        }
      })
      .catch(() => {});
  }, []);

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
    <div className="min-h-screen bg-typhoon-sand pb-20">
      {/* 1. Unified Responsive Header matching Home */}
      <Header
        role={user?.role || 'OPS_MANAGER'}
        initials={theme.tag}
        roleTitle="Control tower"
        subtitle="Surya Gujarat & National DISCOM Portal Liaison"
      />

      <div className="max-w-6xl mx-auto px-4 lg:px-6 pt-3 space-y-4">
        {/* 2. Summary Tiles matching Home */}
        <SummaryTiles
          tiles={[
            {
              icon: <FileText className="w-4 h-4 text-typhoon-gold" />,
              value: '1',
              label: 'Docs ready for portal',
            },
            {
              icon: <Clock className="w-4 h-4 text-amber-600" />,
              value: '1',
              label: 'SR pending approval',
            },
            {
              icon: <Wrench className="w-4 h-4 text-sky-600" />,
              value: '1',
              label: 'Meter file required',
            },
            {
              icon: <CheckCircle2 className="w-4 h-4 text-emerald-600" />,
              value: '1',
              label: 'Subsidy claim queue',
            },
          ]}
        />

        {/* Title and Portal link banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-typhoon-border shadow-soft">
          <div>
            <h1 className="text-xl sm:text-2xl font-serif font-bold text-typhoon-navy tracking-tight">
              Surya Gujarat & PM Surya Ghar Queue
            </h1>
            <p className="text-xs text-typhoon-muted mt-0.5">
              Manage KYC approvals, SR generation, CEI meter files & direct DBT subsidy claims
            </p>
          </div>

          <a
            href="https://suryagujarat.guvnl.com"
            target="_blank"
            rel="noreferrer"
            className="self-start sm:self-auto bg-typhoon-sand hover:bg-typhoon-sand-dark text-typhoon-navy font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-2 border border-typhoon-border transition"
          >
            <span>Surya Gujarat Portal</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
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

