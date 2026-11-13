'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  ChevronLeft,
  FileText,
  Download,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Send,
  X,
  ExternalLink,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { toast } from 'sonner';
import { fetchWithAuth } from '@/lib/api';

export default function PortalProjectProcessingPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [inquiry, setInquiry] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const projectId = params.id.startsWith('TYP-') ? params.id : `TYP-2026-${params.id.replace('F-', '')}`;

  // Form & Workflow States
  const [srNumber, setSrNumber] = useState('');
  const [isApplicationSubmitted, setIsApplicationSubmitted] = useState(false);
  const [isSrSaved, setIsSrSaved] = useState(false);
  const [meterInstallDate, setMeterInstallDate] = useState('');
  const [commissioningDate, setCommissioningDate] = useState('');
  const [isMeterFileSubmitted, setIsMeterFileSubmitted] = useState(false);
  const [isSubsidyClaimed, setIsSubsidyClaimed] = useState(false);
  const [isSubsidyReceived, setIsSubsidyReceived] = useState(false);

  // Document Query Modal State
  const [isQueryModalOpen, setIsQueryModalOpen] = useState(false);
  const [selectedDocForQuery, setSelectedDocForQuery] = useState('');
  const [queryText, setQueryText] = useState('');
  const [activeQuery, setActiveQuery] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetchWithAuth(`/api/v1/inquiries/${params.id}`);
        if (res.ok) {
          const data = await res.json();
          setInquiry(data);
          if (data.portalApplication) {
            if (data.portalApplication.srNumber) {
              setSrNumber(data.portalApplication.srNumber);
              setIsSrSaved(true);
            }
            if (data.portalApplication.gebMeterInstallDate) {
              setMeterInstallDate(data.portalApplication.gebMeterInstallDate.split('T')[0]);
            }
            if (data.portalApplication.meterStartDate) {
              setCommissioningDate(data.portalApplication.meterStartDate.split('T')[0]);
            }
            if (data.portalApplication.meterFileSubmitDate) {
              setIsMeterFileSubmitted(true);
            }
            if (data.portalApplication.subsidyStatus === 'CLAIMED' || data.portalApplication.subsidyStatus === 'RECEIVED') {
              setIsSubsidyClaimed(true);
            }
            if (data.portalApplication.subsidyStatus === 'RECEIVED') {
              setIsSubsidyReceived(true);
            }
            if (data.portalApplication.subsidyQueryDesc) {
              setActiveQuery(data.portalApplication.subsidyQueryDesc);
            }
          }
        }
      } catch (err) {
        // silent
      }
    }
    loadData();
  }, [params.id]);

  const docs = [
    { id: 'bill', name: 'DISCOM Electricity Bill', file: 'Ramesh_Patel_MGVCL_Bill.pdf', status: 'Verified' },
    { id: 'aadhaar', name: 'Aadhaar Card (Front/Back)', file: 'Ramesh_Patel_Aadhaar.pdf', status: 'Verified' },
    { id: 'tax', name: 'Property Tax Receipt (Index-2)', file: 'Shivalik_Property_Tax_2026.pdf', status: 'Verified' },
    { id: 'cheque', name: 'Canceled Cheque (HDFC Bank)', file: 'HDFC_Cheque_Ramesh_Patel.jpg', status: 'Verified' },
  ];

  const handleFlagQuery = (docName: string) => {
    setSelectedDocForQuery(docName);
    setQueryText('');
    setIsQueryModalOpen(true);
  };

  const handleSaveQuery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!queryText.trim()) {
      toast.error('Please enter the query remark.');
      return;
    }
    try {
      setLoading(true);
      const res = await fetchWithAuth(`/api/v1/inquiries/${params.id}/document-query`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          docType: selectedDocForQuery,
          queryNotes: queryText,
        }),
      });
      if (!res.ok) throw new Error('Failed to log document query');

      setActiveQuery(`${selectedDocForQuery}: ${queryText}`);
      setIsQueryModalOpen(false);
      toast.error('Query flagged & saved to DB! Reflected on Customer Public Tracking Link.');
    } catch (err: any) {
      toast.error(err.message || 'Error flagging query');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSrNumber = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!srNumber.trim()) {
      toast.error('Please enter the DISCOM SR Number.');
      return;
    }
    try {
      setLoading(true);
      const res = await fetchWithAuth('/api/v1/portal/sr-number', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          inquiryId: params.id,
          srNumber,
        }),
      });
      if (!res.ok) throw new Error('Failed to save SR Number');

      setIsSrSaved(true);
      toast.success(`🎉 SR Number ${srNumber} saved in database! Material Manager (Sohail Bhai) notified to plan delivery.`);
    } catch (err: any) {
      toast.error(err.message || 'Error saving SR Number');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitMeterFile = async () => {
    try {
      setLoading(true);
      const res = await fetchWithAuth('/api/v1/portal/meter-dates', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          inquiryId: params.id,
          meterFileSubmitDate: new Date().toISOString(),
          gebMeterInstallDate: meterInstallDate ? new Date(meterInstallDate).toISOString() : undefined,
          meterStartDate: commissioningDate ? new Date(commissioningDate).toISOString() : undefined,
        }),
      });
      if (!res.ok) throw new Error('Failed to update meter file');

      setIsMeterFileSubmitted(true);
      toast.success('Meter File recorded and submitted to DISCOM!');
    } catch (err: any) {
      toast.error(err.message || 'Error submitting meter file');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkSubsidyReceived = async () => {
    try {
      setLoading(true);
      const res = await fetchWithAuth('/api/v1/portal/subsidy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          inquiryId: params.id,
          subsidyStatus: 'RECEIVED',
          subsidyReceivedDate: new Date().toISOString(),
        }),
      });
      if (!res.ok) throw new Error('Failed to update subsidy status');

      setIsSubsidyReceived(true);
      toast.success('Confirmed: DBT Subsidy credited into customer bank account!');
    } catch (err: any) {
      toast.error(err.message || 'Error updating subsidy status');
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
                GOVT PORTAL FILING
              </span>
              <span className="text-xs text-white/70">Rahul Bhai (Liaison)</span>
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl lg:text-3xl font-serif font-bold text-white tracking-tight">
                Government Portal Workspace
              </h1>
              <p className="text-xs text-typhoon-gold font-medium mt-1">
                Project {projectId} · Ramesh Patel (6.0 kW Single Phase · Anand)
              </p>
            </div>

            <a
              href="https://suryagujarat.guvnl.com"
              target="_blank"
              rel="noreferrer"
              className="bg-white/10 hover:bg-white/20 text-white font-semibold px-4 py-2 rounded-xl text-xs flex items-center gap-2 transition self-start md:self-auto"
            >
              <span>Open DISCOM Portal</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* Main Form Body */}
      <div className="max-w-5xl mx-auto px-4 lg:px-6 -mt-3 space-y-5">
        {/* Active Query Alert Banner (Shows what is reflected to the customer) */}
        {activeQuery && (
          <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 flex items-start gap-3 shadow-soft">
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <span className="text-xs font-bold text-rose-800 block">
                Active Document Query (Visible on Customer Public Link):
              </span>
              <p className="text-xs text-rose-700 mt-0.5">{activeQuery}</p>
            </div>
            <button
              onClick={() => setActiveQuery(null)}
              className="text-xs font-bold text-rose-700 hover:text-rose-900 underline"
            >
              Resolve Query
            </button>
          </div>
        )}

        {/* 1. Customer KYC Document Inspection Card */}
        <div className="bg-white rounded-2xl p-6 border border-typhoon-border shadow-soft space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-typhoon-navy">
                Customer KYC Documents Inspection
              </h3>
              <p className="text-xs text-typhoon-muted">
                Inspect documents before submitting to Surya Gujarat portal
              </p>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              4 of 4 Uploaded
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {docs.map((d) => (
              <div
                key={d.id}
                className="p-3 bg-typhoon-sand/40 border border-typhoon-border/80 rounded-xl flex items-center justify-between"
              >
                <div className="flex items-center gap-2.5 truncate">
                  <FileText className="w-4 h-4 text-typhoon-gold shrink-0" />
                  <div className="truncate">
                    <p className="text-xs font-bold text-typhoon-navy truncate">{d.name}</p>
                    <p className="text-[10px] text-typhoon-muted truncate">{d.file}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => toast.info(`Viewing ${d.file}`)}
                    className="p-1.5 rounded-lg bg-white hover:bg-typhoon-sand text-typhoon-navy border border-typhoon-border text-xs"
                    title="Inspect Document"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleFlagQuery(d.name)}
                    className="px-2 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 text-[10px] font-bold border border-rose-200"
                  >
                    Flag Query
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Application Submitted Button */}
          <div className="pt-2">
            <button
              onClick={() => {
                setIsApplicationSubmitted(true);
                toast.success('Marked: Application uploaded to Government Portal!');
              }}
              className={`w-full py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition ${
                isApplicationSubmitted
                  ? 'bg-emerald-600 text-white shadow-soft'
                  : 'bg-typhoon-navy hover:bg-typhoon-navy-light text-white'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>
                {isApplicationSubmitted
                  ? '✓ Application Submitted to Surya Gujarat Portal'
                  : 'Mark Application Submitted on Govt Portal'}
              </span>
            </button>
          </div>
        </div>

        {/* 2. DISCOM Service Request (SR) Number Generation */}
        <div className="bg-white rounded-2xl p-6 border border-typhoon-border shadow-soft space-y-4">
          <div>
            <h3 className="text-sm font-bold text-typhoon-navy">
              DISCOM Service Request (SR) Number
            </h3>
            <p className="text-xs text-typhoon-muted">
              Enter the approved SR number issued by DISCOM after technical feasibility verification
            </p>
          </div>

          <form onSubmit={handleSaveSrNumber} className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={srNumber}
              onChange={(e) => setSrNumber(e.target.value)}
              placeholder="e.g. SR-GUJ-2026-98124"
              className="flex-1 px-4 py-3 bg-typhoon-sand/40 border border-typhoon-border rounded-xl text-xs font-bold text-typhoon-navy focus:border-typhoon-gold focus:outline-none"
            />
            <button
              type="submit"
              className="bg-typhoon-gold hover:bg-typhoon-gold-dark text-typhoon-navy font-bold px-6 py-3 rounded-xl text-xs shadow-soft transition flex items-center justify-center gap-1.5"
            >
              <Send className="w-4 h-4" />
              <span>Save SR Number (Notify Material Team)</span>
            </button>
          </form>

          {isSrSaved && (
            <p className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1.5 bg-emerald-50 p-2.5 rounded-lg border border-emerald-200">
              <CheckCircle2 className="w-4 h-4" />
              <span>SR Number verified. Sohail Bhai (Material Manager) is notified for BOM staging & dispatch.</span>
            </p>
          )}
        </div>

        {/* 3. CEI Meter File & Net Meter Commissioning */}
        <div className="bg-white rounded-2xl p-6 border border-typhoon-border shadow-soft space-y-4">
          <div>
            <h3 className="text-sm font-bold text-typhoon-navy">
              CEI Meter File & Net Meter Commissioning
            </h3>
            <p className="text-xs text-typhoon-muted">
              File work completion report with CEI & record net meter activation dates
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-typhoon-navy block mb-1">
                Install Net Meter Date (DISCOM)
              </label>
              <input
                type="date"
                value={meterInstallDate}
                onChange={(e) => setMeterInstallDate(e.target.value)}
                className="w-full px-3 py-2 bg-typhoon-sand/40 border border-typhoon-border rounded-xl text-xs text-typhoon-navy focus:border-typhoon-gold focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-typhoon-navy block mb-1">
                System Commissioning Start Date
              </label>
              <input
                type="date"
                value={commissioningDate}
                onChange={(e) => setCommissioningDate(e.target.value)}
                className="w-full px-3 py-2 bg-typhoon-sand/40 border border-typhoon-border rounded-xl text-xs text-typhoon-navy focus:border-typhoon-gold focus:outline-none"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            <button
              onClick={handleSubmitMeterFile}
              disabled={loading}
              className="py-2.5 px-4 rounded-xl bg-typhoon-sand hover:bg-typhoon-sand-dark text-typhoon-navy font-bold text-xs border border-typhoon-border transition"
            >
              {isMeterFileSubmitted ? '✓ Meter File Submitted' : 'Submit CEI Meter File'}
            </button>

            <button
              onClick={async () => {
                try {
                  setLoading(true);
                  await fetchWithAuth('/api/v1/portal/subsidy', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      inquiryId: params.id,
                      subsidyStatus: 'CLAIMED',
                    }),
                  });
                  setIsSubsidyClaimed(true);
                  toast.success('PM Surya Ghar direct DBT subsidy claim filed in database!');
                } catch (err: any) {
                  toast.error(err.message || 'Error filing subsidy');
                } finally {
                  setLoading(false);
                }
              }}
              disabled={loading}
              className="py-2.5 px-4 rounded-xl bg-typhoon-sand hover:bg-typhoon-sand-dark text-typhoon-navy font-bold text-xs border border-typhoon-border transition"
            >
              {isSubsidyClaimed ? '✓ Subsidy Claim Filed' : 'File Subsidy Claim (₹78,000)'}
            </button>

            <button
              onClick={handleMarkSubsidyReceived}
              disabled={loading}
              className="py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition"
            >
              {isSubsidyReceived ? '✓ Subsidy Received (DBT Verified)' : 'Mark Subsidy Received'}
            </button>
          </div>
        </div>
      </div>

      {/* Query Modal */}
      {isQueryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-floating border border-typhoon-border">
            <div className="flex justify-between items-center pb-3 border-b border-typhoon-border">
              <div>
                <h3 className="text-base font-serif font-bold text-typhoon-navy">
                  Flag Problem on Document
                </h3>
                <p className="text-xs text-rose-600 font-medium">{selectedDocForQuery}</p>
              </div>
              <button
                onClick={() => setIsQueryModalOpen(false)}
                className="w-8 h-8 rounded-full bg-typhoon-sand flex items-center justify-center text-typhoon-muted hover:text-typhoon-navy"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveQuery} className="space-y-4 mt-4">
              <div>
                <label className="text-xs font-semibold text-typhoon-navy block mb-1">
                  Query Reason (Visible on Customer Public Link)
                </label>
                <textarea
                  rows={3}
                  value={queryText}
                  onChange={(e) => setQueryText(e.target.value)}
                  placeholder="e.g. Name mismatch on electricity bill vs Aadhaar. Please provide Index-2 or correct bill..."
                  className="w-full p-3 bg-typhoon-sand/40 border border-typhoon-border rounded-xl text-xs text-typhoon-navy focus:border-typhoon-gold focus:outline-none"
                  required
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsQueryModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-typhoon-muted hover:text-typhoon-navy"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-rose-600 hover:bg-rose-700 text-white font-bold px-5 py-2 rounded-xl text-xs shadow-xs"
                >
                  Flag Query to Public Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

