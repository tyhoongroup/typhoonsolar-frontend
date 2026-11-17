'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Clock,
  Filter,
  Search,
  User,
  Plus,
  CheckCircle2,
  AlertCircle,
  Phone,
  ChevronRight,
  Layers,
  Calendar,
} from 'lucide-react';
import { Header } from '@/components/Header';
import { SummaryTiles } from '@/components/SummaryTiles';
import { PriorityCard } from '@/components/PriorityCard';
import { FollowUpModal } from '@/components/FollowUpModal';
import { useCurrentUser } from '@/lib/use-current-user';
import { toast } from 'sonner';

export default function FollowupsControlTowerPage() {
  const router = useRouter();
  const { user, theme } = useCurrentUser();

  const [followups, setFollowups] = useState<any[]>([]);
  const [salespersons, setSalespersons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [stageFilter, setStageFilter] = useState('all');
  const [personFilter, setPersonFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState<'all' | 'inquiry' | 'project'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Universal Followup Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedInquiryId, setSelectedInquiryId] = useState<string | undefined>(undefined);

  const loadData = () => {
    const token = localStorage.getItem('accessToken');
    if (!token || token === 'null' || token === 'undefined') {
      localStorage.clear();
      router.push('/');
      return;
    }

    setLoading(true);

    // 1. Fetch salespersons for filter dropdown
    fetch('/api/v1/inquiries/salespersons', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        const list = Array.isArray(data) ? data : (data?.data || []);
        if (Array.isArray(list)) {
          setSalespersons(list);
        }
      })
      .catch(() => {});

    // 2. Fetch all follow-ups with query params
    const params = new URLSearchParams();
    if (stageFilter !== 'all') params.append('stage', stageFilter);
    if (personFilter !== 'all') params.append('teamMemberId', personFilter);
    if (typeFilter !== 'all') params.append('type', typeFilter);

    fetch(`/api/v1/inquiries/followups/all?${params.toString()}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        const list = Array.isArray(data) ? data : (data?.data || []);
        if (Array.isArray(list) && list.length > 0) {
          setFollowups(list);
        } else {
          // Fallback initial follow-ups for demonstration
          setFollowups([
            {
              id: 'fu-1',
              stage: 'SITE_VISIT_PLANNED',
              status: 'PENDING',
              description: 'Customer confirmed roof survey at 3:00 PM.',
              nextStep: 'Complete shadow analysis',
              committedDate: new Date().toISOString(),
              isOverdue: true,
              inquiry: {
                id: 'f-1024',
                followupId: 'F-1024',
                customerName: 'Ramesh Patel',
                customerPhone: '9825012345',
                city: 'Anand',
                currentStage: 'SITE_VISIT_PLANNED',
              },
              createdBy: {
                id: '9000000002',
                fullName: 'Amit Patel',
                role: 'SALESPERSON',
              },
            },
            {
              id: 'fu-2',
              stage: 'QUOTATION_SENT',
              status: 'CALL_DONE',
              description: 'Sent 6 kW quotation via WhatsApp. Customer reviewing subsidy details.',
              nextStep: 'Follow up on payment mode',
              committedDate: new Date(Date.now() + 86400000).toISOString(),
              isOverdue: false,
              inquiry: {
                id: 'f-1023',
                followupId: 'F-1023',
                customerName: 'Hetal Shah',
                customerPhone: '9825023456',
                city: 'Vadodara',
                currentStage: 'QUOTATION_SENT',
              },
              createdBy: {
                id: '9000000007',
                fullName: 'Kunal Joshi',
                role: 'SALESPERSON',
              },
            },
            {
              id: 'fu-3',
              stage: 'MATERIAL_PLANNED',
              status: 'CALL_DONE',
              description: 'Discussed unloading time. Customer asked for morning delivery.',
              nextStep: 'Dispatch truck from warehouse',
              committedDate: new Date().toISOString(),
              isOverdue: false,
              inquiry: {
                id: 'f-1015',
                followupId: 'F-1015',
                customerName: 'Diwan Zakirbhai',
                customerPhone: '9825044332',
                city: 'Anand',
                currentStage: 'MATERIAL_PLANNED',
              },
              createdBy: {
                id: '9000000004',
                fullName: 'Sohail Mansuri',
                role: 'MATERIAL_MANAGER',
              },
            },
          ]);
        }
      })
      .catch(() => {
        setFollowups([]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, [stageFilter, personFilter, typeFilter]);

  const handleMarkDone = async (id: string) => {
    const token = localStorage.getItem('accessToken');
    if (!token) return;

    try {
      const res = await fetch(`/api/v1/followups/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: 'DONE' }),
      });

      if (res.ok) {
        toast.success('Follow-up marked as completed!');
        loadData();
      } else {
        toast.error('Failed to update status.');
      }
    } catch {
      toast.error('Error updating status.');
    }
  };

  // Filter in-memory by search
  const filtered = followups.filter((f) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const customer = f.inquiry?.customerName?.toLowerCase() || '';
    const phone = f.inquiry?.customerPhone || '';
    const id = (f.inquiry?.followupId || f.inquiry?.id || '').toLowerCase();
    const desc = (f.description || '').toLowerCase();
    const creator = (f.createdBy?.fullName || '').toLowerCase();
    return customer.includes(q) || phone.includes(q) || id.includes(q) || desc.includes(q) || creator.includes(q);
  });

  const overdueCount = followups.filter((f) => f.isOverdue || (f.committedDate && new Date(f.committedDate) < new Date())).length;
  const totalCount = followups.length;

  return (
    <div className="min-h-screen bg-typhoon-sand pb-28">
      {/* 1. Header with Parabolic Curve */}
      <Header
        role={user?.role || 'OPS_MANAGER'}
        initials={theme.tag}
        roleTitle="Control tower"
        subtitle="Universal Follow-up & Stage SLA Tracker"
      />

      {/* 2. Floating Summary Tiles */}
      <SummaryTiles
        tiles={[
          {
            icon: <Clock className="w-4 h-4 text-typhoon-gold" />,
            value: String(totalCount),
            label: 'Total Follow-ups',
          },
          {
            icon: <AlertCircle className="w-4 h-4 text-rose-600" />,
            value: String(overdueCount),
            label: 'Overdue / Due',
          },
        ]}
      />

      {/* 3. Priority Lead SLA Alert */}
      <PriorityCard
        role={user?.role || 'OPS_MANAGER'}
        icon={<Clock className="w-5 h-5 text-rose-600" />}
        title="Immediate Follow-up Due"
        subtitle="Ramesh Patel · 6 kW Site Visit planned · Survey pending"
        badgeText="Urgent"
        onClick={() => router.push('/inquiries/F-1024')}
      />

      <div className="max-w-md mx-auto px-4 mt-3 space-y-3">
        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-typhoon-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search customer, phone, staff or note..."
            className="w-full pl-10 pr-4 py-3 bg-white rounded-2xl text-xs font-medium text-typhoon-navy border border-typhoon-border shadow-soft focus:outline-none focus:border-typhoon-gold transition"
          />
        </div>

        {/* 4 Multi-Filter Strip */}
        <div className="bg-white rounded-2xl p-3 border border-typhoon-border shadow-soft space-y-2.5">
          <div className="flex items-center justify-between text-xs font-bold text-typhoon-navy">
            <span className="flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-typhoon-gold" />
              <span>Filter Follow-ups</span>
            </span>
            {(stageFilter !== 'all' || personFilter !== 'all' || typeFilter !== 'all') && (
              <button
                onClick={() => {
                  setStageFilter('all');
                  setPersonFilter('all');
                  setTypeFilter('all');
                }}
                className="text-[11px] text-typhoon-muted hover:text-rose-600 font-semibold transition"
              >
                Reset filters
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            {/* 1. Stage Filter */}
            <div>
              <label className="text-[10px] font-bold text-typhoon-muted uppercase tracking-wider block mb-1">
                Stage
              </label>
              <select
                value={stageFilter}
                onChange={(e) => setStageFilter(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-typhoon-sand/40 border border-typhoon-border rounded-xl text-xs text-typhoon-navy focus:outline-none font-medium"
              >
                <option value="all">All Stages</option>
                <option value="INQUIRY_RECEIVED">Inquiry Received</option>
                <option value="SITE_VISIT_PLANNED">Site Survey</option>
                <option value="QUOTATION_SENT">Quotation Sent</option>
                <option value="DEAL_CLOSED">Deal Closed</option>
                <option value="GOVT_DOCS_SUBMITTED">Govt Portal Filing</option>
                <option value="MATERIAL_PLANNED">Material Planned</option>
                <option value="MATERIAL_UNLOADED">Material Unloaded</option>
                <option value="INSTALLATION_DONE">Installation Done</option>
                <option value="METER_STARTED">Meter Started</option>
                <option value="SUBSIDY_CLAIMED">Subsidy Claimed</option>
              </select>
            </div>

            {/* 2. Person Filter */}
            <div>
              <label className="text-[10px] font-bold text-typhoon-muted uppercase tracking-wider block mb-1">
                Assigned Person
              </label>
              <select
                value={personFilter}
                onChange={(e) => setPersonFilter(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-typhoon-sand/40 border border-typhoon-border rounded-xl text-xs text-typhoon-navy focus:outline-none font-medium"
              >
                <option value="all">All Team Members</option>
                {salespersons.map((sp) => (
                  <option key={sp.id} value={sp.id}>
                    {sp.fullName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 3. Type Switcher: All vs Inquiry Leads vs Converted Projects */}
          <div className="flex gap-1 pt-1 bg-typhoon-sand/40 p-1 rounded-xl border border-typhoon-border/60">
            <button
              onClick={() => setTypeFilter('all')}
              className={`flex-1 py-1.5 rounded-lg text-[11px] font-bold transition ${
                typeFilter === 'all'
                  ? 'bg-white text-typhoon-navy shadow-2xs'
                  : 'text-typhoon-muted hover:text-typhoon-navy'
              }`}
            >
              All Records
            </button>
            <button
              onClick={() => setTypeFilter('inquiry')}
              className={`flex-1 py-1.5 rounded-lg text-[11px] font-bold transition ${
                typeFilter === 'inquiry'
                  ? 'bg-white text-typhoon-navy shadow-2xs'
                  : 'text-typhoon-muted hover:text-typhoon-navy'
              }`}
            >
              Leads
            </button>
            <button
              onClick={() => setTypeFilter('project')}
              className={`flex-1 py-1.5 rounded-lg text-[11px] font-bold transition ${
                typeFilter === 'project'
                  ? 'bg-white text-typhoon-navy shadow-2xs'
                  : 'text-typhoon-muted hover:text-typhoon-navy'
              }`}
            >
              Projects
            </button>
          </div>
        </div>

        {/* Action button: Log New Follow-up */}
        <button
          onClick={() => {
            setSelectedInquiryId(undefined);
            setIsModalOpen(true);
          }}
          className="w-full py-3 px-4 rounded-2xl bg-typhoon-navy hover:bg-typhoon-navy-light text-white font-bold text-xs flex items-center justify-center gap-2 shadow-soft transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Log New Follow-up Commitment</span>
        </button>

        {/* Followups List */}
        <div className="space-y-3 pt-1">
          {filtered.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 border border-typhoon-border shadow-soft text-center space-y-2">
              <Clock className="w-8 h-8 text-typhoon-muted mx-auto" />
              <h3 className="text-sm font-bold text-typhoon-navy">No follow-ups match filters</h3>
              <p className="text-xs text-typhoon-muted">Try clearing the stage or person filters.</p>
            </div>
          ) : (
            filtered.map((item) => {
              const isOverdue =
                item.isOverdue ||
                (item.committedDate && new Date(item.committedDate) < new Date());
              const dateStr = item.committedDate
                ? new Date(item.committedDate).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                  })
                : 'Today';

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl p-4 border border-typhoon-border shadow-soft space-y-3 transition hover:border-typhoon-gold"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold font-mono text-typhoon-navy">
                          {item.inquiry?.followupId || item.inquiry?.id || 'LEAD'}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-typhoon-sand text-typhoon-navy border border-typhoon-border">
                          {item.stage?.replace(/_/g, ' ')}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-typhoon-navy mt-1">
                        {item.inquiry?.customerName || 'Customer Lead'}
                      </h4>
                      <p className="text-xs text-typhoon-muted">
                        {item.inquiry?.city || 'Gujarat'} · {item.inquiry?.customerPhone || ''}
                      </p>
                    </div>

                    <div className="text-right flex flex-col items-end">
                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                          isOverdue
                            ? 'bg-rose-50 text-rose-700 border-rose-200'
                            : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        }`}
                      >
                        {isOverdue ? 'Overdue' : 'Scheduled'}
                      </span>
                      <span className="text-[11px] text-typhoon-muted font-medium mt-1">
                        Due: {dateStr}
                      </span>
                    </div>
                  </div>

                  {/* Follow-up Note */}
                  <div className="p-3 bg-typhoon-sand/40 rounded-xl border border-typhoon-border/80 text-xs">
                    <p className="font-semibold text-typhoon-navy">{item.description}</p>
                    {item.nextStep && (
                      <p className="text-[11px] text-typhoon-muted mt-1">
                        Next action: <span className="font-semibold">{item.nextStep}</span>
                      </p>
                    )}
                  </div>

                  {/* Creator and Action Footer */}
                  <div className="flex items-center justify-between pt-1 text-xs">
                    <div className="flex items-center gap-1.5 text-typhoon-muted">
                      <User className="w-3.5 h-3.5" />
                      <span className="font-medium">
                        {item.createdBy?.fullName || 'Typhoon Staff'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleMarkDone(item.id)}
                        className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-[11px] font-bold border border-emerald-200 transition flex items-center gap-1"
                      >
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>Done</span>
                      </button>
                      <button
                        onClick={() => {
                          const targetId = item.inquiry?.followupId || item.inquiry?.id;
                          if (targetId) router.push(`/projects/${targetId}`);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-typhoon-sand hover:bg-typhoon-sand-dark text-typhoon-navy text-[11px] font-bold border border-typhoon-border transition flex items-center gap-0.5"
                      >
                        <span>View</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Universal Follow-up Modal */}
      <FollowUpModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        inquiryId={selectedInquiryId || 'F-1024'}
        onSuccess={() => {
          setIsModalOpen(false);
          loadData();
        }}
      />
    </div>
  );
}
