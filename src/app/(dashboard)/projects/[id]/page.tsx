'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  ChevronLeft,
  Check,
  Clock,
  FileText,
  Camera,
  Layers,
  ArrowRight,
  User,
  Plus,
  Share2,
  Calendar,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  Phone,
} from 'lucide-react';
import { toast } from 'sonner';
import { useCurrentUser } from '@/lib/use-current-user';
import { FollowUpModal } from '@/components/FollowUpModal';

interface StageConfig {
  index: number;
  id: string;
  num: number;
  label: string;
  name: string;
  defaultOwner: string;
  workspaceUrl: string;
}

const STAGE_ORDER_MAP: Record<string, number> = {
  INQUIRY_RECEIVED: 1,
  SITE_VISIT_PLANNED: 2,
  QUOTATION_SENT: 3,
  DEAL_CLOSED: 4,
  GOVT_DOCS_SUBMITTED: 5,
  SR_NUMBER_ISSUED: 6,
  MATERIAL_PLANNED: 7,
  MATERIAL_UNLOADED: 8,
  INSTALLATION_DONE: 9,
  METER_FILE_SUBMITTED: 10,
  METER_STARTED: 10,
  SUBSIDY_CLAIMED: 10,
  SUBSIDY_RECEIVED: 10,
  COMPLETED: 10,
};

const STAGE_CONFIGS: StageConfig[] = [
  {
    index: 1,
    id: 'INQUIRY_RECEIVED',
    num: 1,
    label: 'Inquiry',
    name: 'Initial Solar Inquiry',
    defaultOwner: 'Salesperson',
    workspaceUrl: '/inquiries',
  },
  {
    index: 2,
    id: 'SITE_VISIT_PLANNED',
    num: 2,
    label: 'Visit',
    name: 'Site Survey & Rooftop Visit',
    defaultOwner: 'Salesperson',
    workspaceUrl: '/site-visit',
  },
  {
    index: 3,
    id: 'QUOTATION_SENT',
    num: 3,
    label: 'Quote',
    name: 'Quotation & Pricing Proposal',
    defaultOwner: 'Salesperson',
    workspaceUrl: '/quotations/new',
  },
  {
    index: 4,
    id: 'DEAL_CLOSED',
    num: 4,
    label: 'Closed',
    name: 'Deal Closed & Terms',
    defaultOwner: 'Salesperson',
    workspaceUrl: '/deal-closed',
  },
  {
    index: 5,
    id: 'GOVT_DOCS_SUBMITTED',
    num: 5,
    label: 'Portal',
    name: 'Surya Gujarat Portal Submission',
    defaultOwner: 'Rahul Bhai (Liaison)',
    workspaceUrl: '/portal',
  },
  {
    index: 6,
    id: 'SR_NUMBER_ISSUED',
    num: 6,
    label: 'SR No.',
    name: 'DISCOM SR Number Issuance',
    defaultOwner: 'Rahul Bhai (Liaison)',
    workspaceUrl: '/portal',
  },
  {
    index: 7,
    id: 'MATERIAL_PLANNED',
    num: 7,
    label: 'Material',
    name: 'Material Planning & Staging',
    defaultOwner: 'Sohail Khan (Material)',
    workspaceUrl: '/material',
  },
  {
    index: 8,
    id: 'MATERIAL_UNLOADED',
    num: 8,
    label: 'Unload',
    name: 'Terrace Material Delivery & Unload',
    defaultOwner: 'Sohail Khan (Material)',
    workspaceUrl: '/material',
  },
  {
    index: 9,
    id: 'INSTALLATION_DONE',
    num: 9,
    label: 'Install',
    name: 'Rooftop Structure & Wiring',
    defaultOwner: 'Irfan (Lead)',
    workspaceUrl: '/installation',
  },
  {
    index: 10,
    id: 'METER_STARTED',
    num: 10,
    label: 'Meter',
    name: 'Net-Meter & Commissioning',
    defaultOwner: 'Rahul Bhai & Meera',
    workspaceUrl: '/portal',
  },
];

export default function ProjectDetailPage() {
  const router = useRouter();
  const params = useParams();
  const rawId = (params?.id as string) || 'F-1';
  const { user, theme } = useCurrentUser();

  const [inquiry, setInquiry] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isFollowupOpen, setIsFollowupOpen] = useState(false);
  const [showChangeStageModal, setShowChangeStageModal] = useState(false);
  const [selectedStageIndex, setSelectedStageIndex] = useState<number | null>(null);

  // Fetch real inquiry and followups
  const loadInquiry = useCallback(async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      router.push('/');
      return;
    }

    try {
      const res = await fetch(`/api/v1/inquiries/${rawId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const json = await res.json();
        const data = json?.data || json;
        if (data) {
          setInquiry(data);
          const activeNum = STAGE_ORDER_MAP[data.currentStage] || 1;
          setSelectedStageIndex((prev) => (prev === null ? activeNum : prev));
        }
      }
    } catch (err) {
      console.error('Failed to load project details:', err);
    } finally {
      setLoading(false);
    }
  }, [rawId, router]);

  useEffect(() => {
    loadInquiry();
  }, [loadInquiry]);

  // Current real stage index from database
  const currentStageNum = STAGE_ORDER_MAP[inquiry?.currentStage] || 1;
  const activeSelectedStageIndex = selectedStageIndex ?? currentStageNum;

  // Normalized IDs
  const cleanNum = rawId.replace('TYP-2026-', '').replace('F-', '');
  const isDealClosed = currentStageNum >= 4 || Boolean(inquiry?.dealAmount);
  // User Requirement: if inquiry is closed, display project id (TYP-2026-X); if still lead, display follow-up ID (F-1)
  const displayId = isDealClosed ? `TYP-2026-${cleanNum}` : (inquiry?.followupId || rawId);
  const isProjectTag = isDealClosed;

  const customerName = inquiry?.customerName || 'Test User';
  const customerPhone = inquiry?.customerPhone || '9825012345';
  const requestedKw = inquiry?.requestedKw || 6;
  const meterPhase = inquiry?.meterPhase || 'Single Phase';
  const address = inquiry?.address || '';
  const city = inquiry?.city || 'Vadodara';
  const salespersonName =
    inquiry?.assignedSalesperson?.fullName?.replace(/\s*\(Salesperson\)/i, '') || 'Amit';

  const realFollowups = Array.isArray(inquiry?.followups) ? inquiry.followups : [];

  // Helper date formatter
  const formatDate = (dateInput?: string | Date) => {
    if (!dateInput) return 'Today';
    const d = new Date(dateInput);
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  };

  const formatDateTime = (dateInput?: string | Date) => {
    if (!dateInput) return 'Today · Just now';
    const d = new Date(dateInput);
    return `${d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} · ${d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })}`;
  };

  // Build the 10 stages with real dynamic states
  const stages = STAGE_CONFIGS.map((cfg) => {
    const isDone = cfg.num < currentStageNum;
    const isInProgress = cfg.num === currentStageNum;
    const isPending = cfg.num > currentStageNum;

    // Follow-ups matching this stage
    const stageFollowups = realFollowups.filter((f: any) => f.stage === cfg.id);
    const followupsCount = stageFollowups.length;

    // Resolve owner
    const owner =
      cfg.num <= 4
        ? `${salespersonName} (Salesperson)`
        : cfg.defaultOwner;

    // Resolve started and committed dates from real data
    const started = isPending
      ? 'Upcoming'
      : formatDate(inquiry?.assignedAt || inquiry?.createdAt);

    const latestFollowup = stageFollowups[0];
    const committed = latestFollowup?.committedDate
      ? formatDate(latestFollowup.committedDate)
      : isDone
      ? 'Completed'
      : formatDate(new Date(Date.now() + 3 * 24 * 60 * 60 * 1000));

    // Construct REAL "whatWasDone" actions
    const whatWasDone: Array<{ title: string; dateMeta: string; status: 'Done' | 'Pending' }> = [];

    // Append recorded follow-ups as real actions first
    stageFollowups.forEach((f: any) => {
      whatWasDone.push({
        title: f.description || `Follow-up in ${cfg.name}`,
        dateMeta: `${formatDateTime(f.createdAt)} · ${f.createdBy?.fullName || 'Staff'}`,
        status: f.status === 'CALL_DONE' || f.status === 'DONE' ? 'Done' : 'Done',
      });
    });

    // Milestone-specific checks based on actual database relations
    if (cfg.index === 1) {
      // Stage 1: Inquiry
      whatWasDone.unshift({
        title: `Inquiry recorded for ${requestedKw} kW (${meterPhase})`,
        dateMeta: `${formatDate(inquiry?.createdAt)} · ${city}`,
        status: 'Done',
      });
      if (inquiry?.assignedSalesperson) {
        whatWasDone.push({
          title: `Salesperson assigned: ${salespersonName}`,
          dateMeta: `${formatDate(inquiry.assignedAt || inquiry.createdAt)} · Dispatched`,
          status: 'Done',
        });
      }
    } else if (cfg.index === 2) {
      // Stage 2: Site visit
      if (inquiry?.siteVisit) {
        whatWasDone.unshift({
          title: `Rooftop survey completed (${inquiry.siteVisit.shadowFreeAreaSqFt || 'Area'} sq ft)`,
          dateMeta: `${formatDate(inquiry.siteVisit.createdAt)} · Survey report uploaded`,
          status: 'Done',
        });
      } else {
        whatWasDone.push({
          title: 'Schedule & log terrace inspection',
          dateMeta: isDone ? 'Completed' : isInProgress ? 'In progress' : 'Scheduled',
          status: isDone ? 'Done' : 'Pending',
        });
      }
    } else if (cfg.index === 3) {
      // Stage 3: Quotation
      if (inquiry?.quotation) {
        whatWasDone.unshift({
          title: `${requestedKw} kW BOM quote prepared`,
          dateMeta: `${formatDate(inquiry.quotation.createdAt)} · ₹${(inquiry.quotation.totalProjectCost || 300000).toLocaleString('en-IN')}`,
          status: 'Done',
        });
        whatWasDone.push({
          title: 'PM Surya Ghar subsidy calculation',
          dateMeta: `Subsidy applied: ₹${(inquiry.quotation.subsidyAmount || 78000).toLocaleString('en-IN')}`,
          status: 'Done',
        });
      } else {
        whatWasDone.push({
          title: 'Quotation preparation & pricing',
          dateMeta: isDone ? 'Completed' : isInProgress ? 'Drafting quote' : 'Pending survey',
          status: isDone ? 'Done' : 'Pending',
        });
      }
    } else if (cfg.index === 4) {
      // Stage 4: Deal closed
      if (inquiry?.dealAmount) {
        whatWasDone.unshift({
          title: 'Customer agreement signed',
          dateMeta: `Agreed deal amount: ₹${Number(inquiry.dealAmount).toLocaleString('en-IN')}`,
          status: 'Done',
        });
      } else {
        whatWasDone.push({
          title: 'Agreement sign-off & token collection',
          dateMeta: isDone ? 'Completed' : isInProgress ? 'Awaiting sign-off' : 'Pending quote',
          status: isDone ? 'Done' : 'Pending',
        });
      }
    } else if (cfg.index === 5) {
      // Stage 5: Portal
      whatWasDone.push({
        title: 'National & Surya Gujarat portal filing',
        dateMeta: isDone ? 'Uploaded & verified' : isInProgress ? 'Uploading files' : 'Awaiting KYC',
        status: isDone ? 'Done' : 'Pending',
      });
    } else if (cfg.index === 6) {
      // Stage 6: SR No.
      whatWasDone.push({
        title: 'DISCOM SR number generation',
        dateMeta: isDone ? 'SR issued by DISCOM' : isInProgress ? 'DISCOM queue verification' : 'Pending portal',
        status: isDone ? 'Done' : 'Pending',
      });
    } else if (cfg.index === 7) {
      // Stage 7: Material
      whatWasDone.push({
        title: 'BOM material staging in warehouse',
        dateMeta: isDone ? 'Staged & verified' : isInProgress ? 'Staging in warehouse' : 'Awaiting SR number',
        status: isDone ? 'Done' : 'Pending',
      });
    } else if (cfg.index === 8) {
      // Stage 8: Unload
      whatWasDone.push({
        title: 'Terrace unloading & photo proof',
        dateMeta: isDone ? 'Delivered & verified' : isInProgress ? 'Truck dispatched' : 'Pending staging',
        status: isDone ? 'Done' : 'Pending',
      });
    } else if (cfg.index === 9) {
      // Stage 9: Installation
      whatWasDone.push({
        title: 'HDG structure fabrication & module wiring',
        dateMeta: isDone ? 'Installation signed off' : isInProgress ? 'Work in progress' : 'Pending delivery',
        status: isDone ? 'Done' : 'Pending',
      });
    } else if (cfg.index === 10) {
      // Stage 10: Meter
      whatWasDone.push({
        title: 'Bi-directional net-meter & subsidy release',
        dateMeta: isDone ? 'Commissioned' : isInProgress ? 'Meter testing scheduled' : 'Pending installation',
        status: isDone ? 'Done' : 'Pending',
      });
    }

    return {
      ...cfg,
      status: isDone ? ('done' as const) : isInProgress ? ('in_progress' as const) : ('pending' as const),
      owner,
      started,
      committed,
      followupsCount,
      whatWasDone,
      workspaceUrl:
        cfg.index === 1
          ? `/inquiries/${inquiry?.followupId || rawId}`
          : cfg.index === 2
          ? `/inquiries/${inquiry?.followupId || rawId}/site-visit`
          : cfg.index === 3
          ? `/quotations/new`
          : cfg.index === 4
          ? `/inquiries/${inquiry?.followupId || rawId}/deal-closed`
          : `${cfg.workspaceUrl}/projects/${inquiry?.followupId || rawId}`,
    };
  });

  const selectedStage =
    stages.find((s) => s.num === activeSelectedStageIndex) || stages[0];

  // Calculate real days elapsed in stage
  const computeDaysInStage = () => {
    const updatedTime = new Date(inquiry?.updatedAt || inquiry?.createdAt || Date.now()).getTime();
    const diffDays = Math.max(1, Math.floor((Date.now() - updatedTime) / (1000 * 60 * 60 * 24)));
    return diffDays;
  };

  // Change stage handler
  const handleUpdateStage = async (newStageId: string, stageNum: number) => {
    const token = localStorage.getItem('accessToken');
    if (!token) return;

    try {
      const res = await fetch(`/api/v1/inquiries/${inquiry?.followupId || inquiry?.id || rawId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ currentStage: newStageId }),
      });

      if (!res.ok) {
        throw new Error('Failed to update stage');
      }

      toast.success(`Project moved to Stage ${stageNum}: ${newStageId.replace(/_/g, ' ')}`);
      setShowChangeStageModal(false);
      setSelectedStageIndex(stageNum);
      loadInquiry();
    } catch (err: any) {
      toast.error(err.message || 'Error updating stage');
    }
  };

  if (loading && !inquiry) {
    return (
      <div className="min-h-screen bg-typhoon-sand flex items-center justify-center text-xs text-typhoon-muted">
        Loading real project details...
      </div>
    );
  }

  const headerBg = theme.hex.headerGradient || theme.hex.headerBg || '#0B1E36';
  const headerTextColor = theme.hex.headerTextColor || '#ffffff';
  const headerSubtextColor = theme.hex.headerSubtextColor || 'rgba(255, 255, 255, 0.7)';
  const isLightHeader = headerTextColor !== '#ffffff';

  return (
    <div className="min-h-screen bg-[#FBF8F3] pb-28 font-sans">
      {/* 1. Header with Role Theme Colors, Real Logo Capsule, and Parabolic Curve */}
      <div
        style={{
          background: headerBg,
          color: headerTextColor,
        }}
        className="pt-5 pb-9 px-5 rounded-b-[34px] shadow-soft border-b border-black/5 relative overflow-hidden transition-colors duration-300"
      >
        {/* Subtle background decorative concentric curves */}
        <div className={`absolute -top-12 -right-12 w-48 h-48 rounded-full border pointer-events-none ${isLightHeader ? 'border-black/5' : 'border-white/5'}`} />
        <div className={`absolute -top-6 -right-6 w-36 h-36 rounded-full border pointer-events-none ${isLightHeader ? 'border-black/10' : 'border-white/10'}`} />

        <div className="max-w-md mx-auto relative z-10">
          {/* Top Bar: Back Button & Real Logo Capsule */}
          <div className="flex items-center justify-between mb-3.5">
            <button
              onClick={() => router.back()}
              style={{
                backgroundColor: isLightHeader ? 'rgba(0, 0, 0, 0.07)' : 'rgba(255, 255, 255, 0.1)',
                color: headerTextColor,
              }}
              className="w-9 h-9 rounded-full flex items-center justify-center transition active:scale-95 cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Real Logo in White Pill */}
            <div className="bg-white px-3 py-1 rounded-full shadow-soft flex items-center justify-center shrink-0">
              <img
                src="/images/typhoon-logo.png"
                alt="Typhoon Solar System"
                className="h-6 w-auto object-contain"
              />
            </div>
          </div>

          {/* Project Tag & Assignment */}
          <div className="flex items-center gap-2 mb-1.5">
            <span
              className={`text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                isProjectTag ? 'bg-[#D97706]' : 'bg-[#0284C7]'
              }`}
            >
              {isProjectTag ? 'PROJECT' : 'LEAD / INQUIRY'}
            </span>
            <span style={{ color: headerSubtextColor }} className="text-xs font-normal">
              Assigned to {salespersonName} (Salesperson)
            </span>
          </div>

          {/* Title & Project Identification */}
          <h1 style={{ color: headerTextColor }} className="text-2xl sm:text-3xl font-serif font-bold tracking-tight">
            Project detail
          </h1>
          <p style={{ color: headerTextColor }} className="text-xs font-semibold mt-1">
            {displayId} · {customerName}
          </p>
          <p style={{ color: headerSubtextColor }} className="text-xs font-normal mt-0.5">
            {requestedKw} kW {meterPhase} · {address ? `${address}, ` : ''}{city}
          </p>
        </div>
      </div>

      {/* 2. Main Content Body */}
      <div className="max-w-md mx-auto px-4 -mt-4 space-y-4 relative z-10">
        {/* Card 1: All Stages */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-200/80 shadow-soft space-y-3.5">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-lg font-bold text-[#0B1E36]">All stages</h3>
            <span className="text-[11px] text-gray-500 font-normal">
              Tap a stage · number = follow-ups
            </span>
          </div>

          {/* 10-Stage Visual Grid (2 Rows of 5) */}
          <div className="grid grid-cols-5 gap-y-3.5 gap-x-1.5 items-start justify-items-center">
            {stages.map((stg) => {
              const isSelected = activeSelectedStageIndex === stg.index;
              const isDone = stg.status === 'done';
              const isInProgress = stg.status === 'in_progress';

              return (
                <button
                  key={stg.index}
                  type="button"
                  onClick={() => setSelectedStageIndex(stg.index)}
                  className={`flex flex-col items-center group cursor-pointer transition p-1 rounded-2xl ${
                    isSelected
                      ? 'border-2 border-[#0B1E36] bg-amber-50/60 shadow-xs'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="relative">
                    {/* Circle Stage Icon */}
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center font-serif text-sm transition ${
                        isDone
                          ? 'bg-[#E08A1E] text-white shadow-xs'
                          : isInProgress
                          ? 'bg-[#0B1E36] text-white font-bold'
                          : 'bg-gray-100 text-gray-500 border border-gray-200'
                      }`}
                    >
                      {isDone ? (
                        <Check className="w-4 h-4 stroke-[2.5]" />
                      ) : (
                        <span>{stg.num}</span>
                      )}
                    </div>

                    {/* Follow-up count badge if > 0 */}
                    {stg.followupsCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-[#0B1E36] text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-mono font-bold border border-white">
                        {stg.followupsCount}
                      </span>
                    )}
                  </div>

                  <span
                    className={`text-[10px] mt-1.5 text-center leading-tight truncate max-w-[54px] ${
                      isSelected
                        ? 'font-bold text-[#0B1E36]'
                        : 'text-gray-500 font-normal'
                    }`}
                  >
                    {stg.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Card 2: SELECTED STAGE */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-200/80 shadow-soft space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-wider text-gray-500 font-semibold">
              SELECTED STAGE
            </span>
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                selectedStage.status === 'done'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : selectedStage.status === 'in_progress'
                  ? 'bg-amber-100 text-amber-900 border border-amber-200'
                  : 'bg-gray-100 text-gray-600 border border-gray-200'
              }`}
            >
              {selectedStage.status === 'done'
                ? 'Completed'
                : selectedStage.status === 'in_progress'
                ? 'In progress'
                : 'Upcoming'}
            </span>
          </div>

          <div className="flex items-center justify-between gap-2">
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#0B1E36]">
              {selectedStage.num} · {selectedStage.name}
            </h2>

            {selectedStage.workspaceUrl && (
              <button
                type="button"
                onClick={() => router.push(selectedStage.workspaceUrl!)}
                className="text-xs text-[#E08A1E] font-bold hover:underline flex items-center gap-1 cursor-pointer shrink-0"
              >
                <span>Open screen</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Meta row: Owner, Started, Committed */}
          <div className="grid grid-cols-3 gap-2 text-xs border-y border-gray-100 py-3">
            <div>
              <span className="text-[10px] text-gray-500 block font-normal">Owner</span>
              <span className="font-bold text-[#0B1E36] block truncate mt-0.5">
                {selectedStage.owner}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-gray-500 block font-normal">Started</span>
              <span className="font-semibold text-gray-800 block mt-0.5">
                {selectedStage.started}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-gray-500 block font-normal">Committed</span>
              <span className="font-semibold text-gray-800 block mt-0.5">
                {selectedStage.committed}
              </span>
            </div>
          </div>

          {/* 3 Metric Tiles: Follow-ups done | Pending | Days in stage */}
          <div className="grid grid-cols-3 gap-2.5">
            <div className="bg-[#FAF7F2] rounded-2xl p-3 text-center border border-amber-100">
              <span className="text-2xl font-serif font-bold text-[#0B1E36] block leading-none">
                {selectedStage.followupsCount}
              </span>
              <span className="text-[10px] text-gray-500 font-medium mt-1 block">
                Follow-ups done
              </span>
            </div>

            <div className="bg-[#FAF7F2] rounded-2xl p-3 text-center border border-amber-100">
              <span className="text-2xl font-serif font-bold text-[#0B1E36] block leading-none">
                {selectedStage.status === 'in_progress' ? 1 : selectedStage.status === 'done' ? 0 : 1}
              </span>
              <span className="text-[10px] text-gray-500 font-medium mt-1 block">
                Pending
              </span>
            </div>

            <div className="bg-[#FAF7F2] rounded-2xl p-3 text-center border border-amber-100">
              <span className="text-2xl font-serif font-bold text-[#0B1E36] block leading-none">
                {computeDaysInStage()}
              </span>
              <span className="text-[10px] text-gray-500 font-medium mt-1 block">
                Days in stage
              </span>
            </div>
          </div>
        </div>

        {/* Card 3: What was done */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-200/80 shadow-soft space-y-3">
          <h3 className="font-serif text-lg font-bold text-[#0B1E36]">What was done</h3>

          <div className="divide-y divide-gray-100">
            {selectedStage.whatWasDone.map((item, idx) => (
              <div key={idx} className="py-2.5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                      item.status === 'Done'
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-gray-100 text-gray-400'
                    }`}
                  >
                    {item.status === 'Done' ? (
                      <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                    ) : (
                      <Clock className="w-3.5 h-3.5" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs font-semibold text-gray-900 block truncate">
                      {item.title}
                    </span>
                    <span className="text-[11px] text-gray-500 font-normal block truncate">
                      {item.dateMeta}
                    </span>
                  </div>
                </div>

                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${
                    item.status === 'Done'
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : 'bg-amber-50 text-amber-800 border border-amber-200'
                  }`}
                >
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Card 4: Follow-up history (Real Timeline) */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-200/80 shadow-soft space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-lg font-bold text-[#0B1E36]">Follow-up history</h3>
            <span className="text-xs text-gray-500 font-medium">
              {realFollowups.length} follow-ups
            </span>
          </div>

          {realFollowups.length === 0 ? (
            <div className="text-center py-6 px-4 border border-dashed border-gray-200 rounded-xl space-y-2">
              <Clock className="w-6 h-6 text-gray-400 mx-auto" />
              <p className="text-xs text-gray-500 font-medium">
                No follow-ups recorded yet for this project.
              </p>
              <button
                type="button"
                onClick={() => setIsFollowupOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-[#E08A1E] text-white"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Add First Follow-up</span>
              </button>
            </div>
          ) : (
            <div className="relative pl-5 space-y-4 border-l-2 border-amber-200 ml-1">
              {realFollowups.map((fu: any, idx: number) => {
                const isCallDone = fu.status === 'CALL_DONE' || fu.status === 'DONE';
                const isDelayed = fu.status === 'DELAYED' || fu.isOverdue;

                return (
                  <div key={fu.id || idx} className="relative group">
                    {/* Timeline Dot */}
                    <span className="absolute -left-[27px] top-1 w-3.5 h-3.5 rounded-full bg-[#E08A1E] ring-4 ring-white" />

                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs text-gray-500 font-normal">
                        {formatDateTime(fu.createdAt)}
                      </span>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                          isDelayed
                            ? 'bg-rose-50 text-rose-700 border-rose-200'
                            : isCallDone
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-amber-50 text-amber-800 border border-amber-200'
                        }`}
                      >
                        {isDelayed ? 'Overdue' : isCallDone ? 'Done' : 'On track'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs font-bold text-[#0B1E36]">
                        {fu.createdBy?.fullName || 'Ops Manager'}
                      </span>
                      {fu.stage && (
                        <span className="text-[10px] px-2 py-0.2 rounded-full bg-gray-100 text-gray-600 font-medium">
                          {fu.stage.replace(/_/g, ' ')}
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-gray-700 font-normal mt-0.5 leading-relaxed">
                      {fu.description || 'Follow-up commitment logged'}
                    </p>

                    {fu.committedDate && (
                      <span className="text-[10px] text-gray-400 mt-1 block">
                        Committed: {formatDate(fu.committedDate)}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Attached Files & Documents Quick Access */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-100">
            <button
              type="button"
              onClick={() => router.push(`/projects/${inquiry?.followupId || rawId}/documents`)}
              className="px-3 py-2 bg-[#FAF7F2] hover:bg-typhoon-sand rounded-xl border border-gray-200 text-xs text-[#0B1E36] font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5 text-gray-500" />
              <span>KYC Documents</span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (inquiry?.siteVisit) {
                  router.push(`/inquiries/${inquiry?.followupId || rawId}/site-visit`);
                } else {
                  toast.info('No site visit photos recorded yet.');
                }
              }}
              className="px-3 py-2 bg-[#FAF7F2] hover:bg-typhoon-sand rounded-xl border border-gray-200 text-xs text-[#0B1E36] font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              <Camera className="w-3.5 h-3.5 text-gray-500" />
              <span>Survey Photos</span>
            </button>
          </div>
        </div>

        {/* 5. Primary Action Buttons */}
        <div className="space-y-2 pt-1">
          <button
            type="button"
            onClick={() => setIsFollowupOpen(true)}
            className="w-full bg-[#E08A1E] hover:bg-[#C97715] text-white font-bold py-3.5 rounded-2xl text-xs sm:text-sm shadow-soft transition flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>+ Add follow-up</span>
          </button>

          <button
            type="button"
            onClick={() => setShowChangeStageModal(true)}
            className="w-full bg-white hover:bg-gray-50 text-[#0B1E36] border border-gray-200 font-bold py-3.5 rounded-2xl text-xs sm:text-sm shadow-soft transition flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
          >
            <Layers className="w-4 h-4 text-gray-500" />
            <span>Change stage</span>
          </button>
        </div>
      </div>

      {/* Follow-up Logging Modal */}
      <FollowUpModal
        isOpen={isFollowupOpen}
        onClose={() => setIsFollowupOpen(false)}
        inquiryId={inquiry?.followupId || rawId}
        onSuccess={() => {
          toast.success('Follow-up recorded successfully!');
          setIsFollowupOpen(false);
          loadInquiry();
        }}
      />

      {/* Change Stage Dialog Modal */}
      {showChangeStageModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-5 max-w-sm w-full shadow-2xl border border-gray-200 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-lg font-bold text-[#0B1E36]">Change project stage</h3>
              <button
                onClick={() => setShowChangeStageModal(false)}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:text-black cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-gray-500">
              Select the active operational milestone for {customerName}:
            </p>

            <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1">
              {stages.map((stg) => {
                const isCurrent = stg.num === currentStageNum;
                return (
                  <button
                    key={stg.index}
                    onClick={() => handleUpdateStage(stg.id, stg.num)}
                    className={`w-full text-left p-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition cursor-pointer ${
                      isCurrent
                        ? 'bg-[#0B1E36] text-white shadow-xs'
                        : 'hover:bg-gray-100 text-gray-800 border border-gray-200'
                    }`}
                  >
                    <span>
                      {stg.num}. {stg.name}
                    </span>
                    <span className="text-[10px] opacity-80">{stg.owner}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
