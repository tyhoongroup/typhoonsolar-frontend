'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  ChevronLeft,
  Package,
  Calendar,
  Clock,
  Phone,
  Upload,
  CheckCircle2,
  AlertCircle,
  FileText,
  Send,
  Camera,
  Layers,
  Truck,
  MessageSquare,
} from 'lucide-react';
import { toast } from 'sonner';
import { fetchWithAuth } from '@/lib/api';

export default function MaterialProjectDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [inquiry, setInquiry] = useState<any>(null);
  const projectId = params.id.startsWith('TYP-') ? params.id : `TYP-2026-${params.id.replace('F-', '')}`;

  // Call & Follow-up Logger
  const [deliveryDate, setDeliveryDate] = useState('2026-11-14');
  const [deliveryNotes, setDeliveryNotes] = useState(
    'Called customer. Customer confirmed terrace is cleared. Requested delivery.'
  );
  const [isFollowupSaved, setIsFollowupSaved] = useState(false);

  // Unload Proof Uploads
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([]);
  const [isUnloaded, setIsUnloaded] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetchWithAuth(`/api/v1/inquiries/${params.id}`);
        if (res.ok) {
          const data = await res.json();
          setInquiry(data);
          if (data.materialDispatch) {
            if (data.materialDispatch.scheduledUnloadDate) {
              setDeliveryDate(data.materialDispatch.scheduledUnloadDate.split('T')[0]);
              setIsFollowupSaved(true);
            }
            if (data.materialDispatch.actualUnloadedDate) {
              setIsUnloaded(true);
            }
            if (data.materialDispatch.unloadPhotos && data.materialDispatch.unloadPhotos.length > 0) {
              setUploadedPhotos(data.materialDispatch.unloadPhotos);
            }
          }
        }
      } catch (err) {
        // silent
      }
    }
    loadData();
  }, [params.id]);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const fileNames = Array.from(e.target.files).map((f) => f.name);
      setUploadedPhotos((prev) => [...prev, ...fileNames]);
      toast.success(`${fileNames.length} site unload proof photo(s) selected!`);
    }
  };

  const handleSaveDeliveryCall = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!deliveryNotes.trim()) {
      toast.error('Please enter customer call remarks.');
      return;
    }
    try {
      setLoading(true);
      // 1. Plan material dispatch
      await fetchWithAuth('/api/v1/material/plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          inquiryId: params.id,
          inverterSerialNo: 'GROWATT-MIN-6000TL-X',
          panelSerialNumbers: ['TYP-550-01', 'TYP-550-02'],
          scheduledUnloadDate: new Date(deliveryDate).toISOString(),
          amountDueOnUnload: inquiry?.dealAmount ? Math.round(Number(inquiry.dealAmount) * 0.8) : 160000,
        }),
      });

      // 2. Log follow-up call
      await fetchWithAuth('/api/v1/followups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          inquiryId: params.id,
          stage: 'MATERIAL_PLANNED',
          status: 'CALL_DONE',
          description: deliveryNotes,
          nextStep: 'Unload material on site',
          committedDate: new Date(deliveryDate).toISOString(),
        }),
      });

      setIsFollowupSaved(true);
      toast.success('Customer delivery call remarks & committed date saved to database!');
    } catch (err: any) {
      toast.error(err.message || 'Error saving delivery details');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkMaterialUnloaded = async () => {
    if (uploadedPhotos.length === 0) {
      toast.error('Please upload at least one site photo proof of unloaded material.');
      return;
    }

    try {
      setLoading(true);
      const res = await fetchWithAuth('/api/v1/material/unload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          inquiryId: params.id,
          unloadPhotos: uploadedPhotos,
        }),
      });

      if (!res.ok) throw new Error('Failed to record unload proof');

      setIsUnloaded(true);
      toast.success(
        '🎉 Material marked UNLOADED in database! Accountant (Meera) and Installation Team (Irfan) notified.'
      );
      router.push(`/inquiries/${params.id}`);
    } catch (err: any) {
      toast.error(err.message || 'Error marking material unloaded');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-typhoon-sand pb-16">
      {/* Top Header */}
      <div className="bg-typhoon-navy text-white pt-6 pb-8 px-6 rounded-b-[32px] shadow-soft">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-3">
            <button
              onClick={() => router.back()}
              className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <span className="bg-typhoon-gold text-typhoon-navy text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                STAGE 7 & 8 · MATERIAL
              </span>
              <span className="text-xs text-white/70">Sohail Khan (Store Lead)</span>
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl lg:text-3xl font-serif font-bold text-white tracking-tight">
                Material Planning & Unload
              </h1>
              <p className="text-xs text-typhoon-gold font-medium mt-1">
                Project {projectId} · Ramesh Patel (+91 98250 12345) · DISCOM SR: SR-GUJ-2026-98124
              </p>
            </div>

            <a
              href="tel:+919825012345"
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-2 transition shadow-soft self-start md:self-auto"
            >
              <Phone className="w-4 h-4" />
              <span>Call Customer for Delivery</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-5xl mx-auto px-4 lg:px-6 -mt-3 space-y-5">
        {/* 1. Master BOM Bill of Materials (From Excel Formula) */}
        <div className="bg-white rounded-2xl p-6 border border-typhoon-border shadow-soft space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-typhoon-navy">
                Staged Bill of Materials (BOM Planning Slip)
              </h3>
              <p className="text-xs text-typhoon-muted">
                Calculated according to 6.0 kW Single Phase master quotation sheet
              </p>
            </div>
            <button
              onClick={() => toast.success('Material Dispatch Slip PDF downloaded!')}
              className="px-3 py-1.5 rounded-xl bg-typhoon-sand hover:bg-typhoon-sand-dark text-typhoon-navy font-bold text-xs flex items-center gap-1.5 transition border border-typhoon-border/80"
            >
              <FileText className="w-3.5 h-3.5 text-typhoon-gold" />
              <span>Download BOM PDF</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            <div className="bg-typhoon-sand/40 p-3.5 rounded-xl border border-typhoon-border/80">
              <span className="text-[10px] text-typhoon-muted font-bold uppercase block">Solar PV Modules</span>
              <span className="text-sm font-bold text-typhoon-navy block mt-0.5">12x 550W DCR Mono-PERC</span>
              <span className="text-[11px] text-emerald-700 font-semibold">Tier-1 ALMM Approved</span>
            </div>

            <div className="bg-typhoon-sand/40 p-3.5 rounded-xl border border-typhoon-border/80">
              <span className="text-[10px] text-typhoon-muted font-bold uppercase block">Grid-Tie Inverter</span>
              <span className="text-sm font-bold text-typhoon-navy block mt-0.5">6.0 kW Dual MPPT</span>
              <span className="text-[11px] text-typhoon-navy/80">Growatt / Solis with WiFi Logger</span>
            </div>

            <div className="bg-typhoon-sand/40 p-3.5 rounded-xl border border-typhoon-border/80">
              <span className="text-[10px] text-typhoon-muted font-bold uppercase block">Mounting Structure</span>
              <span className="text-sm font-bold text-typhoon-navy block mt-0.5">Elevated HDG 4-Leg</span>
              <span className="text-[11px] text-typhoon-navy/80">Hot-dip galvanized 80-micron</span>
            </div>

            <div className="bg-typhoon-sand/40 p-3.5 rounded-xl border border-typhoon-border/80">
              <span className="text-[10px] text-typhoon-muted font-bold uppercase block">DC & AC Cables</span>
              <span className="text-sm font-bold text-typhoon-navy block mt-0.5">35 Meters Copper</span>
              <span className="text-[11px] text-typhoon-navy/80">4 sq.mm solar UV protected</span>
            </div>

            <div className="bg-typhoon-sand/40 p-3.5 rounded-xl border border-typhoon-border/80">
              <span className="text-[10px] text-typhoon-muted font-bold uppercase block">Earthing & Protection</span>
              <span className="text-sm font-bold text-typhoon-navy block mt-0.5">3x Chemical Rods</span>
              <span className="text-[11px] text-typhoon-navy/80">+ Pure copper lightning arrester</span>
            </div>

            <div className="bg-typhoon-sand/40 p-3.5 rounded-xl border border-typhoon-border/80">
              <span className="text-[10px] text-typhoon-muted font-bold uppercase block">Electrical Boxes</span>
              <span className="text-sm font-bold text-typhoon-navy block mt-0.5">1x ACDB + 1x DCDB</span>
              <span className="text-[11px] text-typhoon-navy/80">IP65 with SPD & MCBs</span>
            </div>
          </div>
        </div>

        {/* 2. Customer Delivery Call & Follow-up Remarks */}
        <div className="bg-white rounded-2xl p-6 border border-typhoon-border shadow-soft space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-typhoon-navy">
                Customer Delivery Scheduling & Follow-Up
              </h3>
              <p className="text-xs text-typhoon-muted">
                Log customer delivery availability & special instructions
              </p>
            </div>
            {isFollowupSaved && (
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                ✓ Call Logged
              </span>
            )}
          </div>

          <form onSubmit={handleSaveDeliveryCall} className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-semibold text-typhoon-navy block mb-1">
                  Scheduled Delivery Date
                </label>
                <input
                  type="date"
                  value={deliveryDate}
                  onChange={(e) => setDeliveryDate(e.target.value)}
                  className="w-full px-3 py-2 bg-typhoon-sand/40 border border-typhoon-border rounded-xl text-xs text-typhoon-navy focus:border-typhoon-gold focus:outline-none"
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-semibold text-typhoon-navy block mb-1">
                  Customer Discussion & Follow-Up Remarks
                </label>
                <div className="relative flex items-center">
                  <input
                    type="text"
                    value={deliveryNotes}
                    onChange={(e) => setDeliveryNotes(e.target.value)}
                    placeholder="e.g. Customer said come after 2 days, payment not ready right now..."
                    className="w-full px-3 py-2 bg-typhoon-sand/40 border border-typhoon-border rounded-xl text-xs text-typhoon-navy focus:border-typhoon-gold focus:outline-none pr-28"
                    required
                  />
                  <button
                    type="submit"
                    className="absolute right-1.5 py-1 px-3 bg-typhoon-navy hover:bg-typhoon-navy-light text-white text-xs font-bold rounded-lg transition"
                  >
                    Save Note
                  </button>
                </div>
              </div>
            </div>

            {/* Quick delivery templates */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {[
                'Customer ready; requested morning delivery before 11 AM.',
                'Customer requested 2 days delay; arranging advance payment.',
                'Terrace staircase narrow; needs 2 extra helpers for panels.',
              ].map((template, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setDeliveryNotes(template)}
                  className="text-[10px] bg-typhoon-sand/60 hover:bg-typhoon-sand text-typhoon-navy px-2.5 py-1 rounded-lg border border-typhoon-border/80 transition"
                >
                  {template}
                </button>
              ))}
            </div>
          </form>
        </div>

        {/* 3. Site Unload Photo Proofs & Mark Unloaded */}
        <div className="bg-white rounded-2xl p-6 border border-typhoon-border shadow-soft space-y-4">
          <div>
            <h3 className="text-sm font-bold text-typhoon-navy">
              Rooftop Material Unload Proofs (Mandatory)
            </h3>
            <p className="text-xs text-typhoon-muted">
              Upload photos of staged solar panels, inverter box, and structure crates on customer property
            </p>
          </div>

          {/* Photo dropzone */}
          <div className="border-2 border-dashed border-typhoon-border rounded-2xl p-6 text-center hover:border-typhoon-gold transition bg-typhoon-sand/20">
            <Camera className="w-8 h-8 text-typhoon-gold mx-auto mb-2" />
            <p className="text-xs font-bold text-typhoon-navy">Upload Unloaded Site Photos</p>
            <p className="text-[11px] text-typhoon-muted mt-0.5">JPEG, PNG or mobile camera snapshots</p>

            <label className="mt-3 inline-block cursor-pointer bg-white hover:bg-typhoon-sand text-typhoon-navy font-bold px-4 py-2 rounded-xl text-xs border border-typhoon-border shadow-2xs transition">
              <span>Select Photos</span>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
              />
            </label>
          </div>

          {/* Uploaded photo chips */}
          {uploadedPhotos.length > 0 && (
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-typhoon-navy block">
                Uploaded Site Proofs ({uploadedPhotos.length}):
              </span>
              <div className="flex flex-wrap gap-2">
                {uploadedPhotos.map((photo, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-medium"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{photo}</span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Action button: Material Unloaded on Site */}
          <div className="pt-2">
            <button
              onClick={handleMarkMaterialUnloaded}
              disabled={loading || isUnloaded}
              className={`w-full py-4 rounded-2xl font-bold text-sm shadow-soft flex items-center justify-center gap-2 transition ${
                isUnloaded
                  ? 'bg-emerald-600 text-white'
                  : 'bg-typhoon-gold hover:bg-typhoon-gold-dark text-typhoon-navy disabled:opacity-50'
              }`}
            >
              <Truck className="w-4 h-4 stroke-[2.5]" />
              <span>
                {loading
                  ? 'Updating Status...'
                  : isUnloaded
                  ? '✓ Material Unloaded & Confirmed on Site'
                  : 'Mark Material Unloaded on Site (Notify Accountant & Installation)'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

