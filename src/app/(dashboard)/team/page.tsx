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
    <div className="min-h-screen bg-typhoon-sand pb-24">
      {/* 1. Header Matching Home Layout */}
      <Header
        role={user?.role || 'OPS_MANAGER'}
        initials={theme.tag}
        roleTitle="Control tower"
        subtitle="Team SLA commitments and daily task tracking"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-3 space-y-4">
        {/* 2. Summary Tiles Matching Home Layout */}
        <SummaryTiles
          tiles={[
            {
              icon: <Users className="w-4 h-4 text-typhoon-gold" />,
              value: String(teamMembers.length),
              label: 'Active team members',
            },
            {
              icon: <AlertCircle className="w-4 h-4 text-rose-600" />,
              value: '1',
              label: 'Overdue SLA delays',
            },
          ]}
        />

        {/* 3. Priority Card Matching Home Layout */}
        <PriorityCard
          role={user?.role || 'OPS_MANAGER'}
          icon={<Clock className="w-5 h-5 text-rose-600" />}
          title="SLA Delay · Amit Patel (Sales)"
          subtitle="Terrace survey for F-1024 is 2 hours overdue"
          badgeText="Overdue"
          onClick={() => {
            const member = teamMembers.find((m) => m.status === 'overdue');
            if (member) handleOpenLogModal(member);
          }}
        />

        {/* 4. Filter Chips Matching Home Style */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {['All', 'Sales', 'Portal', 'Material', 'Installation', 'Accounts'].map((chip) => {
            const isActive = chip === activeChip;
            return (
              <button
                key={chip}
                onClick={() => setActiveChip(chip)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
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

        {/* 5. Team Members List */}
        <div className="space-y-3">
          {filteredMembers.map((m) => (
            <div
              key={m.id}
              className="bg-white rounded-2xl p-4 sm:p-5 border border-typhoon-border shadow-soft space-y-3 hover:border-typhoon-gold/50 transition-all"
            >
              {/* Member Row */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-typhoon-navy text-typhoon-gold font-serif font-bold text-base flex items-center justify-center border-2 border-typhoon-gold/50 shadow-soft shrink-0">
                    {m.initials}
                  </div>
                  <div>
                    <h3 className="text-base font-serif font-bold text-typhoon-navy">
                      {m.name}
                    </h3>
                    <p className="text-xs text-typhoon-muted font-medium">
                      {m.role} · <span className="text-gray-700 font-semibold">{m.phone}</span>
                    </p>
                  </div>
                </div>

                <span
                  className={`text-xs font-bold px-3 py-1 rounded-full border shrink-0 ${getStatusBadge(
                    m.status,
                    m.dueLabel
                  )}`}
                >
                  {m.dueLabel}
                </span>
              </div>

              {/* Task Details */}
              <div className="p-3 bg-typhoon-sand/30 rounded-xl border border-typhoon-border/60 text-xs space-y-1">
                <div className="flex items-center justify-between text-typhoon-navy font-bold">
                  <span>Assigned Task:</span>
                  <button
                    onClick={() => router.push(`/inquiries/${m.inquiryCode}`)}
                    className="text-typhoon-gold-dark hover:underline flex items-center gap-1"
                  >
                    <span>{m.inquiryCode}</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
                <p className="text-gray-800 font-medium">{m.task}</p>
                <p className="text-typhoon-muted text-[11px] pt-1">
                  Latest Remarks: {m.notes}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                <span className="text-xs text-typhoon-muted font-semibold flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-typhoon-gold" />
                  Committed: <span className="text-typhoon-navy font-bold">{m.committedDate}</span>
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      const text = encodeURIComponent(
                        `Hi ${m.name}, this is Amit Kumar (Operations). Regarding ${m.inquiryCode}: what is the update on "${m.task}"?`
                      );
                      window.open(`https://wa.me/${m.phone.replace(/\D/g, '')}?text=${text}`, '_blank');
                    }}
                    className="py-1.5 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs border border-emerald-200 transition flex items-center gap-1 cursor-pointer"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </button>

                  <a
                    href={`tel:${m.phone.replace(/\D/g, '')}`}
                    className="py-1.5 px-3 rounded-xl bg-typhoon-sand hover:bg-typhoon-sand-dark text-typhoon-navy font-bold text-xs border border-typhoon-border transition flex items-center gap-1"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call</span>
                  </a>

                  <button
                    onClick={() => handleOpenLogModal(m)}
                    className="py-1.5 px-3 rounded-xl bg-typhoon-navy text-white font-bold text-xs hover:bg-typhoon-navy-light transition flex items-center gap-1 cursor-pointer"
                  >
                    <span>Update Task</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 6. Sticky Main Action Button Matching Home Layout */}
        <div className="pt-2">
          <MainButton
            role={user?.role || 'OPS_MANAGER'}
            icon={<MessageSquare className="w-4 h-4" />}
            onClick={() => {
              setSelectedMember(teamMembers[0]);
              setIsLogModalOpen(true);
            }}
          >
            Log a team follow-up
          </MainButton>
        </div>
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
                className="w-8 h-8 rounded-full bg-typhoon-sand flex items-center justify-center text-typhoon-navy hover:bg-typhoon-sand-dark"
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
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-typhoon-navy hover:bg-typhoon-sand transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-typhoon-gold hover:bg-typhoon-gold-dark text-typhoon-navy font-bold text-xs shadow-soft transition flex items-center gap-1.5"
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
