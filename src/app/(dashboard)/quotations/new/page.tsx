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
  Package,
  Layers,
  ArrowRight,
  Clock,
} from 'lucide-react';
import { toast } from 'sonner';
import { useCurrentUser } from '@/lib/use-current-user';
import { QuotationPdfPreview, BomItem } from '@/components/QuotationPdfPreview';

export default function NewQuotationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryInquiryId = searchParams.get('inquiryId') || 'F-1026';
  const { user, theme } = useCurrentUser();

  const [inquiry, setInquiry] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [savedQuote, setSavedQuote] = useState<any>(null);
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [activeStep, setActiveStep] = useState<1 | 2>(1);

  // Form Inputs matching Excel 'Input Information' sheet
  const [panelMaker, setPanelMaker] = useState('Waaree');
  const [panelTech, setPanelTech] = useState<'Topcon' | 'Bi-facial' | 'Monocrystalline' | 'Polycrystalline'>('Topcon');
  const [wattage, setWattage] = useState(580); // Wp
  const [numPanels, setNumPanels] = useState(10);
  const [inverterMaker, setInverterMaker] = useState('Growatt');
  const [inverterKw, setInverterKw] = useState(6.0);
  const [meterPhase, setMeterPhase] = useState<'Single Phase' | 'Three Phase'>('Single Phase');
  const [totalProjectCostQ, setTotalProjectCostQ] = useState(300000); // Column Q

  // Remarks / Description
  const [description, setDescription] = useState('Quotation prepared with standard 580W Topcon modules and Aykka standard BOM.');

  // Step 2: 29 Standard BOM Items
  const [bomList, setBomList] = useState<BomItem[]>([
    { srNo: 1, name: 'Solar Panel', qty: 10, uom: 'No', rate: 12000, remarks: 'Waaree Topcon 580W' },
    { srNo: 2, name: 'Inverter', qty: 1, uom: 'No', rate: 35000, remarks: 'Growatt 6.0 kW On-Grid' },
    { srNo: 3, name: 'GI Pipe 40/40', qty: 5, uom: 'No', rate: 950, remarks: 'Galvanised Iron 2mm' },
    { srNo: 4, name: 'GI Pipe 50/40', qty: 5, uom: 'No', rate: 1150, remarks: 'Heavy leg column' },
    { srNo: 5, name: 'GI Pipe 25/25', qty: 3, uom: 'No', rate: 650, remarks: 'Cross purlin bar' },
    { srNo: 6, name: 'MC4 Connector', qty: 5, uom: 'No', rate: 80, remarks: 'IP67 waterproof pair' },
    { srNo: 7, name: 'PVC Pipe', qty: 25, uom: 'No', rate: 120, remarks: '25mm rigid conduit' },
    { srNo: 8, name: 'PVC Elbow', qty: 35, uom: 'No', rate: 25, remarks: 'Conduit corner bend' },
    { srNo: 9, name: 'PVC T', qty: 5, uom: 'No', rate: 30, remarks: 'Tee junction' },
    { srNo: 10, name: 'Saddle (Cable Clip) 25 sqmm white', qty: 1, uom: 'No', rate: 150, remarks: 'Pack of 100 clips' },
    { srNo: 11, name: 'J Hook M8X40X40', qty: 28, uom: 'No', rate: 45, remarks: 'SS 304 roof hook' },
    { srNo: 12, name: 'Polycab 2.5 Green Earthing Cable', qty: 30, uom: 'Mtr', rate: 42, remarks: 'Copper earthing' },
    { srNo: 13, name: 'Polycab 4sqmm Black AC Cable', qty: 25, uom: 'Mtr', rate: 55, remarks: 'AC neutral' },
    { srNo: 14, name: 'Polycab 4sqmm Red AC Cable', qty: 25, uom: 'Mtr', rate: 55, remarks: 'AC phase' },
    { srNo: 15, name: 'UV Cable Tie', qty: 1, uom: 'No', rate: 180, remarks: 'Virgin nylon pack' },
    { srNo: 16, name: 'Polycab 4sqmm Black DC Cable', qty: 30, uom: 'Mtr', rate: 68, remarks: 'Solar negative string' },
    { srNo: 17, name: 'Polycab 4sqmm Red DC Cable', qty: 30, uom: 'Mtr', rate: 68, remarks: 'Solar positive string' },
    { srNo: 18, name: 'LA Cable', qty: 15, uom: 'Mtr', rate: 48, remarks: 'Lightning arrester' },
    { srNo: 19, name: 'ACDB-DCDB Box', qty: 2, uom: 'No', rate: 3200, remarks: 'IP65 dual box' },
    { srNo: 20, name: '400 ML Color Zinc Spray', qty: 1, uom: 'No', rate: 320, remarks: 'Anti-corrosion spray' },
    { srNo: 21, name: 'MS Base Plate', qty: 4, uom: 'No', rate: 280, remarks: 'Anchor base foot' },
    { srNo: 22, name: 'Earthing Chemical Bag', qty: 1, uom: 'No', rate: 450, remarks: 'BFC chemical compound' },
    { srNo: 23, name: 'Earthing Kit 1 Mtr', qty: 2, uom: 'No', rate: 1200, remarks: 'Pure copper-bonded rod' },
    { srNo: 24, name: '4sqmm Copper Lug', qty: 12, uom: 'No', rate: 15, remarks: 'Tinned copper' },
    { srNo: 25, name: '2.5 Copper Lug', qty: 10, uom: 'No', rate: 12, remarks: 'Terminal crimp' },
    { srNo: 26, name: 'Polycab 4Cx2.50sqmm AC Cable', qty: 20, uom: 'Mtr', rate: 85, remarks: 'Main grid feeder' },
    { srNo: 27, name: 'Flexible Pipe (PICA PIPE)', qty: 5, uom: 'Mtr', rate: 60, remarks: 'Inverter flexible run' },
    { srNo: 28, name: 'Nails / Fasteners', qty: 50, uom: 'No', rate: 8, remarks: 'Expansion anchor bolts' },
    { srNo: 29, name: 'Grouting (Foundation) Ready Mix', qty: 4, uom: 'No', rate: 350, remarks: 'Non-shrink grout bag' },
  ]);

  // Update BOM item when panel quantity changes
  useEffect(() => {
    setBomList((prev) =>
      prev.map((item) => {
        if (item.srNo === 1) return { ...item, qty: numPanels, remarks: `${panelMaker} ${panelTech} ${wattage}W` };
        if (item.srNo === 2) return { ...item, remarks: `${inverterMaker} ${inverterKw} kW` };
        return item;
      })
    );
  }, [numPanels, panelMaker, panelTech, wattage, inverterMaker, inverterKw]);

  // Load Inquiry data
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      router.push('/');
      return;
    }

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
            setNumPanels(panels > 0 ? panels : 10);
            setTotalProjectCostQ(Math.round(reqKw * 50000));
            setInverterKw(reqKw <= 3 ? 3.3 : reqKw <= 5 ? 5.0 : 6.0);
          }
        }
      })
      .catch(() => {});
  }, [queryInquiryId, router]);

  // Live Formula Calculations matching Excel sheet:
  const capacityKw = Number(((wattage * numPanels) / 1000).toFixed(3));
  const meterChargeT = meterPhase === 'Single Phase' ? 2950 : 4950;
  const systemCostR = Math.max(0, totalProjectCostQ - meterChargeT);
  const ratePerKwS = capacityKw > 0 ? Math.round(systemCostR / capacityKw) : 0;
  const subsidyU = capacityKw <= 2 ? Math.round(capacityKw * 30000) : 60000;
  const subsidyV = capacityKw < 2 ? 0 : capacityKw > 3 ? 18000 : Math.round((capacityKw - 2) * 18000);
  const totalSubsidyW = Math.min(78000, subsidyU + subsidyV);
  const costAfterSubsidyX = Math.max(0, totalProjectCostQ - totalSubsidyW);
  const firstPayment80Y = Math.round(totalProjectCostQ * 0.8);
  const finalPayment20Z = totalProjectCostQ - firstPayment80Y;

  const sunHours = panelTech === 'Topcon' || panelTech === 'Bi-facial' ? 4.5 : 4.2;
  const annualGenerationKwhAA = Math.round(capacityKw * sunHours * 365);
  const annualSavingsRsAC = Math.round(annualGenerationKwhAA * 7.5);
  const paybackYearsAD = annualSavingsRsAC > 0 ? Number((costAfterSubsidyX / annualSavingsRsAC).toFixed(2)) : 0;
  const co2TonnesAF = Number(((annualGenerationKwhAA * 0.85) / 1000).toFixed(2));
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
    let quote = savedQuote;
    if (!quote) {
      quote = await handleSaveQuotation();
    }

    const custPhone = inquiry?.customerPhone?.replace(/\D/g, '') || '9825012345';
    const custName = inquiry?.customerName || 'Valued Customer';
    const quoteNo = quote?.quotationNo || `TSS/2627/${queryInquiryId}`;

    const messageText = `Namaste ${custName},\n\nGreetings from *Typhoon Solar*!\n\nHere is your official Rooftop Solar Quotation (${quoteNo}):\n• System Capacity: *${capacityKw} kWp* (${numPanels} x ${wattage}W ${panelMaker} ${panelTech})\n• Inverter: *${inverterKw} kW ${inverterMaker}*\n• Grid Phase: *${meterPhase}*\n• Total Project Cost: *₹${totalProjectCostQ.toLocaleString('en-IN')}*\n• Central Subsidy (PM Surya Ghar): *₹${totalSubsidyW.toLocaleString('en-IN')}*\n• Net Investment after Subsidy: *₹${costAfterSubsidyX.toLocaleString('en-IN')}*\n\n*Payment Terms:*\n• 1st Payment (80%): ₹${firstPayment80Y.toLocaleString('en-IN')}\n• Final Payment (20%): ₹${finalPayment20Z.toLocaleString('en-IN')}\n\n*Savings & Payback:*\n• Annual Generation: *${annualGenerationKwhAA.toLocaleString('en-IN')} Units/year*\n• Annual Savings: *₹${annualSavingsRsAC.toLocaleString('en-IN')}/year*\n• Estimated Payback: *${paybackYearsAD} Years*\n\n*Typhoon Solar - Clean Energy, Smarter Savings*`;

    const encodedMsg = encodeURIComponent(messageText);
    const waUrl = `https://wa.me/91${custPhone}?text=${encodedMsg}`;

    toast.success('Opening WhatsApp with prefilled quotation breakdown...');
    window.open(waUrl, '_blank');
  };

  const handleUpdateBomItem = (srNo: number, field: 'qty' | 'rate' | 'remarks', val: any) => {
    setBomList((prev) =>
      prev.map((item) => (item.srNo === srNo ? { ...item, [field]: val } : item))
    );
  };

  return (
    <div className="min-h-screen bg-[#FBF8F3] pb-28">
      {/* 1. Top Header */}
      <div className="bg-[#0B1E36] text-white pt-6 pb-8 px-5 rounded-b-[32px] shadow-soft relative overflow-hidden">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center transition cursor-pointer hover:bg-white/20 text-white"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="bg-white px-4 py-1.5 rounded-full shadow-xs">
              <img
                src="/images/typhoon-logo.png"
                alt="Typhoon Solar"
                className="h-6 w-auto object-contain"
              />
            </div>
          </div>

          <h1 className="text-3xl font-serif font-bold text-white tracking-tight">
            Quotation engine
          </h1>
          <p className="text-xs text-white/70 mt-1 font-medium">
            {inquiry?.followupId || queryInquiryId} · {inquiry?.customerName || 'Customer Lead'} · PM Surya Ghar Subsidy
          </p>

          {/* 2-Step Nav Switcher */}
          <div className="grid grid-cols-2 gap-2 mt-4 bg-white/10 p-1 rounded-2xl">
            <button
              type="button"
              onClick={() => setActiveStep(1)}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                activeStep === 1
                  ? 'bg-[#F59E0B] text-[#0B1E36] shadow-sm'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              <Calculator className="w-4 h-4" />
              <span>1. System &amp; Pricing</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveStep(2)}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                activeStep === 2
                  ? 'bg-[#F59E0B] text-[#0B1E36] shadow-sm'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              <Package className="w-4 h-4" />
              <span>2. Standard BOM (29 Items)</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Main Content Container */}
      <div className="max-w-2xl mx-auto px-4 pt-4 space-y-4">
        {/* Customer Header Card */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-soft flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase block">
              QUOTATION FOR
            </span>
            <h3 className="text-base font-bold text-[#0B1E36]">
              {inquiry?.customerName || 'Ramesh Patel'}
            </h3>
            <p className="text-xs text-slate-500">
              +91 {inquiry?.customerPhone || '9825012345'} · {inquiry?.city || 'Vadodara'}
            </p>
          </div>
          <span className="text-xs font-bold px-3 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded-full">
            Stage 3: Quotation
          </span>
        </div>

        {/* STEP 1: SYSTEM INPUTS & PRICING */}
        {activeStep === 1 && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-soft space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h3 className="text-xs font-bold tracking-widest text-[#0B1E36] uppercase flex items-center gap-2">
                  <Sun className="w-4 h-4 text-amber-600" />
                  <span>SYSTEM CONFIGURATION &amp; INPUTS</span>
                </h3>
                <span className="text-[10px] text-slate-400 font-mono">TSS Excel Engine</span>
              </div>

              {/* Panel Maker & Technology */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-[#0B1E36] block mb-1">
                    Panel Brand / Maker
                  </label>
                  <select
                    value={panelMaker}
                    onChange={(e) => setPanelMaker(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 font-semibold text-xs text-[#0B1E36] outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="Waaree">Waaree</option>
                    <option value="Adani">Adani</option>
                    <option value="Tata">Tata Power</option>
                    <option value="Goldi">Goldi Solar</option>
                    <option value="Rayzon">Rayzon Solar</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-[#0B1E36] block mb-1">
                    Cell Technology
                  </label>
                  <select
                    value={panelTech}
                    onChange={(e) => setPanelTech(e.target.value as any)}
                    className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 font-semibold text-xs text-[#0B1E36] outline-none focus:ring-2 focus:ring-amber-500"
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
                  <label className="text-xs font-bold text-[#0B1E36] block mb-1">
                    Panel Wattage (Wp)
                  </label>
                  <select
                    value={wattage}
                    onChange={(e) => setWattage(Number(e.target.value))}
                    className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 font-semibold text-xs text-[#0B1E36] outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value={540}>540 Wp</option>
                    <option value={550}>550 Wp</option>
                    <option value={580}>580 Wp (Recommended)</option>
                    <option value={600}>600 Wp</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-[#0B1E36] block mb-1">
                    Number of Panels
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={100}
                    value={numPanels}
                    onChange={(e) => setNumPanels(Number(e.target.value))}
                    className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 font-bold text-xs text-[#0B1E36] outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              {/* Inverter Maker & Size */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-[#0B1E36] block mb-1">
                    Inverter Maker
                  </label>
                  <select
                    value={inverterMaker}
                    onChange={(e) => setInverterMaker(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 font-semibold text-xs text-[#0B1E36] outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="Growatt">Growatt</option>
                    <option value="Solis">Solis</option>
                    <option value="Sungrow">Sungrow</option>
                    <option value="Deye">Deye</option>
                    <option value="Polycab">Polycab</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-[#0B1E36] block mb-1">
                    Inverter Size (kW)
                  </label>
                  <select
                    value={inverterKw}
                    onChange={(e) => setInverterKw(Number(e.target.value))}
                    className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 font-semibold text-xs text-[#0B1E36] outline-none focus:ring-2 focus:ring-amber-500"
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
                  <label className="text-xs font-bold text-[#0B1E36] block mb-1">
                    Meter Phase (T)
                  </label>
                  <select
                    value={meterPhase}
                    onChange={(e) => setMeterPhase(e.target.value as any)}
                    className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 font-semibold text-xs text-[#0B1E36] outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="Single Phase">Single Phase (₹2,950)</option>
                    <option value="Three Phase">Three Phase (₹4,950)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-[#0B1E36] block mb-1">
                    Total Project Cost (Q) ₹
                  </label>
                  <input
                    type="number"
                    value={totalProjectCostQ}
                    onChange={(e) => setTotalProjectCostQ(Number(e.target.value))}
                    className="w-full p-3 rounded-xl border border-slate-200 bg-white font-bold text-xs text-[#0B1E36] outline-none focus:ring-2 focus:ring-amber-500"
                    placeholder="300000"
                  />
                </div>
              </div>
            </div>

            {/* LIVE PRICING BREAKDOWN */}
            <div className="bg-[#0B1E36] text-white rounded-2xl p-5 shadow-soft space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div>
                  <span className="text-[10px] font-bold tracking-widest text-[#F59E0B] uppercase block">
                    EXCEL FORMULA BREAKDOWN &amp; PRICING
                  </span>
                  <h2 className="text-2xl font-serif font-bold text-white tracking-tight">
                    {capacityKw} kWp · Net ₹{costAfterSubsidyX.toLocaleString('en-IN')}
                  </h2>
                </div>
                <span className="text-xs font-mono bg-white/10 px-2.5 py-1 rounded-lg text-white/80">
                  {panelTech}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2.5 text-xs">
                <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                  <span className="text-[10px] text-white/60 block">Capacity = Watt × Panels / 1000</span>
                  <span className="font-bold text-sm text-[#F59E0B]">{capacityKw} kWp</span>
                </div>

                <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                  <span className="text-[10px] text-white/60 block">Meter Charges</span>
                  <span className="font-bold text-sm text-white">₹{meterChargeT.toLocaleString('en-IN')}</span>
                </div>

                <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                  <span className="text-[10px] text-white/60 block">Central Subsidy</span>
                  <span className="font-bold text-sm text-emerald-400">₹{totalSubsidyW.toLocaleString('en-IN')}</span>
                </div>

                <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                  <span className="text-[10px] text-white/60 block">Net Customer Cost</span>
                  <span className="font-bold text-sm text-white">₹{costAfterSubsidyX.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setActiveStep(2)}
                className="w-full py-3 px-4 rounded-xl bg-[#F59E0B] hover:bg-amber-500 text-[#0B1E36] font-bold text-xs shadow-md flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <span>Proceed to Step 2: Standard BOM</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: STANDARD BOM PREPARE (AYKKA 29-ITEM LIST) */}
        {activeStep === 2 && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-soft space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div>
                  <h3 className="text-xs font-bold tracking-widest text-[#0B1E36] uppercase flex items-center gap-2">
                    <Package className="w-4 h-4 text-amber-600" />
                    <span>2. STANDARD BOM PREPARATION (AYKKA CHECKLIST)</span>
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">Predefined bill of materials. You can edit quantities and rates.</p>
                </div>
                <span className="text-xs font-bold px-2.5 py-1 bg-slate-100 text-[#0B1E36] rounded-lg">
                  29 Items
                </span>
              </div>

              {/* Responsive BOM Table */}
              <div className="border border-slate-200 rounded-xl overflow-hidden max-h-[460px] overflow-y-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-[#0B1E36] text-white sticky top-0 font-bold text-[11px]">
                    <tr>
                      <th className="py-2 px-2.5 text-center w-10">Sr</th>
                      <th className="py-2 px-2.5">Material</th>
                      <th className="py-2 px-2 text-center w-16">Qty</th>
                      <th className="py-2 px-2 text-center w-12">UOM</th>
                      <th className="py-2 px-2 text-right w-20">Rate (₹)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {bomList.map((item) => (
                      <tr key={item.srNo} className="hover:bg-slate-50">
                        <td className="py-2 px-2.5 text-center font-bold text-slate-400 text-[11px]">
                          {item.srNo}
                        </td>
                        <td className="py-2 px-2.5">
                          <span className="font-bold text-[#0B1E36] block text-xs">{item.name}</span>
                          <span className="text-[10px] text-slate-400 block truncate">{item.remarks}</span>
                        </td>
                        <td className="py-2 px-2 text-center">
                          <input
                            type="number"
                            min={0}
                            value={item.qty}
                            onChange={(e) => handleUpdateBomItem(item.srNo, 'qty', Number(e.target.value))}
                            className="w-14 py-1 px-1.5 text-center border border-slate-200 rounded-lg font-bold text-xs text-[#0B1E36] bg-slate-50 focus:bg-white outline-none"
                          />
                        </td>
                        <td className="py-2 px-2 text-center text-slate-500 font-medium text-[11px]">
                          {item.uom}
                        </td>
                        <td className="py-2 px-2 text-right">
                          <input
                            type="number"
                            min={0}
                            value={item.rate}
                            onChange={(e) => handleUpdateBomItem(item.srNo, 'rate', Number(e.target.value))}
                            className="w-20 py-1 px-1.5 text-right border border-slate-200 rounded-lg font-bold text-xs text-[#0B1E36] bg-slate-50 focus:bg-white outline-none"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Description & Remarks */}
              <div className="space-y-1 pt-2">
                <label className="text-xs font-bold text-[#0B1E36] block">
                  BOM Specifications &amp; Work Description
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 font-medium text-xs text-[#0B1E36] outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="Enter detailed quotation remarks..."
                />
              </div>

              <button
                type="button"
                onClick={() => setActiveStep(1)}
                className="text-xs font-bold text-slate-600 hover:text-[#0B1E36] flex items-center gap-1 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back to System Sizing &amp; Pricing</span>
              </button>
            </div>
          </div>
        )}

        {/* SECTION 4: ACTIONS (Shown after reviewing steps) */}
        <div className="pt-2 space-y-3">
          {/* Centered WhatsApp Button */}
          <button
            type="button"
            onClick={handleSendWhatsApp}
            className="w-full py-4 px-6 rounded-2xl bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-sm shadow-soft flex items-center justify-center gap-2.5 transition active:scale-98 cursor-pointer"
          >
            <Send className="w-5 h-5 text-white" />
            <span>Send quotation on WhatsApp</span>
          </button>

          {/* Save & View PDF buttons */}
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={handleSaveQuotation}
              disabled={loading}
              className="py-3.5 px-4 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 text-[#0B1E36] font-bold text-xs shadow-soft flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{loading ? 'Saving...' : 'Save Quotation'}</span>
            </button>

            <button
              type="button"
              onClick={() => setShowPdfModal(true)}
              className="py-3.5 px-4 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 text-[#0B1E36] font-bold text-xs shadow-soft flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <Eye className="w-4 h-4 text-[#0B1E36]" />
              <span>Preview PDF Sheet</span>
            </button>
          </div>

          {/* Big Return to Inquiry Button */}
          <button
            type="button"
            onClick={() => router.push(`/inquiries/${inquiry?.followupId || queryInquiryId}`)}
            className="w-full py-4 px-4 rounded-2xl bg-[#F59E0B] hover:bg-amber-500 text-[#0B1E36] font-bold text-xs shadow-md flex items-center justify-center gap-2 transition cursor-pointer"
          >
            <span>Return to Inquiry &amp; Close Deal</span>
          </button>
        </div>
      </div>

      {/* PDF SHEET PREVIEW MODAL */}
      {showPdfModal && (
        <QuotationPdfPreview
          data={{
            quotationNo: savedQuote?.quotationNo || `TSS/2627/${(inquiry?.followupId || queryInquiryId).replace(/\D/g, '') || '362'}`,
            createdByName: user?.fullName || 'Anand Kumar (Ops Manager)',
            customerName: inquiry?.customerName || 'MAJIDBHAI CHAUHAN',
            contactNo: inquiry?.customerPhone ? `+91 ${inquiry.customerPhone}` : '+91 96248 28181',
            address: inquiry?.address || inquiry?.city || 'Vadodara, Gujarat',
            projectType: inquiry?.requestedKw && Number(inquiry.requestedKw) > 10 ? 'Commercial Solar Project' : 'Residential Solar Project',
            systemSizeKw: capacityKw,
            panelWattage: wattage,
            panelBrand: panelMaker,
            panelTech: panelTech,
            numPanels: numPanels,
            inverterKw: inverterKw,
            inverterBrand: inverterMaker,
            meterPhase: meterPhase,
            ratePerKw: Math.round(totalProjectCostQ / (capacityKw || 1)),
            systemCost: systemCostR,
            gedaFee: capacityKw > 10 ? 15463 : 2500,
            meterCharges: meterChargeT,
            totalCost: totalProjectCostQ,
            subsidyAmount: totalSubsidyW,
            netCostAfterSubsidy: costAfterSubsidyX,
            firstPaymentAmount: firstPayment80Y,
            finalPaymentAmount: finalPayment20Z,
            annualGenerationKwh: annualGenerationKwhAA,
            annualSavingsRs: annualSavingsRsAC,
            paybackYears: paybackYearsAD,
            treesSavedAnnually: treesSavedAE,
            co2ReductionTonnes: co2TonnesAF,
            bomItems: bomList,
            inquiryId: inquiry?.followupId || queryInquiryId,
          }}
          onClose={() => setShowPdfModal(false)}
          onReturnToInquiry={() => router.push(`/inquiries/${inquiry?.followupId || queryInquiryId}`)}
          onCloseDeal={() => router.push(`/inquiries/${inquiry?.followupId || queryInquiryId}/deal-closed`)}
          onFollowup={() => router.push(`/inquiries/${inquiry?.followupId || queryInquiryId}`)}
        />
      )}
    </div>
  );
}
