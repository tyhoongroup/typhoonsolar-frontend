'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Send, Check } from 'lucide-react';
import { SolarCalculator } from '@/shared';
import { toast } from 'sonner';
import { Header } from '@/components/Header';
import { useCurrentUser } from '@/lib/use-current-user';

export default function NewQuotationPage() {
  const router = useRouter();
  const { user, theme } = useCurrentUser();
  const [selectedKw, setSelectedKw] = useState(6);
  const [phase, setPhase] = useState<'Single Phase' | 'Three Phase'>('Three Phase');
  const [panelTech, setPanelTech] = useState<'Topcon' | 'Bi-facial'>('Topcon');

  // Verify token on mount
  React.useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token || token === 'null' || token === 'undefined') {
      localStorage.clear();
      toast.error('Session expired. Redirecting to login...');
      router.push('/');
    }
  }, [router]);

  // Live calculation from our shared SolarCalculator engine!
  const calculation = SolarCalculator.calculate({
    panelWattage: 580,
    panelQuantity: Math.round((selectedKw * 1000) / 580),
    meterPhase: phase,
    panelTech,
    grossCost: selectedKw * 50000, // standard benchmark
  });

  return (
    <div className="min-h-screen bg-typhoon-sand pb-20">
      {/* 1. Unified Header matching Home */}
      <Header
        role={user?.role || 'OPS_MANAGER'}
        initials={theme.tag}
        roleTitle="Control tower"
        subtitle="Solar Quotation & PM Surya Ghar Subsidy Engine"
      />

      <div className="max-w-3xl mx-auto px-4 lg:px-6 pt-3 space-y-4">
        {/* Title row with back button */}
        <div className="bg-white p-4 rounded-2xl border border-typhoon-border shadow-soft flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="w-9 h-9 rounded-xl bg-typhoon-sand hover:bg-typhoon-sand-dark flex items-center justify-center text-typhoon-navy transition cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl sm:text-2xl font-serif font-bold text-typhoon-navy tracking-tight">
                Solar Quotation
              </h1>
              <p className="text-xs text-typhoon-gold-dark font-semibold">
                F-1022 · Nilesh Desai (Anand)
              </p>
            </div>
          </div>

          <span
            style={{
              backgroundColor: theme.hex.accentBg,
              color: theme.hex.accentTextColor,
            }}
            className="text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider"
          >
            Stage 3: Quotation
          </span>
        </div>
        {/* Step Progress */}
        <div className="bg-white rounded-2xl p-4 border border-typhoon-border shadow-soft">
          <div className="flex justify-between text-xs font-bold text-typhoon-navy mb-2">
            <span>Step 2 of 3 · System size</span>
            <span className="text-typhoon-gold">66%</span>
          </div>
          <div className="w-full bg-typhoon-sand h-2 rounded-full overflow-hidden">
            <div className="bg-typhoon-gold h-full w-[66%] rounded-full" />
          </div>
        </div>

        {/* Capacity Selector Buttons (Screen 30) */}
        <div>
          <label className="text-xs font-bold text-typhoon-navy block mb-2">
            Select Capacity (kW)
          </label>
          <div className="grid grid-cols-4 gap-2.5">
            {[3, 4, 5, 6].map((kw) => {
              const isSelected = selectedKw === kw;
              return (
                <button
                  key={kw}
                  type="button"
                  onClick={() => setSelectedKw(kw)}
                  className={`py-4 rounded-2xl border flex flex-col items-center justify-center transition-all ${
                    isSelected
                      ? 'bg-typhoon-navy text-white border-typhoon-navy shadow-soft ring-2 ring-typhoon-gold'
                      : 'bg-white text-typhoon-navy border-typhoon-border hover:bg-typhoon-sand'
                  }`}
                >
                  <span className={`text-xl font-bold font-serif ${isSelected ? 'text-typhoon-gold' : ''}`}>
                    {kw}
                  </span>
                  <span className="text-[10px] text-typhoon-muted font-medium">kW</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Phase Selector */}
        <div>
          <label className="text-xs font-bold text-typhoon-navy block mb-2">
            Phase
          </label>
          <div className="grid grid-cols-2 gap-3">
            {(['Single Phase', 'Three Phase'] as const).map((p) => {
              const isSelected = phase === p;
              return (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPhase(p)}
                  className={`py-3.5 rounded-2xl text-xs font-bold border transition-all ${
                    isSelected
                      ? 'bg-typhoon-navy text-white border-typhoon-navy shadow-soft'
                      : 'bg-white text-typhoon-navy border-typhoon-border'
                  }`}
                >
                  {p}
                </button>
              );
            })}
          </div>
        </div>

        {/* Estimated System Navy Summary Card */}
        <div className="bg-typhoon-navy text-white rounded-2xl p-5 shadow-soft">
          <span className="text-[10px] font-bold tracking-widest text-typhoon-gold uppercase block mb-1">
            ESTIMATED SYSTEM
          </span>
          <h2 className="text-2xl font-serif font-bold text-white tracking-tight">
            {selectedKw} kW · {phase}
          </h2>
          <p className="text-xs text-white/60 mt-0.5">
            Price comes from the quotation sheet
          </p>

          <div className="mt-4 pt-4 border-t border-white/10 grid grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-white/60 block text-[10px]">PM Surya Ghar Subsidy</span>
              <span className="font-bold text-typhoon-gold text-sm">
                ₹{calculation.centralSubsidy.toLocaleString('en-IN')}
              </span>
            </div>
            <div>
              <span className="text-white/60 block text-[10px]">Net Customer Cost</span>
              <span className="font-bold text-white text-sm">
                ₹{calculation.netCustomerCost.toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        </div>

        {/* Next Action Button */}
        <div className="pt-2">
          <button
            onClick={() => {
              toast.success('Quotation generated successfully!');
              router.push('/dashboard');
            }}
            style={{
              backgroundColor: theme.hex.accentBg,
              color: theme.hex.accentTextColor,
            }}
            className="w-full py-4 font-bold text-sm rounded-2xl shadow-soft flex items-center justify-center gap-2 transition-all hover:opacity-90 active:scale-98 cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span>Next: review quotation</span>
          </button>
        </div>
      </div>
    </div>
  );
}

