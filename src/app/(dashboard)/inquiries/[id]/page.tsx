'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  ChevronLeft,
  Phone,
  Calendar,
  Check,
  Clock,
  Plus,
  X,
  User,
  MapPin,
  Zap,
  FileText,
  MessageSquare,
  AlertCircle,
  Share2,
  CheckCircle2,
  Send,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { toast } from 'sonner';
import { useCurrentUser } from '@/lib/use-current-user';

export default function InquiryDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const inquiryId = params.id;
  const { user, theme } = useCurrentUser();

  const [inquiry, setInquiry] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Load live inquiry data from backend
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token || token === 'null' || token === 'undefined') {
      localStorage.clear();
      router.push('/');
      return;
    }

    fetch(`/api/v1/inquiries/${inquiryId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        const item = data?.data || data;
        if (item) {
          setInquiry(item);
        }
      })
      .catch((err) => {
        console.error('Failed to load inquiry:', err);
      })
      .finally(() => setLoading(false));
  }, [inquiryId, router]);

  // Stage mapping helper
  const getStageMeta = (stage?: string) => {
    switch (stage) {
      case 'INQUIRY_RECEIVED':
        return { name: 'Inquiry received', num: 1, percent: '10%' };
      case 'SITE_VISIT_PLANNED':
        return { name: 'Quotation and visit', num: 2, percent: '20%' };
      case 'QUOTATION_SENT':
        return { name: 'Quotation negotiation', num: 3, percent: '30%' };
      case 'DEAL_CLOSED':
        return { name: 'Deal closed & KYC', num: 4, percent: '40%' };
      case 'GOVT_DOCS_SUBMITTED':
      case 'SR_NUMBER_ISSUED':
        return { name: 'Govt portal filing', num: 5, percent: '50%' };
      case 'MATERIAL_PLANNED':
      case 'MATERIAL_UNLOADED':
        return { name: 'Material & BOM delivery', num: 7, percent: '70%' };
      case 'INSTALLATION_DONE':
        return { name: 'Installation & testing', num: 8, percent: '80%' };
      case 'METER_STARTED':
      case 'COMPLETED':
        return { name: 'Commissioned & Subsidy', num: 10, percent: '100%' };
      default:
        return { name: 'Quotation and visit', num: 2, percent: '20%' };
    }
  };

  const stageMeta = getStageMeta(inquiry?.currentStage);

  // Status badge styling
  const getBadgeStyle = (status?: string) => {
    switch (status) {
      case 'DONE':
      case 'CALL_DONE':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'ON_TRACK':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'DELAYED':
      case 'NOT_REACHABLE':
        return 'bg-rose-50 text-rose-800 border-rose-200';
      default:
        return 'bg-blue-50 text-blue-800 border-blue-200';
    }
  };

  const customerName = inquiry?.customerName || 'Ramesh Patel';
  const customerPhone = inquiry?.customerPhone || '9825012345';
  const requestedKw = inquiry?.requestedKw || '6.0';
  const meterPhase = inquiry?.meterPhase || 'Single Phase';
  const followupId = inquiry?.followupId || inquiryId;
  const assignedSp = inquiry?.assignedSalesperson?.fullName || 'Amit';
  const quoteDueDays = inquiry?.quoteDueDays || 3;

  // Real or default followups list
  const followupsList = inquiry?.followups && inquiry.followups.length > 0
    ? inquiry.followups
    : [
        {
          id: 'f-1',
          status: 'DONE',
          description: 'Wants a site visit this week',
          nextStep: 'Site visit planned',
          title: 'Customer called',
        },
        {
          id: 'f-2',
          status: 'ON_TRACK',
          description: `${assignedSp} will visit terrace`,
          nextStep: 'Prepare quotation breakdown',
          title: 'Site visit planned',
        },
      ];

  return (
    <div className="min-h-screen bg-typhoon-sand pb-28">
      {/* ================================================================ */}
      {/* MOBILE LAYOUT (Matches Screen 4 from PDF)                        */}
      {/* ================================================================ */}
      <div className="lg:hidden">
        {/* 1. Curved Header with Role Theme Colors */}
        <div
          style={{ backgroundColor: theme.hex.headerBg }}
          className="pt-6 pb-8 px-5 rounded-b-[32px] shadow-soft relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 border border-white/5 rounded-full pointer-events-none -mr-16 -mt-16" />
          <div className="absolute top-0 right-0 w-44 h-44 border border-white/5 rounded-full pointer-events-none -mr-8 -mt-8" />

          <div className="max-w-md mx-auto">
            {/* Back button */}
            <button
              type="button"
              onClick={() => router.back()}
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition mb-3 cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <h1 className="text-3xl font-serif font-bold text-white tracking-tight">
              Inquiry detail
            </h1>
            <p className="text-xs text-white/70 mt-1 font-medium">
              {followupId} · Follow-up ID
            </p>
          </div>
        </div>

        {/* 2. Mobile Body Cards */}
        <div className="max-w-md mx-auto px-4 pt-4 space-y-4">
          {/* Summary Card (Customer, Phone, Requirement, Assigned to) */}
          <div className="bg-white rounded-2xl p-5 border border-typhoon-border shadow-soft divide-y divide-typhoon-border/60">
            <div className="flex justify-between items-center py-2 text-xs first:pt-0">
              <span className="text-typhoon-muted font-medium">Customer</span>
              <span className="font-bold text-typhoon-navy text-sm">
                {customerName}
              </span>
            </div>

            <div className="flex justify-between items-center py-2 text-xs">
              <span className="text-typhoon-muted font-medium">Phone</span>
              <div className="flex items-center gap-2">
                <span className="font-bold text-typhoon-navy text-sm">
                  +91 {customerPhone}
                </span>
                <a
                  href={`tel:${customerPhone.replace(/\D/g, '')}`}
                  className="w-6 h-6 rounded-full bg-typhoon-sand flex items-center justify-center text-typhoon-navy"
                >
                  <Phone className="w-3 h-3" />
                </a>
              </div>
            </div>

            <div className="flex justify-between items-center py-2 text-xs">
              <span className="text-typhoon-muted font-medium">Requirement</span>
              <span className="font-bold text-typhoon-navy text-sm">
                {requestedKw} kW, {meterPhase}
              </span>
            </div>

            <div className="flex justify-between items-center py-2 text-xs last:pb-0">
              <span className="text-typhoon-muted font-medium">Assigned to</span>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-typhoon-navy text-sm">
                  {assignedSp} · {quoteDueDays} days
                </span>
                <button
                  onClick={() => router.push(`/inquiries/${followupId}/assign`)}
                  className="text-[11px] font-bold text-typhoon-gold-dark hover:underline"
                >
                  Change
                </button>
              </div>
            </div>
          </div>

          {/* Stage Progress Card */}
          <div className="bg-white rounded-2xl p-5 border border-typhoon-border shadow-soft space-y-2.5">
            <div className="flex justify-between items-center text-xs">
              <span className="font-medium text-typhoon-navy">
                {stageMeta.name}
              </span>
              <span className="font-bold text-typhoon-navy">
                Stage {stageMeta.num} of 10
              </span>
            </div>

            {/* Progress Bar with Gold / Accent Fill */}
            <div className="w-full h-2.5 bg-typhoon-sand rounded-full overflow-hidden">
              <div
                style={{ width: stageMeta.percent, backgroundColor: theme.hex.accentBg }}
                className="h-full rounded-full transition-all duration-500"
              />
            </div>
          </div>

          {/* Section: CALL HISTORY */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold tracking-widest text-typhoon-muted uppercase px-1">
              CALL HISTORY
            </h3>

            {/* Call History Card List */}
            <div className="bg-white rounded-2xl border border-typhoon-border shadow-soft divide-y divide-typhoon-border/60 overflow-hidden">
              {followupsList.map((f: any, idx: number) => (
                <div
                  key={f.id || idx}
                  onClick={() => router.push(`/inquiries/${followupId}/log-call`)}
                  className="p-4 flex items-center justify-between cursor-pointer hover:bg-typhoon-sand/40 transition-colors"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-typhoon-sand flex items-center justify-center text-typhoon-navy flex-shrink-0">
                      {idx % 2 === 0 ? (
                        <Phone className="w-5 h-5 text-typhoon-navy" />
                      ) : (
                        <Calendar className="w-5 h-5 text-typhoon-navy" />
                      )}
                    </div>
                    <div className="truncate">
                      <h4 className="text-sm font-bold text-typhoon-navy truncate">
                        {f.title || (f.status === 'CALL_DONE' ? 'Customer called' : 'Follow-up update')}
                      </h4>
                      <p className="text-xs text-typhoon-muted truncate mt-0.5">
                        {f.description || f.nextStep || 'Follow-up discussion notes'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                    <span
                      className={`text-xs font-bold px-3 py-1 rounded-full border ${getBadgeStyle(
                        f.status
                      )}`}
                    >
                      {f.status === 'DONE' || f.status === 'CALL_DONE'
                        ? 'Done'
                        : f.status === 'ON_TRACK'
                        ? 'Next'
                        : 'Update'}
                    </span>
                    <ChevronRight className="w-4 h-4 text-typhoon-muted" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Hub Buttons */}
          <div className="pt-2 space-y-2">
            {/* Main Log a Call Button Matching Screen 4 */}
            <button
              onClick={() => router.push(`/inquiries/${followupId}/log-call`)}
              style={{
                backgroundColor: theme.hex.accentBg,
                color: theme.hex.accentTextColor,
              }}
              className="w-full py-4 px-6 rounded-2xl font-bold text-base shadow-soft flex items-center justify-center gap-2 transition cursor-pointer hover:opacity-95"
            >
              <Phone className="w-5 h-5" />
              <span>Log a call</span>
            </button>

            {/* Secondary Action: Deal closed */}
            <button
              onClick={() => router.push(`/inquiries/${followupId}/deal-closed`)}
              className="w-full py-3.5 px-4 rounded-2xl bg-white hover:bg-typhoon-sand border border-typhoon-border text-typhoon-navy font-bold text-xs shadow-soft flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Advance to Deal Closed</span>
            </button>
          </div>
        </div>
      </div>

      {/* ================================================================ */}
      {/* DESKTOP LAYOUT (Rich 2-Column Wide Grid Layout)                 */}
      {/* ================================================================ */}
      <div className="hidden lg:block max-w-6xl mx-auto px-6 py-8 space-y-6">
        {/* Top Header Card */}
        <div
          style={{ backgroundColor: theme.hex.headerBg }}
          className="rounded-3xl p-6 text-white shadow-soft relative overflow-hidden"
        >
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => router.back()}
              className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <span
                style={{
                  backgroundColor: theme.hex.accentBg,
                  color: theme.hex.accentTextColor,
                }}
                className="text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-sm uppercase tracking-wide"
              >
                Stage {stageMeta.num} of 10
              </span>
              <span className="text-xs text-white/70">{stageMeta.name}</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-serif font-bold text-white tracking-tight">
                {customerName}
              </h1>
              <p className="text-xs text-white/70 mt-1 font-medium">
                Inquiry {followupId} · {inquiry?.city || 'Vadodara'} · +91 {customerPhone}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <a
                href={`tel:${customerPhone.replace(/\D/g, '')}`}
                className="bg-white/10 hover:bg-white/20 text-white font-semibold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 transition"
              >
                <Phone className="w-4 h-4 text-white/80" />
                <span>Call Customer</span>
              </a>

              <button
                onClick={() => router.push(`/inquiries/${followupId}/log-call`)}
                style={{
                  backgroundColor: theme.hex.accentBg,
                  color: theme.hex.accentTextColor,
                }}
                className="font-bold px-5 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-soft transition hover:opacity-95 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Log a Call</span>
              </button>

              <button
                onClick={() => router.push(`/inquiries/${followupId}/deal-closed`)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 transition shadow-soft cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Close Deal</span>
              </button>
            </div>
          </div>
        </div>

        {/* 2-Column Desktop Grid */}
        <div className="grid grid-cols-12 gap-6 items-start">
          {/* Left Column: Specifications (4 cols) */}
          <div className="col-span-4 space-y-4">
            <div className="bg-white rounded-2xl p-5 border border-typhoon-border shadow-soft space-y-4">
              <h3 className="text-xs font-bold tracking-widest text-typhoon-muted uppercase">
                SYSTEM SPECIFICATIONS
              </h3>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-typhoon-sand/60 p-3 rounded-xl border border-typhoon-border/60">
                  <span className="text-[10px] text-typhoon-muted font-semibold uppercase block">Capacity</span>
                  <span className="text-base font-bold text-typhoon-navy">{requestedKw} kW</span>
                </div>
                <div className="bg-typhoon-sand/60 p-3 rounded-xl border border-typhoon-border/60">
                  <span className="text-[10px] text-typhoon-muted font-semibold uppercase block">Phase</span>
                  <span className="text-base font-bold text-typhoon-navy">{meterPhase}</span>
                </div>
                <div className="bg-typhoon-sand/60 p-3 rounded-xl border border-typhoon-border/60">
                  <span className="text-[10px] text-typhoon-muted font-semibold uppercase block">Region</span>
                  <span className="text-base font-bold text-typhoon-navy">{inquiry?.city || 'Vadodara'}</span>
                </div>
                <div className="bg-typhoon-sand/60 p-3 rounded-xl border border-typhoon-border/60">
                  <span className="text-[10px] text-typhoon-muted font-semibold uppercase block">Subsidy</span>
                  <span className="text-base font-bold text-emerald-600">₹78,000 DBT</span>
                </div>
              </div>

              <div className="pt-2 border-t border-typhoon-border/60 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-typhoon-muted font-medium">Assigned Salesperson:</span>
                  <span className="font-bold text-typhoon-navy">{assignedSp}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-typhoon-muted font-medium">SLA Commitment:</span>
                  <span className="font-bold text-typhoon-navy">{quoteDueDays} days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-typhoon-muted font-medium">Full Address:</span>
                  <span className="font-semibold text-typhoon-navy text-right max-w-[180px] truncate">
                    {inquiry?.address || 'Vadodara, Gujarat'}
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-typhoon-border/60 flex items-center justify-between">
                <button
                  onClick={() => router.push(`/inquiries/${followupId}/assign`)}
                  className="w-full py-2.5 rounded-xl bg-typhoon-sand hover:bg-typhoon-sand-dark text-typhoon-navy font-bold text-xs transition border border-typhoon-border text-center"
                >
                  Reassign Salesperson
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Follow-up Timeline (8 cols) */}
          <div className="col-span-8 space-y-4">
            <div className="bg-white rounded-2xl p-6 border border-typhoon-border shadow-soft">
              <div className="flex items-center justify-between pb-4 border-b border-typhoon-border/60">
                <div>
                  <h3 className="text-base font-serif font-bold text-typhoon-navy">
                    Call History & Follow-Up Notes
                  </h3>
                  <p className="text-xs text-typhoon-muted">
                    Discussion records and next actions for {followupId}
                  </p>
                </div>

                <button
                  onClick={() => router.push(`/inquiries/${followupId}/log-call`)}
                  className="bg-typhoon-navy text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 hover:bg-typhoon-navy-light transition cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Log a Call</span>
                </button>
              </div>

              <div className="mt-5 space-y-4">
                {followupsList.map((f: any, idx: number) => (
                  <div
                    key={f.id || idx}
                    className="p-4 rounded-xl bg-typhoon-sand/30 border border-typhoon-border/70 hover:border-typhoon-gold transition-colors space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-typhoon-navy">
                          {f.title || (f.status === 'CALL_DONE' ? 'Phone Call' : 'Follow-up Task')}
                        </span>
                        <span className="text-[10px] text-typhoon-muted">
                          by {f.createdBy?.fullName || assignedSp}
                        </span>
                      </div>
                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${getBadgeStyle(
                          f.status
                        )}`}
                      >
                        {f.status}
                      </span>
                    </div>

                    <p className="text-xs text-typhoon-navy font-medium leading-relaxed">
                      {f.description}
                    </p>

                    <div className="flex items-center justify-between text-[11px] text-typhoon-muted pt-1 border-t border-typhoon-border/40">
                      <span>Next Action: {f.nextStep || 'Follow-up'}</span>
                      <span className="font-semibold text-typhoon-navy">
                        Target: {f.committedDate ? new Date(f.committedDate).toLocaleDateString() : 'Tomorrow'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}