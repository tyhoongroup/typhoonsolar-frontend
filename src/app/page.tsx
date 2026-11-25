'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Sun,
  Lock,
  Phone,
  ArrowRight,
  ShieldCheck,
  Zap,
  BarChart3,
  BellRing,
  AlertCircle,
  Clock,
  UserCheck,
  KeyRound,
} from 'lucide-react';
import { BackendStatusBadge } from '@/components/BackendStatusBadge';
import { getRoleTheme } from '@/lib/role-theme';
import { SplashScreen } from '@/components/SplashScreen';

interface SavedProfile {
  fullName: string;
  phone: string;
  role: string;
  lastLoginText: string;
}

export default function LoginPage() {
  const router = useRouter();
  const [phone, setPhone] = useState('9000000001');
  const [password, setPassword] = useState('Typhoon@123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [savedProfile, setSavedProfile] = useState<SavedProfile | null>(null);
  const [isSwitchingProfile, setIsSwitchingProfile] = useState(false);

  useEffect(() => {
    // 1. Check if user already has an active session
    const existingToken = localStorage.getItem('accessToken');
    const existingUser = localStorage.getItem('user');
    if (existingToken && existingUser && existingToken !== 'null') {
      router.push('/dashboard');
      return;
    }

    // 2. Check for saved profile on this device
    const stored = localStorage.getItem('typhoon_saved_profile');
    if (stored) {
      try {
        setSavedProfile(JSON.parse(stored));
      } catch (e) {
        localStorage.removeItem('typhoon_saved_profile');
      }
    } else {
      // Default initial saved profile matching Screen 2 (Amit Kumar / Ops Manager)
      const defaultProfile: SavedProfile = {
        fullName: 'Amit Kumar',
        phone: '9000000001',
        role: 'OPS_MANAGER',
        lastLoginText: 'today, 9:12 AM',
      };
      setSavedProfile(defaultProfile);
    }
  }, [router]);

  const executeLogin = async (loginPhone: string, loginPass: string, profileOverride?: any) => {
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: loginPhone, password: loginPass }),
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

      // Store active session tokens
      localStorage.setItem('accessToken', data.data.accessToken);
      localStorage.setItem('user', JSON.stringify(data.data.user));

      // Save device profile for PWA 1-touch welcome back screen
      const now = new Date();
      const timeStr = now.toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit', hour12: true });
      const newSaved: SavedProfile = {
        fullName: data.data.user.fullName || profileOverride?.fullName || 'Typhoon Team Member',
        phone: loginPhone,
        role: data.data.user.role,
        lastLoginText: `today, ${timeStr}`,
      };
      localStorage.setItem('typhoon_saved_profile', JSON.stringify(newSaved));

      // Navigate to dashboard
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleSavedProfileLogin = () => {
    if (!savedProfile) return;
    executeLogin(savedProfile.phone, 'Typhoon@123', savedProfile);
  };

  const handleFormLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || phone.length < 10) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }
    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    executeLogin(phone, password);
  };

  const handleQuickRoleSelect = (
    num: string,
    roleKey: string,
    name: string
  ) => {
    setPhone(num);
    setPassword('Typhoon@123');
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit', hour12: true });
    const profile: SavedProfile = {
      fullName: name,
      phone: num,
      role: roleKey,
      lastLoginText: `today, ${timeStr}`,
    };
    setSavedProfile(profile);
    setIsSwitchingProfile(false);
    executeLogin(num, 'Typhoon@123', profile);
  };

  const activeTheme = getRoleTheme(savedProfile?.role || 'OPS_MANAGER');

  // Format phone to "+91 98XXX XXX23"
  const formatMaskedPhone = (num: string) => {
    if (!num || num.length < 10) return '+91 98XXX XXX23';
    return `+91 ${num.slice(0, 2)}XXX XXX${num.slice(-2)}`;
  };

  return (
    <div className="min-h-screen bg-typhoon-sand flex flex-col justify-center">

      {/* ======================================================== */}
      {/* 1. DESKTOP VIEW (Screens >= 1024px)                     */}
      {/* ======================================================== */}
      <div className="hidden lg:flex min-h-screen">
        {/* Left 55% Showcase Hero */}
        <div
          className="w-[55%] text-white p-16 flex flex-col justify-between relative overflow-hidden shadow-2xl bg-gradient-to-br from-[#071326] via-[#0B192C] to-[#122B4D]"
        >
          {/* Concentric ripples */}
          <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full border border-white/5 pointer-events-none" />
          <div className="absolute -top-12 -left-12 w-[520px] h-[520px] rounded-full border border-white/5 pointer-events-none" />
          <div className="absolute -bottom-36 -right-36 w-[600px] h-[600px] rounded-full border border-white/5 pointer-events-none" />

          {/* Top Brand Logo */}
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src="/images/typhoon-logo-white.png"
                alt="Typhoon Solar"
                className="h-10 w-auto object-contain drop-shadow"
              />
            </div>
            <BackendStatusBadge />
          </div>

          {/* Center Pitch */}
          <div className="relative z-10 max-w-lg my-auto py-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-medium mb-6 backdrop-blur-md border border-white/10">
              <span style={{ backgroundColor: activeTheme.hex.accentBg }} className="w-2 h-2 rounded-full animate-pulse" />
              <span>Gujarat Rooftop Solar Operations Platform</span>
            </div>

            <h1 className="text-4xl font-serif font-bold text-white tracking-tight leading-tight mb-4">
              Powering clean rooftop solar across Gujarat with zero operational friction.
            </h1>
            <p className="text-sm text-white/70 leading-relaxed">
              Real-time collaboration across 8 operational roles: Lead Surveys, Surya Gujarat DISCOM Liaison, BOM Dispatch, 80/20 Payment Milestone Collections, and DBT Subsidy Releases.
            </p>
          </div>

          {/* Bottom Footer Info */}
          <div className="relative z-10 flex items-center justify-between text-xs text-white/50 border-t border-white/10 pt-6">
            <span>© 2026 Typhoon Solar Energy Pvt Ltd</span>
            <div className="flex gap-4">
              <span>National Portal Liaison</span>
              <span>•</span>
              <span>MNRE PM Surya Ghar</span>
            </div>
          </div>
        </div>

        {/* Right 45% Action Panel */}
        <div className="w-[45%] bg-typhoon-sand p-12 flex flex-col justify-center items-center">
          <div className="w-full max-w-md">
            {savedProfile && !isSwitchingProfile ? (
              /* Desktop Saved Profile Card (Screen 2) */
              <div className="bg-white rounded-[32px] p-8 shadow-xl border border-typhoon-border text-center space-y-6">
                {/* Header */}
                <div
                  className="rounded-2xl p-6 text-white text-center relative overflow-hidden bg-gradient-to-br from-[#071326] via-[#0B192C] to-[#122B4D] shadow-md"
                >
                  <div className="flex items-center justify-center mb-3">
                    <img
                      src="/images/typhoon-logo-white.png"
                      alt="Typhoon Solar"
                      className="h-8 w-auto object-contain"
                    />
                  </div>
                  <h2 className="text-2xl font-serif font-normal text-white">Welcome back</h2>
                  <p className="text-xs text-white/80 mt-1">Continue with your saved profile</p>
                </div>

                {/* Avatar with dynamic role ring */}
                <div className="pt-2">
                  <div
                    style={{
                      borderColor: activeTheme.hex.accentBg,
                      color: activeTheme.hex.accentBg,
                    }}
                    className="w-24 h-24 rounded-full mx-auto flex items-center justify-center font-serif text-3xl font-normal shadow-lg border-4 bg-[#0B192C]"
                  >
                    {activeTheme.tag}
                  </div>
                  <h3 className="text-2xl font-serif font-normal text-typhoon-navy mt-4 tracking-tight">
                    {savedProfile.fullName}
                  </h3>
                  <div className="mt-1.5">
                    <span
                      style={{
                        backgroundColor: activeTheme.hex.lightBg,
                        color: activeTheme.hex.lightText,
                        borderColor: activeTheme.hex.lightBorder,
                      }}
                      className="inline-block px-3.5 py-1 rounded-full text-xs font-bold border"
                    >
                      {activeTheme.roleName}
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-typhoon-navy mt-2">
                    {formatMaskedPhone(savedProfile.phone)}
                  </p>
                  <div className="flex items-center justify-center gap-1.5 text-xs text-typhoon-muted mt-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Last login: {savedProfile.lastLoginText}</span>
                  </div>
                </div>

                <div className="border-t border-typhoon-border/70 pt-4">
                  <button
                    onClick={() => setIsSwitchingProfile(true)}
                    className="text-xs font-bold text-typhoon-navy underline decoration-typhoon-navy/30 hover:decoration-typhoon-navy transition"
                  >
                    Switch profile
                  </button>
                </div>

                {error && (
                  <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2 text-left">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <div className="space-y-3 pt-2">
                  <button
                    onClick={handleSavedProfileLogin}
                    disabled={loading}
                    style={{
                      backgroundColor: activeTheme.hex.accentBg,
                      color: activeTheme.hex.accentTextColor,
                    }}
                    className="w-full py-4 px-6 rounded-2xl font-bold text-sm tracking-wide shadow-soft flex items-center justify-center gap-2 transition hover:opacity-95 disabled:opacity-50"
                  >
                    <Lock className="w-4 h-4" />
                    <span>{loading ? 'Logging in...' : 'Login'}</span>
                  </button>

                  <button
                    onClick={() => setIsSwitchingProfile(true)}
                    className="w-full py-3.5 px-6 rounded-2xl font-bold text-xs text-typhoon-navy border border-typhoon-navy/30 hover:bg-typhoon-sand transition"
                  >
                    Use another number
                  </button>
                </div>
              </div>
            ) : (
              /* Desktop Regular Sign-in Form */
              <div className="bg-white rounded-[32px] p-8 shadow-xl border border-typhoon-border space-y-6">
                <div>
                  <h2 className="text-2xl font-serif font-bold text-typhoon-navy">Staff Sign In</h2>
                  <p className="text-xs text-typhoon-muted mt-1">
                    Enter your 10-digit registered number to access your workspace.
                  </p>
                </div>

                {error && (
                  <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <form onSubmit={handleFormLogin} className="space-y-4">
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
                        className="w-full pl-16 pr-4 py-3 bg-typhoon-sand/30 rounded-xl text-xs text-typhoon-navy font-medium border border-typhoon-border focus:border-typhoon-navy focus:outline-none transition shadow-xs"
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
                        placeholder="Enter password"
                        className="w-full pl-10 pr-4 py-3 bg-typhoon-sand/30 rounded-xl text-xs text-typhoon-navy font-medium border border-typhoon-border focus:border-typhoon-navy focus:outline-none transition shadow-xs"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 px-6 rounded-2xl bg-typhoon-navy hover:bg-typhoon-navy-light text-white font-bold text-xs tracking-wide shadow-soft flex items-center justify-center gap-2 transition disabled:opacity-50"
                  >
                    <span>{loading ? 'Authenticating...' : 'Sign In to Workspace'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>

                {/* Quick Role Switcher Buttons */}
                <div className="border-t border-typhoon-border pt-4">
                  <span className="text-[10px] font-bold tracking-widest text-typhoon-muted uppercase block mb-2.5 text-center">
                    Quick Role Switcher (Pre-Seeded)
                  </span>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <button
                      onClick={() => handleQuickRoleSelect('9000000001', 'OPS_MANAGER', 'Amit Kumar')}
                      className="p-2 rounded-xl bg-[#0b192c] text-white text-left font-medium flex items-center gap-2 border border-[#f59e0b]/40 shadow-xs"
                    >
                      <span className="w-5 h-5 rounded-full bg-[#f59e0b] text-[#0b192c] font-bold text-[9px] flex items-center justify-center shrink-0">
                        AK
                      </span>
                      <span className="truncate">Amit (Ops)</span>
                    </button>
                    <button
                      onClick={() => handleQuickRoleSelect('9000000006', 'PORTAL_USER', 'Rahul Patel')}
                      className="p-2 rounded-xl bg-[#063a42] text-white text-left font-medium flex items-center gap-2 border border-[#00bfa5]/40 shadow-xs"
                    >
                      <span className="w-5 h-5 rounded-full bg-[#00bfa5] text-[#063a42] font-bold text-[9px] flex items-center justify-center shrink-0">
                        RP
                      </span>
                      <span className="truncate">Rahul (Portal)</span>
                    </button>
                    <button
                      onClick={() => handleQuickRoleSelect('9000000007', 'ACCOUNTANT', 'Meera Shah')}
                      className="p-2 rounded-xl bg-[#3d1020] text-white text-left font-medium flex items-center gap-2 border border-[#e1144a]/40 shadow-xs"
                    >
                      <span className="w-5 h-5 rounded-full bg-[#e1144a] text-white font-bold text-[9px] flex items-center justify-center shrink-0">
                        MA
                      </span>
                      <span className="truncate">Meera (Accounts)</span>
                    </button>
                    <button
                      onClick={() => handleQuickRoleSelect('9000000002', 'SALESPERSON', 'Amit Patel')}
                      className="p-2 rounded-xl bg-[#0a3d7c] text-white text-left font-medium flex items-center gap-2 border border-[#00a3e0]/40 shadow-xs"
                    >
                      <span className="w-5 h-5 rounded-full bg-[#00a3e0] text-white font-bold text-[9px] flex items-center justify-center shrink-0">
                        AP
                      </span>
                      <span className="truncate">Amit (Sales)</span>
                    </button>
                    <button
                      onClick={() => handleQuickRoleSelect('9000000005', 'MATERIAL_MANAGER', 'Sohail Khan')}
                      className="p-2 rounded-xl bg-[#36451e] text-white text-left font-medium flex items-center gap-2 border border-[#a3e635]/40 shadow-xs"
                    >
                      <span className="w-5 h-5 rounded-full bg-[#a3e635] text-[#2e3b18] font-bold text-[9px] flex items-center justify-center shrink-0">
                        SM
                      </span>
                      <span className="truncate">Sohail (Material)</span>
                    </button>
                    <button
                      onClick={() => handleQuickRoleSelect('9000000008', 'INSTALLATION_TEAM', 'Irfan Mansuri')}
                      className="p-2 rounded-xl bg-[#3e1c0d] text-white text-left font-medium flex items-center gap-2 border border-[#f97316]/40 shadow-xs"
                    >
                      <span className="w-5 h-5 rounded-full bg-[#f97316] text-white font-bold text-[9px] flex items-center justify-center shrink-0">
                        IT
                      </span>
                      <span className="truncate">Irfan (Install)</span>
                    </button>
                    <button
                      onClick={() => handleQuickRoleSelect('9000000009', 'SERVICE_TECH', 'Zakir (Service Tech)')}
                      className="p-2 rounded-xl bg-[#0e3038] text-white text-left font-medium flex items-center gap-2 border border-[#22d3ee]/40 shadow-xs"
                    >
                      <span className="w-5 h-5 rounded-full bg-[#22d3ee] text-[#0e3038] font-bold text-[9px] flex items-center justify-center shrink-0">
                        ST
                      </span>
                      <span className="truncate">Zakir (Service)</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. MOBILE VIEW (Screens < 1024px) - Screen 2 PWA UX      */}
      {/* ======================================================== */}
      <div className="lg:hidden min-h-screen bg-[#FBF8F3] flex flex-col justify-between w-full relative overflow-x-hidden">
        {savedProfile && !isSwitchingProfile ? (
          /* Mobile Screen 2 - Saved Profile Welcome Back */
          <div className="flex-1 flex flex-col justify-between">
            {/* Top Brand & Title Block with deep brand navy gradient for high contrast */}
            <div
              className="text-white pt-10 pb-16 px-6 rounded-b-[40px] relative overflow-hidden bg-gradient-to-br from-[#071326] via-[#0B192C] to-[#122B4D] shadow-lg"
            >
              {/* Concentric ripples radiating from top right */}
              <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full border border-white/10 pointer-events-none" />
              <div className="absolute -top-8 -right-8 w-44 h-44 rounded-full border border-white/10 pointer-events-none" />
              <div className="absolute 0 -right-0 w-32 h-32 rounded-full border border-white/5 pointer-events-none" />

              {/* Brand logo row */}
              <div className="relative z-10 flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <img
                    src="/images/typhoon-logo-white.png"
                    alt="Typhoon Solar"
                    className="h-7 w-auto object-contain"
                  />
                </div>
                <BackendStatusBadge />
              </div>

              <h1 className="text-3xl font-serif font-normal text-white tracking-tight relative z-10">
                Welcome back
              </h1>
              <p className="text-xs text-white/80 mt-1 relative z-10 font-normal">
                Continue with your saved profile
              </p>
            </div>

            {/* Floating Saved Profile Card */}
            <div className="px-5 -mt-10 relative z-20">
              <div className="bg-white rounded-[32px] p-6 sm:p-8 shadow-xl border border-gray-100/80 text-center flex flex-col items-center">
                {/* Avatar with Role Initials: Perfect Circle with gold border matching Image 1 */}
                <div className="w-24 h-24 aspect-square rounded-full flex items-center justify-center font-serif text-3xl font-bold shadow-md border-[3px] border-[#F59E0B] bg-[#071326] text-[#F59E0B] shrink-0">
                  {savedProfile.role === 'OPS_MANAGER' ? 'AK' : activeTheme.tag}
                </div>

                <h3 className="text-2xl font-serif font-bold text-typhoon-navy mt-4 tracking-tight leading-tight">
                  {savedProfile.fullName}
                </h3>

                <div className="mt-2">
                  <span className="inline-block px-3.5 py-1 rounded-full text-xs font-semibold bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A]/80">
                    {activeTheme.roleName}
                  </span>
                </div>

                <p className="text-sm font-semibold text-gray-700 mt-3 tracking-wide">
                  {formatMaskedPhone(savedProfile.phone)}
                </p>

                <div className="flex items-center justify-center gap-1.5 text-xs text-gray-400 mt-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Last login: {savedProfile.lastLoginText}</span>
                </div>

                <div className="border-t border-gray-100 w-full my-4" />

                <button
                  type="button"
                  onClick={() => setIsSwitchingProfile(true)}
                  className="text-xs font-bold text-typhoon-navy hover:underline transition cursor-pointer"
                >
                  Switch profile
                </button>
              </div>

              {error && (
                <div className="mt-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Action Buttons (Image 1) */}
              <div className="space-y-3 mt-6">
                <button
                  type="button"
                  onClick={handleSavedProfileLogin}
                  disabled={loading}
                  className="w-full py-4 px-6 rounded-2xl font-bold text-base tracking-wide shadow-soft flex items-center justify-center gap-2 bg-[#F59E0B] text-[#071326] hover:bg-[#D97706] active:scale-[0.98] disabled:opacity-50 transition cursor-pointer"
                >
                  <Lock className="w-4 h-4 stroke-[2.5]" />
                  <span>{loading ? 'Logging in...' : 'Login'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsSwitchingProfile(true)}
                  className="w-full py-3.5 px-6 rounded-2xl font-semibold text-sm text-[#071326] border border-[#071326]/40 bg-transparent hover:bg-black/5 active:scale-[0.98] transition cursor-pointer text-center"
                >
                  Use another number
                </button>
              </div>
            </div>

            {/* Footer notice matching Screen 2 */}
            <div className="px-6 py-6 text-center">
              <p className="text-[11px] text-gray-500 leading-relaxed">
                Your own screens open automatically after login.
                <br />
                Not you? Switch profile or remove it from this phone.
              </p>
            </div>
          </div>
        ) : (
          /* Mobile Regular Sign-in Form */
          <div className="flex-1 flex flex-col justify-between">
            {/* Header */}
            <div className="bg-[#0B192C] text-white pt-10 pb-10 px-6 rounded-b-[40px] relative shadow-soft">
              <div className="flex items-center justify-between mb-4 relative z-10">
                <div className="flex items-center gap-2">
                  <img
                    src="/images/typhoon-logo-white.png"
                    alt="Typhoon Solar"
                    className="h-7 w-auto object-contain"
                  />
                </div>
                <BackendStatusBadge />
              </div>

              <h1 className="text-3xl font-serif font-bold text-white tracking-tight">
                Staff Login
              </h1>
              <p className="text-xs text-white/70 mt-1">
                Enter your 10-digit number & password
              </p>
            </div>

            {/* Form */}
            <div className="px-6 py-4 flex-1 flex flex-col justify-center">
              {error && (
                <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleFormLogin} className="space-y-4">
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
                      className="w-full pl-16 pr-4 py-3 bg-white rounded-xl text-xs text-typhoon-navy font-medium placeholder:text-typhoon-muted border border-typhoon-border focus:border-typhoon-gold focus:outline-none transition shadow-sm"
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
                      placeholder="Enter password"
                      className="w-full pl-10 pr-4 py-3 bg-white rounded-xl text-xs text-typhoon-navy font-medium placeholder:text-typhoon-muted border border-typhoon-border focus:border-typhoon-gold focus:outline-none transition shadow-sm"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 px-6 rounded-2xl bg-typhoon-navy hover:bg-typhoon-navy-light text-white font-bold text-xs tracking-wide shadow-soft flex items-center justify-center gap-2 transition disabled:opacity-50"
                >
                  <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                {savedProfile && (
                  <button
                    type="button"
                    onClick={() => setIsSwitchingProfile(false)}
                    className="w-full text-center text-xs text-typhoon-muted font-bold underline mt-2"
                  >
                    Return to saved profile ({savedProfile.fullName})
                  </button>
                )}
              </form>

              {/* Quick Role Switcher Buttons */}
              <div className="mt-6 pt-4 border-t border-typhoon-border">
                <span className="text-[10px] font-bold tracking-widest text-typhoon-muted uppercase block mb-2.5 text-center">
                  Quick Role Switcher (Pre-Seeded)
                </span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => handleQuickRoleSelect('9000000001', 'OPS_MANAGER', 'Amit Kumar')}
                    className="p-2.5 rounded-xl bg-[#0b192c] text-white font-medium text-left truncate transition border border-[#f59e0b]/40 shadow-xs flex items-center gap-2"
                  >
                    <span className="w-5 h-5 rounded-full bg-[#f59e0b] text-[#0b192c] font-bold text-[9px] flex items-center justify-center shrink-0">
                      AK
                    </span>
                    <span className="truncate">Amit (Ops)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickRoleSelect('9000000006', 'PORTAL_USER', 'Rahul Patel')}
                    className="p-2.5 rounded-xl bg-[#063a42] text-white font-medium text-left truncate transition border border-[#00bfa5]/40 shadow-xs flex items-center gap-2"
                  >
                    <span className="w-5 h-5 rounded-full bg-[#00bfa5] text-[#063a42] font-bold text-[9px] flex items-center justify-center shrink-0">
                      RP
                    </span>
                    <span className="truncate">Rahul (Portal)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickRoleSelect('9000000007', 'ACCOUNTANT', 'Meera Shah')}
                    className="p-2.5 rounded-xl bg-[#3d1020] text-white font-medium text-left truncate transition border border-[#e1144a]/40 shadow-xs flex items-center gap-2"
                  >
                    <span className="w-5 h-5 rounded-full bg-[#e1144a] text-white font-bold text-[9px] flex items-center justify-center shrink-0">
                      MA
                    </span>
                    <span className="truncate">Meera (Accounts)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickRoleSelect('9000000002', 'SALESPERSON', 'Amit Patel')}
                    className="p-2.5 rounded-xl bg-[#0a3d7c] text-white font-medium text-left truncate transition border border-[#00a3e0]/40 shadow-xs flex items-center gap-2"
                  >
                    <span className="w-5 h-5 rounded-full bg-[#00a3e0] text-white font-bold text-[9px] flex items-center justify-center shrink-0">
                      AP
                    </span>
                    <span className="truncate">Amit (Sales)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickRoleSelect('9000000005', 'MATERIAL_MANAGER', 'Sohail Khan')}
                    className="p-2.5 rounded-xl bg-[#36451e] text-white font-medium text-left truncate transition border border-[#a3e635]/40 shadow-xs flex items-center gap-2"
                  >
                    <span className="w-5 h-5 rounded-full bg-[#a3e635] text-[#2e3b18] font-bold text-[9px] flex items-center justify-center shrink-0">
                      SM
                    </span>
                    <span className="truncate">Sohail (Material)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickRoleSelect('9000000008', 'INSTALLATION_TEAM', 'Irfan Mansuri')}
                    className="p-2.5 rounded-xl bg-[#3e1c0d] text-white font-medium text-left truncate transition border border-[#f97316]/40 shadow-xs flex items-center gap-2"
                  >
                    <span className="w-5 h-5 rounded-full bg-[#f97316] text-white font-bold text-[9px] flex items-center justify-center shrink-0">
                      IT
                    </span>
                    <span className="truncate">Irfan (Install)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickRoleSelect('9000000009', 'SERVICE_TECH', 'Zakir (Service Tech)')}
                    className="p-2.5 rounded-xl bg-[#0e3038] text-white font-medium text-left truncate transition border border-[#22d3ee]/40 shadow-xs flex items-center gap-2 col-span-2 sm:col-span-1"
                  >
                    <span className="w-5 h-5 rounded-full bg-[#22d3ee] text-[#0e3038] font-bold text-[9px] flex items-center justify-center shrink-0">
                      ST
                    </span>
                    <span className="truncate">Zakir (Service)</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 text-center">
              <span className="text-[10px] text-typhoon-muted">
                Typhoon Solar Rooftop Platform · PWA Enabled
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
