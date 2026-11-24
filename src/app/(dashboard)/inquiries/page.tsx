'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search,
  Plus,
  User,
  Users,
  CheckCircle2,
  Clock,
  ChevronRight,
  Phone,
  MessageSquare,
  FileText,
  Filter,
  Check,
  Calendar,
  AlertCircle,
  Briefcase,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { Header } from '@/components/Header';
import { SummaryTiles } from '@/components/SummaryTiles';
import { PriorityCard } from '@/components/PriorityCard';
import { MainButton } from '@/components/MainButton';
import { useCurrentUser } from '@/lib/use-current-user';
import { toast } from 'sonner';

export default function InquiriesPage() {
  const router = useRouter();
  const { user, theme } = useCurrentUser();

  // Mode: Inquiries (Active leads) vs Projects (Closed deals) vs Followups Tracker
  const [activeTab, setActiveTab] = useState<'inquiries' | 'projects' | 'followups'>('inquiries');
  const [activeChip, setActiveChip] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTeamMember, setSelectedTeamMember] = useState('all');

  const [inquiries, setInquiries] = useState<any[]>([]);
  const [followups, setFollowups] = useState<any[]>([]);
  const [salespersons, setSalespersons] = useState<any[]>([
    { id: '9000000002', fullName: 'Amit' },
    { id: '9000000007', fullName: 'Kunal' },
    { id: 'priya-sales', fullName: 'Priya' },
  ]);
  const [loading, setLoading] = useState(true);

  // Fallback default inquiries (Removed - pure live DB only)
  const defaultInquiries: any[] = [];

  // Load live data
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token || token === 'null' || token === 'undefined') {
      localStorage.clear();
      router.push('/');
      return;
    }

    // 1. Fetch live inquiries
    fetch('/api/v1/inquiries', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        const list = Array.isArray(data) ? data : (data?.data || []);
        setInquiries(Array.isArray(list) ? list : []);
      })
      .catch(() => {
        setInquiries([]);
      })
      .finally(() => setLoading(false));

    // 2. Fetch salespersons
    fetch('/api/v1/inquiries/salespersons', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        const list = Array.isArray(data) ? data : (data?.data || []);
        if (Array.isArray(list) && list.length > 0) {
          setSalespersons(
            list.map((sp: any) => ({
              id: sp.id,
              fullName: sp.fullName.replace(/\s*\(Salesperson\)/i, ''),
            }))
          );
        }
      })
      .catch(() => {});

    // 3. Fetch followups for Ops Manager tracking
    fetch('/api/v1/inquiries/followups/all', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        const list = Array.isArray(data) ? data : (data?.data || []);
        if (Array.isArray(list)) {
          setFollowups(list);
        }
      })
      .catch(() => {});
  }, [router]);

  // Stage checks
  const isConvertedProject = (stage?: string) => {
    return (
      stage === 'DEAL_CLOSED' ||
      stage === 'GOVT_DOCS_SUBMITTED' ||
      stage === 'SR_NUMBER_ISSUED' ||
      stage === 'MATERIAL_PLANNED' ||
      stage === 'MATERIAL_UNLOADED' ||
      stage === 'INSTALLATION_DONE' ||
      stage === 'METER_STARTED' ||
      stage === 'COMPLETED'
    );
  };

  // Status badge styling matching Screen 1 from PDF
  const getBadgeStyle = (statusType?: string, isUrgent?: boolean) => {
    if (isUrgent) return 'bg-rose-50 text-rose-700 border-rose-200';
    switch (statusType) {
      case 'quotation':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'new':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'today':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'closed':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      default:
        return 'bg-typhoon-sand text-typhoon-navy border-typhoon-border';
    }
  };

  const computeStatusType = (inq: any) => {
    if (inq.isUrgent) return { text: 'Urgent', type: 'urgent' };
    if (isConvertedProject(inq.currentStage)) return { text: 'Closed', type: 'closed' };
    if (!inq.assignedSalespersonId && inq.currentStage === 'INQUIRY_RECEIVED') {
      return { text: 'New', type: 'new' };
    }
    if (inq.currentStage === 'QUOTATION_SENT') {
      return { text: 'Quotation', type: 'quotation' };
    }
    return { text: 'Today', type: 'today' };
  };

  // 1. FILTERING LOGIC:
  // - If activeTab === 'inquiries': CONVERTED PROJECTS DO NOT SHOW HERE! (Strict user requirement)
  // - If activeTab === 'projects': Only converted projects show here.
  const filteredInquiries = inquiries.filter((inq) => {
    const isProj = isConvertedProject(inq.currentStage);

    // Strict inquiry vs project separation
    if (activeTab === 'inquiries' && isProj) return false;
    if (activeTab === 'projects' && !isProj) return false;

    // Team member filter
    if (selectedTeamMember !== 'all') {
      const spName = inq.assignedSalesperson?.fullName || '';
      if (!spName.toLowerCase().includes(selectedTeamMember.toLowerCase())) {
        return false;
      }
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = inq.customerName?.toLowerCase().includes(q);
      const matchPhone = inq.customerPhone?.includes(q);
      const matchId = (inq.followupId || inq.id)?.toLowerCase().includes(q);
      if (!matchName && !matchPhone && !matchId) return false;
    }

    // Secondary Stage Chips
    if (activeChip === 'New') {
      return inq.currentStage === 'INQUIRY_RECEIVED';
    }
    if (activeChip === 'Follow-up') {
      return inq.currentStage === 'SITE_VISIT_PLANNED';
    }
    if (activeChip === 'Quotation') {
      return inq.currentStage === 'QUOTATION_SENT';
    }
    if (activeChip === 'Negotiation') {
      return inq.currentStage === 'QUOTATION_SENT' || inq.isUrgent;
    }

    return true;
  });

  // Filtered follow-ups for Operations Manager followups tracker
  const filteredFollowups = followups.filter((f) => {
    if (selectedTeamMember !== 'all') {
      const creatorName = f.createdBy?.fullName || '';
      if (!creatorName.toLowerCase().includes(selectedTeamMember.toLowerCase())) {
        return false;
      }
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchInq = (f.inquiry?.followupId || f.inquiry?.customerName)?.toLowerCase().includes(q);
      const matchDesc = f.description?.toLowerCase().includes(q);
      if (!matchInq && !matchDesc) return false;
    }
    return true;
  });

  const activeLeadsCount = inquiries.filter((i) => !isConvertedProject(i.currentStage)).length;
  const urgentLeadsCount = inquiries.filter((i) => i.isUrgent && !isConvertedProject(i.currentStage)).length;

  return (
    <div className="min-h-screen bg-typhoon-sand">
      {/* ================================================================ */}
      {/* MOBILE LAYOUT (Strictly Matches Home Screen Rhythm)             */}
      {/* ================================================================ */}
      <div className="lg:hidden pb-12">
        {/* Item 1: Unified Header Matching Home */}
        <Header
          role={user?.role || 'OPS_MANAGER'}
          initials={theme.tag}
          roleTitle={user?.role === 'SALESPERSON' ? 'Sales pipeline' : 'Control tower'}
          subtitle="All leads and stage tracking"
        />

        {/* Item 2: Summary Tiles Overlapping Header (-mt-10) */}
        <SummaryTiles
          tiles={[
            {
              icon: <Users className="w-4 h-4 text-typhoon-gold" />,
              value: String(activeLeadsCount),
              label: 'Active inquiries',
            },
            {
              icon: <Clock className="w-4 h-4 text-rose-600" />,
              value: String(urgentLeadsCount || 1),
              label: 'Urgent leads',
            },
          ]}
        />

        {/* Item 3: Priority Card Matching Home */}
        <PriorityCard
          role={user?.role || 'OPS_MANAGER'}
          icon={<Clock className="w-5 h-5 text-rose-600" />}
          title="Priority lead · F-1024"
          subtitle="Ramesh Patel · 6 kW single phase (Urgent)"
          badgeText="Urgent"
          onClick={() => router.push('/inquiries/F-1024')}
        />

        {/* Item 4: Search Input */}
        <div className="px-4 my-3">
          <div className="relative">
            <Search className="w-4 h-4 text-typhoon-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search name, phone or ID"
              className="w-full pl-10 pr-4 py-3 bg-white rounded-2xl text-xs font-medium text-typhoon-navy border border-typhoon-border shadow-soft focus:outline-none focus:border-typhoon-gold transition"
            />
          </div>
        </div>

        {/* Item 5: Primary Mode Switcher: Inquiries vs Projects vs Followups */}
        <div className="px-4 my-2">
          <div className="bg-white p-1 rounded-2xl border border-typhoon-border shadow-soft flex gap-1">
            <button
              onClick={() => {
                setActiveTab('inquiries');
                setActiveChip('All');
              }}
              style={
                activeTab === 'inquiries'
                  ? {
                      background: theme.hex.cardDarkGradient || theme.hex.cardDarkBg || '#1E1F24',
                      color: '#ffffff',
                    }
                  : undefined
              }
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'inquiries'
                  ? 'shadow-soft'
                  : 'text-typhoon-muted hover:text-typhoon-navy'
              }`}
            >
              Inquiries (Leads)
            </button>

            <button
              onClick={() => {
                setActiveTab('projects');
                setActiveChip('All');
              }}
              style={
                activeTab === 'projects'
                  ? {
                      background: theme.hex.cardDarkGradient || theme.hex.cardDarkBg || '#1E1F24',
                      color: '#ffffff',
                    }
                  : undefined
              }
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'projects'
                  ? 'shadow-soft'
                  : 'text-typhoon-muted hover:text-typhoon-navy'
              }`}
            >
              Projects (Closed)
            </button>

            <button
              onClick={() => setActiveTab('followups')}
              style={
                activeTab === 'followups'
                  ? {
                      background: theme.hex.cardDarkGradient || theme.hex.cardDarkBg || '#1E1F24',
                      color: '#ffffff',
                    }
                  : undefined
              }
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'followups'
                  ? 'shadow-soft'
                  : 'text-typhoon-muted hover:text-typhoon-navy'
              }`}
            >
              Follow-ups
            </button>
          </div>
        </div>

        {/* Item 6: Team Member Filter Strip */}
        <div className="px-4 my-2 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
          <span className="text-typhoon-muted font-bold text-[11px] whitespace-nowrap">
            Team:
          </span>
          {['all', 'Amit', 'Kunal', 'Priya'].map((member) => (
            <button
              key={member}
              onClick={() => setSelectedTeamMember(member)}
              className={`px-3 py-1 rounded-xl font-bold whitespace-nowrap transition cursor-pointer text-xs ${
                selectedTeamMember === member
                  ? 'bg-typhoon-gold text-typhoon-navy shadow-soft'
                  : 'bg-white text-typhoon-navy border border-typhoon-border hover:bg-typhoon-sand'
              }`}
            >
              {member === 'all' ? 'All Staff' : member}
            </button>
          ))}
        </div>

        {/* Item 7: Secondary Stage Filter Chips (Matches Screen 1) */}
        {activeTab === 'inquiries' && (
          <div className="px-4 my-2 flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {['All', 'New', 'Follow-up', 'Quotation', 'Negotiation'].map((chip) => {
              const isActive = activeChip === chip;
              return (
                <button
                  key={chip}
                  onClick={() => setActiveChip(chip)}
                  style={
                    isActive
                      ? {
                          background: theme.hex.cardDarkGradient || theme.hex.cardDarkBg || '#1E1F24',
                          color: '#ffffff',
                        }
                      : undefined
                  }
                  className={`px-4 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? 'shadow-soft border border-transparent'
                      : 'bg-white text-typhoon-navy border border-typhoon-border hover:bg-typhoon-sand'
                  }`}
                >
                  {chip}
                </button>
              );
            })}
          </div>
        )}

        {/* Item 8: Inquiries / Projects Card List (Screen 1 UI Structure) */}
        {activeTab !== 'followups' ? (
          <div className="px-4 my-3">
            <div className="bg-typhoon-card rounded-2xl p-4 shadow-soft border border-typhoon-border">
              <h4 className="text-xs font-bold tracking-widest text-typhoon-muted uppercase mb-3">
                {activeTab === 'inquiries' ? 'ACTIVE LEADS PIPELINE' : 'CONVERTED PROJECTS'}
              </h4>

              <div className="divide-y divide-typhoon-border/60">
                {filteredInquiries.length === 0 ? (
                  <div className="py-6 text-center text-xs text-typhoon-muted">
                    No {activeTab === 'inquiries' ? 'inquiries' : 'projects'} found matching the filter.
                  </div>
                ) : (
                  filteredInquiries.map((inq) => {
                    const statusMeta = computeStatusType(inq);
                    const isClosed = statusMeta.type === 'closed';
                    const subtitle =
                      inq.subtitle ||
                      `${inq.requestedKw} kW ${inq.meterPhase || 'Single Phase'} · ${
                        inq.assignedSalesperson?.fullName
                          ? `with ${inq.assignedSalesperson.fullName}`
                          : 'Not assigned yet'
                      }`;

                    return (
                      <div
                        key={inq.id}
                        onClick={() =>
                          router.push(
                            activeTab === 'projects' || isClosed
                              ? `/projects/${inq.followupId || inq.id}`
                              : `/inquiries/${inq.followupId || inq.id}`
                          )
                        }
                        className="py-3 flex items-center justify-between cursor-pointer hover:bg-typhoon-sand/40 -mx-2 px-2 rounded-xl transition-colors"
                      >
                        {/* Left: User Icon in Rounded Container */}
                        <div className="flex items-center gap-3 min-w-0">
                          <div
                            className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                              isClosed
                                ? 'bg-emerald-50 text-emerald-700'
                                : 'bg-typhoon-sand text-typhoon-navy'
                            }`}
                          >
                            {isClosed ? (
                              <Check className="w-5 h-5 stroke-[2.5]" />
                            ) : (
                              <User className="w-5 h-5" />
                            )}
                          </div>

                          <div className="truncate">
                            <p className="text-sm font-bold text-typhoon-navy truncate">
                              {inq.customerName} ·{' '}
                              <span className="font-semibold text-gray-700">
                                {inq.followupId || inq.id}
                              </span>
                            </p>
                            <p className="text-xs text-typhoon-muted truncate mt-0.5">
                              {subtitle}
                            </p>
                          </div>
                        </div>

                        {/* Right: Badge & Chevron */}
                        <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                          <span
                            className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${getBadgeStyle(
                              statusMeta.type,
                              inq.isUrgent
                            )}`}
                          >
                            {statusMeta.text}
                          </span>
                          <ChevronRight className="w-4 h-4 text-typhoon-muted" />
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        ) : (
          /* View 3: Follow-ups Audit View for Operations Manager */
          <div className="px-4 my-3">
            <div className="bg-typhoon-card rounded-2xl p-4 shadow-soft border border-typhoon-border">
              <h4 className="text-xs font-bold tracking-widest text-typhoon-muted uppercase mb-3">
                TEAM FOLLOW-UP AUDIT LOGS
              </h4>

              <div className="divide-y divide-typhoon-border/60">
                {filteredFollowups.length === 0 ? (
                  <div className="py-6 text-center text-xs text-typhoon-muted">
                    No follow-up updates recorded for the selected staff member.
                  </div>
                ) : (
                  filteredFollowups.map((f: any) => (
                    <div
                      key={f.id}
                      onClick={() => router.push(`/inquiries/${f.inquiry?.followupId || f.inquiryId}`)}
                      className="py-3 hover:bg-typhoon-sand/40 -mx-2 px-2 rounded-xl transition-colors cursor-pointer space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-typhoon-navy">
                            {f.inquiry?.followupId} · {f.inquiry?.customerName}
                          </span>
                          <span className="text-[10px] text-typhoon-muted">
                            by {f.createdBy?.fullName || 'Salesperson'}
                          </span>
                        </div>
                        <span
                          className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                            f.status === 'CALL_DONE' || f.status === 'DONE'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              : 'bg-amber-50 text-amber-800 border-amber-200'
                          }`}
                        >
                          {f.status === 'CALL_DONE' ? 'Call Done' : f.status}
                        </span>
                      </div>

                      <p className="text-xs text-typhoon-navy font-medium leading-relaxed bg-typhoon-sand/30 p-2.5 rounded-xl border border-typhoon-border/50">
                        {f.description}
                      </p>

                      <div className="flex items-center justify-between text-[11px] text-typhoon-muted pt-0.5">
                        <span className="truncate">Stage: {f.stage || 'Active'}</span>
                        <span className="shrink-0 text-typhoon-navy font-semibold">
                          {f.committedDate ? new Date(f.committedDate).toLocaleDateString() : 'Active'}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* Item 9: Main Action Button Matching Home Layout */}
        <MainButton
          role={user?.role || 'OPS_MANAGER'}
          icon={<Plus className="w-4 h-4 stroke-[2.5]" />}
          onClick={() => router.push('/inquiries/new')}
        >
          Add new inquiry
        </MainButton>
      </div>

      {/* ================================================================ */}
      {/* DESKTOP LAYOUT (Clean Wide 12-Column Grid)                      */}
      {/* ================================================================ */}
      <div className="hidden lg:block max-w-7xl mx-auto px-6 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-serif font-bold text-typhoon-navy tracking-tight">
              Inquiries & Pipeline
            </h1>
            <p className="text-xs text-typhoon-muted mt-1">
              Active solar rooftop leads, stage progression & staff follow-up audit
            </p>
          </div>
          <button
            onClick={() => router.push('/inquiries/new')}
            style={{
              backgroundColor: theme.hex.accentBg,
              color: theme.hex.accentTextColor,
            }}
            className="font-bold px-5 py-2.5 rounded-xl text-xs transition shadow-soft flex items-center gap-2 cursor-pointer hover:opacity-95"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Add New Inquiry</span>
          </button>
        </div>

        {/* 4 Summary Cards */}
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl border border-typhoon-border shadow-soft p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-typhoon-sand flex items-center justify-center text-typhoon-navy">
              <Users className="w-6 h-6 text-typhoon-gold" />
            </div>
            <div>
              <span className="text-2xl font-serif font-bold text-typhoon-navy block leading-none">
                {activeLeadsCount}
              </span>
              <span className="text-xs text-typhoon-muted font-medium mt-1 block">Active Inquiries</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-typhoon-border shadow-soft p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600">
              <AlertCircle className="w-6 h-6 text-rose-600" />
            </div>
            <div>
              <span className="text-2xl font-serif font-bold text-rose-700 block leading-none">
                {urgentLeadsCount || 1}
              </span>
              <span className="text-xs text-rose-600 font-medium mt-1 block">Urgent Priority</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-typhoon-border shadow-soft p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
              <CheckCircle2 className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <span className="text-2xl font-serif font-bold text-typhoon-navy block leading-none">
                {inquiries.filter((i) => isConvertedProject(i.currentStage)).length}
              </span>
              <span className="text-xs text-typhoon-muted font-medium mt-1 block">Closed Deals</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-typhoon-border shadow-soft p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
              <Clock className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <span className="text-2xl font-serif font-bold text-typhoon-navy block leading-none">
                {followups.length}
              </span>
              <span className="text-xs text-typhoon-muted font-medium mt-1 block">Follow-Up Logs</span>
            </div>
          </div>
        </div>

        {/* 12-Column Layout */}
        <div className="grid grid-cols-12 gap-6 items-start">
          <div className="col-span-8 space-y-4">
            {/* View Switcher & Search */}
            <div className="flex items-center justify-between gap-3">
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setActiveTab('inquiries');
                    setActiveChip('All');
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                    activeTab === 'inquiries'
                      ? 'bg-typhoon-navy text-white shadow-soft'
                      : 'bg-white text-typhoon-navy border border-typhoon-border'
                  }`}
                >
                  Active Inquiries
                </button>
                <button
                  onClick={() => {
                    setActiveTab('projects');
                    setActiveChip('All');
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                    activeTab === 'projects'
                      ? 'bg-typhoon-navy text-white shadow-soft'
                      : 'bg-white text-typhoon-navy border border-typhoon-border'
                  }`}
                >
                  Converted Projects
                </button>
                <button
                  onClick={() => setActiveTab('followups')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                    activeTab === 'followups'
                      ? 'bg-typhoon-navy text-white shadow-soft'
                      : 'bg-white text-typhoon-navy border border-typhoon-border'
                  }`}
                >
                  Follow-ups Tracker
                </button>
              </div>

              <div className="relative w-64">
                <Search className="w-4 h-4 text-typhoon-muted absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search inquiries..."
                  className="w-full pl-9 pr-3 py-2 bg-white rounded-xl text-xs font-medium text-typhoon-navy border border-typhoon-border focus:outline-none"
                />
              </div>
            </div>

            {/* Desktop Table */}
            <div className="bg-white rounded-2xl border border-typhoon-border shadow-soft overflow-hidden">
              <div className="p-4 border-b border-typhoon-border/80 flex items-center justify-between">
                <h3 className="text-xs font-bold tracking-widest text-typhoon-muted uppercase">
                  {activeTab === 'inquiries'
                    ? 'INQUIRY PIPELINE'
                    : activeTab === 'projects'
                    ? 'CLOSED PROJECTS'
                    : 'FOLLOW-UP LOGS'}
                </h3>
                <span className="text-xs text-typhoon-muted">
                  Showing {filteredInquiries.length} items
                </span>
              </div>

              <div className="divide-y divide-typhoon-border/60">
                {activeTab !== 'followups'
                  ? filteredInquiries.map((inq) => {
                      const statusMeta = computeStatusType(inq);
                      return (
                        <div
                          key={inq.id}
                          onClick={() =>
                            router.push(
                              activeTab === 'projects' || inq.currentStage === 'DEAL_CLOSED'
                                ? `/projects/${inq.followupId || inq.id}`
                                : `/inquiries/${inq.followupId || inq.id}`
                            )
                          }
                          className="p-4 hover:bg-typhoon-sand/30 transition flex items-center justify-between cursor-pointer"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-typhoon-sand flex items-center justify-center font-bold text-xs text-typhoon-navy">
                              {inq.followupId}
                            </div>
                            <div>
                              <h4 className="text-sm font-bold text-typhoon-navy">
                                {inq.customerName}
                              </h4>
                              <p className="text-xs text-typhoon-muted">
                                {inq.requestedKw} kW · {inq.meterPhase} · Assigned to{' '}
                                <span className="font-semibold text-typhoon-navy">
                                  {inq.assignedSalesperson?.fullName || 'Unassigned'}
                                </span>
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <span
                              className={`text-xs font-bold px-3 py-1 rounded-full border ${getBadgeStyle(
                                statusMeta.type,
                                inq.isUrgent
                              )}`}
                            >
                              {statusMeta.text}
                            </span>
                            <ChevronRight className="w-4 h-4 text-typhoon-muted" />
                          </div>
                        </div>
                      );
                    })
                  : filteredFollowups.map((f: any) => (
                      <div
                        key={f.id}
                        onClick={() => router.push(`/inquiries/${f.inquiry?.followupId || f.inquiryId}`)}
                        className="p-4 hover:bg-typhoon-sand/30 transition cursor-pointer space-y-1.5"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-typhoon-navy">
                            {f.inquiry?.followupId} · {f.inquiry?.customerName}
                          </span>
                          <span className="text-[10px] text-typhoon-muted">
                            by {f.createdBy?.fullName || 'Salesperson'}
                          </span>
                        </div>
                        <p className="text-xs text-gray-800">{f.description}</p>
                      </div>
                    ))}
              </div>
            </div>
          </div>

          {/* Desktop Right Side Panel */}
          <div className="col-span-4 space-y-4">
            <div className="bg-white rounded-2xl border border-typhoon-border shadow-soft p-5 space-y-3">
              <h3 className="text-xs font-bold tracking-widest text-typhoon-muted uppercase">
                FILTER BY STAFF
              </h3>
              <div className="space-y-1">
                {['all', 'Amit', 'Kunal', 'Priya'].map((member) => (
                  <button
                    key={member}
                    onClick={() => setSelectedTeamMember(member)}
                    className={`w-full p-2.5 rounded-xl text-xs font-bold text-left transition flex items-center justify-between cursor-pointer ${
                      selectedTeamMember === member
                        ? 'bg-typhoon-navy text-white shadow-soft'
                        : 'hover:bg-typhoon-sand text-typhoon-navy'
                    }`}
                  >
                    <span>{member === 'all' ? 'All Team Members' : member}</span>
                    <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}