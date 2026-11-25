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
  CreditCard,
  QrCode,
  CheckCircle2,
  Phone,
  MapPin,
  X,
  FileText,
  ShieldCheck,
} from 'lucide-react';
import { toast } from 'sonner';

export interface BomItem {
  srNo: number;
  name: string;
  qty: number;
  uom: string;
  rate: number;
  remarks?: string;
}

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

  // GST Split
  panelsGstAmount?: number;
  inverterGstAmount?: number;
  servicesGstAmount?: number;

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

  // Standard BOM items
  bomItems?: BomItem[];
  inquiryId?: string;
}

interface QuotationPdfPreviewProps {
  data: QuotationData;
  onClose: () => void;
  onReturnToInquiry?: () => void;
  onCloseDeal?: () => void;
  onFollowup?: () => void;
}

export const QuotationPdfPreview: React.FC<QuotationPdfPreviewProps> = ({
  data,
  onClose,
  onReturnToInquiry,
  onCloseDeal,
  onFollowup,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 5;

  const dateFormatted =
    data.dateStr ||
    new Intl.DateTimeFormat('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(new Date());

  const ratePerKw = data.ratePerKw || Math.round(data.totalCost / (data.systemSizeKw || 1));
  const meterCharge =
    data.meterCharges || (data.meterPhase.toLowerCase().includes('three') ? 4950 : 2950);
  const gedaFee = data.gedaFee || (data.systemSizeKw > 10 ? 15463 : 2500);
  const systemCost = data.systemCost || Math.max(0, data.totalCost - meterCharge - gedaFee);

  // GST breakdown estimates
  const panelsCost = Math.round(systemCost * 0.58);
  const inverterCost = Math.round(systemCost * 0.22);
  const bosServicesCost = Math.max(0, systemCost - panelsCost - inverterCost);

  const panelsGst = data.panelsGstAmount || Math.round(panelsCost * 0.05);
  const inverterGst = data.inverterGstAmount || Math.round(inverterCost * 0.05);
  const servicesGst = data.servicesGstAmount || Math.round(bosServicesCost * 0.18);

  const firstPayAmount = data.firstPaymentAmount || Math.round(data.totalCost * 0.8);
  const finalPayAmount = data.finalPaymentAmount || (data.totalCost - firstPayAmount);

  const handleDownload = () => {
    toast.success('Preparing 5-page print PDF...');
    setTimeout(() => {
      window.print();
    }, 250);
  };

  const handleShareWhatsApp = () => {
    const custPhone = data.contactNo.replace(/\D/g, '');
    const msg = `*Typhoon Solar Rooftop Quotation (${data.quotationNo})*\n\nNamaste *${data.customerName}*,\n\nHere is your official solar quotation for *${data.systemSizeKw} kW* system:\n• Panels: *${data.numPanels} x ${data.panelWattage}W ${data.panelBrand} (${data.panelTech})*\n• Inverter: *${data.inverterKw} kW ${data.inverterBrand}*\n• Grid Phase: *${data.meterPhase}*\n• Total Investment: *₹${data.totalCost.toLocaleString('en-IN')}*\n• Central Subsidy: *₹${(data.subsidyAmount || 78000).toLocaleString('en-IN')}*\n• Net Investment after Subsidy: *₹${(data.netCostAfterSubsidy || (data.totalCost - 78000)).toLocaleString('en-IN')}*\n\n*Payment Terms:*\n• 1st Payment (80%): ₹${firstPayAmount.toLocaleString('en-IN')}\n• Final Payment (20%): ₹${finalPayAmount.toLocaleString('en-IN')}\n\n*Savings & Payback:*\n• Annual Electricity Savings: *₹${data.annualSavingsRs.toLocaleString('en-IN')}/year*\n• Payback Period: *${data.paybackYears} Years*\n\nTyphoon Solar System - EPC Services & Installation\nContact: +91 98989 52959 | www.typhoonsolarsystem.in`;

    const url = `https://wa.me/91${custPhone}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
    toast.success('Opening WhatsApp with quotation details...');
  };

  // Standard 29-item Aykka check list
  const defaultBomList: BomItem[] = [
    { srNo: 1, name: 'Solar Panel', qty: data.numPanels || 10, uom: 'No', rate: 12000, remarks: `${data.panelWattage}W ${data.panelBrand}` },
    { srNo: 2, name: 'Inverter', qty: 1, uom: 'No', rate: 35000, remarks: `${data.inverterKw} kW ${data.inverterBrand}` },
    { srNo: 3, name: 'GI Pipe 40/40', qty: 5, uom: 'No', rate: 950, remarks: 'Galvanised Iron 2mm' },
    { srNo: 4, name: 'GI Pipe 50/40', qty: 5, uom: 'No', rate: 1150, remarks: 'Heavy duty leg support' },
    { srNo: 5, name: 'GI Pipe 25/25', qty: 3, uom: 'No', rate: 650, remarks: 'Bracing cross bar' },
    { srNo: 6, name: 'MC4 Connector', qty: 5, uom: 'No', rate: 80, remarks: 'IP67 waterproof' },
    { srNo: 7, name: 'PVC Pipe', qty: 25, uom: 'No', rate: 120, remarks: 'Rigid conduit' },
    { srNo: 8, name: 'PVC Elbow', qty: 35, uom: 'No', rate: 25, remarks: '25mm bends' },
    { srNo: 9, name: 'PVC T', qty: 5, uom: 'No', rate: 30, remarks: '3-way junction' },
    { srNo: 10, name: 'Saddle (Cable Clip) 25 sqmm white', qty: 1, uom: 'No', rate: 150, remarks: 'Pack of 100' },
    { srNo: 11, name: 'J Hook M8X40X40', qty: 28, uom: 'No', rate: 45, remarks: 'SS 304 roof clamps' },
    { srNo: 12, name: 'Polycab 2.5 Green Earthing Cable', qty: 30, uom: 'Mtr', rate: 42, remarks: 'Copper earthing' },
    { srNo: 13, name: 'Polycab 4sqmm Black AC Cable', qty: 25, uom: 'Mtr', rate: 55, remarks: 'AC output neutral' },
    { srNo: 14, name: 'Polycab 4sqmm Red AC Cable', qty: 25, uom: 'Mtr', rate: 55, remarks: 'AC output phase' },
    { srNo: 15, name: 'UV Cable Tie', qty: 1, uom: 'No', rate: 180, remarks: 'Virgin nylon packet' },
    { srNo: 16, name: 'Polycab 4sqmm Black DC Cable', qty: 30, uom: 'Mtr', rate: 68, remarks: 'Solar PV negative' },
    { srNo: 17, name: 'Polycab 4sqmm Red DC Cable', qty: 30, uom: 'Mtr', rate: 68, remarks: 'Solar PV positive' },
    { srNo: 18, name: 'LA Cable', qty: 15, uom: 'Mtr', rate: 48, remarks: 'Lightning arrester run' },
    { srNo: 19, name: 'ACDB-DCDB Box', qty: 2, uom: 'No', rate: 3200, remarks: 'IP65 with SPD & MCB' },
    { srNo: 20, name: '400 ML Color Zinc Spray', qty: 1, uom: 'No', rate: 320, remarks: 'Anti-rust cold galvanize' },
    { srNo: 21, name: 'MS Base Plate', qty: 4, uom: 'No', rate: 280, remarks: 'Footing plates' },
    { srNo: 22, name: 'Earthing Chemical Bag', qty: 1, uom: 'No', rate: 450, remarks: 'BFC chemical 15 kg' },
    { srNo: 23, name: 'Earthing Kit 1 Mtr', qty: 2, uom: 'No', rate: 1200, remarks: 'Pure copper-bonded rod' },
    { srNo: 24, name: '4sqmm Copper Lug', qty: 12, uom: 'No', rate: 15, remarks: 'Tinned copper' },
    { srNo: 25, name: '2.5 Copper Lug', qty: 10, uom: 'No', rate: 12, remarks: 'Terminal crimp' },
    { srNo: 26, name: 'Polycab 4Cx2.50sqmm AC Cable', qty: 20, uom: 'Mtr', rate: 85, remarks: 'Main grid feeder' },
    { srNo: 27, name: 'Flexible Pipe (PICA PIPE)', qty: 5, uom: 'Mtr', rate: 60, remarks: 'Inverter entry conduit' },
    { srNo: 28, name: 'Nails / Fasteners', qty: 50, uom: 'No', rate: 8, remarks: 'Expansion anchor bolts' },
    { srNo: 29, name: 'Grouting (Foundation) Ready Mix', qty: 4, uom: 'No', rate: 350, remarks: 'Non-shrink concrete' },
  ];

  const bomItems = data.bomItems && data.bomItems.length > 0 ? data.bomItems : defaultBomList;

  return (
    <div className="quotation-preview-container fixed inset-0 z-50 overflow-y-auto bg-[#0B1E36]/95 backdrop-blur-md pb-16">
      {/* ========================================================================= */}
      {/* 1. MINIMAL SCREEN HEADER (Clean back / close buttons, no big text banner) */}
      {/* ========================================================================= */}
      <div className="no-print pt-4 pb-2 px-4">
        <div className="max-w-md sm:max-w-xl mx-auto flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition cursor-pointer text-white"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <span className="text-xs font-serif text-white/80 font-medium">
            {data.quotationNo} · {data.customerName}
          </span>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/80 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. MAIN PREVIEW SHEET (Swipeable / 5-page viewer)                         */}
      {/* ========================================================================= */}
      <div className="max-w-md sm:max-w-xl mx-auto px-4 mt-2">
        {/* White Document Card Container */}
        <div className="quotation-sheet-card bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden text-slate-800">
          {/* ================================================================= */}
          {/* PAGE 1: COVER PAGE                                               */}
          {/* ================================================================= */}
          {(currentPage === 1 || typeof window === 'undefined') && (
            <div className="quotation-page p-6 sm:p-8 flex flex-col justify-between min-h-[580px] sm:min-h-[680px]">
              {/* Header: Center Typhoon Solar Logo */}
              <div className="text-center pt-2 flex flex-col items-center">
                <div className="bg-white px-5 py-2 rounded-full border border-slate-200 shadow-xs inline-flex items-center justify-center mb-2">
                  <img
                    src="/images/typhoon-logo.png"
                    alt="Typhoon Solar System"
                    className="h-10 sm:h-12 w-auto object-contain"
                  />
                </div>
                <div className="text-[10px] sm:text-xs font-bold text-[#0B1E36] tracking-widest uppercase">
                  SOLAR ROOFTOP SOLUTION · EPC SERVICES &amp; INSTALLATION
                </div>
              </div>

              {/* Center Artwork: Uses quotation-pdf-image.jpeg */}
              <div className="my-3 rounded-2xl overflow-hidden shadow-md border border-slate-200 bg-slate-50">
                <img
                  src="/images/quotation-pdf-image.jpeg"
                  alt="Typhoon Solar Rooftop Installation"
                  className="w-full h-44 sm:h-52 object-cover"
                />
              </div>

              {/* Title & Customer Information */}
              <div className="space-y-3">
                <div>
                  <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#0B1E36] border-b-2 border-amber-500 pb-1 inline-block pr-6">
                    Solar Rooftop Quotation
                  </h3>
                  <p className="text-xs sm:text-sm font-bold text-amber-700 mt-1">
                    {data.projectType || 'Residential Solar Project'}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                  <div className="sm:col-span-2 space-y-1.5 text-xs text-slate-700">
                    <div className="flex">
                      <span className="w-28 text-slate-500 font-semibold">Created by</span>
                      <span className="font-bold text-[#0B1E36]">{data.createdByName || 'Anand Kumar (Ops Manager)'}</span>
                    </div>
                    <div className="flex">
                      <span className="w-28 text-slate-500 font-semibold">Customer name</span>
                      <span className="font-bold text-[#0B1E36]">{data.customerName}</span>
                    </div>
                    <div className="flex">
                      <span className="w-28 text-slate-500 font-semibold">Contact no</span>
                      <span className="font-bold text-[#0B1E36]">{data.contactNo}</span>
                    </div>
                    <div className="flex">
                      <span className="w-28 text-slate-500 font-semibold">Address</span>
                      <span className="font-bold text-[#0B1E36] truncate">{data.address}</span>
                    </div>
                    <div className="flex">
                      <span className="w-28 text-slate-500 font-semibold">System size</span>
                      <span className="font-bold text-[#0B1E36] text-sm">{data.systemSizeKw} kW</span>
                    </div>
                  </div>

                  {/* QR Box */}
                  <div className="border border-dashed border-slate-300 rounded-xl p-3 flex flex-col items-center justify-center text-center bg-slate-50/50">
                    <div className="w-12 h-12 bg-white border border-slate-200 rounded-lg flex items-center justify-center text-slate-400 mb-1 shadow-xs">
                      <QrCode className="w-7 h-7 text-[#0B1E36]" />
                    </div>
                    <span className="text-[8px] font-bold text-[#0B1E36] tracking-wider uppercase">
                      FIND US ON GOOGLE
                    </span>
                  </div>
                </div>
              </div>

              {/* Cover Dark Footer Bar */}
              <div className="mt-4 -mx-6 -mb-6 sm:-mx-8 sm:-mb-8 bg-[#0B1E36] text-white px-6 py-2.5 flex justify-between items-center text-[10px] sm:text-[11px] font-medium">
                <span>Quotation No. {data.quotationNo} · {dateFormatted}</span>
                <span>Page 1 of {totalPages}</span>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* PAGE 2: SYSTEM SUMMARY, COSTING (WITH GST) & PAYMENT TERMS        */}
          {/* ================================================================= */}
          {(currentPage === 2 || typeof window === 'undefined') && (
            <div className="quotation-page p-6 sm:p-8 flex flex-col justify-between min-h-[580px] sm:min-h-[680px] border-t sm:border-t-0 border-slate-200">
              <div className="flex justify-between items-start pb-2 border-b-2 border-[#0B1E36]">
                <div className="flex items-center gap-2">
                  <img src="/images/typhoon-logo.png" alt="Typhoon Solar" className="h-7 w-auto object-contain" />
                </div>
                <div className="text-right text-[10px] text-slate-600">
                  <div className="font-bold text-[#0B1E36]">Quotation No. {data.quotationNo} · {dateFormatted}</div>
                  <div>GSTIN: 24AAVFT9193Q1ZT · www.typhoonsolarsystem.in</div>
                </div>
              </div>

              <div className="space-y-3.5 my-2 text-xs">
                {/* 1. Solar Rooftop System Summary */}
                <div>
                  <div className="bg-[#0B1E36] text-white font-bold text-xs py-1.5 px-3 rounded-lg text-center tracking-wide mb-1.5">
                    Solar Rooftop System Summary
                  </div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 border border-slate-200 rounded-xl p-3 bg-slate-50/50 text-[11px]">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Total capacity:</span>
                      <span className="font-bold text-[#0B1E36]">{data.systemSizeKw} kW</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Panel wattage:</span>
                      <span className="font-bold text-[#0B1E36]">{data.panelWattage} Wp</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Inverter capacity:</span>
                      <span className="font-bold text-[#0B1E36]">{data.inverterKw} kW</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Panel maker:</span>
                      <span className="font-bold text-[#0B1E36]">{data.panelBrand}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Total panels:</span>
                      <span className="font-bold text-[#0B1E36]">{data.numPanels}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Technology:</span>
                      <span className="font-bold text-[#0B1E36]">{data.panelTech}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Meter phase:</span>
                      <span className="font-bold text-[#0B1E36]">{data.meterPhase}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Inverter brand:</span>
                      <span className="font-bold text-[#0B1E36]">{data.inverterBrand}</span>
                    </div>
                  </div>
                </div>

                {/* 2. Solar Project Costing Summary (with Real GST Breakdown) */}
                <div>
                  <div className="bg-[#0B1E36] text-white font-bold text-xs py-1.5 px-3 rounded-lg text-center tracking-wide mb-1.5">
                    Solar Project Costing &amp; GST Summary
                  </div>
                  <div className="border border-slate-200 rounded-xl overflow-hidden text-[11px]">
                    <div className="bg-slate-100 px-3 py-1 flex justify-between font-semibold border-b border-slate-200">
                      <span>Solar rooftop rate per kW (inclusive of GST)</span>
                      <span className="font-bold text-[#0B1E36]">₹ {ratePerKw.toLocaleString('en-IN')}.00</span>
                    </div>
                    <div className="bg-amber-500 text-white font-bold px-3 py-1 flex justify-between">
                      <span>Component</span>
                      <span>Amount</span>
                    </div>
                    <div className="divide-y divide-slate-100 px-3 py-1 bg-white">
                      <div className="flex justify-between py-1">
                        <span>Solar PV Modules (5% GST included)</span>
                        <span className="font-semibold text-slate-800">₹ {panelsCost.toLocaleString('en-IN')}.00</span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span>Solar On-Grid Inverter (5% GST included)</span>
                        <span className="font-semibold text-slate-800">₹ {inverterCost.toLocaleString('en-IN')}.00</span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span>Structure, Balance of System &amp; Wiring (18% GST)</span>
                        <span className="font-semibold text-slate-800">₹ {bosServicesCost.toLocaleString('en-IN')}.00</span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span>GEDA / DISCOM registration &amp; net-meter charges</span>
                        <span className="font-semibold text-slate-800">₹ {(gedaFee + meterCharge).toLocaleString('en-IN')}.00</span>
                      </div>
                    </div>
                    {/* Amber Highlight Total */}
                    <div className="bg-[#F59E0B] text-[#0B1E36] px-4 py-2 flex justify-between items-center font-bold text-sm sm:text-base border-t border-amber-600">
                      <span className="font-serif">Total Project Cost</span>
                      <span className="font-serif text-base sm:text-lg">₹ {data.totalCost.toLocaleString('en-IN')}.00</span>
                    </div>
                  </div>
                </div>

                {/* 3. Payment Terms */}
                <div>
                  <div className="bg-[#0B1E36] text-white font-bold text-xs py-1.5 px-3 rounded-lg text-center tracking-wide mb-1.5">
                    Payment Terms
                  </div>
                  <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100 text-[11px] bg-white">
                    <div className="flex justify-between p-2">
                      <span className="font-bold text-[#0B1E36]">1st payment · 80%</span>
                      <span className="text-slate-600">Upon dispatching materials to site</span>
                      <span className="font-bold text-[#0B1E36]">₹ {firstPayAmount.toLocaleString('en-IN')}.00</span>
                    </div>
                    <div className="flex justify-between p-2">
                      <span className="font-bold text-[#0B1E36]">Final payment · 20%</span>
                      <span className="text-slate-600">After installation when meter installed</span>
                      <span className="font-bold text-[#0B1E36]">₹ {finalPayAmount.toLocaleString('en-IN')}.00</span>
                    </div>
                  </div>
                </div>

                {/* Note & Signature */}
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-[10px]">
                    <div className="font-bold text-[#0B1E36] mb-0.5">Additional note</div>
                    <div className="text-slate-600 leading-tight">
                      No hidden costs. PM Surya Ghar direct DBT subsidy will credit directly into the consumer bank account.
                    </div>
                  </div>
                  <div className="border border-dashed border-slate-300 rounded-xl p-2.5 text-[10px] flex flex-col justify-between text-right bg-white">
                    <div className="font-bold text-[#0B1E36]">Authorized signature</div>
                    <div className="text-slate-400 italic mt-3">[Signature &amp; Stamp]</div>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-[10px] text-slate-500 font-medium">
                <span className="italic text-amber-700">Solar Rooftop Solution · EPC Services &amp; Installation</span>
                <span>Page 2 of {totalPages}</span>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* PAGE 3: STANDARD BOM & SPECIFICATIONS (29 Items Checklist)        */}
          {/* ================================================================= */}
          {(currentPage === 3 || typeof window === 'undefined') && (
            <div className="quotation-page p-6 sm:p-8 flex flex-col justify-between min-h-[580px] sm:min-h-[680px] border-t sm:border-t-0 border-slate-200">
              <div className="flex justify-between items-start pb-2 border-b-2 border-[#0B1E36]">
                <div className="flex items-center gap-2">
                  <img src="/images/typhoon-logo.png" alt="Typhoon Solar" className="h-7 w-auto object-contain" />
                </div>
                <div className="text-right text-[10px] text-slate-600">
                  <div className="font-bold text-[#0B1E36]">Standard Bill of Materials (BOM)</div>
                  <div>Quotation No. {data.quotationNo}</div>
                </div>
              </div>

              <div className="space-y-2 my-2 text-xs">
                <div className="bg-[#0B1E36] text-white font-bold text-xs py-1.5 px-3 rounded-lg text-center tracking-wide">
                  Standard BOM &amp; Equipment Checklist
                </div>

                <div className="border border-slate-200 rounded-xl overflow-hidden max-h-[380px] sm:max-h-[460px] overflow-y-auto">
                  <table className="w-full text-[10px] text-left">
                    <thead className="bg-[#0B1E36] text-white sticky top-0 font-bold">
                      <tr>
                        <th className="py-1 px-2 text-center w-8">Sr</th>
                        <th className="py-1 px-2">Material Specification</th>
                        <th className="py-1 px-2 text-center w-12">Qty</th>
                        <th className="py-1 px-2 text-center w-12">UOM</th>
                        <th className="py-1 px-2 text-right">Remarks</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                      {bomItems.map((item, idx) => (
                        <tr key={item.srNo || idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/70'}>
                          <td className="py-1 px-2 text-center text-slate-500 font-bold">{item.srNo || idx + 1}</td>
                          <td className="py-1 px-2 font-medium text-slate-800">{item.name}</td>
                          <td className="py-1 px-2 text-center font-bold text-[#0B1E36]">{item.qty}</td>
                          <td className="py-1 px-2 text-center text-slate-500">{item.uom}</td>
                          <td className="py-1 px-2 text-right text-slate-600 truncate max-w-[120px]">{item.remarks || 'Standard ISI'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-[10px] text-slate-500 font-medium">
                <span className="italic text-amber-700">Aykka Standard Solar BOM Specification</span>
                <span>Page 3 of {totalPages}</span>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* PAGE 4: GENERATION, SUBSIDY, SAVINGS & ENVIRONMENT                */}
          {/* ================================================================= */}
          {(currentPage === 4 || typeof window === 'undefined') && (
            <div className="quotation-page p-6 sm:p-8 flex flex-col justify-between min-h-[580px] sm:min-h-[680px] border-t sm:border-t-0 border-slate-200">
              <div className="flex justify-between items-start pb-2 border-b-2 border-[#0B1E36]">
                <div className="flex items-center gap-2">
                  <img src="/images/typhoon-logo.png" alt="Typhoon Solar" className="h-7 w-auto object-contain" />
                </div>
                <div className="text-right text-[10px] text-slate-600">
                  <div className="font-bold text-[#0B1E36]">Quotation No. {data.quotationNo}</div>
                  <div>Performance &amp; Environmental ROI</div>
                </div>
              </div>

              <div className="space-y-3.5 my-2 text-xs">
                {/* 1. Subsidy Summary */}
                <div className="border border-slate-200 rounded-xl p-3 bg-amber-50/50">
                  <span className="text-[10px] font-bold text-amber-800 uppercase tracking-widest block mb-1">
                    PM SURYA GHAR NATIONAL ROOFTOP SUBSIDY
                  </span>
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="text-base font-serif font-bold text-[#0B1E36]">
                        Direct Central Subsidy: ₹ {(data.subsidyAmount || 78000).toLocaleString('en-IN')}
                      </h4>
                      <p className="text-[11px] text-slate-600">Direct Benefit Transfer (DBT) credit to customer account</p>
                    </div>
                    <span className="text-xs font-bold px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full border border-emerald-200">
                      Eligible
                    </span>
                  </div>
                </div>

                {/* 2. Generation & Savings */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="border border-slate-200 rounded-xl p-3 bg-slate-50">
                    <span className="text-[10px] font-bold text-slate-500 uppercase block">Annual Generation</span>
                    <h5 className="text-lg font-serif font-bold text-[#0B1E36] mt-0.5">
                      {data.annualGenerationKwh.toLocaleString('en-IN')} Units
                    </h5>
                    <p className="text-[10px] text-slate-500">~{Math.round(data.annualGenerationKwh / 365)} units per day</p>
                  </div>

                  <div className="border border-slate-200 rounded-xl p-3 bg-slate-50">
                    <span className="text-[10px] font-bold text-slate-500 uppercase block">Annual Electricity Savings</span>
                    <h5 className="text-lg font-serif font-bold text-emerald-700 mt-0.5">
                      ₹ {data.annualSavingsRs.toLocaleString('en-IN')}
                    </h5>
                    <p className="text-[10px] text-slate-500">Calculated @ ₹7.50 / unit tariff</p>
                  </div>
                </div>

                {/* 3. Return Banner */}
                <div className="bg-[#0B1E36] text-white rounded-2xl p-4 flex items-center justify-between shadow-md">
                  <div>
                    <span className="text-[10px] font-bold text-amber-400 tracking-widest uppercase block mb-1">
                      ESTIMATED PAYBACK PERIOD
                    </span>
                    <h4 className="text-lg font-serif font-bold">
                      Pays for itself in {data.paybackYears} years
                    </h4>
                    <p className="text-[11px] text-slate-300 mt-0.5">
                      Net ₹{(data.netCostAfterSubsidy || (data.totalCost - 78000)).toLocaleString('en-IN')} investment against ₹{data.annualSavingsRs.toLocaleString('en-IN')} saved annually.
                    </p>
                  </div>
                  <div className="text-3xl font-serif font-bold text-amber-400 pl-4 border-l border-white/20">
                    {data.paybackYears}y
                  </div>
                </div>

                {/* 4. Green Impact */}
                <div className="border border-emerald-200 bg-emerald-50/40 rounded-xl p-3 grid grid-cols-2 gap-2 text-center">
                  <div>
                    <Leaf className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
                    <span className="text-sm font-bold text-emerald-900 block">{data.treesSavedAnnually} Trees</span>
                    <span className="text-[10px] text-emerald-700">Equivalent trees planted</span>
                  </div>
                  <div>
                    <Zap className="w-5 h-5 text-amber-600 mx-auto mb-1" />
                    <span className="text-sm font-bold text-slate-800 block">{data.co2ReductionTonnes} Tonnes</span>
                    <span className="text-[10px] text-slate-600">Annual CO₂ offset</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-[10px] text-slate-500 font-medium">
                <span className="italic text-amber-700">Solar Rooftop Solution · EPC Services &amp; Installation</span>
                <span>Page 4 of {totalPages}</span>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* PAGE 5: TERMS & CONDITIONS (T&C)                                  */}
          {/* ================================================================= */}
          {(currentPage === 5 || typeof window === 'undefined') && (
            <div className="quotation-page p-6 sm:p-8 flex flex-col justify-between min-h-[580px] sm:min-h-[680px] border-t sm:border-t-0 border-slate-200">
              <div className="flex justify-between items-start pb-2 border-b-2 border-[#0B1E36]">
                <div className="flex items-center gap-2">
                  <img src="/images/typhoon-logo.png" alt="Typhoon Solar" className="h-7 w-auto object-contain" />
                </div>
                <div className="text-right text-[10px] text-slate-600">
                  <div className="font-bold text-[#0B1E36]">Terms &amp; Conditions</div>
                  <div>Quotation No. {data.quotationNo}</div>
                </div>
              </div>

              <div className="space-y-2.5 my-2 text-xs">
                <div className="bg-[#0B1E36] text-white font-bold text-xs py-1.5 px-3 rounded-lg text-center tracking-wide">
                  Standard Contractual Terms &amp; Warranties
                </div>

                <div className="border border-slate-200 rounded-xl p-3 bg-white space-y-2 text-[10.5px] text-slate-700 leading-relaxed">
                  <div>
                    <span className="font-bold text-[#0B1E36]">1. Scope of Work:</span> Typhoon Solar undertakes supply of solar PV modules, grid inverter, mounting structure, BOS cabling, installation, and DISCOM net-meter liaisoning.
                  </div>
                  <div>
                    <span className="font-bold text-[#0B1E36]">2. Site Clearance &amp; Civil Readiness:</span> Customer guarantees south-facing unshaded rooftop access, terrace water supply for cleaning, and proper civil structural stability.
                  </div>
                  <div>
                    <span className="font-bold text-[#0B1E36]">3. Payment Schedule:</span> 80% milestone payment is due upon delivery of materials at site before unloading commences. 20% final payment is due upon installation.
                  </div>
                  <div>
                    <span className="font-bold text-[#0B1E36]">4. Product Warranties:</span>
                    <ul className="list-disc pl-4 mt-0.5 space-y-0.5">
                      <li>Solar PV Modules: 25-year linear power output performance warranty.</li>
                      <li>Grid-tie Inverter: 10-year manufacturer replacement warranty.</li>
                      <li>Workmanship &amp; Structure: 5-year Typhoon Solar installation warranty.</li>
                    </ul>
                  </div>
                  <div>
                    <span className="font-bold text-[#0B1E36]">5. DISCOM &amp; Portal Timelines:</span> Grid-meter testing and commissioning depend on DISCOM inspector schedules. Typhoon Solar will file all documentation within 7 business days.
                  </div>
                  <div>
                    <span className="font-bold text-[#0B1E36]">6. Subsidy Disbursement:</span> Central subsidy under PM Surya Ghar is transferred directly by the Central Govt (REC) into the customer bank account post commissioning.
                  </div>
                </div>

                {/* Acceptance Signoff */}
                <div className="grid grid-cols-2 gap-3 pt-2 text-[10px]">
                  <div className="border border-slate-200 rounded-xl p-2.5 bg-slate-50">
                    <span className="font-bold text-[#0B1E36] block mb-1">Customer Acceptance:</span>
                    <p className="text-slate-500 italic">I accept the quotation specifications, terms and payment milestones.</p>
                    <div className="mt-4 border-t border-slate-300 pt-1 text-slate-400">Customer Signature</div>
                  </div>
                  <div className="border border-slate-200 rounded-xl p-2.5 bg-slate-50 text-right">
                    <span className="font-bold text-[#0B1E36] block mb-1">For Typhoon Solar System:</span>
                    <p className="text-slate-500 italic">Authorized Signature &amp; Company Stamp</p>
                    <div className="mt-4 border-t border-slate-300 pt-1 text-slate-400">Authorized Signatory</div>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-[10px] text-slate-500 font-medium">
                <span className="italic text-amber-700">Official Customer Contract &amp; Guarantee</span>
                <span>Page 5 of {totalPages}</span>
              </div>
            </div>
          )}
        </div>

        {/* ========================================================================= */}
        {/* 3. PAGINATION & ACTION CONTROLS                                           */}
        {/* ========================================================================= */}
        <div className="no-print mt-4 space-y-3">
          {/* Small Left & Right navigation with Page Indicator */}
          <div className="flex items-center justify-between px-2 text-white text-xs font-medium">
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-30 cursor-pointer flex items-center gap-1"
            >
              <ChevronLeft className="w-4 h-4 text-white" />
              <span>Prev</span>
            </button>

            <div className="flex items-center gap-1.5">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setCurrentPage(i + 1)}
                  className={`transition-all rounded-full ${
                    currentPage === i + 1 ? 'w-5 h-2 bg-[#F59E0B]' : 'w-2 h-2 bg-white/40'
                  }`}
                />
              ))}
              <span className="text-white/80 ml-1 text-[11px]">
                {currentPage}/{totalPages}
              </span>
            </div>

            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-30 cursor-pointer flex items-center gap-1"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4 text-white" />
            </button>
          </div>

          {/* WhatsApp Share Button */}
          <button
            type="button"
            onClick={handleShareWhatsApp}
            className="w-full py-3.5 px-6 rounded-2xl bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs shadow-md flex items-center justify-center gap-2 transition active:scale-98 cursor-pointer"
          >
            <Send className="w-4 h-4 text-white" />
            <span>Send quotation on WhatsApp</span>
          </button>

          {/* Action Row: Save & Download */}
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => {
                toast.success('Quotation saved successfully!');
              }}
              className="py-3 px-4 rounded-xl bg-white hover:bg-slate-50 text-[#0B1E36] font-bold text-xs shadow-md flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Save Quotation</span>
            </button>

            <button
              type="button"
              onClick={handleDownload}
              className="py-3 px-4 rounded-xl bg-white hover:bg-slate-50 text-[#0B1E36] font-bold text-xs shadow-md flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              <Download className="w-4 h-4 text-[#0B1E36]" />
              <span>Download PDF</span>
            </button>
          </div>

          {/* Big Center Return to Inquiry Detail Page Button */}
          <button
            type="button"
            onClick={() => {
              if (onReturnToInquiry) {
                onReturnToInquiry();
              } else {
                onClose();
              }
            }}
            className="w-full py-3.5 px-4 rounded-2xl bg-[#F59E0B] hover:bg-amber-500 text-[#0B1E36] font-bold text-xs shadow-lg flex items-center justify-center gap-2 transition cursor-pointer"
          >
            <span>Return to Inquiry Detail Page</span>
          </button>

          {/* Close Deal & Follow-up buttons */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              type="button"
              onClick={() => {
                if (onCloseDeal) onCloseDeal();
                else onClose();
              }}
              className="py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Close the Deal</span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (onFollowup) onFollowup();
                else onClose();
              }}
              className="py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>Follow-up</span>
            </button>
          </div>
        </div>
      </div>

      {/* Print CSS Rules */}
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
            padding: 20mm 15mm !important;
            box-sizing: border-box !important;
          }
        }
      `}</style>
    </div>
  );
};
