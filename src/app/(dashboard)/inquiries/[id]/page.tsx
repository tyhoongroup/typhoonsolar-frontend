'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  ChevronLeft,
  Phone,
  Calendar,
  Check,
  Clock,
  Plus,
  X,
  User,
  MapPin,
  Zap,
  FileText,
  MessageSquare,
  AlertCircle,
  Share2,
  CheckCircle2,
  Send,
  ChevronRight,
  ExternalLink,
  Home,
  IndianRupee,
  Sparkles,
  Edit3,
} from 'lucide-react';
import { toast } from 'sonner';
import { useCurrentUser } from '@/lib/use-current-user';
import { FollowUpModal } from '@/components/FollowUpModal';
import { fetchWithAuth } from '@/lib/api';

export default function InquiryDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const inquiryId = params.id;
  const { user, theme } = useCurrentUser();

  const [inquiry, setInquiry] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Edit Inquiry Modal State
  const [showEditModal, setShowEditModal] = useState(false);
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editCity, setEditCity] = useState('');
  const [editAddress, setEditAddress] = useState('');
  const [editKw, setEditKw] = useState('');
  const [savingEdit, setSavingEdit] = useState(false);

  // Close Deal Modal State
  const [showCloseDealModal, setShowCloseDealModal] = useState(false);
  const [modalDealAmount, setModalDealAmount] = useState('275000');
  const [closingDeal, setClosingDeal] = useState(false);
  const [isFollowupOpen, setIsFollowupOpen] = useState(false);

  // Load live inquiry data from backend
  const loadInquiry = () => {
    const token = localStorage.getItem('accessToken');
    if (!token || token === 'null' || token === 'undefined') {
      localStorage.clear();
      router.push('/');
      return;
    }

    fetch(`/api/v1/inquiries/${inquiryId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        const item = data?.data || data;
        if (item) {
          setInquiry(item);
          setEditName(item.customerName || '');
          setEditPhone(item.customerPhone || '');
          setEditCity(item.city || '');
          setEditAddress(item.address || '');
          setEditKw(String(item.requestedKw || ''));

          if (item.quotation?.grossCost) {
            setModalDealAmount(String(item.quotation.grossCost));
          } else if (item.dealAmount) {
            setModalDealAmount(String(item.dealAmount));
          } else if (item.requestedKw) {
            setModalDealAmount(String(Math.round(Number(item.requestedKw) * 50000)));
          }
        }
      })
      .catch((err) => {
        console.error('Failed to load inquiry:', err);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadInquiry();
  }, [inquiryId]);

  // Stage mapping helper
  const getStageMeta = (stage?: string) => {
    switch (stage) {
      case 'INQUIRY_RECEIVED':
        return { name: 'Inquiry received', num: 1, percent: '10%' };
      case 'SITE_VISIT_PLANNED':
        return { name: 'Site inspection & survey', num: 2, percent: '20%' };
      case 'QUOTATION_SENT':
        return { name: 'Quotation negotiation', num: 3, percent: '30%' };
      case 'DEAL_CLOSED':
        return { name: 'Deal closed & KYC', num: 4, percent: '40%' };
      case 'GOVT_DOCS_SUBMITTED':
      case 'SR_NUMBER_ISSUED':
        return { name: 'Govt portal filing', num: 5, percent: '50%' };
      case 'MATERIAL_PLANNED':
      case 'MATERIAL_UNLOADED':
        return { name: 'Material & BOM delivery', num: 7, percent: '70%' };
      case 'INSTALLATION_DONE':
        return { name: 'Installation & testing', num: 8, percent: '80%' };
      case 'METER_STARTED':
      case 'COMPLETED':
        return { name: 'Commissioned & Subsidy', num: 10, percent: '100%' };
      default:
        return { name: 'Quotation and visit', num: 2, percent: '20%' };
    }
  };

  const stageMeta = getStageMeta(inquiry?.currentStage);

  const customerName = inquiry?.customerName || 'Customer';
  const customerPhone = inquiry?.customerPhone || '9825012345';
  const requestedKw = inquiry?.requestedKw || '6.0';
  const meterPhase = inquiry?.meterPhase || 'Single Phase';
  const followupId = inquiry?.followupId || inquiryId;
  const assignedSp = inquiry?.assignedSalesperson?.fullName || 'Amit';
  const quoteDueDays = inquiry?.quoteDueDays || 3;

  // Pipeline 3 Core Stages computation
  const hasLoggedCall = Boolean(
    inquiry?.followups?.some(
      (f: any) =>
        f.status === 'CALL_DONE' ||
        (f.description && f.description.toLowerCase().includes('call'))
    )
  );

  const isCallDone = Boolean(
    hasLoggedCall ||
    inquiry?.siteVisit ||
    inquiry?.quotation ||
    (inquiry?.currentStage &&
      !['INQUIRY_RECEIVED', 'NEW', 'ASSIGNED'].includes(inquiry.currentStage)) ||
    inquiry?.dealAmount
  );

  const hasSiteVisit = Boolean(
    inquiry?.siteVisit ||
    inquiry?.followups?.some(
      (f: any) =>
        f.stage === 'SITE_VISIT_DONE' ||
        (f.description && f.description.toLowerCase().includes('site visit'))
    )
  );

  const isSiteVisitDone = Boolean(
    hasSiteVisit ||
    inquiry?.quotation ||
    (inquiry?.currentStage &&
      !['INQUIRY_RECEIVED', 'NEW', 'ASSIGNED', 'SITE_VISIT_PLANNED'].includes(inquiry.currentStage)) ||
    inquiry?.dealAmount
  );

  const isQuotationDone = Boolean(
    inquiry?.quotation ||
    ['QUOTATION_SENT', 'DEAL_CLOSED', 'COMPLETED'].includes(inquiry?.currentStage) ||
    inquiry?.dealAmount
  );

  const isDealClosed = inquiry?.currentStage === 'DEAL_CLOSED' || Boolean(inquiry?.dealAmount);

  // Primary action button decision
  let primaryAction: {
    label: string;
    icon: React.ReactNode;
    onClick: () => void;
  };

  if (!isCallDone) {
    primaryAction = {
      label: 'Log a call',
      icon: <Phone className="w-5 h-5" />,
      onClick: () => router.push(`/inquiries/${followupId}/log-call`),
    };
  } else if (!isSiteVisitDone) {
    primaryAction = {
      label: 'Site visit done',
      icon: <Home className="w-5 h-5" />,
      onClick: () => router.push(`/inquiries/${followupId}/site-visit`),
    };
  } else if (!isQuotationDone) {
    primaryAction = {
      label: 'Send quotation',
      icon: <FileText className="w-5 h-5" />,
      onClick: () => router.push(`/quotations/new?inquiryId=${followupId}`),
    };
  } else {
    primaryAction = {
      label: isDealClosed ? 'View Project & KYC Docs' : 'Close the deal',
      icon: <CheckCircle2 className="w-5 h-5" />,
      onClick: () => {
        if (isDealClosed) {
          router.push(`/projects/${followupId}`);
        } else {
          router.push(`/inquiries/${followupId}/deal-closed`);
        }
      },
    };
  }

  // Handle Edit Inquiry Submission
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim() || !editPhone.trim()) {
      toast.error('Customer name and phone number are required.');
      return;
    }
    try {
      setSavingEdit(true);
      const res = await fetchWithAuth(`/api/v1/inquiries/${inquiry?.id || inquiryId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: editName.trim(),
          customerPhone: editPhone.trim(),
          city: editCity.trim(),
          address: editAddress.trim(),
          requestedKw: editKw ? Number(editKw) : undefined,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to update inquiry details.');
      }

      setInquiry((prev: any) => ({
        ...prev,
        customerName: editName.trim(),
        customerPhone: editPhone.trim(),
        city: editCity.trim(),
        address: editAddress.trim(),
        requestedKw: editKw ? Number(editKw) : prev?.requestedKw,
      }));
      setShowEditModal(false);
      toast.success('Inquiry details updated successfully!');
    } catch (err: any) {
      toast.error(err.message || 'Error updating inquiry.');
    } finally {
      setSavingEdit(false);
    }
  };

  // Handle Close Deal confirmation
  const handleConfirmCloseDeal = async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      toast.error('Session expired. Please sign in again.');
      router.push('/');
      return;
    }

    const cleanAmount = Number(modalDealAmount.replace(/\D/g, ''));
    if (!cleanAmount || cleanAmount <= 0) {
      toast.error('Please enter a valid deal amount.');
      return;
    }

    setClosingDeal(true);
    try {
      const res = await fetch(`/api/v1/inquiries/${inquiry?.id || inquiryId}/close-deal`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          dealAmount: cleanAmount,
        }),
      });

      const resData = await res.json();
      if (!res.ok) {
        throw new Error(resData.message || 'Failed to close deal.');
      }

      const generatedProjectId = `TYP-2026-${followupId.replace('F-', '')}`;
      toast.success(`Deal closed successfully! Project ${generatedProjectId} created.`);
      setShowCloseDealModal(false);

      // Redirect to project detail page
      router.push(`/projects/${followupId}`);
    } catch (err: any) {
      toast.error(err.message || 'Failed to close deal.');
    } finally {
      setClosingDeal(false);
    }
  };

  const headerText = theme.hex.headerTextColor || '#ffffff';
  const headerSubtext = theme.hex.headerSubtextColor || 'rgba(255, 255, 255, 0.7)';
  const isLightHeader = headerText !== '#ffffff';
  const logoSrc = theme.hex.logoSrc || (isLightHeader ? '/images/typhoon-logo-dark.png' : '/images/typhoon-logo-white.png');

  return (
    <div className="min-h-screen bg-typhoon-sand pb-28">
      {/* ================================================================ */}
      {/* MOBILE LAYOUT (Screen 4 Layout)                                 */}
      {/* ================================================================ */}
      <div className="lg:hidden">
        {/* 1. Curved Header with Role Theme Colors */}
        <div
          style={{
            background: theme.hex.headerGradient || theme.hex.headerBg,
            color: headerText,
            boxShadow: isLightHeader
              ? '0 10px 30px -5px rgba(0, 0, 0, 0.12)'
              : '0 10px 30px -5px rgba(0, 0, 0, 0.25)',
          }}
          className="pt-6 pb-8 px-5 rounded-b-[32px] shadow-soft relative overflow-hidden"
        >
          <div
            className={`absolute top-0 right-0 w-64 h-64 border rounded-full pointer-events-none -mr-16 -mt-16 ${
              isLightHeader ? 'border-black/5' : 'border-white/5'
            }`}
          />
          <div
            className={`absolute top-0 right-0 w-44 h-44 border rounded-full pointer-events-none -mr-8 -mt-8 ${
              isLightHeader ? 'border-black/10' : 'border-white/10'
            }`}
          />

          <div className="max-w-md mx-auto">
            {/* Top Bar with Back button and Big Logo */}
            <div className="flex items-center justify-between mb-3">
              <button
                type="button"
                onClick={() => router.back()}
                style={{
                  color: headerText,
                  backgroundColor: isLightHeader ? 'rgba(30, 31, 36, 0.08)' : 'rgba(255, 255, 255, 0.1)',
                }}
                className="w-10 h-10 rounded-full flex items-center justify-center transition cursor-pointer hover:opacity-85"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <img
                src={logoSrc}
                alt="Typhoon Solar"
                className="h-12 sm:h-14 w-auto object-contain filter drop-shadow-sm"
              />
            </div>

            <h1 style={{ color: headerText }} className="text-3xl font-serif font-bold tracking-tight">
              Inquiry detail
            </h1>
            <p style={{ color: headerSubtext }} className="text-xs mt-1 font-medium">
              {followupId} · Follow-up ID
            </p>
          </div>
        </div>

        {/* 2. Mobile Body Cards */}
        <div className="max-w-md mx-auto px-4 pt-4 space-y-4">
          {/* Summary Card (Customer, Phone, Requirement, Assigned to) */}
          <div className="bg-white rounded-2xl p-5 border border-typhoon-border shadow-soft divide-y divide-typhoon-border/60">
            <div className="flex justify-between items-center py-2 text-xs first:pt-0">
              <span className="text-typhoon-muted font-medium">Customer</span>
              <div className="flex items-center gap-2">
                <span className="font-bold text-typhoon-navy text-sm">
                  {customerName}
                </span>
                <button
                  type="button"
                  onClick={() => setShowEditModal(true)}
                  className="px-2 py-0.5 rounded-md bg-typhoon-sand hover:bg-typhoon-sand-dark text-typhoon-navy text-[11px] font-bold flex items-center gap-1 transition cursor-pointer"
                >
                  <Edit3 className="w-3 h-3 text-typhoon-gold-dark" />
                  <span>Edit</span>
                </button>
              </div>
            </div>

            <div className="flex justify-between items-center py-2 text-xs">
              <span className="text-typhoon-muted font-medium">Phone</span>
              <div className="flex items-center gap-2">
                <span className="font-bold text-typhoon-navy text-sm">
                  +91 {customerPhone}
                </span>
                <a
                  href={`tel:${customerPhone.replace(/\D/g, '')}`}
                  className="w-6 h-6 rounded-full bg-typhoon-sand flex items-center justify-center text-typhoon-navy"
                >
                  <Phone className="w-3 h-3" />
                </a>
              </div>
            </div>

            <div className="flex justify-between items-center py-2 text-xs">
              <span className="text-typhoon-muted font-medium">Requirement</span>
              <span className="font-bold text-typhoon-navy text-sm">
                {requestedKw} kW, {meterPhase}
              </span>
            </div>

            <div className="flex justify-between items-center py-2 text-xs last:pb-0">
              <span className="text-typhoon-muted font-medium">Assigned to</span>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-typhoon-navy text-sm">
                  {assignedSp} · {quoteDueDays} days
                </span>
                <button
                  onClick={() => router.push(`/inquiries/${followupId}/assign`)}
                  className="text-[11px] font-bold text-typhoon-gold-dark hover:underline cursor-pointer"
                >
                  Change
                </button>
              </div>
            </div>
          </div>

          {/* Stage Progress Card */}
          <div className="bg-white rounded-2xl p-5 border border-typhoon-border shadow-soft space-y-2.5">
            <div className="flex justify-between items-center text-xs">
              <span className="font-medium text-typhoon-navy">
                {stageMeta.name}
              </span>
              <span className="font-bold text-typhoon-navy">
                Stage {stageMeta.num} of 10
              </span>
            </div>

            {/* Progress Bar with Gold / Accent Fill */}
            <div className="w-full h-2.5 bg-typhoon-sand rounded-full overflow-hidden">
              <div
                style={{ width: stageMeta.percent, backgroundColor: theme.hex.accentBg }}
                className="h-full rounded-full transition-all duration-500"
              />
            </div>
          </div>

          {/* 3 Core Stages Section: Customer called, Site visit, Quotation sent */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold tracking-widest text-typhoon-muted uppercase px-1">
              PIPELINE PROGRESS
            </h3>

            <div className="bg-white rounded-2xl border border-typhoon-border shadow-soft divide-y divide-typhoon-border/60 overflow-hidden">
              {/* 1. Customer called */}
              <div
                onClick={() => router.push(`/inquiries/${followupId}/log-call`)}
                className="p-4 flex items-center justify-between cursor-pointer hover:bg-typhoon-sand/40 transition-colors"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      isCallDone ? 'bg-emerald-50 text-emerald-700' : 'bg-typhoon-sand text-typhoon-navy'
                    }`}
                  >
                    <Phone className="w-5 h-5" />
                  </div>
                  <div className="truncate">
                    <h4 className="text-sm font-bold text-typhoon-navy truncate">
                      1. Customer called
                    </h4>
                    <p className="text-xs text-typhoon-muted truncate mt-0.5">
                      {isCallDone
                        ? inquiry?.followups?.find((f: any) => f.status === 'CALL_DONE' || f.description?.toLowerCase().includes('call'))?.description || 'Call completed with customer'
                        : 'Initial call pending'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                  <span
                    className={`text-xs font-bold px-3 py-1 rounded-full border ${
                      isCallDone
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : 'bg-amber-50 text-amber-800 border-amber-200'
                    }`}
                  >
                    {isCallDone ? 'Done' : 'Next'}
                  </span>
                  <ChevronRight className="w-4 h-4 text-typhoon-muted" />
                </div>
              </div>

              {/* 2. Site visit */}
              <div
                onClick={() => router.push(`/inquiries/${followupId}/site-visit`)}
                className="p-4 flex items-center justify-between cursor-pointer hover:bg-typhoon-sand/40 transition-colors"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      isSiteVisitDone ? 'bg-emerald-50 text-emerald-700' : 'bg-typhoon-sand text-typhoon-navy'
                    }`}
                  >
                    <Home className="w-5 h-5" />
                  </div>
                  <div className="truncate">
                    <h4 className="text-sm font-bold text-typhoon-navy truncate">
                      2. Site visit
                    </h4>
                    <p className="text-xs text-typhoon-muted truncate mt-0.5">
                      {isSiteVisitDone
                        ? inquiry?.siteVisit?.notes || 'Roof area & wiring verified'
                        : isCallDone
                        ? 'Schedule & log terrace inspection'
                        : 'Pending customer call'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                  <span
                    className={`text-xs font-bold px-3 py-1 rounded-full border ${
                      isSiteVisitDone
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : isCallDone
                        ? 'bg-amber-50 text-amber-800 border-amber-200'
                        : 'bg-typhoon-sand text-typhoon-muted border-typhoon-border'
                    }`}
                  >
                    {isSiteVisitDone ? 'Done' : isCallDone ? 'Next' : 'Pending'}
                  </span>
                  <ChevronRight className="w-4 h-4 text-typhoon-muted" />
                </div>
              </div>

              {/* 3. Quotation sent */}
              <div
                onClick={() => router.push(`/quotations/new?inquiryId=${followupId}`)}
                className="p-4 flex items-center justify-between cursor-pointer hover:bg-typhoon-sand/40 transition-colors"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      isQuotationDone ? 'bg-emerald-50 text-emerald-700' : 'bg-typhoon-sand text-typhoon-navy'
                    }`}
                  >
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="truncate">
                    <h4 className="text-sm font-bold text-typhoon-navy truncate">
                      3. Quotation sent
                    </h4>
                    <p className="text-xs text-typhoon-muted truncate mt-0.5">
                      {isQuotationDone
                        ? `Quotation sent · ₹${(inquiry?.quotation?.netCustomerCost || 172050).toLocaleString('en-IN')}`
                        : isSiteVisitDone
                        ? 'Configure Excel sizing & WhatsApp quotation'
                        : 'Pending site survey'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                  <span
                    className={`text-xs font-bold px-3 py-1 rounded-full border ${
                      isQuotationDone
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : isSiteVisitDone
                        ? 'bg-amber-50 text-amber-800 border-amber-200'
                        : 'bg-typhoon-sand text-typhoon-muted border-typhoon-border'
                    }`}
                  >
                    {isQuotationDone ? 'Done' : isSiteVisitDone ? 'Next' : 'Pending'}
                  </span>
                  <ChevronRight className="w-4 h-4 text-typhoon-muted" />
                </div>
              </div>
            </div>
          </div>

          {/* Action Hub Buttons: Dynamically switches based on current pipeline state */}
          <div className="pt-2 space-y-2">
            <div className="flex gap-2">
              <button
                onClick={primaryAction.onClick}
                style={{
                  background: theme.hex.accentGradient || theme.hex.accentBg,
                  color: theme.hex.accentTextColor,
                  boxShadow: theme.hex.accentShadow || '0 8px 24px -4px rgba(36, 72, 255, 0.4)',
                }}
                className="flex-1 py-4 px-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition cursor-pointer hover:opacity-95 active:scale-98"
              >
                {primaryAction.icon}
                <span>{primaryAction.label}</span>
              </button>

              <button
                type="button"
                onClick={() => setIsFollowupOpen(true)}
                className="py-4 px-4 rounded-2xl bg-white hover:bg-typhoon-sand border border-typhoon-border text-typhoon-navy font-bold text-xs shadow-soft flex items-center justify-center gap-1.5 transition cursor-pointer"
              >
                <Clock className="w-4 h-4 text-typhoon-gold" />
                <span>Follow-up</span>
              </button>
            </div>

            {/* If quotation is already done and deal is not closed, show explicit Close the deal option */}
            {isQuotationDone && !isDealClosed && (
              <button
                onClick={() => router.push(`/inquiries/${followupId}/deal-closed`)}
                className="w-full py-3.5 px-4 rounded-2xl bg-white hover:bg-typhoon-sand border border-typhoon-border text-typhoon-navy font-bold text-xs shadow-soft flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Close the deal (Setup Milestone Terms)</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ================================================================ */}
      {/* DESKTOP LAYOUT (2-Column Grid Layout)                           */}
      {/* ================================================================ */}
      <div className="hidden lg:block max-w-6xl mx-auto px-6 py-8 space-y-6">
        {/* Top Header Card */}
        <div
          style={{
            background: theme.hex.headerGradient || theme.hex.headerBg,
            color: headerText,
            boxShadow: isLightHeader
              ? '0 10px 30px -5px rgba(217, 162, 58, 0.3)'
              : '0 10px 30px -5px rgba(0, 0, 0, 0.25)',
          }}
          className="rounded-3xl p-6 shadow-soft relative overflow-hidden"
        >
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => router.back()}
              style={{
                color: headerText,
                backgroundColor: isLightHeader ? 'rgba(30, 31, 36, 0.08)' : 'rgba(255, 255, 255, 0.1)',
              }}
              className="w-9 h-9 rounded-full flex items-center justify-center hover:opacity-85 transition cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <span
                style={{
                  backgroundColor: theme.hex.accentBg,
                  color: theme.hex.accentTextColor,
                }}
                className="text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-sm uppercase tracking-wide"
              >
                Stage {stageMeta.num} of 10
              </span>
              <span style={{ color: headerSubtext }} className="text-xs">{stageMeta.name}</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h1 style={{ color: headerText }} className="text-3xl font-serif font-bold tracking-tight">
                {customerName}
              </h1>
              <p style={{ color: headerSubtext }} className="text-xs mt-1 font-medium">
                Inquiry {followupId} · {inquiry?.city || 'Vadodara'} · +91 {customerPhone}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <a
                href={`tel:${customerPhone.replace(/\D/g, '')}`}
                className="bg-white/10 hover:bg-white/20 text-white font-semibold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 transition"
              >
                <Phone className="w-4 h-4 text-white/80" />
                <span>Call Customer</span>
              </a>

              <button
                onClick={primaryAction.onClick}
                style={{
                  backgroundColor: theme.hex.accentBg,
                  color: theme.hex.accentTextColor,
                }}
                className="font-bold px-5 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-soft transition hover:opacity-95 cursor-pointer"
              >
                {primaryAction.icon}
                <span>{primaryAction.label}</span>
              </button>
            </div>
          </div>
        </div>

        {/* 2-Column Desktop Grid */}
        <div className="grid grid-cols-12 gap-6 items-start">
          {/* Left Column: Specifications */}
          <div className="col-span-4 space-y-4">
            <div className="bg-white rounded-2xl p-5 border border-typhoon-border shadow-soft space-y-4">
              <h3 className="text-xs font-bold tracking-widest text-typhoon-muted uppercase">
                SYSTEM SPECIFICATIONS
              </h3>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-typhoon-sand/60 p-3 rounded-xl border border-typhoon-border/60">
                  <span className="text-[10px] text-typhoon-muted font-semibold uppercase block">Capacity</span>
                  <span className="text-base font-bold text-typhoon-navy">{requestedKw} kW</span>
                </div>
                <div className="bg-typhoon-sand/60 p-3 rounded-xl border border-typhoon-border/60">
                  <span className="text-[10px] text-typhoon-muted font-semibold uppercase block">Phase</span>
                  <span className="text-base font-bold text-typhoon-navy">{meterPhase}</span>
                </div>
                <div className="bg-typhoon-sand/60 p-3 rounded-xl border border-typhoon-border/60">
                  <span className="text-[10px] text-typhoon-muted font-semibold uppercase block">Region</span>
                  <span className="text-base font-bold text-typhoon-navy">{inquiry?.city || 'Vadodara'}</span>
                </div>
                <div className="bg-typhoon-sand/60 p-3 rounded-xl border border-typhoon-border/60">
                  <span className="text-[10px] text-typhoon-muted font-semibold uppercase block">Subsidy</span>
                  <span className="text-base font-bold text-emerald-600">₹78,000 DBT</span>
                </div>
              </div>

              <div className="pt-2 border-t border-typhoon-border/60 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-typhoon-muted font-medium">Assigned Salesperson:</span>
                  <span className="font-bold text-typhoon-navy">{assignedSp}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-typhoon-muted font-medium">SLA Commitment:</span>
                  <span className="font-bold text-typhoon-navy">{quoteDueDays} days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-typhoon-muted font-medium">Full Address:</span>
                  <span className="font-semibold text-typhoon-navy text-right max-w-[180px] truncate">
                    {inquiry?.address || 'Vadodara, Gujarat'}
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-typhoon-border/60">
                <button
                  onClick={() => router.push(`/inquiries/${followupId}/assign`)}
                  className="w-full py-2.5 rounded-xl bg-typhoon-sand hover:bg-typhoon-sand-dark text-typhoon-navy font-bold text-xs transition border border-typhoon-border text-center cursor-pointer"
                >
                  Reassign Salesperson
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: 3-Stage Pipeline & History */}
          <div className="col-span-8 space-y-4">
            <div className="bg-white rounded-2xl p-6 border border-typhoon-border shadow-soft space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-typhoon-border/60">
                <div>
                  <h3 className="text-base font-serif font-bold text-typhoon-navy">
                    Pipeline Stages
                  </h3>
                  <p className="text-xs text-typhoon-muted">
                    Core 3 milestone workflow for {followupId}
                  </p>
                </div>

                {isQuotationDone && !isDealClosed && (
                  <button
                    onClick={() => setShowCloseDealModal(true)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Close the Deal</span>
                  </button>
                )}
              </div>

              {/* 3 Core Stages List */}
              <div className="space-y-3">
                {/* 1. Customer called */}
                <div
                  onClick={() => router.push(`/inquiries/${followupId}/log-call`)}
                  className="p-4 rounded-xl bg-typhoon-sand/30 border border-typhoon-border/70 hover:border-typhoon-gold transition-colors flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                        isCallDone ? 'bg-emerald-100 text-emerald-800' : 'bg-typhoon-sand text-typhoon-navy'
                      }`}
                    >
                      <Phone className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-typhoon-navy">Stage 1: Customer called</h4>
                      <p className="text-xs text-typhoon-muted">
                        {isCallDone ? 'Initial phone call logged & requirement discussed' : 'Initial phone call pending'}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`text-xs font-bold px-3 py-1 rounded-full border ${
                      isCallDone ? 'bg-emerald-50 text-emerald-800 border-emerald-300' : 'bg-amber-50 text-amber-800 border-amber-300'
                    }`}
                  >
                    {isCallDone ? 'Done' : 'Next'}
                  </span>
                </div>

                {/* 2. Site visit */}
                <div
                  onClick={() => router.push(`/inquiries/${followupId}/site-visit`)}
                  className="p-4 rounded-xl bg-typhoon-sand/30 border border-typhoon-border/70 hover:border-typhoon-gold transition-colors flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                        isSiteVisitDone ? 'bg-emerald-100 text-emerald-800' : 'bg-typhoon-sand text-typhoon-navy'
                      }`}
                    >
                      <Home className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-typhoon-navy">Stage 2: Site visit</h4>
                      <p className="text-xs text-typhoon-muted">
                        {isSiteVisitDone ? 'Terrace dimensions, shadow conditions & wiring verified' : 'Terrace inspection and sizing check'}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`text-xs font-bold px-3 py-1 rounded-full border ${
                      isSiteVisitDone
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                        : isCallDone
                        ? 'bg-amber-50 text-amber-800 border-amber-300'
                        : 'bg-typhoon-sand text-typhoon-muted border-typhoon-border'
                    }`}
                  >
                    {isSiteVisitDone ? 'Done' : isCallDone ? 'Next' : 'Pending'}
                  </span>
                </div>

                {/* 3. Quotation sent */}
                <div
                  onClick={() => router.push(`/quotations/new?inquiryId=${followupId}`)}
                  className="p-4 rounded-xl bg-typhoon-sand/30 border border-typhoon-border/70 hover:border-typhoon-gold transition-colors flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                        isQuotationDone ? 'bg-emerald-100 text-emerald-800' : 'bg-typhoon-sand text-typhoon-navy'
                      }`}
                    >
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-typhoon-navy">Stage 3: Quotation sent</h4>
                      <p className="text-xs text-typhoon-muted">
                        {isQuotationDone ? 'Excel-formula quotation generated & sent on WhatsApp' : 'Calculate system pricing & share WhatsApp PDF'}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`text-xs font-bold px-3 py-1 rounded-full border ${
                      isQuotationDone
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                        : isSiteVisitDone
                        ? 'bg-amber-50 text-amber-800 border-amber-300'
                        : 'bg-typhoon-sand text-typhoon-muted border-typhoon-border'
                    }`}
                  >
                    {isQuotationDone ? 'Done' : isSiteVisitDone ? 'Next' : 'Pending'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================================================================ */}
      {/* CLOSE THE DEAL MODAL                                             */}
      {/* ================================================================ */}
      {showCloseDealModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="bg-white w-full max-w-sm rounded-3xl p-6 border border-typhoon-border shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-serif font-bold text-typhoon-navy tracking-tight">
                  Close the deal
                </h3>
                <p className="text-xs text-typhoon-muted mt-0.5">
                  {followupId} · {customerName}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowCloseDealModal(false)}
                className="w-8 h-8 rounded-full bg-typhoon-sand flex items-center justify-center text-typhoon-navy hover:bg-typhoon-sand-dark transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quotation Reference Box */}
            <div className="bg-typhoon-sand/60 p-3.5 rounded-2xl border border-typhoon-border/70 flex justify-between items-center text-xs">
              <span className="text-typhoon-muted font-medium">Quotation Total Price:</span>
              <span className="font-bold text-typhoon-navy text-sm">
                ₹{Number(modalDealAmount || 275000).toLocaleString('en-IN')}
              </span>
            </div>

            {/* Agreed Deal Amount Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-typhoon-navy block">
                Agreed Deal Amount (₹)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-typhoon-muted">
                  <IndianRupee className="w-4 h-4" />
                </div>
                <input
                  type="number"
                  value={modalDealAmount}
                  onChange={(e) => setModalDealAmount(e.target.value)}
                  className="w-full pl-9 pr-4 py-3 bg-white border border-typhoon-border rounded-2xl font-bold text-typhoon-navy text-base outline-none focus:ring-2 focus:ring-typhoon-gold"
                  placeholder="275000"
                />
              </div>
              <p className="text-[11px] text-typhoon-muted">
                Saving will create Project ID TYP-2026-{followupId.replace('F-', '')} and move to KYC document upload.
              </p>
            </div>

            {/* Modal Buttons */}
            <div className="pt-2 flex gap-2">
              <button
                type="button"
                onClick={() => setShowCloseDealModal(false)}
                className="flex-1 py-3 rounded-2xl border border-typhoon-border font-bold text-xs text-typhoon-navy hover:bg-typhoon-sand transition cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleConfirmCloseDeal}
                disabled={closingDeal}
                style={{
                  backgroundColor: theme.hex.accentBg,
                  color: theme.hex.accentTextColor,
                }}
                className="flex-1 py-3 rounded-2xl font-bold text-xs shadow-soft transition hover:opacity-95 active:scale-98 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{closingDeal ? 'Closing...' : 'Convert to Project'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================================================================ */}
      {/* EDIT INQUIRY MODAL (Operations Manager)                          */}
      {/* ================================================================ */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-xs">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 border border-typhoon-border shadow-2xl space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-typhoon-border">
              <h3 className="font-serif font-bold text-lg text-typhoon-navy flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-typhoon-gold-dark" />
                <span>Edit Inquiry Details</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowEditModal(false)}
                className="w-8 h-8 rounded-full bg-typhoon-sand flex items-center justify-center text-typhoon-navy hover:bg-typhoon-sand-dark transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-typhoon-navy block mb-1">Customer Full Name *</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-typhoon-border bg-white text-xs font-semibold text-typhoon-navy focus:outline-none focus:ring-2 focus:ring-typhoon-navy"
                  placeholder="Full name"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-typhoon-navy block mb-1">Mobile Phone Number *</label>
                <input
                  type="tel"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-typhoon-border bg-white text-xs font-semibold text-typhoon-navy focus:outline-none focus:ring-2 focus:ring-typhoon-navy"
                  placeholder="10-digit phone"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-typhoon-navy block mb-1">City / District</label>
                  <input
                    type="text"
                    value={editCity}
                    onChange={(e) => setEditCity(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-typhoon-border bg-white text-xs font-semibold text-typhoon-navy focus:outline-none focus:ring-2 focus:ring-typhoon-navy"
                    placeholder="City"
                  />
                </div>
                <div>
                  <label className="font-bold text-typhoon-navy block mb-1">Capacity (kW)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={editKw}
                    onChange={(e) => setEditKw(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-typhoon-border bg-white text-xs font-semibold text-typhoon-navy focus:outline-none focus:ring-2 focus:ring-typhoon-navy"
                    placeholder="e.g. 5.5"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-typhoon-navy block mb-1">Site Address</label>
                <textarea
                  rows={2}
                  value={editAddress}
                  onChange={(e) => setEditAddress(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-typhoon-border bg-white text-xs font-medium text-typhoon-navy focus:outline-none focus:ring-2 focus:ring-typhoon-navy"
                  placeholder="Complete address or village area"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-typhoon-sand text-typhoon-navy font-bold text-xs cursor-pointer hover:bg-typhoon-sand-dark transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingEdit}
                  className="px-5 py-2.5 rounded-xl bg-typhoon-navy text-white font-bold text-xs shadow-soft hover:bg-typhoon-navy-light disabled:opacity-50 cursor-pointer transition"
                >
                  {savingEdit ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Universal Follow-up Modal */}
      <FollowUpModal
        isOpen={isFollowupOpen}
        onClose={() => setIsFollowupOpen(false)}
        inquiryId={followupId || inquiry?.id}
        onSuccess={() => {
          setIsFollowupOpen(false);
          toast.success('Follow-up recorded!');
          loadInquiry();
        }}
      />
    </div>
  );
}
