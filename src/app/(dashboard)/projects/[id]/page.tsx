'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  ChevronLeft,
  Check,
  FileText,
  Upload,
  Phone,
  CheckCircle2,
  Calendar,
  AlertCircle,
  Eye,
  Download,
  IndianRupee,
  Home,
  ShieldCheck,
  Zap,
  X,
  Share2,
} from 'lucide-react';
import { toast } from 'sonner';
import { useCurrentUser } from '@/lib/use-current-user';

interface KycDoc {
  id: string;
  typeKey: string;
  title: string;
  description: string;
  status: 'Pending' | 'Uploaded';
  fileName?: string;
  file?: File | null;
}

export default function ProjectDetailPage() {
  const router = useRouter();
  const params = useParams();
  const rawId = params.id as string;
  const { user, theme } = useCurrentUser();

  // Normalize project ID format: TYP-2026-XXXX
  const cleanNum = rawId.replace('TYP-2026-', '').replace('F-', '');
  const projectId = rawId.startsWith('TYP-') ? rawId : `TYP-2026-${cleanNum}`;

  const [inquiry, setInquiry] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [savingDocId, setSavingDocId] = useState<string | null>(null);
  const [showPdfModal, setShowPdfModal] = useState(false);

  // KYC Documents with editable title and description
  const [docs, setDocs] = useState<KycDoc[]>([
    {
      id: 'light-bill',
      typeKey: 'LIGHT_BILL',
      title: 'Electricity Bill (DISCOM)',
      description: 'Recent consumer light bill showing sanctioned load & consumer number.',
      status: 'Pending',
    },
    {
      id: 'aadhaar-card',
      typeKey: 'AADHAAR',
      title: 'Aadhaar Card (Front & Back)',
      description: 'Terrace property owner identity proof for PM Surya Ghar registration.',
      status: 'Pending',
    },
    {
      id: 'property-tax',
      typeKey: 'PROPERTY_TAX',
      title: 'Property Tax Receipt / Index-2',
      description: 'Proof of rooftop terrace ownership for government portal filing.',
      status: 'Pending',
    },
    {
      id: 'bank-passbook',
      typeKey: 'PASSBOOK',
      title: 'Bank Passbook / Canceled Cheque',
      description: 'Bank account verification for ₹78,000 DBT central subsidy deposit.',
      status: 'Pending',
    },
  ]);

  // Load project inquiry data
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      router.push('/');
      return;
    }

    fetch(`/api/v1/inquiries/${rawId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        const item = data?.data || data;
        if (item) {
          setInquiry(item);
          // Check if documents already uploaded
          if (item.documents && item.documents.length > 0) {
            setDocs((prev) =>
              prev.map((d) => {
                const found = item.documents.find(
                  (ex: any) => ex.docType?.toLowerCase() === d.typeKey.toLowerCase()
                );
                return found
                  ? { ...d, status: 'Uploaded', fileName: found.filePath }
                  : d;
              })
            );
          }
        }
      })
      .catch((err) => {
        console.error('Failed to load project inquiry:', err);
      })
      .finally(() => setLoading(false));
  }, [rawId, router]);

  // Handle document file change
  const handleFileSelect = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      setDocs((prev) =>
        prev.map((d) =>
          d.id === id
            ? { ...d, file: selected, fileName: selected.name, status: 'Uploaded' }
            : d
        )
      );
      toast.success(`${selected.name} selected. Click 'Save Document' to upload.`);
    }
  };

  // Save single document update
  const handleSaveDoc = async (docId: string) => {
    const targetDoc = docs.find((d) => d.id === docId);
    if (!targetDoc) return;

    const token = localStorage.getItem('accessToken');
    if (!token) {
      toast.error('Session expired. Please sign in again.');
      router.push('/');
      return;
    }

    setSavingDocId(docId);
    try {
      const res = await fetch(`/api/v1/inquiries/${inquiry?.id || rawId}/documents`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          documents: [
            {
              docType: targetDoc.typeKey,
              filePath: targetDoc.fileName || `${targetDoc.id}.pdf`,
              title: targetDoc.title,
              description: targetDoc.description,
            },
          ],
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to save document.');
      }

      setDocs((prev) =>
        prev.map((d) => (d.id === docId ? { ...d, status: 'Uploaded' } : d))
      );
      toast.success(`${targetDoc.title} saved successfully!`);
    } catch (err: any) {
      toast.error(err.message || 'Error saving document.');
    } finally {
      setSavingDocId(null);
    }
  };

  const customerName = inquiry?.customerName || 'Customer';
  const customerPhone = inquiry?.customerPhone || '9825012345';
  const requestedKw = inquiry?.requestedKw || '6.0';
  const meterPhase = inquiry?.meterPhase || 'Single Phase';
  const dealAmount = inquiry?.dealAmount ? Number(inquiry.dealAmount) : 275000;
  const quote = inquiry?.quotation;

  return (
    <div className="min-h-screen bg-typhoon-sand pb-28">
      {/* 1. Curved Header */}
      <div
        style={{ backgroundColor: theme.hex.headerBg }}
        className="pt-6 pb-8 px-5 rounded-b-[32px] shadow-soft relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 border border-white/5 rounded-full pointer-events-none -mr-16 -mt-16" />
        <div className="absolute top-0 right-0 w-44 h-44 border border-white/5 rounded-full pointer-events-none -mr-8 -mt-8" />

        <div className="max-w-3xl mx-auto">
          <button
            type="button"
            onClick={() => router.push('/inquiries')}
            className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition mb-3 cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold tracking-widest text-white/70 uppercase block">
                ACTIVE CLOSED PROJECT
              </span>
              <h1 className="text-3xl font-serif font-bold text-white tracking-tight">
                {projectId}
              </h1>
              <p className="text-xs text-white/80 mt-1 font-medium">
                {customerName} · +91 {customerPhone} · {inquiry?.city || 'Vadodara'}
              </p>
            </div>

            <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide">
              Deal Closed
            </span>
          </div>
        </div>
      </div>

      {/* 2. Main Content */}
      <div className="max-w-3xl mx-auto px-4 pt-4 space-y-4">
        {/* Project Snapshot Card */}
        <div className="bg-white rounded-2xl p-5 border border-typhoon-border shadow-soft grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-typhoon-sand/60 p-3 rounded-xl border border-typhoon-border/60">
            <span className="text-[10px] text-typhoon-muted font-semibold uppercase block">System Capacity</span>
            <span className="text-base font-bold text-typhoon-navy">{requestedKw} kW</span>
          </div>

          <div className="bg-typhoon-sand/60 p-3 rounded-xl border border-typhoon-border/60">
            <span className="text-[10px] text-typhoon-muted font-semibold uppercase block">Meter Grid</span>
            <span className="text-base font-bold text-typhoon-navy">{meterPhase}</span>
          </div>

          <div className="bg-typhoon-sand/60 p-3 rounded-xl border border-typhoon-border/60">
            <span className="text-[10px] text-typhoon-muted font-semibold uppercase block">Agreed Deal Price</span>
            <span className="text-base font-bold text-emerald-600">₹{dealAmount.toLocaleString('en-IN')}</span>
          </div>

          <div className="bg-typhoon-sand/60 p-3 rounded-xl border border-typhoon-border/60">
            <span className="text-[10px] text-typhoon-muted font-semibold uppercase block">PM Surya Subsidy</span>
            <span className="text-base font-bold text-typhoon-gold-dark">₹78,000 DBT</span>
          </div>
        </div>

        {/* SECTION 1: QUOTATION SHEET PDF PREVIEW */}
        <div className="bg-white rounded-2xl p-5 border border-typhoon-border shadow-soft space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-typhoon-border/60">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-typhoon-navy" />
              <div>
                <h3 className="text-sm font-bold text-typhoon-navy">
                  Quotation Sheet & System Specifications
                </h3>
                <p className="text-xs text-typhoon-muted">
                  Approved commercial quotation TSS/2627/{cleanNum}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowPdfModal(true)}
              className="px-3.5 py-1.5 rounded-xl bg-typhoon-sand hover:bg-typhoon-sand-dark text-typhoon-navy font-bold text-xs flex items-center gap-1.5 transition border border-typhoon-border cursor-pointer"
            >
              <Eye className="w-4 h-4" />
              <span>View PDF</span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs pt-1">
            <div className="p-2.5 bg-typhoon-sand/40 rounded-xl">
              <span className="text-[10px] text-typhoon-muted block">Modules</span>
              <span className="font-bold text-typhoon-navy">
                {quote?.panelQuantity || Math.round((Number(requestedKw) * 1000) / 580)} × {quote?.panelWattage || 580}W ({quote?.panelTech || 'Topcon'})
              </span>
            </div>

            <div className="p-2.5 bg-typhoon-sand/40 rounded-xl">
              <span className="text-[10px] text-typhoon-muted block">Inverter</span>
              <span className="font-bold text-typhoon-navy">
                {quote?.inverterCapacityKw || (Number(requestedKw) <= 3 ? 3.3 : 6.0)} kW {quote?.inverterBrand || 'Growatt'}
              </span>
            </div>

            <div className="p-2.5 bg-typhoon-sand/40 rounded-xl">
              <span className="text-[10px] text-typhoon-muted block">Net Customer Cost</span>
              <span className="font-bold text-emerald-600">
                ₹{(quote?.netCustomerCost || Math.max(0, dealAmount - 78000)).toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        </div>

        {/* SECTION 2: KYC DOCUMENTS UPLOAD (LIGHT BILL, AADHAAR, PROPERTY TAX, PASSBOOK) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <div>
              <h3 className="text-xs font-bold tracking-widest text-typhoon-navy uppercase">
                KYC DOCUMENT LOCKER
              </h3>
              <p className="text-xs text-typhoon-muted">
                Salesperson document collection for PM Surya Ghar portal filing
              </p>
            </div>
            <span className="text-xs font-bold text-emerald-600">
              {docs.filter((d) => d.status === 'Uploaded').length} of {docs.length} Uploaded
            </span>
          </div>

          <div className="space-y-3">
            {docs.map((doc) => {
              const isUploaded = doc.status === 'Uploaded';
              const isSaving = savingDocId === doc.id;

              return (
                <div
                  key={doc.id}
                  className="bg-white rounded-2xl p-4 border border-typhoon-border shadow-soft space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                          isUploaded ? 'bg-emerald-50 text-emerald-700' : 'bg-typhoon-sand text-typhoon-navy'
                        }`}
                      >
                        <ShieldCheck className="w-5 h-5" />
                      </div>
                      <div>
                        {/* Editable Document Title */}
                        <input
                          type="text"
                          value={doc.title}
                          onChange={(e) =>
                            setDocs((prev) =>
                              prev.map((d) => (d.id === doc.id ? { ...d, title: e.target.value } : d))
                            )
                          }
                          className="font-bold text-sm text-typhoon-navy bg-transparent outline-none border-b border-transparent hover:border-typhoon-border focus:border-typhoon-gold"
                        />
                        <span
                          className={`inline-block ml-2 text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                            isUploaded
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                              : 'bg-amber-50 text-amber-800 border-amber-300'
                          }`}
                        >
                          {isUploaded ? 'Uploaded' : 'Pending'}
                        </span>
                      </div>
                    </div>

                    {/* File Upload Trigger */}
                    <label className="cursor-pointer">
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*,application/pdf"
                        onChange={(e) => handleFileSelect(doc.id, e)}
                      />
                      <span className="px-3 py-1.5 rounded-xl bg-typhoon-sand hover:bg-typhoon-sand-dark text-typhoon-navy text-xs font-bold border border-typhoon-border flex items-center gap-1.5 transition">
                        <Upload className="w-3.5 h-3.5" />
                        <span>{doc.fileName ? 'Change File' : 'Choose File'}</span>
                      </span>
                    </label>
                  </div>

                  {/* Editable Description */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-typhoon-muted uppercase block">
                      Description & Notes
                    </label>
                    <input
                      type="text"
                      value={doc.description}
                      onChange={(e) =>
                        setDocs((prev) =>
                          prev.map((d) =>
                            d.id === doc.id ? { ...d, description: e.target.value } : d
                          )
                        )
                      }
                      className="w-full p-2.5 rounded-xl border border-typhoon-border/70 bg-typhoon-sand/30 text-xs text-typhoon-navy outline-none focus:ring-1 focus:ring-typhoon-gold"
                      placeholder="Add document description..."
                    />
                  </div>

                  {/* File status and Save button */}
                  <div className="flex items-center justify-between pt-1 border-t border-typhoon-border/60 text-xs">
                    <span className="text-[11px] text-typhoon-muted truncate max-w-[200px]">
                      {doc.fileName ? `File: ${doc.fileName}` : 'No file chosen yet'}
                    </span>

                    <button
                      type="button"
                      onClick={() => handleSaveDoc(doc.id)}
                      disabled={isSaving}
                      className="px-4 py-2 rounded-xl bg-typhoon-navy hover:bg-typhoon-navy-light text-white font-bold text-xs transition cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>{isSaving ? 'Saving...' : 'Save Document'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ================================================================ */}
      {/* QUOTATION PDF PREVIEW MODAL                                      */}
      {/* ================================================================ */}
      {showPdfModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-xs">
          <div className="bg-white w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl p-6 border border-typhoon-border shadow-2xl space-y-4">
            <div className="flex justify-between items-start pb-3 border-b border-typhoon-border/60">
              <div>
                <span className="text-[10px] font-bold text-typhoon-gold-dark tracking-widest uppercase block">
                  OFFICIAL QUOTATION PDF
                </span>
                <h3 className="text-xl font-serif font-bold text-typhoon-navy">
                  Typhoon Solar Project {projectId}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowPdfModal(false)}
                className="w-8 h-8 rounded-full bg-typhoon-sand flex items-center justify-center text-typhoon-navy hover:bg-typhoon-sand-dark transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-typhoon-sand/40 p-4 rounded-xl border border-typhoon-border/70 grid grid-cols-2 gap-2">
                <div>Customer: <span className="font-bold text-typhoon-navy">{customerName}</span></div>
                <div>Location: <span className="font-bold text-typhoon-navy">{inquiry?.city || 'Vadodara'}</span></div>
                <div>Capacity: <span className="font-bold text-typhoon-navy">{requestedKw} kWp</span></div>
                <div>Phase: <span className="font-bold text-typhoon-navy">{meterPhase}</span></div>
              </div>

              <div className="border border-typhoon-border rounded-xl p-3 space-y-1">
                <div className="font-bold text-typhoon-navy">Commercial Terms</div>
                <div>Total Project Deal Price: <span className="font-bold text-typhoon-navy">₹{dealAmount.toLocaleString('en-IN')}</span></div>
                <div>Central DBT Subsidy: <span className="font-bold text-emerald-600">₹78,000</span></div>
                <div>Net Customer Investment: <span className="font-bold text-typhoon-navy">₹{(dealAmount - 78000).toLocaleString('en-IN')}</span></div>
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => window.print()}
                className="px-4 py-2.5 rounded-xl bg-typhoon-sand text-typhoon-navy font-bold text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Print PDF</span>
              </button>
              <button
                type="button"
                onClick={() => setShowPdfModal(false)}
                className="px-4 py-2.5 rounded-xl bg-typhoon-navy text-white font-bold text-xs cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
