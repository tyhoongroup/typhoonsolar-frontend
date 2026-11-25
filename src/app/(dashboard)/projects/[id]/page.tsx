'use client';

import React, { useState, useEffect } from 'react';
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
} from 'lucide-react';
import { toast } from 'sonner';
import { useCurrentUser } from '@/lib/use-current-user';
import { FollowUpModal } from '@/components/FollowUpModal';
import { fetchWithAuth } from '@/lib/api';

interface StageMeta {
  index: number;
  id: string;
  num: number;
  label: string;
  name: string;
  owner: string;
  started: string;
  committed: string;
  followupsCount: number;
  status: 'done' | 'in_progress' | 'pending';
  whatWasDone: {
    title: string;
    dateMeta: string;
    status: 'Done' | 'Pending';
  }[];
  workspaceUrl?: string;
}

export default function ProjectDetailPage() {
  const router = useRouter();
  const params = useParams();
  const rawId = (params?.id as string) || 'F-1024';
  const { user, theme } = useCurrentUser();

  const [inquiry, setInquiry] = useState<any>(null);
  const [followups, setFollowups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFollowupOpen, setIsFollowupOpen] = useState(false);
  const [showChangeStageModal, setShowChangeStageModal] = useState(false);
  const [selectedStageIndex, setSelectedStageIndex] = useState(7); // Default to Stage 7 (Material planning) as in image

  // Normalize project ID format: TYP-2026-XXXX
  const cleanNum = rawId.replace('TYP-2026-', '').replace('F-', '');
  const projectId = rawId.startsWith('TYP-') ? rawId : `TYP-2026-${cleanNum}`;

  // 10 Pipeline Stages definition matching shared image
  const stages: StageMeta[] = [
    {
      index: 1,
      id: 'INQUIRY_RECEIVED',
      num: 1,
      label: 'Inquiry',
      name: 'Initial Solar Inquiry',
      owner: inquiry?.assignedSalesperson?.fullName || 'Amit Patel',
      started: '10 Nov',
      committed: '12 Nov',
      followupsCount: 0,
      status: 'done',
      whatWasDone: [
        { title: 'Inquiry registered on portal', dateMeta: '10 Nov · Amit Patel', status: 'Done' },
        { title: 'Customer requirements captured (6 kW)', dateMeta: '11 Nov · Call Done', status: 'Done' },
      ],
      workspaceUrl: `/inquiries/${rawId}`,
    },
    {
      index: 2,
      id: 'SITE_VISIT_PLANNED',
      num: 2,
      label: 'Visit',
      name: 'Site Survey & Rooftop Visit',
      owner: inquiry?.assignedSalesperson?.fullName || 'Amit Patel',
      started: '12 Nov',
      committed: '14 Nov',
      followupsCount: 1,
      status: 'done',
      whatWasDone: [
        { title: 'Rooftop dimension survey', dateMeta: '13 Nov · Amit Patel', status: 'Done' },
        { title: 'RCC terrace shadow analysis', dateMeta: '13 Nov · 4 photos', status: 'Done' },
      ],
      workspaceUrl: `/inquiries/${rawId}/site-visit`,
    },
    {
      index: 3,
      id: 'QUOTATION_SENT',
      num: 3,
      label: 'Quote',
      name: 'Quotation & Pricing Proposal',
      owner: inquiry?.assignedSalesperson?.fullName || 'Amit Patel',
      started: '14 Nov',
      committed: '16 Nov',
      followupsCount: 2,
      status: 'done',
      whatWasDone: [
        { title: '6.0 kW Single Phase BOM quote created', dateMeta: '14 Nov · Amit Patel', status: 'Done' },
        { title: 'PM Surya Ghar ₹78,000 subsidy applied', dateMeta: '15 Nov · WhatsApp PDF', status: 'Done' },
      ],
      workspaceUrl: `/quotations/new`,
    },
    {
      index: 4,
      id: 'DEAL_CLOSED',
      num: 4,
      label: 'Closed',
      name: 'Deal Closed & Booking Token',
      owner: inquiry?.assignedSalesperson?.fullName || 'Amit Patel',
      started: '16 Nov',
      committed: '18 Nov',
      followupsCount: 1,
      status: 'done',
      whatWasDone: [
        { title: 'Customer signed agreement', dateMeta: '16 Nov · ₹20,000 token', status: 'Done' },
        { title: 'KYC light bill & Aadhaar collected', dateMeta: '17 Nov · 4/4 docs', status: 'Done' },
      ],
      workspaceUrl: `/inquiries/${rawId}`,
    },
    {
      index: 5,
      id: 'GOVT_DOCS_SUBMITTED',
      num: 5,
      label: 'Portal',
      name: 'Surya Gujarat Portal Submission',
      owner: 'Rahul Bhai (Liaison)',
      started: '18 Nov',
      committed: '20 Nov',
      followupsCount: 3,
      status: 'done',
      whatWasDone: [
        { title: 'Documents uploaded on National Portal', dateMeta: '18 Nov · Rahul Bhai', status: 'Done' },
        { title: 'DISCOM consumer number verified', dateMeta: '19 Nov · MGVCL', status: 'Done' },
      ],
      workspaceUrl: `/portal/projects/${rawId}`,
    },
    {
      index: 6,
      id: 'SR_NUMBER_ISSUED',
      num: 6,
      label: 'SR No.',
      name: 'DISCOM SR Number Issuance',
      owner: 'Rahul Bhai (Liaison)',
      started: '19 Nov',
      committed: '21 Nov',
      followupsCount: 1,
      status: 'done',
      whatWasDone: [
        { title: 'Technical feasibility approved', dateMeta: '20 Nov · MGVCL Sub-division', status: 'Done' },
        { title: 'SR Number generated: SR-GUJ-2026-98124', dateMeta: '20 Nov · Rahul Bhai', status: 'Done' },
      ],
      workspaceUrl: `/portal/projects/${rawId}`,
    },
    {
      index: 7,
      id: 'MATERIAL_PLANNED',
      num: 7,
      label: 'Material',
      name: 'Material planning',
      owner: 'Sohail Khan',
      started: '20 Nov',
      committed: '28 Nov',
      followupsCount: 3,
      status: 'in_progress',
      whatWasDone: [
        { title: 'BOM staged', dateMeta: '22 Nov · Sohail Khan', status: 'Done' },
        { title: 'Delivery call with customer', dateMeta: '24 Nov · date confirmed', status: 'Done' },
        { title: 'Truck booked', dateMeta: '24 Nov', status: 'Done' },
        { title: 'Unloading proof', dateMeta: 'Waiting for unload', status: 'Pending' },
      ],
      workspaceUrl: `/material/projects/${rawId}`,
    },
    {
      index: 8,
      id: 'MATERIAL_UNLOADED',
      num: 8,
      label: 'Unload',
      name: 'Terrace Material Unload',
      owner: 'Sohail Khan',
      started: '28 Nov',
      committed: '29 Nov',
      followupsCount: 0,
      status: 'pending',
      whatWasDone: [
        { title: 'Site delivery & challan signed', dateMeta: 'Scheduled for 28 Nov', status: 'Pending' },
        { title: '4 rooftop unload photo proofs', dateMeta: 'Awaiting unload', status: 'Pending' },
      ],
      workspaceUrl: `/material/projects/${rawId}`,
    },
    {
      index: 9,
      id: 'INSTALLATION_DONE',
      num: 9,
      label: 'Install',
      name: 'Rooftop Structure & Wiring',
      owner: 'Irfan (Lead)',
      started: '29 Nov',
      committed: '02 Dec',
      followupsCount: 0,
      status: 'pending',
      whatWasDone: [
        { title: 'HDG structure elevated fabrication', dateMeta: 'Scheduled', status: 'Pending' },
        { title: 'Panel clamping & inverter wiring', dateMeta: 'Scheduled', status: 'Pending' },
        { title: 'Earthing & SPD electrical sign-off', dateMeta: 'Scheduled', status: 'Pending' },
      ],
      workspaceUrl: `/installation/projects/${rawId}`,
    },
    {
      index: 10,
      id: 'METER_STARTED',
      num: 10,
      label: 'Meter',
      name: 'Net-meter & Commissioning',
      owner: 'Rahul Bhai & Meera',
      started: '02 Dec',
      committed: '08 Dec',
      followupsCount: 0,
      status: 'pending',
      whatWasDone: [
        { title: 'CEI electrical inspector file submission', dateMeta: 'Pending', status: 'Pending' },
        { title: 'Bi-directional net meter installed', dateMeta: 'Pending', status: 'Pending' },
        { title: 'Solar generation live & subsidy DBT credited', dateMeta: 'Pending', status: 'Pending' },
      ],
      workspaceUrl: `/portal/projects/${rawId}`,
    },
  ];

  // Load Inquiry data & followups
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      router.push('/');
      return;
    }

    fetch(`/api/v1/inquiries/${rawId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        const item = data?.data || data;
        if (item) {
          setInquiry(item);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));

    fetch(`/api/v1/followups/inquiry/${rawId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        const list = Array.isArray(data) ? data : (data?.data || []);
        if (Array.isArray(list) && list.length > 0) {
          setFollowups(
            list.map((f: any, idx: number) => ({
              id: f.id || `fu-${idx}`,
              timestamp: new Date(f.createdAt || Date.now()).toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'short',
                hour: '2-digit',
                minute: '2-digit',
              }),
              statusPill: f.status === 'CALL_DONE' || f.status === 'DONE' ? 'Done' : 'On track',
              statusColor:
                f.status === 'CALL_DONE' || f.status === 'DONE'
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-amber-50 text-amber-700 border-amber-200',
              author: f.createdBy?.fullName || 'Ops manager',
              notes: f.description || 'Follow-up commitment logged',
            }))
          );
        } else {
          // Default initial follow-ups matching project initiation
          setFollowups([
            {
              id: 'fu-1',
              timestamp: 'Today · 11:30 AM',
              statusPill: 'On track',
              statusColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
              author: 'Ops manager — Sohail Khan',
              notes: 'Asked for delivery status. BOM is staged and truck is booked.',
            },
            {
              id: 'fu-2',
              timestamp: 'Yesterday · 4:10 PM',
              statusPill: 'Done',
              statusColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
              author: 'Sohail Khan',
              notes: 'BOM approved and items packed in the warehouse.',
            },
          ]);
        }
      })
      .catch(() => {});
  }, [rawId, router]);

  const selectedStage = stages.find((s) => s.index === selectedStageIndex) || stages[6];

  const customerName = inquiry?.customerName || 'Ramesh Patel';
  const customerPhone = inquiry?.customerPhone || '98250 12345';
  const requestedKw = inquiry?.requestedKw || '6.0';
  const meterPhase = inquiry?.meterPhase || 'single phase';
  const city = inquiry?.city || 'Vadodara';
  const address = inquiry?.address || 'Dena';
  const salespersonName = inquiry?.assignedSalesperson?.fullName || 'Amit';

  return (
    <div className="min-h-screen bg-typhoon-sand pb-28 font-sans">
      {/* 1. Header with Dark Theme, Real Logo Capsule, and Parabolic Curve */}
      <div
        style={{
          background: theme.hex.cardDarkGradient || theme.hex.cardDarkBg || '#101B2B',
        }}
        className="text-white pt-5 pb-9 px-5 rounded-b-[34px] shadow-soft border-b border-white/10 relative overflow-hidden"
      >
        <div className="max-w-md mx-auto">
          {/* Top Bar: Back Button & Real Logo Capsule */}
          <div className="flex items-center justify-between mb-3.5">
            <button
              onClick={() => router.back()}
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition active:scale-95 cursor-pointer"
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
            <span className="bg-[#D97706] text-white text-[10px] font-medium px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              PROJECT
            </span>
            <span className="text-xs text-white/80 font-normal">
              Assigned to {salespersonName}
            </span>
          </div>

          {/* Title & Project Identification */}
          <h1 className="text-2xl sm:text-3xl font-serif font-normal text-white tracking-tight">
            Project detail
          </h1>
          <p className="text-xs text-white/90 font-medium mt-1">
            {projectId} · {customerName}
          </p>
          <p className="text-xs text-white/70 font-normal mt-0.5">
            {requestedKw} kW {meterPhase} · {address ? `${address}, ` : ''}{city}
          </p>
        </div>
      </div>

      {/* 2. Main Content Body */}
      <div className="max-w-md mx-auto px-4 -mt-4 space-y-4 relative z-10">
        {/* Card 1: All Stages */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-typhoon-border shadow-soft space-y-3.5">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-lg font-normal text-typhoon-navy">All stages</h3>
            <span className="text-[11px] text-typhoon-muted font-normal">
              Tap a stage · number = follow-ups
            </span>
          </div>

          {/* 10-Stage Visual Grid (2 Rows of 5) */}
          <div className="grid grid-cols-5 gap-y-3.5 gap-x-1.5 items-start justify-items-center">
            {stages.map((stg) => {
              const isSelected = selectedStageIndex === stg.index;
              const isDone = stg.status === 'done';
              const isInProgress = stg.status === 'in_progress';

              return (
                <button
                  key={stg.index}
                  type="button"
                  onClick={() => setSelectedStageIndex(stg.index)}
                  className={`flex flex-col items-center group cursor-pointer transition p-1 rounded-2xl ${
                    isSelected
                      ? 'border-2 border-slate-900 bg-amber-50/50 shadow-sm'
                      : 'hover:bg-typhoon-sand/40'
                  }`}
                >
                  <div className="relative">
                    {/* Circle Stage Icon */}
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center font-serif text-sm transition ${
                        isDone
                          ? 'bg-[#E08A1E] text-white shadow-soft'
                          : isInProgress
                          ? 'bg-slate-900 text-white font-medium'
                          : 'bg-slate-100 text-slate-500 border border-slate-200'
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
                      <span className="absolute -top-1 -right-1 bg-slate-900 text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-mono font-medium border border-white">
                        {stg.followupsCount}
                      </span>
                    )}
                  </div>

                  <span
                    className={`text-[10px] mt-1.5 text-center leading-tight truncate max-w-[54px] ${
                      isSelected
                        ? 'font-medium text-typhoon-navy'
                        : 'text-typhoon-muted font-normal'
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
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-typhoon-border shadow-soft space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-wider text-typhoon-muted font-medium">
              SELECTED STAGE
            </span>
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                selectedStage.status === 'done'
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : selectedStage.status === 'in_progress'
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-slate-100 text-slate-600'
              }`}
            >
              {selectedStage.status === 'done'
                ? 'Completed'
                : selectedStage.status === 'in_progress'
                ? 'In progress'
                : 'Upcoming'}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-serif font-normal text-typhoon-navy">
              {selectedStage.num} · {selectedStage.name}
            </h2>

            {selectedStage.workspaceUrl && (
              <button
                type="button"
                onClick={() => router.push(selectedStage.workspaceUrl!)}
                className="text-xs text-typhoon-gold font-medium hover:underline flex items-center gap-1 cursor-pointer shrink-0"
              >
                <span>Open screen</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Meta row: Owner, Started, Committed */}
          <div className="grid grid-cols-3 gap-2 text-xs border-y border-typhoon-border/60 py-3">
            <div>
              <span className="text-[10px] text-typhoon-muted block font-normal">Owner</span>
              <span className="font-medium text-typhoon-navy block truncate mt-0.5">
                {selectedStage.owner}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-typhoon-muted block font-normal">Started</span>
              <span className="font-medium text-typhoon-navy block mt-0.5">
                {selectedStage.started}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-typhoon-muted block font-normal">Committed</span>
              <span className="font-medium text-typhoon-navy block mt-0.5">
                {selectedStage.committed}
              </span>
            </div>
          </div>

          {/* 3 Metric Tiles: Follow-ups done | Pending | Days in stage */}
          <div className="grid grid-cols-3 gap-2.5">
            <div className="bg-[#FAF7F2] rounded-2xl p-3 text-center border border-typhoon-border/60">
              <span className="text-2xl font-serif font-normal text-typhoon-navy block leading-none">
                {selectedStage.followupsCount || 3}
              </span>
              <span className="text-[10px] text-typhoon-muted font-normal mt-1 block">
                Follow-ups done
              </span>
            </div>

            <div className="bg-[#FAF7F2] rounded-2xl p-3 text-center border border-typhoon-border/60">
              <span className="text-2xl font-serif font-normal text-typhoon-navy block leading-none">
                1
              </span>
              <span className="text-[10px] text-typhoon-muted font-normal mt-1 block">
                Pending
              </span>
            </div>

            <div className="bg-[#FAF7F2] rounded-2xl p-3 text-center border border-typhoon-border/60">
              <span className="text-2xl font-serif font-normal text-typhoon-navy block leading-none">
                4
              </span>
              <span className="text-[10px] text-typhoon-muted font-normal mt-1 block">
                Days in stage
              </span>
            </div>
          </div>
        </div>

        {/* Card 3: What was done */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-typhoon-border shadow-soft space-y-3">
          <h3 className="font-serif text-lg font-normal text-typhoon-navy">What was done</h3>

          <div className="divide-y divide-typhoon-border/60">
            {selectedStage.whatWasDone.map((item, idx) => (
              <div key={idx} className="py-2.5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                      item.status === 'Done'
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {item.status === 'Done' ? (
                      <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                    ) : (
                      <Clock className="w-3.5 h-3.5" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs font-medium text-typhoon-navy block truncate">
                      {item.title}
                    </span>
                    <span className="text-[11px] text-typhoon-muted font-normal block truncate">
                      {item.dateMeta}
                    </span>
                  </div>
                </div>

                <span
                  className={`text-[10px] font-medium px-2 py-0.5 rounded-full shrink-0 ${
                    item.status === 'Done'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-amber-50 text-amber-800 border border-amber-200'
                  }`}
                >
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Card 4: Follow-up history */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-typhoon-border shadow-soft space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-lg font-normal text-typhoon-navy">Follow-up history</h3>
            <span className="text-xs text-typhoon-muted font-normal">
              {followups.length} follow-ups
            </span>
          </div>

          {/* Timeline List */}
          <div className="relative pl-5 space-y-4 border-l-2 border-amber-200 ml-1">
            {followups.map((fu, idx) => (
              <div key={fu.id || idx} className="relative group">
                {/* Timeline Dot */}
                <span className="absolute -left-[27px] top-1 w-3.5 h-3.5 rounded-full bg-[#E08A1E] ring-4 ring-white" />

                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs text-typhoon-muted font-normal">
                    {fu.timestamp || (fu.createdAt ? new Date(fu.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }) : '24 Nov · 4:10 PM')}
                  </span>
                  <span
                    className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${
                      fu.statusPill === 'Delayed'
                        ? 'bg-rose-50 text-rose-700 border-rose-200'
                        : fu.statusPill === 'Done'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    }`}
                  >
                    {fu.statusPill || (fu.status === 'DONE' ? 'Done' : fu.status === 'DELAYED' ? 'Delayed' : 'On track')}
                  </span>
                </div>

                <span className="text-xs font-medium text-typhoon-navy block mt-1">
                  {fu.author || (fu.createdBy?.fullName ? `Ops manager — ${fu.createdBy.fullName}` : 'Ops manager — Sohail Khan')}
                </span>

                <p className="text-xs text-typhoon-muted font-normal mt-0.5 leading-relaxed">
                  {fu.notes || fu.description || 'Asked for delivery status. BOM is staged and the truck is booked.'}
                </p>
              </div>
            ))}
          </div>

          {/* Attached Files Pills */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-typhoon-border/60">
            <button
              type="button"
              onClick={() => toast.success('BOM slip PDF opened!')}
              className="px-3 py-2 bg-[#FAF7F2] hover:bg-typhoon-sand rounded-xl border border-typhoon-border text-xs text-typhoon-navy font-medium flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5 text-typhoon-muted" />
              <span>BOM slip.pdf</span>
            </button>

            <button
              type="button"
              onClick={() => toast.success('Truck photo viewed!')}
              className="px-3 py-2 bg-[#FAF7F2] hover:bg-typhoon-sand rounded-xl border border-typhoon-border text-xs text-typhoon-navy font-medium flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              <Camera className="w-3.5 h-3.5 text-typhoon-muted" />
              <span>Truck photo</span>
            </button>
          </div>
        </div>

        {/* 5. Primary Action Buttons */}
        <div className="space-y-2 pt-1">
          <button
            type="button"
            onClick={() => setIsFollowupOpen(true)}
            className="w-full bg-[#E08A1E] hover:bg-[#C97715] text-white font-medium py-3 rounded-2xl text-xs sm:text-sm shadow-soft transition flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add follow-up</span>
          </button>

          <button
            type="button"
            onClick={() => setShowChangeStageModal(true)}
            className="w-full bg-white hover:bg-typhoon-sand/40 text-typhoon-navy border border-typhoon-border font-medium py-3 rounded-2xl text-xs sm:text-sm shadow-soft transition flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
          >
            <Layers className="w-4 h-4 text-typhoon-muted" />
            <span>Change stage</span>
          </button>
        </div>
      </div>

      {/* Follow-up Logging Modal */}
      <FollowUpModal
        isOpen={isFollowupOpen}
        onClose={() => setIsFollowupOpen(false)}
        inquiryId={inquiry?.id || rawId}
        onSuccess={() => {
          toast.success('Follow-up recorded successfully!');
          setIsFollowupOpen(false);
        }}
      />

      {/* Change Stage Dialog Modal */}
      {showChangeStageModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-5 max-w-sm w-full shadow-2xl border border-typhoon-border space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-lg font-normal text-typhoon-navy">Change project stage</h3>
              <button
                onClick={() => setShowChangeStageModal(false)}
                className="w-8 h-8 rounded-full bg-typhoon-sand flex items-center justify-center text-typhoon-muted hover:text-typhoon-navy"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-typhoon-muted">
              Select the active operational milestone for {customerName}:
            </p>

            <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1">
              {stages.map((stg) => (
                <button
                  key={stg.index}
                  onClick={() => {
                    setSelectedStageIndex(stg.index);
                    setShowChangeStageModal(false);
                    toast.success(`Project moved to Stage ${stg.num}: ${stg.name}`);
                  }}
                  className={`w-full text-left p-2.5 rounded-xl text-xs font-medium flex items-center justify-between transition ${
                    selectedStageIndex === stg.index
                      ? 'bg-typhoon-navy text-white'
                      : 'hover:bg-typhoon-sand/60 text-typhoon-navy border border-typhoon-border/60'
                  }`}
                >
                  <span>
                    {stg.num}. {stg.name}
                  </span>
                  <span className="text-[10px] opacity-70">{stg.owner}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
