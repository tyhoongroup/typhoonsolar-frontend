'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Check } from 'lucide-react';
import { toast } from 'sonner';
import { useCurrentUser } from '@/lib/use-current-user';

export default function AddInquiryPage() {
  const router = useRouter();
  const { user, theme } = useCurrentUser();

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [pincode, setPincode] = useState('390001');
  const [state, setState] = useState('Gujarat');
  const [city, setCity] = useState('Vadodara');
  const [requestedKw, setRequestedKw] = useState('6.0');
  const [meterPhase, setMeterPhase] = useState<'Single Phase' | 'Three Phase'>('Single Phase');
  const [isUrgent, setIsUrgent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token || token === 'null' || token === 'undefined') {
      localStorage.clear();
      router.push('/');
      return;
    }
    setIsCheckingAuth(false);
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem('accessToken');
    if (!token) {
      toast.error('Session expired. Please sign in again.');
      router.push('/');
      return;
    }

    const cleanPhone = customerPhone.replace(/\D/g, '');
    if (cleanPhone.length !== 10) {
      toast.error('Please enter a valid 10-digit mobile number.');
      return;
    }

    if (!customerName.trim() || !address.trim()) {
      toast.error('Please fill in customer name and address.');
      return;
    }

    setLoading(true);

    try {
      const fullAddress = `${address.trim()}, ${city}, ${state} - ${pincode}`;
      const res = await fetch('/api/v1/inquiries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          customerName: customerName.trim(),
          customerPhone: cleanPhone,
          email: email.trim() || undefined,
          address: fullAddress,
          city: city.trim(),
          pincode: pincode.trim(),
          state: state.trim(),
          requestedKw: Number(requestedKw) || 6.0,
          meterPhase,
          isUrgent,
        }),
      });

      if (res.status === 401) {
        localStorage.clear();
        toast.error('Session expired. Please sign in again.');
        router.push('/');
        return;
      }

      const resData = await res.json();
      if (!res.ok) {
        throw new Error(resData.message || 'Failed to save inquiry.');
      }

      const inq = resData.data || resData;
      const targetId = inq.followupId || inq.id;
      toast.success(`Inquiry ${targetId} created! Moving to salesperson assignment.`);

      // Direct transition to Assign Salesperson page (Screen 3)
      router.push(`/inquiries/${targetId}/assign`);
    } catch (err: any) {
      toast.error(err.message || 'Error saving inquiry.');
    } finally {
      setLoading(false);
    }
  };

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-typhoon-sand flex items-center justify-center text-xs text-typhoon-muted font-medium">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-typhoon-sand pb-28">
      {/* 1. Curved Header Matching Screen 2 */}
      <div
        style={{ backgroundColor: theme.hex.headerBg }}
        className="pt-6 pb-12 px-5 rounded-b-[36px] shadow-sm relative overflow-hidden"
      >
        {/* Subtle circular background watermark */}
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
            Add inquiry
          </h1>
          <p className="text-xs text-white/70 mt-1 font-medium">
            Enter the new requirement
          </p>
        </div>
      </div>

      {/* 2. Form Body Matching Screen 2 Layout */}
      <div className="max-w-md mx-auto px-4 -mt-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Customer Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-typhoon-navy block">
              Customer name
            </label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Full name"
              className="w-full px-4 py-3.5 bg-white rounded-2xl text-sm font-medium text-typhoon-navy border border-typhoon-border focus:border-typhoon-gold focus:outline-none shadow-soft transition"
              required
            />
          </div>

          {/* Phone Number */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-typhoon-navy block">
              Phone number
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-4 text-xs font-bold text-typhoon-navy border-r border-typhoon-border pr-2">
                +91
              </span>
              <input
                type="tel"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                placeholder="10-digit number"
                className="w-full pl-16 pr-4 py-3.5 bg-white rounded-2xl text-sm font-medium text-typhoon-navy border border-typhoon-border focus:border-typhoon-gold focus:outline-none shadow-soft transition"
                required
              />
            </div>
          </div>

          {/* Email (Optional) */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-typhoon-navy block">
              Email (optional)
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="customer@example.com"
              className="w-full px-4 py-3.5 bg-white rounded-2xl text-sm font-medium text-typhoon-navy border border-typhoon-border focus:border-typhoon-gold focus:outline-none shadow-soft transition"
            />
          </div>

          {/* Address */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-typhoon-navy block">
              Address
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Village or city, area"
              className="w-full px-4 py-3.5 bg-white rounded-2xl text-sm font-medium text-typhoon-navy border border-typhoon-border focus:border-typhoon-gold focus:outline-none shadow-soft transition"
              required
            />
          </div>

          {/* State, City & Pincode Dropdowns */}
          <div className="grid grid-cols-3 gap-2">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-typhoon-navy block">
                State
              </label>
              <select
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full px-2.5 py-3.5 bg-white rounded-2xl text-xs font-bold text-typhoon-navy border border-typhoon-border focus:border-typhoon-gold focus:outline-none shadow-soft transition"
              >
                <option value="Gujarat">Gujarat</option>
                <option value="Maharashtra">Maharashtra</option>
                <option value="Rajasthan">Rajasthan</option>
                <option value="Madhya Pradesh">Madhya Pradesh</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-typhoon-navy block">
                City
              </label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-2.5 py-3.5 bg-white rounded-2xl text-xs font-bold text-typhoon-navy border border-typhoon-border focus:border-typhoon-gold focus:outline-none shadow-soft transition"
              >
                <option value="Vadodara">Vadodara</option>
                <option value="Anand">Anand</option>
                <option value="Nadiad">Nadiad</option>
                <option value="Bharuch">Bharuch</option>
                <option value="Ahmedabad">Ahmedabad</option>
                <option value="Surat">Surat</option>
                <option value="Gandhinagar">Gandhinagar</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-typhoon-navy block">
                Pincode
              </label>
              <input
                type="text"
                value={pincode}
                onChange={(e) => setPincode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="390001"
                className="w-full px-2.5 py-3.5 bg-white rounded-2xl text-xs font-bold text-typhoon-navy border border-typhoon-border focus:border-typhoon-gold focus:outline-none shadow-soft transition"
              />
            </div>
          </div>

          {/* Requirement (kW Capacity & Phase Dropdowns) */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-typhoon-navy block">
              Requirement
            </label>
            <div className="grid grid-cols-2 gap-2">
              <select
                value={requestedKw}
                onChange={(e) => setRequestedKw(e.target.value)}
                className="w-full px-4 py-3.5 bg-white rounded-2xl text-sm font-bold text-typhoon-navy border border-typhoon-border focus:border-typhoon-gold focus:outline-none shadow-soft transition"
              >
                <option value="3.0">3.0 kW</option>
                <option value="3.24">3.24 kW</option>
                <option value="4.0">4.0 kW</option>
                <option value="5.0">5.0 kW</option>
                <option value="6.0">6.0 kW</option>
                <option value="7.0">7.0 kW</option>
                <option value="8.0">8.0 kW</option>
                <option value="10.0">10.0 kW</option>
                <option value="12.0">12.0 kW</option>
                <option value="15.0">15.0 kW</option>
              </select>

              <select
                value={meterPhase}
                onChange={(e) => setMeterPhase(e.target.value as any)}
                className="w-full px-4 py-3.5 bg-white rounded-2xl text-sm font-bold text-typhoon-navy border border-typhoon-border focus:border-typhoon-gold focus:outline-none shadow-soft transition"
              >
                <option value="Single Phase">Single Phase</option>
                <option value="Three Phase">Three Phase</option>
              </select>
            </div>
          </div>

          {/* Urgent Segmented Buttons (Matching Screen 2 Yes / No) */}
          <div className="space-y-1.5 pt-1">
            <label className="text-xs font-bold text-typhoon-navy block">
              Urgent
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setIsUrgent(true)}
                className={`py-3 rounded-2xl text-sm font-bold border transition-all cursor-pointer ${
                  isUrgent
                    ? 'bg-typhoon-navy text-white border-typhoon-navy shadow-soft'
                    : 'bg-white text-typhoon-navy border-typhoon-border hover:bg-typhoon-sand'
                }`}
              >
                Yes
              </button>

              <button
                type="button"
                onClick={() => setIsUrgent(false)}
                className={`py-3 rounded-2xl text-sm font-bold border transition-all cursor-pointer ${
                  !isUrgent
                    ? 'bg-typhoon-navy text-white border-typhoon-navy shadow-soft'
                    : 'bg-white text-typhoon-navy border-typhoon-border hover:bg-typhoon-sand'
                }`}
              >
                No
              </button>
            </div>
          </div>

          {/* Auto ID Helper Note */}
          <p className="text-[11px] text-typhoon-muted pt-1">
            A Follow-up ID is created automatically when you save.
          </p>

          {/* Main Action Button Matching Screen 2 */}
          <div className="pt-3">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 px-6 rounded-2xl bg-typhoon-gold hover:bg-typhoon-gold-dark text-typhoon-navy font-bold text-base shadow-soft flex items-center justify-center gap-2 transition cursor-pointer disabled:opacity-50"
            >
              <Check className="w-5 h-5 stroke-[2.5]" />
              <span>{loading ? 'Saving...' : 'Save inquiry'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}