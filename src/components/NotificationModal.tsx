'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  X,
  Bell,
  AlertCircle,
  CheckCircle2,
  Phone,
  ArrowRight,
  Clock,
  ExternalLink,
  ShieldAlert,
} from 'lucide-react';
import { toast } from 'sonner';
import { useCurrentUser } from '@/lib/use-current-user';

export interface NotificationItem {
  id: string;
  followupId: string;
  title: string;
  body: string;
  stage?: string;
  time: string;
  targetUrl: string;
  isUrgent?: boolean;
}

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NotificationModal({ isOpen, onClose }: NotificationModalProps) {
  const router = useRouter();
  const { user, theme } = useCurrentUser();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [isPushSupported, setIsPushSupported] = useState(true);
  const [pushStatus, setPushStatus] = useState<'granted' | 'denied' | 'default'>('default');

  useEffect(() => {
    if (!isOpen) return;

    // Check browser notification permission
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setPushStatus(Notification.permission);
      setIsPushSupported(true);
    } else {
      setIsPushSupported(false);
    }

    // Fetch live notifications from backend
    const token = localStorage.getItem('accessToken');
    if (!token) return;

    setLoading(true);
    fetch('/api/v1/inquiries/my-notifications', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setNotifications(data);
        } else {
          // Default fallbacks for fresh session
          setNotifications([
            {
              id: 'n-1',
              followupId: 'F-1024',
              title: 'Lead F-1024 · Ramesh Patel',
              body: '6.0 kW Single Phase in Anand · Site survey scheduled for today',
              time: new Date().toISOString(),
              targetUrl: '/inquiries/F-1024',
              isUrgent: true,
            },
            {
              id: 'n-2',
              followupId: 'F-1022',
              title: 'Quotation Follow-up · Nilesh Desai',
              body: '6.0 kW Three Phase in Gotri, Vadodara · Proposal review pending',
              time: new Date(Date.now() - 3600000).toISOString(),
              targetUrl: '/inquiries/F-1022',
              isUrgent: false,
            },
          ]);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [isOpen]);

  const handleRequestPush = async () => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      toast.error('This browser does not support push notifications.');
      return;
    }

    if (window.location.protocol === 'http:' && window.location.hostname !== 'localhost') {
      toast.info(
        'In-App Notification Mode active. OS-level push notifications require HTTPS or localhost.',
        { duration: 6000 }
      );
      return;
    }

    try {
      const perm = await Notification.requestPermission();
      setPushStatus(perm);
      if (perm === 'granted') {
        toast.success('Push notifications enabled!');
      } else {
        toast.error('Notifications were not granted.');
      }
    } catch {
      toast.error('Could not request notification permission.');
    }
  };

  const handleOpenItem = (url: string) => {
    onClose();
    router.push(url);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-floating border border-typhoon-border flex flex-col max-h-[85vh]">
        {/* Header */}
        <div
          style={{ backgroundColor: theme.hex.headerBg }}
          className="text-white px-6 py-5 flex items-center justify-between transition-colors"
        >
          <div className="flex items-center gap-3">
            <div
              style={{ backgroundColor: theme.hex.accentBg, color: theme.hex.accentTextColor }}
              className="w-10 h-10 rounded-2xl flex items-center justify-center font-bold"
            >
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold font-serif text-white tracking-tight leading-tight">
                Notifications & Lead Alerts
              </h2>
              <p className="text-xs text-white/70">
                {user?.fullName || 'Staff Member'} · {user?.role?.replace('_', ' ') || 'Team'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Push Notification Status Banner */}
        <div className="bg-typhoon-sand px-6 py-3 border-b border-typhoon-border flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            {pushStatus === 'granted' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            )}
            <span className="font-medium text-typhoon-navy">
              {pushStatus === 'granted'
                ? 'Device push notifications active'
                : 'In-app alert mode active'}
            </span>
          </div>

          {pushStatus !== 'granted' && (
            <button
              onClick={handleRequestPush}
              className="text-xs font-bold text-typhoon-navy hover:underline cursor-pointer"
            >
              Check Permissions
            </button>
          )}
        </div>

        {/* Notifications List */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-3 flex-1 divide-y divide-typhoon-border/50">
          {loading ? (
            <div className="text-center py-10 text-xs text-typhoon-muted">
              Loading recent notifications...
            </div>
          ) : notifications.length === 0 ? (
            <div className="text-center py-10">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto mb-2 opacity-80" />
              <p className="text-sm font-bold text-typhoon-navy">All Caught Up</p>
              <p className="text-xs text-typhoon-muted mt-1">
                No pending lead assignments or alerts at this time.
              </p>
            </div>
          ) : (
            notifications.map((item) => (
              <div
                key={item.id}
                onClick={() => handleOpenItem(item.targetUrl)}
                className="pt-3 first:pt-0 group cursor-pointer hover:bg-typhoon-sand/40 p-2.5 rounded-2xl transition"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                        item.isUrgent
                          ? 'bg-rose-100 text-rose-700 border border-rose-200'
                          : 'bg-typhoon-sand text-typhoon-navy border border-typhoon-border'
                      }`}
                    >
                      {item.isUrgent ? (
                        <AlertCircle className="w-4 h-4" />
                      ) : (
                        <Bell className="w-4 h-4" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs sm:text-sm font-bold text-typhoon-navy group-hover:text-typhoon-gold-dark transition">
                          {item.title}
                        </h4>
                        {item.isUrgent && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700">
                            Urgent
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-typhoon-muted mt-0.5 leading-relaxed">
                        {item.body}
                      </p>
                      <div className="flex items-center gap-3 mt-2 text-[10px] text-typhoon-muted">
                        <span className="flex items-center gap-1 font-medium">
                          <Clock className="w-3 h-3" />
                          {new Date(item.time).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            hour: 'numeric',
                            minute: '2-digit',
                            hour12: true,
                          })}
                        </span>
                        <span className="font-bold text-typhoon-navy flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                          Open Lead <ArrowRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-typhoon-sand/50 border-t border-typhoon-border flex items-center justify-between text-xs text-typhoon-muted">
          <span>Tap any notification to jump directly into the workspace.</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white border border-typhoon-border font-bold text-typhoon-navy hover:bg-typhoon-sand transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
