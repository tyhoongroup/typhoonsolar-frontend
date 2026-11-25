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
  AlertCircle,
  Building,
  CreditCard,
  Banknote,
} from 'lucide-react';
import { toast } from 'sonner';
import { getRoleTheme } from '@/lib/role-theme';
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
  const [dealAmount, setDealAmount] = useState('300000');
  const [paymentMode, setPaymentMode] = useState<'cash' | 'loan'>('cash');
  const [loading, setLoading] = useState(false);
  const [isFollowupOpen, setIsFollowupOpen] = useState(false);

  // Default payment terms matching 80% / 20% milestone requirements
  const [paymentTerms, setPaymentTerms] = useState<PaymentTerm[]>([
    { id: '1', amount: '240000', trigger: 'Upon dispatching materials to the site (80%)' },
    { id: '2', amount: '60000', trigger: 'After installation & net meter inspection (20%)' },
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
          const totalVal = item.quotation?.grossCost || item.dealAmount || (Number(item.requestedKw || 6) * 50000);
          setDealAmount(String(totalVal));

          // Set 80% / 20% default split based on real quotation
          const p1 = Math.round(totalVal * 0.8);
          const p2 = totalVal - p1;
          setPaymentTerms([
            { id: '1', amount: String(p1), trigger: 'Upon dispatching materials to the site (80%)' },
            { id: '2', amount: String(p2), trigger: 'After installation & net meter inspection (20%)' },
          ]);
        }
      })
      .catch(() => {});
  }, [inquiryId, router]);

  const cleanAmount = Number(dealAmount.replace(/\D/g, '')) || 300000;

  // Real GST calculation: Panels 5%, Inverter 5%, Balance of System & Installation 18%
  const panelsBase = Math.round(cleanAmount * 0.58);
  const inverterBase = Math.round(cleanAmount * 0.22);
  const bosServicesBase = Math.max(0, cleanAmount - panelsBase - inverterBase);

  const panelsGst = Math.round(panelsBase * 0.05);
  const inverterGst = Math.round(inverterBase * 0.05);
  const bosGst = Math.round(bosServicesBase * 0.18);

  const triggerOptions = [
    'Booking Advance / Token',
    'Upon dispatching materials to the site (80%)',
    'After Installation & Wiring',
    'After installation & net meter inspection (20%)',
    'After Subsidy Credit into Account',
  ];

  const handleAddTerm = () => {
    setPaymentTerms([
      ...paymentTerms,
      {
        id: String(Date.now()),
        amount: '0',
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

  // Total split amount from all milestones
  const totalTermsAmount = paymentTerms.reduce(
    (sum, t) => sum + Number(t.amount.replace(/\D/g, '') || 0),
    0
  );

  const isSplitValid = totalTermsAmount === cleanAmount;

  const handleMarkClosed = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('accessToken');
    if (!token) {
      toast.error('Session expired. Please sign in again.');
      router.push('/');
      return;
    }

    if (!cleanAmount || cleanAmount <= 0) {
      toast.error('Please enter a valid deal amount.');
      return;
    }

    // STRICT VALIDATION: Payment terms must match total amount exactly
    if (!isSplitValid) {
      toast.error(
        `Total payment terms (₹${totalTermsAmount.toLocaleString('en-IN')}) must equal the total deal amount (₹${cleanAmount.toLocaleString('en-IN')}) before saving.`
      );
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
          paymentMode,
          milestones: paymentTerms.map((term, idx) => ({
            title: `Term ${idx + 1} (${term.trigger})`,
            amount: Number(term.amount.replace(/\D/g, '')),
            actionTrigger: term.trigger,
          })),
        }),
      });

      const resData = await res.json();
      if (!res.ok) {
        throw new Error(resData.message || 'Failed to close deal.');
      }

      toast.success(
        `Deal closed for ${inquiry?.customerName || 'customer'} at ₹${cleanAmount.toLocaleString('en-IN')} via ${paymentMode.toUpperCase()}! Moving to KYC document locker.`
      );

      // Redirect immediately to project documents upload page with mode param
      const targetId = inquiry?.followupId || inquiryId;
      router.push(`/projects/${targetId}/documents?mode=${paymentMode}`);
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
    <div className="min-h-screen bg-[#FBF8F3] pb-28 font-sans">
      {/* 1. Header */}
      <div className="bg-[#0B1E36] text-white pt-6 pb-8 px-5 rounded-b-[32px] shadow-soft relative overflow-hidden">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between mb-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center transition cursor-pointer hover:bg-white/20 text-white"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="bg-white px-4 py-1.5 rounded-full shadow-xs">
              <img
                src="/images/typhoon-logo.png"
                alt="Typhoon Solar"
                className="h-6 w-auto object-contain"
              />
            </div>

            <button
              onClick={() => setIsFollowupOpen(true)}
              className="px-3 py-1.5 rounded-full bg-[#F59E0B] text-[#0B1E36] text-xs font-bold flex items-center gap-1 active:scale-95 transition cursor-pointer shadow-sm"
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Follow-up</span>
            </button>
          </div>

          <h1 className="text-3xl font-serif font-bold text-white tracking-tight">
            Confirm deal closure
          </h1>
          <p className="text-xs text-white/70 mt-1 font-medium">
            {followupId} · {customerName} · Stage 4: Closure &amp; Terms
          </p>
        </div>
      </div>

      {/* 2. Main Content */}
      <div className="max-w-md mx-auto px-4 pt-4 space-y-4">
        {/* Customer Summary Card */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-soft">
          <div className="flex justify-between items-center pb-2 border-b border-slate-100">
            <div>
              <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase block">
                CUSTOMER DETAILS
              </span>
              <h3 className="text-base font-bold text-[#0B1E36]">{customerName}</h3>
              <p className="text-xs text-slate-500">+91 {customerPhone} · {requestedKw} kW, {meterPhase}</p>
            </div>
            <span className="text-xs font-bold px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full">
              Deal Ready
            </span>
          </div>

          {/* Real Pricing & GST Breakdown Card */}
          <div className="mt-3 pt-2 text-xs space-y-1.5">
            <div className="flex justify-between text-slate-600">
              <span>Solar PV Modules (5% GST):</span>
              <span className="font-bold text-[#0B1E36]">₹ {panelsBase.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Inverter &amp; Control Equipment (5% GST):</span>
              <span className="font-bold text-[#0B1E36]">₹ {inverterBase.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Structure, Wiring &amp; Installation (18% GST):</span>
              <span className="font-bold text-[#0B1E36]">₹ {bosServicesBase.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between pt-1 border-t border-slate-200 font-bold text-sm text-[#0B1E36]">
              <span>Agreed Total Deal Amount:</span>
              <span className="text-[#F59E0B] font-serif text-base">₹ {cleanAmount.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>

        {/* Payment Mode Selection: 2 Buttons (Cash vs Loan) */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-soft space-y-2">
          <span className="text-xs font-bold text-[#0B1E36] block">
            Select Financing / Payment Option *
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setPaymentMode('cash')}
              className={`py-3 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 border cursor-pointer ${
                paymentMode === 'cash'
                  ? 'bg-[#0B1E36] text-[#F59E0B] border-[#0B1E36] shadow-sm'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <Banknote className="w-4 h-4" />
              <span>Cash / Self-Financed</span>
            </button>

            <button
              type="button"
              onClick={() => setPaymentMode('loan')}
              className={`py-3 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 border cursor-pointer ${
                paymentMode === 'loan'
                  ? 'bg-[#0B1E36] text-[#F59E0B] border-[#0B1E36] shadow-sm'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <Building className="w-4 h-4" />
              <span>Solar Bank Loan</span>
            </button>
          </div>
          <p className="text-[11px] text-slate-500">
            {paymentMode === 'cash'
              ? 'Required documents: Light bill, Aadhaar card, Bank details / passbook.'
              : 'Required documents: Light bill, Aadhaar, Property tax/Index-2, GPS site photo, Co-applicant details & PAN.'}
          </p>
        </div>

        {/* Payment Terms Milestones Editor */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-soft space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#0B1E36]">
                Payment Terms Milestones
              </h3>
              <p className="text-[11px] text-slate-500">Sum must match deal amount (₹{cleanAmount.toLocaleString('en-IN')})</p>
            </div>
            <button
              type="button"
              onClick={handleAddTerm}
              className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-[#0B1E36] font-bold text-xs flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-amber-600" />
              <span>Add Stage</span>
            </button>
          </div>

          <div className="space-y-2.5">
            {paymentTerms.map((term, index) => (
              <div
                key={term.id}
                className="p-3 rounded-xl border border-slate-200 bg-slate-50 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#0B1E36]">
                    Milestone Stage {index + 1}
                  </span>
                  {paymentTerms.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveTerm(term.id)}
                      className="text-rose-500 hover:text-rose-700 p-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 block mb-0.5">
                      Amount (₹)
                    </label>
                    <input
                      type="number"
                      value={term.amount}
                      onChange={(e) => handleTermChange(term.id, 'amount', e.target.value)}
                      className="w-full p-2 rounded-lg border border-slate-200 bg-white text-xs font-bold text-[#0B1E36] outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-500 block mb-0.5">
                      Action Trigger
                    </label>
                    <select
                      value={term.trigger}
                      onChange={(e) => handleTermChange(term.id, 'trigger', e.target.value)}
                      className="w-full p-2 rounded-lg border border-slate-200 bg-white text-xs font-medium text-[#0B1E36] outline-none"
                    >
                      {triggerOptions.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Balance Validation Bar */}
          <div className={`p-3 rounded-xl border flex items-center justify-between text-xs font-bold ${
            isSplitValid
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border-rose-200 text-rose-800'
          }`}>
            <span>Milestone Total: ₹{totalTermsAmount.toLocaleString('en-IN')}</span>
            <span>
              {isSplitValid
                ? 'Matches 100% of deal amount'
                : `Difference: ₹${Math.abs(cleanAmount - totalTermsAmount).toLocaleString('en-IN')}`}
            </span>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="button"
          onClick={handleMarkClosed}
          disabled={loading || !isSplitValid}
          className={`w-full py-4 px-6 rounded-2xl font-bold text-xs shadow-soft flex items-center justify-center gap-2 transition cursor-pointer ${
            isSplitValid
              ? 'bg-[#F59E0B] hover:bg-amber-500 text-[#0B1E36]'
              : 'bg-slate-300 text-slate-500 cursor-not-allowed'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>{loading ? 'Confirming Closure...' : 'Confirm Deal & Proceed to KYC Documents'}</span>
        </button>
      </div>

      <FollowUpModal
        isOpen={isFollowupOpen}
        onClose={() => setIsFollowupOpen(false)}
        inquiryId={followupId}
        stage="DEAL_CLOSED"
        role={currentUser?.role}
      />
    </div>
  );
}
