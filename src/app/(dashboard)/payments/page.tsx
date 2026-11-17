'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  IndianRupee,
  Clock,
  CheckCircle2,
  AlertCircle,
  Search,
  ChevronRight,
  TrendingUp,
  Receipt,
  CreditCard,
  Layers,
} from 'lucide-react';
import { Header } from '@/components/Header';
import { SummaryTiles } from '@/components/SummaryTiles';
import { useCurrentUser } from '@/lib/use-current-user';

interface PaymentProjectItem {
  id: string;
  inquiryCode: string;
  customerName: string;
  phone: string;
  capacityKw: number;
  city: string;
  totalDealAmount: number;
  firstMilestoneAmount: number;
  firstMilestoneStatus: 'DUE' | 'PAID';
  finalMilestoneAmount: number;
  finalMilestoneStatus: 'PENDING' | 'PAID';
  subsidyAmount: number;
  lastFollowupNote?: string;
}

export default function PaymentsLedgerPage() {
  const router = useRouter();
  const { user, theme } = useCurrentUser();
  const [activeTab, setActiveTab] = useState<'all' | 'due' | 'paid'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const [projects, setProjects] = useState<PaymentProjectItem[]>([
    {
      id: 'TYP-2026-1024',
      inquiryCode: 'F-1024',
      customerName: 'Ramesh Patel',
      phone: '+91 98250 12345',
      capacityKw: 6.0,
      city: 'Anand',
      totalDealAmount: 275000,
      firstMilestoneAmount: 220000,
      firstMilestoneStatus: 'DUE',
      finalMilestoneAmount: 55000,
      finalMilestoneStatus: 'PENDING',
      subsidyAmount: 78000,
      lastFollowupNote: 'Called customer. Promised HDFC cheque on delivery tomorrow.',
    },
    {
      id: 'TYP-2026-1015',
      inquiryCode: 'F-1015',
      customerName: 'Diwan Zakirbhai',
      phone: '+91 98250 44332',
      capacityKw: 10.0,
      city: 'Anand',
      totalDealAmount: 480000,
      firstMilestoneAmount: 384000,
      firstMilestoneStatus: 'PAID',
      finalMilestoneAmount: 96000,
      finalMilestoneStatus: 'PENDING',
      subsidyAmount: 78000,
      lastFollowupNote: '80% NEFT received. Installation underway.',
    },
    {
      id: 'TYP-2026-1012',
      inquiryCode: 'F-1012',
      customerName: 'Harishbhai Shah',
      phone: '+91 98250 77665',
      capacityKw: 4.5,
      city: 'Vadodara',
      totalDealAmount: 215000,
      firstMilestoneAmount: 172000,
      firstMilestoneStatus: 'PAID',
      finalMilestoneAmount: 43000,
      finalMilestoneStatus: 'PAID',
      subsidyAmount: 78000,
      lastFollowupNote: 'Full payment cleared. Net meter live.',
    },
  ]);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) return;

    fetch('/api/v1/inquiries', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        const list = Array.isArray(data) ? data : (data?.data || []);
        if (Array.isArray(list)) {
          const converted = list.filter((i: any) =>
            [
              'DEAL_CLOSED',
              'GOVT_DOCS_SUBMITTED',
              'SR_NUMBER_ISSUED',
              'MATERIAL_PLANNED',
              'MATERIAL_UNLOADED',
              'INSTALLATION_DONE',
              'METER_STARTED',
              'COMPLETED',
            ].includes(i.currentStage)
          );

          if (converted.length > 0) {
            setProjects(
              converted.map((inq: any) => {
                const total = Number(inq.dealAmount) || (Number(inq.requestedKw) || 6) * 45000;
                const m1 = inq.payments?.[0]?.amount ? Number(inq.payments[0].amount) : Math.round(total * 0.8);
                const m2 = total - m1;
                const m1Paid = inq.payments?.[0]?.status === 'PAID';
                const m2Paid = inq.payments?.[1]?.status === 'PAID';

                return {
                  id: inq.id.startsWith('TYP-') ? inq.id : `TYP-2026-${(inq.followupId || inq.id).replace('F-', '')}`,
                  inquiryCode: inq.followupId || inq.id,
                  customerName: inq.customerName,
                  phone: inq.customerPhone,
                  capacityKw: Number(inq.requestedKw) || 6,
                  city: inq.city || 'Gujarat',
                  totalDealAmount: total,
                  firstMilestoneAmount: m1,
                  firstMilestoneStatus: m1Paid ? 'PAID' : 'DUE',
                  finalMilestoneAmount: m2,
                  finalMilestoneStatus: m2Paid ? 'PAID' : 'PENDING',
                  subsidyAmount: 78000,
                  lastFollowupNote: inq.followups?.[0]?.description || 'Milestone tracking active',
                };
              })
            );
          }
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
    if (activeTab === 'due') return p.firstMilestoneStatus === 'DUE';
    if (activeTab === 'paid') return p.firstMilestoneStatus === 'PAID';
    return true;
  });

  return (
    <div className="min-h-screen bg-typhoon-sand pb-20">
      {/* 1. Unified Responsive Header matching Home */}
      <Header
        role={user?.role || 'OPS_MANAGER'}
        initials={theme.tag}
        roleTitle="Control tower"
        subtitle="Customer Milestone Ledgers & Payment Collections"
      />

      <div className="max-w-6xl mx-auto px-4 lg:px-6 pt-3 space-y-4">
        {/* 2. Summary Tiles matching Home */}
        <SummaryTiles
          tiles={[
            {
              icon: <IndianRupee className="w-4 h-4 text-typhoon-gold" />,
              value: '₹9.70L',
              label: 'Total order book',
            },
            {
              icon: <AlertCircle className="w-4 h-4 text-rose-600" />,
              value: '₹2.20L',
              label: '1st payment due (80%)',
            },
            {
              icon: <Clock className="w-4 h-4 text-sky-600" />,
              value: '₹1.51L',
              label: 'Final balance (20%)',
            },
            {
              icon: <CheckCircle2 className="w-4 h-4 text-emerald-600" />,
              value: '₹2.34L',
              label: 'PM Surya Ghar DBT',
            },
          ]}
        />

        {/* Title row */}
        <div className="bg-white p-4 rounded-2xl border border-typhoon-border shadow-soft">
          <h1 className="text-xl sm:text-2xl font-serif font-bold text-typhoon-navy tracking-tight">
            Accounts & Payment Collections
          </h1>
          <p className="text-xs text-typhoon-muted mt-0.5">
            80/20 milestone collections on material unload & installation, payment proofs, and subsidy DBT reconciliation
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl p-4 border border-typhoon-border shadow-soft flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex flex-wrap gap-1.5 text-xs">
            {[
              { id: 'all', label: 'All Projects (3)' },
              { id: 'due', label: '1st Payment Due (1)' },
              { id: 'paid', label: 'Collections Done (2)' },
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

        {/* Ledger List */}
        <div className="space-y-3">
          {filtered.map((proj) => (
            <div
              key={proj.id}
              onClick={() => router.push(`/payments/${proj.inquiryCode}`)}
              className="bg-white rounded-2xl p-5 border border-typhoon-border shadow-soft hover:border-typhoon-gold transition cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 group"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-typhoon-sand flex items-center justify-center text-typhoon-navy font-bold text-sm shrink-0">
                  <CreditCard className="w-6 h-6 text-typhoon-gold" />
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-sm font-bold text-typhoon-navy group-hover:text-typhoon-gold transition-colors">
                      {proj.id} · {proj.customerName}
                    </h3>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        proj.firstMilestoneStatus === 'DUE'
                          ? 'bg-rose-50 text-rose-700 border-rose-200'
                          : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      }`}
                    >
                      80% Milestone: {proj.firstMilestoneStatus === 'DUE' ? '₹' + proj.firstMilestoneAmount.toLocaleString('en-IN') + ' Due' : 'Paid'}
                    </span>
                  </div>

                  <p className="text-xs text-typhoon-muted mt-1">
                    {proj.capacityKw} kW · {proj.city} · Deal Value: ₹{proj.totalDealAmount.toLocaleString('en-IN')} · Phone: {proj.phone}
                  </p>

                  {proj.lastFollowupNote && (
                    <p className="text-[11px] text-typhoon-navy bg-typhoon-sand/50 p-2 rounded-lg border border-typhoon-border/60 mt-2">
                      <strong>Follow-up Note: </strong>
                      <span className="italic">"{proj.lastFollowupNote}"</span>
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 self-end md:self-center">
                <span className="text-xs font-bold text-typhoon-gold group-hover:translate-x-1 transition-transform flex items-center gap-1">
                  <span>Record Payment</span>
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

