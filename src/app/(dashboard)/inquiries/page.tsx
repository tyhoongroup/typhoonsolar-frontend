'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search,
  Filter,
  Calendar,
  Phone,
  MessageSquare,
  ChevronRight,
  Plus,
  Clock,
  User,
  CheckCircle2,
  AlertCircle,
  FileText,
  Calculator,
  ShieldCheck,
  Package,
  Wrench,
  IndianRupee,
  MapPin,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  X,
  Send,
  Eye,
} from 'lucide-react';
import { Header } from '@/components/Header';
import { SummaryTiles } from '@/components/SummaryTiles';
import { useCurrentUser } from '@/lib/use-current-user';
import { toast } from 'sonner';

interface InquiryItem {
  id: string; // e.g. F-1024
  projectId: string; // e.g. TYP-2026-1024
  customerName: string;
  phone: string;
  address: string;
  city: 'Anand' | 'Vadodara' | 'Nadiad';
  systemKw: number;
  phase: 'Single Phase' | 'Three Phase';
  terraceType: 'RCC Terrace' | 'Tin Shed' | 'Elevated Superstructure';
  createdAt: string; // YYYY-MM-DD
  hasVisit: boolean;
  visitDate?: string;
  hasQuotation: boolean;
  quoteAmount?: number;
  currentStageNumber: number; // 1 to 10
  currentStageName: string;
  assignedUser: {
    name: string;
    role: string;
    phone: string;
  };
  followupCount: number;
  lastFollowupDate: string;
  nextFollowupDate: string;
  isOverdue: boolean;
  followups: {
    id: string;
    loggedBy: string;
    role: string;
    timestamp: string;
    channel: 'Phone Call' | 'Terrace Visit' | 'WhatsApp';
    customerReaction: 'Very Positive' | 'Negotiating' | 'Needs Subsidy Info' | 'Hesitant';
    reactionColor: string;
    notes: string;
    nextStep: string;
    committedDate: string;
  }[];
}

// 10-Stage Rooftop Solar Project Lifecycle
const SOLAR_LIFECYCLE_STAGES = [
  { stage: 1, name: 'Lead Captured', department: 'Sales', defaultUser: 'Amit Patel (Sales Rep)' },
  { stage: 2, name: 'Terrace Site Survey', department: 'Sales & Engineering', defaultUser: 'Amit Patel (Sales Rep)' },
  { stage: 3, name: 'Quotation Prepared', department: 'Sales', defaultUser: 'Amit Patel (Sales Rep)' },
  { stage: 4, name: 'Deal Closed & Token', department: 'Sales', defaultUser: 'Amit Patel (Sales Rep)' },
  { stage: 5, name: 'Surya Gujarat Portal Registration', department: 'DISCOM Liaison', defaultUser: 'Rahul Patel (Portal User)' },
  { stage: 6, name: 'BOM Dispatch & Material Unload', department: 'Warehouse & Logistics', defaultUser: 'Sohail Khan (Store Lead)' },
  { stage: 7, name: 'Structure Fabrication & Wiring', department: 'Installation Team', defaultUser: 'Rajesh Kumar (Site Lead)' },
  { stage: 8, name: 'CEI & Net Meter Installation', department: 'DISCOM Liaison', defaultUser: 'Rahul Patel (Portal User)' },
  { stage: 9, name: 'PM Surya Ghar Subsidy Claim', department: 'Portal & Accounts', defaultUser: 'Rahul Patel (Portal User)' },
  { stage: 10, name: 'Final 20% Payment Settlement', department: 'Finance & Accounts', defaultUser: 'Meera Shah (Accountant)' },
];

const INITIAL_INQUIRIES: InquiryItem[] = [
  {
    id: 'F-1024',
    projectId: 'TYP-2026-1024',
    customerName: 'Ramesh Patel',
    phone: '+91 98250 12345',
    address: 'B-42 Shivalik Bungalows, 100ft Road',
    city: 'Anand',
    systemKw: 6.0,
    phase: 'Three Phase',
    terraceType: 'RCC Terrace',
    createdAt: '2026-11-12',
    hasVisit: false,
    hasQuotation: false,
    currentStageNumber: 1,
    currentStageName: 'Lead Captured',
    assignedUser: {
      name: 'Amit Patel',
      role: 'Sales Representative',
      phone: '+91 90000 00002',
    },
    followupCount: 2,
    lastFollowupDate: 'Today, 10:15 AM',
    nextFollowupDate: 'Today 11:00 AM (Overdue)',
    isOverdue: true,
    followups: [
      {
        id: 'FUP-101',
        loggedBy: 'Amit Patel',
        role: 'Sales Representative',
        timestamp: 'Today, 10:15 AM',
        channel: 'Phone Call',
        customerReaction: 'Very Positive',
        reactionColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        notes: 'Customer inquired about 6 kW PM Surya Ghar ₹78,000 subsidy eligibility. Monthly bill is ₹3,800. Needs terrace inspection.',
        nextStep: 'Visit terrace for structural survey & take photo of DISCOM meter',
        committedDate: 'Today 11:00 AM',
      },
      {
        id: 'FUP-102',
        loggedBy: 'Amit Kumar',
        role: 'Operations Manager',
        timestamp: 'Today, 11:30 AM',
        channel: 'Phone Call',
        customerReaction: 'Very Positive',
        reactionColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        notes: 'Escalated to Amit Patel due to 2-hour SLA delay on site visit scheduling.',
        nextStep: 'Complete terrace survey by 2:00 PM',
        committedDate: 'Today 2:00 PM',
      },
    ],
  },
  {
    id: 'F-1021',
    projectId: 'TYP-2026-1021',
    customerName: 'Nilesh Desai',
    phone: '+91 98251 23456',
    address: '14, Gotri Heritage, Gotri Sevasi Road',
    city: 'Vadodara',
    systemKw: 6.0,
    phase: 'Three Phase',
    terraceType: 'RCC Terrace',
    createdAt: '2026-11-10',
    hasVisit: true,
    visitDate: '2026-11-11',
    hasQuotation: true,
    quoteAmount: 275000,
    currentStageNumber: 3,
    currentStageName: 'Quotation Prepared',
    assignedUser: {
      name: 'Amit Patel',
      role: 'Sales Representative',
      phone: '+91 90000 00002',
    },
    followupCount: 3,
    lastFollowupDate: 'Today, 09:30 AM',
    nextFollowupDate: 'Today 3:30 PM',
    isOverdue: false,
    followups: [
      {
        id: 'FUP-201',
        loggedBy: 'Amit Patel',
        role: 'Sales Representative',
        timestamp: '11 Nov 2026, 11:00 AM',
        channel: 'Terrace Visit',
        customerReaction: 'Very Positive',
        reactionColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        notes: 'Terrace survey completed. 550 sq.ft shadow-free RCC area. Discom consumer number verified.',
        nextStep: 'Prepare 6 kW quotation with 550W Mono Bifacial modules',
        committedDate: '11 Nov 2026, 04:00 PM',
      },
      {
        id: 'FUP-202',
        loggedBy: 'Amit Patel',
        role: 'Sales Representative',
        timestamp: '12 Nov 2026, 02:00 PM',
        channel: 'WhatsApp',
        customerReaction: 'Negotiating',
        reactionColor: 'bg-amber-50 text-amber-700 border-amber-200',
        notes: 'Sent formal quotation for ₹2,75,000 net after PM Surya Ghar subsidy. Customer requested 10-year inverter warranty extension.',
        nextStep: 'Send revised quotation with Growatt warranty clause',
        committedDate: 'Today 3:30 PM',
      },
    ],
  },
  {
    id: 'F-1018',
    projectId: 'TYP-2026-1018',
    customerName: 'Bhavna Joshi',
    phone: '+91 98252 34567',
    address: 'Near Santram Mandir, Station Road',
    city: 'Nadiad',
    systemKw: 3.24,
    phase: 'Single Phase',
    terraceType: 'RCC Terrace',
    createdAt: '2026-11-08',
    hasVisit: true,
    visitDate: '2026-11-09',
    hasQuotation: true,
    quoteAmount: 160000,
    currentStageNumber: 4,
    currentStageName: 'Deal Closed & Token Received',
    assignedUser: {
      name: 'Priya Sharma',
      role: 'Sales Engineer',
      phone: '+91 90000 00005',
    },
    followupCount: 4,
    lastFollowupDate: 'Yesterday, 04:00 PM',
    nextFollowupDate: 'Tomorrow 10:00 AM',
    isOverdue: false,
    followups: [
      {
        id: 'FUP-301',
        loggedBy: 'Priya Sharma',
        role: 'Sales Engineer',
        timestamp: '10 Nov 2026, 03:00 PM',
        channel: 'Phone Call',
        customerReaction: 'Very Positive',
        reactionColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        notes: 'Customer agreed on ₹1,60,000 for 3.24 kW. Paid ₹10,000 token advance via UPI.',
        nextStep: 'Collect KYC Aadhaar, Light Bill & Property tax receipt for Portal login',
        committedDate: '12 Nov 2026, 12:00 PM',
      },
    ],
  },
  {
    id: 'F-1015',
    projectId: 'TYP-2026-1015',
    customerName: 'Diwan Zakirbhai',
    phone: '+91 98253 45678',
    address: 'Plot 88, GIDC Industrial Estate',
    city: 'Anand',
    systemKw: 10.0,
    phase: 'Three Phase',
    terraceType: 'Tin Shed',
    createdAt: '2026-11-05',
    hasVisit: true,
    visitDate: '2026-11-06',
    hasQuotation: true,
    quoteAmount: 460000,
    currentStageNumber: 6,
    currentStageName: 'Material Dispatched & Unload Due',
    assignedUser: {
      name: 'Sohail Khan',
      role: 'Store Lead',
      phone: '+91 90000 00004',
    },
    followupCount: 5,
    lastFollowupDate: 'Today, 08:30 AM',
    nextFollowupDate: 'Tomorrow 09:00 AM',
    isOverdue: false,
    followups: [
      {
        id: 'FUP-401',
        loggedBy: 'Sohail Khan',
        role: 'Store Lead',
        timestamp: 'Today, 08:30 AM',
        channel: 'WhatsApp',
        customerReaction: 'Very Positive',
        reactionColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        notes: '18 DCR solar panels (550W) and 10 kW Growatt inverter loaded onto delivery truck. Scheduled to reach terrace tomorrow morning.',
        nextStep: 'Coordinate with customer for terrace gate access and 80% unload payment cheque',
        committedDate: 'Tomorrow 09:00 AM',
      },
    ],
  },
  {
    id: 'F-1012',
    projectId: 'TYP-2026-1012',
    customerName: 'Harishbhai Shah',
    phone: '+91 98254 56789',
    address: 'A-12, Sun Villa, Vasna Road',
    city: 'Vadodara',
    systemKw: 4.5,
    phase: 'Three Phase',
    terraceType: 'RCC Terrace',
    createdAt: '2026-11-01',
    hasVisit: true,
    visitDate: '2026-11-02',
    hasQuotation: true,
    quoteAmount: 220000,
    currentStageNumber: 7,
    currentStageName: 'Structure Fabrication & Wiring',
    assignedUser: {
      name: 'Rajesh Kumar',
      role: 'Installation Lead',
      phone: '+91 90000 00006',
    },
    followupCount: 4,
    lastFollowupDate: 'Yesterday, 06:00 PM',
    nextFollowupDate: '15 Nov 2026',
    isOverdue: false,
    followups: [
      {
        id: 'FUP-501',
        loggedBy: 'Rajesh Kumar',
        role: 'Installation Lead',
        timestamp: 'Yesterday, 06:00 PM',
        channel: 'Terrace Visit',
        customerReaction: 'Very Positive',
        reactionColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        notes: 'Superstructure columns anchor bolted and grouted. Earthing pits completed. Inverter mounting in progress.',
        nextStep: 'Complete DC wiring, string test and submit photo checklist for CEI meter inspection',
        committedDate: '15 Nov 2026, 05:00 PM',
      },
    ],
  },
  {
    id: 'F-1009',
    projectId: 'TYP-2026-1009',
    customerName: 'Kiritbhai Parekh',
    phone: '+91 98255 67890',
    address: 'Near Dairy Circle, Amul Road',
    city: 'Anand',
    systemKw: 5.0,
    phase: 'Three Phase',
    terraceType: 'RCC Terrace',
    createdAt: '2026-10-28',
    hasVisit: true,
    visitDate: '2026-10-29',
    hasQuotation: true,
    quoteAmount: 240000,
    currentStageNumber: 8,
    currentStageName: 'CEI & Net Meter Installation',
    assignedUser: {
      name: 'Rahul Patel',
      role: 'Portal Officer',
      phone: '+91 90000 00003',
    },
    followupCount: 6,
    lastFollowupDate: '12 Nov 2026, 11:00 AM',
    nextFollowupDate: 'Today 04:00 PM',
    isOverdue: false,
    followups: [
      {
        id: 'FUP-601',
        loggedBy: 'Rahul Patel',
        role: 'Portal Officer',
        timestamp: '12 Nov 2026, 11:00 AM',
        channel: 'Phone Call',
        customerReaction: 'Very Positive',
        reactionColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        notes: 'CEI inspector approved installation work. Meter file handed over to MGVCL Anand office for bi-directional net meter release.',
        nextStep: 'Confirm net meter physical installation by DISCOM lineman',
        committedDate: 'Today 04:00 PM',
      },
    ],
  },
  {
    id: 'F-1006',
    projectId: 'TYP-2026-1006',
    customerName: 'Maheshbhai Vora',
    phone: '+91 98256 78901',
    address: 'Opp. Jubilee Garden, Raopura',
    city: 'Vadodara',
    systemKw: 3.0,
    phase: 'Single Phase',
    terraceType: 'RCC Terrace',
    createdAt: '2026-10-22',
    hasVisit: false,
    hasQuotation: false,
    currentStageNumber: 1,
    currentStageName: 'Lead Captured',
    assignedUser: {
      name: 'Kunal Joshi',
      role: 'Senior Sales Rep',
      phone: '+91 90000 00007',
    },
    followupCount: 1,
    lastFollowupDate: '10 Nov 2026',
    nextFollowupDate: 'Yesterday (Overdue)',
    isOverdue: true,
    followups: [
      {
        id: 'FUP-701',
        loggedBy: 'Kunal Joshi',
        role: 'Senior Sales Rep',
        timestamp: '10 Nov 2026, 05:00 PM',
        channel: 'Phone Call',
        customerReaction: 'Needs Subsidy Info',
        reactionColor: 'bg-blue-50 text-blue-700 border-blue-200',
        notes: 'Customer asked how ₹78,000 PM Surya Ghar subsidy is credited directly to bank account. No site visit scheduled yet.',
        nextStep: 'Call customer to schedule terrace shadow survey',
        committedDate: '11 Nov 2026, 11:00 AM',
      },
    ],
  },
];

export default function AllInquiriesPage() {
  const router = useRouter();
  const { user, theme } = useCurrentUser();

  // Active Main Tab
  const [activeTab, setActiveTab] = useState<'list' | 'stages'>('list');

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedQuickFilter, setSelectedQuickFilter] = useState<
    'all' | 'no-visit' | 'no-quote' | 'overdue' | 'deal-closed' | 'execution'
  >('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedCity, setSelectedCity] = useState<string>('all');

  // Expanded Inquiry for Follow-up Drawer / Stage Inspection
  const [expandedInquiryId, setExpandedInquiryId] = useState<string | null>('F-1024');

  // Quick Follow-up Form Modal
  const [isFollowupModalOpen, setIsFollowupModalOpen] = useState(false);
  const [followupInquiryId, setFollowupInquiryId] = useState('F-1024');
  const [channel, setChannel] = useState<'Phone Call' | 'Terrace Visit' | 'WhatsApp'>('Phone Call');
  const [reaction, setReaction] = useState<'Very Positive' | 'Negotiating' | 'Needs Subsidy Info' | 'Hesitant'>('Very Positive');
  const [notes, setNotes] = useState('');
  const [nextStep, setNextStep] = useState('');
  const [committedDate, setCommittedDate] = useState('Today, 5:00 PM');

  // Data State
  const [inquiries, setInquiries] = useState<InquiryItem[]>(INITIAL_INQUIRIES);

  // Live Data Fetching from Backend Database
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) return;

    fetch('/api/v1/inquiries', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        const list = Array.isArray(data) ? data : (data?.data || []);
        if (Array.isArray(list) && list.length > 0) {
          const mapped: InquiryItem[] = list.map((d: any) => {
            const rawId = d.followupId || d.id;
            const numeric = rawId.replace(/\D/g, '') || '1025';
            const stageMapping: Record<string, { num: number; name: string }> = {
              INQUIRY_RECEIVED: { num: 1, name: 'Lead Captured' },
              SITE_VISIT_PLANNED: { num: 2, name: 'Terrace Site Survey' },
              QUOTATION_SENT: { num: 3, name: 'Quotation Prepared' },
              DEAL_CLOSED: { num: 4, name: 'Deal Closed & Token' },
              GOVT_DOCS_SUBMITTED: { num: 5, name: 'National Portal Registration' },
              SR_NUMBER_ISSUED: { num: 6, name: 'DISCOM SR Verification' },
              MATERIAL_PLANNED: { num: 7, name: 'Material Matching & Dispatch' },
              MATERIAL_UNLOADED: { num: 8, name: 'Unload & 80% Payment' },
              INSTALLATION_DONE: { num: 9, name: 'Mechanical & Electrical Install' },
              METER_FILE_SUBMITTED: { num: 10, name: 'Bi-directional Net Meter' },
              METER_STARTED: { num: 10, name: 'Bi-directional Net Meter' },
              SUBSIDY_CLAIMED: { num: 10, name: 'Subsidy Claimed' },
              SUBSIDY_RECEIVED: { num: 10, name: 'DBT Subsidy Credited' },
              COMPLETED: { num: 10, name: 'Commissioned & Complete' },
            };
            const currentStage = stageMapping[d.currentStage] || { num: 1, name: 'Lead Captured' };

            return {
              id: rawId,
              projectId: `TYP-2026-${numeric}`,
              customerName: d.customerName,
              phone: d.customerPhone,
              address: d.address || d.city || 'Gujarat',
              city: (d.city as any) || 'Vadodara',
              systemKw: Number(d.requestedKw) || 6.0,
              phase: (d.meterPhase as any) || 'Single Phase',
              terraceType: 'RCC Terrace',
              createdAt: d.createdAt ? d.createdAt.split('T')[0] : '2026-11-16',
              hasVisit: currentStage.num >= 2,
              hasQuotation: currentStage.num >= 3,
              currentStageNumber: currentStage.num,
              currentStageName: currentStage.name,
              assignedUser: {
                name: d.assignedSalesperson?.fullName || 'Amit (Salesperson)',
                role: 'Sales Representative',
                phone: d.assignedSalesperson?.phone || '9000000002',
              },
              followupCount: d.followups?.length || 1,
              lastFollowupDate: d.createdAt
                ? new Date(d.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
                : 'Today',
              nextFollowupDate: 'Tomorrow, 5:00 PM',
              isOverdue: d.isUrgent ?? false,
              followups: (d.followups || []).map((f: any, idx: number) => ({
                id: f.id || `f-${idx}`,
                loggedBy: d.assignedSalesperson?.fullName || 'Amit (Sales)',
                role: 'Sales Representative',
                timestamp: f.createdAt ? new Date(f.createdAt).toLocaleDateString('en-IN') : 'Today',
                channel: 'Phone Call',
                customerReaction: 'Needs Subsidy Info',
                reactionColor: 'text-amber-700 bg-amber-50 border-amber-200',
                notes: f.description || 'Lead assigned to representative.',
                nextStep: f.nextStep || 'Follow-up with customer',
                committedDate: f.committedDate ? new Date(f.committedDate).toLocaleDateString('en-IN') : 'Tomorrow',
              })),
            };
          });

          // Merge live items with initial templates avoiding duplicates
          const liveIds = new Set(mapped.map((m) => m.id));
          const rest = INITIAL_INQUIRIES.filter((init) => !liveIds.has(init.id));
          setInquiries([...mapped, ...rest]);
        }
      })
      .catch(() => {});
  }, []);

  // Filter Computation
  const filteredInquiries = inquiries.filter((item) => {
    // 1. Search filter
    const matchesSearch =
      item.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.projectId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.phone.includes(searchQuery) ||
      item.city.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    // 2. City filter
    if (selectedCity !== 'all' && item.city !== selectedCity) return false;

    // 3. Quick Status Filter
    if (selectedQuickFilter === 'no-visit' && item.hasVisit) return false;
    if (selectedQuickFilter === 'no-quote' && item.hasQuotation) return false;
    if (selectedQuickFilter === 'overdue' && !item.isOverdue) return false;
    if (selectedQuickFilter === 'deal-closed' && item.currentStageNumber < 4) return false;
    if (selectedQuickFilter === 'execution' && (item.currentStageNumber < 5 || item.currentStageNumber > 8)) return false;

    // 4. Date Range Filter
    if (startDate && item.createdAt < startDate) return false;
    if (endDate && item.createdAt > endDate) return false;

    return true;
  });

  // KPI Calculations
  const totalCount = inquiries.length;
  const noVisitCount = inquiries.filter((i) => !i.hasVisit).length;
  const noQuoteCount = inquiries.filter((i) => !i.hasQuotation).length;
  const overdueCount = inquiries.filter((i) => i.isOverdue).length;

  const handleOpenAddFollowup = (id: string) => {
    setFollowupInquiryId(id);
    setIsFollowupModalOpen(true);
  };

  const handleSaveFollowup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!notes.trim()) {
      toast.error('Please enter discussion notes.');
      return;
    }

    const newRecord = {
      id: `FUP-${Date.now().toString().slice(-3)}`,
      loggedBy: user?.fullName || 'Amit Kumar',
      role: theme.roleName,
      timestamp: 'Just now',
      channel,
      customerReaction: reaction,
      reactionColor:
        reaction === 'Very Positive'
          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
          : reaction === 'Negotiating'
          ? 'bg-amber-50 text-amber-700 border-amber-200'
          : 'bg-blue-50 text-blue-700 border-blue-200',
      notes,
      nextStep: nextStep || 'Follow-up call with customer',
      committedDate,
    };

    setInquiries((prev) =>
      prev.map((item) => {
        if (item.id === followupInquiryId) {
          return {
            ...item,
            followupCount: item.followupCount + 1,
            lastFollowupDate: 'Just now',
            isOverdue: false,
            followups: [newRecord, ...item.followups],
          };
        }
        return item;
      })
    );

    toast.success(`Follow-up saved for ${followupInquiryId}!`);
    setIsFollowupModalOpen(false);
    setNotes('');
    setNextStep('');
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedQuickFilter('all');
    setSelectedCity('all');
    setStartDate('');
    setEndDate('');
    toast.info('Filters reset to All Inquiries.');
  };

  return (
    <div className="min-h-screen bg-typhoon-sand pb-24">
      {/* 1. Standard Responsive Header */}
      <Header
        role={user?.role || 'OPS_MANAGER'}
        initials={theme.tag}
        roleTitle="Control tower"
        subtitle="All inquiries, date filters & 10-stage lifecycle"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-4 space-y-5">
        {/* Page Title & Action Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-typhoon-navy tracking-tight">
              All Inquiries & Pipeline
            </h1>
            <p className="text-xs sm:text-sm text-typhoon-muted mt-0.5">
              Gujarat Rooftop Solar Inquiry Lifecycle & Stage Follow-up Tracker
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => router.push('/inquiries/new')}
              style={{
                backgroundColor: theme.hex.accentBg,
                color: theme.hex.accentTextColor,
              }}
              className="py-2.5 px-4 rounded-xl font-bold text-xs shadow-soft flex items-center gap-1.5 transition hover:opacity-95 cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Add New Inquiry</span>
            </button>
          </div>
        </div>

        {/* 2. Four Operational Metric Tiles */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div
            onClick={() => setSelectedQuickFilter('all')}
            className={`bg-white p-4 rounded-2xl border transition-all cursor-pointer shadow-soft ${
              selectedQuickFilter === 'all'
                ? 'border-typhoon-navy ring-2 ring-typhoon-navy/10'
                : 'border-typhoon-border hover:border-typhoon-navy/30'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-typhoon-muted">Total Inquiries</span>
              <FileText className="w-4 h-4 text-typhoon-navy" />
            </div>
            <p className="text-2xl sm:text-3xl font-serif font-bold text-typhoon-navy mt-1">
              {totalCount}
            </p>
            <span className="text-[11px] text-typhoon-muted mt-1 block">Across Anand & Vadodara</span>
          </div>

          <div
            onClick={() => setSelectedQuickFilter('no-visit')}
            className={`bg-white p-4 rounded-2xl border transition-all cursor-pointer shadow-soft ${
              selectedQuickFilter === 'no-visit'
                ? 'border-amber-500 ring-2 ring-amber-500/10'
                : 'border-typhoon-border hover:border-amber-400'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-amber-700">No Site Visit</span>
              <Calendar className="w-4 h-4 text-amber-600" />
            </div>
            <p className="text-2xl sm:text-3xl font-serif font-bold text-amber-700 mt-1">
              {noVisitCount}
            </p>
            <span className="text-[11px] text-amber-600/80 mt-1 block">Survey pending</span>
          </div>

          <div
            onClick={() => setSelectedQuickFilter('no-quote')}
            className={`bg-white p-4 rounded-2xl border transition-all cursor-pointer shadow-soft ${
              selectedQuickFilter === 'no-quote'
                ? 'border-sky-500 ring-2 ring-sky-500/10'
                : 'border-typhoon-border hover:border-sky-400'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-sky-700">No Quotation</span>
              <Calculator className="w-4 h-4 text-sky-600" />
            </div>
            <p className="text-2xl sm:text-3xl font-serif font-bold text-sky-700 mt-1">
              {noQuoteCount}
            </p>
            <span className="text-[11px] text-sky-600/80 mt-1 block">Proposal not created</span>
          </div>

          <div
            onClick={() => setSelectedQuickFilter('overdue')}
            className={`bg-white p-4 rounded-2xl border transition-all cursor-pointer shadow-soft ${
              selectedQuickFilter === 'overdue'
                ? 'border-rose-500 ring-2 ring-rose-500/10'
                : 'border-typhoon-border hover:border-rose-400'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-rose-700">Overdue SLA</span>
              <AlertCircle className="w-4 h-4 text-rose-600" />
            </div>
            <p className="text-2xl sm:text-3xl font-serif font-bold text-rose-700 mt-1">
              {overdueCount}
            </p>
            <span className="text-[11px] text-rose-600/80 mt-1 block">&gt;24h follow-up delay</span>
          </div>
        </div>

        {/* 3. Main View Mode Tabs (List vs Stage Tracker) */}
        <div className="bg-white p-1.5 rounded-2xl border border-typhoon-border shadow-xs flex items-center gap-1">
          <button
            onClick={() => setActiveTab('list')}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'list'
                ? 'bg-typhoon-navy text-white shadow-soft'
                : 'text-typhoon-muted hover:text-typhoon-navy hover:bg-typhoon-sand/40'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Inquiries Directory ({filteredInquiries.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('stages')}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'stages'
                ? 'bg-typhoon-navy text-white shadow-soft'
                : 'text-typhoon-muted hover:text-typhoon-navy hover:bg-typhoon-sand/40'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>10-Stage Lifecycle & Follow-ups</span>
          </button>
        </div>

        {/* 4. Comprehensive Filter Bar (Search, Quick Chips, Date Range) */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-typhoon-border shadow-soft space-y-3.5">
          {/* Top Row: Search input + City dropdown + Clear */}
          <div className="flex flex-col sm:flex-row gap-2.5 items-center">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-typhoon-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by customer name, phone, city, or ID (F-1024)..."
                className="w-full pl-10 pr-4 py-2.5 bg-typhoon-sand/30 border border-typhoon-border rounded-xl text-xs sm:text-sm font-medium text-typhoon-navy focus:border-typhoon-gold focus:outline-none transition"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-typhoon-muted hover:text-black"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full sm:w-auto px-4 py-2.5 bg-typhoon-sand/30 border border-typhoon-border rounded-xl text-xs sm:text-sm font-semibold text-typhoon-navy focus:outline-none"
            >
              <option value="all">All Cities (Gujarat)</option>
              <option value="Anand">Anand Hub</option>
              <option value="Vadodara">Vadodara Central</option>
              <option value="Nadiad">Nadiad Division</option>
            </select>

            {(searchQuery || selectedQuickFilter !== 'all' || selectedCity !== 'all' || startDate || endDate) && (
              <button
                onClick={handleClearFilters}
                className="w-full sm:w-auto py-2.5 px-3.5 rounded-xl text-xs font-bold text-rose-700 bg-rose-50 border border-rose-200 hover:bg-rose-100 transition whitespace-nowrap cursor-pointer"
              >
                Reset Filters
              </button>
            )}
          </div>

          {/* Middle Row: Quick Status Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-[11px] font-bold text-typhoon-muted uppercase tracking-wider mr-1 flex items-center gap-1 shrink-0">
              <Filter className="w-3.5 h-3.5" />
              Filter:
            </span>

            {[
              { id: 'all', label: 'All Inquiries' },
              { id: 'no-visit', label: 'No Site Visit' },
              { id: 'no-quote', label: 'No Quotation' },
              { id: 'overdue', label: 'Overdue Follow-up' },
              { id: 'deal-closed', label: 'Deal Closed & Token' },
              { id: 'execution', label: 'BOM & Installation' },
            ].map((chip) => {
              const active = selectedQuickFilter === chip.id;
              return (
                <button
                  key={chip.id}
                  onClick={() => setSelectedQuickFilter(chip.id as any)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    active
                      ? 'bg-typhoon-navy text-white shadow-xs'
                      : 'bg-typhoon-sand/40 text-typhoon-navy border border-typhoon-border/80 hover:bg-typhoon-sand'
                  }`}
                >
                  {chip.label}
                </button>
              );
            })}
          </div>

          {/* Bottom Row: Exact Date Range Selector */}
          <div className="pt-2 border-t border-typhoon-border/60 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-typhoon-navy flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-typhoon-gold" />
                Date Range:
              </span>

              <div className="flex items-center gap-1.5">
                <span className="text-typhoon-muted text-[11px]">From</span>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="px-2.5 py-1 bg-typhoon-sand/30 border border-typhoon-border rounded-lg text-xs font-semibold text-typhoon-navy focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-typhoon-muted text-[11px]">To</span>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="px-2.5 py-1 bg-typhoon-sand/30 border border-typhoon-border rounded-lg text-xs font-semibold text-typhoon-navy focus:outline-none"
                />
              </div>
            </div>

            {/* Quick date presets */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => {
                  setStartDate('2026-11-12');
                  setEndDate('2026-11-12');
                }}
                className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-typhoon-sand hover:bg-typhoon-sand-dark text-typhoon-navy transition"
              >
                Today
              </button>
              <button
                onClick={() => {
                  setStartDate('2026-11-05');
                  setEndDate('2026-11-12');
                }}
                className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-typhoon-sand hover:bg-typhoon-sand-dark text-typhoon-navy transition"
              >
                Last 7 Days
              </button>
              <button
                onClick={() => {
                  setStartDate('2026-11-01');
                  setEndDate('2026-11-30');
                }}
                className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-typhoon-sand hover:bg-typhoon-sand-dark text-typhoon-navy transition"
              >
                This Month
              </button>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* TAB 1: INQUIRIES DIRECTORY VIEW                           */}
        {/* ======================================================== */}
        {activeTab === 'list' && (
          <div className="space-y-3.5">
            {filteredInquiries.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-typhoon-border shadow-soft">
                <AlertCircle className="w-10 h-10 text-typhoon-muted mx-auto mb-2" />
                <h3 className="text-base font-bold text-typhoon-navy">No inquiries found</h3>
                <p className="text-xs text-typhoon-muted mt-1 max-w-sm mx-auto">
                  Try adjusting your search query, status chips, or date range filters.
                </p>
                <button
                  onClick={handleClearFilters}
                  className="mt-4 px-4 py-2 bg-typhoon-navy text-white text-xs font-bold rounded-xl"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              filteredInquiries.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl p-4 sm:p-5 border border-typhoon-border shadow-soft hover:border-typhoon-gold/50 transition-all space-y-3"
                >
                  {/* Top row: ID, Customer Name, Current Stage, and Overdue alert */}
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-lg bg-typhoon-navy text-white font-serif font-bold text-xs tracking-wide">
                        {item.id}
                      </span>
                      <span className="text-[11px] font-semibold text-typhoon-muted">
                        {item.projectId}
                      </span>
                      <span className="text-xs text-typhoon-muted">•</span>
                      <span className="text-xs font-semibold text-typhoon-muted">
                        Registered: {item.createdAt}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {item.isOverdue && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200 animate-pulse">
                          <AlertCircle className="w-3 h-3" />
                          SLA Overdue
                        </span>
                      )}

                      <span className="inline-block px-3 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
                        Stage {item.currentStageNumber}: {item.currentStageName}
                      </span>
                    </div>
                  </div>

                  {/* Main Info Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-1">
                    {/* Left: Customer Info */}
                    <div className="sm:col-span-4 space-y-1">
                      <h3 className="text-base sm:text-lg font-serif font-bold text-typhoon-navy">
                        {item.customerName}
                      </h3>
                      <p className="text-xs text-typhoon-muted flex items-center gap-1.5 font-medium">
                        <MapPin className="w-3.5 h-3.5 text-typhoon-gold shrink-0" />
                        <span>{item.address}, {item.city}</span>
                      </p>
                      <p className="text-xs text-gray-700 font-semibold flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-typhoon-muted shrink-0" />
                        <span>{item.phone}</span>
                      </p>
                    </div>

                    {/* Middle: Technical specs + Visit / Quotation status */}
                    <div className="sm:col-span-4 space-y-1.5">
                      <div className="flex items-center gap-2 text-xs font-semibold text-typhoon-navy">
                        <span className="px-2 py-0.5 rounded bg-typhoon-sand font-bold text-typhoon-navy">
                          {item.systemKw} kW
                        </span>
                        <span>{item.phase}</span>
                        <span className="text-typhoon-muted">•</span>
                        <span className="text-typhoon-muted text-[11px]">{item.terraceType}</span>
                      </div>

                      {/* Explicit Visit Status Flag */}
                      <div>
                        {item.hasVisit ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3" />
                            Terrace Survey Done ({item.visitDate})
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                            <Calendar className="w-3 h-3" />
                            No Site Visit Done
                          </span>
                        )}
                      </div>

                      {/* Explicit Quotation Status Flag */}
                      <div>
                        {item.hasQuotation ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <Calculator className="w-3 h-3" />
                            Quote Sent: ₹{item.quoteAmount?.toLocaleString('en-IN')}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                            <AlertCircle className="w-3 h-3" />
                            No Quotation Generated
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Right: Assigned User & Follow-up Counter */}
                    <div className="sm:col-span-4 space-y-1.5 sm:border-l sm:border-typhoon-border/70 sm:pl-4">
                      <div className="text-xs">
                        <span className="text-[10px] font-bold uppercase text-typhoon-muted block">
                          Assigned Staff
                        </span>
                        <span className="font-bold text-typhoon-navy">
                          {item.assignedUser.name}
                        </span>
                        <span className="text-typhoon-muted text-[11px] block">
                          {item.assignedUser.role}
                        </span>
                      </div>

                      <div className="text-xs pt-1">
                        <span className="inline-flex items-center gap-1 font-semibold text-typhoon-navy">
                          <Clock className="w-3.5 h-3.5 text-typhoon-gold" />
                          <span>{item.followupCount} follow-ups logged</span>
                        </span>
                        <span className="text-[11px] text-typhoon-muted block">
                          Next due: <span className="font-bold text-typhoon-navy">{item.nextFollowupDate}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Action Footer */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2.5 border-t border-typhoon-border/60">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleOpenAddFollowup(item.id)}
                        className="py-1.5 px-3 rounded-xl bg-typhoon-gold hover:bg-typhoon-gold-dark text-typhoon-navy font-bold text-xs shadow-xs transition flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Log Follow-up</span>
                      </button>

                      <button
                        onClick={() => {
                          const text = encodeURIComponent(
                            `Hello ${item.customerName} ji, greetings from Typhoon Solar regarding your ${item.systemKw} kW rooftop inquiry (${item.id}). When would be a convenient time for a quick 2-minute call?`
                          );
                          window.open(`https://wa.me/${item.phone.replace(/\D/g, '')}?text=${text}`, '_blank');
                        }}
                        className="py-1.5 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs border border-emerald-200 transition flex items-center gap-1 cursor-pointer"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>WhatsApp</span>
                      </button>

                      <a
                        href={`tel:${item.phone.replace(/\D/g, '')}`}
                        className="py-1.5 px-3 rounded-xl bg-typhoon-sand hover:bg-typhoon-sand-dark text-typhoon-navy font-bold text-xs border border-typhoon-border transition flex items-center gap-1"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>Call</span>
                      </a>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setExpandedInquiryId(item.id);
                          setActiveTab('stages');
                        }}
                        className="text-xs font-bold text-typhoon-navy hover:text-black flex items-center gap-1 cursor-pointer"
                      >
                        <span>View 10 Stages</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => router.push(`/inquiries/${item.id}`)}
                        className="py-1.5 px-3.5 rounded-xl bg-typhoon-navy text-white font-bold text-xs hover:bg-typhoon-navy-light transition flex items-center gap-1 cursor-pointer"
                      >
                        <span>Full Detail</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 2: 10-STAGE LIFECYCLE & STAGE-WISE FOLLOW-UPS         */}
        {/* ======================================================== */}
        {activeTab === 'stages' && (
          <div className="space-y-4">
            {/* Quick selector of which inquiry to inspect */}
            <div className="bg-white p-4 rounded-2xl border border-typhoon-border shadow-soft flex flex-wrap items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-typhoon-muted block">
                  Select Project to Inspect Stages
                </span>
                <div className="flex flex-wrap gap-2 mt-1.5">
                  {inquiries.map((inq) => (
                    <button
                      key={inq.id}
                      onClick={() => setExpandedInquiryId(inq.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                        expandedInquiryId === inq.id
                          ? 'bg-typhoon-navy text-white shadow-soft'
                          : 'bg-typhoon-sand/40 text-typhoon-navy border border-typhoon-border hover:bg-typhoon-sand'
                      }`}
                    >
                      {inq.id} · {inq.customerName} ({inq.systemKw} kW)
                    </button>
                  ))}
                </div>
              </div>

              {expandedInquiryId && (
                <button
                  onClick={() => handleOpenAddFollowup(expandedInquiryId)}
                  className="py-2 px-4 rounded-xl bg-typhoon-gold hover:bg-typhoon-gold-dark text-typhoon-navy font-bold text-xs shadow-soft flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Log Follow-up for {expandedInquiryId}</span>
                </button>
              )}
            </div>

            {/* Stage Timeline for Selected Inquiry */}
            {(() => {
              const selectedItem = inquiries.find((i) => i.id === expandedInquiryId) || inquiries[0];
              if (!selectedItem) return null;

              return (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                  {/* Left 7 Cols: The Complete 10-Stage Visual Lifecycle */}
                  <div className="lg:col-span-7 bg-white rounded-2xl p-5 border border-typhoon-border shadow-soft space-y-4">
                    <div className="flex items-center justify-between border-b border-typhoon-border pb-3">
                      <div>
                        <span className="text-[10px] font-bold uppercase text-typhoon-gold tracking-widest block">
                          ROOFTOP SOLAR LIFECYCLE
                        </span>
                        <h2 className="text-xl font-serif font-bold text-typhoon-navy">
                          {selectedItem.id} · {selectedItem.customerName}
                        </h2>
                        <p className="text-xs text-typhoon-muted">
                          {selectedItem.systemKw} kW {selectedItem.phase} · {selectedItem.city} · {selectedItem.address}
                        </p>
                      </div>

                      <div className="text-right">
                        <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
                          Active: Stage {selectedItem.currentStageNumber}
                        </span>
                      </div>
                    </div>

                    {/* Stepper with all 10 stages */}
                    <div className="space-y-3 pt-1">
                      {SOLAR_LIFECYCLE_STAGES.map((stg) => {
                        const isCompleted = stg.stage < selectedItem.currentStageNumber;
                        const isCurrent = stg.stage === selectedItem.currentStageNumber;
                        const isUpcoming = stg.stage > selectedItem.currentStageNumber;

                        return (
                          <div
                            key={stg.stage}
                            className={`p-3.5 rounded-xl border transition-all flex items-start gap-3.5 ${
                              isCurrent
                                ? 'bg-amber-50/60 border-amber-300 shadow-xs'
                                : isCompleted
                                ? 'bg-emerald-50/40 border-emerald-200'
                                : 'bg-gray-50/40 border-gray-200/80 opacity-75'
                            }`}
                          >
                            {/* Stage Number / Status Icon */}
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 ${
                                isCompleted
                                  ? 'bg-emerald-600 text-white'
                                  : isCurrent
                                  ? 'bg-amber-500 text-white shadow-soft ring-4 ring-amber-200 animate-pulse'
                                  : 'bg-gray-200 text-gray-600'
                              }`}
                            >
                              {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : stg.stage}
                            </div>

                            {/* Stage Details */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-2">
                                <h4 className="text-sm font-bold text-typhoon-navy truncate">
                                  Stage {stg.stage}: {stg.name}
                                </h4>

                                <span
                                  className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider shrink-0 ${
                                    isCompleted
                                      ? 'bg-emerald-100 text-emerald-800'
                                      : isCurrent
                                      ? 'bg-amber-100 text-amber-800'
                                      : 'bg-gray-100 text-gray-500'
                                  }`}
                                >
                                  {isCompleted ? 'Completed' : isCurrent ? 'Active Now' : 'Upcoming'}
                                </span>
                              </div>

                              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-typhoon-muted mt-1">
                                <span className="font-semibold text-gray-700 flex items-center gap-1">
                                  <User className="w-3 h-3 text-typhoon-gold" />
                                  <span>Assigned: {stg.defaultUser}</span>
                                </span>
                                <span>•</span>
                                <span>Department: {stg.department}</span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Right 5 Cols: Stage Follow-up Area for Selected Inquiry */}
                  <div className="lg:col-span-5 bg-white rounded-2xl p-5 border border-typhoon-border shadow-soft space-y-4">
                    <div className="flex items-center justify-between border-b border-typhoon-border pb-3">
                      <div>
                        <span className="text-[10px] font-bold uppercase text-typhoon-gold tracking-widest block">
                          FOLLOW-UP TIMELINE
                        </span>
                        <h3 className="text-base font-serif font-bold text-typhoon-navy">
                          {selectedItem.followupCount} Follow-ups Logged
                        </h3>
                        <p className="text-xs text-typhoon-muted">
                          Next due: {selectedItem.nextFollowupDate}
                        </p>
                      </div>

                      <button
                        onClick={() => handleOpenAddFollowup(selectedItem.id)}
                        className="py-1.5 px-3 rounded-xl bg-typhoon-gold hover:bg-typhoon-gold-dark text-typhoon-navy font-bold text-xs shadow-xs transition flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add</span>
                      </button>
                    </div>

                    {/* List of follow-ups for this inquiry */}
                    <div className="space-y-3 max-h-[640px] overflow-y-auto pr-1">
                      {selectedItem.followups.map((fup) => (
                        <div
                          key={fup.id}
                          className="p-3.5 rounded-xl border border-typhoon-border bg-typhoon-sand/20 space-y-2 hover:bg-typhoon-sand/40 transition"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-xs text-typhoon-navy">
                                {fup.loggedBy}
                              </span>
                              <span className="text-[10px] text-typhoon-muted">
                                ({fup.role})
                              </span>
                            </div>
                            <span className="text-[10px] font-semibold text-typhoon-muted">
                              {fup.timestamp}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-typhoon-navy text-white">
                              {fup.channel}
                            </span>
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold border ${fup.reactionColor}`}
                            >
                              Reaction: {fup.customerReaction}
                            </span>
                          </div>

                          <p className="text-xs text-gray-800 leading-relaxed font-medium">
                            {fup.notes}
                          </p>

                          <div className="pt-1.5 border-t border-typhoon-border/60 text-[11px] text-typhoon-muted">
                            <span className="font-bold text-typhoon-navy">Next Action: </span>
                            <span>{fup.nextStep}</span>
                            <span className="block text-typhoon-gold-dark font-bold mt-0.5">
                              Committed Date: {fup.committedDate}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="pt-2">
                      <button
                        onClick={() => router.push(`/inquiries/${selectedItem.id}`)}
                        className="w-full py-3 px-4 rounded-xl bg-typhoon-sand hover:bg-typhoon-sand-dark text-typhoon-navy font-bold text-xs border border-typhoon-border transition flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <span>Open Full Inquiry Detail & Advance Stages</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        )}
      </div>

      {/* ======================================================== */}
      {/* QUICK FOLLOW-UP RECORD MODAL                             */}
      {/* ======================================================== */}
      {isFollowupModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white w-full max-w-lg rounded-2xl p-6 shadow-floating border border-typhoon-border space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-typhoon-border">
              <div>
                <span className="text-[10px] font-bold tracking-widest text-typhoon-gold uppercase block">
                  FAST FOLLOW-UP LOGGER
                </span>
                <h3 className="text-lg font-serif font-bold text-typhoon-navy">
                  Log Follow-up for {followupInquiryId}
                </h3>
              </div>
              <button
                onClick={() => setIsFollowupModalOpen(false)}
                className="w-8 h-8 rounded-full bg-typhoon-sand flex items-center justify-center text-typhoon-navy hover:bg-typhoon-sand-dark"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveFollowup} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-typhoon-navy block mb-1">
                    Channel
                  </label>
                  <select
                    value={channel}
                    onChange={(e) => setChannel(e.target.value as any)}
                    className="w-full px-3 py-2 bg-typhoon-sand/30 border border-typhoon-border rounded-xl text-xs font-semibold text-typhoon-navy focus:outline-none"
                  >
                    <option value="Phone Call">Phone Call</option>
                    <option value="Terrace Visit">Terrace Visit</option>
                    <option value="WhatsApp">WhatsApp Message</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-typhoon-navy block mb-1">
                    Customer Reaction
                  </label>
                  <select
                    value={reaction}
                    onChange={(e) => setReaction(e.target.value as any)}
                    className="w-full px-3 py-2 bg-typhoon-sand/30 border border-typhoon-border rounded-xl text-xs font-semibold text-typhoon-navy focus:outline-none"
                  >
                    <option value="Very Positive">Very Positive</option>
                    <option value="Negotiating">Negotiating</option>
                    <option value="Needs Subsidy Info">Needs Subsidy Info</option>
                    <option value="Hesitant">Hesitant</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-typhoon-navy block mb-1">
                  Discussion Notes & Remarks
                </label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Spoke to customer regarding terrace shadow analysis. Confirmed 6 kW requirement..."
                  className="w-full px-3.5 py-2.5 bg-typhoon-sand/30 border border-typhoon-border rounded-xl text-xs font-medium text-typhoon-navy focus:border-typhoon-gold focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-typhoon-navy block mb-1">
                    Next Action Step
                  </label>
                  <input
                    type="text"
                    value={nextStep}
                    onChange={(e) => setNextStep(e.target.value)}
                    placeholder="e.g. Schedule terrace visit"
                    className="w-full px-3 py-2 bg-typhoon-sand/30 border border-typhoon-border rounded-xl text-xs font-medium text-typhoon-navy focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-typhoon-navy block mb-1">
                    Committed Follow-up Date/Time
                  </label>
                  <input
                    type="text"
                    value={committedDate}
                    onChange={(e) => setCommittedDate(e.target.value)}
                    placeholder="e.g. Today 4:00 PM"
                    className="w-full px-3 py-2 bg-typhoon-sand/30 border border-typhoon-border rounded-xl text-xs font-medium text-typhoon-navy focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsFollowupModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-typhoon-navy hover:bg-typhoon-sand transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-typhoon-gold hover:bg-typhoon-gold-dark text-typhoon-navy font-bold text-xs shadow-soft transition flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Save Follow-up</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
