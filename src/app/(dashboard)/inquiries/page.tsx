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
} from 'lucide-react';
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

  // Fallback default inquiries matching Screen 1 from PDF
  const defaultInquiries = [
    {
      id: 'f-1024',
      followupId: 'F-1024',
      customerName: 'Ramesh Patel',
      customerPhone: '9825012345',
      requestedKw: '6.0',
      meterPhase: 'single phase',
      currentStage: 'SITE_VISIT_PLANNED',
      isUrgent: true,
      assignedSalesperson: { fullName: 'Amit' },
      statusBadge: 'Urgent',
      statusType: 'urgent',
      subtitle: '6 kW single phase · with Amit',
    },
    {
      id: 'f-1023',
      followupId: 'F-1023',
      customerName: 'Hetal Shah',
      customerPhone: '9825023456',
      requestedKw: '4.0',
      meterPhase: 'single phase',
      currentStage: 'QUOTATION_SENT',
      isUrgent: false,
      assignedSalesperson: { fullName: 'Kunal' },
      statusBadge: 'Quotation',
      statusType: 'quotation',
      subtitle: 'Quotation sent · due in 2 days',
    },
    {
      id: 'f-1022',
      followupId: 'F-1022',
      customerName: 'Nilesh Desai',
      customerPhone: '9825034567',
      requestedKw: '6.0',
      meterPhase: 'three phase',
      currentStage: 'INQUIRY_RECEIVED',
      isUrgent: false,
      assignedSalesperson: null,
      statusBadge: 'New',
      statusType: 'new',
      subtitle: 'Not assigned yet',
    },
    {
      id: 'f-1021',
      followupId: 'F-1021',
      customerName: 'Kiran Mehta',
      customerPhone: '9825045678',
      requestedKw: '5.0',
      meterPhase: 'single phase',
      currentStage: 'QUOTATION_SENT',
      isUrgent: false,
      assignedSalesperson: { fullName: 'Amit' },
      statusBadge: 'Today',
      statusType: 'today',
      subtitle: 'Negotiation · follow-up today',
    },
    {
      id: 'f-1018',
      followupId: 'F-1018',
      customerName: 'Bhavna Joshi',
      customerPhone: '9825056789',
      requestedKw: '3.24',
      meterPhase: 'single phase',
      currentStage: 'DEAL_CLOSED',
      isUrgent: false,
      assignedSalesperson: { fullName: 'Priya' },
      statusBadge: 'Closed',
      statusType: 'closed',
      subtitle: 'Deal closed · documents pending',
    },
  ];

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
        if (Array.isArray(list) && list.length > 0) {
          setInquiries(list);
        } else {
          setInquiries(defaultInquiries);
        }
      })
      .catch(() => {
        setInquiries(defaultInquiries);
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

  // Get status badge style matching Screen 1 from PDF
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

  return (
    <div className="min-h-screen bg-typhoon-sand pb-32">
      {/* 1. Curved Header with User Role Colors Matching Screen 1 */}
      <div
        style={{ backgroundColor: theme.hex.headerBg }}
        className="pt-6 pb-12 px-5 rounded-b-[36px] shadow-sm relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 border border-white/5 rounded-full pointer-events-none -mr-16 -mt-16" />
        <div className="absolute top-0 right-0 w-44 h-44 border border-white/5 rounded-full pointer-events-none -mr-8 -mt-8" />

        <div className="max-w-xl mx-auto">
          <span className="text-[11px] font-bold tracking-widest text-typhoon-gold uppercase block mb-1">
            {user?.role === 'SALESPERSON' ? 'SALES REPRESENTATIVE' : 'OPERATIONS MANAGER'}
          </span>
          <h1 className="text-3xl font-serif font-bold text-white tracking-tight">
            Inquiries
          </h1>
          <p className="text-xs text-white/70 mt-1 font-medium">
            All leads and their stages
          </p>
        </div>
      </div>

      {/* 2. Main Content Container */}
      <div className="max-w-xl mx-auto px-4 -mt-5 space-y-3.5">
        {/* Search Bar Matching Screen 1 */}
        <div className="relative">
          <Search className="w-5 h-5 text-typhoon-muted absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search name, phone or ID"
            className="w-full pl-12 pr-4 py-3.5 bg-white rounded-2xl text-sm font-medium text-typhoon-navy border border-typhoon-border shadow-soft focus:outline-none focus:border-typhoon-gold transition"
          />
        </div>

        {/* Primary View Switcher: Inquiries vs Projects vs Followups Tracker */}
        <div className="bg-white p-1 rounded-2xl border border-typhoon-border shadow-soft flex gap-1">
          <button
            onClick={() => {
              setActiveTab('inquiries');
              setActiveChip('All');
            }}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'inquiries'
                ? 'bg-typhoon-navy text-white shadow-soft'
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
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'projects'
                ? 'bg-typhoon-navy text-white shadow-soft'
                : 'text-typhoon-muted hover:text-typhoon-navy'
            }`}
          >
            Projects (Closed)
          </button>

          <button
            onClick={() => setActiveTab('followups')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'followups'
                ? 'bg-typhoon-navy text-white shadow-soft'
                : 'text-typhoon-muted hover:text-typhoon-navy'
            }`}
          >
            Follow-ups
          </button>
        </div>

        {/* Team Member Filter Strip (For Operations Manager) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
          <span className="text-typhoon-muted font-bold text-[11px] whitespace-nowrap pl-1">
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

        {/* Secondary Filter Chips Matching Screen 1 (All, New, Follow-up, Quotation, Negotiation) */}
        {activeTab === 'inquiries' && (
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {['All', 'New', 'Follow-up', 'Quotation', 'Negotiation'].map((chip) => {
              const isActive = activeChip === chip;
              return (
                <button
                  key={chip}
                  onClick={() => setActiveChip(chip)}
                  className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? 'bg-typhoon-navy text-white shadow-soft'
                      : 'bg-white text-typhoon-navy border border-typhoon-border hover:bg-typhoon-sand'
                  }`}
                >
                  {chip}
                </button>
              );
            })}
          </div>
        )}

        {/* ============================================================== */}
        {/* VIEW 1 & 2: INQUIRIES & CONVERTED PROJECTS LIST (Screen 1 UI)  */}
        {/* ============================================================== */}
        {activeTab !== 'followups' && (
          <div className="space-y-2">
            {/* White Rounded Container Matching Screen 1 */}
            <div className="bg-white rounded-2xl border border-typhoon-border shadow-soft divide-y divide-typhoon-border/60 overflow-hidden">
              {filteredInquiries.length === 0 ? (
                <div className="p-8 text-center text-xs text-typhoon-muted">
                  No {activeTab === 'inquiries' ? 'inquiries' : 'projects'} found matching the filter.
                </div>
              ) : (
                filteredInquiries.map((inq) => {
                  const statusMeta = computeStatusType(inq);
                  const isClosed = statusMeta.type === 'closed';
                  const subtitle =
                    inq.subtitle ||
                    `${inq.requestedKw} kW ${inq.meterPhase || 'Single Phase'} · ${
                      inq.assignedSalesperson?.fullName ? `with ${inq.assignedSalesperson.fullName}` : 'Not assigned yet'
                    }`;

                  return (
                    <div
                      key={inq.id}
                      onClick={() => router.push(`/inquiries/${inq.followupId || inq.id}`)}
                      className="p-4 flex items-center justify-between cursor-pointer hover:bg-typhoon-sand/40 transition-colors"
                    >
                      {/* Left: User Icon in Rounded Box */}
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div
                          className={`w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 ${
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

                        {/* Middle: Title & Subtitle */}
                        <div className="truncate">
                          <h3 className="text-sm font-bold text-typhoon-navy truncate">
                            {inq.customerName} ·{' '}
                            <span className="font-semibold text-gray-700">
                              {inq.followupId || inq.id}
                            </span>
                          </h3>
                          <p className="text-xs text-typhoon-muted truncate mt-0.5">
                            {subtitle}
                          </p>
                        </div>
                      </div>

                      {/* Right: Badge & Chevron */}
                      <div className="flex items-center gap-2 flex-shrink-0 ml-2">
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
              )}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* VIEW 3: OPERATIONS MANAGER FOLLOW-UPS AUDIT TRACKER            */}
        {/* ============================================================== */}
        {activeTab === 'followups' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-bold tracking-widest text-typhoon-muted uppercase">
                STAFF FOLLOW-UP AUDIT LOGS
              </span>
              <span className="text-xs text-typhoon-muted">
                {filteredFollowups.length} logs recorded
              </span>
            </div>

            <div className="bg-white rounded-2xl border border-typhoon-border shadow-soft divide-y divide-typhoon-border/60 overflow-hidden">
              {filteredFollowups.length === 0 ? (
                <div className="p-8 text-center text-xs text-typhoon-muted">
                  No follow-up updates recorded for the selected staff member.
                </div>
              ) : (
                filteredFollowups.map((f: any) => (
                  <div
                    key={f.id}
                    onClick={() => router.push(`/inquiries/${f.inquiry?.followupId || f.inquiryId}`)}
                    className="p-4 hover:bg-typhoon-sand/30 transition-colors cursor-pointer space-y-2"
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
                      <span className="truncate">Next: {f.nextStep || 'Follow-up'}</span>
                      <span className="shrink-0 text-typhoon-navy font-semibold">
                        {f.committedDate ? new Date(f.committedDate).toLocaleDateString() : 'Active'}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Bottom Sunlight Gold Button: + Add inquiry Matching Screen 1 */}
        <div className="pt-2">
          <button
            onClick={() => router.push('/inquiries/new')}
            className="w-full py-4 px-6 rounded-2xl bg-typhoon-gold hover:bg-typhoon-gold-dark text-typhoon-navy font-bold text-base shadow-soft flex items-center justify-center gap-2 transition cursor-pointer"
          >
            <Plus className="w-5 h-5 stroke-[2.5]" />
            <span>Add inquiry</span>
          </button>
        </div>
      </div>
    </div>
  );
}