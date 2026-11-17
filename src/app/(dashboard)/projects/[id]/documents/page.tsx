'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  ChevronLeft,
  Upload,
  CheckCircle2,
  FileText,
  AlertCircle,
  Share2,
  Clock,
  Send,
  Eye,
  Trash2,
} from 'lucide-react';
import { toast } from 'sonner';
import { fetchWithAuth } from '@/lib/api';
import { useCurrentUser } from '@/lib/use-current-user';
import { FollowUpModal } from '@/components/FollowUpModal';

interface DocItem {
  id: string;
  name: string;
  description: string;
  file: File | null;
  uploadedAt: string | null;
  status: 'Pending' | 'Uploaded';
}

export default function KycDocumentLockerPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { theme } = useCurrentUser();
  const [loading, setLoading] = useState(false);
  const [inquiry, setInquiry] = useState<any>(null);
  const [isFollowupOpen, setIsFollowupOpen] = useState(false);
  const projectId = params.id.startsWith('TYP-') ? params.id : `TYP-2026-${params.id.replace('F-', '')}`;

  useEffect(() => {
    async function loadInquiry() {
      try {
        const res = await fetchWithAuth(`/api/v1/inquiries/${params.id}`);
        if (res.ok) {
          const data = await res.json();
          setInquiry(data);
        }
      } catch (err) {
        // silent fallback to params
      }
    }
    loadInquiry();
  }, [params.id]);

  const [docs, setDocs] = useState<DocItem[]>([
    {
      id: 'light_bill',
      name: 'Electricity Bill (DISCOM)',
      description: 'Recent light bill showing customer consumer number, tariff & sanctioned load.',
      file: null,
      uploadedAt: null,
      status: 'Pending',
    },
    {
      id: 'aadhaar_card',
      name: 'Aadhaar Card (Front & Back)',
      description: 'Identity & permanent address proof of the rooftop property owner.',
      file: null,
      uploadedAt: null,
      status: 'Pending',
    },
    {
      id: 'property_tax',
      name: 'Property Tax Receipt / Index-2',
      description: 'Proof of terrace ownership required for Surya Gujarat portal subsidy approval.',
      file: null,
      uploadedAt: null,
      status: 'Pending',
    },
    {
      id: 'canceled_cheque',
      name: 'Canceled Cheque / Bank Passbook',
      description: 'Bank account proof for direct DBT transfer of ₹78,000 PM Surya Ghar subsidy.',
      file: null,
      uploadedAt: null,
      status: 'Pending',
    },
  ]);

  const handleFileChange = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setDocs((prev) =>
        prev.map((doc) =>
          doc.id === id
            ? {
                ...doc,
                file: selectedFile,
                uploadedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                status: 'Uploaded',
              }
            : doc
        )
      );
      toast.success(`${selectedFile.name} uploaded!`);
    }
  };

  const handleRemoveFile = (id: string) => {
    setDocs((prev) =>
      prev.map((doc) =>
        doc.id === id
          ? {
              ...doc,
              file: null,
              uploadedAt: null,
              status: 'Pending',
            }
          : doc
      )
    );
  };

  const handleSendWhatsAppReminder = () => {
    const custName = inquiry?.customerName || 'Customer';
    const phone = inquiry?.customerPhone || '9825012345';
    const kw = inquiry?.requestedKw || 6;
    const text = encodeURIComponent(
      `Namaste ${custName} ji,\n\nRegarding your Typhoon Solar ${kw} kW rooftop project (${projectId}):\n\nPlease send photos of the following pending documents for your PM Surya Ghar subsidy:\n1. Latest DISCOM Electricity Bill\n2. Aadhaar Card\n3. Property Tax Receipt or Index-2\n4. Canceled Cheque or Bank Passbook copy\n\nThank you,\nTeam Typhoon Solar`
    );
    window.open(`https://wa.me/91${phone}?text=${text}`, '_blank');
  };

  const handleCompleteUploads = async (e: React.FormEvent) => {
    e.preventDefault();
    const uploadedCount = docs.filter((d) => d.status === 'Uploaded').length;

    if (uploadedCount === 0) {
      toast.error('Please upload at least one KYC document.');
      return;
    }

    try {
      setLoading(true);
      const docPayload = docs
        .filter((d) => d.status === 'Uploaded')
        .map((d) => ({
          docType: d.id.toUpperCase(),
          filePath: d.file ? d.file.name : `${d.id}.pdf`,
        }));

      const res = await fetchWithAuth(`/api/v1/inquiries/${params.id}/documents`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documents: docPayload }),
      });

      if (!res.ok) {
        throw new Error('Failed to update KYC documents in database.');
      }

      toast.success(
        `KYC Documents successfully saved! Portal User (Rahul Bhai) notified to start government portal filing.`
      );
      router.push(`/inquiries/${params.id}`);
    } catch (err: any) {
      toast.error(err.message || 'Error uploading documents');
    } finally {
      setLoading(false);
    }
  };

  const uploadedTotal = docs.filter((d) => d.status === 'Uploaded').length;

  return (
    <div className="min-h-screen bg-typhoon-sand pb-16">
      {/* Top Header with dynamic active user role theme */}
      <div
        style={{
          backgroundColor: theme.hex.headerBg,
          borderColor: theme.hex.headerBorder,
        }}
        className="text-white pt-6 pb-8 px-6 rounded-b-[32px] shadow-soft border-b transition-colors duration-300"
      >
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-3">
            <button
              onClick={() => router.back()}
              className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <span
                style={{
                  backgroundColor: theme.hex.accentBg,
                  color: theme.hex.accentTextColor,
                }}
                className="text-[10px] font-bold px-2.5 py-0.5 rounded-full"
              >
                STAGE 3 OF 10
              </span>
              <span className="text-xs text-white/70">KYC Gathering</span>
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl lg:text-3xl font-serif font-bold text-white tracking-tight">
                KYC Document Locker
              </h1>
              <p
                style={{ color: theme.hex.accentBg }}
                className="text-xs font-medium mt-1"
              >
                Project {projectId} · Ramesh Patel (+91 98250 12345)
              </p>
            </div>

            <button
              onClick={handleSendWhatsAppReminder}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-2 transition shadow-soft self-start md:self-auto"
            >
              <Share2 className="w-4 h-4" />
              <span>Send WhatsApp Doc Request</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-4xl mx-auto px-4 lg:px-6 -mt-3 space-y-4">
        {/* Progress summary card */}
        <div className="bg-white rounded-2xl p-5 border border-typhoon-border shadow-soft flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-typhoon-sand flex items-center justify-center text-typhoon-navy">
              <FileText className="w-5 h-5 text-typhoon-gold" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-typhoon-navy">
                Documents Collected: {uploadedTotal} of {docs.length}
              </h3>
              <p className="text-xs text-typhoon-muted">
                {uploadedTotal === docs.length
                  ? 'All 4 required documents ready for government portal upload.'
                  : 'Collect pending papers from customer or WhatsApp.'}
              </p>
            </div>
          </div>
          <span
            className={`text-xs font-bold px-3 py-1 rounded-full ${
              uploadedTotal === docs.length
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : 'bg-amber-50 text-amber-700 border border-amber-200'
            }`}
          >
            {uploadedTotal === docs.length ? 'Ready to Submit' : 'Pending Uploads'}
          </span>
        </div>

        {/* 4 Document Dropzone Cards */}
        <div className="space-y-3">
          {docs.map((doc, idx) => (
            <div
              key={doc.id}
              className="bg-white rounded-2xl p-5 border border-typhoon-border shadow-soft flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-3 flex-1">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                    doc.status === 'Uploaded' ? 'bg-emerald-50 text-emerald-600' : 'bg-typhoon-sand text-typhoon-navy'
                  }`}
                >
                  {doc.status === 'Uploaded' ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : (
                    <span className="text-xs font-bold">{idx + 1}</span>
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-bold text-typhoon-navy">{doc.name}</h4>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        doc.status === 'Uploaded'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      {doc.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-typhoon-muted mt-1 leading-relaxed">{doc.description}</p>

                  {doc.file && (
                    <div className="mt-2 text-[11px] text-typhoon-navy font-semibold flex items-center gap-2 bg-typhoon-sand/60 px-3 py-1.5 rounded-lg border border-typhoon-border/80">
                      <FileText className="w-3.5 h-3.5 text-typhoon-gold" />
                      <span className="truncate max-w-xs">{doc.file.name}</span>
                      <span className="text-[10px] text-typhoon-muted">({(doc.file.size / 1024).toFixed(1)} KB)</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Upload & Action Buttons */}
              <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                {doc.status === 'Uploaded' ? (
                  <button
                    type="button"
                    onClick={() => handleRemoveFile(doc.id)}
                    className="p-2 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 transition text-xs font-semibold flex items-center gap-1 border border-rose-200"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Remove</span>
                  </button>
                ) : (
                  <label className="cursor-pointer bg-typhoon-sand hover:bg-typhoon-sand-dark text-typhoon-navy font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 transition border border-typhoon-border/80 shadow-2xs">
                    <Upload className="w-3.5 h-3.5 text-typhoon-gold" />
                    <span>Upload Document</span>
                    <input
                      type="file"
                      accept="image/*,application/pdf"
                      onChange={(e) => handleFileChange(doc.id, e)}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Submit to Government Portal Action Button & Follow-up */}
        <div className="pt-2 flex gap-2">
          <button
            onClick={handleCompleteUploads}
            disabled={loading}
            className="flex-1 py-4 bg-typhoon-gold hover:bg-typhoon-gold-dark text-typhoon-navy font-bold text-sm rounded-2xl shadow-soft flex items-center justify-center gap-2 transition disabled:opacity-50"
          >
            <Send className="w-4 h-4 stroke-[2.5]" />
            <span>
              {loading ? 'Submitting to Portal Queue...' : 'Mark Documents Uploaded'}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setIsFollowupOpen(true)}
            className="py-4 px-5 rounded-2xl bg-white hover:bg-typhoon-sand text-typhoon-navy font-bold text-xs border border-typhoon-border shadow-soft transition flex items-center gap-1.5"
          >
            <Clock className="w-4 h-4 text-typhoon-gold" />
            <span>Follow-up</span>
          </button>
        </div>
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

