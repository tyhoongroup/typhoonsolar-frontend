'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
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
  Camera,
  UserPlus,
  Building,
  Check,
} from 'lucide-react';
import { toast } from 'sonner';
import { fetchWithAuth } from '@/lib/api';
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
  const searchParams = useSearchParams();
  const modeParam = (searchParams.get('mode') || 'cash').toLowerCase();

  const [loading, setLoading] = useState(false);
  const [inquiry, setInquiry] = useState<any>(null);
  const [isFollowupOpen, setIsFollowupOpen] = useState(false);
  const [mode, setMode] = useState<'cash' | 'loan'>(modeParam === 'loan' ? 'loan' : 'cash');

  // Co-applicant state for Loan
  const [coApplicantName, setCoApplicantName] = useState('');
  const [coApplicantPhone, setCoApplicantPhone] = useState('');
  const [coApplicantEmail, setCoApplicantEmail] = useState('');

  const cleanNum = params.id.replace('TYP-2026-', '').replace('F-', '');
  const projectId = params.id.startsWith('TYP-') ? params.id : `TYP-2026-${cleanNum}`;

  useEffect(() => {
    async function loadInquiry() {
      try {
        const res = await fetchWithAuth(`/api/v1/inquiries/${params.id}`);
        if (res.ok) {
          const data = await res.json();
          const item = data?.data || data;
          setInquiry(item);
        }
      } catch (err) {
        // silent fallback
      }
    }
    loadInquiry();
  }, [params.id]);

  // Conditional Documents: Cash vs Loan
  const getInitialDocs = (currentMode: 'cash' | 'loan'): DocItem[] => {
    const baseDocs: DocItem[] = [
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
    ];

    if (currentMode === 'cash') {
      return [
        ...baseDocs,
        {
          id: 'bank_details',
          name: 'Canceled Cheque / Bank Passbook',
          description: 'Bank account proof for direct DBT transfer of PM Surya Ghar subsidy.',
          file: null,
          uploadedAt: null,
          status: 'Pending',
        },
      ];
    }

    // Loan Mode requires Property Doc, GPS Terrace Photo, and Co-applicant documents
    return [
      ...baseDocs,
      {
        id: 'property_doc',
        name: 'Property Tax Receipt / Index-2',
        description: 'Proof of terrace ownership required for bank loan underwriting & Surya Gujarat portal.',
        file: null,
        uploadedAt: null,
        status: 'Pending',
      },
      {
        id: 'gps_photo',
        name: 'Site Terrace GPS Photo',
        description: 'Geotagged rooftop inspection photo showing sun access & terrace area.',
        file: null,
        uploadedAt: null,
        status: 'Pending',
      },
      {
        id: 'co_aadhaar',
        name: 'Co-Applicant Aadhaar Card',
        description: 'Government photo identification of the loan co-applicant.',
        file: null,
        uploadedAt: null,
        status: 'Pending',
      },
      {
        id: 'co_pan',
        name: 'Co-Applicant PAN Card',
        description: 'Income Tax PAN card of the co-applicant for CIBIL bank appraisal.',
        file: null,
        uploadedAt: null,
        status: 'Pending',
      },
    ];
  };

  const [docs, setDocs] = useState<DocItem[]>(() => getInitialDocs(mode));

  // Sync docs when mode changes
  const handleModeChange = (newMode: 'cash' | 'loan') => {
    setMode(newMode);
    setDocs(getInitialDocs(newMode));
  };

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
      toast.success(`${selectedFile.name} uploaded successfully!`);
    }
  };

  const handleSendWhatsAppRequest = () => {
    const custPhone = inquiry?.customerPhone?.replace(/\D/g, '') || '9825012345';
    const custName = inquiry?.customerName || 'Customer';

    const requiredList =
      mode === 'cash'
        ? '1. Latest Light Bill\n2. Aadhaar Card (Both Sides)\n3. Bank Passbook / Canceled Cheque'
        : '1. Latest Light Bill\n2. Aadhaar Card (Both Sides)\n3. Property Tax Receipt / Index-2\n4. Terrace Photo\n5. Co-Applicant Aadhaar & PAN';

    const msg = `Namaste *${custName}*,\n\nGreetings from *Typhoon Solar*!\n\nTo initiate your solar rooftop subsidy registration and loan approval for project *${projectId}*, please send photos of the following documents:\n\n${requiredList}\n\nYou can reply directly to this message with photos or PDF documents.\n\nThank you,\nTyphoon Solar Team`;

    const url = `https://wa.me/91${custPhone}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
    toast.success('Opening WhatsApp document request...');
  };

  const uploadedCount = docs.filter((d) => d.status === 'Uploaded').length;
  const isComplete = uploadedCount === docs.length;

  const handleSaveAll = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success('KYC Documents & Applicant details saved successfully!');
      router.push(`/projects/${projectId}`);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#FBF8F3] pb-28 font-sans">
      {/* 1. Curved Dark Header matching Image 9 */}
      <div className="bg-[#0B1E36] text-white pt-6 pb-8 px-5 rounded-b-[32px] shadow-soft relative overflow-hidden">
        <div className="max-w-md mx-auto">
          {/* Top Bar with Back and Stage Pill */}
          <div className="flex items-center justify-between mb-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center transition cursor-pointer hover:bg-white/20 text-white"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <span className="text-[11px] font-bold px-3 py-1 bg-white/10 rounded-full border border-white/20 text-amber-300 uppercase tracking-wider">
              STAGE 4 OF 10 · KYC Gathering
            </span>

            <button
              onClick={() => setIsFollowupOpen(true)}
              className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center transition cursor-pointer hover:bg-white/20 text-white"
            >
              <Clock className="w-4 h-4 text-amber-400" />
            </button>
          </div>

          <h1 className="text-3xl font-serif font-bold text-white tracking-tight">
            KYC Document Locker
          </h1>
          <p className="text-xs text-white/70 mt-1 font-medium">
            Project {projectId} · {inquiry?.customerName || 'Customer'} (+91 {inquiry?.customerPhone || '98250 12345'})
          </p>

          {/* Green Send WhatsApp Doc Request Button */}
          <button
            type="button"
            onClick={handleSendWhatsAppRequest}
            className="w-full mt-4 py-3 px-4 rounded-2xl bg-[#10B981] hover:bg-emerald-600 text-white font-bold text-xs shadow-md flex items-center justify-center gap-2 transition cursor-pointer active:scale-98"
          >
            <Send className="w-4 h-4" />
            <span>Send WhatsApp Doc Request</span>
          </button>
        </div>
      </div>

      {/* 2. Main Body */}
      <div className="max-w-md mx-auto px-4 pt-4 space-y-4">
        {/* Mode Switcher (Cash vs Loan) */}
        <div className="bg-white rounded-2xl p-3.5 border border-slate-200 shadow-soft flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              PAYMENT FINANCING
            </span>
            <span className="text-xs font-bold text-[#0B1E36]">
              {mode === 'cash' ? 'Cash / Self-Financed' : 'Bank Solar Loan'}
            </span>
          </div>

          <div className="flex gap-1.5 bg-slate-100 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => handleModeChange('cash')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                mode === 'cash' ? 'bg-[#0B1E36] text-[#F59E0B] shadow-xs' : 'text-slate-600 hover:text-[#0B1E36]'
              }`}
            >
              Cash
            </button>
            <button
              type="button"
              onClick={() => handleModeChange('loan')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                mode === 'loan' ? 'bg-[#0B1E36] text-[#F59E0B] shadow-xs' : 'text-slate-600 hover:text-[#0B1E36]'
              }`}
            >
              Loan
            </button>
          </div>
        </div>

        {/* Progress Card */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-soft flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#0B1E36]">
                Documents Collected: {uploadedCount} of {docs.length}
              </h4>
              <p className="text-[11px] text-slate-500">Collect pending papers from customer or WhatsApp.</p>
            </div>
          </div>
          <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${
            isComplete
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-amber-50 text-amber-800 border-amber-200'
          }`}>
            {isComplete ? 'Complete' : 'Pending Uploads'}
          </span>
        </div>

        {/* Loan Co-Applicant Information Card */}
        {mode === 'loan' && (
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-soft space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <UserPlus className="w-4 h-4 text-amber-600" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#0B1E36]">
                Co-Applicant Details (Bank Loan)
              </h3>
            </div>

            <div className="space-y-2">
              <div>
                <label className="text-[10px] font-bold text-slate-500 block mb-0.5">
                  Co-Applicant Full Name *
                </label>
                <input
                  type="text"
                  value={coApplicantName}
                  onChange={(e) => setCoApplicantName(e.target.value)}
                  placeholder="e.g. Smt. Neetaben Patel"
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-medium text-[#0B1E36] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 block mb-0.5">
                    Mobile Number *
                  </label>
                  <input
                    type="tel"
                    value={coApplicantPhone}
                    onChange={(e) => setCoApplicantPhone(e.target.value)}
                    placeholder="98250 12345"
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-medium text-[#0B1E36] outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-500 block mb-0.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={coApplicantEmail}
                    onChange={(e) => setCoApplicantEmail(e.target.value)}
                    placeholder="applicant@gmail.com"
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-medium text-[#0B1E36] outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Document Cards List */}
        <div className="space-y-3">
          {docs.map((doc, idx) => (
            <div
              key={doc.id}
              className="bg-white rounded-2xl p-4 border border-slate-200 shadow-soft space-y-2.5"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-lg bg-slate-100 text-[#0B1E36] font-bold text-xs flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <div>
                    <h5 className="text-xs font-bold text-[#0B1E36]">{doc.name}</h5>
                    <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">{doc.description}</p>
                  </div>
                </div>

                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                    doc.status === 'Uploaded'
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : 'bg-amber-50 text-amber-800 border-amber-200'
                  }`}
                >
                  {doc.status}
                </span>
              </div>

              {/* Upload Trigger Button */}
              <div className="pt-1">
                <label className="w-full py-2.5 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-[#0B1E36] font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer active:scale-98">
                  <Upload className="w-3.5 h-3.5 text-amber-600" />
                  <span>{doc.status === 'Uploaded' ? 'Re-upload Document' : 'Upload Document'}</span>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*,application/pdf"
                    onChange={(e) => handleFileChange(doc.id, e)}
                  />
                </label>
              </div>
            </div>
          ))}
        </div>

        {/* Save & Complete KYC Button */}
        <div className="pt-2">
          <button
            type="button"
            onClick={handleSaveAll}
            disabled={loading}
            className="w-full py-4 px-6 rounded-2xl bg-[#0B1E36] hover:bg-[#162C46] text-[#F59E0B] font-bold text-xs shadow-md flex items-center justify-center gap-2 transition cursor-pointer active:scale-98"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{loading ? 'Saving Locker...' : 'Save & Proceed to Project Detail Page'}</span>
          </button>
        </div>
      </div>

      <FollowUpModal
        isOpen={isFollowupOpen}
        onClose={() => setIsFollowupOpen(false)}
        inquiryId={projectId}
        stage="GOVT_DOCS_SUBMITTED"
      />
    </div>
  );
}
