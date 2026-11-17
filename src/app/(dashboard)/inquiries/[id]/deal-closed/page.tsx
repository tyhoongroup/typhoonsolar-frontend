'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  ChevronLeft,
  Check,
  FileText,
  ChevronRight,
  IndianRupee,
  Edit3,
  Clock,
  Plus,
  Trash2,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { toast } from 'sonner';
import { getRoleTheme } from '@/lib/role-theme';
import { BrandLogo } from '@/components/BrandLogo';
import { FollowUpModal } from '@/components/FollowUpModal';

interface PaymentTerm {
  id: string;
  amount: string;
  trigger: string;
}

export default function DealClosedPage() {
  const router = useRouter();
  const params = useParams();
  const inquiryId = params.id as string;

  const [currentUser, setCurrentUser] = useState<any>(null);
  const [inquiry, setInquiry] = useState<any>(null);
  const [dealAmount, setDealAmount] = useState('275000');
  const [loading, setLoading] = useState(false);
  const [isFollowupOpen, setIsFollowupOpen] = useState(false);

  // Payment terms schedule with action dropdown triggers
  const [paymentTerms, setPaymentTerms] = useState<PaymentTerm[]>([
    { id: '1', amount: '25000', trigger: 'Booking Advance / Token' },
    { id: '2', amount: '150000', trigger: 'After Material Unload at Terrace' },
    { id: '3', amount: '75000', trigger: 'After Installation & Wiring' },
    { id: '4', amount: '25000', trigger: 'After Meter Start & Subsidy Claim' },
  ]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('user');
      if (stored) setCurrentUser(JSON.parse(stored));
    } catch {}

    const token = localStorage.getItem('accessToken');
    if (!token) {
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
          if (item.quotation?.grossCost) {
            setDealAmount(String(item.quotation.grossCost));
          } else if (item.dealAmount) {
            setDealAmount(String(item.dealAmount));
          }
        }
      })
      .catch(() => {});
  }, [inquiryId, router]);

  const theme = getRoleTheme(currentUser?.role || 'SALESPERSON');
  const sColor = theme.hex.cardDarkBg || '#111827';
  const aColor = theme.hex.accentBg || '#FF6B4A';
  const cColor = theme.hex.lightBg || '#FAF8F5';
  const onColor = theme.hex.accentTextColor || '#FFFFFF';

  const triggerOptions = [
    'Booking Advance / Token',
    'After Material Unload at Terrace',
    'After Installation & Wiring',
    'After Meter Start & Grid Live',
    'After Subsidy Claimed / Received',
  ];

  const handleAddTerm = () => {
    setPaymentTerms([
      ...paymentTerms,
      {
        id: String(Date.now()),
        amount: '25000',
        trigger: 'After Installation & Wiring',
      },
    ]);
  };

  const handleRemoveTerm = (id: string) => {
    if (paymentTerms.length <= 1) return;
    setPaymentTerms(paymentTerms.filter((t) => t.id !== id));
  };

  const handleTermChange = (id: string, field: 'amount' | 'trigger', val: string) => {
    setPaymentTerms(
      paymentTerms.map((t) => (t.id === id ? { ...t, [field]: val } : t))
    );
  };

  const handleMarkClosed = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('accessToken');
    if (!token) {
      toast.error('Session expired. Please sign in again.');
      router.push('/');
      return;
    }

    const cleanAmount = Number(dealAmount.replace(/\D/g, ''));
    if (!cleanAmount || cleanAmount <= 0) {
      toast.error('Please enter a valid deal amount.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`/api/v1/inquiries/${inquiry?.id || inquiryId}/close-deal`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          dealAmount: cleanAmount,
        }),
      });

      const resData = await res.json();
      if (!res.ok) {
        throw new Error(resData.message || 'Failed to close deal.');
      }

      toast.success(
        `Deal closed for ${inquiry?.customerName || 'customer'} at ₹${cleanAmount.toLocaleString('en-IN')}! Opening Document Upload.`
      );

      // Redirect immediately to project documents upload page
      const targetId = inquiry?.followupId || inquiryId;
      router.push(`/projects/${targetId}`);
    } catch (err: any) {
      toast.error(err.message || 'Failed to mark deal closed.');
    } finally {
      setLoading(false);
    }
  };

  const customerName = inquiry?.customerName || 'Customer';
  const customerPhone = inquiry?.customerPhone || '9825012345';
  const requestedKw = inquiry?.requestedKw || '6.0';
  const meterPhase = inquiry?.meterPhase || 'Single Phase';
  const followupId = inquiry?.followupId || inquiryId;

  return (
    <div
      style={{
        backgroundColor: cColor,
        color: sColor,
      }}
      className="min-h-screen pb-28 font-sans"
    >
      {/* 1. Curved Header with Role Theme Colors */}
      <div
        style={{
          background: theme.hex.headerGradient || `linear-gradient(180deg, color-mix(in srgb, ${aColor} 38%, ${cColor}) 0%, color-mix(in srgb, ${aColor} 14%, ${cColor}) 100%)`,
          borderRadius: '0 0 50% 50% / 0 0 34px 34px',
          padding: '14px 16px 48px',
          color: sColor,
        }}
        className="relative"
      >
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => router.back()}
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.75)',
              borderColor: `color-mix(in srgb, ${sColor} 15%, transparent)`,
              color: sColor,
            }}
            className="w-9 h-9 rounded-full border flex items-center justify-center transition active:scale-95 cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <BrandLogo accentColor={aColor} textColor={sColor} size={24} />

          <button
            onClick={() => setIsFollowupOpen(true)}
            style={{
              backgroundColor: aColor,
              color: onColor,
            }}
            className="px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1 active:scale-95 transition cursor-pointer shadow-sm"
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Follow-up</span>
          </button>
        </div>

        <div className="mt-3">
          <span
            style={{ color: aColor }}
            className="text-[11px] font-extrabold uppercase tracking-wider block"
          >
            CONFIRM DEAL CLOSURE & TERMS
          </span>
          <h1
            style={{ color: sColor }}
            className="text-2xl font-extrabold tracking-tight mt-1"
          >
            {customerName}
          </h1>
          <p className="text-xs opacity-75 font-medium mt-0.5">
            {followupId} · +91 {customerPhone} · {requestedKw} kW · {meterPhase}
          </p>
        </div>
      </div>

      {/* 2. Form Body */}
      <form onSubmit={handleMarkClosed} className="px-3.5 -mt-6 space-y-3 relative z-10">
        {/* Deal Amount Card */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '18px',
            border: `0.5px solid color-mix(in srgb, ${sColor} 8%, transparent)`,
            boxShadow: `0 6px 18px color-mix(in srgb, ${sColor} 8%, transparent)`,
          }}
          className="p-4"
        >
          <label
            style={{ color: sColor }}
            className="block text-xs font-extrabold uppercase tracking-wider mb-2"
          >
            Agreed Final Project Price (₹) *
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base font-extrabold text-gray-500">
              ₹
            </span>
            <input
              type="text"
              required
              value={dealAmount}
              onChange={(e) => setDealAmount(e.target.value.replace(/\D/g, ''))}
              placeholder="e.g. 275000"
              className="w-full pl-8 pr-4 py-3 rounded-xl border border-gray-300 text-lg font-extrabold text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <p className="text-[11px] text-gray-500 mt-1.5">
            Customer will also receive PM Surya Ghar direct bank subsidy of ₹78,000.
          </p>
        </div>

        {/* Milestone Payment Terms Builder */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '18px',
            border: `0.5px solid color-mix(in srgb, ${sColor} 8%, transparent)`,
            boxShadow: `0 6px 18px color-mix(in srgb, ${sColor} 8%, transparent)`,
          }}
          className="p-4"
        >
          <div className="flex items-center justify-between pb-2 border-b border-gray-100 mb-3">
            <div>
              <h3 style={{ color: sColor }} className="text-sm font-extrabold">
                Milestone Payment Terms
              </h3>
              <p className="text-[11px] text-gray-500">
                Action triggers when payments become due
              </p>
            </div>
            <button
              type="button"
              onClick={handleAddTerm}
              style={{ color: aColor }}
              className="text-xs font-bold hover:underline cursor-pointer flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Term</span>
            </button>
          </div>

          <div className="space-y-2.5">
            {paymentTerms.map((term, idx) => (
              <div
                key={term.id}
                className="p-3 rounded-xl bg-gray-50 border border-gray-200/80 flex items-center gap-2"
              >
                <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center font-extrabold text-xs text-gray-500 flex-none border">
                  {idx + 1}
                </div>

                <div className="flex-1 min-w-0 grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div className="relative">
                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">
                      ₹
                    </span>
                    <input
                      type="text"
                      value={term.amount}
                      onChange={(e) => handleTermChange(term.id, 'amount', e.target.value.replace(/\D/g, ''))}
                      className="w-full pl-6 pr-2 py-1.5 rounded-lg border border-gray-300 text-xs font-bold text-gray-800"
                    />
                  </div>

                  <select
                    value={term.trigger}
                    onChange={(e) => handleTermChange(term.id, 'trigger', e.target.value)}
                    className="w-full px-2 py-1.5 rounded-lg border border-gray-300 text-xs font-medium text-gray-800 bg-white"
                  >
                    {triggerOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>

                {paymentTerms.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveTerm(term.id)}
                    className="p-1.5 text-gray-400 hover:text-rose-600 transition cursor-pointer flex-none"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          style={{
            backgroundColor: aColor,
            color: onColor,
            boxShadow: `0 8px 20px color-mix(in srgb, ${aColor} 35%, transparent)`,
          }}
          className="w-full py-4 rounded-[18px] font-extrabold text-sm flex items-center justify-center gap-2 hover:opacity-95 active:scale-[0.98] transition cursor-pointer disabled:opacity-50 mt-4"
        >
          {loading ? (
            <span>Closing Deal & Creating Project...</span>
          ) : (
            <>
              <CheckCircle2 className="w-4 h-4" />
              <span>Deal Close & Proceed to Document Upload</span>
            </>
          )}
        </button>
      </form>

      {/* Universal Follow-up Modal */}
      <FollowUpModal
        isOpen={isFollowupOpen}
        onClose={() => setIsFollowupOpen(false)}
        inquiryId={inquiry?.id || inquiryId}
        stage="DEAL_CLOSED"
        role="SALESPERSON"
      />
    </div>
  );
}
