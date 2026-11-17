'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  ChevronLeft,
  Check,
  MapPin,
  Calendar,
  CheckCircle2,
  FileText,
  AlertCircle,
  Home,
  Zap,
} from 'lucide-react';
import { toast } from 'sonner';
import { useCurrentUser } from '@/lib/use-current-user';

export default function SiteVisitPage() {
  const router = useRouter();
  const params = useParams();
  const inquiryId = params.id as string;
  const { user, theme } = useCurrentUser();

  const [inquiry, setInquiry] = useState<any>(null);
  const [roofAreaChecked, setRoofAreaChecked] = useState(true);
  const [meterWiringSeen, setMeterWiringSeen] = useState(true);
  const [roofType, setRoofType] = useState<'RCC Flat Terrace' | 'Tin Shed' | 'Elevated'>('RCC Flat Terrace');
  const [description, setDescription] = useState(
    'Terrace has south-facing shadow-free area of 500 sq.ft. Meter wiring & earthing space verified.'
  );
  const [nextStep, setNextStep] = useState('Prepare solar quotation & sizing');
  const [nextFollowupDate, setNextFollowupDate] = useState('7 November 2026');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      router.push('/');
      return;
    }

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
      toast.error('Please enter observations or notes from the site visit.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`/api/v1/inquiries/${inquiry?.id || inquiryId}/site-visit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          roofAreaChecked,
          meterWiringSeen,
          notes: `${roofType} - ${description.trim()}`,
          photos: [],
          nextStep: nextStep.trim() || 'Send quotation',
          nextFollowupDate,
        }),
      });

      const resData = await res.json();
      if (!res.ok) {
        throw new Error(resData.message || 'Failed to record site visit.');
      }

      toast.success('Site visit recorded successfully! Proceed to quotation.');
      router.push(`/inquiries/${inquiry?.followupId || inquiryId}`);
    } catch (err: any) {
      toast.error(err.message || 'Failed to save site visit update.');
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
            Site visit done
          </h1>
          <p className="text-xs text-white/70 mt-1 font-medium">
            {inquiry?.followupId || inquiryId} · {inquiry?.customerName || 'Customer Lead'}
          </p>
        </div>
      </div>

      {/* 2. Form Body Matching Mobile Screen Layout */}
      <div className="max-w-md mx-auto px-4 pt-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Roof Type Selection */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-typhoon-navy block">
              Roof structure type
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['RCC Flat Terrace', 'Tin Shed', 'Elevated'] as const).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setRoofType(type)}
                  className={`py-3 px-2 rounded-2xl text-xs font-bold border transition-all text-center cursor-pointer ${
                    roofType === type
                      ? 'bg-typhoon-navy text-white border-typhoon-navy shadow-soft'
                      : 'bg-white text-typhoon-navy border-typhoon-border hover:bg-typhoon-sand'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Verification Checks */}
          <div className="bg-white rounded-2xl p-4 border border-typhoon-border shadow-soft space-y-3">
            <span className="text-[10px] font-bold tracking-widest text-typhoon-muted uppercase block">
              TECHNICAL VERIFICATION
            </span>

            {/* Check 1: Roof Area */}
            <div className="flex items-center justify-between py-1">
              <div className="flex items-center gap-2.5">
                <Home className="w-4 h-4 text-typhoon-navy" />
                <div>
                  <h4 className="text-xs font-bold text-typhoon-navy">Roof shadow-free area</h4>
                  <p className="text-[11px] text-typhoon-muted">Terrace space fits requested kW</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setRoofAreaChecked(!roofAreaChecked)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all cursor-pointer ${
                  roofAreaChecked
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                    : 'bg-rose-50 text-rose-800 border-rose-300'
                }`}
              >
                {roofAreaChecked ? 'Verified' : 'Pending'}
              </button>
            </div>

            {/* Check 2: Meter Wiring */}
            <div className="flex items-center justify-between py-1 border-t border-typhoon-border/60">
              <div className="flex items-center gap-2.5">
                <Zap className="w-4 h-4 text-typhoon-navy" />
                <div>
                  <h4 className="text-xs font-bold text-typhoon-navy">DISCOM meter & wiring</h4>
                  <p className="text-[11px] text-typhoon-muted">Consumer number & meter location</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setMeterWiringSeen(!meterWiringSeen)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all cursor-pointer ${
                  meterWiringSeen
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                    : 'bg-rose-50 text-rose-800 border-rose-300'
                }`}
              >
                {meterWiringSeen ? 'Verified' : 'Pending'}
              </button>
            </div>
          </div>

          {/* Description Notes */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-typhoon-navy block">
              Site visit description & notes
            </label>
            <div className="bg-white rounded-2xl border border-typhoon-border shadow-soft p-3 focus-within:ring-2 focus-within:ring-typhoon-gold">
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full text-sm text-typhoon-navy outline-none resize-none bg-transparent"
                placeholder="Enter shadow conditions, cable length, structural points..."
              />
            </div>
          </div>

          {/* Next Step */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-typhoon-navy block">
              Next step
            </label>
            <div className="bg-white rounded-2xl border border-typhoon-border shadow-soft px-4 py-3 focus-within:ring-2 focus-within:ring-typhoon-gold">
              <input
                type="text"
                value={nextStep}
                onChange={(e) => setNextStep(e.target.value)}
                className="w-full text-sm font-medium text-typhoon-navy outline-none bg-transparent"
                placeholder="e.g. Prepare quotation breakdown"
              />
            </div>
          </div>

          {/* Next Follow-up Date */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-typhoon-navy block">
              Next follow-up date
            </label>
            <div className="bg-white rounded-2xl border border-typhoon-border shadow-soft px-4 py-3 flex items-center justify-between focus-within:ring-2 focus-within:ring-typhoon-gold">
              <input
                type="text"
                value={nextFollowupDate}
                onChange={(e) => setNextFollowupDate(e.target.value)}
                className="text-sm font-medium text-typhoon-navy outline-none bg-transparent w-full"
                placeholder="e.g. 7 November 2026"
              />
              <Calendar className="w-4 h-4 text-typhoon-muted flex-shrink-0 ml-2" />
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              style={{
                backgroundColor: theme.hex.accentBg,
                color: theme.hex.accentTextColor,
              }}
              className="w-full py-4 px-6 rounded-2xl font-bold text-sm shadow-soft flex items-center justify-center gap-2 transition hover:opacity-95 active:scale-98 disabled:opacity-50 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{loading ? 'Saving...' : 'Save site visit update'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
