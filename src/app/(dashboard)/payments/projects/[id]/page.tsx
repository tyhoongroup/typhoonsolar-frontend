'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ChevronLeft,
  IndianRupee,
  Calendar,
  Clock,
  Phone,
  Upload,
  CheckCircle2,
  AlertCircle,
  FileText,
  Send,
  Receipt,
  CreditCard,
  MessageSquare,
} from 'lucide-react';
import { toast } from 'sonner';
import { useCurrentUser } from '@/lib/use-current-user';

export default function RecordPaymentPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { theme } = useCurrentUser();
  const projectId = params.id.startsWith('TYP-') ? params.id : `TYP-2026-${params.id.replace('F-', '')}`;

  // Follow-up logger
  const [promisedDate, setPromisedDate] = useState('2026-11-14');
  const [followupNotes, setFollowupNotes] = useState(
    'Customer promised HDFC bank cheque on terrace material delivery.'
  );
  const [isFollowupSaved, setIsFollowupSaved] = useState(false);

  // Payment Recording Form
  const [milestoneType, setMilestoneType] = useState<'80% Unload Milestone' | '20% Final Settlement'>('80% Unload Milestone');
  const [amount, setAmount] = useState('220000');
  const [paymentMode, setPaymentMode] = useState<'Cheque' | 'NEFT/RTGS' | 'UPI' | 'Cash'>('Cheque');
  const [refNumber, setRefNumber] = useState('CHQ-882910');
  const [paymentProofFile, setPaymentProofFile] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSavePaymentFollowup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!followupNotes.trim()) {
      toast.error('Please enter payment follow-up remarks.');
      return;
    }
    setIsFollowupSaved(true);
    toast.success('Payment follow-up remarks & promised date saved!');
  };

  const handleRecordPayment = (e: React.FormEvent) => {
    e.preventDefault();

    if (!amount || Number(amount) <= 0) {
      toast.error('Please enter a valid payment amount.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success(
        `Payment of ₹${Number(amount).toLocaleString('en-IN')} recorded successfully! Receipt generated.`
      );
      router.push('/payments');
    }, 600);
  };

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
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-3">
            <button
              onClick={() => router.back()}
              className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <span
                style={{
                  backgroundColor: theme.hex.accentBg,
                  color: theme.hex.accentTextColor,
                }}
                className="text-[10px] font-bold px-2.5 py-0.5 rounded-full"
              >
                MILESTONE ACCOUNTS
              </span>
              <span className="text-xs text-white/70">Meera (Finance)</span>
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl lg:text-3xl font-serif font-bold text-white tracking-tight">
                Record Payment & Receipt
              </h1>
              <p
                style={{ color: theme.hex.accentBg }}
                className="text-xs font-medium mt-1"
              >
                Project {projectId} · Ramesh Patel (+91 98250 12345)
              </p>
            </div>

            <a
              href="tel:+919825012345"
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-2 transition shadow-soft self-start md:self-auto"
            >
              <Phone className="w-4 h-4" />
              <span>Call Customer for Payment</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-4xl mx-auto px-4 lg:px-6 -mt-3 space-y-5">
        {/* Financial Milestone Summary Cards */}
        <div className="bg-white rounded-2xl p-6 border border-typhoon-border shadow-soft space-y-4">
          <h3 className="text-sm font-bold text-typhoon-navy">
            Project Milestone Breakdown
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-typhoon-sand/40 p-4 rounded-xl border border-typhoon-border/80">
              <span className="text-[10px] text-typhoon-muted font-bold uppercase block">
                Total Closed Deal
              </span>
              <span className="text-base font-bold text-typhoon-navy block mt-0.5">
                ₹2,75,000
              </span>
              <span className="text-[11px] text-typhoon-muted">6.0 kW Single Phase</span>
            </div>

            <div className="bg-rose-50 p-4 rounded-xl border border-rose-200">
              <span className="text-[10px] text-rose-600 font-bold uppercase block">
                1st Milestone (80% on Unload)
              </span>
              <span className="text-base font-bold text-rose-700 block mt-0.5">
                ₹2,20,000 Due
              </span>
              <span className="text-[11px] text-rose-600 font-semibold">Collect upon material arrival</span>
            </div>

            <div className="bg-typhoon-sand/40 p-4 rounded-xl border border-typhoon-border/80">
              <span className="text-[10px] text-typhoon-muted font-bold uppercase block">
                2nd Milestone (20% on Net Meter)
              </span>
              <span className="text-base font-bold text-typhoon-navy block mt-0.5">
                ₹55,000 Pending
              </span>
              <span className="text-[11px] text-typhoon-muted">Due on bi-directional meter test</span>
            </div>
          </div>
        </div>

        {/* Payment Follow-up Logger */}
        <div className="bg-white rounded-2xl p-6 border border-typhoon-border shadow-soft space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-typhoon-navy">
                Payment Follow-Up & Promised Date
              </h3>
              <p className="text-xs text-typhoon-muted">
                Log customer payment promises & call remarks
              </p>
            </div>
            {isFollowupSaved && (
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Follow-up Saved
              </span>
            )}
          </div>

          <form onSubmit={handleSavePaymentFollowup} className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-semibold text-typhoon-navy block mb-1">
                  Promised Payment Date
                </label>
                <input
                  type="date"
                  value={promisedDate}
                  onChange={(e) => setPromisedDate(e.target.value)}
                  className="w-full px-3 py-2 bg-typhoon-sand/40 border border-typhoon-border rounded-xl text-xs text-typhoon-navy focus:border-typhoon-gold focus:outline-none"
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-semibold text-typhoon-navy block mb-1">
                  Payment Discussion Remarks
                </label>
                <div className="relative flex items-center">
                  <input
                    type="text"
                    value={followupNotes}
                    onChange={(e) => setFollowupNotes(e.target.value)}
                    placeholder="e.g. Customer promised cheque tomorrow at 11 AM..."
                    className="w-full px-3 py-2 bg-typhoon-sand/40 border border-typhoon-border rounded-xl text-xs text-typhoon-navy focus:border-typhoon-gold focus:outline-none pr-28"
                    required
                  />
                  <button
                    type="submit"
                    className="absolute right-1.5 py-1 px-3 bg-typhoon-navy hover:bg-typhoon-navy-light text-white text-xs font-bold rounded-lg transition"
                  >
                    Save Note
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Record Payment Form */}
        <form
          onSubmit={handleRecordPayment}
          className="bg-white rounded-2xl p-6 border border-typhoon-border shadow-soft space-y-4"
        >
          <div className="flex items-center gap-2">
            <Receipt className="w-4 h-4 text-typhoon-gold" />
            <h3 className="text-sm font-bold text-typhoon-navy">
              Record Inward Milestone Collection
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-typhoon-navy block mb-1">
                Milestone Stage
              </label>
              <select
                value={milestoneType}
                onChange={(e) => setMilestoneType(e.target.value as any)}
                className="w-full px-3 py-2.5 bg-typhoon-sand/40 border border-typhoon-border rounded-xl text-xs font-bold text-typhoon-navy focus:border-typhoon-gold focus:outline-none"
              >
                <option value="80% Unload Milestone">1st Milestone: 80% (Material Unloaded)</option>
                <option value="20% Final Settlement">2nd Milestone: 20% (Net Meter Live)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-typhoon-navy block mb-1">
                Amount Received (₹) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-3 py-2.5 bg-typhoon-sand/40 border border-typhoon-border rounded-xl text-xs font-bold text-typhoon-navy focus:border-typhoon-gold focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-typhoon-navy block mb-1">
                Payment Mode <span className="text-rose-500">*</span>
              </label>
              <select
                value={paymentMode}
                onChange={(e) => setPaymentMode(e.target.value as any)}
                className="w-full px-3 py-2.5 bg-typhoon-sand/40 border border-typhoon-border rounded-xl text-xs font-bold text-typhoon-navy focus:border-typhoon-gold focus:outline-none"
              >
                <option value="Cheque">Bank Cheque</option>
                <option value="NEFT/RTGS">NEFT / RTGS Online Transfer</option>
                <option value="UPI">UPI / QR Code</option>
                <option value="Cash">Cash Receipt</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-typhoon-navy block mb-1">
                Cheque / UTR / Transaction No <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={refNumber}
                onChange={(e) => setRefNumber(e.target.value)}
                placeholder="e.g. UTR-9988120489"
                className="w-full px-3 py-2.5 bg-typhoon-sand/40 border border-typhoon-border rounded-xl text-xs font-bold text-typhoon-navy focus:border-typhoon-gold focus:outline-none"
                required
              />
            </div>
          </div>

          {/* Proof Screenshot Upload */}
          <div>
            <label className="text-xs font-semibold text-typhoon-navy block mb-1">
              Payment Receipt / Transfer Proof
            </label>
            <div className="flex items-center gap-3">
              <label className="cursor-pointer px-4 py-2 bg-typhoon-sand hover:bg-typhoon-sand-dark text-typhoon-navy font-bold rounded-xl text-xs border border-typhoon-border/80 transition flex items-center gap-1.5">
                <Upload className="w-3.5 h-3.5 text-typhoon-gold" />
                <span>Upload Proof Screenshot</span>
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      setPaymentProofFile(e.target.files[0].name);
                      toast.success('Payment receipt screenshot attached!');
                    }
                  }}
                  className="hidden"
                />
              </label>
              {paymentProofFile && (
                <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{paymentProofFile}</span>
                </span>
              )}
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-typhoon-gold hover:bg-typhoon-gold-dark text-typhoon-navy font-bold text-sm rounded-2xl shadow-soft flex items-center justify-center gap-2 transition disabled:opacity-50"
            >
              <IndianRupee className="w-4 h-4 stroke-[2.5]" />
              <span>
                {loading ? 'Recording Payment...' : 'Record Payment & Update Project Ledger'}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

