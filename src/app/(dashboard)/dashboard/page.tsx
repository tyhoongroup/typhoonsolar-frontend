'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '../../../components/Header';
import { SummaryTiles } from '../../../components/SummaryTiles';
import { PriorityCard } from '../../../components/PriorityCard';
import { UpNextList, UpNextItem } from '../../../components/UpNextList';
import { MainButton } from '../../../components/MainButton';
import { DataTable, DataRowItem } from '../../../components/desktop/DataTable';
import { SidePanel } from '../../../components/desktop/SidePanel';
import {
  Users,
  PhoneCall,
  Camera,
  FileText,
  Clock,
  Package,
  Plus,
  Send,
  Upload,
  CheckCircle2,
  AlertTriangle,
  IndianRupee,
  Layers,
  ArrowRight,
  Briefcase,
  CheckSquare,
  Phone,
  Sun,
  Wrench,
  Wallet,
  Truck,
  Scan,
  Receipt,
} from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const [liveInquiries, setLiveInquiries] = useState<any[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) setUser(JSON.parse(stored));

    const token = localStorage.getItem('accessToken');
    if (token) {
      fetch('/api/v1/inquiries', {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => (res.ok ? res.json() : []))
        .then((data) => {
          const list = Array.isArray(data) ? data : (data?.data || []);
          if (Array.isArray(list) && list.length > 0) {
            setLiveInquiries(list);
          }
        })
        .catch(() => {});
    }
  }, []);

  if (!user) return null;

  // =========================================================================
  // 1. OPERATIONS MANAGER / ADMIN
  // =========================================================================
  if (user.role === 'OPS_MANAGER' || user.role === 'ADMIN') {
    // Default Mobile Up Next Items (Exact from role_home_screens_all_palettes.html)
    const defaultMobileUpNext: UpNextItem[] = [
      {
        id: '1',
        icon: <Phone className="w-4 h-4" />,
        title: 'F-1024 · Ramesh Patel',
        subtitle: '6 kW · Vadodara · Approve quote',
        badgeText: 'Urgent',
        badgeType: 'urgent',
        onClick: () => router.push('/inquiries/F-1024'),
      },
      {
        id: '2',
        icon: <FileText className="w-4 h-4" />,
        title: 'F-1026 · Test User',
        subtitle: '7 kW · Vadodara · Assign team',
        badgeText: 'New',
        badgeType: 'bn',
        onClick: () => router.push('/inquiries/F-1026'),
      },
      {
        id: '3',
        icon: <FileText className="w-4 h-4" />,
        title: 'F-1025 · Qureshi Mohammed Zahid',
        subtitle: '6 kW · Vadodara · Schedule install',
        badgeText: 'New',
        badgeType: 'bn',
        onClick: () => router.push('/inquiries/F-1025'),
      },
    ];

    const liveMobileUpNext: UpNextItem[] = liveInquiries.slice(0, 3).map((inq: any, idx: number) => ({
      id: String(idx + 1),
      icon: inq.isUrgent ? (
        <PhoneCall className="w-4 h-4 text-rose-600" />
      ) : (
        <FileText className="w-4 h-4 text-amber-600" />
      ),
      title: `${inq.followupId || inq.id} · ${inq.customerName}`,
      subtitle: `${inq.requestedKw} kW · ${inq.city || 'Vadodara'} · ${
        inq.assignedSalesperson?.fullName ? `Assigned to ${inq.assignedSalesperson.fullName}` : 'Lead Captured'
      }`,
      badgeText: inq.isUrgent ? 'Urgent' : (inq.currentStage?.replace(/_/g, ' ') || 'New Lead'),
      badgeType: inq.isUrgent ? 'due' : 'active',
      onClick: () =>
        router.push(
          inq.currentStage === 'DEAL_CLOSED'
            ? `/projects/${inq.followupId || inq.id}`
            : `/inquiries/${inq.followupId || inq.id}`
        ),
    }));

    const mobileUpNext: UpNextItem[] =
      liveMobileUpNext.length > 0 ? liveMobileUpNext : defaultMobileUpNext;

    // Desktop Data Table Rows (Web Screen Layout #5)
    const defaultDesktopTableRows: DataRowItem[] = [
      {
        id: 'F-1024',
        icon: <PhoneCall className="w-4 h-4 text-rose-600" />,
        title: 'F-1024 · Ramesh Patel',
        subtitle: '6.0 kW · Single Phase · B-42 Shivalik, Anand · Assigned to Amit',
        badgeText: 'Overdue (2h)',
        badgeStyle: 'bg-rose-50 text-rose-700 border-rose-200',
      },
      {
        id: 'F-1021',
        icon: <FileText className="w-4 h-4 text-emerald-600" />,
        title: 'F-1021 · Nilesh Desai',
        subtitle: '6.0 kW · Three Phase · Gotri, Vadodara · Assigned to Amit',
        badgeText: 'Quote Sent',
        badgeStyle: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      },
      {
        id: 'F-1018',
        icon: <Users className="w-4 h-4 text-amber-600" />,
        title: 'F-1018 · Bhavna Joshi',
        subtitle: '3.24 kW · Single Phase · Nadiad · Collect Customer Documents',
        badgeText: 'Docs Pending',
        badgeStyle: 'bg-amber-50 text-amber-700 border-amber-200',
      },
      {
        id: 'F-1015',
        icon: <Package className="w-4 h-4 text-sky-600" />,
        title: 'F-1015 · Diwan Zakirbhai',
        subtitle: '10.0 kW · Three Phase · Anand · Material Ready for Dispatch',
        badgeText: 'Dispatch Queue',
        badgeStyle: 'bg-sky-50 text-sky-700 border-sky-200',
      },
      {
        id: 'F-1012',
        icon: <CheckCircle2 className="w-4 h-4 text-indigo-600" />,
        title: 'F-1012 · Harishbhai Shah',
        subtitle: '4.5 kW · Three Phase · Vasna, Vadodara · Fabrication Completed',
        badgeText: 'Installation',
        badgeStyle: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      },
    ];

    const liveDesktopRows: DataRowItem[] = liveInquiries.map((inq: any) => ({
      id: inq.followupId || inq.id,
      icon: inq.isUrgent ? (
        <PhoneCall className="w-4 h-4 text-rose-600" />
      ) : (
        <FileText className="w-4 h-4 text-emerald-600" />
      ),
      title: `${inq.followupId || inq.id} · ${inq.customerName}`,
      subtitle: `${inq.requestedKw} kW · ${inq.meterPhase || 'Single Phase'} · ${inq.city || inq.address} · Assigned to ${inq.assignedSalesperson?.fullName || 'Amit'}`,
      badgeText: inq.isUrgent ? 'Urgent' : (inq.currentStage?.replace(/_/g, ' ') || 'Active'),
      badgeStyle: inq.isUrgent
        ? 'bg-rose-50 text-rose-700 border-rose-200'
        : 'bg-emerald-50 text-emerald-700 border-emerald-200',
    }));

    const desktopTableRows: DataRowItem[] =
      liveDesktopRows.length > 0 ? liveDesktopRows : defaultDesktopTableRows;

    const filterChips = [
      { id: 'all', label: 'All Inquiries (14)' },
      { id: 'survey', label: 'Site Survey (3)' },
      { id: 'docs', label: 'KYC Docs (2)' },
      { id: 'material', label: 'Material Unload (4)' },
      { id: 'meter', label: 'Net Meter (5)' },
    ];

    const filteredRows = activeFilter === 'all' 
      ? desktopTableRows 
      : desktopTableRows.filter(r => r.badgeText.toLowerCase().includes(activeFilter));

    return (
      <div>
        {/* ================================================================ */}
        {/* DESKTOP LAYOUT (Web Screen Layout - Follows Web layout guide@2x)  */}
        {/* ================================================================ */}
        <div className="hidden lg:block space-y-6">
          {/* Item 3: Page Header (Serif title, short subtitle, Gold Action button on right) */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-serif font-bold text-typhoon-navy tracking-tight">
                Operations Overview
              </h1>
              <p className="text-xs text-typhoon-muted mt-1">
                14 active rooftop solar projects across Anand, Vadodara & Nadiad
              </p>
            </div>
            <button
              onClick={() => router.push('/inquiries/new')}
              className="bg-typhoon-gold text-typhoon-navy font-bold px-5 py-2.5 rounded-xl text-xs hover:bg-typhoon-gold-dark transition shadow-soft flex items-center gap-2"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Add New Inquiry</span>
            </button>
          </div>

          {/* Item 4: Summary Tiles (Four tiles across in a row: icon, large number, label) */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-white rounded-2xl border border-typhoon-border shadow-soft p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-typhoon-sand flex items-center justify-center text-typhoon-navy">
                <Users className="w-6 h-6 text-typhoon-gold" />
              </div>
              <div>
                <span className="text-2xl font-serif font-bold text-typhoon-navy block leading-none">14</span>
                <span className="text-xs text-typhoon-muted font-medium mt-1 block">Active Inquiries</span>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-typhoon-border shadow-soft p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600">
                <AlertTriangle className="w-6 h-6 text-rose-600" />
              </div>
              <div>
                <span className="text-2xl font-serif font-bold text-rose-700 block leading-none">3</span>
                <span className="text-xs text-rose-600 font-medium mt-1 block">Overdue SLAs (&gt;24h)</span>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-typhoon-border shadow-soft p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
                <IndianRupee className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <span className="text-2xl font-serif font-bold text-typhoon-navy block leading-none">₹8.4L</span>
                <span className="text-xs text-typhoon-muted font-medium mt-1 block">Pending 80% Unloads</span>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-typhoon-border shadow-soft p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                <Layers className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <span className="text-2xl font-serif font-bold text-typhoon-navy block leading-none">9</span>
                <span className="text-xs text-typhoon-muted font-medium mt-1 block">In Progress Today</span>
              </div>
            </div>
          </div>

          {/* Main 2-Column Area (Item 5: Main Table on Left, Item 6: Side Panel on Right) */}
          <div className="grid grid-cols-12 gap-6 items-start">
            {/* Left 8 Cols: Main Data Table */}
            <div className="col-span-8">
              <DataTable
                filterChips={filterChips}
                activeChip={activeFilter}
                onChipSelect={setActiveFilter}
                items={filteredRows}
                onRowClick={(id) => router.push(`/inquiries/${id}`)}
              />
            </div>

            {/* Right 4 Cols: Side Panel (Navy priority card + today's team follow-ups) */}
            <div className="col-span-4">
              <SidePanel
                priorityTask={{
                  title: 'F-1024 · Escalated Follow-Up Call',
                  subtitle: '6.0 kW · Ramesh Patel · Committed follow-up time was 11:00 AM',
                  badgeText: 'CRITICAL SLA',
                  onClick: () => router.push('/inquiries/F-1024'),
                }}
                teamStatuses={[
                  {
                    id: 'amit-1',
                    salespersonName: 'Amit Patel',
                    role: 'Sales Representative',
                    customerName: 'Ramesh Patel',
                    inquiryCode: 'F-1024',
                    statusText: 'Overdue (2h)',
                    isOverdue: true,
                    notes: 'Customer inquired about PM Surya Ghar ₹78,000 subsidy eligibility. Terrace shadow cleared. Requested site visit.',
                    nextAction: 'Visit terrace for structural survey & take photo of DISCOM meter',
                    committedDate: 'Today 11:00 AM (Overdue)',
                  },
                  {
                    id: 'kunal-1',
                    salespersonName: 'Kunal Joshi',
                    role: 'Senior Sales Rep',
                    customerName: 'Nilesh Desai',
                    inquiryCode: 'F-1021',
                    statusText: 'Negotiation',
                    isOverdue: false,
                    notes: 'Quotation sent for 6.0 kW Three Phase (₹2,75,000). Customer asked for 10-year inverter warranty. Ready to book with ₹20,000 token.',
                    nextAction: 'Send updated quotation with warranty clause via WhatsApp',
                    committedDate: 'Today 3:30 PM',
                  },
                  {
                    id: 'priya-1',
                    salespersonName: 'Priya Sharma',
                    role: 'Sales Engineer',
                    customerName: 'Bhavna Joshi',
                    inquiryCode: 'F-1018',
                    statusText: 'Docs Pending',
                    isOverdue: false,
                    notes: 'Deal closed for 3.24 kW. Electricity bill received. Aadhaar and property tax receipt pending from customer father.',
                    nextAction: 'Collect Aadhaar OTP & property tax bill for Surya Gujarat portal upload',
                    committedDate: 'Tomorrow 10:00 AM',
                  },
                  {
                    id: 'sohail-1',
                    salespersonName: 'Sohail Khan',
                    role: 'Store Lead',
                    customerName: 'Diwan Zakirbhai',
                    inquiryCode: 'F-1015',
                    statusText: 'Dispatch Ready',
                    isOverdue: false,
                    notes: 'All 18 panels (550W DCR) and 10 kW Growatt inverter staged in warehouse. Driver assigned for morning delivery.',
                    nextAction: 'Dispatch vehicle and send driver phone number to customer',
                    committedDate: 'Tomorrow 9:00 AM',
                  },
                ]}
                onMemberClick={() => router.push('/team')}
              />
            </div>
          </div>
        </div>

        {/* ================================================================ */}
        {/* MOBILE LAYOUT (Exact from role_home_screens_all_palettes.html)   */}
        {/* ================================================================ */}
        <div className="lg:hidden">
          <Header
            role="OPS_MANAGER"
            initials="OM"
            roleTitle="Ops Manager"
            subtitle="Jobs, teams and approvals"
          />

          <SummaryTiles
            role="OPS_MANAGER"
            tiles={[
              { icon: <Briefcase className="w-4 h-4" />, value: '14', label: 'Active jobs' },
              { icon: <CheckSquare className="w-4 h-4" />, value: '5', label: 'Approvals pending' },
            ]}
          />

          <PriorityCard
            role="OPS_MANAGER"
            icon={<Briefcase className="w-4 h-4" />}
            title="Approve quote · F-1024"
            subtitle="Ramesh Patel · ₹ 3.2L"
            badgeText="Today"
            onClick={() => router.push('/inquiries/F-1024')}
          />

          <UpNextList role="OPS_MANAGER" items={mobileUpNext} />

          <MainButton
            role="OPS_MANAGER"
            icon={<Plus className="w-4 h-4" />}
            onClick={() => router.push('/team')}
          >
            Assign job
          </MainButton>
        </div>
      </div>
    );
  }

  // =========================================================================
  // 2. SALESPERSON (Amit / Kunal - Matching Screen 2)
  // =========================================================================
  if (user.role === 'SALESPERSON') {
    const defaultMobileUpNext: UpNextItem[] = [
      {
        id: '1',
        icon: <Phone className="w-4 h-4" />,
        title: 'F-1024 · Ramesh Patel',
        subtitle: '6 kW · Vadodara · Call customer',
        badgeText: 'Urgent',
        badgeType: 'urgent',
        onClick: () => router.push('/inquiries/F-1024'),
      },
      {
        id: '2',
        icon: <FileText className="w-4 h-4" />,
        title: 'F-1026 · Test User',
        subtitle: '7 kW · Vadodara · Call customer',
        badgeText: 'New',
        badgeType: 'bn',
        onClick: () => router.push('/inquiries/F-1026'),
      },
      {
        id: '3',
        icon: <FileText className="w-4 h-4" />,
        title: 'F-1025 · Qureshi Mohammed Zahid',
        subtitle: '6 kW · Vadodara · Call customer',
        badgeText: 'New',
        badgeType: 'bn',
        onClick: () => router.push('/inquiries/F-1025'),
      },
    ];

    const liveMobileUpNext: UpNextItem[] = liveInquiries.slice(0, 3).map((inq: any, idx: number) => ({
      id: String(idx + 1),
      icon: inq.isUrgent ? <PhoneCall className="w-4 h-4 text-rose-600" /> : <FileText className="w-4 h-4 text-amber-600" />,
      title: `${inq.followupId || inq.id} · ${inq.customerName}`,
      subtitle: `${inq.requestedKw} kW · ${inq.city || 'Vadodara'} · Call customer`,
      badgeText: inq.isUrgent ? 'Urgent' : 'New',
      badgeType: inq.isUrgent ? 'due' : 'active',
      onClick: () =>
        router.push(
          inq.currentStage === 'DEAL_CLOSED'
            ? `/projects/${inq.followupId || inq.id}`
            : `/inquiries/${inq.followupId || inq.id}`
        ),
    }));

    const mobileUpNext: UpNextItem[] = liveMobileUpNext.length > 0 ? liveMobileUpNext : defaultMobileUpNext;

    const defaultDesktopSalesRows: DataRowItem[] = [
      {
        id: 'F-1024',
        icon: <Camera className="w-4 h-4 text-amber-600" />,
        title: 'F-1024 · Ramesh Patel',
        subtitle: 'Site survey today 2:00 PM · B-42 Shivalik, Anand · 6 kW',
        badgeText: 'Visit Today',
        badgeStyle: 'bg-amber-50 text-amber-700 border-amber-200',
      },
      {
        id: 'F-1022',
        icon: <FileText className="w-4 h-4 text-sky-600" />,
        title: 'F-1022 · Nilesh Desai',
        subtitle: 'Prepare Proposal · 6 kW Three Phase TopCon · Gotri, Vadodara',
        badgeText: 'Quote Needed',
        badgeStyle: 'bg-sky-50 text-sky-700 border-sky-200',
      },
      {
        id: 'F-1019',
        icon: <PhoneCall className="w-4 h-4 text-emerald-600" />,
        title: 'F-1019 · Chetan Shah',
        subtitle: 'Follow-up call · Interested in 3.24 kW subsidy calculation',
        badgeText: 'Call Scheduled',
        badgeStyle: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      },
    ];

    const liveDesktopSalesRows: DataRowItem[] = liveInquiries.map((inq: any) => ({
      id: inq.followupId || inq.id,
      icon: inq.isUrgent ? (
        <PhoneCall className="w-4 h-4 text-rose-600" />
      ) : (
        <Camera className="w-4 h-4 text-amber-600" />
      ),
      title: `${inq.followupId || inq.id} · ${inq.customerName}`,
      subtitle: `${inq.requestedKw} kW · ${inq.meterPhase || 'Single Phase'} · ${inq.city || inq.address}`,
      badgeText: inq.isUrgent ? 'Urgent Lead' : inq.currentStage?.replace(/_/g, ' ') || 'Assigned',
      badgeStyle: inq.isUrgent
        ? 'bg-rose-50 text-rose-700 border-rose-200'
        : 'bg-sky-50 text-sky-700 border-sky-200',
    }));

    const desktopSalesRows: DataRowItem[] =
      liveDesktopSalesRows.length > 0 ? liveDesktopSalesRows : defaultDesktopSalesRows;

    return (
      <div>
        {/* DESKTOP */}
        <div className="hidden lg:block space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-serif font-bold text-typhoon-navy tracking-tight">
                My Sales Pipeline
              </h1>
              <p className="text-xs text-typhoon-muted mt-1">
                Active site visits, quotation drafts, and customer follow-up calls
              </p>
            </div>
            <button
              onClick={() => router.push('/quotations/new')}
              className="bg-typhoon-gold text-typhoon-navy font-bold px-5 py-2.5 rounded-xl text-xs hover:bg-typhoon-gold-dark transition shadow-soft flex items-center gap-2"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Create New Quote</span>
            </button>
          </div>

          <div className="grid grid-cols-4 gap-4">
            <div className="bg-white rounded-2xl border border-typhoon-border shadow-soft p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-typhoon-sand flex items-center justify-center text-typhoon-navy">
                <Users className="w-6 h-6 text-typhoon-gold" />
              </div>
              <div>
                <span className="text-2xl font-serif font-bold text-typhoon-navy block leading-none">
                  {liveInquiries.length > 0 ? liveInquiries.length : 5}
                </span>
                <span className="text-xs text-typhoon-muted font-medium mt-1 block">Assigned to Me</span>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-typhoon-border shadow-soft p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
                <Camera className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <span className="text-2xl font-serif font-bold text-typhoon-navy block leading-none">2</span>
                <span className="text-xs text-typhoon-muted font-medium mt-1 block">Site Surveys Today</span>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-typhoon-border shadow-soft p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-sky-50 flex items-center justify-center text-sky-600">
                <FileText className="w-6 h-6 text-sky-600" />
              </div>
              <div>
                <span className="text-2xl font-serif font-bold text-typhoon-navy block leading-none">3</span>
                <span className="text-xs text-typhoon-muted font-medium mt-1 block">Quotes Sent</span>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-typhoon-border shadow-soft p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                <CheckCircle2 className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <span className="text-2xl font-serif font-bold text-typhoon-navy block leading-none">1</span>
                <span className="text-xs text-typhoon-muted font-medium mt-1 block">Deals Closed This Wk</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-12 gap-6 items-start">
            <div className="col-span-8">
              <DataTable
                filterChips={[
                  { id: 'all', label: 'All My Inquiries (5)' },
                  { id: 'visit', label: 'Surveys Due (2)' },
                  { id: 'quote', label: 'Quotes Needed (1)' },
                ]}
                activeChip={activeFilter}
                onChipSelect={setActiveFilter}
                items={desktopSalesRows}
                onRowClick={(id) => router.push(`/inquiries/${id}`)}
              />
            </div>

            <div className="col-span-4">
              <SidePanel
                priorityTask={{
                  title: 'Site Visit · F-1024',
                  subtitle: 'Upload roof dimensions and shadow photos for Ramesh Patel',
                  badgeText: 'TODAY 2 PM',
                  onClick: () => router.push('/inquiries/F-1024'),
                }}
                teamStatuses={[
                  { id: '1', name: 'Nilesh Desai (F-1022)', role: '6 kW Quote', statusText: 'Decision by tomorrow', isOverdue: false },
                  { id: '2', name: 'Chetan Shah (F-1019)', role: '3.24 kW Subsidy', statusText: 'Awaiting father call', isOverdue: false },
                ]}
              />
            </div>
          </div>
        </div>

        {/* MOBILE - Salesperson (Exact from role_home_screens_all_palettes.html) */}
        <div className="lg:hidden">
          <Header
            role="SALESPERSON"
            initials="RS"
            roleTitle="Salesperson"
            subtitle="Survey, quotation and closing"
          />
          <SummaryTiles
            role="SALESPERSON"
            tiles={[
              { icon: <Camera className="w-4 h-4" />, value: '2', label: 'Surveys today' },
              { icon: <FileText className="w-4 h-4" />, value: '3', label: 'Quotes pending' },
            ]}
          />
          <PriorityCard
            role="SALESPERSON"
            icon={<Camera className="w-4 h-4" />}
            title="Field survey · F-1024"
            subtitle="Ramesh Patel · upload photos"
            badgeText="Today"
            onClick={() => router.push('/inquiries/F-1024')}
          />
          <UpNextList role="SALESPERSON" items={mobileUpNext} />
          <MainButton
            role="SALESPERSON"
            icon={<Camera className="w-4 h-4" />}
            onClick={() => router.push('/inquiries')}
          >
            Start survey
          </MainButton>
        </div>
      </div>
    );
  }

  // =========================================================================
  // 3. MATERIAL MANAGER (Sohail bhai - Matching Screen 3)
  // =========================================================================
  if (user.role === 'MATERIAL_MANAGER') {
    const mobileUpNext: UpNextItem[] = [
      {
        id: '1',
        icon: <Package className="w-4 h-4" />,
        title: 'Material unload · F-1018',
        subtitle: 'Add date and upload delivery proof · Bhavna Joshi',
        badgeText: 'Today',
        badgeType: 'today',
      },
      {
        id: '2',
        icon: <FileText className="w-4 h-4" />,
        title: 'Verify serial numbers',
        subtitle: 'Panel and inverter barcode scan',
        badgeText: 'Review',
        badgeType: 'docs',
      },
    ];

    const desktopMaterialRows: DataRowItem[] = [
      {
        id: 'F-1018',
        icon: <Package className="w-4 h-4 text-emerald-600" />,
        title: 'F-1018 · Bhavna Joshi',
        subtitle: 'SR No. Issued · Plan 3.24 kW panels & structure delivery',
        badgeText: 'Plan Dispatch',
        badgeStyle: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      },
      {
        id: 'F-1015',
        icon: <Upload className="w-4 h-4 text-sky-600" />,
        title: 'F-1015 · Diwan Zakirbhai',
        subtitle: 'Material Delivered · Upload rooftop photo proof to notify Meera',
        badgeText: 'Proof Pending',
        badgeStyle: 'bg-sky-50 text-sky-700 border-sky-200',
      },
    ];

    return (
      <div>
        {/* DESKTOP */}
        <div className="hidden lg:block space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-serif font-bold text-typhoon-navy tracking-tight">
                Material Store & Dispatch
              </h1>
              <p className="text-xs text-typhoon-muted mt-1">
                Hardware allocation, rooftop unloads, and photo proof verification
              </p>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4">
            <div className="bg-white rounded-2xl border border-typhoon-border shadow-soft p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-typhoon-sand flex items-center justify-center text-typhoon-navy">
                <Package className="w-6 h-6 text-typhoon-gold" />
              </div>
              <div>
                <span className="text-2xl font-serif font-bold text-typhoon-navy block leading-none">4</span>
                <span className="text-xs text-typhoon-muted font-medium mt-1 block">SR No. Received</span>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-typhoon-border shadow-soft p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
                <Upload className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <span className="text-2xl font-serif font-bold text-typhoon-navy block leading-none">1</span>
                <span className="text-xs text-typhoon-muted font-medium mt-1 block">Unloading Today</span>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-typhoon-border shadow-soft p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-sky-50 flex items-center justify-center text-sky-600">
                <FileText className="w-6 h-6 text-sky-600" />
              </div>
              <div>
                <span className="text-2xl font-serif font-bold text-typhoon-navy block leading-none">3</span>
                <span className="text-xs text-typhoon-muted font-medium mt-1 block">Proof Verified</span>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-typhoon-border shadow-soft p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                <CheckCircle2 className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <span className="text-2xl font-serif font-bold text-typhoon-navy block leading-none">₹8.4L</span>
                <span className="text-xs text-typhoon-muted font-medium mt-1 block">Milestones Triggered</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-12 gap-6 items-start">
            <div className="col-span-8">
              <DataTable
                filterChips={[
                  { id: 'all', label: 'All Dispatches (4)' },
                  { id: 'plan', label: 'Plan Dispatch (1)' },
                  { id: 'proof', label: 'Proof Pending (1)' },
                ]}
                activeChip={activeFilter}
                onChipSelect={setActiveFilter}
                items={desktopMaterialRows}
                onRowClick={(id) => router.push(`/material/projects/${id}`)}
              />
            </div>

            <div className="col-span-4">
              <SidePanel
                priorityTask={{
                  title: 'SR No. Received · F-1024',
                  subtitle: 'Allocate panels and arrange tempo for Ramesh Patel',
                  badgeText: 'PLAN DISPATCH',
                  onClick: () => router.push('/material/projects/F-1024'),
                }}
                teamStatuses={[
                  { id: '1', name: 'Diwan Zakirbhai (F-1015)', role: '10 kW', statusText: 'Unloaded, awaiting photo proof', isOverdue: false },
                ]}
              />
            </div>
          </div>
        </div>

        {/* MOBILE - Material Manager (Exact from role_home_screens_all_palettes.html) */}
        <div className="lg:hidden">
          <Header
            role="MATERIAL_MANAGER"
            initials="MM"
            roleTitle="Material Manager"
            subtitle="Stock, dispatch and orders"
          />
          <SummaryTiles
            role="MATERIAL_MANAGER"
            tiles={[
              { icon: <Package className="w-4 h-4" />, value: '4', label: 'Low stock items' },
              { icon: <Truck className="w-4 h-4" />, value: '6', label: 'Dispatches today' },
            ]}
          />
          <PriorityCard
            role="MATERIAL_MANAGER"
            icon={<Truck className="w-4 h-4" />}
            title="Dispatch · F-1024"
            subtitle="Ramesh Patel · 12 panels, 1 inverter"
            badgeText="Today"
            onClick={() => router.push('/material/projects/F-1024')}
          />
          <UpNextList
            role="MATERIAL_MANAGER"
            items={[
              {
                id: '1',
                icon: <Package className="w-4 h-4" />,
                title: 'F-1024 · Ramesh Patel',
                subtitle: '6 kW · Panels, inverter · Pack items',
                badgeText: 'Urgent',
                badgeType: 'urgent',
                onClick: () => router.push('/material/projects/F-1024'),
              },
              {
                id: '2',
                icon: <Package className="w-4 h-4" />,
                title: 'F-1026 · Test User',
                subtitle: '7 kW · Cables · Awaiting stock',
                badgeText: 'New',
                badgeType: 'bn',
                onClick: () => router.push('/material/projects/F-1026'),
              },
              {
                id: '3',
                icon: <Package className="w-4 h-4" />,
                title: 'F-1025 · Qureshi Mohammed Zahid',
                subtitle: '6 kW · Structure · Verify count',
                badgeText: 'New',
                badgeType: 'bn',
                onClick: () => router.push('/material/projects/F-1025'),
              },
            ]}
          />
          <MainButton
            role="MATERIAL_MANAGER"
            icon={<Scan className="w-4 h-4" />}
            onClick={() => router.push('/material/projects/F-1024')}
          >
            Scan material
          </MainButton>
        </div>
      </div>
    );
  }

  if (user.role === 'PORTAL_USER' || user.role === 'INSTALLATION_TEAM' || user.role === 'SERVICE_TECH') {
    return <OtherRoleDashboards user={user} />;
  }

  // =========================================================================
  // 4. ACCOUNTANT (Meera - Matching Screen 1)
  // =========================================================================
  return (
    <div>
      {/* DESKTOP */}
      <div className="hidden lg:block space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-serif font-bold text-typhoon-navy tracking-tight">
              Payments & Milestone Ledger
            </h1>
            <p className="text-xs text-typhoon-muted mt-1">
              80% material unload & 20% net meter handover milestone collections
            </p>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl border border-typhoon-border shadow-soft p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
              <IndianRupee className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <span className="text-2xl font-serif font-bold text-typhoon-navy block leading-none">₹8.4L</span>
              <span className="text-xs text-typhoon-muted font-medium mt-1 block">Pending Collections</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-typhoon-border shadow-soft p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
              <CheckCircle2 className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <span className="text-2xl font-serif font-bold text-emerald-700 block leading-none">82%</span>
              <span className="text-xs text-typhoon-muted font-medium mt-1 block">Collection Rate</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-typhoon-border shadow-soft p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-sky-50 flex items-center justify-center text-sky-600">
              <Clock className="w-6 h-6 text-sky-600" />
            </div>
            <div>
              <span className="text-2xl font-serif font-bold text-typhoon-navy block leading-none">3</span>
              <span className="text-xs text-typhoon-muted font-medium mt-1 block">Net Meter handovers</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-typhoon-border shadow-soft p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600">
              <AlertTriangle className="w-6 h-6 text-rose-600" />
            </div>
            <div>
              <span className="text-2xl font-serif font-bold text-rose-700 block leading-none">1</span>
              <span className="text-xs text-rose-600 font-medium mt-1 block">Overdue Payment</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6 items-start">
          <div className="col-span-8">
            <DataTable
              filterChips={[
                { id: 'all', label: 'All Milestones (8)' },
                { id: '80', label: '80% Unload (5)' },
                { id: '20', label: '20% Net Meter (3)' },
              ]}
              activeChip={activeFilter}
              onChipSelect={setActiveFilter}
              items={[
                {
                  id: 'F-1024',
                  icon: <IndianRupee className="w-4 h-4 text-rose-600" />,
                  title: 'F-1024 · Ramesh Patel',
                  subtitle: '80% Material Unload Due: ₹1,49,171 · Unloaded 2 days ago',
                  badgeText: 'Payment Due',
                  badgeStyle: 'bg-rose-50 text-rose-700 border-rose-200',
                },
                {
                  id: 'F-1018',
                  icon: <IndianRupee className="w-4 h-4 text-emerald-600" />,
                  title: 'F-1018 · Bhavna Joshi',
                  subtitle: '80% Material Milestone: ₹1,08,464 · Paid via NEFT',
                  badgeText: 'Collected',
                  badgeStyle: 'bg-emerald-50 text-emerald-700 border-emerald-200',
                },
              ]}
              onRowClick={(id) => router.push(`/inquiries/${id}`)}
            />
          </div>

          <div className="col-span-4">
            <SidePanel
              priorityTask={{
                title: 'Collect 80% · F-1024',
                subtitle: 'Send WhatsApp payment link to Ramesh Patel (₹1,49,171)',
                badgeText: 'ACTION NEEDED',
                onClick: () => router.push('/inquiries/F-1024'),
              }}
              teamStatuses={[
                { id: '1', name: 'Ramesh Patel (F-1024)', role: '₹1.49L Due', statusText: 'Unloaded yesterday', isOverdue: true },
              ]}
            />
          </div>
        </div>
      </div>

      {/* MOBILE - Accountant (Exact from role_home_screens_all_palettes.html) */}
      <div className="lg:hidden">
        <Header
          role="ACCOUNTANT"
          initials="AC"
          roleTitle="Accountant"
          subtitle="Invoices, payments and ledgers"
        />
        <SummaryTiles
          role="ACCOUNTANT"
          tiles={[
            { icon: <Receipt className="w-4 h-4" />, value: '7', label: 'Invoices due' },
            { icon: <Wallet className="w-4 h-4" />, value: '3', label: 'Payments received' },
          ]}
        />
        <PriorityCard
          role="ACCOUNTANT"
          icon={<Receipt className="w-4 h-4" />}
          title="Invoice · F-1024"
          subtitle="Ramesh Patel · ₹ 1.8L due"
          badgeText="Today"
          onClick={() => router.push('/payments')}
        />
        <UpNextList
          role="ACCOUNTANT"
          items={[
            {
              id: '1',
              icon: <Receipt className="w-4 h-4" />,
              title: 'F-1024 · Ramesh Patel',
              subtitle: '₹ 1.8L · Vadodara · Send reminder',
              badgeText: 'Urgent',
              badgeType: 'urgent',
              onClick: () => router.push('/payments'),
            },
            {
              id: '2',
              icon: <FileText className="w-4 h-4" />,
              title: 'F-1026 · Test User',
              subtitle: '₹ 2.1L · Vadodara · Raise invoice',
              badgeText: 'New',
              badgeType: 'bn',
              onClick: () => router.push('/payments'),
            },
            {
              id: '3',
              icon: <FileText className="w-4 h-4" />,
              title: 'F-1025 · Qureshi Mohammed Zahid',
              subtitle: '₹ 1.9L · Vadodara · Raise invoice',
              badgeText: 'New',
              badgeType: 'bn',
              onClick: () => router.push('/payments'),
            },
          ]}
        />
        <MainButton
          role="ACCOUNTANT"
          icon={<Wallet className="w-4 h-4" />}
          onClick={() => router.push('/payments')}
        >
          Record payment
        </MainButton>
      </div>
    </div>
  );
}

// Support for other roles if they open Dashboard
function OtherRoleDashboards({ user }: { user: any }) {
  const router = useRouter();
  if (user.role === 'PORTAL_USER') {
    return (
      <div className="lg:hidden">
        <Header
          role="PORTAL_USER"
          initials="PU"
          roleTitle="My Solar Project"
          subtitle="Progress, documents and payments"
        />
        <SummaryTiles
          role="PORTAL_USER"
          tiles={[
            { icon: <Sun className="w-4 h-4" />, value: '3/6', label: 'Stages done' },
            { icon: <FileText className="w-4 h-4" />, value: '2', label: 'Documents ready' },
          ]}
        />
        <PriorityCard
          role="PORTAL_USER"
          icon={<Sun className="w-4 h-4" />}
          title="Site visit · F-1024"
          subtitle="Typhoon team · arriving 11 AM"
          badgeText="Today"
          onClick={() => router.push('/portal')}
        />
        <UpNextList
          role="PORTAL_USER"
          items={[
            {
              id: '1',
              icon: <CheckSquare className="w-4 h-4" />,
              title: 'Survey',
              subtitle: 'Completed · 12 Nov',
              badgeText: 'Done',
              badgeType: 'bg',
              onClick: () => router.push('/portal'),
            },
            {
              id: '2',
              icon: <FileText className="w-4 h-4" />,
              title: 'Quotation',
              subtitle: '6 kW · Review and accept',
              badgeText: 'Action',
              badgeType: 'bn',
              onClick: () => router.push('/portal'),
            },
            {
              id: '3',
              icon: <Wrench className="w-4 h-4" />,
              title: 'Installation',
              subtitle: 'Scheduled · 20 Nov',
              badgeText: 'Soon',
              badgeType: 'bn',
              onClick: () => router.push('/portal'),
            },
          ]}
        />
        <MainButton
          role="PORTAL_USER"
          icon={<Wallet className="w-4 h-4" />}
          onClick={() => router.push('/portal')}
        >
          View project
        </MainButton>
      </div>
    );
  }

  if (user.role === 'INSTALLATION_TEAM') {
    return (
      <div className="lg:hidden">
        <Header
          role="INSTALLATION_TEAM"
          initials="IT"
          roleTitle="Install Team"
          subtitle="Installation and commissioning"
        />
        <SummaryTiles
          role="INSTALLATION_TEAM"
          tiles={[
            { icon: <Wrench className="w-4 h-4" />, value: '2', label: 'Installs today' },
            { icon: <CheckSquare className="w-4 h-4" />, value: '3', label: 'Checklists open' },
          ]}
        />
        <PriorityCard
          role="INSTALLATION_TEAM"
          icon={<Wrench className="w-4 h-4" />}
          title="Installation · F-1024"
          subtitle="Ramesh Patel · Vadodara · 6 kW"
          badgeText="Today"
          onClick={() => router.push('/installation')}
        />
        <UpNextList
          role="INSTALLATION_TEAM"
          items={[
            {
              id: '1',
              icon: <Wrench className="w-4 h-4" />,
              title: 'F-1024 · Ramesh Patel',
              subtitle: '6 kW · Vadodara · Mount panels',
              badgeText: 'Urgent',
              badgeType: 'urgent',
              onClick: () => router.push('/installation'),
            },
            {
              id: '2',
              icon: <CheckSquare className="w-4 h-4" />,
              title: 'F-1026 · Test User',
              subtitle: '7 kW · Vadodara · Safety check',
              badgeText: 'New',
              badgeType: 'bn',
              onClick: () => router.push('/installation'),
            },
            {
              id: '3',
              icon: <CheckSquare className="w-4 h-4" />,
              title: 'F-1025 · Qureshi Mohammed Zahid',
              subtitle: '6 kW · Vadodara · Commissioning',
              badgeText: 'New',
              badgeType: 'bn',
              onClick: () => router.push('/installation'),
            },
          ]}
        />
        <MainButton
          role="INSTALLATION_TEAM"
          icon={<Wrench className="w-4 h-4" />}
          onClick={() => router.push('/installation')}
        >
          Start installation
        </MainButton>
      </div>
    );
  }

  if (user.role === 'SERVICE_TECH') {
    return (
      <div className="lg:hidden">
        <Header
          role="SERVICE_TECH"
          initials="ST"
          roleTitle="Service technician"
          subtitle="Warranty, cleaning and maintenance"
        />
        <SummaryTiles
          tiles={[
            { icon: <AlertTriangle className="w-4 h-4 text-[#facc15]" />, value: '3', label: 'Open tickets' },
            { icon: <CheckCircle2 className="w-4 h-4 text-[#facc15]" />, value: '2', label: 'Cleaning visits' },
          ]}
        />
        <PriorityCard
          role="SERVICE_TECH"
          icon={<AlertTriangle className="w-5 h-5 text-[#facc15]" />}
          title="Warranty ticket · T-204"
          subtitle="Inverter problem · visit today"
          badgeText="Urgent"
          onClick={() => router.push('/dashboard')}
        />
        <UpNextList
          items={[
            {
              id: '1',
              icon: <Camera className="w-4 h-4" />,
              title: 'Inverter warranty · T-204',
              subtitle: 'Upload photos',
              badgeText: 'Urgent',
              badgeType: 'due',
            },
            {
              id: '2',
              icon: <Clock className="w-4 h-4" />,
              title: 'Solar cleaning · F-1010',
              subtitle: 'Scheduled tomorrow',
              badgeText: 'Next',
              badgeType: 'active',
            },
          ]}
        />
        <MainButton
          role="SERVICE_TECH"
          icon={<Plus className="w-4 h-4" />}
          onClick={() => router.push('/dashboard')}
        >
          + New service ticket
        </MainButton>
      </div>
    );
  }

  return null;
}
