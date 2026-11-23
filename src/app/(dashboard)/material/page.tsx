'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Package,
  Clock,
  CheckCircle2,
  AlertCircle,
  Search,
  Truck,
  ChevronRight,
  Calendar,
  Layers,
} from 'lucide-react';
import { Header } from '@/components/Header';
import { SummaryTiles } from '@/components/SummaryTiles';
import { useCurrentUser } from '@/lib/use-current-user';

interface MaterialProjectItem {
  id: string;
  inquiryCode: string;
  customerName: string;
  phone: string;
  capacityKw: number;
  city: string;
  srNumber: string;
  stage: 'PLANNING_PENDING' | 'DELIVERY_SCHEDULED' | 'UNLOADED';
  stageLabel: string;
  stageBadgeStyle: string;
  deliveryDate?: string;
  panelsCount: number;
  inverterModel: string;
}

export default function MaterialQueuePage() {
  const router = useRouter();
  const { user, theme } = useCurrentUser();
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'scheduled' | 'unloaded'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Sync tab with URL query parameter (e.g. /material?tab=unloaded)
  useEffect(() => {
    const handleUrlChange = () => {
      if (typeof window !== 'undefined') {
        const params = new URLSearchParams(window.location.search);
        const tab = params.get('tab');
        if (tab === 'unloaded' || tab === 'scheduled' || tab === 'pending' || tab === 'all') {
          setActiveTab(tab as any);
        }
      }
    };
    handleUrlChange();
    window.addEventListener('popstate', handleUrlChange);
    return () => window.removeEventListener('popstate', handleUrlChange);
  }, []);

  const [projects, setProjects] = useState<MaterialProjectItem[]>([
    {
      id: 'TYP-2026-1024',
      inquiryCode: 'F-1024',
      customerName: 'Ramesh Patel',
      phone: '+91 98250 12345',
      capacityKw: 6.0,
      city: 'Anand',
      srNumber: 'SR-GUJ-2026-98124',
      stage: 'PLANNING_PENDING',
      stageLabel: 'Planning & Call Left',
      stageBadgeStyle: 'bg-amber-50 text-amber-700 border-amber-200',
      panelsCount: 12,
      inverterModel: '6 kW Growatt Dual MPPT',
    },
    {
      id: 'TYP-2026-1021',
      inquiryCode: 'F-1021',
      customerName: 'Nilesh Desai',
      phone: '+91 98250 99881',
      capacityKw: 6.0,
      city: 'Vadodara',
      srNumber: 'SR-GUJ-2026-97641',
      stage: 'DELIVERY_SCHEDULED',
      stageLabel: 'Unloading Scheduled',
      stageBadgeStyle: 'bg-blue-50 text-blue-700 border-blue-200',
      deliveryDate: 'Tomorrow 10:00 AM',
      panelsCount: 12,
      inverterModel: '6 kW Solis Three Phase',
    },
    {
      id: 'TYP-2026-1015',
      inquiryCode: 'F-1015',
      customerName: 'Diwan Zakirbhai',
      phone: '+91 98250 44332',
      capacityKw: 10.0,
      city: 'Anand',
      srNumber: 'SR-GUJ-2026-95321',
      stage: 'UNLOADED',
      stageLabel: 'Material Unloaded on Site',
      stageBadgeStyle: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      deliveryDate: 'Delivered Yesterday',
      panelsCount: 18,
      inverterModel: '10 kW Growatt On-Grid',
    },
  ]);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) return;

    fetch('/api/v1/material/queue', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        const list = Array.isArray(data) ? data : (data?.data || []);
        if (Array.isArray(list) && list.length > 0) {
          setProjects(
            list.map((inq: any) => {
              let stage: MaterialProjectItem['stage'] = 'PLANNING_PENDING';
              let stageLabel = 'Planning & Call Left';
              let stageBadgeStyle = 'bg-amber-50 text-amber-700 border-amber-200';

              if (inq.currentStage === 'MATERIAL_PLANNED') {
                stage = 'DELIVERY_SCHEDULED';
                stageLabel = 'Delivery Scheduled';
                stageBadgeStyle = 'bg-blue-50 text-blue-700 border-blue-200';
              } else if (inq.currentStage === 'MATERIAL_UNLOADED' || inq.currentStage === 'INSTALLATION_DONE') {
                stage = 'UNLOADED';
                stageLabel = 'Material Unloaded on Site';
                stageBadgeStyle = 'bg-emerald-50 text-emerald-700 border-emerald-200';
              }

              return {
                id: inq.id.startsWith('TYP-') ? inq.id : `TYP-2026-${(inq.followupId || inq.id).replace('F-', '')}`,
                inquiryCode: inq.followupId || inq.id,
                customerName: inq.customerName,
                phone: inq.customerPhone,
                capacityKw: Number(inq.requestedKw) || 6,
                city: inq.city || 'Gujarat',
                srNumber: inq.portalApplication?.srNumber || 'SR-PENDING',
                stage,
                stageLabel,
                stageBadgeStyle,
                deliveryDate: inq.materialDispatch?.scheduledUnloadDate
                  ? new Date(inq.materialDispatch.scheduledUnloadDate).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                    })
                  : undefined,
                panelsCount: inq.materialDispatch?.panelSerialNumbers?.length || 12,
                inverterModel: inq.materialDispatch?.inverterSerialNo || '6 kW Dual MPPT',
              };
            })
          );
        }
      })
      .catch(() => {});
  }, []);

  const filtered = projects.filter((p) => {
    const matchesSearch =
      p.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.srNumber.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;
    if (activeTab === 'pending') return p.stage === 'PLANNING_PENDING';
    if (activeTab === 'scheduled') return p.stage === 'DELIVERY_SCHEDULED';
    if (activeTab === 'unloaded') return p.stage === 'UNLOADED';
    return true;
  });

  return (
    <div className="min-h-screen bg-typhoon-sand pb-20">
      {/* 1. Unified Responsive Header matching Home */}
      <Header
        role={user?.role || 'OPS_MANAGER'}
        initials={theme.tag}
        roleTitle="Control tower"
        subtitle="Warehouse BOM Logistics & Terrace Unloading"
      />

      <div className="max-w-6xl mx-auto px-4 lg:px-6 pt-3 space-y-4">
        {/* 2. Summary Tiles matching Home */}
        <SummaryTiles
          tiles={[
            {
              icon: <Clock className="w-4 h-4 text-amber-600" />,
              value: '1',
              label: 'Planning pending',
            },
            {
              icon: <Truck className="w-4 h-4 text-sky-600" />,
              value: '1',
              label: 'Delivery scheduled',
            },
            {
              icon: <CheckCircle2 className="w-4 h-4 text-emerald-600" />,
              value: '1',
              label: 'Unloaded on site',
            },
            {
              icon: <Package className="w-4 h-4 text-typhoon-gold" />,
              value: '42',
              label: 'Panels in stock',
            },
          ]}
        />

        {/* Title row */}
        <div className="bg-white p-4 rounded-2xl border border-typhoon-border shadow-soft">
          <h1 className="text-xl sm:text-2xl font-serif font-bold text-typhoon-navy tracking-tight">
            Material Planning & Dispatch Queue
          </h1>
          <p className="text-xs text-typhoon-muted mt-0.5">
            Approved DISCOM SR projects ready for BOM staging, customer delivery call, and rooftop unloading
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl p-4 border border-typhoon-border shadow-soft flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex flex-wrap gap-1.5 text-xs">
            {[
              { id: 'all', label: 'All Projects (3)' },
              { id: 'pending', label: 'Planning Pending (1)' },
              { id: 'scheduled', label: 'Delivery Scheduled (1)' },
              { id: 'unloaded', label: 'Unloaded (1)' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3.5 py-1.5 rounded-xl font-bold text-xs transition cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-typhoon-navy text-white shadow-soft'
                    : 'bg-typhoon-sand/40 text-typhoon-navy border border-typhoon-border hover:bg-typhoon-sand'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="relative flex items-center min-w-[240px]">
            <Search className="w-4 h-4 text-typhoon-muted absolute left-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by customer or SR no..."
              className="w-full pl-9 pr-3 py-2 bg-typhoon-sand/40 rounded-xl text-xs text-typhoon-navy border border-typhoon-border focus:border-typhoon-gold focus:outline-none"
            />
          </div>
        </div>

        {/* Project List */}
        <div className="space-y-3">
          {filtered.map((proj) => (
            <div
              key={proj.id}
              onClick={() => router.push(`/material/projects/${proj.inquiryCode}`)}
              className="bg-white rounded-2xl p-5 border border-typhoon-border shadow-soft hover:border-typhoon-gold transition cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 group"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-typhoon-sand flex items-center justify-center text-typhoon-navy font-bold text-sm shrink-0">
                  <Truck className="w-6 h-6 text-typhoon-gold" />
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-sm font-bold text-typhoon-navy group-hover:text-typhoon-gold transition-colors">
                      {proj.id} · {proj.customerName}
                    </h3>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${proj.stageBadgeStyle}`}>
                      {proj.stageLabel}
                    </span>
                    <span className="text-[10px] font-semibold bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-md border border-emerald-200">
                      SR: {proj.srNumber}
                    </span>
                  </div>

                  <p className="text-xs text-typhoon-muted mt-1">
                    {proj.capacityKw} kW · {proj.city} · {proj.panelsCount}x Panels · {proj.inverterModel} · Phone: {proj.phone}
                  </p>

                  <div className="flex items-center gap-3 mt-2 text-[11px] text-typhoon-navy/80">
                    <span className="font-semibold text-typhoon-gold">
                      {proj.deliveryDate ? `Delivery: ${proj.deliveryDate}` : 'Action: Call customer to set delivery date'}
                    </span>
                    <span>•</span>
                    <span className="text-typhoon-muted">Click to open BOM & upload unload proofs</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end md:self-center">
                <span className="text-xs font-bold text-typhoon-gold group-hover:translate-x-1 transition-transform flex items-center gap-1">
                  <span>Open Material Workspace</span>
                  <ChevronRight className="w-4 h-4" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

