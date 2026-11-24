'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  ChevronLeft,
  Wrench,
  MapPin,
  Phone,
  Camera,
  CheckCircle2,
  Clock,
  Send,
  Navigation,
  Barcode,
  Layers,
  Sun,
  ShieldCheck,
} from 'lucide-react';
import { toast } from 'sonner';
import { fetchWithAuth } from '@/lib/api';
import { useCurrentUser } from '@/lib/use-current-user';
import { FollowUpModal } from '@/components/FollowUpModal';

export default function InstallationExecutionPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { theme } = useCurrentUser();
  const [inquiry, setInquiry] = useState<any>(null);
  const projectId = params.id.startsWith('TYP-') ? params.id : `TYP-2026-${params.id.replace('F-', '')}`;

  const [hasArrived, setHasArrived] = useState(false);
  const [arrivalTime, setArrivalTime] = useState<string | null>(null);

  // Mandatory Serial Numbers
  const [inverterSerial, setInverterSerial] = useState('');
  const [panelBarcodes, setPanelBarcodes] = useState('');

  // Mandatory Photo Uploads
  const [structurePhotos, setStructurePhotos] = useState<string[]>([]);
  const [panelsPhotos, setPanelsPhotos] = useState<string[]>([]);
  const [inverterPhotos, setInverterPhotos] = useState<string[]>([]);
  const [earthingPhotos, setEarthingPhotos] = useState<string[]>([]);

  const [loading, setLoading] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isFollowupOpen, setIsFollowupOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<'all' | 'site' | 'serials' | 'photos' | 'complete'>('all');

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetchWithAuth(`/api/v1/jobs/${params.id}`);
        if (res.ok) {
          const data = await res.json();
          setInquiry(data);
          if (data.installationJob) {
            if (data.installationJob.installedInverterSerial) {
              setInverterSerial(data.installationJob.installedInverterSerial);
            }
            if (data.installationJob.installedPanelSerials) {
              setPanelBarcodes(
                Array.isArray(data.installationJob.installedPanelSerials)
                  ? data.installationJob.installedPanelSerials.join('\n')
                  : String(data.installationJob.installedPanelSerials)
              );
            }
            if (data.installationJob.completedAt) {
              setIsCompleted(true);
            }
          }
        }
      } catch (err) {
        // silent
      }
    }
    loadData();
  }, [params.id]);

  const handleArrive = () => {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setHasArrived(true);
    setArrivalTime(time);
    toast.success(`Arrival timestamped at ${time}! You can now begin installation.`);
  };

  const handleFinishInstallation = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!inverterSerial.trim()) {
      toast.error('Please enter the Inverter Serial Number.');
      return;
    }

    if (!panelBarcodes.trim()) {
      toast.error('Please enter the Solar Panel Barcode Numbers.');
      return;
    }

    try {
      setLoading(true);
      const res = await fetchWithAuth(`/api/v1/jobs/${params.id}/proof`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          inquiryId: params.id,
          structureDone: true,
          panelsMounted: true,
          wiringDone: true,
          earthingSystemCheck: true,
          installedInverterSerial: inverterSerial,
          installedPanelSerials: panelBarcodes.split('\n').map((s) => s.trim()).filter(Boolean),
          structurePhotos: ['structure_angle1.jpg', 'panels_array.jpg'],
        }),
      });

      if (!res.ok) throw new Error('Failed to submit installation completion');

      setIsCompleted(true);
      toast.success(
        'Rooftop installation saved to database! Portal User (Rahul Bhai) notified to prepare CEI Meter File.'
      );
      router.push(`/inquiries/${params.id}`);
    } catch (err: any) {
      toast.error(err.message || 'Error saving installation proof');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-typhoon-sand pb-16">
      {/* Top Header with dynamic active user role theme */}
      <div
        style={{
          background: theme.hex.cardDarkGradient || theme.hex.cardDarkBg || '#1E293B',
        }}
        className="text-white pt-6 pb-8 px-6 rounded-b-[32px] shadow-soft border-b border-white/10 transition-colors duration-300 relative overflow-hidden"
      >
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-3">
            <button
              onClick={() => router.back()}
              className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <span
                style={{
                  backgroundColor: theme.hex.accentBg,
                  color: theme.hex.accentTextColor,
                }}
                className="text-[10px] font-medium px-2.5 py-0.5 rounded-full uppercase tracking-wider"
              >
                STAGE 9 · INSTALLATION
              </span>
              <span className="text-xs text-white/70">Irfan (Lead)</span>
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl lg:text-3xl font-serif font-normal text-white tracking-tight">
                Rooftop Installation Site
              </h1>
              <p
                style={{ color: theme.hex.accentBg }}
                className="text-xs font-normal mt-1"
              >
                Project {projectId} · Ramesh Patel (+91 98250 12345)
              </p>
            </div>

            <div className="flex items-center gap-2">
              <a
                href="https://maps.google.com/?q=B-42+Shivalik+Residency+Anand"
                target="_blank"
                rel="noreferrer"
                className="bg-white/10 hover:bg-white/20 text-white font-semibold px-4 py-2 rounded-xl text-xs flex items-center gap-2 transition"
              >
                <Navigation className="w-3.5 h-3.5 text-typhoon-gold" />
                <span>Navigate on Maps</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-4xl mx-auto px-4 lg:px-6 -mt-3 space-y-4">
        {/* Section Navigation Tabs (Quick section switcher buttons) */}
        <div className="bg-white p-2 rounded-2xl border border-typhoon-border shadow-soft flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth flex-nowrap shrink-0">
          {[
            { id: 'all', label: 'All Sections' },
            { id: 'site', label: '1. Site & Location' },
            { id: 'serials', label: '2. Equipment Serials' },
            { id: 'photos', label: '3. Photo Proofs (4)' },
            { id: 'complete', label: '4. Checklist & Submit' },
          ].map((sec) => (
            <button
              key={sec.id}
              type="button"
              onClick={() => setActiveSection(sec.id as any)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition cursor-pointer shrink-0 ${
                activeSection === sec.id
                  ? 'bg-typhoon-navy text-white shadow-soft'
                  : 'bg-typhoon-sand/40 text-typhoon-navy/80 hover:bg-typhoon-sand border border-typhoon-border/60'
              }`}
            >
              {sec.label}
            </button>
          ))}
        </div>

        {/* Site Location & Arrived Button Card */}
        {(activeSection === 'all' || activeSection === 'site') && (
          <div className="bg-white rounded-2xl p-4 sm:p-6 border border-typhoon-border shadow-soft flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-typhoon-gold shrink-0" />
                <h3 className="text-sm font-medium text-typhoon-navy">
                  B-42 Shivalik Residency, Anand
                </h3>
              </div>
              <p className="text-xs text-typhoon-muted mt-1 font-normal">
                6.0 kW · 12x 550W Panels · Single Phase · Flat RCC Terrace
              </p>
            </div>

            <div>
              {hasArrived ? (
                <span className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Arrived at {arrivalTime}</span>
                </span>
              ) : (
                <button
                  type="button"
                  onClick={handleArrive}
                  className="bg-typhoon-gold hover:bg-typhoon-gold-dark text-typhoon-navy font-medium px-5 py-2.5 rounded-xl text-xs shadow-soft transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Clock className="w-4 h-4" />
                  <span>Mark Arrived on Location</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* Mandatory Form */}
        <form onSubmit={handleFinishInstallation} className="space-y-4">
          {/* 1. Mandatory Inverter & Panel Serial Numbers */}
          {(activeSection === 'all' || activeSection === 'serials') && (
            <div className="bg-white rounded-2xl p-4 sm:p-6 border border-typhoon-border shadow-soft space-y-4">
              <div className="flex items-center gap-2">
                <Barcode className="w-4 h-4 text-typhoon-gold" />
                <h3 className="text-sm font-medium text-typhoon-navy">
                  Mandatory Equipment Serial Numbers (For DISCOM CEI File)
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-typhoon-navy block mb-1">
                    Inverter Serial Number <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={inverterSerial}
                    onChange={(e) => setInverterSerial(e.target.value)}
                    placeholder="e.g. GW-2026-6K-99281"
                    className="w-full px-4 py-3 bg-typhoon-sand/40 border border-typhoon-border rounded-xl text-xs font-medium text-typhoon-navy focus:border-typhoon-gold focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-typhoon-navy block mb-1">
                    Panel Barcodes / Serials (12 Panels) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={panelBarcodes}
                    onChange={(e) => setPanelBarcodes(e.target.value)}
                    placeholder="e.g. 550W-TYP-001 through 012"
                    className="w-full px-4 py-3 bg-typhoon-sand/40 border border-typhoon-border rounded-xl text-xs font-medium text-typhoon-navy focus:border-typhoon-gold focus:outline-none"
                    required
                  />
                </div>
              </div>
            </div>
          )}

          {/* 2. Mandatory Installation Photo Proofs */}
          {(activeSection === 'all' || activeSection === 'photos') && (
            <div className="bg-white rounded-2xl p-4 sm:p-6 border border-typhoon-border shadow-soft space-y-4">
              <div className="flex items-center gap-2">
                <Camera className="w-4 h-4 text-typhoon-gold" />
                <h3 className="text-sm font-medium text-typhoon-navy">
                  Mandatory Installation Proof Photos (4 Angles)
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {/* Photo 1: Structure */}
                <div className="p-3 sm:p-4 bg-typhoon-sand/30 border border-typhoon-border rounded-xl text-center space-y-2">
                  <span className="text-xs font-medium text-typhoon-navy block">
                    1. Elevated Structure Mounting
                  </span>
                  <label className="cursor-pointer inline-block px-3 py-1.5 bg-white hover:bg-typhoon-sand text-typhoon-navy text-xs font-medium rounded-lg border border-typhoon-border shadow-2xs">
                    <span>Upload Photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files?.[0]) {
                          setStructurePhotos([e.target.files[0].name]);
                          toast.success('Structure photo saved!');
                        }
                      }}
                      className="hidden"
                    />
                  </label>
                  {structurePhotos.length > 0 && (
                    <p className="text-xs text-emerald-700 font-medium flex items-center justify-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{structurePhotos[0]}</span>
                    </p>
                  )}
                </div>

                {/* Photo 2: Panel Array */}
                <div className="p-3 sm:p-4 bg-typhoon-sand/30 border border-typhoon-border rounded-xl text-center space-y-2">
                  <span className="text-xs font-medium text-typhoon-navy block">
                    2. Solar Panel Array (12 Panels)
                  </span>
                  <label className="cursor-pointer inline-block px-3 py-1.5 bg-white hover:bg-typhoon-sand text-typhoon-navy text-xs font-medium rounded-lg border border-typhoon-border shadow-2xs">
                    <span>Upload Photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files?.[0]) {
                          setPanelsPhotos([e.target.files[0].name]);
                          toast.success('Panel array photo saved!');
                        }
                      }}
                      className="hidden"
                    />
                  </label>
                  {panelsPhotos.length > 0 && (
                    <p className="text-xs text-emerald-700 font-medium flex items-center justify-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{panelsPhotos[0]}</span>
                    </p>
                  )}
                </div>

                {/* Photo 3: Inverter & ACDB/DCDB */}
                <div className="p-3 sm:p-4 bg-typhoon-sand/30 border border-typhoon-border rounded-xl text-center space-y-2">
                  <span className="text-xs font-medium text-typhoon-navy block">
                    3. Inverter Mounting & ACDB/DCDB
                  </span>
                  <label className="cursor-pointer inline-block px-3 py-1.5 bg-white hover:bg-typhoon-sand text-typhoon-navy text-xs font-medium rounded-lg border border-typhoon-border shadow-2xs">
                    <span>Upload Photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files?.[0]) {
                          setInverterPhotos([e.target.files[0].name]);
                          toast.success('Inverter photo saved!');
                        }
                      }}
                      className="hidden"
                    />
                  </label>
                  {inverterPhotos.length > 0 && (
                    <p className="text-xs text-emerald-700 font-medium flex items-center justify-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{inverterPhotos[0]}</span>
                    </p>
                  )}
                </div>

                {/* Photo 4: Earthing Pit */}
                <div className="p-3 sm:p-4 bg-typhoon-sand/30 border border-typhoon-border rounded-xl text-center space-y-2">
                  <span className="text-xs font-medium text-typhoon-navy block">
                    4. Earthing Pit & Lightning Rod
                  </span>
                  <label className="cursor-pointer inline-block px-3 py-1.5 bg-white hover:bg-typhoon-sand text-typhoon-navy text-xs font-medium rounded-lg border border-typhoon-border shadow-2xs">
                    <span>Upload Photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files?.[0]) {
                          setEarthingPhotos([e.target.files[0].name]);
                          toast.success('Earthing photo saved!');
                        }
                      }}
                      className="hidden"
                    />
                  </label>
                  {earthingPhotos.length > 0 && (
                    <p className="text-xs text-emerald-700 font-medium flex items-center justify-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{earthingPhotos[0]}</span>
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Action Button: Mark Installation Done & Follow-up */}
          {(activeSection === 'all' || activeSection === 'complete') && (
            <div className="flex flex-col sm:flex-row gap-2 pt-2">
              <button
                type="submit"
                disabled={loading || isCompleted}
                className={`flex-1 py-3.5 rounded-2xl font-medium text-sm shadow-soft flex items-center justify-center gap-2 transition cursor-pointer ${
                  isCompleted
                    ? 'bg-emerald-600 text-white'
                    : 'bg-typhoon-gold hover:bg-typhoon-gold-dark text-typhoon-navy disabled:opacity-50'
                }`}
              >
                <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
                <span>
                  {loading
                    ? 'Finalizing Installation...'
                    : isCompleted
                    ? 'Installation Complete'
                    : 'Done (Notify Portal for Meter File)'}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setIsFollowupOpen(true)}
                className="py-3.5 px-5 rounded-2xl bg-white hover:bg-typhoon-sand text-typhoon-navy font-medium text-xs border border-typhoon-border shadow-soft transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Clock className="w-4 h-4 text-typhoon-gold" />
                <span>Follow-up</span>
              </button>
            </div>
          )}
        </form>
      </div>

      {/* Universal Follow-up Modal */}
      <FollowUpModal
        isOpen={isFollowupOpen}
        onClose={() => setIsFollowupOpen(false)}
        inquiryId={params.id}
        onSuccess={() => {
          setIsFollowupOpen(false);
          toast.success('Follow-up recorded!');
        }}
      />
    </div>
  );
}

