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
  LogOut,
  ChevronRight,
  ExternalLink,
  ListFilter,
  PhoneCall,
  FileText,
  Clock,
  Layers,
  ClipboardList,
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

interface MenuItem {
  label: string;
  desc: string;
  icon: React.ReactNode;
  path: string;
  badge?: string;
  isExternal?: boolean;
}

interface MenuSection {
  title: string;
  items: MenuItem[];
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

  const handleItemClick = (item: MenuItem) => {
    if (item.isExternal) {
      window.open(item.path, '_blank');
    } else {
      handleNavigate(item.path);
    }
  };

  const handleNotificationRequest = async () => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      toast.error('This browser does not support push notifications.');
      return;
    }

    // 1. Insecure Context Check (HTTP vs HTTPS)
    if (!window.isSecureContext && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
      localStorage.setItem('typhoon_inapp_notifications', 'true');
      toast.success(
        'In-App Notifications Enabled! Live banner alerts are active for staging. (OS-level background push requires HTTPS or Chrome Flag).',
        { duration: 8000 }
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

  const getRoleMenuSections = (role?: string): MenuSection[] => {
    switch (role) {
      case 'SALESPERSON':
        return [
          {
            title: 'My Sales Pipeline',
            items: [
              {
                label: 'My Assigned Inquiries',
                desc: 'Active customer leads, site surveys & scheduled follow-ups',
                icon: <ListFilter className="w-5 h-5 text-sky-600" />,
                path: '/inquiries',
                badge: 'My Leads',
              },
              {
                label: 'Add New Solar Inquiry',
                desc: 'Register customer lead with kW requirement & bill copy',
                icon: <FilePlus2 className="w-5 h-5 text-emerald-600" />,
                path: '/inquiries/new',
                badge: 'New Lead',
              },
              {
                label: 'Create Solar Quotation',
                desc: 'PM Surya Ghar ₹78,000 subsidy & quotation PDF',
                icon: <Calculator className="w-5 h-5 text-blue-600" />,
                path: '/quotations/new',
                badge: 'Quotation',
              },
            ],
          },
          {
            title: 'Sales Utilities & Field Tools',
            items: [
              {
                label: 'Customer KYC & Portal Filing',
                desc: 'Upload customer light bill, Aadhaar KYC & roof photos',
                icon: <ShieldCheck className="w-5 h-5 text-teal-600" />,
                path: '/portal',
              },
              {
                label: 'Milestone Payment Status',
                desc: 'Track customer token and 80% delivery payments',
                icon: <IndianRupee className="w-5 h-5 text-rose-600" />,
                path: '/payments',
              },
              {
                label: 'Team SLA Directory',
                desc: 'Contact warehouse logistics & installation leads',
                icon: <Users className="w-5 h-5 text-purple-600" />,
                path: '/team',
              },
            ],
          },
        ];

      case 'PORTAL_USER':
        return [
          {
            title: 'Govt Portal & Subsidies',
            items: [
              {
                label: 'DISCOM Portal Worklist',
                desc: 'Surya Gujarat KYC, SR generation & DBT claims',
                icon: <ShieldCheck className="w-5 h-5 text-teal-600" />,
                path: '/portal',
                badge: 'Worklist',
              },
              {
                label: 'Surya Gujarat Portal (GUVNL)',
                desc: 'Open official GUVNL Surya Gujarat Portal in browser',
                icon: <ExternalLink className="w-5 h-5 text-emerald-600" />,
                path: 'https://suryagujarat.guvnl.com',
                badge: 'External',
                isExternal: true,
              },
              {
                label: 'PM Surya Ghar National Portal',
                desc: 'Open central rooftop solar national portal in browser',
                icon: <ExternalLink className="w-5 h-5 text-blue-600" />,
                path: 'https://pmsuryaghar.gov.in',
                badge: 'External',
                isExternal: true,
              },
              {
                label: 'Customer Inquiries & Documents',
                desc: 'View customer light bills, Aadhaar & tax receipts',
                icon: <ListFilter className="w-5 h-5 text-amber-600" />,
                path: '/inquiries',
              },
            ],
          },
          {
            title: 'Field Coordination',
            items: [
              {
                label: 'Net Meter Installation Sync',
                desc: 'Track solar bidirectional meter testing status',
                icon: <Wrench className="w-5 h-5 text-orange-600" />,
                path: '/installation',
              },
              {
                label: 'Team Escalations & Contacts',
                desc: 'Contact sales reps for missing customer KYC docs',
                icon: <Users className="w-5 h-5 text-purple-600" />,
                path: '/team',
              },
            ],
          },
        ];

      case 'MATERIAL_MANAGER':
        return [
          {
            title: 'Warehouse & Logistics',
            items: [
              {
                label: 'Material Dispatch Queue',
                desc: 'BOM stock staging, vehicle loading & dispatches',
                icon: <Package className="w-5 h-5 text-lime-600" />,
                path: '/material',
                badge: 'Warehouse',
              },
              {
                label: 'Terrace Delivery & Unload Proofs',
                desc: 'Verify unload photos & signed delivery challans',
                icon: <Package className="w-5 h-5 text-teal-600" />,
                path: '/material',
                badge: 'Proofs',
              },
              {
                label: 'Active Projects Directory',
                desc: 'View site addresses, kW ratings & customer contacts',
                icon: <ListFilter className="w-5 h-5 text-amber-600" />,
                path: '/inquiries',
              },
            ],
          },
          {
            title: 'Handovers & Clearances',
            items: [
              {
                label: '80% Unload Payment Check',
                desc: 'Verify payment clearance before releasing BOM truck',
                icon: <IndianRupee className="w-5 h-5 text-rose-600" />,
                path: '/payments',
              },
              {
                label: 'Installation Crew Handover',
                desc: 'Notify installation leads of dispatched equipment',
                icon: <Wrench className="w-5 h-5 text-orange-600" />,
                path: '/installation',
              },
              {
                label: 'Team Contact Directory',
                desc: 'Contact delivery drivers and operations control',
                icon: <Users className="w-5 h-5 text-purple-600" />,
                path: '/team',
              },
            ],
          },
        ];

      case 'INSTALLATION_TEAM':
        return [
          {
            title: 'Field Work Orders',
            items: [
              {
                label: 'Installation Work Orders',
                desc: 'Structure fabrication, panel clamping & inverter wiring',
                icon: <Wrench className="w-5 h-5 text-orange-600" />,
                path: '/installation',
                badge: 'Work Orders',
              },
              {
                label: 'Upload Site Completion Proofs',
                desc: 'Fabrication proofs, earthing test & inverter photo',
                icon: <ClipboardList className="w-5 h-5 text-emerald-600" />,
                path: '/installation',
                badge: 'Proofs',
              },
              {
                label: 'Active Site Directory',
                desc: 'Customer rooftop address, location & project specs',
                icon: <ListFilter className="w-5 h-5 text-amber-600" />,
                path: '/inquiries',
              },
            ],
          },
          {
            title: 'Field Handover & Sync',
            items: [
              {
                label: 'Check Unloaded BOM',
                desc: 'Verify panels, inverter, clamps & DC cable delivery',
                icon: <Package className="w-5 h-5 text-lime-600" />,
                path: '/material',
              },
              {
                label: 'Net Meter Testing Request',
                desc: 'Submit work completion report for DISCOM meter',
                icon: <ShieldCheck className="w-5 h-5 text-teal-600" />,
                path: '/portal',
              },
              {
                label: 'Team Directory & Calling',
                desc: 'Contact operations manager, electrician & client',
                icon: <Users className="w-5 h-5 text-purple-600" />,
                path: '/team',
              },
            ],
          },
        ];

      case 'ACCOUNTANT':
        return [
          {
            title: 'Payment Milestones & Accounts',
            items: [
              {
                label: 'Milestone Payment Ledgers',
                desc: '80/20 milestone collections & UTR reconciliation',
                icon: <IndianRupee className="w-5 h-5 text-rose-600" />,
                path: '/payments',
                badge: 'Ledgers',
              },
              {
                label: 'Record Payment Receipt',
                desc: 'Cheque, NEFT/RTGS & cash entry with receipt generation',
                icon: <IndianRupee className="w-5 h-5 text-emerald-600" />,
                path: '/payments',
                badge: 'Receipts',
              },
              {
                label: 'Verify Project Quotations',
                desc: 'Check quotation pricing, kW sizing & subsidy numbers',
                icon: <Calculator className="w-5 h-5 text-blue-600" />,
                path: '/quotations/new',
              },
            ],
          },
          {
            title: 'Financial Audit & Verification',
            items: [
              {
                label: 'DISCOM DBT Subsidy Audit',
                desc: 'Verify government subsidy release to customer account',
                icon: <ShieldCheck className="w-5 h-5 text-teal-600" />,
                path: '/portal',
              },
              {
                label: 'Material Dispatch Clearances',
                desc: 'Verify 80% payment clearance before truck release',
                icon: <Package className="w-5 h-5 text-lime-600" />,
                path: '/material',
              },
              {
                label: 'All Solar Inquiries & Billings',
                desc: 'Review project values and customer invoice status',
                icon: <ListFilter className="w-5 h-5 text-amber-600" />,
                path: '/inquiries',
              },
            ],
          },
        ];

      case 'SERVICE_TECH':
        return [
          {
            title: 'Service & Maintenance',
            items: [
              {
                label: 'Maintenance Work Orders',
                desc: 'Inverter errors, solar cleaning & warranty claims',
                icon: <Wrench className="w-5 h-5 text-yellow-600" />,
                path: '/installation',
                badge: 'Service',
              },
              {
                label: 'Installed Plant Directory',
                desc: 'Customer rooftop plants, inverter serials & contacts',
                icon: <ListFilter className="w-5 h-5 text-amber-600" />,
                path: '/inquiries',
              },
            ],
          },
          {
            title: 'Parts & Support',
            items: [
              {
                label: 'Spare Parts Requisition',
                desc: 'Request replacement inverters, SPD, MC4 & cables',
                icon: <Package className="w-5 h-5 text-lime-600" />,
                path: '/material',
              },
              {
                label: 'Team Support Directory',
                desc: 'Contact senior technicians and operations desk',
                icon: <Users className="w-5 h-5 text-purple-600" />,
                path: '/team',
              },
            ],
          },
        ];

      case 'OPS_MANAGER':
      case 'ADMIN':
      default:
        return [
          {
            title: 'Control Tower & Operations',
            items: [
              {
                label: 'All Inquiries & Pipeline',
                desc: 'Filter by stage, site surveys, pending quotes & visits',
                icon: <ListFilter className="w-5 h-5 text-amber-600" />,
                path: '/inquiries',
                badge: '14 Active',
              },
              {
                label: 'Add New Solar Inquiry',
                desc: 'Register customer lead & auto-assign to sales',
                icon: <FilePlus2 className="w-5 h-5 text-sky-600" />,
                path: '/inquiries/new',
                badge: 'New Lead',
              },
              {
                label: 'Team SLA Tracker',
                desc: 'Daily staff task commitments & SLA delay monitor',
                icon: <Users className="w-5 h-5 text-purple-600" />,
                path: '/team',
                badge: 'SLA Monitor',
              },
              {
                label: 'Create Solar Quotation',
                desc: 'PM Surya Ghar subsidy, kW sizing & price calculation',
                icon: <Calculator className="w-5 h-5 text-blue-600" />,
                path: '/quotations/new',
                badge: 'Solar Calc',
              },
            ],
          },
          {
            title: 'Cross-Department Oversight',
            items: [
              {
                label: 'Govt Portal & DISCOM Queue',
                desc: 'Surya Gujarat KYC, SR generation & DBT claims',
                icon: <ShieldCheck className="w-5 h-5 text-teal-600" />,
                path: '/portal',
              },
              {
                label: 'Warehouse & BOM Logistics',
                desc: 'Stock staging, truck loading & dispatches',
                icon: <Package className="w-5 h-5 text-lime-600" />,
                path: '/material',
              },
              {
                label: 'Site Installation & Fitting',
                desc: 'Structure grouting, panel clamping & inverter wiring',
                icon: <Wrench className="w-5 h-5 text-orange-600" />,
                path: '/installation',
              },
              {
                label: 'Milestone Payment Ledgers',
                desc: '80% terrace unload & 20% commissioning receipts',
                icon: <IndianRupee className="w-5 h-5 text-rose-600" />,
                path: '/payments',
              },
            ],
          },
        ];
    }
  };

  const menuSections = getRoleMenuSections(user?.role);

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
                    onClick={() => handleItemClick(item)}
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
                    {item.isExternal ? (
                      <ExternalLink className="w-4 h-4 text-typhoon-muted group-hover:text-typhoon-navy transition flex-shrink-0" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-typhoon-muted group-hover:text-typhoon-navy group-hover:translate-x-0.5 transition flex-shrink-0" />
                    )}
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
