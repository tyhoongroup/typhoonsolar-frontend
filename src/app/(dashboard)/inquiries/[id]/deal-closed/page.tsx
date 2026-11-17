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
} from 'lucide-react';
import { toast } from 'sonner';
import { useCurrentUser } from '@/lib/use-current-user';

export default function DealClosedPage() {
  const router = useRouter();
  const params = useParams();
  const inquiryId = params.id as string;
  const { user, theme } = useCurrentUser();

  const [inquiry, setInquiry] = useState<any>(null);
  const [dealStatus, setDealStatus] = useState<'Open' | 'Closed'>('Closed');
  const [dealAmount, setDealAmount] = useState('275000');
  const [docs, setDocs] = useState([
    { id: 'light-bill', title: 'Light bill', status: 'Received', isDone: true },
    { id: 'aadhaar', title: 'Aadhaar', status: 'Received', isDone: true },
    { id: 'passbook', title: 'Passbook or cheque', status: 'Not received', isDone: false },
  ]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
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
          if (item.dealAmount) {
            setDealAmount(String(item.dealAmount));
          }
        }
      })
      .catch(() => {});
  }, [inquiryId, router]);

  const toggleDoc = (idx: number) => {
    setDocs((prev) =>
      prev.map((d, i) =>
        i === idx
          ? {
              ...d,
              isDone: !d.isDone,
              status: !d.isDone ? 'Received' : 'Not received',
            }
          : d
      )
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
        `Deal closed for ${inquiry?.customerName || 'customer'}! Converted into active project.`
      );

      // Redirect to Inquiries view
      router.push('/inquiries');
    } catch (err: any) {
      toast.error(err.message || 'Failed to mark deal closed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-typhoon-sand pb-28">
      {/* 1. Curved Header Matching Screen 6 */}
      <div
        style={{ backgroundColor: theme.hex.headerBg }}
        className="pt-6 pb-12 px-5 rounded-b-[36px] shadow-sm relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 border border-white/5 rounded-full pointer-events-none -mr-16 -mt-16" />
        <div className="absolute top-0 right-0 w-44 h-44 border border-white/5 rounded-full pointer-events-none -mr-8 -mt-8" />

        <div className="max-w-md mx-auto">
          {/* Back button */}
          <button
            type="button"
            onClick={() => router.back()}
            className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition mb-4 cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <h1 className="text-3xl font-serif font-bold text-white tracking-tight">
            Deal closed
          </h1>
          <p className="text-xs text-white/70 mt-1 font-medium">
            {inquiry?.followupId || inquiryId} · {inquiry?.customerName || 'Customer'}
          </p>
        </div>
      </div>

      {/* 2. Body Container Matching Screen 6 */}
      <div className="max-w-md mx-auto px-4 -mt-4 space-y-4">
        <form onSubmit={handleMarkClosed} className="space-y-4">
          {/* Deal status Toggle */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-typhoon-navy block">
              Deal status
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setDealStatus('Open')}
                className={`py-3.5 rounded-2xl text-sm font-bold border transition-all cursor-pointer ${
                  dealStatus === 'Open'
                    ? 'bg-typhoon-navy text-white border-typhoon-navy shadow-soft'
                    : 'bg-white text-typhoon-navy border-typhoon-border hover:bg-typhoon-sand'
                }`}
              >
                Open
              </button>

              <button
                type="button"
                onClick={() => setDealStatus('Closed')}
                className={`py-3.5 rounded-2xl text-sm font-bold border transition-all cursor-pointer ${
                  dealStatus === 'Closed'
                    ? 'bg-typhoon-navy text-white border-typhoon-navy shadow-soft'
                    : 'bg-white text-typhoon-navy border-typhoon-border hover:bg-typhoon-sand'
                }`}
              >
                Closed
              </button>
            </div>
          </div>

          {/* Final deal amount */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-typhoon-navy block">
              Final deal amount
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-4 text-xs font-bold text-typhoon-navy border-r border-typhoon-border pr-2">
                Rs
              </span>
              <input
                type="text"
                value={dealAmount}
                onChange={(e) => setDealAmount(e.target.value.replace(/\D/g, ''))}
                placeholder="2,75,000"
                className="w-full pl-14 pr-4 py-3.5 bg-white rounded-2xl text-sm font-bold text-typhoon-navy border border-typhoon-border focus:border-typhoon-gold focus:outline-none shadow-soft transition"
                required
              />
            </div>
          </div>

          {/* Section: DOCUMENTS */}
          <div className="space-y-2 pt-1">
            <h3 className="text-xs font-bold tracking-widest text-typhoon-muted uppercase px-1">
              DOCUMENTS
            </h3>

            {/* Documents Checklist Card */}
            <div className="bg-white rounded-2xl border border-typhoon-border shadow-soft divide-y divide-typhoon-border/60 overflow-hidden">
              {docs.map((doc, idx) => (
                <div
                  key={doc.id}
                  onClick={() => toggleDoc(idx)}
                  className="p-4 flex items-center justify-between cursor-pointer hover:bg-typhoon-sand/40 transition-colors"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-typhoon-sand flex items-center justify-center text-typhoon-navy flex-shrink-0">
                      <FileText className="w-5 h-5 text-typhoon-navy" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-typhoon-navy">
                        {doc.title}
                      </h4>
                      <p className="text-xs text-typhoon-muted font-medium">
                        {doc.status}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-bold px-3 py-1 rounded-full border ${
                        doc.isDone
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : 'bg-rose-50 text-rose-800 border-rose-200'
                      }`}
                    >
                      {doc.isDone ? 'Done' : 'Pending'}
                    </span>
                    <ChevronRight className="w-4 h-4 text-typhoon-muted" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Secondary Action: Edit and send final quotation */}
          <button
            type="button"
            onClick={() => router.push('/quotations/new')}
            className="w-full py-3.5 px-4 rounded-2xl bg-white hover:bg-typhoon-sand border border-typhoon-border text-typhoon-navy font-bold text-xs shadow-soft flex items-center justify-center gap-2 transition cursor-pointer"
          >
            <FileText className="w-4 h-4 text-typhoon-navy" />
            <span>Edit and send final quotation</span>
          </button>

          {/* Gold Action Button Matching Screen 6 */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 px-6 rounded-2xl bg-typhoon-gold hover:bg-typhoon-gold-dark text-typhoon-navy font-bold text-base shadow-soft flex items-center justify-center gap-2 transition cursor-pointer disabled:opacity-50"
            >
              <Check className="w-5 h-5 stroke-[2.5]" />
              <span>{loading ? 'Closing...' : 'Mark deal closed'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}