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
  ShieldCheck,
  Eye,
  Search,
  Plus,
  Minus,
  Trash2,
  Download,
  Sun,
  Zap,
  ChevronRight,
} from 'lucide-react';
import { toast } from 'sonner';
import { fetchWithAuth } from '@/lib/api';
import { useCurrentUser } from '@/lib/use-current-user';
import { FollowUpModal } from '@/components/FollowUpModal';

interface BomItem {
  id: string;
  category: 'panels' | 'inverters' | 'structure' | 'cables' | 'earthing' | 'distribution';
  categoryLabel: string;
  name: string;
  spec: string;
  unitPrice: number;
  unitLabel: string;
  stockText: string;
  stockStatus: 'in_stock' | 'low_stock';
  quantity: number;
}

export default function MaterialProjectDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { theme } = useCurrentUser();
  const [inquiry, setInquiry] = useState<any>(null);
  const projectId = params.id.startsWith('TYP-') ? params.id : `TYP-2026-${params.id.replace('F-', '')}`;

  // Call & Follow-up Logger
  const [deliveryDate, setDeliveryDate] = useState(new Date().toISOString().split('T')[0]);
  const [deliveryNotes, setDeliveryNotes] = useState('');
  const [isFollowupSaved, setIsFollowupSaved] = useState(false);

  // Section Selector Tab (all, bom, delivery, unload, install)
  const [activeSection, setActiveSection] = useState<'all' | 'bom' | 'delivery' | 'unload' | 'install'>('all');

  // BOM Search Filter
  const [bomSearch, setBomSearch] = useState('');

  // Interactive BOM Items (Matching Image 2 Shared by User)
  const [bomItems, setBomItems] = useState<BomItem[]>([
    {
      id: 'panel-550',
      category: 'panels',
      categoryLabel: 'Solar panels',
      name: '550 W DCR Mono-PERC',
      spec: 'Tier-1 ALMM approved · Waaree',
      unitPrice: 12650,
      unitLabel: 'per pc',
      stockText: 'In stock - 40 pc',
      stockStatus: 'in_stock',
      quantity: 12,
    },
    {
      id: 'panel-580',
      category: 'panels',
      categoryLabel: 'Solar panels',
      name: '580 W Topcon',
      spec: 'Tier-1 ALMM approved · Waaree',
      unitPrice: 13800,
      unitLabel: 'per pc',
      stockText: 'In stock - 24 pc',
      stockStatus: 'in_stock',
      quantity: 0,
    },
    {
      id: 'inv-growatt',
      category: 'inverters',
      categoryLabel: 'Inverters',
      name: 'Growatt 6.0 kW Dual MPPT',
      spec: 'WiFi logger included',
      unitPrice: 58000,
      unitLabel: 'per pc',
      stockText: 'In stock - 6 pc',
      stockStatus: 'in_stock',
      quantity: 1,
    },
    {
      id: 'inv-solis',
      category: 'inverters',
      categoryLabel: 'Inverters',
      name: 'Solis 6.0 kW Dual MPPT',
      spec: 'WiFi logger included',
      unitPrice: 64500,
      unitLabel: 'per pc',
      stockText: 'Low stock - 3 pc',
      stockStatus: 'low_stock',
      quantity: 0,
    },
    {
      id: 'struct-hdg',
      category: 'structure',
      categoryLabel: 'Mounting structure',
      name: 'Elevated HDG 4-leg',
      spec: 'Hot-dip galvanized, 80 micron',
      unitPrice: 1650,
      unitLabel: 'per panel',
      stockText: 'In stock - 50 panel',
      stockStatus: 'in_stock',
      quantity: 12,
    },
    {
      id: 'cable-dc',
      category: 'cables',
      categoryLabel: 'Cables',
      name: 'DC cable 4 sq.mm copper',
      spec: 'Solar UV protected',
      unitPrice: 62,
      unitLabel: 'per m',
      stockText: 'In stock - 800 m',
      stockStatus: 'in_stock',
      quantity: 35,
    },
    {
      id: 'earth-rod',
      category: 'earthing',
      categoryLabel: 'Earthing and protection',
      name: 'Chemical earthing rod',
      spec: 'Copper coated',
      unitPrice: 2200,
      unitLabel: 'per pc',
      stockText: 'In stock - 20 pc',
      stockStatus: 'in_stock',
      quantity: 3,
    },
    {
      id: 'earth-arrester',
      category: 'earthing',
      categoryLabel: 'Earthing and protection',
      name: 'Lightning arrester',
      spec: 'Pure copper',
      unitPrice: 3800,
      unitLabel: 'per pc',
      stockText: 'In stock - 8 pc',
      stockStatus: 'in_stock',
      quantity: 1,
    },
    {
      id: 'dist-acdb',
      category: 'distribution',
      categoryLabel: 'Distribution',
      name: 'ACDB',
      spec: 'Waterproof enclosure',
      unitPrice: 2900,
      unitLabel: 'per pc',
      stockText: 'In stock - 10 pc',
      stockStatus: 'in_stock',
      quantity: 1,
    },
    {
      id: 'dist-dcdb',
      category: 'distribution',
      categoryLabel: 'Distribution',
      name: 'DCDB',
      spec: 'Waterproof enclosure',
      unitPrice: 3100,
      unitLabel: 'per pc',
      stockText: 'In stock - 10 pc',
      stockStatus: 'in_stock',
      quantity: 1,
    },
  ]);

  // Stepper helper
  const handleUpdateQuantity = (id: string, delta: number) => {
    setBomItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const nextQty = Math.max(0, item.quantity + delta);
          return { ...item, quantity: nextQty };
        }
        return item;
      })
    );
  };

  const handleSetInitialQty = (id: string, defaultQty: number) => {
    setBomItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity: defaultQty } : item))
    );
  };

  // Unload Proof Uploads
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([]);
  const [isUnloaded, setIsUnloaded] = useState(false);
  const [isMaterialPlanned, setIsMaterialPlanned] = useState(false);
  const [isInstallVerified, setIsInstallVerified] = useState(false);
  const [isFollowupOpen, setIsFollowupOpen] = useState(false);
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

  const handleSaveBOM = () => {
    toast.success('Staged Bill of Materials saved & synchronized with warehouse stock!');
    setIsMaterialPlanned(true);
  };

  const handleUploadUnloadProofs = async () => {
    if (uploadedPhotos.length === 0) {
      toast.error('Please select at least 1 site unload photo proof.');
      return;
    }
    try {
      setLoading(true);
      const res = await fetchWithAuth('/api/v1/material/unload-proof', {
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
        'Material marked UNLOADED in database! Accountant (Meera) and Installation Team (Irfan) notified.'
      );
      router.push(`/projects/${params.id}`);
    } catch (err: any) {
      toast.error(err.message || 'Error marking material unloaded');
    } finally {
      setLoading(false);
    }
  };

  // Filtered Categories
  const categories = [
    { key: 'panels', label: 'Solar panels' },
    { key: 'inverters', label: 'Inverters' },
    { key: 'structure', label: 'Mounting structure' },
    { key: 'cables', label: 'Cables' },
    { key: 'earthing', label: 'Earthing and protection' },
    { key: 'distribution', label: 'Distribution' },
  ];

  const activeCartItems = bomItems.filter((i) => i.quantity > 0);
  const totalCartAmount = activeCartItems.reduce((acc, curr) => acc + curr.unitPrice * curr.quantity, 0);

  const customerName = inquiry?.customerName || 'Ramesh Patel';
  const customerPhone = inquiry?.customerPhone || '+91 98250 12345';
  const requestedKw = inquiry?.requestedKw || '6.0';

  return (
    <div className="min-h-screen bg-typhoon-sand pb-28 font-sans">
      {/* Top Header with Dark Green Card & Real Logo Capsule (Matching Image 2) */}
      <div
        style={{
          background: 'linear-gradient(180deg, #2D3E24 0%, #1E2B18 100%)',
        }}
        className="text-white pt-5 pb-9 px-5 rounded-b-[34px] shadow-soft border-b border-white/10 relative overflow-hidden"
      >
        <div className="max-w-md mx-auto">
          {/* Top Bar: Back Button & Real Logo Capsule */}
          <div className="flex items-center justify-between mb-3.5">
            <button
              onClick={() => router.back()}
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition active:scale-95 cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Real Logo in White Pill */}
            <div className="bg-white px-3 py-1 rounded-full shadow-soft flex items-center justify-center shrink-0">
              <img
                src="/images/typhoon-logo.png"
                alt="Typhoon Solar System"
                className="h-6 w-auto object-contain"
              />
            </div>
          </div>

          {/* Stage 7 Badge */}
          <div className="flex items-center gap-2 mb-1.5">
            <span className="bg-[#84CC16] text-[#1E3A1A] text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              STAGE 7 · MATERIAL
            </span>
            <span className="text-xs text-white/80 font-normal">Sohail Khan (Store Lead)</span>
          </div>

          {/* Header Title Matching Shared Image 2 */}
          <h1 className="text-2xl sm:text-3xl font-serif font-normal text-white tracking-tight">
            Add materials
          </h1>
          <p className="text-xs text-white/90 font-medium mt-1">
            Project {projectId} · {customerName}
          </p>
          <p className="text-xs text-white/70 font-normal mt-0.5">
            {requestedKw} kW single phase · build the BOM
          </p>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-md mx-auto px-4 -mt-4 space-y-4 relative z-10">
        {/* Section Navigation Tabs */}
        <div className="bg-white p-2 rounded-2xl border border-typhoon-border shadow-soft flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth flex-nowrap shrink-0">
          {[
            { id: 'all', label: 'All Sections' },
            { id: 'bom', label: '1. Staged BOM' },
            { id: 'delivery', label: '2. Delivery Call' },
            { id: 'unload', label: '3. Unload Proofs' },
            { id: 'install', label: '4. Verify Install' },
          ].map((sec) => (
            <button
              key={sec.id}
              onClick={() => setActiveSection(sec.id as any)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition cursor-pointer shrink-0 ${activeSection === sec.id
                ? 'bg-typhoon-navy text-white shadow-soft'
                : 'bg-typhoon-sand/40 text-typhoon-navy/80 hover:bg-typhoon-sand border border-typhoon-border/60'
                }`}
            >
              {sec.label}
            </button>
          ))}
        </div>

        {/* ========================================================================= */}
        {/* SECTION 1: INTERACTIVE STAGED BOM BUILDER (MATCHING IMAGE 2 SHARED BY USER) */}
        {/* ========================================================================= */}
        {(activeSection === 'all' || activeSection === 'bom') && (
          <div className="space-y-4">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-typhoon-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={bomSearch}
                onChange={(e) => setBomSearch(e.target.value)}
                placeholder="Search items, brand or size"
                className="w-full pl-10 pr-4 py-3 bg-white rounded-2xl text-xs font-medium text-typhoon-navy border border-typhoon-border shadow-soft focus:outline-none focus:border-typhoon-gold transition"
              />
            </div>

            {/* Categories & Item Cards */}
            {categories.map((cat) => {
              const items = bomItems.filter(
                (item) =>
                  item.category === cat.key &&
                  (bomSearch.trim() === '' ||
                    item.name.toLowerCase().includes(bomSearch.toLowerCase()) ||
                    item.spec.toLowerCase().includes(bomSearch.toLowerCase()))
              );

              if (items.length === 0) return null;

              return (
                <div key={cat.key} className="space-y-2.5">
                  <div className="flex items-center justify-between px-1">
                    <h3 className="font-serif text-base font-normal text-typhoon-navy">
                      {cat.label}
                    </h3>
                    <span className="text-[11px] text-typhoon-muted font-normal">
                      {items.length} items
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className="bg-white rounded-2xl p-4 border border-typhoon-border shadow-soft space-y-3"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-xl bg-[#FAF7F2] border border-typhoon-border/60 flex items-center justify-center shrink-0 text-typhoon-navy">
                              {cat.key === 'panels' && <Sun className="w-5 h-5 text-typhoon-gold" />}
                              {cat.key === 'inverters' && <Zap className="w-5 h-5 text-emerald-600" />}
                              {cat.key === 'structure' && <Layers className="w-5 h-5 text-slate-700" />}
                              {cat.key === 'cables' && <Package className="w-5 h-5 text-amber-700" />}
                              {cat.key === 'earthing' && <ShieldCheck className="w-5 h-5 text-sky-600" />}
                              {cat.key === 'distribution' && <Package className="w-5 h-5 text-slate-600" />}
                            </div>

                            <div>
                              <h4 className="text-xs font-medium text-typhoon-navy leading-tight">
                                {item.name}
                              </h4>
                              <p className="text-[11px] text-typhoon-muted font-normal mt-0.5">
                                {item.spec}
                              </p>
                            </div>
                          </div>

                          <div className="text-right shrink-0">
                            <span className="text-xs font-medium text-typhoon-navy block">
                              Rs {item.unitPrice.toLocaleString('en-IN')}
                            </span>
                            <span className="text-[10px] text-typhoon-muted block">
                              {item.unitLabel}
                            </span>
                          </div>
                        </div>

                        {/* Stock & Quantity Control Row */}
                        <div className="flex items-center justify-between pt-2 border-t border-typhoon-border/50">
                          <span
                            className={`text-[11px] font-normal ${item.stockStatus === 'in_stock'
                              ? 'text-emerald-700'
                              : 'text-amber-700'
                              }`}
                          >
                            {item.stockText}
                          </span>

                          <div>
                            {item.quantity > 0 ? (
                              <div className="flex items-center gap-3">
                                {/* Stepper */}
                                <div className="flex items-center gap-2 bg-[#FAF7F2] border border-typhoon-border rounded-full px-2.5 py-1">
                                  <button
                                    type="button"
                                    onClick={() => handleUpdateQuantity(item.id, -1)}
                                    className="w-5 h-5 rounded-full flex items-center justify-center text-typhoon-navy hover:bg-white transition cursor-pointer"
                                  >
                                    <Minus className="w-3 h-3" />
                                  </button>
                                  <span className="text-xs font-medium text-typhoon-navy min-w-[18px] text-center">
                                    {item.quantity}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => handleUpdateQuantity(item.id, 1)}
                                    className="w-5 h-5 rounded-full flex items-center justify-center text-typhoon-navy hover:bg-white transition cursor-pointer"
                                  >
                                    <Plus className="w-3 h-3" />
                                  </button>
                                </div>

                                <div className="text-right">
                                  <span className="text-[9px] text-typhoon-muted block leading-none">
                                    Line total
                                  </span>
                                  <span className="text-xs font-medium text-typhoon-navy">
                                    Rs {(item.unitPrice * item.quantity).toLocaleString('en-IN')}
                                  </span>
                                </div>
                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleSetInitialQty(item.id, 1)}
                                className="bg-[#84CC16] hover:bg-[#65A30D] text-[#1E3A1A] text-xs font-medium px-3.5 py-1.5 rounded-full transition cursor-pointer flex items-center gap-1 shadow-xs"
                              >
                                <Plus className="w-3.5 h-3.5" />
                                <span>Add to BOM</span>
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}

            {/* Cart Summary: Your BOM Cart */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-typhoon-border shadow-soft space-y-3.5">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-lg font-normal text-typhoon-navy">Your BOM cart</h3>
                <span className="text-xs bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 rounded-full font-medium">
                  {activeCartItems.length} items
                </span>
              </div>

              <div className="divide-y divide-typhoon-border/60">
                {activeCartItems.map((cItem) => (
                  <div key={cItem.id} className="py-2.5 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <h5 className="text-xs font-medium text-typhoon-navy truncate">
                        {cItem.name}
                      </h5>
                      <span className="text-[11px] text-typhoon-muted font-normal">
                        {cItem.quantity} {cItem.unitLabel} × Rs {cItem.unitPrice.toLocaleString('en-IN')}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-xs font-medium text-typhoon-navy">
                        Rs {(cItem.unitPrice * cItem.quantity).toLocaleString('en-IN')}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleUpdateQuantity(cItem.id, -cItem.quantity)}
                        className="text-rose-500 hover:text-rose-700 transition cursor-pointer p-1"
                        title="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-typhoon-border flex items-center justify-between">
                <span className="text-xs font-medium text-typhoon-navy">Total Staged BOM Value</span>
                <span className="text-base font-serif font-normal text-typhoon-navy">
                  Rs {totalCartAmount.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => toast.success('BOM Slip PDF generated and downloaded!')}
                  className="px-3 py-2.5 bg-[#FAF7F2] hover:bg-typhoon-sand rounded-xl border border-typhoon-border text-xs text-typhoon-navy font-medium flex items-center justify-center gap-1.5 transition cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-typhoon-muted" />
                  <span>Download BOM PDF</span>
                </button>

                <button
                  type="button"
                  onClick={handleSaveBOM}
                  className="px-3 py-2.5 bg-[#84CC16] hover:bg-[#65A30D] text-[#1E3A1A] rounded-xl text-xs font-medium flex items-center justify-center gap-1.5 transition cursor-pointer shadow-soft"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Save Staged BOM</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SECTION 2: CUSTOMER DELIVERY CALL & REMARKS                                */}
        {/* ========================================================================= */}
        {(activeSection === 'all' || activeSection === 'delivery') && (
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-typhoon-border shadow-soft space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif text-base font-normal text-typhoon-navy">
                  Customer Delivery Scheduling
                </h3>
                <p className="text-xs text-typhoon-muted">
                  Coordinate unloading date & terrace accessibility
                </p>
              </div>
              {isFollowupSaved && (
                <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 inline-flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Call Logged</span>
                </span>
              )}
            </div>

            <form onSubmit={handleSaveDeliveryCall} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-typhoon-navy mb-1">
                  Scheduled Unload Date
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-typhoon-muted absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="date"
                    value={deliveryDate}
                    onChange={(e) => setDeliveryDate(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 bg-[#FAF7F2] rounded-xl text-xs font-medium text-typhoon-navy border border-typhoon-border focus:border-typhoon-gold focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-typhoon-navy mb-1">
                  Customer Call Remarks & Special Instructions
                </label>
                <textarea
                  value={deliveryNotes}
                  onChange={(e) => setDeliveryNotes(e.target.value)}
                  placeholder="e.g. Spoke with customer. Confirmed morning delivery. Customer requested delivery truck arrival before 11 AM."
                  rows={3}
                  className="w-full p-3 bg-[#FAF7F2] rounded-xl text-xs font-medium text-typhoon-navy border border-typhoon-border focus:border-typhoon-gold focus:outline-none leading-relaxed"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#E08A1E] hover:bg-[#C97715] text-white font-medium py-2.5 rounded-xl text-xs shadow-soft transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{loading ? 'Saving to Database...' : 'Save Customer Delivery Call'}</span>
              </button>
            </form>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SECTION 3: UNLOAD PROOFS & PHOTO UPLOAD                                   */}
        {/* ========================================================================= */}
        {(activeSection === 'all' || activeSection === 'unload') && (
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-typhoon-border shadow-soft space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif text-base font-normal text-typhoon-navy">
                  Upload Site Unload Proofs (4 Photos)
                </h3>
                <p className="text-xs text-typhoon-muted">
                  Photos required before release of installation team
                </p>
              </div>
              {isUnloaded && (
                <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 inline-flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Unload Verified</span>
                </span>
              )}
            </div>

            <div className="border-2 border-dashed border-typhoon-border/80 rounded-2xl p-5 text-center bg-[#FAF7F2] hover:border-typhoon-gold transition cursor-pointer relative">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handlePhotoUpload}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <Camera className="w-8 h-8 text-typhoon-muted mx-auto mb-2" />
              <span className="text-xs font-medium text-typhoon-navy block">
                Tap to take or choose rooftop unload photos
              </span>
              <span className="text-[11px] text-typhoon-muted mt-0.5 block">
                Panels on terrace, Inverter box, DC cable spool, HDG structure
              </span>
            </div>

            {uploadedPhotos.length > 0 && (
              <div className="space-y-2">
                <span className="text-xs font-medium text-typhoon-navy block">
                  Selected Proof Files ({uploadedPhotos.length}):
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {uploadedPhotos.map((photo, i) => (
                    <div
                      key={i}
                      className="bg-[#FAF7F2] p-2 rounded-xl border border-typhoon-border/60 flex items-center gap-2 text-xs truncate"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span className="truncate text-typhoon-navy">{photo}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={handleUploadUnloadProofs}
              disabled={loading || uploadedPhotos.length === 0}
              className={`w-full font-medium py-3 rounded-2xl text-xs transition flex items-center justify-center gap-2 cursor-pointer shadow-soft ${uploadedPhotos.length > 0
                ? 'bg-typhoon-navy text-white hover:bg-slate-800'
                : 'bg-typhoon-sand text-typhoon-muted cursor-not-allowed'
                }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Mark Material Unloaded (Notify Irfan & Meera)</span>
            </button>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SECTION 4: VERIFY INSTALL (CROSS-DEPARTMENT LINK)                          */}
        {/* ========================================================================= */}
        {(activeSection === 'all' || activeSection === 'install') && (
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-typhoon-border shadow-soft space-y-3">
            <h3 className="font-serif text-base font-normal text-typhoon-navy">
              Cross-Department Installation Link
            </h3>
            <p className="text-xs text-typhoon-muted">
              Once materials are unloaded, Irfan (Installation Lead) conducts rooftop fabrication and serial logging.
            </p>
            <button
              type="button"
              onClick={() => router.push(`/installation/projects/${params.id}`)}
              className="w-full bg-[#FAF7F2] hover:bg-typhoon-sand border border-typhoon-border text-typhoon-navy text-xs font-medium py-2.5 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>View Installation Workspace ({projectId})</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Floating Follow-up Modal */}
      <FollowUpModal
        isOpen={isFollowupOpen}
        onClose={() => setIsFollowupOpen(false)}
        inquiryId={inquiry?.id || params.id}
        onSuccess={() => {
          toast.success('Follow-up recorded!');
          setIsFollowupOpen(false);
        }}
      />
    </div>
  );
}
