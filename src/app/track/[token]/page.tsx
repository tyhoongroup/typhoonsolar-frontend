'use client';

import React, { useState, useEffect } from 'react';
import { Star, CheckCircle, Clock, Send, X, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function CustomerTrackPage({ params }: { params: { token: string } }) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [selectedTags, setSelectedTags] = useState<string[]>(['Good support', 'Clean work']);
  const [comments, setComments] = useState('Team was on time and very helpful.');

  useEffect(() => {
    async function loadTracker() {
      try {
        const res = await fetch(`/api/v1/public/track/${params.token}`);
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch (err) {
        // silent fallback
      } finally {
        setLoading(false);
      }
    }
    loadTracker();
  }, [params.token]);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  };

  const handleSubmitFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/v1/public/feedback/${params.token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rating,
          tags: selectedTags,
          comments,
        }),
      });
      if (!res.ok) throw new Error('Failed to submit feedback');
      toast.success('Thank you! Your feedback has been submitted.');
      setIsFeedbackOpen(false);
    } catch (err: any) {
      toast.error(err.message || 'Error submitting feedback');
    }
  };

  const stageNum = data?.stageNumber || 3;
  const paidAmount = data ? Number(data.totalPaid || 0) : 160000;
  const pendingAmount = data ? Number(data.totalPending || 0) : 100000;
  const activeQuery = data?.activeQuery || null;
  const salesPhone = data?.salespersonPhone || '9000000002';
  const salesName = data?.salespersonName || 'Amit (Sales Rep)';

  return (
    <div className="min-h-screen bg-typhoon-sand max-w-md mx-auto shadow-2xl pb-16">
      {/* Forest Emerald Header Block (Screen 8) */}
      <div className="bg-[#064e3b] text-white pt-10 pb-16 px-6 rounded-b-[36px] relative shadow-soft">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-full border border-[#10b981]/50 bg-white/10 text-[#34d399] font-bold text-xs flex items-center justify-center">
            TS
          </div>
          <span className="text-[11px] font-bold tracking-widest text-[#34d399] uppercase">
            TYPHOON SOLAR
          </span>
        </div>

        <h1 className="text-3xl font-serif font-bold text-white tracking-tight">
          {data?.customerName ? `${data.customerName}'s Solar Project` : 'Your solar project'}
        </h1>
        <p className="text-xs text-white/70 mt-1">
          {data ? `${data.requestedKw} kW (${data.meterPhase}) · ${data.city}` : 'Public tracking link · no login'}
        </p>
      </div>

      {/* Summary Tiles: Paid vs Pending (Screen 11) */}
      <div className="relative -mt-10 px-5 grid grid-cols-2 gap-3 z-10">
        <div className="bg-white rounded-2xl p-4 shadow-soft border border-typhoon-border">
          <span className="text-xl font-bold font-serif text-emerald-700 block">
            ₹{paidAmount.toLocaleString('en-IN')}
          </span>
          <span className="text-xs text-typhoon-muted font-medium">Paid</span>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-soft border border-typhoon-border">
          <span className="text-xl font-bold font-serif text-amber-700 block">
            ₹{pendingAmount.toLocaleString('en-IN')}
          </span>
          <span className="text-xs text-typhoon-muted font-medium">Pending</span>
        </div>
      </div>

      <div className="px-5 py-5 space-y-4">
        {/* Document Query Alert Banner (Visible when Portal User flags a defect) */}
        {activeQuery && (
          <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 flex items-start gap-3 shadow-soft animate-in fade-in">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <span className="text-xs font-bold text-rose-800 block">
                Action Required: Document Query from Government Portal
              </span>
              <p className="text-xs text-rose-700 mt-0.5 leading-relaxed">
                "{activeQuery}"
              </p>
              <a
                href={`https://wa.me/91${salesPhone}?text=${encodeURIComponent(`Namaste ${salesName}, regarding query "${activeQuery}": sending updated document.`)}`}
                target="_blank"
                rel="noreferrer"
                className="text-xs font-bold text-rose-800 hover:text-rose-900 underline mt-1.5 inline-block"
              >
                Send document on WhatsApp to {salesName} →
              </a>
            </div>
          </div>
        )}

        {/* Stage Progress Bar */}
        <div className="bg-white rounded-2xl p-4 border border-typhoon-border shadow-soft">
          <div className="flex justify-between text-xs font-bold text-typhoon-navy mb-2">
            <span>Project progress</span>
            <span className="text-typhoon-gold">Stage {stageNum} of 10</span>
          </div>
          <div className="w-full bg-typhoon-sand h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-typhoon-gold h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(stageNum * 10, 100)}%` }}
            />
          </div>
        </div>

        {/* Priority Card: Active Stage (Screen 11, 42) */}
        <div className="bg-typhoon-navy text-white rounded-2xl p-4 shadow-soft flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold tracking-widest text-typhoon-gold uppercase block mb-0.5">
              CURRENT STAGE
            </span>
            <h3 className="text-sm font-bold text-white">
              3 · Material planning
            </h3>
            <p className="text-xs text-white/60 mt-0.5">DISCOM SR approved · Staging in warehouse</p>
          </div>

          <span className="bg-typhoon-gold text-typhoon-navy text-xs font-bold px-3 py-1 rounded-full">
            In progress
          </span>
        </div>

        {/* 10-Stage Linear Checklist */}
        <div className="bg-white rounded-2xl p-4 border border-typhoon-border shadow-soft space-y-2.5">
          <h4 className="text-[10px] font-bold tracking-widest text-typhoon-muted uppercase mb-1">
            THE 10 ROOFTOP LIFECYCLE STAGES
          </h4>

          {[
            { stage: 1, title: 'Application status', subtitle: 'Inquiry & site survey completed', status: 'Done', color: 'text-emerald-600', icon: 'done' },
            { stage: 2, title: 'Documents verification & SR No', subtitle: 'SR-GUJ-2026-98124 approved by DISCOM', status: 'Done', color: 'text-emerald-600', icon: 'done' },
            { stage: 3, title: 'Material planning', subtitle: '12x 550W panels staged for delivery', status: 'Active', color: 'text-typhoon-gold font-bold', icon: 'active' },
            { stage: 4, title: 'Installation', subtitle: 'Structure assembly & array wiring', status: 'Next', color: 'text-amber-600', icon: 'next' },
            { stage: 5, title: 'Meter file', subtitle: 'CEI testing & safety filing', status: 'Later', color: 'text-typhoon-muted', icon: 'later' },
            { stage: 6, title: 'System start', subtitle: 'Net meter installation & solar generation', status: 'Later', color: 'text-typhoon-muted', icon: 'later' },
            { stage: 7, title: 'Subsidy claim', subtitle: 'PM Surya Ghar national portal claim', status: 'Later', color: 'text-typhoon-muted', icon: 'later' },
            { stage: 8, title: 'Subsidy received', subtitle: '₹78,000 credited to bank account', status: 'Later', color: 'text-typhoon-muted', icon: 'later' },
            { stage: 9, title: 'Bill filed and delivered', subtitle: 'Handover kit & warranty documents', status: 'Later', color: 'text-typhoon-muted', icon: 'later' },
            { stage: 10, title: 'Feedback', subtitle: 'Customer satisfaction & review', status: 'Later', color: 'text-typhoon-muted', icon: 'later' },
          ].map((s) => (
            <div key={s.stage} className="flex items-center justify-between py-1.5 border-b border-typhoon-border/40 last:border-none">
              <div className="flex items-center gap-2.5">
                {s.icon === 'done' ? (
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : s.icon === 'active' ? (
                  <Clock className="w-4 h-4 text-typhoon-gold shrink-0 animate-pulse" />
                ) : (
                  <Clock className="w-4 h-4 text-typhoon-muted shrink-0" />
                )}
                <div>
                  <p className="text-xs font-bold text-typhoon-navy">{s.stage} · {s.title}</p>
                  <p className="text-[10px] text-typhoon-muted">{s.subtitle}</p>
                </div>
              </div>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  s.status === 'Done'
                    ? 'bg-emerald-50 text-emerald-700'
                    : s.status === 'Active'
                    ? 'bg-amber-50 text-amber-700 border border-amber-200'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                {s.status}
              </span>
            </div>
          ))}
        </div>

        {/* Give Feedback Emerald Button (Screen 8) */}
        <div className="pt-2">
          <button
            onClick={() => setIsFeedbackOpen(true)}
            className="w-full py-4 bg-[#10b981] hover:bg-[#059669] text-white font-bold text-sm rounded-2xl shadow-soft flex items-center justify-center gap-2 transition-all"
          >
            <Star className="w-4 h-4 fill-white text-white" />
            <span>Give feedback</span>
          </button>
        </div>
      </div>

      {/* Slide-Up Feedback Bottom Sheet (Screen 44) */}
      {isFeedbackOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-typhoon-sand w-full max-w-md rounded-t-[32px] p-6 shadow-floating border-t border-typhoon-border animate-in slide-in-from-bottom">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-lg font-serif font-bold text-typhoon-navy">
                  Feedback
                </h3>
                <p className="text-xs text-typhoon-muted">Tell us about your experience</p>
              </div>
              <button
                onClick={() => setIsFeedbackOpen(false)}
                className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-typhoon-muted hover:text-typhoon-navy"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitFeedback} className="space-y-4">
              {/* Star Rating Selection */}
              <div className="flex justify-center gap-3 py-2">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setRating(s)}
                    className="p-1 transition-transform active:scale-125"
                  >
                    <Star
                      className={`w-8 h-8 ${
                        s <= rating
                          ? 'text-typhoon-gold fill-typhoon-gold'
                          : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
              </div>

              {/* Tag Chips */}
              <div>
                <label className="text-xs font-semibold text-typhoon-navy block mb-2">
                  What did you like?
                </label>
                <div className="flex flex-wrap gap-2">
                  {['On time', 'Good support', 'Clean work', 'Fast meter start'].map((t) => {
                    const isSelected = selectedTags.includes(t);
                    return (
                      <button
                        key={t}
                        type="button"
                        onClick={() => toggleTag(t)}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                          isSelected
                            ? 'bg-typhoon-navy text-white border-typhoon-navy'
                            : 'bg-white text-typhoon-navy border-typhoon-border'
                        }`}
                      >
                        {t}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-typhoon-navy block mb-1">
                  Comments
                </label>
                <textarea
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 bg-white rounded-xl text-xs font-medium text-typhoon-navy border border-typhoon-border focus:border-typhoon-gold focus:outline-none"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-typhoon-gold hover:bg-typhoon-gold-light text-typhoon-navy font-bold text-xs rounded-xl shadow-soft flex items-center justify-center gap-2"
              >
                <Star className="w-4 h-4" />
                <span>Submit feedback</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

