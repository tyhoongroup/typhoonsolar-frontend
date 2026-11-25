'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ChevronLeft, User, Send, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import { useCurrentUser } from '@/lib/use-current-user';

export default function AssignSalespersonPage() {
  const router = useRouter();
  const params = useParams();
  const inquiryId = params.id as string;
  const { user, theme } = useCurrentUser();

  const [inquiry, setInquiry] = useState<any>(null);
  const [availableInquiries, setAvailableInquiries] = useState<any[]>([]);
  const [structureType, setStructureType] = useState<'Residential' | 'Commercial' | 'Common'>('Residential');
  const [salespersons, setSalespersons] = useState<Array<{ id: string; fullName: string; phone: string; openLeads: number }>>([
    { id: '9000000002', fullName: 'Amit', phone: '+91 90000 00002', openLeads: 2 },
    { id: '9000000007', fullName: 'Kunal', phone: '+91 90000 00007', openLeads: 4 },
    { id: 'priya-sales', fullName: 'Priya', phone: '+91 90000 00004', openLeads: 1 },
  ]);
  const [selectedSalespersonId, setSelectedSalespersonId] = useState('9000000002');
  const [dueDays, setDueDays] = useState(3);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // Calculate formatted due date
  const getFormattedDueDate = (days: number) => {
    const d = new Date();
    d.setDate(d.getDate() + Number(days || 3));
    return d.toLocaleDateString('en-GB', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const [dueDateText, setDueDateText] = useState(getFormattedDueDate(3));

  useEffect(() => {
    setDueDateText(getFormattedDueDate(dueDays));
  }, [dueDays]);

  // Load inquiry details, all public inquiries and active salespersons
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      router.push('/');
      return;
    }

    // 1. Fetch current target inquiry
    fetch(`/api/v1/inquiries/${inquiryId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        const item = data?.data || data;
        if (item) {
          setInquiry(item);
          if (item.assignedSalespersonId) {
            setSelectedSalespersonId(item.assignedSalespersonId);
          }
        }
      })
      .catch(() => {})
      .finally(() => setFetching(false));

    // 2. Fetch all inquiries so Ops Manager can switch between public inquiries
    fetch('/api/v1/inquiries', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        const list = Array.isArray(data) ? data : (data?.data || []);
        if (Array.isArray(list)) {
          setAvailableInquiries(list);
        }
      })
      .catch(() => {});

    // 3. Fetch salespersons
    fetch('/api/v1/inquiries/salespersons', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        const list = Array.isArray(data) ? data : (data?.data || []);
        if (Array.isArray(list) && list.length > 0) {
          setSalespersons(
            list.map((sp: any, idx: number) => ({
              id: sp.id,
              fullName: sp.fullName.replace(/\s*\(Salesperson\)/i, ''),
              phone: sp.phone,
              openLeads: idx === 0 ? 2 : idx === 1 ? 4 : 1,
            }))
          );
        }
      })
      .catch(() => {});
  }, [inquiryId, router]);

  const handleSelectDifferentInquiry = (newId: string) => {
    const found = availableInquiries.find((i) => (i.followupId || i.id) === newId);
    if (found) {
      setInquiry(found);
      router.replace(`/inquiries/${found.followupId || found.id}/assign`);
    }
  };

  const handleAssign = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('accessToken');
    if (!token) {
      toast.error('Session expired. Please sign in again.');
      router.push('/');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`/api/v1/inquiries/${inquiry?.followupId || inquiryId}/assign`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          salespersonId: selectedSalespersonId,
          dueDays: Number(dueDays) || 3,
          structureType,
        }),
      });

      const resData = await res.json();
      if (!res.ok) {
        throw new Error(resData.message || 'Failed to assign salesperson.');
      }

      const assignedSp = salespersons.find((s) => s.id === selectedSalespersonId);
      toast.success(
        `Lead assigned to ${assignedSp?.fullName || 'Salesperson'}! Notification sent.`
      );

      // Redirect to Inquiry Detail (Screen 4)
      router.push(`/inquiries/${inquiry?.followupId || inquiryId}`);
    } catch (err: any) {
      toast.error(err.message || 'Failed to assign salesperson.');
    } finally {
      setLoading(false);
    }
  };

  const headerText = theme.hex.headerTextColor || '#ffffff';
  const headerSubtext = theme.hex.headerSubtextColor || 'rgba(255, 255, 255, 0.7)';
  const isLightHeader = headerText !== '#ffffff';
  const logoSrc = theme.hex.logoSrc || (isLightHeader ? '/images/typhoon-logo-dark.png' : '/images/typhoon-logo-white.png');

  return (
    <div className="min-h-screen bg-typhoon-sand pb-28">
      {/* 1. Curved Header with Role Theme Colors (Screen 3) */}
      <div
        style={{
          background: theme.hex.headerGradient || theme.hex.headerBg,
          color: headerText,
          boxShadow: isLightHeader
            ? '0 10px 30px -5px rgba(0, 0, 0, 0.12)'
            : '0 10px 30px -5px rgba(0, 0, 0, 0.25)',
        }}
        className="pt-6 pb-8 px-5 rounded-b-[32px] shadow-soft relative overflow-hidden"
      >
        <div
          className={`absolute top-0 right-0 w-64 h-64 border rounded-full pointer-events-none -mr-16 -mt-16 ${
            isLightHeader ? 'border-black/5' : 'border-white/5'
          }`}
        />
        <div
          className={`absolute top-0 right-0 w-44 h-44 border rounded-full pointer-events-none -mr-8 -mt-8 ${
            isLightHeader ? 'border-black/10' : 'border-white/10'
          }`}
        />

        <div className="max-w-md mx-auto">
          {/* Top Bar with Back button and Big Logo */}
          <div className="flex items-center justify-between mb-3">
            <button
              type="button"
              onClick={() => router.back()}
              style={{
                color: headerText,
                backgroundColor: isLightHeader ? 'rgba(30, 31, 36, 0.08)' : 'rgba(255, 255, 255, 0.1)',
              }}
              className="w-10 h-10 rounded-full flex items-center justify-center transition cursor-pointer hover:opacity-85"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <img
              src={logoSrc}
              alt="Typhoon Solar"
              className="h-12 sm:h-14 w-auto object-contain filter drop-shadow-sm"
            />
          </div>

          <h1 style={{ color: headerText }} className="text-3xl font-serif font-bold tracking-tight">
            Assign salesperson
          </h1>
          <p style={{ color: headerSubtext }} className="text-xs mt-1 font-medium">
            {inquiry?.followupId || inquiryId} · {inquiry?.customerName || 'Customer Lead'}
          </p>
        </div>
      </div>

      {/* 2. Body Container (Positive Margin - Completely Clear of Header Curve) */}
      <div className="max-w-md mx-auto px-4 pt-4 space-y-4">
        {/* Public Inquiry Switcher (Ops Manager can pick any inquiry) */}
        {availableInquiries.length > 1 && (
          <div className="bg-white rounded-2xl p-4 border border-typhoon-border shadow-soft space-y-2">
            <span className="text-xs font-bold text-typhoon-navy block">
              Select Public Inquiry / Lead
            </span>
            <select
              value={inquiry?.followupId || inquiry?.id || inquiryId}
              onChange={(e) => handleSelectDifferentInquiry(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-typhoon-sand/40 border border-typhoon-border rounded-xl text-xs font-bold text-typhoon-navy focus:outline-none focus:border-[#6366F1]"
            >
              {availableInquiries.map((inqItem) => (
                <option key={inqItem.id} value={inqItem.followupId || inqItem.id}>
                  {inqItem.followupId || inqItem.id} · {inqItem.customerName} ({inqItem.requestedKw} kW · {inqItem.city || 'Vadodara'})
                  {!inqItem.assignedSalespersonId ? ' [Unassigned]' : ''}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* 3 Structure Type Buttons (Residential, Commercial, Common) */}
        <div className="bg-white rounded-2xl p-4 border border-typhoon-border shadow-soft space-y-2">
          <span className="text-xs font-bold text-typhoon-navy block">
            Project Category / Structure Type
          </span>
          <div className="grid grid-cols-3 gap-2">
            {(['Residential', 'Commercial', 'Common'] as const).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setStructureType(type)}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition text-center border cursor-pointer ${
                  structureType === type
                    ? 'bg-[#6366F1] text-white border-[#6366F1] shadow-xs'
                    : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Requirement & Address Summary Card */}
        <div className="bg-white rounded-2xl p-5 border border-typhoon-border shadow-soft space-y-3">
          <div className="flex justify-between items-center text-xs">
            <span className="text-typhoon-muted font-medium">Customer</span>
            <span className="font-bold text-typhoon-navy text-sm">
              {inquiry?.customerName || 'Customer'}
            </span>
          </div>
          <div className="border-t border-typhoon-border/60 pt-3 flex justify-between items-center text-xs">
            <span className="text-typhoon-muted font-medium">Requirement</span>
            <span className="font-bold text-typhoon-navy text-sm">
              {inquiry?.requestedKw || 6.0} kW, {inquiry?.meterPhase || 'Single Phase'}
            </span>
          </div>
          <div className="border-t border-typhoon-border/60 pt-3 flex justify-between items-center text-xs">
            <span className="text-typhoon-muted font-medium">Address</span>
            <span className="font-bold text-typhoon-navy text-sm">
              {inquiry?.city || inquiry?.address || 'Vadodara'}
            </span>
          </div>
        </div>

        {/* Section: CHOOSE SALESPERSON */}
        <form onSubmit={handleAssign} className="space-y-4">
          <div className="space-y-2">
            <h3 className="text-xs font-bold tracking-widest text-typhoon-muted uppercase px-1">
              CHOOSE SALESPERSON
            </h3>

            {/* Salesperson List Card */}
            <div className="bg-white rounded-2xl border border-typhoon-border shadow-soft divide-y divide-typhoon-border/60 overflow-hidden">
              {salespersons.map((sp) => {
                const isSelected = sp.id === selectedSalespersonId;
                return (
                  <div
                    key={sp.id}
                    onClick={() => setSelectedSalespersonId(sp.id)}
                    className="p-4 flex items-center justify-between cursor-pointer hover:bg-typhoon-sand/40 transition-colors"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-xl bg-typhoon-sand flex items-center justify-center text-typhoon-navy flex-shrink-0">
                        <User className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-typhoon-navy">
                          {sp.fullName}
                        </h4>
                        <p className="text-xs text-typhoon-muted font-medium">
                          {sp.openLeads} leads open
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {isSelected && (
                        <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                          Selected
                        </span>
                      )}
                      <ChevronRight className="w-4 h-4 text-typhoon-muted" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Days to quote and visit */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-typhoon-navy block">
              Days to quote and visit
            </label>
            <input
              type="number"
              min={1}
              max={30}
              value={dueDays}
              onChange={(e) => setDueDays(Number(e.target.value))}
              className="w-full px-4 py-3.5 bg-white rounded-2xl text-sm font-bold text-typhoon-navy border border-typhoon-border focus:border-typhoon-gold focus:outline-none shadow-soft transition"
              required
            />
          </div>

          {/* Due date display */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-typhoon-navy block">
              Due date
            </label>
            <input
              type="text"
              value={dueDateText}
              onChange={(e) => setDueDateText(e.target.value)}
              className="w-full px-4 py-3.5 bg-white rounded-2xl text-sm font-medium text-typhoon-navy border border-typhoon-border focus:border-typhoon-gold focus:outline-none shadow-soft transition"
            />
          </div>

          {/* Notification subtext */}
          <p className="text-[11px] text-typhoon-muted pt-1">
            The salesperson is notified and the date is added to your tracker.
          </p>

          {/* Primary Action Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              style={{
                background: theme.hex.accentGradient || theme.hex.accentBg,
                color: theme.hex.accentTextColor,
                boxShadow: theme.hex.accentShadow || '0 8px 24px -4px rgba(36, 72, 255, 0.4)',
              }}
              className="w-full py-4 px-6 rounded-2xl font-bold text-base flex items-center justify-center gap-2 transition hover:opacity-95 active:scale-98 cursor-pointer disabled:opacity-50"
            >
              <Send className="w-5 h-5 text-white" />
              <span>{loading ? 'Assigning...' : 'Assign and notify'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}