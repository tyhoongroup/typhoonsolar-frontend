'use client';

import React, { useState } from 'react';
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
} from 'lucide-react';
import { toast } from 'sonner';

interface FollowupRecord {
  id: string;
  loggedBy: string;
  role: string;
  timestamp: string;
  type: 'Phone Call' | 'Terrace Visit' | 'WhatsApp' | 'Office Meeting';
  customerReaction: 'Very Positive' | 'Negotiating' | 'Needs Subsidy Info' | 'Hesitant';
  reactionBadgeColor: string;
  description: string; // Follow-up description clearly visible to Operations Manager
  nextStep: string;
  committedDate: string;
  isCompleted: boolean;
}

export default function InquiryDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [isLogCallOpen, setIsLogCallOpen] = useState(false);
  const [isVisitModalOpen, setIsVisitModalOpen] = useState(false);
  const [isDealClosedOpen, setIsDealClosedOpen] = useState(false);
  const [roofArea, setRoofArea] = useState('450');
  const [roofType, setRoofType] = useState('RCC Terrace');
  const [dealAmount, setDealAmount] = useState('275000');
  const [currentStageText, setCurrentStageText] = useState('STAGE 2 OF 10');
  const projectId = `TYP-2026-${params.id.replace('F-', '')}`;

  const [callType, setCallType] = useState<'Phone Call' | 'Terrace Visit' | 'WhatsApp'>('Phone Call');
  const [customerReaction, setCustomerReaction] = useState<'Very Positive' | 'Negotiating' | 'Needs Subsidy Info' | 'Hesitant'>('Very Positive');
  const [description, setDescription] = useState('');
  const [nextStep, setNextStep] = useState('Terrace site visit & shadow analysis');
  const [nextFollowupDate, setNextFollowupDate] = useState('2026-11-11');
  const [loading, setLoading] = useState(false);

  const handleSendDocsWhatsApp = () => {
    const text = encodeURIComponent(
      `Namaste Ramesh Patel ji,\n\nCongratulations on finalizing your Typhoon Solar 6 kW rooftop solar project (ID: ${projectId})!\n\nTo proceed with your government PM Surya Ghar portal subsidy registration, please send photos of:\n1. Latest Electricity Bill\n2. Aadhaar Card (Front & Back)\n3. Property Tax Receipt or Index-2\n4. Canceled Cheque or Bank Passbook copy\n\nThank you,\nTeam Typhoon Solar`
    );
    window.open(`https://wa.me/919825012345?text=${text}`, '_blank');
    toast.success('Opened WhatsApp with KYC document request!');
  };

  // Check token on mount; redirect if absent
  React.useEffect(() => {
    const token = localStorage.getItem('accessToken');
    const user = localStorage.getItem('user');
    if (!token || token === 'null' || token === 'undefined' || !user) {
      localStorage.clear();
      toast.error('No login session found. Redirecting to login...');
      router.push('/');
    }
  }, [router]);

  // Initial realistic follow-up timeline for Operations Manager review
  const [followups, setFollowups] = useState<FollowupRecord[]>([
    {
      id: 'FUP-101',
      loggedBy: 'Amit Patel',
      role: 'Sales Representative',
      timestamp: 'Today, 11:15 AM',
      type: 'Phone Call',
      customerReaction: 'Very Positive',
      reactionBadgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      description:
        'Called customer to discuss 6 kW system inquiry. Customer verified monthly DISCOM bill is ₹3,800. Explained PM Surya Ghar ₹78,000 direct DBT subsidy. Ramesh agreed for terrace visit tomorrow morning.',
      nextStep: 'Terrace site survey & shadow analysis with DISCOM meter photo',
      committedDate: '10 Nov 2026, 10:30 AM',
      isCompleted: true,
    },
    {
      id: 'FUP-102',
      loggedBy: 'Kunal Joshi',
      role: 'Senior Sales Engineer',
      timestamp: 'Yesterday, 04:30 PM',
      type: 'WhatsApp',
      customerReaction: 'Negotiating',
      reactionBadgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
      description:
        'Shared formal PDF quotation for 6 kW (12x 550W DCR Mono PERC + 6kW On-Grid Inverter). Customer compared pricing with a local vendor; clarified Typhoon includes 5-year free maintenance and Tier-1 mounting structure.',
      nextStep: 'Follow up after father reviews quotation breakdown',
      committedDate: '10 Nov 2026, 05:00 PM',
      isCompleted: true,
    },
    {
      id: 'FUP-103',
      loggedBy: 'Amit Patel',
      role: 'Sales Representative',
      timestamp: 'Planned Upcoming',
      type: 'Terrace Visit',
      customerReaction: 'Needs Subsidy Info',
      reactionBadgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
      description:
        'Pending terrace inspection. Must verify RCC roof slope, shadow obstacles from neighboring water tank, and cable conduit route from roof to ground meter.',
      nextStep: 'Complete 4-photo site survey report and upload to portal',
      committedDate: '11 Nov 2026, 11:00 AM',
      isCompleted: false,
    },
  ]);

  const quickTemplates = [
    'Explained PM Surya Ghar ₹78k subsidy; customer interested in 3.24 kW.',
    'Customer requested revised quotation with DCR panels for faster approval.',
    'Customer discussed with father; ready to pay ₹20,000 booking token.',
    'Terrace measured: 450 sq.ft shadow-free RCC roof, cable run 18 meters.',
  ];

  const handleSaveFollowup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) {
      toast.error('Please enter follow-up description / notes.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const newRecord: FollowupRecord = {
        id: `FUP-${Date.now().toString().slice(-3)}`,
        loggedBy: 'Anand Kumar (Ops Manager)',
        role: 'Operations Manager',
        timestamp: 'Just now',
        type: callType,
        customerReaction,
        reactionBadgeColor:
          customerReaction === 'Very Positive'
            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
            : customerReaction === 'Negotiating'
            ? 'bg-amber-50 text-amber-700 border-amber-200'
            : 'bg-blue-50 text-blue-700 border-blue-200',
        description,
        nextStep,
        committedDate: nextFollowupDate,
        isCompleted: true,
      };

      setFollowups([newRecord, ...followups]);
      toast.success('Follow-up call & notes logged successfully!');
      setDescription('');
      setIsLogCallOpen(false);
      setLoading(false);
    }, 400);
  };

  return (
    <div className="min-h-screen bg-typhoon-sand pb-20">
      {/* ======================================================== */}
      {/* 1. TOP HEADER with Salesperson deep royal blue           */}
      {/* ======================================================== */}
      <div
        style={{ backgroundColor: '#0a3d7c' }}
        className="text-white pt-6 pb-8 px-6 rounded-b-[32px] shadow-soft border-b border-[#124d99]"
      >
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => router.back()}
              className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <span
                style={{ backgroundColor: '#00a3e0', color: '#ffffff' }}
                className="text-[10px] font-bold px-2.5 py-0.5 rounded-full"
              >
                STAGE 2 OF 10
              </span>
              <span className="text-xs text-white/70">Quotation & Site Visit</span>
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl lg:text-3xl font-serif font-bold text-white tracking-tight">
                Ramesh Patel
              </h1>
              <p className="text-xs text-[#00a3e0] font-medium mt-1">
                Inquiry {params.id} · B-42 Shivalik Residency, Anand · +91 98250 12345
              </p>
            </div>

            <div className="flex items-center gap-3">
              <a
                href="tel:+919825012345"
                className="bg-white/10 hover:bg-white/20 text-white font-semibold px-4 py-2 rounded-xl text-xs flex items-center gap-2 transition"
              >
                <Phone className="w-3.5 h-3.5 text-typhoon-gold" />
                <span>Call Customer</span>
              </a>
              <button
                onClick={() => setIsLogCallOpen(true)}
                className="bg-typhoon-gold hover:bg-typhoon-gold-dark text-typhoon-navy font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-2 shadow-soft transition"
              >
                <Plus className="w-4 h-4" />
                <span>Log New Follow-Up</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. MAIN CONTENT (2-Column Grid on Desktop, Stack on Mobile) */}
      {/* ======================================================== */}
      <div className="max-w-6xl mx-auto px-4 lg:px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Customer Details & 10-Stage Progress (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            {/* System Sizing Card */}
            <div className="bg-white rounded-2xl p-5 border border-typhoon-border shadow-soft space-y-3">
              <h3 className="text-xs font-bold tracking-widest text-typhoon-muted uppercase">
                SYSTEM SPECIFICATIONS
              </h3>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="bg-typhoon-sand/60 p-3 rounded-xl border border-typhoon-border/60">
                  <span className="text-[10px] text-typhoon-muted font-semibold uppercase block">Capacity</span>
                  <span className="text-base font-bold text-typhoon-navy">6.0 kW</span>
                </div>
                <div className="bg-typhoon-sand/60 p-3 rounded-xl border border-typhoon-border/60">
                  <span className="text-[10px] text-typhoon-muted font-semibold uppercase block">DISCOM Phase</span>
                  <span className="text-base font-bold text-typhoon-navy">Single Phase</span>
                </div>
                <div className="bg-typhoon-sand/60 p-3 rounded-xl border border-typhoon-border/60">
                  <span className="text-[10px] text-typhoon-muted font-semibold uppercase block">Monthly Bill</span>
                  <span className="text-base font-bold text-typhoon-navy">₹3,800</span>
                </div>
                <div className="bg-typhoon-sand/60 p-3 rounded-xl border border-typhoon-border/60">
                  <span className="text-[10px] text-typhoon-muted font-semibold uppercase block">Govt Subsidy</span>
                  <span className="text-base font-bold text-emerald-600">₹78,000 DBT</span>
                </div>
              </div>

              <div className="pt-2 border-t border-typhoon-border/60 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-typhoon-muted font-medium">Assigned Sales Rep:</span>
                  <span className="font-bold text-typhoon-navy">Amit Patel</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-typhoon-muted font-medium">Lead Created:</span>
                  <span className="font-semibold text-typhoon-navy">07 Nov 2026</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-typhoon-muted font-medium">Next SLA Due:</span>
                  <span className="font-bold text-rose-600">Tomorrow 11:00 AM</span>
                </div>
              </div>

              {/* Action Buttons Hub */}
              <div className="pt-3 border-t border-typhoon-border/60 space-y-2">
                <span className="text-[10px] font-bold tracking-widest text-typhoon-muted uppercase block">
                  ACTION WORKSPACE
                </span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    onClick={() => setIsVisitModalOpen(true)}
                    className="p-2.5 rounded-xl bg-typhoon-sand hover:bg-typhoon-sand-dark text-typhoon-navy font-bold flex items-center justify-center gap-1.5 transition border border-typhoon-border/80"
                  >
                    <MapPin className="w-3.5 h-3.5 text-typhoon-gold" />
                    <span>Mark Visited</span>
                  </button>

                  <button
                    onClick={() => router.push(`/quotations/new?inquiryId=${params.id}&name=Ramesh%20Patel&phone=9825012345&kw=6.0`)}
                    className="p-2.5 rounded-xl bg-typhoon-sand hover:bg-typhoon-sand-dark text-typhoon-navy font-bold flex items-center justify-center gap-1.5 transition border border-typhoon-border/80"
                  >
                    <FileText className="w-3.5 h-3.5 text-typhoon-gold" />
                    <span>Quotation</span>
                  </button>

                  <button
                    onClick={() => setIsDealClosedOpen(true)}
                    className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center justify-center gap-1.5 transition shadow-xs"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Deal Closed</span>
                  </button>

                  <button
                    onClick={handleSendDocsWhatsApp}
                    className="p-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center gap-1.5 transition border border-emerald-200"
                  >
                    <Share2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Request Docs</span>
                  </button>
                </div>

                <button
                  onClick={() => router.push(`/projects/${params.id}/documents`)}
                  className="w-full mt-2 py-2.5 rounded-xl bg-typhoon-navy hover:bg-typhoon-navy-light text-white font-bold text-xs flex items-center justify-center gap-2 transition shadow-soft"
                >
                  <FileText className="w-4 h-4 text-typhoon-gold" />
                  <span>Open KYC Document Locker</span>
                </button>
              </div>
            </div>

            {/* 10-Stage Linear Lifecycle Tracker */}
            <div className="bg-white rounded-2xl p-5 border border-typhoon-border shadow-soft">
              <h3 className="text-xs font-bold tracking-widest text-typhoon-muted uppercase mb-3">
                10-STAGE LINEAR LIFECYCLE
              </h3>

              <div className="space-y-2 text-xs">
                {[
                  { stage: 1, name: 'Inquiry & Phone Qualification', status: 'Completed', color: 'text-emerald-600' },
                  { stage: 2, name: 'Quotation & Terrace Site Survey', status: 'Active Now', color: 'text-typhoon-gold font-bold' },
                  { stage: 3, name: 'KYC Document Collection', status: 'Pending', color: 'text-typhoon-muted' },
                  { stage: 4, name: 'DISCOM Feasibility Approval', status: 'Locked', color: 'text-typhoon-muted' },
                  { stage: 5, name: 'Token Advance (80% Milestone)', status: 'Locked', color: 'text-typhoon-muted' },
                  { stage: 6, name: 'Material Dispatch & Delivery', status: 'Locked', color: 'text-typhoon-muted' },
                  { stage: 7, name: 'Structure Fabrication & Solar Installation', status: 'Locked', color: 'text-typhoon-muted' },
                  { stage: 8, name: 'CEI Inspection & Net Meter Testing', status: 'Locked', color: 'text-typhoon-muted' },
                  { stage: 9, name: 'Final 20% Settlement & Portal Handover', status: 'Locked', color: 'text-typhoon-muted' },
                  { stage: 10, name: 'PM Surya Ghar DBT Subsidy Credit', status: 'Locked', color: 'text-typhoon-muted' },
                ].map((s) => (
                  <div key={s.stage} className="flex items-center justify-between py-1.5 border-b border-typhoon-border/40 last:border-none">
                    <span className="font-medium text-typhoon-navy">
                      {s.stage}. {s.name}
                    </span>
                    <span className={`text-[10px] font-bold ${s.color}`}>{s.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Full Follow-Up Audit Log & Detailed Descriptions (8 cols) */}
          <div className="lg:col-span-8 space-y-4">
            <div className="bg-white rounded-2xl p-6 border border-typhoon-border shadow-soft">
              <div className="flex items-center justify-between pb-4 border-b border-typhoon-border/60">
                <div>
                  <h2 className="text-lg font-serif font-bold text-typhoon-navy">
                    Follow-Up History & Notes
                  </h2>
                  <p className="text-xs text-typhoon-muted">
                    Full discussion descriptions, customer reactions, and committed next steps
                  </p>
                </div>
                <button
                  onClick={() => setIsLogCallOpen(true)}
                  className="bg-typhoon-sand hover:bg-typhoon-sand-dark text-typhoon-navy font-bold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 transition"
                >
                  <Plus className="w-3.5 h-3.5 text-typhoon-gold" />
                  <span>Log Follow-Up</span>
                </button>
              </div>

              {/* Timeline of Follow-ups with Highlighted Descriptions */}
              <div className="mt-5 space-y-5">
                {followups.map((item, idx) => (
                  <div
                    key={item.id}
                    className="relative pl-6 pb-2 border-l-2 border-typhoon-border last:border-l-transparent"
                  >
                    {/* Timeline bullet */}
                    <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-typhoon-navy border-2 border-white shadow-xs" />

                    <div className="bg-typhoon-sand/30 rounded-xl p-4 border border-typhoon-border/70 hover:border-typhoon-gold transition-colors">
                      {/* Top Header of Follow-up */}
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-typhoon-navy">
                            {item.loggedBy}
                          </span>
                          <span className="text-[10px] text-typhoon-muted">({item.role})</span>
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-typhoon-navy/10 text-typhoon-navy">
                            {item.type}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${item.reactionBadgeColor}`}
                          >
                            {item.customerReaction}
                          </span>
                          <span className="text-[11px] text-typhoon-muted font-medium">
                            {item.timestamp}
                          </span>
                        </div>
                      </div>

                      {/* Explicit Follow-up Description Box (Seen by Operations Manager) */}
                      <div className="my-2.5 p-3 rounded-xl bg-white border border-typhoon-border shadow-xs">
                        <div className="flex items-start gap-2">
                          <MessageSquare className="w-4 h-4 text-typhoon-gold shrink-0 mt-0.5" />
                          <div>
                            <span className="text-[11px] font-bold text-typhoon-navy block mb-0.5">
                              Discussion Notes & Remarks:
                            </span>
                            <p className="text-xs text-typhoon-navy leading-relaxed font-normal">
                              {item.description}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Next Step & Committed Date */}
                      <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] pt-1 text-typhoon-muted">
                        <div>
                          <strong className="text-typhoon-navy font-semibold">Committed Action: </strong>
                          <span>{item.nextStep}</span>
                        </div>
                        <div className="flex items-center gap-1 font-medium text-typhoon-navy">
                          <Clock className="w-3.5 h-3.5 text-typhoon-gold" />
                          <span>Target: {item.committedDate}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 3. LOG FOLLOW-UP MODAL (Both Desktop & Mobile)           */}
      {/* ======================================================== */}
      {isLogCallOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white w-full max-w-lg rounded-2xl p-6 shadow-floating border border-typhoon-border animate-in zoom-in-95">
            <div className="flex justify-between items-center pb-3 border-b border-typhoon-border">
              <div>
                <h3 className="text-lg font-serif font-bold text-typhoon-navy">
                  Log Follow-Up & Discussion Notes
                </h3>
                <p className="text-xs text-typhoon-muted">
                  Inquiry {params.id} · Ramesh Patel
                </p>
              </div>
              <button
                onClick={() => setIsLogCallOpen(false)}
                className="w-8 h-8 rounded-full bg-typhoon-sand flex items-center justify-center text-typhoon-muted hover:text-typhoon-navy transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveFollowup} className="space-y-4 mt-4">
              {/* Interaction Type */}
              <div>
                <label className="text-xs font-semibold text-typhoon-navy block mb-1">
                  Interaction Channel
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Phone Call', 'Terrace Visit', 'WhatsApp'] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setCallType(t)}
                      className={`py-2 rounded-xl text-xs font-bold border transition ${
                        callType === t
                          ? 'bg-typhoon-navy text-white border-typhoon-navy'
                          : 'bg-typhoon-sand/50 text-typhoon-navy border-typhoon-border hover:bg-typhoon-sand'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Customer Reaction */}
              <div>
                <label className="text-xs font-semibold text-typhoon-navy block mb-1">
                  Customer Reaction
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {(['Very Positive', 'Negotiating', 'Needs Subsidy Info', 'Hesitant'] as const).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setCustomerReaction(r)}
                      className={`py-2 px-3 rounded-xl font-bold border text-left transition ${
                        customerReaction === r
                          ? 'bg-typhoon-navy text-white border-typhoon-navy'
                          : 'bg-typhoon-sand/50 text-typhoon-navy border-typhoon-border hover:bg-typhoon-sand'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              {/* REQUIRED FOLLOW-UP DESCRIPTION / NOTES */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-typhoon-navy flex items-center gap-1">
                    <span>Follow-Up Description / Call Notes</span>
                    <span className="text-rose-500">*</span>
                  </label>
                  <span className="text-[10px] text-typhoon-muted">Visible to Operations Manager</span>
                </div>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe what was discussed, customer objections, questions, subsidy status, or roof measurements..."
                  className="w-full p-3 bg-typhoon-sand/40 border border-typhoon-border rounded-xl text-xs text-typhoon-navy focus:border-typhoon-gold focus:outline-none transition leading-relaxed placeholder:text-typhoon-muted"
                />

                {/* Quick Templates */}
                <div className="mt-2">
                  <span className="text-[10px] font-bold text-typhoon-muted block mb-1">
                    Quick Templates (Click to fill):
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {quickTemplates.map((template, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setDescription(template)}
                        className="text-[10px] bg-typhoon-sand hover:bg-typhoon-sand-dark text-typhoon-navy px-2.5 py-1 rounded-lg border border-typhoon-border/80 transition text-left"
                      >
                        {template.slice(0, 42)}...
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Next Step & Target Date */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-typhoon-navy block mb-1">
                    Committed Next Action
                  </label>
                  <input
                    type="text"
                    value={nextStep}
                    onChange={(e) => setNextStep(e.target.value)}
                    placeholder="e.g. Terrace survey"
                    className="w-full px-3 py-2 bg-typhoon-sand/40 border border-typhoon-border rounded-xl text-xs text-typhoon-navy focus:border-typhoon-gold focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-typhoon-navy block mb-1">
                    Target SLA Date
                  </label>
                  <input
                    type="date"
                    value={nextFollowupDate}
                    onChange={(e) => setNextFollowupDate(e.target.value)}
                    className="w-full px-3 py-2 bg-typhoon-sand/40 border border-typhoon-border rounded-xl text-xs text-typhoon-navy focus:border-typhoon-gold focus:outline-none"
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsLogCallOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-typhoon-muted hover:text-typhoon-navy transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-typhoon-gold hover:bg-typhoon-gold-dark text-typhoon-navy font-bold px-5 py-2.5 rounded-xl text-xs shadow-soft transition flex items-center gap-1.5 disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{loading ? 'Saving Notes...' : 'Save Follow-Up'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 4. MARK SITE VISIT MODAL                                 */}
      {/* ======================================================== */}
      {isVisitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-floating border border-typhoon-border animate-in zoom-in-95">
            <div className="flex justify-between items-center pb-3 border-b border-typhoon-border">
              <div>
                <h3 className="text-lg font-serif font-bold text-typhoon-navy">
                  Log Terrace Site Visit
                </h3>
                <p className="text-xs text-typhoon-muted">
                  Record roof survey measurements & shadow verification
                </p>
              </div>
              <button
                onClick={() => setIsVisitModalOpen(false)}
                className="w-8 h-8 rounded-full bg-typhoon-sand flex items-center justify-center text-typhoon-muted hover:text-typhoon-navy transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setIsVisitModalOpen(false);
                toast.success('Terrace site visit logged successfully!');
                const newRecord: FollowupRecord = {
                  id: `FUP-${Date.now().toString().slice(-3)}`,
                  loggedBy: 'Amit Patel (Sales)',
                  role: 'Sales Representative',
                  timestamp: 'Just now',
                  type: 'Terrace Visit',
                  customerReaction: 'Very Positive',
                  reactionBadgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
                  description: `Site visit completed. Terrace usable area: ${roofArea} sq.ft (${roofType}). Shadow obstacles verified. DISCOM meter location noted.`,
                  nextStep: 'Finalize quotation & close deal',
                  committedDate: '12 Nov 2026',
                  isCompleted: true,
                };
                setFollowups([newRecord, ...followups]);
              }}
              className="space-y-4 mt-4"
            >
              <div>
                <label className="text-xs font-semibold text-typhoon-navy block mb-1">
                  Usable Shadow-Free Roof Area (sq.ft)
                </label>
                <input
                  type="number"
                  value={roofArea}
                  onChange={(e) => setRoofArea(e.target.value)}
                  className="w-full px-3 py-2 bg-typhoon-sand/40 border border-typhoon-border rounded-xl text-xs text-typhoon-navy focus:border-typhoon-gold focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-typhoon-navy block mb-1">
                  Roof Construction Type
                </label>
                <select
                  value={roofType}
                  onChange={(e) => setRoofType(e.target.value)}
                  className="w-full px-3 py-2 bg-typhoon-sand/40 border border-typhoon-border rounded-xl text-xs text-typhoon-navy focus:border-typhoon-gold focus:outline-none"
                >
                  <option value="RCC Terrace">RCC Terrace Flat Roof (Standard Elevated Structure)</option>
                  <option value="Metal Industrial Shed">Metal Industrial Sheet Roof (Trapezoidal clamp)</option>
                  <option value="Tiled Sloped Roof">Mangalore / Clay Tiled Roof</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-typhoon-navy block mb-1">
                  Shadow Verification
                </label>
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 space-y-1">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>Water tank shadow distance verified</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>DISCOM meter box cable run under 20m</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsVisitModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-typhoon-muted hover:text-typhoon-navy transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-typhoon-gold hover:bg-typhoon-gold-dark text-typhoon-navy font-bold px-5 py-2.5 rounded-xl text-xs shadow-soft transition"
                >
                  Save Site Survey
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 5. DEAL CLOSED MODAL                                     */}
      {/* ======================================================== */}
      {isDealClosedOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-floating border border-typhoon-border animate-in zoom-in-95">
            <div className="flex justify-between items-center pb-3 border-b border-typhoon-border">
              <div>
                <h3 className="text-lg font-serif font-bold text-typhoon-navy">
                  Close Deal & Generate Project ID
                </h3>
                <p className="text-xs text-typhoon-muted">
                  Locks final negotiated price and activates project lifecycle
                </p>
              </div>
              <button
                onClick={() => setIsDealClosedOpen(false)}
                className="w-8 h-8 rounded-full bg-typhoon-sand flex items-center justify-center text-typhoon-muted hover:text-typhoon-navy transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setIsDealClosedOpen(false);
                setCurrentStageText('STAGE 4 OF 10 · DEAL CLOSED');
                toast.success(`🎉 Deal closed! Project ID ${projectId} generated!`);
                const newRecord: FollowupRecord = {
                  id: `FUP-${Date.now().toString().slice(-3)}`,
                  loggedBy: 'Amit Patel (Sales)',
                  role: 'Sales Representative',
                  timestamp: 'Just now',
                  type: 'Office Meeting',
                  customerReaction: 'Very Positive',
                  reactionBadgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
                  description: `🎉 Deal closed successfully at ₹${Number(dealAmount).toLocaleString('en-IN')}. Project ID ${projectId} generated. Proceeding with KYC document gathering.`,
                  nextStep: 'Collect KYC Documents (Light bill, Aadhaar, Property tax, Cheque)',
                  committedDate: '13 Nov 2026',
                  isCompleted: true,
                };
                setFollowups([newRecord, ...followups]);
              }}
              className="space-y-4 mt-4"
            >
              <div className="bg-typhoon-sand/60 p-4 rounded-xl border border-typhoon-border/80">
                <span className="text-[10px] font-bold tracking-widest text-typhoon-muted uppercase block">
                  NEW PROJECT IDENTIFIER
                </span>
                <span className="text-lg font-serif font-bold text-typhoon-navy block mt-0.5">
                  {projectId}
                </span>
                <span className="text-[11px] text-typhoon-gold font-semibold">
                  Transition from Lead F-XXXX → Official Project
                </span>
              </div>

              <div>
                <label className="text-xs font-semibold text-typhoon-navy block mb-1">
                  Final Agreed Deal Price (₹)
                </label>
                <input
                  type="number"
                  value={dealAmount}
                  onChange={(e) => setDealAmount(e.target.value)}
                  className="w-full px-4 py-3 bg-typhoon-sand/40 border border-typhoon-border rounded-xl text-base font-bold text-typhoon-navy focus:border-typhoon-gold focus:outline-none"
                  required
                />
                <p className="text-[10px] text-typhoon-muted mt-1">
                  Net price including 12x 550W DCR panels, 6 kW On-Grid inverter, and 5-yr AMC.
                </p>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsDealClosedOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-typhoon-muted hover:text-typhoon-navy transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-2.5 rounded-xl text-xs shadow-soft transition flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Confirm Deal Closed</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
