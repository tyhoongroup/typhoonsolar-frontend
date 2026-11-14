'use client';

import React, { useState } from 'react';
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
} from 'lucide-react';

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
  const [activeTab, setActiveTab] = useState<'all' | 'due' | 'paid'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const projects: PaymentProjectItem[] = [
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
  ];

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
    <div className="min-h-screen bg-typhoon-sand pb-16">
      {/* Top Header with Accountant signature deep burgundy */}
      <div
        style={{ backgroundColor: '#3d1020' }}
        className="text-white pt-6 pb-8 px-6 rounded-b-[32px] shadow-soft border-b border-[#571930]"
      >
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-2 mb-1">
            <IndianRupee className="w-4 h-4 text-[#e1144a]" />
            <span className="text-[11px] font-bold tracking-widest text-[#e1144a] uppercase">
              FINANCE & MILESTONE LEDGER (MEERA)
            </span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-serif font-bold text-white tracking-tight">
            Accounts & Payment Collections
          </h1>
          <p className="text-xs text-white/70 mt-1">
            80/20 milestone collections on material unload & installation, payment proofs, and subsidy DBT reconciliation
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 lg:px-6 -mt-3 space-y-4">
        {/* 4 Summary Tiles */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-white rounded-2xl p-4 border border-typhoon-border shadow-soft">
            <span className="text-[10px] font-bold text-typhoon-muted uppercase block">Total Order Book</span>
            <span className="text-lg font-serif font-bold text-typhoon-navy block mt-0.5">₹9.70 Lakh</span>
            <span className="text-[10px] text-typhoon-muted">Across 3 active projects</span>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-rose-200 shadow-soft">
            <span className="text-[10px] font-bold text-rose-600 uppercase block">1st Payment Due (80%)</span>
            <span className="text-lg font-serif font-bold text-rose-700 block mt-0.5">₹2.20 Lakh</span>
            <span className="text-[10px] text-rose-600 font-semibold">1 site awaiting collection</span>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-typhoon-border shadow-soft">
            <span className="text-[10px] font-bold text-typhoon-muted uppercase block">Final Balance (20%)</span>
            <span className="text-lg font-serif font-bold text-typhoon-navy block mt-0.5">₹1.51 Lakh</span>
            <span className="text-[10px] text-typhoon-muted">Due upon net meter start</span>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-emerald-200 shadow-soft">
            <span className="text-[10px] font-bold text-emerald-700 uppercase block">PM Surya Ghar DBT</span>
            <span className="text-lg font-serif font-bold text-emerald-800 block mt-0.5">₹2.34 Lakh</span>
            <span className="text-[10px] text-emerald-700">₹78k per rooftop direct DBT</span>
          </div>
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
                style={
                  activeTab === tab.id
                    ? { backgroundColor: '#e1144a', color: '#ffffff' }
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

