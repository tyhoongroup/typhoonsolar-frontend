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

  const [projects, setProjects] = useState<MaterialProjectItem[]>([]);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) return;

    fetch('/api/v1/material/queue', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        const list = Array.isArray(data) ? data : (data?.data || []);
        if (Array.isArray(list)) {
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
      .catch(() => {
        setProjects([]);
      });
  }, []);

  const pendingCount = projects.filter((p) => p.stage === 'PLANNING_PENDING').length;
  const scheduledCount = projects.filter((p) => p.stage === 'DELIVERY_SCHEDULED').length;
  const unloadedCount = projects.filter((p) => p.stage === 'UNLOADED').length;

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
    <div className="min-h-screen bg-typhoon-sand pb-24 font-sans">
      {/* 1. Unified Responsive Header matching Home */}
      <Header
        role={user?.role || 'MATERIAL_MANAGER'}
        initials={theme.tag}
        roleTitle="Warehouse & BOM"
        subtitle="Logistics & Terrace Unloading"
      />

      <div className="max-w-6xl mx-auto px-4 lg:px-6 pt-1 space-y-4">
        {/* 2. Summary Tiles matching Home - 3 responsive tiles */}
        <SummaryTiles
          role={user?.role || 'MATERIAL_MANAGER'}
          tiles={[
            {
              icon: <Clock className="w-4 h-4 text-amber-600" />,
              value: String(pendingCount),
              label: 'Planning pending',
            },
            {
              icon: <Truck className="w-4 h-4 text-sky-600" />,
              value: String(scheduledCount),
              label: 'Delivery scheduled',
            },
            {
              icon: <CheckCircle2 className="w-4 h-4 text-emerald-600" />,
              value: String(unloadedCount),
              label: 'Verify proofs',
            },
          ]}
        />

        {/* Title row (Desktop only to keep mobile clean) */}
        <div className="hidden md:block bg-white p-5 rounded-2xl border border-typhoon-border shadow-soft">
          <h1 className="text-xl sm:text-2xl font-serif font-normal text-typhoon-navy tracking-tight">
            Material Planning & Dispatch Queue
          </h1>
          <p className="text-xs text-typhoon-muted mt-0.5">
            Approved DISCOM SR projects ready for BOM staging, customer delivery call, and rooftop unloading
          </p>
        </div>

        {/* Filters & Search */}
        <div className="bg-white rounded-2xl p-3.5 sm:p-4 border border-typhoon-border shadow-soft flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex flex-wrap gap-1.5 text-xs">
            {[
              { id: 'all', label: `All (${projects.length})` },
              { id: 'pending', label: `Planning (${pendingCount})` },
              { id: 'scheduled', label: `Scheduled (${scheduledCount})` },
              { id: 'unloaded', label: `Verify Proofs (${unloadedCount})` },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3 py-1.5 rounded-xl font-medium text-xs transition cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-typhoon-navy text-white shadow-soft'
                    : 'bg-typhoon-sand/40 text-typhoon-navy border border-typhoon-border hover:bg-typhoon-sand'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="relative flex items-center min-w-[220px]">
            <Search className="w-4 h-4 text-typhoon-muted absolute left-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search customer or SR no..."
              className="w-full pl-9 pr-3 py-2 bg-typhoon-sand/40 rounded-xl text-xs text-typhoon-navy border border-typhoon-border focus:border-typhoon-gold focus:outline-none font-sans"
            />
          </div>
        </div>

        {/* Project List */}
        <div className="space-y-3">
          {filtered.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 border border-typhoon-border text-center space-y-2">
              <Package className="w-10 h-10 text-typhoon-muted mx-auto opacity-40" />
              <h4 className="text-sm font-medium text-typhoon-navy">No projects in this tab</h4>
              <p className="text-xs text-typhoon-muted max-w-sm mx-auto">
                {activeTab === 'unloaded'
                  ? 'No projects waiting for unload verification right now. When materials are delivered and site photos are uploaded, they will appear here.'
                  : 'No projects match your current filter criteria.'}
              </p>
            </div>
          ) : (
            filtered.map((proj) => (
              <div
                key={proj.id}
                onClick={() => router.push(`/material/projects/${proj.inquiryCode}`)}
                className="bg-white rounded-2xl p-4 sm:p-5 border border-typhoon-border shadow-soft hover:border-typhoon-gold transition cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 group"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-typhoon-sand flex items-center justify-center text-typhoon-navy font-medium text-sm shrink-0">
                    <Truck className="w-6 h-6 text-typhoon-gold" />
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-sm font-medium text-typhoon-navy group-hover:text-typhoon-gold transition-colors">
                        {proj.id} · {proj.customerName}
                      </h3>
                      <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${proj.stageBadgeStyle}`}>
                        {proj.stageLabel}
                      </span>
                      <span className="text-[10px] font-medium bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-md border border-emerald-200">
                        SR: {proj.srNumber}
                      </span>
                    </div>

                    <p className="text-xs text-typhoon-muted mt-1">
                      {proj.capacityKw} kW · {proj.city} · {proj.panelsCount}x Panels · {proj.inverterModel} · Phone: {proj.phone}
                    </p>

                    <div className="flex items-center gap-3 mt-2 text-[11px] text-typhoon-navy/80">
                      <span className="font-medium text-typhoon-gold">
                        {proj.deliveryDate ? `Delivery: ${proj.deliveryDate}` : 'Action: Call customer to set delivery date'}
                      </span>
                      <span>•</span>
                      <span className="text-typhoon-muted">Click to open BOM & upload unload proofs</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end md:self-center">
                  <span className="text-xs font-medium text-typhoon-gold group-hover:translate-x-1 transition-transform flex items-center gap-1">
                    <span>Open Material Workspace</span>
                    <ChevronRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

