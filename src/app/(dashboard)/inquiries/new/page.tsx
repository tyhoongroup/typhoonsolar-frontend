'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Check, Sun, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function AddInquiryPage() {
  const router = useRouter();
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Vadodara');
  const [requestedKw, setRequestedKw] = useState(6.0);
  const [meterPhase, setMeterPhase] = useState<'Single Phase' | 'Three Phase'>('Single Phase');
  const [assignedSalesperson, setAssignedSalesperson] = useState('Amit Patel');
  const [isUrgent, setIsUrgent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // 1. Session Token Guard: Redirect immediately to '/' if not logged in
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    const user = localStorage.getItem('user');

    if (!token || token === 'null' || token === 'undefined' || !user) {
      localStorage.clear();
      toast.error('No login session found. Redirecting to login...');
      router.push('/');
      return;
    }

    setIsCheckingAuth(false);
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Re-verify token exists before submitting
    const token = localStorage.getItem('accessToken');
    if (!token || token === 'null' || token === 'undefined') {
      localStorage.clear();
      toast.error('Session expired. Redirecting to login...');
      router.push('/');
      return;
    }

    // Phone validation
    const cleanPhone = customerPhone.replace(/\D/g, '');
    if (cleanPhone.length !== 10) {
      toast.error('Please enter a valid 10-digit mobile number.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/v1/inquiries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          customerName: customerName.trim(),
          customerPhone: cleanPhone,
          address: address.trim(),
          city: city.trim(),
          requestedKw: Number(requestedKw),
          meterPhase,
          isUrgent,
        }),
      });

      // 2. If backend rejects token (expired or invalid), clear session & redirect to login
      if (res.status === 401) {
        localStorage.clear();
        toast.error('Session expired. Please sign in again.');
        router.push('/');
        return;
      }

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to save inquiry.');
      }

      toast.success(`Inquiry ${data.data?.followupId || 'saved'} created successfully!`);
      router.push('/dashboard');
    } catch (err: any) {
      toast.error(err.message || 'Error saving inquiry.');
    } finally {
      setLoading(false);
    }
  };

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-typhoon-sand flex items-center justify-center text-xs text-typhoon-muted">
        Verifying session...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-typhoon-sand pb-16">
      {/* ======================================================== */}
      {/* 1. TOP HEADER with Salesperson deep royal blue           */}
      {/* ======================================================== */}
      <div
        style={{ backgroundColor: '#0a3d7c' }}
        className="text-white pt-6 pb-8 px-5 lg:px-8 rounded-b-[32px] shadow-soft border-b border-[#124d99]"
      >
        <div className="max-w-3xl mx-auto">
          <button
            onClick={() => router.back()}
            className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white mb-3 hover:bg-white/20 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl lg:text-3xl font-serif font-bold text-white tracking-tight">
                Add New Inquiry
              </h1>
              <p className="text-xs text-white/70 mt-1">
                Enter rooftop solar customer details & requirement
              </p>
            </div>
            <span
              style={{ backgroundColor: '#00a3e0', color: '#ffffff' }}
              className="hidden sm:inline-block text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider"
            >
              Stage 1: Lead Capture
            </span>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. FORM BODY (Centered card on desktop, full on mobile)  */}
      {/* ======================================================== */}
      <div className="max-w-3xl mx-auto px-4 lg:px-6 -mt-3">
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl p-6 lg:p-8 border border-typhoon-border shadow-soft space-y-4"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Customer Name */}
            <div>
              <label className="text-xs font-semibold text-typhoon-navy block mb-1">
                Customer Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Full customer name"
                className="w-full px-4 py-3 bg-typhoon-sand/40 rounded-xl text-xs font-medium text-typhoon-navy border border-typhoon-border focus:border-typhoon-gold focus:outline-none transition"
                required
              />
            </div>

            {/* Phone Number */}
            <div>
              <label className="text-xs font-semibold text-typhoon-navy block mb-1">
                Phone Number <span className="text-rose-500">*</span>
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-3.5 text-xs font-bold text-typhoon-navy border-r border-typhoon-border pr-2">
                  +91
                </span>
                <input
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  placeholder="10-digit mobile number"
                  className="w-full pl-14 pr-4 py-3 bg-typhoon-sand/40 rounded-xl text-xs font-medium text-typhoon-navy border border-typhoon-border focus:border-typhoon-gold focus:outline-none transition"
                  required
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* City */}
            <div>
              <label className="text-xs font-semibold text-typhoon-navy block mb-1">
                City / Region <span className="text-rose-500">*</span>
              </label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-4 py-3 bg-typhoon-sand/40 rounded-xl text-xs font-medium text-typhoon-navy border border-typhoon-border focus:border-typhoon-gold focus:outline-none transition"
              >
                <option value="Vadodara">Vadodara</option>
                <option value="Anand">Anand</option>
                <option value="Nadiad">Nadiad</option>
                <option value="Bharuch">Bharuch</option>
                <option value="Ahmedabad">Ahmedabad</option>
              </select>
            </div>

            {/* Address */}
            <div>
              <label className="text-xs font-semibold text-typhoon-navy block mb-1">
                Society / Area Address <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="e.g. B-42 Shivalik Residency"
                className="w-full px-4 py-3 bg-typhoon-sand/40 rounded-xl text-xs font-medium text-typhoon-navy border border-typhoon-border focus:border-typhoon-gold focus:outline-none transition"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Sizing Capacity */}
            <div>
              <label className="text-xs font-semibold text-typhoon-navy block mb-1">
                Requested Capacity (kW) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                step="0.1"
                min="1"
                max="100"
                value={requestedKw}
                onChange={(e) => setRequestedKw(Number(e.target.value))}
                placeholder="e.g. 6.0"
                className="w-full px-4 py-3 bg-typhoon-sand/40 rounded-xl text-xs font-medium text-typhoon-navy border border-typhoon-border focus:border-typhoon-gold focus:outline-none transition"
                required
              />
              <p className="text-[10px] text-typhoon-muted mt-1">
                PM Surya Ghar subsidy: ₹33k (1 kW), ₹66k (2 kW), ₹78k (3-10 kW)
              </p>
            </div>

            {/* Meter Phase */}
            <div>
              <label className="text-xs font-semibold text-typhoon-navy block mb-1">
                DISCOM Meter Phase <span className="text-rose-500">*</span>
              </label>
              <select
                value={meterPhase}
                onChange={(e) => setMeterPhase(e.target.value as any)}
                className="w-full px-4 py-3 bg-typhoon-sand/40 rounded-xl text-xs font-medium text-typhoon-navy border border-typhoon-border focus:border-typhoon-gold focus:outline-none transition"
              >
                <option value="Single Phase">Single Phase (Up to 6 kW)</option>
                <option value="Three Phase">Three Phase (&gt; 6 kW or heavy load)</option>
              </select>
            </div>
          </div>

          {/* Assign Salesperson Field */}
          <div>
            <label className="text-xs font-semibold text-typhoon-navy block mb-1">
              Assign to Salesperson <span className="text-typhoon-gold font-bold">*</span>
            </label>
            <select
              value={assignedSalesperson}
              onChange={(e) => setAssignedSalesperson(e.target.value)}
              className="w-full px-4 py-3 bg-typhoon-sand/40 rounded-xl text-xs font-medium text-typhoon-navy border border-typhoon-border focus:border-typhoon-gold focus:outline-none transition"
            >
              <option value="Amit Patel">💼 Amit Patel (Sales Rep - Vadodara)</option>
              <option value="Kunal Joshi">💼 Kunal Joshi (Senior Sales Rep - Anand)</option>
              <option value="Priya Sharma">💼 Priya Sharma (Sales Engineer - Nadiad)</option>
            </select>
            <p className="text-[10px] text-typhoon-muted mt-1">
              Assigned rep will get an instant push notification with a 3-day SLA timer to visit or send quotation.
            </p>
          </div>

          {/* Urgent Priority Toggle */}
          <div>
            <label className="text-xs font-semibold text-typhoon-navy block mb-1.5">
              Priority Flag
            </label>
            <div className="grid grid-cols-2 gap-3 max-w-xs">
              <button
                type="button"
                onClick={() => setIsUrgent(true)}
                className={`py-2.5 rounded-xl text-xs font-bold border transition ${
                  isUrgent
                    ? 'bg-rose-600 text-white border-rose-600 shadow-soft'
                    : 'bg-typhoon-sand/40 text-typhoon-navy border-typhoon-border'
                }`}
              >
                🔥 Urgent Lead
              </button>
              <button
                type="button"
                onClick={() => setIsUrgent(false)}
                className={`py-2.5 rounded-xl text-xs font-bold border transition ${
                  !isUrgent
                    ? 'bg-typhoon-navy text-white border-typhoon-navy shadow-soft'
                    : 'bg-typhoon-sand/40 text-typhoon-navy border-typhoon-border'
                }`}
              >
                Standard
              </button>
            </div>
          </div>

          <div className="pt-2 border-t border-typhoon-border/60 flex items-center justify-between text-[11px] text-typhoon-muted">
            <span>A unique Follow-up ID (e.g. F-1025) is automatically created on save.</span>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-5 py-3 rounded-xl text-xs font-bold text-typhoon-muted hover:text-typhoon-navy transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-typhoon-gold hover:bg-typhoon-gold-dark text-typhoon-navy font-bold px-6 py-3 rounded-xl text-xs shadow-soft transition flex items-center gap-2 disabled:opacity-50"
            >
              <Check className="w-4 h-4 stroke-[2.5]" />
              <span>{loading ? 'Creating Inquiry...' : 'Save & Create Inquiry'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
