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

  // Sync tab with URL query parameter (e.g. /payments?tab=due)
  useEffect(() => {
    const handleUrlChange = () => {
      if (typeof window !== 'undefined') {
        const params = new URLSearchParams(window.location.search);
        const tab = params.get('tab');
        if (tab === 'due' || tab === 'paid' || tab === 'all') {
          setActiveTab(tab as any);
        }
      }
    };
    handleUrlChange();
    window.addEventListener('popstate', handleUrlChange);
    return () => window.removeEventListener('popstate', handleUrlChange);
  }, []);

  const [projects, setProjects] = useState<PaymentProjectItem[]>([]);

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
      })
      .catch(() => {
        setProjects([]);
      });
  }, []);

  const dueCount = projects.filter((p) => p.firstMilestoneStatus === 'DUE').length;
  const paidCount = projects.filter((p) => p.firstMilestoneStatus === 'PAID').length;

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
    <div className="min-h-screen bg-typhoon-sand pb-24 font-sans">
      {/* 1. Unified Responsive Header matching Home */}
      <Header
        role={user?.role || 'ACCOUNTANT'}
        initials={theme.tag}
        roleTitle="Accounts & Finance"
        subtitle="Customer Milestone Ledgers & Collections"
      />

      <div className="max-w-6xl mx-auto px-4 lg:px-6 pt-1 space-y-4">
        {/* 2. Summary Tiles matching Home - 3 responsive tiles */}
        <SummaryTiles
          role={user?.role || 'ACCOUNTANT'}
          tiles={[
            {
              icon: <AlertCircle className="w-4 h-4 text-rose-600" />,
              value: String(dueCount),
              label: '1st payment due',
            },
            {
              icon: <CheckCircle2 className="w-4 h-4 text-emerald-600" />,
              value: String(paidCount),
              label: 'Collections done',
            },
            {
              icon: <IndianRupee className="w-4 h-4 text-typhoon-gold" />,
              value: String(projects.length),
              label: 'Active ledgers',
            },
          ]}
        />

        {/* Title row (Desktop only to keep mobile clean) */}
        <div className="hidden md:block bg-white p-5 rounded-2xl border border-typhoon-border shadow-soft">
          <h1 className="text-xl sm:text-2xl font-serif font-normal text-typhoon-navy tracking-tight">
            Accounts & Payment Collections
          </h1>
          <p className="text-xs text-typhoon-muted mt-0.5">
            80/20 milestone collections on material unload & installation, payment proofs, and subsidy DBT reconciliation
          </p>
        </div>

        {/* Filters & Search */}
        <div className="bg-white rounded-2xl p-3.5 sm:p-4 border border-typhoon-border shadow-soft flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex flex-wrap gap-1.5 text-xs">
            {[
              { id: 'all', label: `All Ledgers (${projects.length})` },
              { id: 'due', label: `1st Payment Due (${dueCount})` },
              { id: 'paid', label: `Collections Done (${paidCount})` },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3 py-1.5 rounded-xl font-medium text-xs transition cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-typhoon-navy text-white shadow-soft'
                    : 'bg-typhoon-sand/40 text-typhoon-navy border border-typhoon-border hover:bg-typhoon-sand'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="relative flex items-center min-w-[220px]">
            <Search className="w-4 h-4 text-typhoon-muted absolute left-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by customer or project ID..."
              className="w-full pl-9 pr-3 py-2 bg-typhoon-sand/40 rounded-xl text-xs text-typhoon-navy border border-typhoon-border focus:border-typhoon-gold focus:outline-none font-sans"
            />
          </div>
        </div>

        {/* Ledger List */}
        <div className="space-y-3">
          {filtered.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 border border-typhoon-border text-center space-y-2">
              <IndianRupee className="w-10 h-10 text-typhoon-muted mx-auto opacity-40" />
              <h4 className="text-sm font-medium text-typhoon-navy">No payment records found</h4>
              <p className="text-xs text-typhoon-muted max-w-sm mx-auto">
                {activeTab === 'due'
                  ? 'No customer projects with overdue milestone payments right now.'
                  : 'No projects match your current search criteria.'}
              </p>
            </div>
          ) : (
            filtered.map((proj) => (
              <div
                key={proj.id}
                onClick={() => router.push(`/payments/${proj.inquiryCode}`)}
                className="bg-white rounded-2xl p-5 border border-typhoon-border shadow-soft hover:border-typhoon-gold transition cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 group"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-typhoon-sand flex items-center justify-center text-typhoon-navy font-medium text-sm shrink-0">
                    <CreditCard className="w-6 h-6 text-typhoon-gold" />
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-sm font-medium text-typhoon-navy group-hover:text-typhoon-gold transition-colors">
                        {proj.id} · {proj.customerName}
                      </h3>
                      <span
                        className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${
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
                        <strong className="font-medium">Follow-up Note: </strong>
                        <span className="italic">"{proj.lastFollowupNote}"</span>
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end md:self-center">
                  <span className="text-xs font-medium text-typhoon-gold group-hover:translate-x-1 transition-transform flex items-center gap-1">
                    <span>Record Payment</span>
                    <ChevronRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

