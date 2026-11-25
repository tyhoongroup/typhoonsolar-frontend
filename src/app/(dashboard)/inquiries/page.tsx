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
  const [isOverdueOnly, setIsOverdueOnly] = useState(false);
  const [capacityFilter, setCapacityFilter] = useState<'all' | '<5' | '5-10' | '>10'>('all');
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [selectedSort, setSelectedSort] = useState<'due_date' | 'newest'>('due_date');

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

    // Overdue filter
    if (isOverdueOnly && !inq.isUrgent) {
      return false;
    }

    // Capacity filter
    if (capacityFilter !== 'all') {
      const kw = Number(inq.requestedKw) || 0;
      if (capacityFilter === '<5' && kw >= 5) return false;
      if (capacityFilter === '5-10' && (kw < 5 || kw > 10)) return false;
      if (capacityFilter === '>10' && kw <= 10) return false;
    }

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

  const activeFiltersCount =
    (selectedTeamMember !== 'all' ? 1 : 0) +
    (isOverdueOnly ? 1 : 0) +
    (capacityFilter !== 'all' ? 1 : 0) +
    (activeChip !== 'All' ? 1 : 0) +
    (searchQuery.trim() ? 1 : 0);

  const hasAnyActiveFilters =
    selectedTeamMember !== 'all' ||
    isOverdueOnly ||
    capacityFilter !== 'all' ||
    activeChip !== 'All' ||
    Boolean(searchQuery.trim());

  const handleClearAllFilters = () => {
    setSelectedTeamMember('all');
    setIsOverdueOnly(false);
    setCapacityFilter('all');
    setActiveChip('All');
    setSearchQuery('');
  };

  const activeLeadsCount = inquiries.filter((i) => !isConvertedProject(i.currentStage)).length;
  const convertedProjectsCount = inquiries.filter((i) => isConvertedProject(i.currentStage)).length;
  const followupsTotalCount = followups.length;

  const newLeadsCount = inquiries.filter((i) => !isConvertedProject(i.currentStage) && i.currentStage === 'INQUIRY_RECEIVED').length;
  const followupLeadsCount = inquiries.filter((i) => !isConvertedProject(i.currentStage) && (i.currentStage === 'SITE_VISIT_PLANNED' || i.currentStage === 'INQUIRY_RECEIVED')).length;
  const quotationLeadsCount = inquiries.filter((i) => !isConvertedProject(i.currentStage) && i.currentStage === 'QUOTATION_SENT').length;
  const urgentLeadsCount = inquiries.filter((i) => !isConvertedProject(i.currentStage) && i.isUrgent).length;

  // Sorting
  const sortedInquiries = [...filteredInquiries].sort((a, b) => {
    if (selectedSort === 'newest') {
      return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
    }
    // Default: due date / urgency first
    if (a.isUrgent && !b.isUrgent) return -1;
    if (!a.isUrgent && b.isUrgent) return 1;
    return 0;
  });

  return (
    <div className="min-h-screen bg-[#FBF8F3]">
      {/* ================================================================ */}
      {/* MOBILE LAYOUT (Exact Match to Shared Image 2)                    */}
      {/* ================================================================ */}
      <div className="lg:hidden pb-24">
        {/* Top Dark Header matching Image 2 */}
        <div className="bg-[#0B1E36] text-white pt-6 pb-8 px-4 rounded-b-[36px] relative overflow-hidden shadow-lg">
          {/* Concentric subtle ripples on top right */}
          <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full border border-white/5 pointer-events-none" />
          <div className="absolute -top-6 -right-6 w-36 h-36 rounded-full border border-white/5 pointer-events-none" />

          {/* Top Bar: Hamburger, Centered Logo Pill, Alert Bell with orange dot */}
          <div className="flex items-center justify-between mb-6 relative z-10">
            <button
              onClick={() => router.push('/dashboard')}
              className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white active:scale-95 transition cursor-pointer"
              aria-label="Menu"
            >
              <span className="space-y-1 block">
                <span className="block w-4 h-0.5 bg-white rounded-full"></span>
                <span className="block w-4 h-0.5 bg-white rounded-full"></span>
                <span className="block w-4 h-0.5 bg-white rounded-full"></span>
              </span>
            </button>

            {/* Logo in White Pill Container (Image 2) */}
            <div className="bg-white px-4 py-1.5 rounded-full flex items-center justify-center shadow-md">
              <img
                src="/images/typhoon-logo.png"
                alt="Typhoon Solar System"
                className="h-6 w-auto object-contain"
              />
            </div>

            {/* Bell with orange badge */}
            <button
              onClick={() => router.push('/dashboard')}
              className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white relative active:scale-95 transition cursor-pointer"
              aria-label="Notifications"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
              <span className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-[#EA580C] border-2 border-[#0B1E36]" />
            </button>
          </div>

          {/* Screen Title */}
          <div className="relative z-10 px-1">
            <h1 className="text-3xl font-serif font-bold text-white tracking-tight">
              Inquiries
            </h1>
            <p className="text-xs text-white/70 mt-1 font-normal">
              All leads, projects and follow-ups
            </p>
          </div>
        </div>

        {/* Floating Search Bar with Filter Button (Overlapping Header) */}
        <div className="px-4 -mt-5 relative z-20">
          <div className="flex items-center gap-2">
            <div className="flex-1 relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search name, phone or ID"
                className="w-full pl-11 pr-4 py-3 bg-white rounded-2xl text-xs font-medium text-gray-800 border border-gray-200/80 shadow-md focus:outline-none focus:border-[#F59E0B] transition"
              />
            </div>
            <button
              onClick={() => setIsFilterModalOpen(true)}
              className="w-11 h-11 rounded-2xl bg-[#0B1E36] text-white flex items-center justify-center shadow-md relative shrink-0 active:scale-95 transition cursor-pointer"
              title="Filters"
            >
              <Filter className="w-4 h-4" />
              {activeFiltersCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-[#F59E0B] text-[#071326] text-[10px] font-bold flex items-center justify-center border-2 border-white shadow-xs">
                  {activeFiltersCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Primary 3-Pill Switcher: Leads · Projects · Follow-ups (Image 2) */}
        <div className="px-4 mt-4">
          <div className="bg-white rounded-2xl p-1.5 shadow-sm border border-gray-200/70 flex items-center justify-between gap-1">
            <button
              onClick={() => {
                setActiveTab('inquiries');
                setActiveChip('All');
              }}
              className={`flex-1 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                activeTab === 'inquiries'
                  ? 'bg-[#0B1E36] text-white shadow-sm'
                  : 'text-gray-700 hover:text-black'
              }`}
            >
              <span>Leads</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  activeTab === 'inquiries'
                    ? 'bg-white/20 text-white'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                {activeLeadsCount}
              </span>
            </button>

            <button
              onClick={() => {
                setActiveTab('projects');
                setActiveChip('All');
              }}
              className={`flex-1 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                activeTab === 'projects'
                  ? 'bg-[#0B1E36] text-white shadow-sm'
                  : 'text-gray-700 hover:text-black'
              }`}
            >
              <span>Projects</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  activeTab === 'projects'
                    ? 'bg-white/20 text-white'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                {convertedProjectsCount}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('followups')}
              className={`flex-1 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                activeTab === 'followups'
                  ? 'bg-[#0B1E36] text-white shadow-sm'
                  : 'text-gray-700 hover:text-black'
              }`}
            >
              <span>Follow-ups</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  activeTab === 'followups'
                    ? 'bg-white/20 text-white'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                {followupsTotalCount}
              </span>
            </button>
          </div>
        </div>

        {/* Secondary Stage Pills: All 14 · New 3 · Follow-up 5 · Quotation 4 (Image 2) */}
        {activeTab === 'inquiries' && (
          <div className="px-4 mt-3 flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth">
            {[
              { id: 'All', label: 'All', count: activeLeadsCount },
              { id: 'New', label: 'New', count: newLeadsCount },
              { id: 'Follow-up', label: 'Follow-up', count: followupLeadsCount },
              { id: 'Quotation', label: 'Quotation', count: quotationLeadsCount },
            ].map((pill) => {
              const isSelected = activeChip === pill.id;
              return (
                <button
                  key={pill.id}
                  onClick={() => setActiveChip(pill.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 shrink-0 transition cursor-pointer border ${
                    isSelected
                      ? 'bg-[#0B1E36] text-white border-[#0B1E36] shadow-xs'
                      : 'bg-white text-gray-700 border-gray-200/90 hover:bg-gray-50'
                  }`}
                >
                  <span>{pill.label}</span>
                  <span
                    className={`text-[10px] font-bold ${
                      isSelected ? 'text-white/80' : 'text-gray-500'
                    }`}
                  >
                    {pill.count}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {/* Active Filter Badges Row: Only shown when filters are genuinely active */}
        {hasAnyActiveFilters && (
          <div className="px-4 mt-3 flex items-center justify-between">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] font-medium text-gray-500">Filters</span>

              {selectedTeamMember !== 'all' && (
                <button
                  onClick={() => setSelectedTeamMember('all')}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-semibold bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A] transition cursor-pointer"
                >
                  <span>{selectedTeamMember}</span>
                  <span className="text-xs font-bold leading-none">×</span>
                </button>
              )}

              {isOverdueOnly && (
                <button
                  onClick={() => setIsOverdueOnly(false)}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-semibold bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A] transition cursor-pointer"
                >
                  <span>Overdue</span>
                  <span className="text-xs font-bold leading-none">×</span>
                </button>
              )}

              {capacityFilter !== 'all' && (
                <button
                  onClick={() => setCapacityFilter('all')}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-semibold bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A] transition cursor-pointer"
                >
                  <span>{capacityFilter === '<5' ? '< 5 kW' : capacityFilter === '5-10' ? '5-10 kW' : '> 10 kW'}</span>
                  <span className="text-xs font-bold leading-none">×</span>
                </button>
              )}

              {activeChip !== 'All' && (
                <button
                  onClick={() => setActiveChip('All')}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-semibold bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A] transition cursor-pointer"
                >
                  <span>{activeChip}</span>
                  <span className="text-xs font-bold leading-none">×</span>
                </button>
              )}

              {searchQuery.trim() && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-semibold bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A] transition cursor-pointer max-w-[150px] truncate"
                >
                  <span className="truncate">&quot;{searchQuery}&quot;</span>
                  <span className="text-xs font-bold leading-none">×</span>
                </button>
              )}
            </div>

            <button
              onClick={handleClearAllFilters}
              className="text-xs font-bold text-[#0B1E36] hover:underline transition cursor-pointer shrink-0"
            >
              Clear all
            </button>
          </div>
        )}

        {/* Count and Sort Row: 8 inquiries · Sort: Due date (v) (Image 2) */}
        <div className="px-4 mt-4 flex items-center justify-between text-xs">
          <span className="font-bold text-gray-900 text-sm">
            {activeTab === 'followups'
              ? `${filteredFollowups.length} follow-ups`
              : `${sortedInquiries.length} ${activeTab === 'inquiries' ? 'inquiries' : 'projects'}`}
          </span>

          <div className="flex items-center gap-1 text-gray-600 font-medium">
            <span>Sort:</span>
            <button
              onClick={() => setSelectedSort((prev) => (prev === 'due_date' ? 'newest' : 'due_date'))}
              className="font-semibold text-gray-800 flex items-center gap-0.5 hover:text-black transition cursor-pointer"
            >
              <span>{selectedSort === 'due_date' ? 'Due date' : 'Newest'}</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="m6 9 6 6 6-6" />
              </svg>
            </button>
          </div>
        </div>

        {/* Cards List: Clean Rounded Cards matching Image 2 */}
        <div className="px-4 mt-3 space-y-3">
          {activeTab === 'followups' ? (
            filteredFollowups.length === 0 ? (
              <div className="bg-white rounded-3xl p-8 text-center border border-gray-200/80 shadow-xs space-y-3">
                <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
                  <Clock className="w-6 h-6" />
                </div>
                <p className="text-xs font-semibold text-gray-700">
                  No follow-up logs recorded yet.
                </p>
              </div>
            ) : (
              filteredFollowups.map((f: any) => (
                <div
                  key={f.id}
                  onClick={() => router.push(`/inquiries/${f.inquiry?.followupId || f.inquiryId}`)}
                  className="bg-white rounded-2xl p-4 shadow-sm border border-gray-200/70 hover:shadow-md transition cursor-pointer space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#0B1E36]">
                      {f.inquiry?.followupId || 'Lead'} · {f.inquiry?.customerName || 'Customer'}
                    </span>
                    <span className="text-[10px] text-gray-500 font-medium">
                      {f.createdAt ? new Date(f.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : 'Recent'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-800 leading-relaxed">{f.description}</p>
                  <div className="flex items-center justify-between text-[11px] pt-1 text-gray-500 border-t border-gray-100">
                    <span>Logged by: <strong className="text-gray-700">{f.createdBy?.fullName || 'Salesperson'}</strong></span>
                    <span className="text-[#0B1E36] font-semibold flex items-center gap-0.5">
                      View Lead <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              ))
            )
          ) : sortedInquiries.length === 0 ? (
            <div className="bg-white rounded-3xl p-8 text-center border border-gray-200/80 shadow-xs space-y-3">
              <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
                <Users className="w-6 h-6" />
              </div>
              <p className="text-xs font-semibold text-gray-700">
                {activeTab === 'inquiries' && activeLeadsCount === 0 && convertedProjectsCount > 0
                  ? `0 active leads. You have ${convertedProjectsCount} converted project(s) in pipeline.`
                  : `No ${activeTab === 'inquiries' ? 'inquiries' : 'projects'} found matching the filter.`}
              </p>
              {activeTab === 'inquiries' && activeLeadsCount === 0 && convertedProjectsCount > 0 ? (
                <div className="flex items-center justify-center gap-2 pt-1">
                  <button
                    onClick={() => setActiveTab('projects')}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-[#0B1E36] text-white shadow-xs hover:bg-[#132d4e] transition"
                  >
                    <span>View Projects ({convertedProjectsCount})</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => router.push('/inquiries/new')}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-[#F59E0B] text-[#071326] shadow-xs hover:bg-[#D97706] transition"
                  >
                    <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>Add New Lead</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => router.push('/inquiries/new')}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-[#F59E0B] text-[#071326] shadow-xs hover:bg-[#D97706] transition"
                >
                  <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Add First Inquiry</span>
                </button>
              )}
            </div>
          ) : (
            sortedInquiries.map((inq) => {
              const statusMeta = computeStatusType(inq);
              const isClosed = statusMeta.type === 'closed';

              // Formatted Due Date matching Image 2 (e.g. "Due 22 Nov")
              const dueDateText = inq.createdAt
                ? `Due ${new Date(inq.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}`
                : 'Due today';

              const salespersonName = inq.assignedSalesperson?.fullName?.replace(/\s*\(Salesperson\)/i, '') || 'Amit';
              const salespersonInitials = salespersonName
                .split(' ')
                .map((n: string) => n[0])
                .join('')
                .slice(0, 2)
                .toUpperCase() || 'AM';

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
                  className="bg-white rounded-2xl p-4 shadow-sm border border-gray-200/70 hover:shadow-md transition cursor-pointer"
                >
                  {/* Top Row: FollowupId · Customer Name on left, Staff Avatar Pill on right */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h3 className="text-sm font-bold text-gray-900 tracking-tight leading-snug">
                        {inq.followupId || inq.id} · {inq.customerName}
                      </h3>
                      <p className="text-xs text-gray-500 font-normal mt-0.5">
                        {inq.requestedKw} kW {inq.meterPhase?.toLowerCase() || 'single phase'} · {inq.city || 'Vadodara'}
                      </p>
                    </div>

                    {/* Staff Pill (Image 2: Dark circular initials + Staff name) */}
                    <div className="flex items-center gap-1.5 shrink-0 bg-gray-50 px-2 py-1 rounded-full border border-gray-100">
                      <div className="w-5 h-5 rounded-full bg-[#071326] text-white text-[9px] font-bold flex items-center justify-center shrink-0">
                        {salespersonInitials}
                      </div>
                      <span className="text-[11px] font-semibold text-gray-700">
                        {salespersonName}
                      </span>
                    </div>
                  </div>

                  {/* Bottom Row: Status Tags on left, Due Date on right (Image 2) */}
                  <div className="flex items-center justify-between gap-2 mt-3 pt-2.5 border-t border-gray-100">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {/* Primary Stage Tag (Yellow) */}
                      <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A]">
                        {inq.currentStage === 'INQUIRY_RECEIVED'
                          ? 'Visit not done'
                          : inq.currentStage === 'QUOTATION_SENT'
                          ? 'Quotation sent'
                          : inq.currentStage === 'SITE_VISIT_PLANNED'
                          ? 'Site survey planned'
                          : statusMeta.text}
                      </span>

                      {/* Secondary Alert Tag (Red / Rose for Overdue) */}
                      {inq.isUrgent ? (
                        <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[#FEE2E2] text-[#991B1B] border border-[#FECACA]">
                          Overdue 2 days
                        </span>
                      ) : (
                        <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[#F3F4F6] text-gray-700 border border-gray-200">
                          On track
                        </span>
                      )}
                    </div>

                    <span className="text-[11px] font-medium text-gray-500 shrink-0">
                      {dueDateText}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Floating Add Inquiry Button on Bottom */}
        <div className="fixed bottom-20 right-4 z-40">
          <button
            onClick={() => router.push('/inquiries/new')}
            className="w-14 h-14 rounded-full bg-[#F59E0B] text-[#071326] shadow-xl flex items-center justify-center active:scale-95 hover:bg-[#D97706] transition cursor-pointer border-2 border-white"
            title="Add New Inquiry"
          >
            <Plus className="w-7 h-7 stroke-[2.5]" />
          </button>
        </div>
      </div>

      {/* ================================================================ */}
      {/* FILTER BOTTOM SHEET / MODAL                                     */}
      {/* ================================================================ */}
      {isFilterModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4 transition-all">
          <div
            className="w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl border border-gray-200 overflow-hidden max-h-[90vh] flex flex-col animate-in fade-in slide-in-from-bottom duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#0B1E36]/5 text-[#0B1E36] flex items-center justify-center">
                  <Filter className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-serif font-bold text-gray-900">Filter Inquiries</h3>
                  <p className="text-[11px] text-gray-500">Refine by staff, stage, priority, and capacity</p>
                </div>
              </div>
              <button
                onClick={() => setIsFilterModalOpen(false)}
                className="w-8 h-8 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center hover:bg-gray-200 transition text-sm font-bold cursor-pointer"
                aria-label="Close"
              >
                ×
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="p-6 overflow-y-auto space-y-5 text-xs text-gray-700">
              {/* 1. Filter by Staff / Salesperson */}
              <div>
                <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-2">
                  Assigned Staff
                </label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { id: 'all', label: 'All Team Members' },
                    { id: 'Amit', label: 'Amit' },
                    { id: 'Kunal', label: 'Kunal' },
                    { id: 'Priya', label: 'Priya' },
                  ].map((sp) => (
                    <button
                      key={sp.id}
                      onClick={() => setSelectedTeamMember(sp.id)}
                      className={`px-3.5 py-2 rounded-xl font-semibold border transition cursor-pointer ${
                        selectedTeamMember === sp.id
                          ? 'bg-[#0B1E36] text-white border-[#0B1E36] shadow-xs'
                          : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      {sp.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Filter by Stage / Chip */}
              <div>
                <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-2">
                  Inquiry Stage
                </label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { id: 'All', label: 'All Stages' },
                    { id: 'New', label: 'New Inquiries' },
                    { id: 'Follow-up', label: 'Site Visit / Follow-up' },
                    { id: 'Quotation', label: 'Quotation Sent' },
                    { id: 'Negotiation', label: 'Negotiation' },
                  ].map((stg) => (
                    <button
                      key={stg.id}
                      onClick={() => setActiveChip(stg.id)}
                      className={`px-3.5 py-2 rounded-xl font-semibold border transition cursor-pointer ${
                        activeChip === stg.id
                          ? 'bg-[#0B1E36] text-white border-[#0B1E36] shadow-xs'
                          : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      {stg.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. Priority & SLA */}
              <div>
                <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-2">
                  Priority & SLA
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setIsOverdueOnly(false)}
                    className={`flex-1 py-2.5 rounded-xl font-semibold border text-center transition cursor-pointer ${
                      !isOverdueOnly
                        ? 'bg-[#0B1E36] text-white border-[#0B1E36]'
                        : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    All Inquiries
                  </button>
                  <button
                    onClick={() => setIsOverdueOnly(true)}
                    className={`flex-1 py-2.5 rounded-xl font-semibold border text-center transition cursor-pointer flex items-center justify-center gap-1.5 ${
                      isOverdueOnly
                        ? 'bg-[#B91C1C] text-white border-[#B91C1C]'
                        : 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                    }`}
                  >
                    <span>Overdue Only</span>
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                  </button>
                </div>
              </div>

              {/* 4. Solar System Capacity */}
              <div>
                <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-2">
                  System Capacity
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { id: 'all', label: 'All' },
                    { id: '<5', label: '< 5 kW' },
                    { id: '5-10', label: '5-10 kW' },
                    { id: '>10', label: '> 10 kW' },
                  ].map((cap) => (
                    <button
                      key={cap.id}
                      onClick={() => setCapacityFilter(cap.id as any)}
                      className={`py-2 rounded-xl font-semibold border text-center transition cursor-pointer ${
                        capacityFilter === cap.id
                          ? 'bg-[#0B1E36] text-white border-[#0B1E36]'
                          : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      {cap.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 5. Sort Order */}
              <div>
                <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-2">
                  Sort Order
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setSelectedSort('due_date')}
                    className={`py-2 rounded-xl font-semibold border text-center transition cursor-pointer ${
                      selectedSort === 'due_date'
                        ? 'bg-[#0B1E36] text-white border-[#0B1E36]'
                        : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    Due Date / Urgency
                  </button>
                  <button
                    onClick={() => setSelectedSort('newest')}
                    className={`py-2 rounded-xl font-semibold border text-center transition cursor-pointer ${
                      selectedSort === 'newest'
                        ? 'bg-[#0B1E36] text-white border-[#0B1E36]'
                        : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    Newest First
                  </button>
                </div>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between gap-3">
              <button
                onClick={() => {
                  handleClearAllFilters();
                }}
                className="text-xs font-bold text-gray-600 hover:text-black transition cursor-pointer py-2.5 px-3"
              >
                Reset All
              </button>
              <button
                onClick={() => setIsFilterModalOpen(false)}
                className="px-6 py-2.5 rounded-xl text-xs font-bold bg-[#F59E0B] text-[#071326] shadow-md hover:bg-[#D97706] transition cursor-pointer"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================================================================ */}
      {/* DESKTOP LAYOUT (Retains existing desktop cards)                  */}
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