'use client';

import React, { useState } from 'react';
import { X, Calendar, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { getRoleTheme } from '@/lib/role-theme';
import { toast } from 'sonner';

interface FollowUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  inquiryId: string;
  stage?: string;
  role?: string;
  onSuccess?: () => void;
}

export const FollowUpModal: React.FC<FollowUpModalProps> = ({
  isOpen,
  onClose,
  inquiryId,
  stage = 'INQUIRY_RECEIVED',
  role,
  onSuccess,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDays, setDueDays] = useState<number>(2);
  const [customDate, setCustomDate] = useState<string>('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const theme = getRoleTheme(role);
  const sColor = theme.hex.cardDarkBg || '#111827';
  const aColor = theme.hex.accentBg || '#6366F1';
  const cColor = theme.hex.lightBg || '#F5F5F7';
  const onColor = theme.hex.accentTextColor || '#FFFFFF';

  // Compute target date
  const computeTargetDate = (days: number): string => {
    const d = new Date();
    d.setDate(d.getDate() + days);
    return d.toISOString().split('T')[0];
  };

  const handleQuickDay = (days: number) => {
    setDueDays(days);
    setCustomDate(computeTargetDate(days));
  };

  const selectedDate = customDate || computeTargetDate(dueDays);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error('Please enter a follow-up title.');
      return;
    }

    const token = localStorage.getItem('accessToken');
    if (!token) {
      toast.error('Session expired. Please log in again.');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        inquiryId,
        stage,
        status: 'ON_TRACK',
        description: description.trim() ? `${title.trim()} - ${description.trim()}` : title.trim(),
        committedDate: new Date(selectedDate).toISOString(),
      };

      const res = await fetch('/api/v1/followups', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || 'Failed to save follow-up');
      }

      toast.success('Follow-up scheduled successfully!');
      setTitle('');
      setDescription('');
      if (onSuccess) onSuccess();
      onClose();
    } catch (err: any) {
      toast.error(err.message || 'Could not schedule follow-up.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        style={{
          backgroundColor: '#ffffff',
          borderColor: `color-mix(in srgb, ${sColor} 15%, transparent)`,
        }}
        className="w-full max-w-lg rounded-t-[28px] sm:rounded-[28px] border shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div
          style={{
            background: `linear-gradient(180deg, color-mix(in srgb, ${aColor} 18%, ${cColor}) 0%, ${cColor} 100%)`,
            borderBottom: `1px solid color-mix(in srgb, ${sColor} 10%, transparent)`,
          }}
          className="px-6 py-4 flex items-center justify-between"
        >
          <div className="flex items-center gap-2.5">
            <div
              style={{
                backgroundColor: aColor,
                color: onColor,
              }}
              className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shadow-sm"
            >
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <h3
                style={{ color: sColor }}
                className="text-base font-extrabold tracking-tight"
              >
                Schedule Follow-up
              </h3>
              <p className="text-[11px] font-medium opacity-65">
                Set reminder for customer commitment
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-black/5 hover:bg-black/10 flex items-center justify-center text-gray-500 hover:text-gray-800 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
          {/* Title */}
          <div>
            <label
              style={{ color: sColor }}
              className="block text-xs font-bold uppercase tracking-wider mb-1.5"
            >
              Follow-up Action / Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Call customer for Aadhaar card, Review roof photo"
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-medium text-gray-900 placeholder:text-gray-400"
            />
          </div>

          {/* Description */}
          <div>
            <label
              style={{ color: sColor }}
              className="block text-xs font-bold uppercase tracking-wider mb-1.5"
            >
              Detailed Notes (Optional)
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter remarks, customer requirements, or delay reasons..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm text-gray-900 placeholder:text-gray-400 resize-none"
            />
          </div>

          {/* Due in X Days buttons */}
          <div>
            <label
              style={{ color: sColor }}
              className="block text-xs font-bold uppercase tracking-wider mb-2"
            >
              Due Timeline
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { label: '+1 Day', days: 1 },
                { label: '+2 Days', days: 2 },
                { label: '+3 Days', days: 3 },
                { label: '+7 Days', days: 7 },
              ].map((chip) => {
                const isSelected = dueDays === chip.days && !customDate;
                return (
                  <button
                    key={chip.days}
                    type="button"
                    onClick={() => handleQuickDay(chip.days)}
                    style={
                      isSelected
                        ? {
                            backgroundColor: aColor,
                            color: onColor,
                            borderColor: aColor,
                          }
                        : {
                            backgroundColor: 'rgba(0,0,0,0.03)',
                            color: sColor,
                            borderColor: 'rgba(0,0,0,0.12)',
                          }
                    }
                    className="py-2 px-2.5 rounded-xl border text-xs font-bold transition-all text-center cursor-pointer active:scale-95"
                  >
                    {chip.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Calendar Picker */}
          <div>
            <label
              style={{ color: sColor }}
              className="block text-xs font-bold uppercase tracking-wider mb-1.5"
            >
              Target Date
            </label>
            <div className="relative">
              <input
                type="date"
                required
                value={selectedDate}
                onChange={(e) => {
                  setCustomDate(e.target.value);
                  setDueDays(0);
                }}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-semibold text-gray-900 cursor-pointer"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 py-3 px-4 rounded-xl border border-gray-300 text-gray-700 font-bold text-sm hover:bg-gray-50 active:scale-95 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{
                backgroundColor: aColor,
                color: onColor,
                boxShadow: `0 8px 20px color-mix(in srgb, ${aColor} 35%, transparent)`,
              }}
              className="flex-1 py-3 px-4 rounded-xl font-extrabold text-sm hover:opacity-95 active:scale-95 transition cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <span>Saving...</span>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Save Follow-up</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
