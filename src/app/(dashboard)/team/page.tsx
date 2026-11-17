'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Users,
  Clock,
  AlertCircle,
  CheckCircle2,
  Phone,
  MessageSquare,
  ExternalLink,
  ChevronRight,
  ShieldAlert,
  Send,
  X,
  Plus,
  AlertTriangle,
  Briefcase,
  Layers,
} from 'lucide-react';
import { Header } from '@/components/Header';
import { SummaryTiles } from '@/components/SummaryTiles';
import { PriorityCard } from '@/components/PriorityCard';
import { MainButton } from '@/components/MainButton';
import { useCurrentUser } from '@/lib/use-current-user';
import { toast } from 'sonner';

interface TeamMember {
  id: string;
  initials: string;
  name: string;
  role: string;
  department: 'Sales' | 'Portal' | 'Material' | 'Installation' | 'Accounts';
  phone: string;
  task: string;
  inquiryCode: string;
  committedDate: string;
  dueLabel: string;
  status: 'overdue' | 'today' | 'on_track';
  notes: string;
}

export default function TeamTrackerPage() {
  const router = useRouter();
  const { user, theme } = useCurrentUser();
  const [activeChip, setActiveChip] = useState('All');
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [logNotes, setLogNotes] = useState('');
  const [logNextDate, setLogNextDate] = useState('Today 5:00 PM');

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token || token === 'null' || token === 'undefined') {
      localStorage.clear();
      router.push('/');
    }
  }, [router]);

  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    {
      id: '1',
      initials: 'AP',
      name: 'Amit Patel',
      role: 'Sales Representative',
      department: 'Sales',
      phone: '+91 90000 00002',
      task: 'Terrace site survey & shadow analysis for F-1024',
      inquiryCode: 'F-1024',
      committedDate: 'Today 11:00 AM',
      dueLabel: 'Overdue (2h)',
      status: 'overdue',
      notes: 'Customer inquired about PM Surya Ghar ₹78,000 subsidy eligibility. Terrace shadow cleared. Requested site visit.',
    },
    {
      id: '2',
      initials: 'KJ',
      name: 'Kunal Joshi',
      role: 'Senior Sales Rep',
      department: 'Sales',
      phone: '+91 90000 00007',
      task: 'Quotation revision with 10-yr warranty for F-1021',
      inquiryCode: 'F-1021',
      committedDate: 'Today 3:30 PM',
      dueLabel: 'Due Today',
      status: 'today',
      notes: 'Quotation sent for 6.0 kW Three Phase (₹2,75,000). Customer asked for 10-year inverter warranty clause.',
    },
    {
      id: '3',
      initials: 'RP',
      name: 'Rahul Patel',
      role: 'Govt Portal Officer',
      department: 'Portal',
      phone: '+91 90000 00003',
      task: 'Upload KYC Aadhaar & Light Bill for F-1018',
      inquiryCode: 'F-1018',
      committedDate: 'Today 5:00 PM',
      dueLabel: 'Due Today',
      status: 'today',
      notes: 'Waiting for property tax bill from customer father. Need to generate MGVCL Service Request (SR) number.',
    },
    {
      id: '4',
      initials: 'SK',
      name: 'Sohail Khan',
      role: 'Store & Logistics Lead',
      department: 'Material',
      phone: '+91 90000 00004',
      task: 'Truck dispatch for 10 kW BOM materials (F-1015)',
      inquiryCode: 'F-1015',
      committedDate: 'Tomorrow 9:00 AM',
      dueLabel: 'Tomorrow',
      status: 'on_track',
      notes: '18 panels (550W DCR) and 10 kW Growatt inverter staged in warehouse. Driver assigned.',
    },
    {
      id: '5',
      initials: 'RK',
      name: 'Rajesh Kumar',
      role: 'Installation Lead',
      department: 'Installation',
      phone: '+91 90000 00006',
      task: 'Superstructure column grouting & ACDB wiring (F-1012)',
      inquiryCode: 'F-1012',
      committedDate: '15 Nov 2026',
      dueLabel: '3 days',
      status: 'on_track',
      notes: 'Structure fabrication completed. Earthing pits tested. Awaiting meter file submission.',
    },
    {
      id: '6',
      initials: 'MS',
      name: 'Meera Shah',
      role: 'Accounts & Finance Lead',
      department: 'Accounts',
      phone: '+91 90000 00008',
      task: 'Collect 80% terrace unload payment (F-1015)',
      inquiryCode: 'F-1015',
      committedDate: 'Tomorrow 12:00 PM',
      dueLabel: 'Tomorrow',
      status: 'on_track',
      notes: 'Milestone demand note sent via WhatsApp. HDFC Bank cheque promised upon truck unloading.',
    },
  ]);

  const filteredMembers = teamMembers.filter((m) => {
    if (activeChip === 'All') return true;
    return m.department === activeChip;
  });

  const getStatusBadge = (status: string, label: string) => {
    switch (status) {
      case 'overdue':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'today':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      default:
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
    }
  };

  const handleOpenLogModal = (member: TeamMember) => {
    setSelectedMember(member);
    setLogNotes('');
    setIsLogModalOpen(true);
  };

  const handleSaveTeamFollowup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!logNotes.trim()) {
      toast.error('Please enter team remarks or updated status.');
      return;
    }

    if (selectedMember) {
      setTeamMembers((prev) =>
        prev.map((m) =>
          m.id === selectedMember.id
            ? { ...m, notes: logNotes, committedDate: logNextDate, status: 'on_track', dueLabel: 'Followed Up' }
            : m
        )
      );
      toast.success(`Follow-up saved for ${selectedMember.name}!`);
    }
    setIsLogModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-typhoon-sand">
      {/* ================================================================ */}
      {/* DESKTOP LAYOUT (Web Screen Layout - Wide 12-Column Grid)        */}
      {/* ================================================================ */}
      <div className="hidden lg:block max-w-7xl mx-auto px-6 py-8 space-y-6">
        {/* Top Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-serif font-bold text-typhoon-navy tracking-tight">
              Control Tower · Team SLA Tracker
            </h1>
            <p className="text-xs text-typhoon-muted mt-1">
              Active staff task deadlines, department commitments & SLA delay monitoring
            </p>
          </div>
          <button
            onClick={() => {
              setSelectedMember(teamMembers[0]);
              setIsLogModalOpen(true);
            }}
            className="bg-typhoon-gold text-typhoon-navy font-bold px-5 py-2.5 rounded-xl text-xs hover:bg-typhoon-gold-dark transition shadow-soft flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Log Staff Follow-up</span>
          </button>
        </div>

        {/* 4 Summary Tiles Across */}
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl border border-typhoon-border shadow-soft p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-typhoon-sand flex items-center justify-center text-typhoon-navy">
              <Users className="w-6 h-6 text-typhoon-gold" />
            </div>
            <div>
              <span className="text-2xl font-serif font-bold text-typhoon-navy block leading-none">
                {teamMembers.length}
              </span>
              <span className="text-xs text-typhoon-muted font-medium mt-1 block">Active Staff</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-typhoon-border shadow-soft p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600">
              <AlertTriangle className="w-6 h-6 text-rose-600" />
            </div>
            <div>
              <span className="text-2xl font-serif font-bold text-rose-700 block leading-none">1</span>
              <span className="text-xs text-rose-600 font-medium mt-1 block">Overdue SLA (&gt;2h)</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-typhoon-border shadow-soft p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
              <Clock className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <span className="text-2xl font-serif font-bold text-typhoon-navy block leading-none">2</span>
              <span className="text-xs text-typhoon-muted font-medium mt-1 block">Due Today</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-typhoon-border shadow-soft p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
              <CheckCircle2 className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <span className="text-2xl font-serif font-bold text-typhoon-navy block leading-none">3</span>
              <span className="text-xs text-typhoon-muted font-medium mt-1 block">On Track</span>
            </div>
          </div>
        </div>

        {/* 12-Column Split: 8-cols Main Table, 4-cols Side Panel */}
        <div className="grid grid-cols-12 gap-6 items-start">
          {/* Main Table (8 Cols) */}
          <div className="col-span-8 space-y-4">
            {/* Filter Chips */}
            <div className="flex gap-2">
              {['All', 'Sales', 'Portal', 'Material', 'Installation', 'Accounts'].map((chip) => {
                const isActive = chip === activeChip;
                return (
                  <button
                    key={chip}
                    onClick={() => setActiveChip(chip)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
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

            {/* Desktop Table Container */}
            <div className="bg-white rounded-2xl border border-typhoon-border shadow-soft overflow-hidden">
              <div className="px-6 py-4 border-b border-typhoon-border/80 flex items-center justify-between">
                <h3 className="text-sm font-bold tracking-widest text-typhoon-muted uppercase">
                  ACTIVE SLA COMMITMENTS ({filteredMembers.length})
                </h3>
                <span className="text-xs text-typhoon-muted">Sorted by Urgency</span>
              </div>

              <div className="divide-y divide-typhoon-border/60">
                {filteredMembers.map((m) => (
                  <div key={m.id} className="p-5 hover:bg-typhoon-sand/30 transition-colors">
                    <div className="flex items-start justify-between gap-4">
                      {/* Left: Staff Avatar & Info */}
                      <div className="flex items-center gap-3.5 min-w-[200px]">
                        <div className="w-11 h-11 rounded-xl bg-typhoon-navy text-typhoon-gold font-serif font-bold text-sm flex items-center justify-center border border-typhoon-gold/40 shadow-soft shrink-0">
                          {m.initials}
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-typhoon-navy">{m.name}</h4>
                          <p className="text-xs text-typhoon-muted font-medium">
                            {m.role} · <span className="text-gray-700">{m.phone}</span>
                          </p>
                        </div>
                      </div>

                      {/* Middle: Task & Project */}
                      <div className="flex-1 min-w-0 px-2">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="px-2 py-0.5 rounded-md bg-typhoon-sand text-typhoon-navy font-bold text-[11px] border border-typhoon-border">
                            {m.inquiryCode}
                          </span>
                          <span className="text-xs font-bold text-typhoon-navy truncate">
                            {m.task}
                          </span>
                        </div>
                        <p className="text-xs text-typhoon-muted truncate">
                          Remarks: {m.notes}
                        </p>
                      </div>

                      {/* Right: Deadline & Badge */}
                      <div className="text-right shrink-0 min-w-[130px]">
                        <span
                          className={`inline-block text-xs font-bold px-3 py-1 rounded-full border mb-1.5 ${getStatusBadge(
                            m.status,
                            m.dueLabel
                          )}`}
                        >
                          {m.dueLabel}
                        </span>
                        <p className="text-[11px] text-typhoon-muted font-medium">
                          {m.committedDate}
                        </p>
                      </div>
                    </div>

                    {/* Action Bar */}
                    <div className="flex items-center justify-end gap-2 pt-3 mt-3 border-t border-typhoon-border/40">
                      <button
                        onClick={() => {
                          const text = encodeURIComponent(
                            `Hi ${m.name}, regarding ${m.inquiryCode}: what is the update on "${m.task}"?`
                          );
                          window.open(`https://wa.me/${m.phone.replace(/\D/g, '')}?text=${text}`, '_blank');
                        }}
                        className="py-1 px-3 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs border border-emerald-200 transition flex items-center gap-1.5 cursor-pointer"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>WhatsApp</span>
                      </button>

                      <a
                        href={`tel:${m.phone.replace(/\D/g, '')}`}
                        className="py-1 px-3 rounded-lg bg-typhoon-sand hover:bg-typhoon-sand-dark text-typhoon-navy font-bold text-xs border border-typhoon-border transition flex items-center gap-1.5"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>Call</span>
                      </a>

                      <button
                        onClick={() => handleOpenLogModal(m)}
                        className="py-1 px-3.5 rounded-lg bg-typhoon-navy text-white font-bold text-xs hover:bg-typhoon-navy-light transition flex items-center gap-1.5 cursor-pointer"
                      >
                        <span>Update Task</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Panel (4 Cols) */}
          <div className="col-span-4 space-y-4">
            {/* Escalation Card */}
            <div className="bg-white rounded-2xl border border-rose-200 shadow-soft p-5 space-y-3 bg-gradient-to-br from-white to-rose-50/40">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold tracking-widest text-rose-600 uppercase">
                  URGENT SLA ESCALATION
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800">
                  2h Overdue
                </span>
              </div>
              <h4 className="text-base font-serif font-bold text-typhoon-navy">
                Amit Patel · Site Survey F-1024
              </h4>
              <p className="text-xs text-typhoon-muted">
                Terrace shadow analysis is overdue. Customer awaiting subsidy eligibility confirmation.
              </p>
              <button
                onClick={() => {
                  const m = teamMembers.find((item) => item.status === 'overdue');
                  if (m) handleOpenLogModal(m);
                }}
                className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Clock className="w-3.5 h-3.5" />
                <span>Intervene & Unblock SLA</span>
              </button>
            </div>

            {/* Department Breakdown */}
            <div className="bg-white rounded-2xl border border-typhoon-border shadow-soft p-5 space-y-3">
              <h4 className="text-xs font-bold tracking-widest text-typhoon-muted uppercase">
                DEPARTMENT LOAD
              </h4>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center py-1 border-b border-typhoon-border/40">
                  <span className="font-semibold text-typhoon-navy">Sales & Survey</span>
                  <span className="font-bold text-typhoon-navy">2 active</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-typhoon-border/40">
                  <span className="font-semibold text-typhoon-navy">Govt DISCOM Portal</span>
                  <span className="font-bold text-typhoon-navy">1 active</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-typhoon-border/40">
                  <span className="font-semibold text-typhoon-navy">Material & Logistics</span>
                  <span className="font-bold text-typhoon-navy">1 active</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-typhoon-border/40">
                  <span className="font-semibold text-typhoon-navy">Rooftop Installation</span>
                  <span className="font-bold text-typhoon-navy">1 active</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="font-semibold text-typhoon-navy">Accounts & Finance</span>
                  <span className="font-bold text-typhoon-navy">1 active</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================================================================ */}
      {/* MOBILE LAYOUT (Follows Standard Screen Layout - Matches Home)   */}
      {/* ================================================================ */}
      <div className="lg:hidden pb-12">
        {/* Item 1: Control Tower Midnight Navy & Sunlight Gold Header */}
        <Header
          role={user?.role || 'OPS_MANAGER'}
          initials={theme.tag}
          roleTitle="Control tower"
          subtitle="Team SLA commitments and daily task tracking"
        />

        {/* Item 2: Two summary tiles overlapping header (-mt-10) */}
        <SummaryTiles
          tiles={[
            {
              icon: <Users className="w-4 h-4 text-typhoon-gold" />,
              value: String(teamMembers.length),
              label: 'Active staff',
            },
            {
              icon: <AlertCircle className="w-4 h-4 text-rose-600" />,
              value: '1',
              label: 'Overdue SLA',
            },
          ]}
        />

        {/* Item 3: Priority Card (Midnight Navy with Gold badge) */}
        <PriorityCard
          role={user?.role || 'OPS_MANAGER'}
          icon={<Clock className="w-5 h-5 text-rose-600" />}
          title="SLA delay · Amit Patel (Sales)"
          subtitle="Terrace survey for F-1024 is 2 hours overdue"
          badgeText="Overdue"
          onClick={() => {
            const member = teamMembers.find((m) => m.status === 'overdue');
            if (member) handleOpenLogModal(member);
          }}
        />

        {/* Item 4: Scrollable filter chips */}
        <div className="px-4 my-3 flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {['All', 'Sales', 'Portal', 'Material', 'Installation', 'Accounts'].map((chip) => {
            const isActive = chip === activeChip;
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
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
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

        {/* Item 5: Team SLA Commitments List (Matches UpNextList structure) */}
        <div className="px-4 my-3">
          <div className="bg-typhoon-card rounded-2xl p-4 shadow-soft border border-typhoon-border">
            <h4 className="text-xs font-bold tracking-widest text-typhoon-muted uppercase mb-3">
              TEAM SLA COMMITMENTS
            </h4>

            <div className="divide-y divide-typhoon-border/60">
              {filteredMembers.map((m) => (
                <div
                  key={m.id}
                  className="py-3 hover:bg-typhoon-sand/40 -mx-2 px-2 rounded-xl transition-colors space-y-2"
                >
                  <div
                    onClick={() => handleOpenLogModal(m)}
                    className="flex items-center justify-between cursor-pointer"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-typhoon-navy text-typhoon-gold font-bold text-xs flex items-center justify-center flex-shrink-0">
                        {m.initials}
                      </div>
                      <div className="truncate">
                        <p className="text-sm font-bold text-typhoon-navy truncate">
                          {m.name} · <span className="text-typhoon-gold-dark">{m.inquiryCode}</span>
                        </p>
                        <p className="text-xs text-typhoon-muted truncate mt-0.5">
                          {m.task}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                      <span
                        className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${getStatusBadge(
                          m.status,
                          m.dueLabel
                        )}`}
                      >
                        {m.dueLabel}
                      </span>
                      <ChevronRight className="w-4 h-4 text-typhoon-muted" />
                    </div>
                  </div>

                  {/* Micro action strip for mobile */}
                  <div className="flex items-center justify-between pl-12 pr-1 pt-1 text-xs">
                    <span className="text-[11px] text-typhoon-muted flex items-center gap-1 font-medium">
                      <Clock className="w-3 h-3 text-typhoon-gold" />
                      <span>{m.committedDate}</span>
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          const text = encodeURIComponent(
                            `Hi ${m.name}, regarding ${m.inquiryCode}: what is the update on "${m.task}"?`
                          );
                          window.open(`https://wa.me/${m.phone.replace(/\D/g, '')}?text=${text}`, '_blank');
                        }}
                        className="p-1 px-2.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-[11px] border border-emerald-200 transition flex items-center gap-1 cursor-pointer"
                      >
                        <MessageSquare className="w-3 h-3" />
                        <span>WhatsApp</span>
                      </button>

                      <a
                        href={`tel:${m.phone.replace(/\D/g, '')}`}
                        onClick={(e) => e.stopPropagation()}
                        className="p-1 px-2.5 rounded-lg bg-typhoon-sand hover:bg-typhoon-sand-dark text-typhoon-navy font-bold text-[11px] border border-typhoon-border transition flex items-center gap-1"
                      >
                        <Phone className="w-3 h-3" />
                        <span>Call</span>
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Item 6: Main Action (Sunlight Gold button) */}
        <MainButton
          role={user?.role || 'OPS_MANAGER'}
          icon={<MessageSquare className="w-4 h-4" />}
          onClick={() => {
            setSelectedMember(teamMembers[0]);
            setIsLogModalOpen(true);
          }}
        >
          Log team follow-up
        </MainButton>
      </div>

      {/* Team Follow-up Modal */}
      {isLogModalOpen && selectedMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-floating border border-typhoon-border space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-typhoon-border">
              <div>
                <span className="text-[10px] font-bold tracking-widest text-typhoon-gold uppercase block">
                  STAFF TASK ESCALATION & REMARKS
                </span>
                <h3 className="text-lg font-serif font-bold text-typhoon-navy">
                  Update {selectedMember.name}
                </h3>
              </div>
              <button
                onClick={() => setIsLogModalOpen(false)}
                className="w-8 h-8 rounded-full bg-typhoon-sand flex items-center justify-center text-typhoon-navy hover:bg-typhoon-sand-dark cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveTeamFollowup} className="space-y-3.5">
              <div>
                <label className="text-xs font-semibold text-typhoon-navy block mb-1">
                  Active Task: {selectedMember.task}
                </label>
                <p className="text-[11px] text-typhoon-muted mb-2">
                  Project: {selectedMember.inquiryCode} · Department: {selectedMember.department}
                </p>
                <textarea
                  rows={3}
                  value={logNotes}
                  onChange={(e) => setLogNotes(e.target.value)}
                  placeholder="Enter call remarks, updated commitment, or SLA unblocking notes..."
                  className="w-full px-3.5 py-2.5 bg-typhoon-sand/30 border border-typhoon-border rounded-xl text-xs font-medium text-typhoon-navy focus:border-typhoon-gold focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-typhoon-navy block mb-1">
                  New Committed Deadline
                </label>
                <input
                  type="text"
                  value={logNextDate}
                  onChange={(e) => setLogNextDate(e.target.value)}
                  placeholder="e.g. Today 5:00 PM"
                  className="w-full px-3 py-2 bg-typhoon-sand/30 border border-typhoon-border rounded-xl text-xs font-medium text-typhoon-navy focus:outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsLogModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-typhoon-navy hover:bg-typhoon-sand transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-typhoon-gold hover:bg-typhoon-gold-dark text-typhoon-navy font-bold text-xs shadow-soft transition flex items-center gap-1.5 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Save Team Update</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}