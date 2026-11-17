'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ChevronLeft, Check, Phone } from 'lucide-react';
import { toast } from 'sonner';
import { useCurrentUser } from '@/lib/use-current-user';

export default function LogCallPage() {
  const router = useRouter();
  const params = useParams();
  const inquiryId = params.id as string;
  const { user, theme } = useCurrentUser();

  const [inquiry, setInquiry] = useState<any>(null);
  const [callResult, setCallResult] = useState<'Call done' | 'Not reachable'>('Call done');
  const [description, setDescription] = useState('Customer wants a site visit this week.');
  const [nextStep, setNextStep] = useState('Salesperson visit');
  const [nextFollowupDate, setNextFollowupDate] = useState('6 November 2026');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      router.push('/');
      return;
    }

    // Default next follow-up date formatted
    const d = new Date();
    d.setDate(d.getDate() + 2);
    setNextFollowupDate(
      d.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    );

    fetch(`/api/v1/inquiries/${inquiryId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        const item = data?.data || data;
        if (item) setInquiry(item);
      })
      .catch(() => {});
  }, [inquiryId, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('accessToken');
    if (!token) {
      toast.error('Session expired. Please sign in again.');
      router.push('/');
      return;
    }

    if (!description.trim()) {
      toast.error('Please enter a description for this call.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`/api/v1/inquiries/${inquiry?.id || inquiryId}/log-call`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          callResult: callResult === 'Call done' ? 'CALL_DONE' : 'NOT_REACHABLE',
          description: description.trim(),
          nextStep: nextStep.trim() || 'Customer follow-up',
          nextFollowupDate,
        }),
      });

      const resData = await res.json();
      if (!res.ok) {
        throw new Error(resData.message || 'Failed to save call update.');
      }

      toast.success('Call update saved successfully!');
      router.push(`/inquiries/${inquiry?.followupId || inquiryId}`);
    } catch (err: any) {
      toast.error(err.message || 'Failed to save call.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-typhoon-sand pb-28">
      {/* 1. Curved Header Matching Screen 5 */}
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
            Log a call
          </h1>
          <p className="text-xs text-white/70 mt-1 font-medium">
            {inquiry?.followupId || inquiryId} · {inquiry?.customerName || 'Customer Lead'}
          </p>
        </div>
      </div>

      {/* 2. Form Body Matching Screen 5 Layout */}
      <div className="max-w-md mx-auto px-4 pt-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Call Result Toggle */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-typhoon-navy block">
              Call result
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setCallResult('Call done')}
                className={`py-3.5 rounded-2xl text-sm font-bold border transition-all cursor-pointer ${
                  callResult === 'Call done'
                    ? 'bg-typhoon-navy text-white border-typhoon-navy shadow-soft'
                    : 'bg-white text-typhoon-navy border-typhoon-border hover:bg-typhoon-sand'
                }`}
              >
                Call done
              </button>

              <button
                type="button"
                onClick={() => setCallResult('Not reachable')}
                className={`py-3.5 rounded-2xl text-sm font-bold border transition-all cursor-pointer ${
                  callResult === 'Not reachable'
                    ? 'bg-typhoon-navy text-white border-typhoon-navy shadow-soft'
                    : 'bg-white text-typhoon-navy border-typhoon-border hover:bg-typhoon-sand'
                }`}
              >
                Not reachable
              </button>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-typhoon-navy block">
              Description
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter remarks or discussion details with customer..."
              className="w-full px-4 py-3.5 bg-white rounded-2xl text-sm font-medium text-typhoon-navy border border-typhoon-border focus:border-typhoon-gold focus:outline-none shadow-soft transition leading-relaxed"
              required
            />
          </div>

          {/* Next step */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-typhoon-navy block">
              Next step
            </label>
            <input
              type="text"
              value={nextStep}
              onChange={(e) => setNextStep(e.target.value)}
              placeholder="e.g. Salesperson visit"
              className="w-full px-4 py-3.5 bg-white rounded-2xl text-sm font-medium text-typhoon-navy border border-typhoon-border focus:border-typhoon-gold focus:outline-none shadow-soft transition"
            />
          </div>

          {/* Next follow-up date */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-typhoon-navy block">
              Next follow-up date
            </label>
            <input
              type="text"
              value={nextFollowupDate}
              onChange={(e) => setNextFollowupDate(e.target.value)}
              placeholder="e.g. 6 November 2026"
              className="w-full px-4 py-3.5 bg-white rounded-2xl text-sm font-medium text-typhoon-navy border border-typhoon-border focus:border-typhoon-gold focus:outline-none shadow-soft transition"
            />
          </div>

          {/* Gold Action Button Matching Screen 5 */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 px-6 rounded-2xl bg-typhoon-gold hover:bg-typhoon-gold-dark text-typhoon-navy font-bold text-base shadow-soft flex items-center justify-center gap-2 transition cursor-pointer disabled:opacity-50"
            >
              <Check className="w-5 h-5 stroke-[2.5]" />
              <span>{loading ? 'Saving...' : 'Save call update'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}