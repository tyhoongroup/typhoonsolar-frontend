'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Wrench,
  Clock,
  CheckCircle2,
  AlertCircle,
  Search,
  Phone,
  Camera,
  IndianRupee,
  FileText,
  ChevronRight,
  ShieldCheck,
  Zap,
  Plus,
  X,
} from 'lucide-react';
import { Header } from '@/components/Header';
import { SummaryTiles } from '@/components/SummaryTiles';
import { PriorityCard } from '@/components/PriorityCard';
import { FollowUpModal } from '@/components/FollowUpModal';
import { useCurrentUser } from '@/lib/use-current-user';
import { toast } from 'sonner';

export default function ServiceMaintenancePage() {
  const router = useRouter();
  const { user, theme } = useCurrentUser();

  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTab, setFilterTab] = useState<'all' | 'open' | 'resolved'>('all');

  // Sync tab with URL query parameter (e.g. /service?tab=open)
  useEffect(() => {
    const handleUrlChange = () => {
      if (typeof window !== 'undefined') {
        const params = new URLSearchParams(window.location.search);
        const tab = params.get('tab');
        if (tab === 'open' || tab === 'resolved' || tab === 'all') {
          setFilterTab(tab as any);
        }
      }
    };
    handleUrlChange();
    window.addEventListener('popstate', handleUrlChange);
    return () => window.removeEventListener('popstate', handleUrlChange);
  }, []);

  // Selected Ticket Resolution Drawer / Modal
  const [selectedTicket, setSelectedTicket] = useState<any | null>(null);
  const [customerRemark, setCustomerRemark] = useState('');
  const [techQueryNotes, setTechQueryNotes] = useState('');
  const [partsCost, setPartsCost] = useState('0');
  const [isChargeable, setIsChargeable] = useState(false);
  const [proofPhotos, setProofPhotos] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Universal Followup Modal
  const [isFollowupOpen, setIsFollowupOpen] = useState(false);

  const loadTickets = () => {
    const token = localStorage.getItem('accessToken');
    if (!token || token === 'null' || token === 'undefined') {
      localStorage.clear();
      router.push('/');
      return;
    }

    setLoading(true);
    fetch('/api/v1/service/tickets', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        const list = Array.isArray(data) ? data : (data?.data || []);
        if (Array.isArray(list) && list.length > 0) {
          setTickets(list);
        } else {
          // Default service tickets
          setTickets([
            {
              id: 'tk-1',
              ticketNo: 'S-201',
              issueType: 'Inverter Error Code 04 (Grid Disconnected)',
              isUrgent: true,
              status: 'LOGGED',
              inquiry: {
                id: 'f-1015',
                followupId: 'F-1015',
                customerName: 'Diwan Zakirbhai',
                customerPhone: '9825044332',
                city: 'Anand',
                requestedKw: '10.0',
                meterPhase: 'Three Phase',
              },
              partsUsed: [],
              daysToResolve: 1,
              isChargeable: false,
              repairPhotos: [],
              createdAt: new Date().toISOString(),
            },
            {
              id: 'tk-2',
              ticketNo: 'S-202',
              issueType: 'Generation Low · MC4 Connector Loose',
              isUrgent: false,
              status: 'LOGGED',
              inquiry: {
                id: 'f-1012',
                followupId: 'F-1012',
                customerName: 'Harishbhai Shah',
                customerPhone: '9825077665',
                city: 'Vadodara',
                requestedKw: '4.5',
                meterPhase: 'Single Phase',
              },
              partsUsed: ['MC4 Pair'],
              daysToResolve: 1,
              isChargeable: false,
              repairPhotos: [],
              createdAt: new Date(Date.now() - 86400000).toISOString(),
            },
          ]);
        }
      })
      .catch(() => {
        setTickets([]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadTickets();
  }, []);

  const openResolution = (ticket: any) => {
    setSelectedTicket(ticket);
    setCustomerRemark(ticket.customerRemark || 'Customer reported inverter red light flashing since yesterday.');
    setTechQueryNotes(ticket.issueType || '');
    setPartsCost(ticket.isChargeable ? '450' : '0');
    setIsChargeable(ticket.isChargeable || false);
    setProofPhotos(ticket.repairPhotos || ['inverter_display.jpg']);
  };

  const handleResolveTicket = async (status: 'RESOLVED' | 'DRAFT') => {
    if (!selectedTicket) return;
    const token = localStorage.getItem('accessToken');
    if (!token) return;

    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/v1/service/tickets/${selectedTicket.id}/report`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          partsUsed: [techQueryNotes || 'Inspection & tuning'],
          daysToResolve: 1,
          isChargeable,
          repairPhotos: proofPhotos,
        }),
      });

      if (res.ok) {
        toast.success(
          status === 'RESOLVED'
            ? `Service Ticket ${selectedTicket.ticketNo} marked Query Resolved!`
            : 'Service notes updated!'
        );
        setSelectedTicket(null);
        loadTickets();
      } else {
        toast.error('Failed to submit report.');
      }
    } catch {
      toast.error('Error submitting report.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filtered = tickets.filter((t) => {
    if (filterTab === 'open' && t.status === 'RESOLVED') return false;
    if (filterTab === 'resolved' && t.status !== 'RESOLVED') return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const num = (t.ticketNo || '').toLowerCase();
      const cust = (t.inquiry?.customerName || '').toLowerCase();
      const issue = (t.issueType || '').toLowerCase();
      return num.includes(q) || cust.includes(q) || issue.includes(q);
    }
    return true;
  });

  const openTicketsCount = tickets.filter((t) => t.status !== 'RESOLVED').length;
  const resolvedCount = tickets.filter((t) => t.status === 'RESOLVED').length;

  return (
    <div className="min-h-screen bg-typhoon-sand pb-28">
      {/* 1. Standard Header */}
      <Header
        role={user?.role || 'SERVICE_TECH'}
        initials={theme.tag}
        roleTitle="Service & Maintenance"
        subtitle="Customer Complaints & Rooftop Support"
      />

      {/* 2. Floating Overlap Summary Tiles */}
      <SummaryTiles
        tiles={[
          {
            icon: <Wrench className="w-4 h-4 text-emerald-600" />,
            value: String(openTicketsCount),
            label: 'Open Queries',
          },
          {
            icon: <CheckCircle2 className="w-4 h-4 text-typhoon-gold" />,
            value: String(resolvedCount),
            label: 'Resolved Today',
          },
        ]}
      />

      {/* 3. Priority Service Card */}
      <PriorityCard
        role={user?.role || 'SERVICE_TECH'}
        icon={<AlertCircle className="w-5 h-5 text-rose-600" />}
        title="Urgent Ticket · S-201"
        subtitle="Diwan Zakirbhai · Inverter Error 04 (Grid Disconnected)"
        badgeText="Urgent"
        onClick={() => {
          if (tickets[0]) openResolution(tickets[0]);
        }}
      />

      <div className="max-w-md mx-auto px-4 mt-3 space-y-3">
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-typhoon-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search ticket no, customer or error..."
            className="w-full pl-10 pr-4 py-3 bg-white rounded-2xl text-xs font-medium text-typhoon-navy border border-typhoon-border shadow-soft focus:outline-none focus:border-typhoon-gold transition"
          />
        </div>

        {/* Tab Filters */}
        <div className="flex gap-1 bg-white p-1 rounded-2xl border border-typhoon-border shadow-soft">
          <button
            onClick={() => setFilterTab('all')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition ${
              filterTab === 'all'
                ? 'bg-typhoon-navy text-white shadow-2xs'
                : 'text-typhoon-muted hover:text-typhoon-navy'
            }`}
          >
            All Tickets
          </button>
          <button
            onClick={() => setFilterTab('open')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition ${
              filterTab === 'open'
                ? 'bg-typhoon-navy text-white shadow-2xs'
                : 'text-typhoon-muted hover:text-typhoon-navy'
            }`}
          >
            Open Tasks ({openTicketsCount})
          </button>
          <button
            onClick={() => setFilterTab('resolved')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition ${
              filterTab === 'resolved'
                ? 'bg-typhoon-navy text-white shadow-2xs'
                : 'text-typhoon-muted hover:text-typhoon-navy'
            }`}
          >
            Resolved
          </button>
        </div>

        {/* Tickets List */}
        <div className="space-y-3 pt-1">
          {filtered.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 border border-typhoon-border shadow-soft text-center space-y-2">
              <Wrench className="w-8 h-8 text-typhoon-muted mx-auto" />
              <h3 className="text-sm font-bold text-typhoon-navy">No service tickets</h3>
              <p className="text-xs text-typhoon-muted">All customer solar plants operating nominally.</p>
            </div>
          ) : (
            filtered.map((ticket) => {
              const isResolved = ticket.status === 'RESOLVED';

              return (
                <div
                  key={ticket.id}
                  className="bg-white rounded-2xl p-4 border border-typhoon-border shadow-soft space-y-3 transition hover:border-typhoon-gold"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold font-mono px-2 py-0.5 rounded-md bg-typhoon-sand text-typhoon-navy border border-typhoon-border">
                          {ticket.ticketNo}
                        </span>
                        {ticket.isUrgent && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                            Urgent SLA
                          </span>
                        )}
                      </div>
                      <h4 className="text-sm font-bold text-typhoon-navy mt-1.5">
                        {ticket.inquiry?.customerName || 'Customer'}
                      </h4>
                      <p className="text-xs text-typhoon-muted">
                        {ticket.inquiry?.requestedKw || '6'} kW · {ticket.inquiry?.city || 'Gujarat'} · {ticket.inquiry?.customerPhone || ''}
                      </p>
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                        isResolved
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border-amber-200'
                      }`}
                    >
                      {isResolved ? 'Resolved' : 'Action Due'}
                    </span>
                  </div>

                  {/* Minimal project & query detail */}
                  <div className="p-3 bg-typhoon-sand/40 rounded-xl border border-typhoon-border/80 text-xs space-y-1">
                    <span className="text-[10px] uppercase font-bold text-typhoon-muted block">
                      Reported Issue
                    </span>
                    <p className="font-semibold text-typhoon-navy">{ticket.issueType}</p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-1">
                    <a
                      href={`tel:${ticket.inquiry?.customerPhone}`}
                      className="text-xs font-bold text-typhoon-navy hover:text-typhoon-gold flex items-center gap-1.5 transition"
                    >
                      <Phone className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Call Customer</span>
                    </a>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setIsFollowupOpen(true)}
                        className="px-2.5 py-1.5 rounded-xl bg-typhoon-sand hover:bg-typhoon-sand-dark text-typhoon-navy text-xs font-bold border border-typhoon-border transition"
                      >
                        Follow-up
                      </button>
                      <button
                        onClick={() => openResolution(ticket)}
                        className="px-3.5 py-1.5 rounded-xl bg-typhoon-navy hover:bg-typhoon-navy-light text-white text-xs font-bold shadow-soft transition flex items-center gap-1"
                      >
                        <span>Resolve</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Interactive Service Resolution Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 z-[130] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-t-[32px] sm:rounded-[32px] max-w-lg w-full max-h-[90vh] flex flex-col shadow-2xl border border-typhoon-border overflow-hidden animate-in slide-in-from-bottom duration-300">
            {/* Modal Header */}
            <div
              style={{ backgroundColor: 'var(--s)' }}
              className="p-5 text-white flex items-center justify-between"
            >
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-white/70 block">
                  Service Ticket Resolution
                </span>
                <h3 className="text-base font-bold text-white mt-0.5">
                  {selectedTicket.ticketNo} · {selectedTicket.inquiry?.customerName}
                </h3>
              </div>
              <button
                onClick={() => setSelectedTicket(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 overflow-y-auto space-y-4 flex-1">
              {/* Minimal Project Details Box */}
              <div className="bg-typhoon-sand/40 p-3.5 rounded-2xl border border-typhoon-border/80 text-xs space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-[10px] text-typhoon-muted font-bold block">Capacity</span>
                    <span className="font-bold text-typhoon-navy">
                      {selectedTicket.inquiry?.requestedKw || '6.0'} kW Solar
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-typhoon-muted font-bold block">Phase</span>
                    <span className="font-bold text-typhoon-navy">
                      {selectedTicket.inquiry?.meterPhase || 'Single Phase'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-typhoon-muted font-bold block">Location</span>
                    <span className="font-bold text-typhoon-navy">
                      {selectedTicket.inquiry?.city || 'Gujarat'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-typhoon-muted font-bold block">Warranty</span>
                    <span className="font-bold text-emerald-700">Active (5 Yrs Inverter)</span>
                  </div>
                </div>
              </div>

              {/* What Customer Told */}
              <div>
                <label className="text-xs font-bold text-typhoon-navy block mb-1">
                  Customer Statement (What Customer Told)
                </label>
                <textarea
                  rows={2}
                  value={customerRemark}
                  onChange={(e) => setCustomerRemark(e.target.value)}
                  placeholder="Customer remarks on phone or site visit..."
                  className="w-full p-3 bg-typhoon-sand/40 border border-typhoon-border rounded-xl text-xs text-typhoon-navy focus:outline-none focus:border-typhoon-gold font-medium"
                />
              </div>

              {/* Technician Query & Solution */}
              <div>
                <label className="text-xs font-bold text-typhoon-navy block mb-1">
                  Technician Query Finding & Action Taken
                </label>
                <textarea
                  rows={2}
                  value={techQueryNotes}
                  onChange={(e) => setTechQueryNotes(e.target.value)}
                  placeholder="Root cause found, connections tightened, firmware reset..."
                  className="w-full p-3 bg-typhoon-sand/40 border border-typhoon-border rounded-xl text-xs text-typhoon-navy focus:outline-none focus:border-typhoon-gold font-medium"
                />
              </div>

              {/* Cost of Query / Parts */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-typhoon-navy block mb-1">
                    Repair / Replacement Cost (₹)
                  </label>
                  <div className="relative">
                    <IndianRupee className="w-3.5 h-3.5 text-typhoon-muted absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="number"
                      value={partsCost}
                      onChange={(e) => setPartsCost(e.target.value)}
                      className="w-full pl-8 pr-3 py-2 bg-typhoon-sand/40 border border-typhoon-border rounded-xl text-xs text-typhoon-navy font-bold focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-typhoon-navy block mb-1">
                    Billing Status
                  </label>
                  <select
                    value={isChargeable ? 'chargeable' : 'warranty'}
                    onChange={(e) => setIsChargeable(e.target.value === 'chargeable')}
                    className="w-full px-3 py-2 bg-typhoon-sand/40 border border-typhoon-border rounded-xl text-xs text-typhoon-navy font-medium focus:outline-none"
                  >
                    <option value="warranty">Free under Warranty</option>
                    <option value="chargeable">Chargeable to Customer</option>
                  </select>
                </div>
              </div>

              {/* Upload Proof */}
              <div>
                <label className="text-xs font-bold text-typhoon-navy block mb-1">
                  Upload Repair Proof Photos
                </label>
                <div className="border border-dashed border-typhoon-border rounded-xl p-3 text-center bg-typhoon-sand/30">
                  <Camera className="w-6 h-6 text-typhoon-gold mx-auto mb-1" />
                  <span className="text-[11px] font-semibold text-typhoon-navy block">
                    Upload technician proof photo
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setProofPhotos((prev) => [...prev, e.target.files![0].name]);
                        toast.success('Proof photo attached!');
                      }
                    }}
                    className="mt-1 text-[10px] text-typhoon-muted"
                  />
                </div>
                {proofPhotos.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {proofPhotos.map((p, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] font-medium bg-emerald-50 text-emerald-800 px-2.5 py-1 rounded-lg border border-emerald-200"
                      >
                        {p}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="p-4 bg-typhoon-sand/30 border-t border-typhoon-border flex gap-2">
              <button
                type="button"
                onClick={() => handleResolveTicket('DRAFT')}
                disabled={isSubmitting}
                className="flex-1 py-3 px-4 rounded-xl bg-white hover:bg-typhoon-sand text-typhoon-navy font-bold text-xs border border-typhoon-border transition"
              >
                Save Notes
              </button>

              <button
                type="button"
                onClick={() => handleResolveTicket('RESOLVED')}
                disabled={isSubmitting}
                style={{
                  backgroundColor: 'var(--a)',
                  color: 'var(--on)',
                }}
                className="flex-1 py-3 px-4 rounded-xl font-bold text-xs shadow-soft transition flex items-center justify-center gap-1.5 hover:opacity-90"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{isSubmitting ? 'Updating...' : 'Query Resolved'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Universal Follow-up Modal */}
      <FollowUpModal
        isOpen={isFollowupOpen}
        onClose={() => setIsFollowupOpen(false)}
        inquiryId={selectedTicket?.inquiry?.followupId || selectedTicket?.inquiry?.id}
        onSuccess={() => {
          setIsFollowupOpen(false);
          loadTickets();
        }}
      />
    </div>
  );
}
