'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { QuotationPdfPreview, QuotationData } from '@/components/QuotationPdfPreview';
import { fetchWithAuth } from '@/lib/api';
import { useCurrentUser } from '@/lib/use-current-user';

export default function QuotationPreviewStandalonePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const inquiryId = searchParams.get('inquiryId') || searchParams.get('id') || 'F-1026';
  const { user } = useCurrentUser();

  const [inquiry, setInquiry] = useState<any>(null);
  const [quotation, setQuotation] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetchWithAuth(`/api/v1/inquiries/${inquiryId}`);
        if (res.ok) {
          const inqData = await res.json();
          setInquiry(inqData);
          if (inqData.quotation) {
            setQuotation(inqData.quotation);
          }
        }
      } catch (err) {
        console.error('Failed to load quotation data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [inquiryId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a1c36] flex items-center justify-center text-white text-sm">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          <span>Loading official quotation document...</span>
        </div>
      </div>
    );
  }

  const capacityKw = Number(quotation?.plantCapacityKw || inquiry?.requestedKw || 60.27);
  const totalCost = Number(quotation?.grossCost || (inquiry?.dealAmount ? Number(inquiry.dealAmount) : 2141000));
  const ratePerKw = Math.round(totalCost / (capacityKw || 1));
  const gedaFee = capacityKw > 10 ? 15463 : 2500;
  const meterCharge = inquiry?.meterPhase?.toLowerCase().includes('three') ? 86000 : 2950;
  const systemCost = Math.max(0, totalCost - gedaFee - meterCharge);

  const previewData: QuotationData = {
    quotationNo: quotation?.quotationNo || `TSS/2627/${(inquiry?.followupId || inquiryId).replace(/\D/g, '') || '362'}`,
    createdByName: user?.fullName || 'FAHIM SAIYED',
    customerName: inquiry?.customerName || 'MAJIDBHAI CHAUHAN',
    contactNo: inquiry?.customerPhone ? `+91 ${inquiry.customerPhone}` : '+91 96248 28181',
    address: inquiry?.address || inquiry?.city || 'URAD',
    projectType: capacityKw > 10 ? 'Commercial Solar Project' : 'Residential Solar Project',
    systemSizeKw: capacityKw,
    panelWattage: quotation?.panelWattage || 615,
    panelBrand: quotation?.panelBrand || 'WAAREE',
    panelTech: quotation?.panelTech || 'Topcon',
    numPanels: quotation?.panelQuantity || Math.round((capacityKw * 1000) / 615) || 98,
    inverterKw: quotation?.inverterCapacityKw ? Number(quotation.inverterCapacityKw) : 60,
    inverterBrand: quotation?.inverterBrand || 'Polycab',
    meterPhase: inquiry?.meterPhase || 'Three phase',
    ratePerKw,
    systemCost,
    gedaFee,
    meterCharges: meterCharge,
    totalCost,
    annualGenerationKwh: Number(quotation?.annualGenerationKwh || Math.round(capacityKw * 1642.5)) || 98993,
    annualSavingsRs: Number(quotation?.annualSavingsRs || Math.round(capacityKw * 12318)) || 742451,
    paybackYears: Number(quotation?.paybackPeriodYears || (totalCost / (capacityKw * 12318)).toFixed(2)) || 2.88,
    treesSavedAnnually: quotation?.treesSavedAnnually || Math.round(capacityKw * 64) || 3859,
    co2ReductionTonnes: quotation?.co2ReductionTonnes || Math.round(capacityKw * 1.39) || 84,
  };

  return (
    <QuotationPdfPreview
      data={previewData}
      onClose={() => router.back()}
    />
  );
}
