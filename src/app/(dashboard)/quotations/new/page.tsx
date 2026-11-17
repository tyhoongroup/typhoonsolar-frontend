'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  ChevronLeft,
  Send,
  Check,
  FileText,
  Calculator,
  Calendar,
  CheckCircle2,
  Download,
  Eye,
  IndianRupee,
  Sparkles,
  Zap,
  Sun,
  ShieldCheck,
  X,
} from 'lucide-react';
import { toast } from 'sonner';
import { useCurrentUser } from '@/lib/use-current-user';

export default function NewQuotationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryInquiryId = searchParams.get('inquiryId') || 'F-1026';
  const { user, theme } = useCurrentUser();

  const [inquiry, setInquiry] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [savedQuote, setSavedQuote] = useState<any>(null);
  const [showPdfModal, setShowPdfModal] = useState(false);

  // Form Inputs matching Excel 'Input Information' sheet
  const [panelMaker, setPanelMaker] = useState('Waaree');
  const [panelTech, setPanelTech] = useState<'Topcon' | 'Bi-facial' | 'Monocrystalline' | 'Polycrystalline'>('Topcon');
  const [wattage, setWattage] = useState(580); // Wp
  const [numPanels, setNumPanels] = useState(6);
  const [inverterMaker, setInverterMaker] = useState('Growatt');
  const [inverterKw, setInverterKw] = useState(3.3);
  const [meterPhase, setMeterPhase] = useState<'Single Phase' | 'Three Phase'>('Single Phase');
  const [totalProjectCostQ, setTotalProjectCostQ] = useState(175000); // Column Q: manually entered

  // Follow-up & Description fields
  const [description, setDescription] = useState('Quotation prepared based on terrace survey and 580W Topcon modules.');
  const [nextStep, setNextStep] = useState('Share quotation on WhatsApp and discuss financing');
  const [nextFollowupDate, setNextFollowupDate] = useState('8 November 2026');

  // Load Inquiry data
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

    fetch(`/api/v1/inquiries/${queryInquiryId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        const item = data?.data || data;
        if (item) {
          setInquiry(item);
          if (item.meterPhase) {
            setMeterPhase(item.meterPhase.toLowerCase().includes('three') ? 'Three Phase' : 'Single Phase');
          }
          if (item.requestedKw) {
            const reqKw = Number(item.requestedKw);
            const panels = Math.round((reqKw * 1000) / 580);
            setNumPanels(panels > 0 ? panels : 6);
            setTotalProjectCostQ(Math.round(reqKw * 50000));
            setInverterKw(reqKw <= 3 ? 3.3 : reqKw <= 5 ? 5.0 : 6.0);
          }
        }
      })
      .catch(() => {});
  }, [queryInquiryId, router]);

  // Live Formula Calculations matching Excel sheet:
  // N: Capacity (kWp) = (Wattage * Panels) / 1000
  const capacityKw = Number(((wattage * numPanels) / 1000).toFixed(3));

  // T: Meter charges (Single = Rs 2,950; Three = Rs 4,950)
  const meterChargeT = meterPhase === 'Single Phase' ? 2950 : 4950;

  // R: System cost = Q - T
  const systemCostR = Math.max(0, totalProjectCostQ - meterChargeT);

  // S: Rate / kW = R / N
  const ratePerKwS = capacityKw > 0 ? Math.round(systemCostR / capacityKw) : 0;

  // U: Subsidy up to 2 kW (Rs 30k/kW, max Rs 60k)
  const subsidyU = capacityKw <= 2 ? Math.round(capacityKw * 30000) : 60000;

  // V: Subsidy 2-3 kW (Rs 18k)
  const subsidyV = capacityKw < 2 ? 0 : capacityKw > 3 ? 18000 : Math.round((capacityKw - 2) * 18000);

  // W: Total Subsidy = U + V (Max Rs 78,000)
  const totalSubsidyW = Math.min(78000, subsidyU + subsidyV);

  // X: Cost after subsidy = Q - W
  const costAfterSubsidyX = Math.max(0, totalProjectCostQ - totalSubsidyW);

  // Y: 1st payment = 80% of Q
  const firstPayment80Y = Math.round(totalProjectCostQ * 0.8);

  // Z: Final payment = Q - Y (20%)
  const finalPayment20Z = totalProjectCostQ - firstPayment80Y;

  // Sun-hours: 4.5 for Bifacial/Topcon, 4.2 for Mono, 3.8 for Poly
  const sunHours =
    panelTech === 'Topcon' || panelTech === 'Bi-facial'
      ? 4.5
      : panelTech === 'Monocrystalline'
      ? 4.2
      : 3.8;

  // AA: Annual generation = kWp * sun-hours * 365
  const annualGenerationKwhAA = Math.round(capacityKw * sunHours * 365);

  // AC: Annual savings = units * Rs 7.50
  const annualSavingsRsAC = Math.round(annualGenerationKwhAA * 7.5);

  // AD: Payback = cost after subsidy / annual savings
  const paybackYearsAD = annualSavingsRsAC > 0 ? Number((costAfterSubsidyX / annualSavingsRsAC).toFixed(2)) : 0;

  // AF: CO2 = units * 0.85 / 1000 tonnes
  const co2TonnesAF = Number(((annualGenerationKwhAA * 0.85) / 1000).toFixed(2));

  // AE: Trees = CO2 * 1000 / 21.77
  const treesSavedAE = Math.round((co2TonnesAF * 1000) / 21.77);

  // Save Quotation to Backend
  const handleSaveQuotation = async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      toast.error('Session expired. Please sign in again.');
      router.push('/');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/v1/quotations/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          inquiryId: inquiry?.id || queryInquiryId,
          panelBrand: panelMaker,
          panelTech,
          panelWattage: wattage,
          panelQuantity: numPanels,
          inverterBrand: inverterMaker,
          inverterCapacityKw: inverterKw,
          grossCost: totalProjectCostQ,
          stateSubsidy: 0,
        }),
      });

      const resData = await res.json();
      if (!res.ok) {
        throw new Error(resData.message || 'Failed to save quotation.');
      }

      setSavedQuote(resData);
      toast.success('Quotation saved successfully & stage updated to Quotation Sent!');
      return resData;
    } catch (err: any) {
      toast.error(err.message || 'Error saving quotation.');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // WhatsApp Send Action
  const handleSendWhatsApp = async () => {
    // Save quotation first if not already saved
    let quote = savedQuote;
    if (!quote) {
      quote = await handleSaveQuotation();
    }

    const custPhone = inquiry?.customerPhone?.replace(/\D/g, '') || '9825012345';
    const custName = inquiry?.customerName || 'Valued Customer';
    const quoteNo = quote?.quotationNo || `TSS/2627/${queryInquiryId}`;

    const messageText = `Namaste ${custName},\n\nGreetings from *Typhoon Solar*!\n\nHere is your official Rooftop Solar Quotation (${quoteNo}):\n• System Capacity: *${capacityKw} kWp* (${numPanels} x ${wattage}W ${panelMaker} ${panelTech})\n• Inverter: *${inverterKw} kW ${inverterMaker}*\n• Meter: *${meterPhase}*\n• Total Project Cost: *₹${totalProjectCostQ.toLocaleString('en-IN')}*\n• Central Subsidy (PM Surya Ghar): *₹${totalSubsidyW.toLocaleString('en-IN')}*\n• Net Investment after Subsidy: *₹${costAfterSubsidyX.toLocaleString('en-IN')}*\n\n*Payment Terms:*\n• 1st Payment (80%): ₹${firstPayment80Y.toLocaleString('en-IN')}\n• Final Payment (20%): ₹${finalPayment20Z.toLocaleString('en-IN')}\n\n*Savings & Payback:*\n• Annual Generation: *${annualGenerationKwhAA.toLocaleString('en-IN')} Units/year*\n• Annual Savings: *₹${annualSavingsRsAC.toLocaleString('en-IN')}/year*\n• Estimated Payback: *${paybackYearsAD} Years*\n• CO₂ Reduction: *${co2TonnesAF} Tonnes (${treesSavedAE} trees saved)*\n\nFor official quotation sheet PDF & rooftop installation details, reply to this message.\n\n*Typhoon Solar - Clean Energy, Smarter Savings*`;

    const encodedMsg = encodeURIComponent(messageText);
    const waUrl = `https://wa.me/91${custPhone}?text=${encodedMsg}`;

    toast.success('Opening WhatsApp with prefilled quotation breakdown...');
    window.open(waUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-typhoon-sand pb-28">
      {/* 1. Curved Header */}
      <div
        style={{ backgroundColor: theme.hex.headerBg }}
        className="pt-6 pb-8 px-5 rounded-b-[32px] shadow-soft relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 border border-white/5 rounded-full pointer-events-none -mr-16 -mt-16" />
        <div className="absolute top-0 right-0 w-44 h-44 border border-white/5 rounded-full pointer-events-none -mr-8 -mt-8" />

        <div className="max-w-2xl mx-auto">
          <button
            type="button"
            onClick={() => router.back()}
            className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition mb-3 cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <h1 className="text-3xl font-serif font-bold text-white tracking-tight">
            Quotation engine
          </h1>
          <p className="text-xs text-white/70 mt-1 font-medium">
            {inquiry?.followupId || queryInquiryId} · {inquiry?.customerName || 'Customer Lead'} · PM Surya Ghar Subsidy
          </p>
        </div>
      </div>

      {/* 2. Main Content Container */}
      <div className="max-w-2xl mx-auto px-4 pt-4 space-y-4">
        {/* Customer Header Card */}
        <div className="bg-white rounded-2xl p-4 border border-typhoon-border shadow-soft flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold tracking-widest text-typhoon-muted uppercase block">
              QUOTATION FOR
            </span>
            <h3 className="text-base font-bold text-typhoon-navy">
              {inquiry?.customerName || 'Ramesh Patel'}
            </h3>
            <p className="text-xs text-typhoon-muted">
              +91 {inquiry?.customerPhone || '9825012345'} · {inquiry?.city || 'Vadodara'}
            </p>
          </div>
          <span className="text-xs font-bold px-3 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded-full">
            Stage 3: Quotation
          </span>
        </div>

        {/* SECTION 1: SYSTEM INPUTS */}
        <div className="bg-white rounded-2xl p-5 border border-typhoon-border shadow-soft space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-typhoon-border/60">
            <h3 className="text-xs font-bold tracking-widest text-typhoon-navy uppercase flex items-center gap-2">
              <Sun className="w-4 h-4 text-typhoon-gold-dark" />
              <span>1. SYSTEM CONFIGURATION & INPUTS</span>
            </h3>
            <span className="text-[10px] text-typhoon-muted font-mono">TSS Quotation Sheet</span>
          </div>

          {/* Panel Maker & Technology */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-typhoon-navy block mb-1">
                Panel Brand / Maker
              </label>
              <select
                value={panelMaker}
                onChange={(e) => setPanelMaker(e.target.value)}
                className="w-full p-3 rounded-xl border border-typhoon-border bg-typhoon-sand/30 font-semibold text-xs text-typhoon-navy outline-none focus:ring-2 focus:ring-typhoon-gold"
              >
                <option value="Waaree">Waaree</option>
                <option value="Adani">Adani</option>
                <option value="Tata">Tata Power</option>
                <option value="Goldi">Goldi Solar</option>
                <option value="Rayzon">Rayzon Solar</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-typhoon-navy block mb-1">
                Cell Technology
              </label>
              <select
                value={panelTech}
                onChange={(e) => setPanelTech(e.target.value as any)}
                className="w-full p-3 rounded-xl border border-typhoon-border bg-typhoon-sand/30 font-semibold text-xs text-typhoon-navy outline-none focus:ring-2 focus:ring-typhoon-gold"
              >
                <option value="Topcon">Topcon (4.5 sun-hrs)</option>
                <option value="Bi-facial">Bi-facial (4.5 sun-hrs)</option>
                <option value="Monocrystalline">Monocrystalline (4.2 hrs)</option>
                <option value="Polycrystalline">Polycrystalline (3.8 hrs)</option>
              </select>
            </div>
          </div>

          {/* Wattage & Number of Panels */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-typhoon-navy block mb-1">
                Panel Wattage (Wp)
              </label>
              <select
                value={wattage}
                onChange={(e) => setWattage(Number(e.target.value))}
                className="w-full p-3 rounded-xl border border-typhoon-border bg-typhoon-sand/30 font-semibold text-xs text-typhoon-navy outline-none focus:ring-2 focus:ring-typhoon-gold"
              >
                <option value={540}>540 Wp</option>
                <option value={550}>550 Wp</option>
                <option value={580}>580 Wp (Recommended)</option>
                <option value={600}>600 Wp</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-typhoon-navy block mb-1">
                Number of Panels
              </label>
              <input
                type="number"
                min={1}
                max={100}
                value={numPanels}
                onChange={(e) => setNumPanels(Number(e.target.value))}
                className="w-full p-3 rounded-xl border border-typhoon-border bg-typhoon-sand/30 font-bold text-xs text-typhoon-navy outline-none focus:ring-2 focus:ring-typhoon-gold"
              />
            </div>
          </div>

          {/* Inverter Maker & Size */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-typhoon-navy block mb-1">
                Inverter Maker
              </label>
              <select
                value={inverterMaker}
                onChange={(e) => setInverterMaker(e.target.value)}
                className="w-full p-3 rounded-xl border border-typhoon-border bg-typhoon-sand/30 font-semibold text-xs text-typhoon-navy outline-none focus:ring-2 focus:ring-typhoon-gold"
              >
                <option value="Growatt">Growatt</option>
                <option value="Solis">Solis</option>
                <option value="Sungrow">Sungrow</option>
                <option value="Deye">Deye</option>
                <option value="Polycab">Polycab</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-typhoon-navy block mb-1">
                Inverter Size (kW)
              </label>
              <select
                value={inverterKw}
                onChange={(e) => setInverterKw(Number(e.target.value))}
                className="w-full p-3 rounded-xl border border-typhoon-border bg-typhoon-sand/30 font-semibold text-xs text-typhoon-navy outline-none focus:ring-2 focus:ring-typhoon-gold"
              >
                <option value={2.2}>2.2 kW</option>
                <option value={3.3}>3.3 kW</option>
                <option value={4.2}>4.2 kW</option>
                <option value={5.0}>5.0 kW</option>
                <option value={6.0}>6.0 kW</option>
                <option value={10.0}>10.0 kW</option>
                <option value={15.0}>15.0 kW</option>
              </select>
            </div>
          </div>

          {/* Meter Phase & Total Project Cost (Q) */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div>
              <label className="text-xs font-bold text-typhoon-navy block mb-1">
                Meter Phase (T)
              </label>
              <select
                value={meterPhase}
                onChange={(e) => setMeterPhase(e.target.value as any)}
                className="w-full p-3 rounded-xl border border-typhoon-border bg-typhoon-sand/30 font-semibold text-xs text-typhoon-navy outline-none focus:ring-2 focus:ring-typhoon-gold"
              >
                <option value="Single Phase">Single Phase (₹2,950)</option>
                <option value="Three Phase">Three Phase (₹4,950)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-typhoon-navy block mb-1">
                Total Project Cost (Q) ₹
              </label>
              <input
                type="number"
                value={totalProjectCostQ}
                onChange={(e) => setTotalProjectCostQ(Number(e.target.value))}
                className="w-full p-3 rounded-xl border border-typhoon-border bg-white font-bold text-xs text-typhoon-navy outline-none focus:ring-2 focus:ring-typhoon-gold"
                placeholder="175000"
              />
            </div>
          </div>
        </div>

        {/* SECTION 2: LIVE PRICING & FORMULA BREAKDOWN (Excel Exact Match) */}
        <div className="bg-typhoon-navy text-white rounded-2xl p-5 shadow-soft space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div>
              <span className="text-[10px] font-bold tracking-widest text-typhoon-gold uppercase block">
                EXCEL FORMULA BREAKDOWN & PRICING
              </span>
              <h2 className="text-2xl font-serif font-bold text-white tracking-tight">
                {capacityKw} kWp · Net ₹{costAfterSubsidyX.toLocaleString('en-IN')}
              </h2>
            </div>
            <span className="text-xs font-mono bg-white/10 px-2.5 py-1 rounded-lg text-white/80">
              {panelTech}
            </span>
          </div>

          {/* Formula Table with Small Explanations */}
          <div className="grid grid-cols-2 gap-2.5 text-xs">
            {/* 1. Capacity */}
            <div className="bg-white/5 p-3 rounded-xl border border-white/10">
              <span className="text-[10px] text-white/60 block">Capacity (N) = Watt × Panels / 1000</span>
              <span className="font-bold text-white text-sm">{capacityKw} kWp</span>
            </div>

            {/* 2. Meter Charge */}
            <div className="bg-white/5 p-3 rounded-xl border border-white/10">
              <span className="text-[10px] text-white/60 block">Meter Charges (T)</span>
              <span className="font-bold text-white text-sm">₹{meterChargeT.toLocaleString('en-IN')}</span>
            </div>

            {/* 3. System Cost */}
            <div className="bg-white/5 p-3 rounded-xl border border-white/10">
              <span className="text-[10px] text-white/60 block">System Cost (R) = Q - T</span>
              <span className="font-bold text-white text-sm">₹{systemCostR.toLocaleString('en-IN')}</span>
            </div>

            {/* 4. Rate per kW */}
            <div className="bg-white/5 p-3 rounded-xl border border-white/10">
              <span className="text-[10px] text-white/60 block">Rate / kW (S) = R / N</span>
              <span className="font-bold text-white text-sm">₹{ratePerKwS.toLocaleString('en-IN')} / kW</span>
            </div>

            {/* 5. Central Subsidy */}
            <div className="bg-white/5 p-3 rounded-xl border border-white/10">
              <span className="text-[10px] text-typhoon-gold block">PM Surya Ghar Subsidy (W = U + V)</span>
              <span className="font-bold text-typhoon-gold text-sm">₹{totalSubsidyW.toLocaleString('en-IN')}</span>
            </div>

            {/* 6. Net Customer Cost */}
            <div className="bg-white/5 p-3 rounded-xl border border-white/10">
              <span className="text-[10px] text-emerald-400 block">Net Cost (X) = Q - W</span>
              <span className="font-bold text-emerald-400 text-sm">₹{costAfterSubsidyX.toLocaleString('en-IN')}</span>
            </div>

            {/* 7. 1st Payment */}
            <div className="bg-white/5 p-3 rounded-xl border border-white/10">
              <span className="text-[10px] text-white/60 block">1st Payment 80% (Y) = 80% of Q</span>
              <span className="font-bold text-white text-sm">₹{firstPayment80Y.toLocaleString('en-IN')}</span>
            </div>

            {/* 8. Final Payment */}
            <div className="bg-white/5 p-3 rounded-xl border border-white/10">
              <span className="text-[10px] text-white/60 block">Final Payment 20% (Z) = Q - Y</span>
              <span className="font-bold text-white text-sm">₹{finalPayment20Z.toLocaleString('en-IN')}</span>
            </div>
          </div>

          {/* Environmental & Financial Metrics */}
          <div className="pt-3 border-t border-white/10 grid grid-cols-3 gap-2 text-center text-xs">
            <div className="bg-white/5 p-2 rounded-xl">
              <span className="text-[10px] text-white/60 block">Annual Units (AA)</span>
              <span className="font-bold text-white text-xs">{annualGenerationKwhAA.toLocaleString('en-IN')} kWh</span>
            </div>
            <div className="bg-white/5 p-2 rounded-xl">
              <span className="text-[10px] text-white/60 block">Annual Savings (AC)</span>
              <span className="font-bold text-typhoon-gold text-xs">₹{annualSavingsRsAC.toLocaleString('en-IN')}</span>
            </div>
            <div className="bg-white/5 p-2 rounded-xl">
              <span className="text-[10px] text-white/60 block">Payback (AD)</span>
              <span className="font-bold text-emerald-400 text-xs">{paybackYearsAD} Years</span>
            </div>
          </div>
        </div>

        {/* SECTION 3: NEXT STEPS & NOTES */}
        <div className="bg-white rounded-2xl p-5 border border-typhoon-border shadow-soft space-y-3">
          <span className="text-[10px] font-bold tracking-widest text-typhoon-muted uppercase block">
            NEXT STEPS & FOLLOW-UP
          </span>

          <div className="space-y-1">
            <label className="text-xs font-bold text-typhoon-navy block">
              Quotation notes & next step
            </label>
            <input
              type="text"
              value={nextStep}
              onChange={(e) => setNextStep(e.target.value)}
              className="w-full p-3 rounded-xl border border-typhoon-border bg-typhoon-sand/30 font-medium text-xs text-typhoon-navy outline-none"
              placeholder="e.g. Share quotation on WhatsApp"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-typhoon-navy block">
              Follow-up commitment date
            </label>
            <div className="p-3 rounded-xl border border-typhoon-border bg-typhoon-sand/30 flex items-center justify-between text-xs">
              <input
                type="text"
                value={nextFollowupDate}
                onChange={(e) => setNextFollowupDate(e.target.value)}
                className="bg-transparent font-medium text-typhoon-navy outline-none w-full"
              />
              <Calendar className="w-4 h-4 text-typhoon-muted ml-2 flex-shrink-0" />
            </div>
          </div>
        </div>

        {/* SECTION 4: ACTIONS */}
        <div className="pt-2 space-y-3">
          {/* Centered WhatsApp Button with WhatsApp Icon in Center */}
          <button
            type="button"
            onClick={handleSendWhatsApp}
            className="w-full py-4 px-6 rounded-2xl bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-sm shadow-soft flex items-center justify-center gap-2.5 transition active:scale-98 cursor-pointer"
          >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.669-.699c.969.54 1.772.82 2.791.82 3.181 0 5.767-2.586 5.768-5.766 0-3.18-2.587-5.766-5.768-5.766zm0 10.375c-.886 0-1.637-.247-2.315-.658l-.165-.098-1.58.414.422-1.54-.108-.172c-.446-.71-.68-1.442-.68-2.555 0-2.54 2.067-4.607 4.608-4.607 2.54 0 4.608 2.067 4.608 4.607 0 2.54-2.068 4.609-4.608 4.609zm7.969-4.609c0 4.418-3.582 8-8 8-1.408 0-2.727-.365-3.873-1.002l-4.127 1.08 1.1-4.017c-.71-1.218-1.1-2.628-1.1-4.061 0-4.418 3.582-8 8-8s8 3.582 8 8z" />
            </svg>
            <span>Send quotation on WhatsApp</span>
          </button>

          {/* Save & View PDF buttons */}
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={handleSaveQuotation}
              disabled={loading}
              className="py-3.5 px-4 rounded-2xl bg-white hover:bg-typhoon-sand border border-typhoon-border text-typhoon-navy font-bold text-xs shadow-soft flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{loading ? 'Saving...' : 'Save Quotation'}</span>
            </button>

            <button
              type="button"
              onClick={() => setShowPdfModal(true)}
              className="py-3.5 px-4 rounded-2xl bg-white hover:bg-typhoon-sand border border-typhoon-border text-typhoon-navy font-bold text-xs shadow-soft flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <Eye className="w-4 h-4 text-typhoon-navy" />
              <span>Preview PDF Sheet</span>
            </button>
          </div>

          {/* Proceed to Inquiry / Deal Closed button */}
          <button
            type="button"
            onClick={() => router.push(`/inquiries/${inquiry?.followupId || queryInquiryId}`)}
            style={{
              backgroundColor: theme.hex.accentBg,
              color: theme.hex.accentTextColor,
            }}
            className="w-full py-3.5 px-4 rounded-2xl font-bold text-xs shadow-soft flex items-center justify-center gap-2 transition cursor-pointer hover:opacity-95"
          >
            <span>Return to Inquiry & Close Deal</span>
          </button>
        </div>
      </div>

      {/* ================================================================ */}
      {/* PDF SHEET PREVIEW MODAL                                          */}
      {/* ================================================================ */}
      {showPdfModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-xs">
          <div className="bg-white w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl p-6 border border-typhoon-border shadow-2xl space-y-4">
            {/* Header */}
            <div className="flex justify-between items-start pb-3 border-b border-typhoon-border/60">
              <div>
                <span className="text-[10px] font-bold text-typhoon-gold-dark tracking-widest uppercase block">
                  TYPHOON SOLAR RESIDENTIAL QUOTATION
                </span>
                <h3 className="text-xl font-serif font-bold text-typhoon-navy">
                  Quotation TSS/2627/{inquiry?.followupId || '393'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowPdfModal(false)}
                className="w-8 h-8 rounded-full bg-typhoon-sand flex items-center justify-center text-typhoon-navy hover:bg-typhoon-sand-dark transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* PDF Styled Sheet Content */}
            <div className="space-y-4 text-xs">
              {/* Customer Box */}
              <div className="grid grid-cols-2 gap-3 bg-typhoon-sand/40 p-4 rounded-xl border border-typhoon-border/70">
                <div>
                  <span className="text-[10px] text-typhoon-muted block">Customer Name</span>
                  <span className="font-bold text-typhoon-navy text-sm">{inquiry?.customerName || 'Ramesh Patel'}</span>
                </div>
                <div>
                  <span className="text-[10px] text-typhoon-muted block">Location</span>
                  <span className="font-bold text-typhoon-navy text-sm">{inquiry?.city || 'Vadodara, Gujarat'}</span>
                </div>
                <div>
                  <span className="text-[10px] text-typhoon-muted block">System Capacity</span>
                  <span className="font-bold text-typhoon-navy text-sm">{capacityKw} kWp</span>
                </div>
                <div>
                  <span className="text-[10px] text-typhoon-muted block">Grid Meter</span>
                  <span className="font-bold text-typhoon-navy text-sm">{meterPhase}</span>
                </div>
              </div>

              {/* Equipment Breakdown */}
              <div className="border border-typhoon-border rounded-xl p-3.5 space-y-2">
                <h4 className="font-bold text-typhoon-navy text-xs border-b pb-1">Equipment Specifications</h4>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div>Solar Panels: <span className="font-semibold text-typhoon-navy">{numPanels} × {wattage}W {panelMaker} ({panelTech})</span></div>
                  <div>Inverter: <span className="font-semibold text-typhoon-navy">{inverterKw} kW {inverterMaker} On-Grid</span></div>
                  <div>DISCOM Meter Charges: <span className="font-semibold text-typhoon-navy">₹{meterChargeT.toLocaleString('en-IN')}</span></div>
                  <div>Structure: <span className="font-semibold text-typhoon-navy">Hot Dip Galvanized MS / Elevated</span></div>
                </div>
              </div>

              {/* Financial Breakdown Table */}
              <div className="border border-typhoon-border rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-typhoon-sand text-typhoon-navy font-bold">
                    <tr>
                      <th className="p-2.5">Component</th>
                      <th className="p-2.5 text-right">Amount (₹)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-typhoon-border/60">
                    <tr>
                      <td className="p-2.5">Total Project Cost (Turnkey)</td>
                      <td className="p-2.5 text-right font-bold text-typhoon-navy">₹{totalProjectCostQ.toLocaleString('en-IN')}</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 text-emerald-700">Less: PM Surya Ghar Subsidy (DBT Direct)</td>
                      <td className="p-2.5 text-right font-bold text-emerald-700">- ₹{totalSubsidyW.toLocaleString('en-IN')}</td>
                    </tr>
                    <tr className="bg-typhoon-sand/40 font-bold">
                      <td className="p-2.5 text-typhoon-navy">Net Investment to Customer</td>
                      <td className="p-2.5 text-right text-sm text-typhoon-navy">₹{costAfterSubsidyX.toLocaleString('en-IN')}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Generation & Payback */}
              <div className="bg-emerald-50/60 border border-emerald-200 p-3.5 rounded-xl space-y-1.5">
                <h4 className="font-bold text-emerald-900 text-xs">Benefits & Return on Investment</h4>
                <p className="text-[11px] text-emerald-800">
                  Estimated annual solar generation: <span className="font-bold">{annualGenerationKwhAA.toLocaleString('en-IN')} Units</span>, resulting in annual electricity bill savings of <span className="font-bold">₹{annualSavingsRsAC.toLocaleString('en-IN')}</span>.
                </p>
                <p className="text-[11px] text-emerald-800">
                  Full investment payback period: <span className="font-bold">{paybackYearsAD} Years</span> with 25 years panel warranty.
                </p>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  window.print();
                }}
                className="px-4 py-2.5 rounded-xl bg-typhoon-sand hover:bg-typhoon-sand-dark text-typhoon-navy font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Print / Download PDF</span>
              </button>

              <button
                type="button"
                onClick={() => setShowPdfModal(false)}
                className="px-4 py-2.5 rounded-xl bg-typhoon-navy text-white font-bold text-xs transition cursor-pointer hover:bg-typhoon-navy-light"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
