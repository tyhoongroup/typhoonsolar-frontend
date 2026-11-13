'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sun, Lock, Phone, ArrowRight, ShieldCheck, Zap, BarChart3, BellRing, AlertCircle } from 'lucide-react';
import { BackendStatusBadge } from '@/components/BackendStatusBadge';

export default function LoginPage() {
  const router = useRouter();
  const [phone, setPhone] = useState('9000000001');
  const [password, setPassword] = useState('Typhoon@123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!phone || phone.length < 10) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }

    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, password }),
      });

      let data: any = {};
      try {
        data = await res.json();
      } catch {
        throw new Error('Backend server returned a non-JSON response. Please ensure API is reachable.');
      }

      if (!res.ok) {
        throw new Error(data.message || 'Invalid credentials');
      }

      // Store access token & user in localStorage
      localStorage.setItem('accessToken', data.data.accessToken);
      localStorage.setItem('user', JSON.stringify(data.data.user));

      // Navigate to main role dashboard
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const fillQuickLogin = (num: string) => {
    setPhone(num);
    setPassword('Typhoon@123');
  };

  return (
    <div className="min-h-screen bg-typhoon-sand flex flex-col justify-center">
      {/* ======================================================== */}
      {/* 1. DESKTOP VIEW (Screens >= 1024px) - Split Screen Hero   */}
      {/* ======================================================== */}
      <div className="hidden lg:flex min-h-screen">
        {/* Left 55% Navy Hero Showcase */}
        <div className="w-[55%] bg-typhoon-navy text-white p-16 flex flex-col justify-between relative overflow-hidden shadow-2xl">
          {/* Concentric solar rings */}
          <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full border border-white/5 pointer-events-none" />
          <div className="absolute -top-12 -left-12 w-[520px] h-[520px] rounded-full border border-white/5 pointer-events-none" />
          <div className="absolute -bottom-36 -right-36 w-[600px] h-[600px] rounded-full border border-white/5 pointer-events-none" />

          {/* Top Brand */}
          <div className="relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-typhoon-gold flex items-center justify-center text-typhoon-navy shadow-lg">
                <Sun className="w-6 h-6 stroke-[2.5]" />
              </div>
              <div>
                <span className="text-xs font-bold tracking-widest text-typhoon-gold uppercase block">
                  TYPHOON SOLAR
                </span>
                <span className="text-[11px] text-white/60">
                  Rooftop Solar ERP & Lifecycle Management
                </span>
              </div>
            </div>
          </div>

          {/* Center Pitch */}
          <div className="relative z-10 max-w-lg my-auto py-12">
            <h1 className="text-4xl font-serif font-bold text-white tracking-tight leading-tight mb-4">
              Powering clean rooftop solar across Gujarat with zero operational friction.
            </h1>
            <p className="text-sm text-white/70 leading-relaxed mb-8">
              From lead capture and site survey to PM Surya Ghar subsidy disbursement and AMC service tickets, manage your entire solar installation lifecycle in one unified platform.
            </p>

            {/* Feature Pills */}
            <div className="grid grid-cols-2 gap-3.5">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-sm">
                <Zap className="w-5 h-5 text-typhoon-gold mb-2" />
                <h4 className="text-xs font-bold text-white">Quotation Engine</h4>
                <p className="text-[11px] text-white/60 mt-0.5">PM Surya Ghar tier subsidy (₹78k) & 80/20 milestone math</p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-sm">
                <ShieldCheck className="w-5 h-5 text-typhoon-gold mb-2" />
                <h4 className="text-xs font-bold text-white">10-Stage Pipeline</h4>
                <p className="text-[11px] text-white/60 mt-0.5">Automated SLA timers & overdue escalation checks</p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-sm">
                <BarChart3 className="w-5 h-5 text-typhoon-gold mb-2" />
                <h4 className="text-xs font-bold text-white">WhatsApp Updates</h4>
                <p className="text-[11px] text-white/60 mt-0.5">Instant zero-cost click-to-chat proposal & milestone links</p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-sm">
                <BellRing className="w-5 h-5 text-typhoon-gold mb-2" />
                <h4 className="text-xs font-bold text-white">Push Notifications</h4>
                <p className="text-[11px] text-white/60 mt-0.5">FCM web push alerts for urgent follow-up deadlines</p>
              </div>
            </div>
          </div>

          {/* Bottom Trust Badge */}
          <div className="relative z-10 pt-6 border-t border-white/10 flex items-center justify-between text-xs text-white/60">
            <span>Enterprise Edition FY2026-27</span>
            <span>Hostinger VPS KVM 4 · PostgreSQL 16 · Redis 7</span>
          </div>
        </div>

        {/* Right 45% Login Form */}
        <div className="w-[45%] bg-typhoon-sand flex items-center justify-center p-12">
          <div className="w-full max-w-md bg-white rounded-3xl p-8 border border-typhoon-border shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-serif font-bold text-typhoon-navy">
                  Welcome Back
                </h2>
                <p className="text-xs text-typhoon-muted mt-1">
                  Sign in with your registered phone number
                </p>
              </div>
              <BackendStatusBadge />
            </div>

            {error && (
              <div className="mb-5 p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-typhoon-navy block mb-1.5">
                  Phone number
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3.5 text-xs font-bold text-typhoon-navy border-r border-typhoon-border pr-2.5">
                    +91
                  </span>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    placeholder="Enter 10-digit number"
                    className="w-full pl-16 pr-4 py-3 bg-typhoon-sand rounded-xl text-xs text-typhoon-navy font-medium placeholder:text-typhoon-muted border border-transparent focus:border-typhoon-gold focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-typhoon-navy block mb-1.5">
                  Password
                </label>
                <div className="relative flex items-center">
                  <Lock className="w-4 h-4 text-typhoon-muted absolute left-3.5" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-10 pr-4 py-3 bg-typhoon-sand rounded-xl text-xs text-typhoon-navy font-medium placeholder:text-typhoon-muted border border-transparent focus:border-typhoon-gold focus:outline-none transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-typhoon-gold text-typhoon-navy font-bold py-3.5 rounded-xl hover:bg-typhoon-gold-dark transition shadow-soft flex items-center justify-center gap-2 text-xs mt-2 disabled:opacity-50"
              >
                <span>{loading ? 'Authenticating...' : 'Sign In to Dashboard'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Quick Demo Switcher with Role Color Themes */}
            <div className="mt-8 pt-6 border-t border-typhoon-border">
              <span className="text-[11px] font-bold text-typhoon-muted uppercase tracking-wider block mb-2 text-center">
                Quick Role Demo Logins (Signature Role Color Themes)
              </span>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                {/* 1. Ops Manager - Deep Midnight Navy & Amber Gold */}
                <button
                  type="button"
                  onClick={() => fillQuickLogin('9000000001')}
                  className="p-2.5 rounded-xl bg-[#0b192c] hover:bg-[#12233c] text-white font-medium text-left truncate transition border border-[#f59e0b]/40 shadow-xs flex items-center gap-2"
                >
                  <span className="w-5 h-5 rounded-full bg-[#f59e0b] text-[#0b192c] font-bold text-[9px] flex items-center justify-center shrink-0">
                    AK
                  </span>
                  <span className="truncate">Anand (Control Tower)</span>
                </button>

                {/* 2. Salesperson - Deep Royal Blue & Sky Blue */}
                <button
                  type="button"
                  onClick={() => fillQuickLogin('9000000002')}
                  className="p-2.5 rounded-xl bg-[#0a3d7c] hover:bg-[#104b93] text-white font-medium text-left truncate transition border border-[#00a3e0]/40 shadow-xs flex items-center gap-2"
                >
                  <span className="w-5 h-5 rounded-full bg-[#00a3e0] text-white font-bold text-[9px] flex items-center justify-center shrink-0">
                    RS
                  </span>
                  <span className="truncate">Amit (Salesperson)</span>
                </button>

                {/* 3. Portal User - Deep Petrol Teal & Mint Turquoise */}
                <button
                  type="button"
                  onClick={() => fillQuickLogin('9000000006')}
                  className="p-2.5 rounded-xl bg-[#063a42] hover:bg-[#0c4a54] text-white font-medium text-left truncate transition border border-[#00bfa5]/40 shadow-xs flex items-center gap-2"
                >
                  <span className="w-5 h-5 rounded-full bg-[#00bfa5] text-[#063a42] font-bold text-[9px] flex items-center justify-center shrink-0">
                    RP
                  </span>
                  <span className="truncate">Rahul (Govt Portal)</span>
                </button>

                {/* 4. Material Manager - Deep Olive Forest & Vibrant Lime */}
                <button
                  type="button"
                  onClick={() => fillQuickLogin('9000000005')}
                  className="p-2.5 rounded-xl bg-[#36451e] hover:bg-[#435726] text-white font-medium text-left truncate transition border border-[#a3e635]/40 shadow-xs flex items-center gap-2"
                >
                  <span className="w-5 h-5 rounded-full bg-[#a3e635] text-[#2e3b18] font-bold text-[9px] flex items-center justify-center shrink-0">
                    SM
                  </span>
                  <span className="truncate">Sohail (Material)</span>
                </button>

                {/* 5. Installation Team - Deep Chocolate Brown & Vibrant Orange */}
                <button
                  type="button"
                  onClick={() => fillQuickLogin('9000000008')}
                  className="p-2.5 rounded-xl bg-[#3e1c0d] hover:bg-[#4d2311] text-white font-medium text-left truncate transition border border-[#f97316]/40 shadow-xs flex items-center gap-2"
                >
                  <span className="w-5 h-5 rounded-full bg-[#f97316] text-white font-bold text-[9px] flex items-center justify-center shrink-0">
                    IT
                  </span>
                  <span className="truncate">Irfan (Installation)</span>
                </button>

                {/* 6. Accountant - Deep Plum Burgundy & Berry Crimson */}
                <button
                  type="button"
                  onClick={() => fillQuickLogin('9000000007')}
                  className="p-2.5 rounded-xl bg-[#3d1020] hover:bg-[#4e1529] text-white font-medium text-left truncate transition border border-[#e1144a]/40 shadow-xs flex items-center gap-2"
                >
                  <span className="w-5 h-5 rounded-full bg-[#e1144a] text-white font-bold text-[9px] flex items-center justify-center shrink-0">
                    MA
                  </span>
                  <span className="truncate">Meera (Accountant)</span>
                </button>

                {/* 7. Service Tech - Deep Charcoal Black & Canary Yellow */}
                <button
                  type="button"
                  onClick={() => fillQuickLogin('9000000009')}
                  className="p-2.5 rounded-xl bg-[#1c1e21] hover:bg-[#2b2e33] text-white font-medium text-left truncate transition border border-[#facc15]/40 shadow-xs flex items-center gap-2"
                >
                  <span className="w-5 h-5 rounded-full bg-[#facc15] text-[#1c1e21] font-bold text-[9px] flex items-center justify-center shrink-0">
                    ST
                  </span>
                  <span className="truncate">Zakir (Service Tech)</span>
                </button>

                {/* 8. Admin - Deep Indigo & Electric Violet */}
                <button
                  type="button"
                  onClick={() => fillQuickLogin('9898950959')}
                  className="p-2.5 rounded-xl bg-[#1e1b4b] hover:bg-[#2c276a] text-white font-medium text-left truncate transition border border-[#7c3aed]/40 shadow-xs flex items-center gap-2"
                >
                  <span className="w-5 h-5 rounded-full bg-[#7c3aed] text-white font-bold text-[9px] flex items-center justify-center shrink-0">
                    AD
                  </span>
                  <span className="truncate">Altaf (Admin)</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. MOBILE VIEW (Screens < 1024px) - Mobile Layout Guide */}
      {/* ======================================================== */}
      <div className="lg:hidden min-h-screen bg-typhoon-sand flex flex-col justify-between max-w-md mx-auto relative shadow-2xl overflow-hidden">
        {/* Navy Header Block with 40px rounded bottom curve */}
        <div className="bg-typhoon-navy text-white pt-14 pb-12 px-6 rounded-b-[40px] relative shadow-soft">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Sun className="w-5 h-5 text-typhoon-gold" />
              <span className="text-[11px] font-bold tracking-widest text-typhoon-gold uppercase">
                TYPHOON SOLAR
              </span>
            </div>
            <BackendStatusBadge />
          </div>

          <h1 className="text-3xl font-serif font-bold text-white tracking-tight">
            Welcome back
          </h1>
          <p className="text-xs text-white/70 mt-1">
            Sign in with your registered phone number & password
          </p>

          {/* Concentric ripples */}
          <div className="absolute -top-12 -right-12 w-44 h-44 rounded-full border border-white/5 pointer-events-none" />
        </div>

        {/* Form Body */}
        <div className="px-6 py-6 flex-1 flex flex-col justify-center">
          {error && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-typhoon-navy block mb-1.5">
                Phone number
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-3.5 text-xs font-bold text-typhoon-navy border-r border-typhoon-border pr-2.5">
                  +91
                </span>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  placeholder="Enter 10-digit number"
                  className="w-full pl-16 pr-4 py-3 bg-white rounded-xl text-xs text-typhoon-navy font-medium placeholder:text-typhoon-muted border border-typhoon-border focus:border-typhoon-gold focus:outline-none transition-all shadow-sm"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-typhoon-navy block mb-1.5">
                Password
              </label>
              <div className="relative flex items-center">
                <Lock className="w-4 h-4 text-typhoon-muted absolute left-3.5" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-4 py-3 bg-white rounded-xl text-xs text-typhoon-navy font-medium placeholder:text-typhoon-muted border border-typhoon-border focus:border-typhoon-gold focus:outline-none transition-all shadow-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-typhoon-gold text-typhoon-navy font-bold py-3.5 rounded-xl hover:bg-typhoon-gold-dark transition shadow-soft flex items-center justify-center gap-2 text-xs mt-2 disabled:opacity-50"
            >
              <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick autofill pills for mobile testing with signature role colors */}
          <div className="mt-6">
            <span className="text-[10px] font-bold text-typhoon-muted uppercase tracking-wider block mb-2 text-center">
              Quick Role Demo Logins:
            </span>
            <div className="flex flex-wrap gap-1.5 justify-center">
              <button
                type="button"
                onClick={() => fillQuickLogin('9000000001')}
                className="text-[10px] px-2.5 py-1 bg-[#0b192c] text-[#f59e0b] rounded-full border border-[#f59e0b]/40 font-semibold shadow-2xs flex items-center gap-1"
              >
                <span className="w-3.5 h-3.5 rounded-full bg-[#f59e0b] text-[#0b192c] text-[8px] font-bold flex items-center justify-center">
                  AK
                </span>
                <span>Ops</span>
              </button>
              <button
                type="button"
                onClick={() => fillQuickLogin('9000000002')}
                className="text-[10px] px-2.5 py-1 bg-[#0a3d7c] text-white rounded-full border border-[#00a3e0]/40 font-semibold shadow-2xs flex items-center gap-1"
              >
                <span className="w-3.5 h-3.5 rounded-full bg-[#00a3e0] text-white text-[8px] font-bold flex items-center justify-center">
                  RS
                </span>
                <span>Sales</span>
              </button>
              <button
                type="button"
                onClick={() => fillQuickLogin('9000000006')}
                className="text-[10px] px-2.5 py-1 bg-[#063a42] text-[#00bfa5] rounded-full border border-[#00bfa5]/40 font-semibold shadow-2xs flex items-center gap-1"
              >
                <span className="w-3.5 h-3.5 rounded-full bg-[#00bfa5] text-[#063a42] text-[8px] font-bold flex items-center justify-center">
                  RP
                </span>
                <span>Portal</span>
              </button>
              <button
                type="button"
                onClick={() => fillQuickLogin('9000000005')}
                className="text-[10px] px-2.5 py-1 bg-[#36451e] text-[#a3e635] rounded-full border border-[#a3e635]/40 font-semibold shadow-2xs flex items-center gap-1"
              >
                <span className="w-3.5 h-3.5 rounded-full bg-[#a3e635] text-[#2e3b18] text-[8px] font-bold flex items-center justify-center">
                  SM
                </span>
                <span>Material</span>
              </button>
              <button
                type="button"
                onClick={() => fillQuickLogin('9000000008')}
                className="text-[10px] px-2.5 py-1 bg-[#3e1c0d] text-[#f97316] rounded-full border border-[#f97316]/40 font-semibold shadow-2xs flex items-center gap-1"
              >
                <span className="w-3.5 h-3.5 rounded-full bg-[#f97316] text-white text-[8px] font-bold flex items-center justify-center">
                  IT
                </span>
                <span>Install</span>
              </button>
              <button
                type="button"
                onClick={() => fillQuickLogin('9000000007')}
                className="text-[10px] px-2.5 py-1 bg-[#3d1020] text-[#ff809b] rounded-full border border-[#e1144a]/40 font-semibold shadow-2xs flex items-center gap-1"
              >
                <span className="w-3.5 h-3.5 rounded-full bg-[#e1144a] text-white text-[8px] font-bold flex items-center justify-center">
                  MA
                </span>
                <span>Accounts</span>
              </button>
              <button
                type="button"
                onClick={() => fillQuickLogin('9898950959')}
                className="text-[10px] px-2.5 py-1 bg-[#1e1b4b] text-[#c4b5fd] rounded-full border border-[#7c3aed]/40 font-semibold shadow-2xs flex items-center gap-1"
              >
                <span className="w-3.5 h-3.5 rounded-full bg-[#7c3aed] text-white text-[8px] font-bold flex items-center justify-center">
                  AD
                </span>
                <span>Admin</span>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile footer */}
        <div className="p-6 text-center text-[11px] text-typhoon-muted border-t border-typhoon-border/50">
          One login for the whole team. Your role screens open automatically.
        </div>
      </div>
    </div>
  );
}
