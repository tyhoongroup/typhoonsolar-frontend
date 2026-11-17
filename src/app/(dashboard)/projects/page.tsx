'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/Header';
import { getRoleTheme } from '@/lib/role-theme';
import { FollowUpModal } from '@/components/FollowUpModal';
import {
  Zap,
  Clock,
  ChevronRight,
  Filter,
  Plus,
  FileText,
  CheckCircle2,
  AlertCircle,
  Truck,
  Wrench,
  ShieldCheck,
} from 'lucide-react';
import { toast } from 'sonner';

export default function ProjectsListPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stageFilter, setStageFilter] = useState('ALL');
  const [followupItem, setFollowupItem] = useState<any | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('user');
      if (stored) setUser(JSON.parse(stored));
    } catch {}

    const token = localStorage.getItem('accessToken');
    if (!token) {
      router.push('/');
      return;
    }

    fetch('/api/v1/inquiries', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        const list = Array.isArray(data) ? data : data?.data || [];
        setProjects(list);
      })
      .catch((err) => {
        console.error('Failed to load projects', err);
      })
      .finally(() => setLoading(false));
  }, [router]);

  const theme = getRoleTheme(user?.role);
  const sColor = theme.hex.cardDarkBg || '#111827';
  const aColor = theme.hex.accentBg || '#6366F1';
  const cColor = theme.hex.lightBg || '#F5F5F7';
  const onColor = theme.hex.accentTextColor || '#FFFFFF';

  // Filters
  const stages = [
    { id: 'ALL', label: 'All Projects' },
    { id: 'GOVT', label: 'Govt Portal / SR' },
    { id: 'MATERIAL', label: 'Material' },
    { id: 'INSTALL', label: 'Installation' },
    { id: 'METER', label: 'Meter & Subsidy' },
  ];

  const filteredProjects = projects.filter((p) => {
    if (stageFilter === 'ALL') return true;
    const stage = p.currentStage || '';
    if (stageFilter === 'GOVT') {
      return stage.includes('GOVT') || stage.includes('SR');
    }
    if (stageFilter === 'MATERIAL') {
      return stage.includes('MATERIAL');
    }
    if (stageFilter === 'INSTALL') {
      return stage.includes('INSTALL');
    }
    if (stageFilter === 'METER') {
      return stage.includes('METER') || stage.includes('SUBSIDY') || stage.includes('COMPLETED');
    }
    return true;
  });

  const getStageBadge = (stage: string) => {
    const s = stage.replace(/_/g, ' ');
    if (stage.includes('DONE') || stage.includes('COMPLETED') || stage.includes('RECEIVED')) {
      return { bg: '#E6F6EE', text: '#137A4B', label: s };
    }
    if (stage.includes('MATERIAL') || stage.includes('INSTALL')) {
      return { bg: '#EFF6FF', text: '#1D4ED8', label: s };
    }
    if (stage.includes('SR') || stage.includes('GOVT')) {
      return { bg: '#FEF3C7', text: '#B45309', label: s };
    }
    return { bg: `color-mix(in srgb, ${aColor} 20%, #ffffff)`, text: sColor, label: s };
  };

  return (
    <div className="min-h-screen pb-24 font-sans">
      {/* 1. Header following exact role curve & insignia */}
      <Header
        role={user?.role}
        roleTitle="Active Projects"
        subtitle="Rooftop solar project delivery & stage execution"
      />

      {/* 2. Stage Filter Tabs */}
      <div className="px-3.5 mt-3 overflow-x-auto no-scrollbar">
        <div className="flex gap-2 min-w-max pb-1">
          {stages.map((st) => {
            const isSelected = stageFilter === st.id;
            return (
              <button
                key={st.id}
                onClick={() => setStageFilter(st.id)}
                style={
                  isSelected
                    ? {
                        backgroundColor: aColor,
                        color: onColor,
                        boxShadow: `0 4px 12px color-mix(in srgb, ${aColor} 30%, transparent)`,
                      }
                    : {
                        backgroundColor: '#ffffff',
                        color: sColor,
                        border: `0.5px solid color-mix(in srgb, ${sColor} 12%, transparent)`,
                      }
                }
                className="px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer"
              >
                {st.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Project Cards List */}
      <div className="px-3.5 mt-3 space-y-3">
        {loading ? (
          <div className="bg-white rounded-[18px] p-8 text-center text-xs opacity-60">
            Loading active solar projects...
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="bg-white rounded-[18px] p-8 text-center border border-gray-200">
            <ShieldCheck className="w-8 h-8 mx-auto text-gray-400 mb-2" />
            <div className="text-sm font-bold text-gray-800">No projects in this stage</div>
            <div className="text-xs text-gray-500 mt-1">Select another filter tab above</div>
          </div>
        ) : (
          filteredProjects.map((p) => {
            const pid = p.followupId || p.id;
            const badge = getStageBadge(p.currentStage || 'INQUIRY_RECEIVED');

            return (
              <div
                key={p.id}
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '18px',
                  border: `0.5px solid color-mix(in srgb, ${sColor} 8%, transparent)`,
                  boxShadow: `0 6px 18px color-mix(in srgb, ${sColor} 8%, transparent)`,
                }}
                className="p-4 transition-all"
              >
                <div className="flex items-start justify-between gap-2">
                  <div
                    onClick={() => router.push(`/projects/${pid}`)}
                    className="flex-1 cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        style={{ color: aColor }}
                        className="text-xs font-extrabold uppercase tracking-wider"
                      >
                        {pid}
                      </span>
                      <span
                        style={{
                          backgroundColor: badge.bg,
                          color: badge.text,
                        }}
                        className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase"
                      >
                        {badge.label}
                      </span>
                    </div>

                    <h3
                      style={{ color: sColor }}
                      className="text-base font-extrabold mt-1 tracking-tight leading-snug"
                    >
                      {p.customerName}
                    </h3>

                    <p className="text-xs text-gray-500 mt-0.5">
                      {p.requestedKw} kW · {p.meterPhase || 'Single Phase'} · {p.city || 'Vadodara'}
                    </p>
                  </div>

                  <button
                    onClick={() => setFollowupItem(p)}
                    style={{
                      borderColor: `color-mix(in srgb, ${sColor} 20%, transparent)`,
                      color: sColor,
                    }}
                    className="px-2.5 py-1 rounded-full border text-[11px] font-bold hover:bg-black/5 active:scale-95 transition cursor-pointer flex-none flex items-center gap-1"
                    title="Schedule Follow-up"
                  >
                    <Clock className="w-3 h-3" />
                    <span>Follow-up</span>
                  </button>
                </div>

                {/* Footer with quick action */}
                <div
                  style={{
                    borderTop: `0.5px solid color-mix(in srgb, ${sColor} 10%, transparent)`,
                  }}
                  className="mt-3 pt-2.5 flex items-center justify-between"
                >
                  <span className="text-[11px] text-gray-500 font-medium">
                    {p.dealAmount ? `Deal: ₹${Number(p.dealAmount).toLocaleString('en-IN')}` : 'Subsidy: ₹78,000'}
                  </span>

                  <button
                    onClick={() => router.push(`/projects/${pid}`)}
                    style={{ color: aColor }}
                    className="text-xs font-extrabold flex items-center gap-1 hover:underline cursor-pointer"
                  >
                    <span>View Project Detail</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Universal Follow-up Modal */}
      {followupItem && (
        <FollowUpModal
          isOpen={!!followupItem}
          onClose={() => setFollowupItem(null)}
          inquiryId={followupItem.id}
          stage={followupItem.currentStage || 'INQUIRY_RECEIVED'}
          role={user?.role}
          onSuccess={() => {
            toast.success(`Follow-up saved for ${followupItem.customerName}`);
          }}
        />
      )}
    </div>
  );
}
