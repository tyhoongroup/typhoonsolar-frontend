'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  User,
  Phone,
  Mail,
  Shield,
  Bell,
  LogOut,
  CheckCircle2,
  Lock,
  Palette,
  Sparkles,
} from 'lucide-react';
import { Header } from '@/components/Header';
import { SummaryTiles } from '@/components/SummaryTiles';
import { MainButton } from '@/components/MainButton';
import { useCurrentUser } from '@/lib/use-current-user';
import { toast } from 'sonner';
import { fetchWithAuth } from '@/lib/api';

export default function ProfilePage() {
  const router = useRouter();
  const { user, theme } = useCurrentUser();

  const [fullName, setFullName] = useState(user?.fullName || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [email, setEmail] = useState((user as any)?.email || '');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setFullName(user.fullName || '');
      setPhone(user.phone || '');
      setEmail((user as any)?.email || '');
    }
  }, [user]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const res = await fetchWithAuth('/api/v1/auth/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: fullName.trim(),
          phone: phone.trim(),
          email: email.trim(),
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to update profile on server.');
      }

      const data = await res.json();
      const updatedUser = {
        ...user,
        ...(data.user || {}),
        fullName: fullName.trim(),
        phone: phone.trim(),
        email: email.trim(),
      };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      toast.success('Profile details updated and saved to database!');
    } catch (err: any) {
      toast.error(err.message || 'Failed to update profile.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    toast.success('Signed out successfully.');
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-typhoon-sand pb-24">
      {/* 1. Standard Parabolic Header */}
      <Header
        role={user?.role || 'OPS_MANAGER'}
        initials={theme.tag}
        roleTitle="My Profile"
        subtitle={`${theme.roleName} · Typhoon Solar System`}
      />

      {/* 2. Overlapping Summary Tiles */}
      <SummaryTiles
        tiles={[
          {
            icon: <Shield className="w-4 h-4 text-emerald-600" />,
            value: theme.roleName,
            label: 'Assigned Role',
          },
          {
            icon: <Palette className="w-4 h-4 text-typhoon-gold" />,
            value: '60 · 30 · 10',
            label: 'Active Theme',
          },
        ]}
      />

      <div className="max-w-md mx-auto px-4 mt-4 space-y-4">
        {/* Profile Details Form Card */}
        <div className="bg-white rounded-2xl p-5 border border-typhoon-border shadow-soft space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-typhoon-border">
            <div
              style={{
                backgroundColor: 'color-mix(in srgb, var(--a) 18%, #ffffff)',
                color: 'var(--s)',
              }}
              className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg"
            >
              {theme.tag}
            </div>
            <div>
              <h2 className="text-base font-bold text-typhoon-navy">{user?.fullName || 'User'}</h2>
              <p className="text-xs text-typhoon-muted">{theme.roleName}</p>
            </div>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-3.5">
            <div>
              <label className="text-xs font-semibold text-typhoon-navy block mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-typhoon-muted absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-typhoon-sand/40 border border-typhoon-border rounded-xl text-xs text-typhoon-navy focus:outline-none focus:border-typhoon-gold font-medium"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-typhoon-navy block mb-1">
                Mobile Number
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-typhoon-muted absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-typhoon-sand/40 border border-typhoon-border rounded-xl text-xs text-typhoon-navy focus:outline-none focus:border-typhoon-gold font-medium"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-typhoon-navy block mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-typhoon-muted absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-typhoon-sand/40 border border-typhoon-border rounded-xl text-xs text-typhoon-navy focus:outline-none focus:border-typhoon-gold font-medium"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSaving}
                style={{
                  backgroundColor: 'var(--a)',
                  color: 'var(--on)',
                }}
                className="w-full py-3.5 px-4 rounded-xl font-bold text-xs shadow-soft transition hover:opacity-95 active:scale-[0.98] disabled:opacity-50 cursor-pointer"
              >
                {isSaving ? 'Saving...' : 'Save Profile Changes'}
              </button>
            </div>
          </form>
        </div>

        {/* Role Theme & 60-30-10 Palette Swatches Card */}
        <div className="bg-white rounded-2xl p-5 border border-typhoon-border shadow-soft space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-typhoon-navy uppercase tracking-wider">
              Role Color Hierarchy
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              Active
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-1 text-center">
            <div className="p-2.5 rounded-xl border border-typhoon-border/80 bg-typhoon-sand/60">
              <div
                style={{ backgroundColor: 'var(--c)' }}
                className="w-full h-8 rounded-lg border border-black/10 mx-auto mb-1.5 shadow-2xs"
              />
              <span className="text-[10px] font-bold text-typhoon-navy block">60% Canvas</span>
              <span className="text-[9px] text-typhoon-muted font-mono">var(--c)</span>
            </div>

            <div className="p-2.5 rounded-xl border border-typhoon-border/80 bg-typhoon-sand/60">
              <div
                style={{ backgroundColor: 'var(--s)' }}
                className="w-full h-8 rounded-lg mx-auto mb-1.5 shadow-2xs"
              />
              <span className="text-[10px] font-bold text-typhoon-navy block">30% Structure</span>
              <span className="text-[9px] text-typhoon-muted font-mono">var(--s)</span>
            </div>

            <div className="p-2.5 rounded-xl border border-typhoon-border/80 bg-typhoon-sand/60">
              <div
                style={{ backgroundColor: 'var(--a)' }}
                className="w-full h-8 rounded-lg mx-auto mb-1.5 shadow-2xs"
              />
              <span className="text-[10px] font-bold text-typhoon-navy block">10% Accent</span>
              <span className="text-[9px] text-typhoon-muted font-mono">var(--a)</span>
            </div>
          </div>
        </div>

        {/* Account Sign Out Action */}
        <div className="pt-2">
          <button
            onClick={handleLogout}
            className="w-full py-3.5 px-4 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs flex items-center justify-center gap-2 border border-rose-200 transition cursor-pointer shadow-soft"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out of Typhoon Solar</span>
          </button>
        </div>
      </div>
    </div>
  );
}
