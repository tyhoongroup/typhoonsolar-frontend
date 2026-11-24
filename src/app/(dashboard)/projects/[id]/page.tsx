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
  Clock,
  Send,
  User,
} from 'lucide-react';
import { toast } from 'sonner';
import { getRoleTheme } from '@/lib/role-theme';
import { BrandLogo } from '@/components/BrandLogo';
import { FollowUpModal } from '@/components/FollowUpModal';

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

  const [currentUser, setCurrentUser] = useState<any>(null);
  const [inquiry, setInquiry] = useState<any>(null);
  const [followups, setFollowups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingDocId, setSavingDocId] = useState<string | null>(null);
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [isFollowupOpen, setIsFollowupOpen] = useState(false);

  // Meter Start Date input for Operations Manager & Portal
  const [meterStartDate, setMeterStartDate] = useState('');
  const [savingMeterDate, setSavingMeterDate] = useState(false);

  // Normalize project ID format: TYP-2026-XXXX
  const cleanNum = rawId.replace('TYP-2026-', '').replace('F-', '');
  const projectId = rawId.startsWith('TYP-') ? rawId : `TYP-2026-${cleanNum}`;

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

  useEffect(() => {
    try {
      const stored = localStorage.getItem('user');
      if (stored) setCurrentUser(JSON.parse(stored));
    } catch {}

    const token = localStorage.getItem('accessToken');
    if (!token) {
      router.push('/');
      return;
    }

    // Load Project Inquiry
    fetch(`/api/v1/inquiries/${rawId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        const item = data?.data || data;
        if (item) {
          setInquiry(item);
          if (item.portalApplication?.meterStartDate) {
            setMeterStartDate(new Date(item.portalApplication.meterStartDate).toISOString().split('T')[0]);
          }
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

          // Load followups history
          fetch(`/api/v1/followups/inquiry/${item.id}`, {
            headers: { Authorization: `Bearer ${token}` },
          })
            .then((r) => (r.ok ? r.json() : []))
            .then((fList) => {
              if (Array.isArray(fList)) setFollowups(fList);
            })
            .catch(() => {});
        }
      })
      .catch((err) => {
        console.error('Failed to load project inquiry:', err);
      })
      .finally(() => setLoading(false));
  }, [rawId, router]);

  const theme = getRoleTheme(currentUser?.role);
  const sColor = theme.hex.cardDarkBg || '#111827';
  const aColor = theme.hex.accentBg || '#6366F1';
  const cColor = theme.hex.lightBg || '#F5F5F7';
  const onColor = theme.hex.accentTextColor || '#FFFFFF';

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
      toast.success(`${selected.name} selected. Tap 'Save' to upload.`);
    }
  };

  // Save single document update
  const handleSaveDoc = async (docId: string) => {
    const targetDoc = docs.find((d) => d.id === docId);
    if (!targetDoc) return;

    const token = localStorage.getItem('accessToken');
    if (!token) {
      toast.error('Session expired. Please sign in again.');
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

      if (!res.ok) throw new Error('Failed to save document.');

      setDocs((prev) =>
        prev.map((d) => (d.id === docId ? { ...d, status: 'Uploaded' } : d))
      );
      toast.success(`${targetDoc.title} uploaded successfully!`);
    } catch (err: any) {
      toast.error(err.message || 'Error saving document.');
    } finally {
      setSavingDocId(null);
    }
  };

  // Save Start Meter Date
  const handleSaveMeterDate = async () => {
    if (!meterStartDate) {
      toast.error('Please select the Net Meter live start date.');
      return;
    }

    const token = localStorage.getItem('accessToken');
    if (!token) {
      toast.error('Session expired.');
      return;
    }

    setSavingMeterDate(true);
    try {
      const res = await fetch('/api/v1/portal/meter-dates', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          inquiryId: inquiry?.id || rawId,
          meterStartDate: new Date(meterStartDate).toISOString(),
        }),
      });

      if (!res.ok) throw new Error('Could not update meter start date.');

      toast.success('Net Meter Start Date saved & synchronized with grid!');
      if (inquiry) {
        setInquiry({
          ...inquiry,
          currentStage: 'METER_STARTED',
        });
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to save meter start date.');
    } finally {
      setSavingMeterDate(false);
    }
  };

  const customerName = inquiry?.customerName || 'Customer';
  const customerPhone = inquiry?.customerPhone || '9825012345';
  const requestedKw = inquiry?.requestedKw || '6.0';
  const meterPhase = inquiry?.meterPhase || 'Single Phase';
  const dealAmount = inquiry?.dealAmount ? Number(inquiry.dealAmount) : 275000;
  const stage = inquiry?.currentStage || 'DEAL_CLOSED';

  return (
    <div
      style={{
        backgroundColor: cColor,
        color: sColor,
      }}
      className="min-h-screen pb-28 font-sans"
    >
      {/* 1. Header with Role Gradient & Parabolic Curve */}
      <div
        style={{
          background: theme.hex.headerGradient || `linear-gradient(180deg, color-mix(in srgb, ${aColor} 38%, ${cColor}) 0%, color-mix(in srgb, ${aColor} 14%, ${cColor}) 100%)`,
          borderRadius: '0 0 50% 50% / 0 0 34px 34px',
          padding: '14px 16px 48px',
          color: sColor,
        }}
        className="relative"
      >
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => router.back()}
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.75)',
              borderColor: `color-mix(in srgb, ${sColor} 15%, transparent)`,
              color: sColor,
            }}
            className="w-9 h-9 rounded-full border flex items-center justify-center transition active:scale-95 cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <BrandLogo accentColor={aColor} textColor={sColor} size={24} />

          <button
            onClick={() => setIsFollowupOpen(true)}
            style={{
              backgroundColor: aColor,
              color: onColor,
            }}
            className="px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1 active:scale-95 transition cursor-pointer shadow-sm"
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Follow-up</span>
          </button>
        </div>

        <div className="mt-3">
          <div className="flex items-center justify-between">
            <span
              style={{ color: aColor }}
              className="text-[11px] font-extrabold uppercase tracking-wider block"
            >
              {projectId} · {inquiry?.city || 'Vadodara'}
            </span>
            <span
              style={{
                backgroundColor: `color-mix(in srgb, ${aColor} 22%, #ffffff)`,
                color: sColor,
              }}
              className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase"
            >
              {stage.replace(/_/g, ' ')}
            </span>
          </div>

          <h1
            style={{ color: sColor }}
            className="text-2xl font-extrabold tracking-tight mt-1"
          >
            {customerName}
          </h1>

          <p className="text-xs opacity-75 font-medium mt-0.5">
            +91 {customerPhone} · {requestedKw} kW · {meterPhase}
          </p>
        </div>
      </div>

      {/* 2. Main Content Cards */}
      <div className="px-3.5 -mt-6 space-y-3 relative z-10">
        {/* Project Snapshot Floating Tile */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '18px',
            border: `0.5px solid color-mix(in srgb, ${sColor} 8%, transparent)`,
            boxShadow: `0 6px 18px color-mix(in srgb, ${sColor} 8%, transparent)`,
          }}
          className="p-3.5 grid grid-cols-2 gap-2.5"
        >
          <div
            style={{ backgroundColor: `color-mix(in srgb, ${cColor} 60%, #ffffff)` }}
            className="p-2.5 rounded-xl border border-black/5"
          >
            <span className="text-[10px] opacity-60 font-bold uppercase block">Capacity</span>
            <span style={{ color: sColor }} className="text-base font-extrabold">
              {requestedKw} kWp
            </span>
          </div>

          <div
            style={{ backgroundColor: `color-mix(in srgb, ${cColor} 60%, #ffffff)` }}
            className="p-2.5 rounded-xl border border-black/5"
          >
            <span className="text-[10px] opacity-60 font-bold uppercase block">Agreed Deal Price</span>
            <span style={{ color: aColor }} className="text-base font-extrabold">
              ₹{dealAmount.toLocaleString('en-IN')}
            </span>
          </div>

          <div
            style={{ backgroundColor: `color-mix(in srgb, ${cColor} 60%, #ffffff)` }}
            className="p-2.5 rounded-xl border border-black/5"
          >
            <span className="text-[10px] opacity-60 font-bold uppercase block">PM Surya Ghar Subsidy</span>
            <span className="text-base font-extrabold text-emerald-600">₹78,000 DBT</span>
          </div>

          <div
            style={{ backgroundColor: `color-mix(in srgb, ${cColor} 60%, #ffffff)` }}
            className="p-2.5 rounded-xl border border-black/5"
          >
            <span className="text-[10px] opacity-60 font-bold uppercase block">Customer Net Cost</span>
            <span style={{ color: sColor }} className="text-base font-extrabold">
              ₹{(dealAmount - 78000).toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        {/* SECTION 1: START METER DATE (Operations Manager & Portal Action) */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '18px',
            border: `0.5px solid color-mix(in srgb, ${sColor} 8%, transparent)`,
            boxShadow: `0 6px 18px color-mix(in srgb, ${sColor} 8%, transparent)`,
          }}
          className="p-4"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Zap style={{ color: aColor }} className="w-4 h-4" />
              <h3 style={{ color: sColor }} className="text-sm font-extrabold">
                Grid Synchronization & Net Meter
              </h3>
            </div>
            {inquiry?.portalApplication?.meterStartDate && (
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
                METER LIVE
              </span>
            )}
          </div>

          <p className="text-xs text-gray-500 mb-3">
            Enter the date when GEB installed the bidirectional net meter and the solar plant started live generation:
          </p>

          <div className="flex gap-2">
            <input
              type="date"
              value={meterStartDate}
              onChange={(e) => setMeterStartDate(e.target.value)}
              className="flex-1 px-3 py-2 rounded-xl border border-gray-300 text-xs font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              onClick={handleSaveMeterDate}
              disabled={savingMeterDate}
              style={{
                backgroundColor: aColor,
                color: onColor,
              }}
              className="px-4 py-2 rounded-xl text-xs font-extrabold hover:opacity-90 active:scale-95 transition cursor-pointer disabled:opacity-50"
            >
              {savingMeterDate ? 'Saving...' : 'Start Meter Date Enter'}
            </button>
          </div>
        </div>

        {/* SECTION 2: QUOTATION SHEET & PROPOSAL */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '18px',
            border: `0.5px solid color-mix(in srgb, ${sColor} 8%, transparent)`,
            boxShadow: `0 6px 18px color-mix(in srgb, ${sColor} 8%, transparent)`,
          }}
          className="p-4"
        >
          <div className="flex items-center justify-between pb-2 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <FileText style={{ color: aColor }} className="w-4 h-4" />
              <h3 style={{ color: sColor }} className="text-sm font-extrabold">
                Official Quotation & Sizing
              </h3>
            </div>
            <button
              onClick={() => setShowPdfModal(true)}
              style={{ color: aColor }}
              className="text-xs font-bold hover:underline cursor-pointer flex items-center gap-1"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Preview</span>
            </button>
          </div>

          <div className="mt-3 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-gray-800">
                Proposal TSS/2627/{cleanNum}
              </p>
              <p className="text-[11px] text-gray-500 mt-0.5">
                TopCon 550W Panels · Growatt Inverter · ₹{dealAmount.toLocaleString('en-IN')}
              </p>
            </div>
            <button
              onClick={() => {
                const text = `Typhoon Solar System Quotation for ${customerName}: ${requestedKw} kW Rooftop Solar. Total Deal: ₹${dealAmount}. DBT Subsidy: ₹78,000.`;
                window.open(`https://wa.me/91${customerPhone}?text=${encodeURIComponent(text)}`, '_blank');
              }}
              className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white font-extrabold text-xs flex items-center gap-1 hover:bg-emerald-700 transition cursor-pointer"
            >
              <Share2 className="w-3 h-3" />
              <span>WhatsApp</span>
            </button>
          </div>
        </div>

        {/* SECTION 3: PROJECT KYC DOCUMENTS */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '18px',
            border: `0.5px solid color-mix(in srgb, ${sColor} 8%, transparent)`,
            boxShadow: `0 6px 18px color-mix(in srgb, ${sColor} 8%, transparent)`,
          }}
          className="p-4"
        >
          <div className="flex items-center justify-between pb-2 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <ShieldCheck style={{ color: aColor }} className="w-4 h-4" />
              <h3 style={{ color: sColor }} className="text-sm font-extrabold">
                Project KYC & Portal Documents
              </h3>
            </div>
            <span className="text-[11px] font-bold text-gray-500">
              {docs.filter((d) => d.status === 'Uploaded').length} / {docs.length} Uploaded
            </span>
          </div>

          <div className="mt-3 divide-y divide-gray-100">
            {docs.map((doc) => {
              const isUploaded = doc.status === 'Uploaded';
              const isSaving = savingDocId === doc.id;

              return (
                <div key={doc.id} className="py-3 first:pt-0 last:pb-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-gray-800">{doc.title}</span>
                        {isUploaded ? (
                          <span className="text-[9px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 flex items-center gap-0.5">
                            <Check className="w-2.5 h-2.5" />
                            <span>Uploaded</span>
                          </span>
                        ) : (
                          <span className="text-[9px] font-extrabold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700">
                            Pending
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-gray-500 mt-0.5 leading-tight">
                        {doc.description}
                      </p>
                      {doc.fileName && (
                        <p className="text-[10px] text-gray-400 mt-1 truncate">
                          File: {doc.fileName}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 flex-none">
                      <label className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 cursor-pointer transition">
                        <Upload className="w-3.5 h-3.5" />
                        <input
                          type="file"
                          accept=".pdf,.png,.jpg,.jpeg"
                          className="hidden"
                          onChange={(e) => handleFileSelect(doc.id, e)}
                        />
                      </label>

                      {doc.file && (
                        <button
                          onClick={() => handleSaveDoc(doc.id)}
                          disabled={isSaving}
                          style={{ backgroundColor: aColor, color: onColor }}
                          className="px-2.5 py-1.5 rounded-xl text-xs font-bold hover:opacity-90 transition cursor-pointer"
                        >
                          {isSaving ? '...' : 'Save'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* SECTION 4: AUDIT TIMELINE & WHO DID WHAT */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '18px',
            border: `0.5px solid color-mix(in srgb, ${sColor} 8%, transparent)`,
            boxShadow: `0 6px 18px color-mix(in srgb, ${sColor} 8%, transparent)`,
          }}
          className="p-4"
        >
          <div className="flex items-center justify-between pb-2 border-b border-gray-100 mb-3">
            <div className="flex items-center gap-2">
              <Clock style={{ color: aColor }} className="w-4 h-4" />
              <h3 style={{ color: sColor }} className="text-sm font-extrabold">
                Activity Audit & Follow-ups Done
              </h3>
            </div>
            <button
              onClick={() => setIsFollowupOpen(true)}
              style={{ color: aColor }}
              className="text-xs font-bold hover:underline cursor-pointer"
            >
              + Add
            </button>
          </div>

          {followups.length === 0 ? (
            <p className="text-xs text-gray-400 text-center py-4">
              No follow-ups logged yet. Tap '+ Add' to schedule one.
            </p>
          ) : (
            <div className="space-y-3">
              {followups.map((f, idx) => (
                <div
                  key={f.id || idx}
                  className="p-3 rounded-xl bg-gray-50 border border-gray-100"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-gray-800">
                      {f.description?.split('-')[0] || 'Follow-up'}
                    </span>
                    <span className="text-[10px] text-gray-500">
                      {new Date(f.committedDate || f.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                      })}
                    </span>
                  </div>

                  <p className="text-xs text-gray-600 mt-1 leading-snug">
                    {f.description}
                  </p>

                  <div className="mt-2 pt-1.5 border-t border-gray-200/60 flex items-center justify-between text-[10px] text-gray-400">
                    <span>By: {f.createdBy?.fullName || 'Team Member'} ({f.createdBy?.role || 'Staff'})</span>
                    <span className="font-bold text-gray-600">{f.stage?.replace(/_/g, ' ')}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Universal Follow-up Modal */}
      <FollowUpModal
        isOpen={isFollowupOpen}
        onClose={() => setIsFollowupOpen(false)}
        inquiryId={inquiry?.id || rawId}
        stage={inquiry?.currentStage || 'DEAL_CLOSED'}
        role={currentUser?.role}
        onSuccess={() => {
          if (inquiry) {
            fetch(`/api/v1/followups/inquiry/${inquiry.id}`, {
              headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
            })
              .then((r) => (r.ok ? r.json() : []))
              .then((fList) => {
                if (Array.isArray(fList)) setFollowups(fList);
              });
          }
        }}
      />

      {/* PDF Modal Preview */}
      {showPdfModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-start border-b pb-3">
              <div>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">
                  QUOTATION SUMMARY
                </span>
                <h3 className="text-lg font-bold text-gray-900">
                  {projectId} · {customerName}
                </h3>
              </div>
              <button
                onClick={() => setShowPdfModal(false)}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="text-xs space-y-2">
              <div className="p-3 bg-gray-50 rounded-xl space-y-1">
                <div>Customer: <span className="font-bold">{customerName}</span></div>
                <div>Capacity: <span className="font-bold">{requestedKw} kW</span></div>
                <div>Phase: <span className="font-bold">{meterPhase}</span></div>
                <div>Total Price: <span className="font-bold text-emerald-600">₹{dealAmount.toLocaleString('en-IN')}</span></div>
                <div>PM Surya Subsidy: <span className="font-bold text-emerald-600">₹78,000</span></div>
              </div>
            </div>

            <button
              onClick={() => setShowPdfModal(false)}
              className="w-full py-2.5 rounded-xl bg-gray-900 text-white font-bold text-xs"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
