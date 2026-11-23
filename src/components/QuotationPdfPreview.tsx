'use client';

import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Download,
  Send,
  Sun,
  Zap,
  Clock,
  Star,
  Leaf,
  Cloud,
  CreditCard,
  QrCode,
  CheckCircle2,
  Phone,
  MapPin,
  X,
} from 'lucide-react';
import { toast } from 'sonner';

export interface QuotationData {
  quotationNo: string;
  dateStr?: string;
  createdByName?: string;
  customerName: string;
  contactNo: string;
  address: string;
  projectType?: string; // 'Commercial Solar Project' | 'Residential Solar Project'
  systemSizeKw: number;

  // Technical Specs
  panelWattage: number;
  panelBrand: string;
  panelTech: string;
  numPanels: number;
  inverterKw: number;
  inverterBrand: string;
  meterPhase: string;

  // Costs
  ratePerKw?: number;
  systemCost?: number;
  gedaFee?: number;
  meterCharges?: number;
  totalCost: number;
  subsidyAmount?: number;
  netCostAfterSubsidy?: number;

  // Payment Terms
  firstPaymentPercent?: number;
  firstPaymentAmount?: number;
  finalPaymentPercent?: number;
  finalPaymentAmount?: number;

  // Environmental & ROI
  annualGenerationKwh: number;
  annualSavingsRs: number;
  paybackYears: number;
  treesSavedAnnually: number;
  co2ReductionTonnes: number;
}

interface QuotationPdfPreviewProps {
  data: QuotationData;
  onClose: () => void;
}

export const QuotationPdfPreview: React.FC<QuotationPdfPreviewProps> = ({ data, onClose }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 4;

  const dateFormatted = data.dateStr || new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date());

  const ratePerKw = data.ratePerKw || Math.round(data.totalCost / (data.systemSizeKw || 1));
  const meterCharge = data.meterCharges || (data.meterPhase.toLowerCase().includes('three') ? 4950 : 2950);
  const gedaFee = data.gedaFee || (data.systemSizeKw > 10 ? 15463 : 2500);
  const systemCost = data.systemCost || Math.max(0, data.totalCost - meterCharge - gedaFee);

  const firstPayAmount = data.firstPaymentAmount || Math.round(data.totalCost * 0.8);
  const finalPayAmount = data.finalPaymentAmount || (data.totalCost - firstPayAmount);

  const handleDownload = () => {
    toast.success('Preparing high-resolution print PDF...');
    setTimeout(() => {
      window.print();
    }, 200);
  };

  const handleShareWhatsApp = () => {
    const custPhone = data.contactNo.replace(/\D/g, '');
    const msg = `*Typhoon Solar Rooftop Quotation (${data.quotationNo})*\n\nNamaste *${data.customerName}*,\n\nHere is your official solar quotation for *${data.systemSizeKw} kW* system:\n• Panels: *${data.numPanels} x ${data.panelWattage}W ${data.panelBrand} (${data.panelTech})*\n• Inverter: *${data.inverterKw} kW ${data.inverterBrand}*\n• Grid Phase: *${data.meterPhase}*\n• Total Investment: *₹${data.totalCost.toLocaleString('en-IN')}*\n• Annual Electricity Savings: *₹${data.annualSavingsRs.toLocaleString('en-IN')}/year*\n• Estimated Payback: *${data.paybackYears} Years*\n\nPayment Terms:\n• 1st Payment (80%): ₹${firstPayAmount.toLocaleString('en-IN')}\n• Final Payment (20%): ₹${finalPayAmount.toLocaleString('en-IN')}\n\nTyphoon Solar System - EPC Services & Installation\nContact: +91 98989 52959 | www.typhoonsolarsystem.in`;

    const url = `https://wa.me/91${custPhone}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
    toast.success('Opening WhatsApp with quotation...');
  };

  return (
    <div className="quotation-preview-container fixed inset-0 z-50 overflow-y-auto bg-[#0a1c36]/90 backdrop-blur-md pb-12">
      {/* ========================================================================= */}
      {/* 1. SCREEN HEADER (Matches Reference Screen: Dark Blue Parabolic Banner)  */}
      {/* ========================================================================= */}
      <div className="no-print bg-[#08327d] text-white pt-6 pb-8 px-4 rounded-b-[28px] shadow-lg relative">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5 text-white" />
            </button>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white">Quotation preview</h1>
              <p className="text-xs text-sky-200 font-medium">
                {data.quotationNo} · {data.customerName}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/80 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. MAIN PREVIEW SHEET (Swipeable / Multi-page viewer)                     */}
      {/* ========================================================================= */}
      <div className="max-w-md sm:max-w-xl mx-auto px-4 mt-4">
        {/* White Document Card Container */}
        <div className="quotation-sheet-card bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden text-slate-800">
          {/* ================================================================= */}
          {/* PAGE 1: COVER PAGE                                               */}
          {/* ================================================================= */}
          {(currentPage === 1 || typeof window === 'undefined') && (
            <div className="quotation-page p-6 sm:p-8 flex flex-col justify-between min-h-[580px] sm:min-h-[680px]">
              {/* Header: Typhoon Solar System Logo */}
              <div className="text-center pt-2">
                <div className="inline-flex items-center justify-center gap-2 mb-1">
                  <div className="w-8 h-8 rounded-full border-2 border-amber-500 flex items-center justify-center text-amber-500">
                    <Sun className="w-5 h-5 fill-amber-400 stroke-amber-600" />
                  </div>
                  <h2 className="text-2xl font-serif font-bold text-[#0c2340] tracking-wide">
                    Typhoon Solar System
                  </h2>
                </div>
                <div className="text-[10px] sm:text-xs font-bold text-[#0c2340] tracking-widest uppercase">
                  SOLAR ROOFTOP SOLUTION · EPC SERVICES &amp; INSTALLATION
                </div>
                <div className="text-[11px] italic font-medium text-amber-700 mt-0.5">
                  Solar Rooftop Solution · EPC Services &amp; Installation
                </div>
              </div>

              {/* Center Sunset & Solar Panel Artwork */}
              <div className="my-5 rounded-2xl overflow-hidden shadow-lg border border-slate-200 relative bg-[#0a1c36] h-48 sm:h-56 flex flex-col justify-end items-center">
                {/* Sky & Horizon Gradient */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#07172e] via-[#102a4e] to-[#7c2d12]" />
                
                {/* Sunset Glow Sun */}
                <div className="absolute top-12 w-24 h-24 rounded-full bg-gradient-to-t from-amber-400 via-amber-300 to-yellow-200 shadow-[0_0_40px_rgba(251,191,36,0.6)]" />

                {/* Horizon Line */}
                <div className="absolute bottom-24 w-full h-2 bg-gradient-to-r from-amber-800 via-amber-600 to-amber-800" />

                {/* Perspective Solar Panel Array Artwork */}
                <div className="relative z-10 w-11/12 max-w-sm mb-2 space-y-1">
                  {/* Row 1 (Top / Far) */}
                  <div className="grid grid-cols-8 gap-0.5 opacity-90 scale-90">
                    {Array.from({ length: 8 }).map((_, i) => (
                      <div key={i} className="h-4 bg-[#1e40af] border border-sky-300/40 rounded-xs" />
                    ))}
                  </div>
                  {/* Row 2 (Middle) */}
                  <div className="grid grid-cols-8 gap-1 opacity-95 scale-95">
                    {Array.from({ length: 8 }).map((_, i) => (
                      <div key={i} className="h-5 bg-[#1d4ed8] border border-sky-200/60 rounded-xs shadow-xs" />
                    ))}
                  </div>
                  {/* Row 3 (Foreground) */}
                  <div className="grid grid-cols-7 gap-1">
                    {Array.from({ length: 7 }).map((_, i) => (
                      <div key={i} className="h-6 bg-[#2563eb] border border-white/80 rounded-xs shadow-sm" />
                    ))}
                  </div>
                </div>
              </div>

              {/* Title & Customer Information */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#0c2340] border-b-2 border-amber-500 pb-1 inline-block pr-6">
                    Solar Rooftop Quotation
                  </h3>
                  <p className="text-sm font-bold text-[#1d4ed8] mt-2">
                    {data.projectType || 'Commercial Solar Project'}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  <div className="sm:col-span-2 space-y-1.5 text-xs text-slate-700">
                    <div className="flex">
                      <span className="w-28 text-slate-500 font-semibold">Created by</span>
                      <span className="font-bold text-[#0c2340]">{data.createdByName || 'FAHIM SAIYED'}</span>
                    </div>
                    <div className="flex">
                      <span className="w-28 text-slate-500 font-semibold">Customer name</span>
                      <span className="font-bold text-[#0c2340]">{data.customerName}</span>
                    </div>
                    <div className="flex">
                      <span className="w-28 text-slate-500 font-semibold">Contact no</span>
                      <span className="font-bold text-[#0c2340]">{data.contactNo}</span>
                    </div>
                    <div className="flex">
                      <span className="w-28 text-slate-500 font-semibold">Address</span>
                      <span className="font-bold text-[#0c2340]">{data.address}</span>
                    </div>
                    <div className="flex">
                      <span className="w-28 text-slate-500 font-semibold">System size</span>
                      <span className="font-bold text-[#0c2340] text-sm">{data.systemSizeKw} kW</span>
                    </div>
                  </div>

                  {/* QR Box Placeholder */}
                  <div className="border border-dashed border-slate-300 rounded-xl p-3 flex flex-col items-center justify-center text-center bg-slate-50/50">
                    <div className="w-14 h-14 bg-white border border-slate-200 rounded-lg flex items-center justify-center text-slate-400 mb-1.5 shadow-xs">
                      <QrCode className="w-8 h-8 text-[#0c2340]" />
                    </div>
                    <span className="text-[9px] font-bold text-[#0c2340] tracking-wider uppercase">
                      FIND US ON GOOGLE
                    </span>
                  </div>
                </div>
              </div>

              {/* Cover Dark Footer Bar */}
              <div className="mt-6 -mx-6 -mb-6 sm:-mx-8 sm:-mb-8 bg-[#0a1c36] text-white px-6 py-2.5 flex justify-between items-center text-[11px] font-medium">
                <span>Quotation No. {data.quotationNo} · {dateFormatted}</span>
                <span>Page 1 of {totalPages}</span>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* PAGE 2: SYSTEM SUMMARY, COSTING & PAYMENT TERMS                   */}
          {/* ================================================================= */}
          {(currentPage === 2 || typeof window === 'undefined') && (
            <div className="quotation-page p-6 sm:p-8 flex flex-col justify-between min-h-[580px] sm:min-h-[680px] border-t sm:border-t-0 border-slate-200">
              {/* Top Letterhead Bar */}
              <div className="flex justify-between items-start pb-3 border-b-2 border-[#0c2340]">
                <div>
                  <div className="flex items-center gap-1.5">
                    <Sun className="w-5 h-5 text-amber-500 fill-amber-400" />
                    <span className="font-serif font-bold text-lg text-[#0c2340]">Typhoon Solar System</span>
                  </div>
                  <div className="text-[9px] font-bold text-slate-600 tracking-wider uppercase">
                    SOLAR ROOFTOP SOLUTION · EPC SERVICES &amp; INSTALLATION
                  </div>
                </div>
                <div className="text-right text-[10px] text-slate-600">
                  <div className="font-bold text-[#0c2340]">Quotation No. {data.quotationNo} · {dateFormatted}</div>
                  <div>GSTIN: 24AAVFT9193Q1ZT · www.typhoonsolarsystem.in</div>
                  <div>Contact: +91 98989 52959</div>
                </div>
              </div>

              <div className="space-y-4 my-3 text-xs">
                {/* 1. Solar Rooftop System Summary */}
                <div>
                  <div className="bg-[#0c2340] text-white font-bold text-xs py-1.5 px-3 rounded-lg text-center tracking-wide mb-2">
                    Solar Rooftop System Summary
                  </div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 border border-slate-200 rounded-xl p-3 bg-slate-50/50 text-[11px]">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Total system capacity:</span>
                      <span className="font-bold text-[#0c2340]">{data.systemSizeKw} kW</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Solar panel wattage:</span>
                      <span className="font-bold text-[#0c2340]">{data.panelWattage} Wp</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Inverter capacity:</span>
                      <span className="font-bold text-[#0c2340]">{data.inverterKw} kW</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Solar panel manufacturer:</span>
                      <span className="font-bold text-[#0c2340]">{data.panelBrand}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Total number of panels:</span>
                      <span className="font-bold text-[#0c2340]">{data.numPanels}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Solar panel technology:</span>
                      <span className="font-bold text-[#0c2340]">{data.panelTech}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Meter phase:</span>
                      <span className="font-bold text-[#0c2340]">{data.meterPhase}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Inverter manufacturer:</span>
                      <span className="font-bold text-[#0c2340]">{data.inverterBrand}</span>
                    </div>
                  </div>
                </div>

                {/* 2. Solar Project Costing Summary */}
                <div>
                  <div className="bg-[#0c2340] text-white font-bold text-xs py-1.5 px-3 rounded-lg text-center tracking-wide mb-2">
                    Solar Project Costing Summary
                  </div>
                  <div className="border border-slate-200 rounded-xl overflow-hidden">
                    <div className="bg-slate-100 px-3 py-1.5 flex justify-between text-[11px] font-semibold border-b border-slate-200">
                      <span>Solar rooftop rate per kW (including GST)</span>
                      <span className="font-bold text-[#0c2340]">Rs {ratePerKw.toLocaleString('en-IN')}.00</span>
                    </div>
                    <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-white font-bold text-[11px] px-3 py-1 flex justify-between">
                      <span>Details</span>
                      <span>Costs</span>
                    </div>
                    <div className="divide-y divide-slate-100 text-[11px] px-3 py-1 bg-white">
                      <div className="flex justify-between py-1.5">
                        <span>Total system cost · {data.systemSizeKw} kW (including GST)</span>
                        <span className="font-semibold text-slate-800">Rs {systemCost.toLocaleString('en-IN')}.00</span>
                      </div>
                      <div className="flex justify-between py-1.5">
                        <span>GEDA / DISCOM registration fees</span>
                        <span className="font-semibold text-slate-800">Rs {gedaFee.toLocaleString('en-IN')}.00</span>
                      </div>
                      <div className="flex justify-between py-1.5">
                        <span>Meter charges · {data.meterPhase} (as actual)</span>
                        <span className="font-semibold text-slate-800">Rs {meterCharge.toLocaleString('en-IN')}.00</span>
                      </div>
                    </div>
                    {/* Amber Highlight Total Box */}
                    <div className="bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400 text-[#0c2340] px-4 py-2.5 flex justify-between items-center font-bold text-base sm:text-lg border-t-2 border-amber-600">
                      <span className="font-serif">Total Project Cost</span>
                      <span className="font-serif text-lg sm:text-xl">Rs {data.totalCost.toLocaleString('en-IN')}.00</span>
                    </div>
                  </div>
                </div>

                {/* 3. Payment Terms */}
                <div>
                  <div className="bg-[#0c2340] text-white font-bold text-xs py-1.5 px-3 rounded-lg text-center tracking-wide mb-2">
                    Payment Terms
                  </div>
                  <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100 text-[11px] bg-white">
                    <div className="flex justify-between p-2.5">
                      <span className="font-bold text-[#0c2340]">1st payment · 80%</span>
                      <span className="text-slate-600">Upon dispatching materials to the site</span>
                      <span className="font-bold text-[#0c2340]">Rs {firstPayAmount.toLocaleString('en-IN')}.00</span>
                    </div>
                    <div className="flex justify-between p-2.5">
                      <span className="font-bold text-[#0c2340]">Final payment · 20%</span>
                      <span className="text-slate-600">After installation when meter installed</span>
                      <span className="font-bold text-[#0c2340]">Rs {finalPayAmount.toLocaleString('en-IN')}.00</span>
                    </div>
                  </div>
                </div>

                {/* Additional Note & Signature */}
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-[10px]">
                    <div className="font-bold text-[#0c2340] mb-1">Additional note</div>
                    <div className="text-slate-600">
                      No hidden cost or additional charge. Subsidy payment will be received directly in the customer bank account.
                    </div>
                  </div>
                  <div className="border border-dashed border-slate-300 rounded-xl p-2.5 text-[10px] flex flex-col justify-between text-right bg-white">
                    <div className="font-bold text-[#0c2340]">Authorized signature</div>
                    <div className="text-slate-400 italic mt-4">[Signature and stamp]</div>
                  </div>
                </div>
              </div>

              {/* Page 2 Footer */}
              <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-[10px] text-slate-500 font-medium">
                <span className="italic text-amber-700">Solar Rooftop Solution · EPC Services &amp; Installation</span>
                <span>Page 2 of {totalPages}</span>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* PAGE 3: INSTALLATION BENEFITS & PAYBACK                           */}
          {/* ================================================================= */}
          {(currentPage === 3 || typeof window === 'undefined') && (
            <div className="quotation-page p-6 sm:p-8 flex flex-col justify-between min-h-[580px] sm:min-h-[680px] border-t sm:border-t-0 border-slate-200">
              {/* Top Letterhead Bar */}
              <div className="flex justify-between items-start pb-3 border-b-2 border-[#0c2340]">
                <div>
                  <div className="flex items-center gap-1.5">
                    <Sun className="w-5 h-5 text-amber-500 fill-amber-400" />
                    <span className="font-serif font-bold text-lg text-[#0c2340]">Typhoon Solar System</span>
                  </div>
                  <div className="text-[9px] font-bold text-slate-600 tracking-wider uppercase">
                    SOLAR ROOFTOP SOLUTION · EPC SERVICES &amp; INSTALLATION
                  </div>
                </div>
                <div className="text-right text-[10px] text-slate-600">
                  <div className="font-bold text-[#0c2340]">Quotation No. {data.quotationNo} · {dateFormatted}</div>
                  <div>GSTIN: 24AAVFT9193Q1ZT · www.typhoonsolarsystem.in</div>
                  <div>Contact: +91 98989 52959</div>
                </div>
              </div>

              <div className="space-y-4 my-auto">
                <div className="bg-[#0c2340] text-white font-bold text-xs py-2 px-3 rounded-lg text-center tracking-wide">
                  Solar Plant Installation Benefits
                </div>

                {/* 6 Clean Rounded KPI Tiles */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {/* Tile 1: Generation */}
                  <div className="bg-white border border-slate-200 rounded-2xl p-4 text-center shadow-xs flex flex-col items-center">
                    <div className="w-9 h-9 rounded-full bg-[#0c2340] text-amber-400 flex items-center justify-center mb-2">
                      <Sun className="w-5 h-5" />
                    </div>
                    <div className="font-serif font-bold text-[#0c2340] text-sm sm:text-base">
                      {data.annualGenerationKwh.toLocaleString('en-IN')} kWh
                    </div>
                    <div className="text-[10px] text-slate-500 font-medium mt-0.5">Annual solar generation</div>
                  </div>

                  {/* Tile 2: Total Cost */}
                  <div className="bg-white border border-slate-200 rounded-2xl p-4 text-center shadow-xs flex flex-col items-center">
                    <div className="w-9 h-9 rounded-full bg-[#0c2340] text-amber-400 flex items-center justify-center mb-2">
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <div className="font-serif font-bold text-[#0c2340] text-sm sm:text-base">
                      Rs {data.totalCost.toLocaleString('en-IN')}
                    </div>
                    <div className="text-[10px] text-slate-500 font-medium mt-0.5">Total system cost</div>
                  </div>

                  {/* Tile 3: Payback */}
                  <div className="bg-white border border-slate-200 rounded-2xl p-4 text-center shadow-xs flex flex-col items-center">
                    <div className="w-9 h-9 rounded-full bg-[#0c2340] text-amber-400 flex items-center justify-center mb-2">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div className="font-serif font-bold text-[#0c2340] text-sm sm:text-base">
                      {data.paybackYears} Years
                    </div>
                    <div className="text-[10px] text-slate-500 font-medium mt-0.5">Payback period</div>
                  </div>

                  {/* Tile 4: Annual Savings */}
                  <div className="bg-white border border-slate-200 rounded-2xl p-4 text-center shadow-xs flex flex-col items-center">
                    <div className="w-9 h-9 rounded-full bg-[#0c2340] text-amber-400 flex items-center justify-center mb-2">
                      <Star className="w-5 h-5" />
                    </div>
                    <div className="font-serif font-bold text-[#0c2340] text-sm sm:text-base">
                      Rs {data.annualSavingsRs.toLocaleString('en-IN')}.00
                    </div>
                    <div className="text-[10px] text-slate-500 font-medium mt-0.5">Annual savings</div>
                  </div>

                  {/* Tile 5: Trees Saved */}
                  <div className="bg-white border border-slate-200 rounded-2xl p-4 text-center shadow-xs flex flex-col items-center">
                    <div className="w-9 h-9 rounded-full bg-[#0c2340] text-amber-400 flex items-center justify-center mb-2">
                      <Leaf className="w-5 h-5" />
                    </div>
                    <div className="font-serif font-bold text-[#0c2340] text-sm sm:text-base">
                      {data.treesSavedAnnually.toLocaleString('en-IN')}
                    </div>
                    <div className="text-[10px] text-slate-500 font-medium mt-0.5">Annual trees saved*</div>
                  </div>

                  {/* Tile 6: CO2 Reduction */}
                  <div className="bg-white border border-slate-200 rounded-2xl p-4 text-center shadow-xs flex flex-col items-center">
                    <div className="w-9 h-9 rounded-full bg-[#0c2340] text-amber-400 flex items-center justify-center mb-2">
                      <Cloud className="w-5 h-5" />
                    </div>
                    <div className="font-serif font-bold text-[#0c2340] text-sm sm:text-base">
                      {data.co2ReductionTonnes} Tonnes
                    </div>
                    <div className="text-[10px] text-slate-500 font-medium mt-0.5">Annual CO2 reduction**</div>
                  </div>
                </div>

                <div className="text-[9px] text-slate-400 leading-tight">
                  *The values are calculated on the average emission factor of the Indian electricity grid.<br />
                  **This value varies by region and tree type, but 21.77 kg per year is widely used in sustainability reports.
                </div>

                {/* Big Navy Banner: YOUR RETURN */}
                <div className="bg-[#0c2340] text-white rounded-2xl p-5 flex items-center justify-between shadow-md">
                  <div>
                    <span className="text-[10px] font-bold text-amber-400 tracking-widest uppercase block mb-1">
                      YOUR RETURN
                    </span>
                    <h4 className="text-xl font-serif font-bold">
                      Pays for itself in {data.paybackYears} years
                    </h4>
                    <p className="text-xs text-slate-300 mt-1">
                      Rs {data.totalCost.toLocaleString('en-IN')} project cost against Rs {data.annualSavingsRs.toLocaleString('en-IN')} saved every year.
                    </p>
                  </div>
                  <div className="text-4xl font-serif font-bold text-amber-400 pl-4 border-l border-white/20">
                    {data.paybackYears}
                  </div>
                </div>
              </div>

              {/* Page 3 Footer */}
              <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-[10px] text-slate-500 font-medium">
                <span className="italic text-amber-700">Solar Rooftop Solution · EPC Services &amp; Installation</span>
                <span>Page 3 of {totalPages}</span>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* PAGE 4: MATERIALS SPECIFICATION                                   */}
          {/* ================================================================= */}
          {(currentPage === 4 || typeof window === 'undefined') && (
            <div className="quotation-page p-6 sm:p-8 flex flex-col justify-between min-h-[580px] sm:min-h-[680px] border-t sm:border-t-0 border-slate-200">
              {/* Top Letterhead Bar */}
              <div className="flex justify-between items-start pb-3 border-b-2 border-[#0c2340]">
                <div>
                  <div className="flex items-center gap-1.5">
                    <Sun className="w-5 h-5 text-amber-500 fill-amber-400" />
                    <span className="font-serif font-bold text-lg text-[#0c2340]">Typhoon Solar System</span>
                  </div>
                  <div className="text-[9px] font-bold text-slate-600 tracking-wider uppercase">
                    SOLAR ROOFTOP SOLUTION · EPC SERVICES &amp; INSTALLATION
                  </div>
                </div>
                <div className="text-right text-[10px] text-slate-600">
                  <div className="font-bold text-[#0c2340]">Quotation No. {data.quotationNo} · {dateFormatted}</div>
                  <div>GSTIN: 24AAVFT9193Q1ZT · www.typhoonsolarsystem.in</div>
                  <div>Contact: +91 98989 52959</div>
                </div>
              </div>

              <div className="space-y-4 my-auto">
                <div className="bg-[#0c2340] text-white font-bold text-xs py-2 px-3 rounded-lg text-center tracking-wide">
                  Materials Specification
                </div>

                <div className="border border-slate-200 rounded-2xl overflow-hidden divide-y divide-slate-100 text-xs bg-white">
                  {/* Row 1: Solar Panels */}
                  <div className="p-3 grid grid-cols-3 gap-2 items-center">
                    <span className="font-bold text-[#0c2340]">Solar panels · {data.panelTech}</span>
                    <div className="col-span-2 flex flex-wrap gap-1.5">
                      {['WAAREE', 'Adani Solar', 'Rayzon Solar', 'Tata Power Solar'].map((b) => (
                        <span
                          key={b}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                            b.toLowerCase().includes(data.panelBrand.toLowerCase())
                              ? 'bg-[#0c2340] text-white border-[#0c2340]'
                              : 'bg-slate-50 text-slate-700 border-slate-200'
                          }`}
                        >
                          {b}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Row 2: Inverter */}
                  <div className="p-3 grid grid-cols-3 gap-2 items-center">
                    <span className="font-bold text-[#0c2340]">Grid tie inverter</span>
                    <div className="col-span-2 flex flex-wrap gap-1.5">
                      {['WAAREE', 'Polycab', 'Sunways', 'Growatt', 'Tata Power Solar'].map((inv) => (
                        <span
                          key={inv}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                            inv.toLowerCase().includes(data.inverterBrand.toLowerCase())
                              ? 'bg-[#0c2340] text-white border-[#0c2340]'
                              : 'bg-slate-50 text-slate-700 border-slate-200'
                          }`}
                        >
                          {inv}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Row 3: Structure */}
                  <div className="p-3 grid grid-cols-3 gap-2 items-center">
                    <span className="font-bold text-[#0c2340]">Structure</span>
                    <div className="col-span-2 text-slate-700 text-[11px] space-y-0.5">
                      <div>80 × 40 Galvanised Iron</div>
                      <div>40 × 40 Galvanised Iron</div>
                      <div>2 mm thickness</div>
                    </div>
                  </div>

                  {/* Row 4: Cable */}
                  <div className="p-3 grid grid-cols-3 gap-2 items-center">
                    <span className="font-bold text-[#0c2340]">DC &amp; AC cable and pipe</span>
                    <div className="col-span-2 text-slate-700 text-[11px]">
                      As per requirement · Polycab / Reputed Solar DC
                    </div>
                  </div>

                  {/* Row 5: Distribution Box */}
                  <div className="p-3 grid grid-cols-3 gap-2 items-center">
                    <span className="font-bold text-[#0c2340]">DC/AC DB, MCB &amp; SPD</span>
                    <div className="col-span-2 text-slate-700 text-[11px] space-y-0.5">
                      <div>Waterproof and dustproof (transparent IP65)</div>
                      <div>Polycab / Havells MCB · Phonix / Elmex SPD</div>
                    </div>
                  </div>

                  {/* Row 6: Earthing */}
                  <div className="p-3 grid grid-cols-3 gap-2 items-center">
                    <span className="font-bold text-[#0c2340]">Earthing kit</span>
                    <div className="col-span-2 text-slate-700 text-[11px] space-y-0.5">
                      <div>150 – 250 micron × 3 pure chemical earthing rods</div>
                      <div>15 kg highly conductive BFC chemical · Copper coated</div>
                    </div>
                  </div>

                  {/* Row 7: Lightning arrester */}
                  <div className="p-3 grid grid-cols-3 gap-2 items-center">
                    <span className="font-bold text-[#0c2340]">Lightning arrester</span>
                    <div className="col-span-2 text-slate-700 text-[11px]">
                      Copper coated 5-spike lightning protection rod
                    </div>
                  </div>

                  {/* Row 8: Fasteners & hardware */}
                  <div className="p-3 grid grid-cols-3 gap-2 items-center">
                    <span className="font-bold text-[#0c2340]">Hardware &amp; clamps</span>
                    <div className="col-span-2 text-slate-700 text-[11px]">
                      8 mm S.S 304 grade bolts · Virgin plastic cable ties · ISI certified clamps
                    </div>
                  </div>
                </div>
              </div>

              {/* Page 4 Footer */}
              <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-[10px] text-slate-500 font-medium">
                <span className="italic text-amber-700">Solar Rooftop Solution · EPC Services &amp; Installation</span>
                <span>Page 4 of {totalPages}</span>
              </div>
            </div>
          )}
        </div>

        {/* ========================================================================= */}
        {/* 3. PAGINATION & ACTION CONTROLS (Directly Matching Reference Screen)     */}
        {/* ========================================================================= */}
        <div className="no-print mt-4 space-y-3">
          {/* Swipe / Dots Indicator */}
          <div className="flex items-center justify-center gap-3 text-white text-xs font-medium">
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-30 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4 text-white" />
            </button>

            <div className="flex items-center gap-1.5">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setCurrentPage(i + 1)}
                  className={`transition-all rounded-full ${
                    currentPage === i + 1 ? 'w-5 h-2 bg-sky-400' : 'w-2 h-2 bg-white/40'
                  }`}
                />
              ))}
            </div>

            <span className="text-sky-200">
              Page {currentPage} of {totalPages} · swipe for next page
            </span>

            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-30 cursor-pointer"
            >
              <ChevronRight className="w-4 h-4 text-white" />
            </button>
          </div>

          {/* Action Buttons Row 1: Download & Share WhatsApp */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <button
              type="button"
              onClick={handleDownload}
              className="py-3 px-4 rounded-xl bg-white hover:bg-slate-100 text-[#0c2340] border-2 border-[#0c2340] font-bold text-xs shadow-md flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <Download className="w-4 h-4 text-[#0c2340]" />
              <span>Download</span>
            </button>

            <button
              type="button"
              onClick={handleShareWhatsApp}
              className="py-3 px-4 rounded-xl bg-[#16a34a] hover:bg-[#15803d] text-white font-bold text-xs shadow-md flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <Send className="w-4 h-4 text-white" />
              <span>Share on WhatsApp</span>
            </button>
          </div>

          {/* Action Button Row 2: Back to quotation */}
          <button
            type="button"
            onClick={onClose}
            className="w-full py-3.5 px-4 rounded-2xl bg-[#38bdf8] hover:bg-[#0ea5e9] text-[#0c2340] font-bold text-sm shadow-lg flex items-center justify-center gap-2 transition cursor-pointer"
          >
            Back to quotation
          </button>
        </div>
      </div>

      {/* Print CSS Rules so browser Print to PDF renders each page cleanly on A4 without buttons or scrollbars */}
      <style jsx global>{`
        @media print {
          body {
            background: #ffffff !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          .no-print {
            display: none !important;
          }
          .quotation-preview-container {
            position: static !important;
            background: #ffffff !important;
            padding: 0 !important;
          }
          .quotation-sheet-card {
            border: none !important;
            box-shadow: none !important;
            max-width: 100% !important;
            border-radius: 0 !important;
          }
          .quotation-page {
            page-break-after: always !important;
            break-after: page !important;
            height: 100vh !important;
            max-height: 100vh !important;
            padding: 24mm 18mm !important;
            box-sizing: border-box !important;
          }
        }
      `}</style>
    </div>
  );
};
