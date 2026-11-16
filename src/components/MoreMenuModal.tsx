'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import {
  X,
  FilePlus2,
  Calculator,
  ShieldCheck,
  Package,
  Wrench,
  IndianRupee,
  Users,
  Bell,
  Smartphone,
  LogOut,
  ChevronRight,
  Sparkles,
  ExternalLink,
  ListFilter,
} from 'lucide-react';
import { getRoleTheme } from '@/lib/role-theme';
import { toast } from 'sonner';

interface MoreMenuModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
  onOpenNotifications?: () => void;
  onOpenInstall?: () => void;
}

export function MoreMenuModal({
  isOpen,
  onClose,
  user,
  onOpenNotifications,
  onOpenInstall,
}: MoreMenuModalProps) {
  const router = useRouter();

  if (!isOpen) return null;

  const theme = getRoleTheme(user?.role);

  const handleNavigate = (path: string) => {
    onClose();
    router.push(path);
  };

  const handleNotificationRequest = async () => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      toast.error('This browser does not support push notifications.');
      return;
    }

    // 1. Insecure Context Check (HTTP vs HTTPS)
    if (!window.isSecureContext && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
      toast.error(
        'Push notifications require a secure connection (HTTPS) or localhost. Accessing via plain HTTP IP blocks browser notifications.',
        { duration: 7000 }
      );
      return;
    }

    // 2. Already active
    if (Notification.permission === 'granted') {
      toast.success('Push notifications are already active!');
      return;
    }

    // 3. Previously blocked / denied
    if (Notification.permission === 'denied') {
      toast.error(
        'Notifications are blocked in Chrome. Tap the lock/tune icon next to the address bar -> Permissions -> Notifications -> Allow.',
        { duration: 8000 }
      );
      return;
    }

    // 4. Request browser permission
    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        toast.success('Push notifications enabled successfully!');
      } else {
        toast.error(
          'Notifications were not allowed. Tap the tune/lock icon in Chrome address bar -> Permissions -> Notifications -> Allow.',
          { duration: 8000 }
        );
      }
    } catch {
      toast.error('Could not request notification permission.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    toast.success('Signed out successfully');
    onClose();
    router.push('/');
  };

  interface MenuItem {
    label: string;
    desc: string;
    icon: React.ReactNode;
    path: string;
    badge?: string;
  }

  interface MenuSection {
    title: string;
    items: MenuItem[];
  }

  const menuSections: MenuSection[] = [
    {
      title: 'Sales & Inquiries',
      items: [
        {
          label: 'All Inquiries & Pipeline',
          desc: 'Filter by no-quote, no-visit, dates & view 10-stage follow-ups',
          icon: <ListFilter className="w-5 h-5 text-amber-600" />,
          path: '/inquiries',
          badge: '14 Active',
        },
        {
          label: 'Add New Solar Inquiry',
          desc: 'Register customer, KW requirement & meter phase',
          icon: <FilePlus2 className="w-5 h-5 text-sky-600" />,
          path: '/inquiries/new',
          badge: 'Stage 1',
        },
        {
          label: 'Create Solar Quotation',
          desc: 'PM Surya Ghar ₹78k subsidy & net cost calculator',
          icon: <Calculator className="w-5 h-5 text-blue-600" />,
          path: '/quotations/new',
          badge: 'Solar Calc',
        },
      ],
    },
    {
      title: 'Operations & Execution',
      items: [
        {
          label: 'Govt Portal & DISCOM Queue',
          desc: 'Surya Gujarat KYC, SR generation & DBT claims',
          icon: <ShieldCheck className="w-5 h-5 text-teal-600" />,
          path: '/portal',
        },
        {
          label: 'Warehouse & BOM Logistics',
          desc: 'Stock packing, truck dispatch & vehicle delivery',
          icon: <Package className="w-5 h-5 text-lime-600" />,
          path: '/material',
        },
        {
          label: 'Site Installation & Fitting',
          desc: 'Structure grouting, module clamps & inverter wiring',
          icon: <Wrench className="w-5 h-5 text-orange-600" />,
          path: '/installation',
        },
      ],
    },
    {
      title: 'Finance & Team Management',
      items: [
        {
          label: 'Payment Ledgers & Receipts',
          desc: '80/20 milestone collections & UTR reconciliation',
          icon: <IndianRupee className="w-5 h-5 text-rose-600" />,
          path: '/payments',
        },
        {
          label: 'Team SLA & Live Tracking',
          desc: '8-role operational directory & pending tasks',
          icon: <Users className="w-5 h-5 text-purple-600" />,
          path: '/team',
        },
      ],
    },
  ];

  return (
    <div className="fixed inset-0 z-[120] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-t-[32px] sm:rounded-[32px] max-w-lg w-full max-h-[88vh] flex flex-col shadow-2xl border border-typhoon-border overflow-hidden animate-in slide-in-from-bottom duration-300">
        {/* Header with User Role Signature Colors */}
        <div
          style={{ backgroundColor: theme.hex.headerBg }}
          className="p-5 text-white flex items-center justify-between relative flex-shrink-0"
        >
          <div className="flex items-center gap-3">
            <div
              style={{
                borderColor: theme.hex.accentBg,
                color: theme.hex.accentBg,
              }}
              className="w-11 h-11 rounded-full border-2 bg-white/10 flex items-center justify-center font-bold text-sm"
            >
              {theme.tag}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base text-white leading-tight">
                  {user?.fullName || 'Typhoon Team Member'}
                </span>
              </div>
              <span
                style={{
                  backgroundColor: theme.hex.lightBg,
                  color: theme.hex.lightText,
                }}
                className="inline-block px-2.5 py-0.5 rounded-full text-xs font-bold mt-1"
              >
                {theme.roleName}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1 divide-y divide-typhoon-border/50">
          {/* Quick Push Notification Enable Strip */}
          <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-3.5 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-900 flex items-center justify-center flex-shrink-0">
                <Bell className="w-5 h-5 text-amber-700" />
              </div>
              <div>
                <span className="text-xs font-bold text-amber-950 block">
                  Push Notifications
                </span>
                <span className="text-[11px] text-amber-800">
                  Get instant project alerts & stage changes
                </span>
              </div>
            </div>
            <button
              onClick={handleNotificationRequest}
              className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-xs transition flex-shrink-0 cursor-pointer"
            >
              Enable
            </button>
          </div>

          {/* Grouped Department Modules */}
          {menuSections.map((sec, sIdx) => (
            <div key={sIdx} className={sIdx > 0 ? 'pt-4' : ''}>
              <h4 className="text-xs font-bold tracking-wider text-typhoon-muted uppercase mb-2 px-1">
                {sec.title}
              </h4>
              <div className="space-y-1.5">
                {sec.items.map((item, iIdx) => (
                  <button
                    key={iIdx}
                    onClick={() => handleNavigate(item.path)}
                    className="w-full p-3 rounded-2xl hover:bg-typhoon-sand/60 transition flex items-center justify-between text-left group border border-transparent hover:border-typhoon-border/60 cursor-pointer"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-typhoon-sand flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                        {item.icon}
                      </div>
                      <div className="truncate">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-typhoon-navy truncate">
                            {item.label}
                          </span>
                          {item.badge && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200">
                              {item.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-typhoon-muted truncate mt-0.5">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-typhoon-muted group-hover:text-typhoon-navy group-hover:translate-x-0.5 transition flex-shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          ))}

          {/* Account Actions */}
          <div className="pt-4 space-y-2">
            <button
              onClick={handleLogout}
              className="w-full py-3 px-4 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs flex items-center justify-center gap-2 border border-rose-200 transition cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out from Workspace</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
