'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  X,
  User,
  Bell,
  LogOut,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { toast } from 'sonner';

interface MoreMenuModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
  onOpenNotifications?: () => void;
  onOpenInstall?: () => void;
}

interface MenuItem {
  num: string;
  title: string;
  desc: string;
  path: string;
  isExternal?: boolean;
}

interface RoleConfig {
  roleTag: string;
  primaryCta: {
    label: string;
    path: string;
  };
  metrics: {
    val1: string;
    label1: string;
    val2: string;
    label2: string;
  };
  items: MenuItem[];
}

export function MoreMenuModal({
  isOpen,
  onClose,
  user,
}: MoreMenuModalProps) {
  const router = useRouter();

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

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

    if (!window.isSecureContext && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
      localStorage.setItem('typhoon_inapp_notifications', 'true');
      toast.success(
        'In-App Notifications Enabled! Live banner alerts are active for staging.',
        { duration: 8000 }
      );
      return;
    }

    if (Notification.permission === 'granted') {
      toast.success('Push notifications are already active!');
      return;
    }

    if (Notification.permission === 'denied') {
      toast.error(
        'Notifications are blocked in Chrome. Tap lock/tune icon in address bar -> Permissions -> Notifications -> Allow.',
        { duration: 8000 }
      );
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        toast.success('Push notifications enabled successfully!');
      } else {
        toast.error('Notifications were not allowed.');
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

  // Dynamic greeting based on current time
  const getGreeting = () => {
    const hour = new Date().getHours();
    let timeGreeting = 'Good morning,';
    if (hour >= 12 && hour < 17) {
      timeGreeting = 'Good afternoon,';
    } else if (hour >= 17) {
      timeGreeting = 'Good evening,';
    }

    const rawName = user?.fullName || 'Team Member';
    const firstName = rawName.trim().split(' ')[0] || 'Team';
    return { timeGreeting, firstName };
  };

  const { timeGreeting, firstName } = getGreeting();

  // Role Configuration tailored according to user role
  const getRoleConfig = (role?: string): RoleConfig => {
    switch (role) {
      case 'SALESPERSON':
        return {
          roleTag: 'SALESPERSON',
          primaryCta: {
            label: '+ Add New Solar Inquiry',
            path: '/inquiries/new',
          },
          metrics: {
            val1: '8',
            label1: 'Assigned inquiries',
            val2: '3',
            label2: 'Live follow-ups',
          },
          items: [
            {
              num: '01',
              title: 'My Assigned Inquiries',
              desc: 'Active customer leads, site surveys & scheduled visits',
              path: '/inquiries',
            },
            {
              num: '02',
              title: 'Add New Solar Inquiry',
              desc: 'Register customer lead with kW requirement & bill copy',
              path: '/inquiries/new',
            },
            {
              num: '03',
              title: 'Create Solar Quotation',
              desc: 'PM Surya Ghar ₹78,000 subsidy, kW sizing & price proposal',
              path: '/quotations/new',
            },
            {
              num: '04',
              title: 'My Scheduled Follow-ups',
              desc: 'Customer phone calls, visits and commitment dates',
              path: '/followups',
            },
            {
              num: '05',
              title: 'Customer Document Vault',
              desc: 'Electricity bills, Aadhaar KYC & rooftop survey photos',
              path: '/inquiries',
            },
            {
              num: '06',
              title: 'Milestone Payment Status',
              desc: 'Track customer booking token & 80% delivery payments',
              path: '/payments',
            },
          ],
        };

      case 'PORTAL_USER':
        return {
          roleTag: 'PORTAL USER',
          primaryCta: {
            label: '+ DISCOM Application Queue',
            path: '/portal',
          },
          metrics: {
            val1: '12',
            label1: 'Active registrations',
            val2: '4',
            label2: 'Pending DISCOM',
          },
          items: [
            {
              num: '01',
              title: 'Govt Portal & DISCOM Queue',
              desc: 'Surya Gujarat KYC, SR generation & DBT claims',
              path: '/portal',
            },
            {
              num: '02',
              title: 'SR Number Registration',
              desc: 'Submit consumer application IDs to DISCOM portal',
              path: '/portal',
            },
            {
              num: '03',
              title: 'CEI & Meter File Processing',
              desc: 'Electrical inspector approvals & bidirectional meter logs',
              path: '/portal',
            },
            {
              num: '04',
              title: 'Subsidy & DBT Claims',
              desc: 'Central PM Surya Ghar & state direct benefit claims',
              path: '/portal',
            },
            {
              num: '05',
              title: 'Portal Follow-ups & Reminders',
              desc: 'Track agency deadlines, query responses & re-uploads',
              path: '/followups',
            },
            {
              num: '06',
              title: 'Customer Documents & Bills',
              desc: 'Review consumer light bills, tax receipts & ID proofs',
              path: '/inquiries',
            },
          ],
        };

      case 'MATERIAL_MANAGER':
        return {
          roleTag: 'MATERIAL MANAGER',
          primaryCta: {
            label: '+ Dispatch Warehouse BOM',
            path: '/material',
          },
          metrics: {
            val1: '6',
            label1: 'Pending dispatches',
            val2: '98%',
            label2: 'Stock readiness',
          },
          items: [
            {
              num: '01',
              title: 'Warehouse Dispatch Queue',
              desc: 'Stock staging, truck loading & site dispatches',
              path: '/material',
            },
            {
              num: '02',
              title: 'Material Planning & BOM',
              desc: 'Panel wattages, inverters, structures & DC cables',
              path: '/material',
            },
            {
              num: '03',
              title: 'Terrace Delivery & Unload Proofs',
              desc: 'Driver vehicle numbers, delivery challans & site drop photos',
              path: '/material',
            },
            {
              num: '04',
              title: '80% Unload Payment Clearance',
              desc: 'Verify customer payment clearance before truck release',
              path: '/payments',
            },
            {
              num: '05',
              title: 'Logistics Follow-ups',
              desc: 'Coordinate transport transit delays & supplier stock arrivals',
              path: '/followups',
            },
            {
              num: '06',
              title: 'Installation Crew Handover',
              desc: 'Notify field installation leads of delivered equipment',
              path: '/installation',
            },
          ],
        };

      case 'INSTALLATION_TEAM':
        return {
          roleTag: 'INSTALLATION TEAM',
          primaryCta: {
            label: '+ Upload Rooftop Proofs',
            path: '/installation',
          },
          metrics: {
            val1: '3',
            label1: 'Today’s site jobs',
            val2: '1',
            label2: 'Commissioning pending',
          },
          items: [
            {
              num: '01',
              title: 'Today’s Installation Jobs',
              desc: 'Structure fabrication, panel clamping & inverter wiring',
              path: '/installation',
            },
            {
              num: '02',
              title: 'Upload Rooftop Proofs',
              desc: 'Panel angles, earthing test, SPD & structure bolts photos',
              path: '/installation',
            },
            {
              num: '03',
              title: 'Module Serial & Barcode Logging',
              desc: 'Scan solar module serial numbers & inverter barcodes',
              path: '/installation',
            },
            {
              num: '04',
              title: 'Safety & Quality Checklist',
              desc: 'Checklist sign-off before DISCOM plant inspection',
              path: '/installation',
            },
            {
              num: '05',
              title: 'Site Follow-ups & Handover',
              desc: 'Customer rooftop availability & customer handover notes',
              path: '/followups',
            },
            {
              num: '06',
              title: 'Check Unloaded BOM',
              desc: 'Verify delivered panels, mounting clamps & inverter on site',
              path: '/material',
            },
          ],
        };

      case 'ACCOUNTANT':
        return {
          roleTag: 'ACCOUNTANT',
          primaryCta: {
            label: '+ Record Customer Payment',
            path: '/payments',
          },
          metrics: {
            val1: '₹4.2L',
            label1: 'Collected this week',
            val2: '5',
            label2: 'Overdue milestones',
          },
          items: [
            {
              num: '01',
              title: 'Customer Ledgers & Outstanding',
              desc: 'Milestone billing: Booking, dispatch, install & net meter',
              path: '/payments',
            },
            {
              num: '02',
              title: 'Record Milestone Payment',
              desc: 'Log cash, UPI, NEFT or cheque with transaction reference',
              path: '/payments',
            },
            {
              num: '03',
              title: 'Payment Receipts & Invoices',
              desc: 'Download branded payment receipts & GST invoices',
              path: '/payments',
            },
            {
              num: '04',
              title: 'Overdue Milestones Follow-up',
              desc: 'Remind customers of upcoming and pending balance payments',
              path: '/followups',
            },
            {
              num: '05',
              title: 'Subsidy & DBT Verification',
              desc: 'Verify central PM Surya Ghar direct benefit transfers',
              path: '/portal',
            },
            {
              num: '06',
              title: 'All Projects & Cost Quotations',
              desc: 'Review project kW sizing, contract value & pricing quotes',
              path: '/inquiries',
            },
          ],
        };

      case 'SERVICE_TECH':
        return {
          roleTag: 'SERVICE TECH',
          primaryCta: {
            label: '+ Log Maintenance Visit',
            path: '/service',
          },
          metrics: {
            val1: '4',
            label1: 'Open complaints',
            val2: '1',
            label2: 'Urgent maintenance',
          },
          items: [
            {
              num: '01',
              title: 'Active Complaints Queue',
              desc: 'Inverter fault codes, generation drops & grid tripping',
              path: '/service',
            },
            {
              num: '02',
              title: 'Maintenance Work Orders',
              desc: 'Schedule cleaning, earthing checks & wire inspections',
              path: '/service',
            },
            {
              num: '03',
              title: 'Log Diagnosis & Parts Cost',
              desc: 'Fault analysis, replaced components and service charges',
              path: '/service',
            },
            {
              num: '04',
              title: 'Query Resolution Proofs',
              desc: 'Upload before and after photos of rectified equipment',
              path: '/service',
            },
            {
              num: '05',
              title: 'Warranty & Customer Follow-ups',
              desc: 'Manufacturer warranty claims & post-service satisfaction',
              path: '/followups',
            },
            {
              num: '06',
              title: 'Installed Plant Directory',
              desc: 'Customer rooftop plants, inverter serials & contacts',
              path: '/inquiries',
            },
          ],
        };

      case 'OPS_MANAGER':
      case 'ADMIN':
      default:
        return {
          roleTag: 'OPS MANAGER',
          primaryCta: {
            label: '+ Add New Solar Inquiry',
            path: '/inquiries/new',
          },
          metrics: {
            val1: '14',
            label1: 'Active inquiries',
            val2: 'Live',
            label2: 'SLA follow-ups',
          },
          items: [
            {
              num: '01',
              title: 'All Inquiries & Pipeline',
              desc: 'Filter by stage, surveys, pending quotes',
              path: '/inquiries',
            },
            {
              num: '02',
              title: 'All Follow-ups Control Tower',
              desc: 'Filter by stage, salesperson, inquiry',
              path: '/followups',
            },
            {
              num: '03',
              title: 'Team SLA Tracker',
              desc: 'Daily staff commitments & delay monitor',
              path: '/team',
            },
            {
              num: '04',
              title: 'Create Solar Quotation',
              desc: 'PM Surya Ghar subsidy, kW sizing & price',
              path: '/quotations/new',
            },
            {
              num: '05',
              title: 'Govt Portal & DISCOM Queue',
              desc: 'Surya Gujarat KYC, SR generation & DBT claims',
              path: '/portal',
            },
            {
              num: '06',
              title: 'Warehouse & BOM Logistics',
              desc: 'Stock staging, truck loading & dispatches',
              path: '/material',
            },
          ],
        };
    }
  };

  const roleConfig = getRoleConfig(user?.role);

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[120] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs transition-opacity duration-300 p-0 sm:p-4"
    >
      {/* Modal / Bottom Sheet Card */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-[#FBF9F5] w-full max-w-md rounded-t-[32px] sm:rounded-[32px] overflow-hidden max-h-[92vh] flex flex-col shadow-2xl animate-in slide-in-from-bottom duration-300 border border-[#E8E2D9]"
      >
        {/* Grab Handle Header */}
        <div className="pt-3 pb-1 flex flex-col items-center relative shrink-0">
          <div className="w-12 h-1 bg-slate-300/80 rounded-full mb-1" />
          <button
            onClick={onClose}
            aria-label="Close"
            className="absolute top-2 right-4 w-8 h-8 rounded-full flex items-center justify-center text-[#71717A] hover:text-[#18181B] hover:bg-black/5 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Main Content */}
        <div className="px-6 pb-6 overflow-y-auto flex-1">
          {/* Role Tag */}
          <div className="text-[11px] font-bold tracking-[0.18em] text-[#C2410C] uppercase mt-2 mb-1.5 font-sans">
            {roleConfig.roleTag}
          </div>

          {/* Large Editorial Serif Greeting (matches reference image) */}
          <h2 className="text-3xl sm:text-4xl font-serif text-[#18181B] font-normal leading-[1.15] mb-5 tracking-tight">
            {timeGreeting}
            <br />
            {firstName}.
          </h2>

          {/* Full-width dark primary pill button */}
          <button
            onClick={() => handleNavigate(roleConfig.primaryCta.path)}
            className="w-full bg-[#18181B] hover:bg-black active:scale-[0.99] text-white rounded-full py-3.5 px-6 font-semibold text-sm flex items-center justify-center gap-2 transition shadow-sm cursor-pointer"
          >
            <span className="text-lg leading-none font-normal">+</span>
            <span>{roleConfig.primaryCta.label.replace(/^\+\s*/, '')}</span>
          </button>

          {/* Key Metric Counters */}
          <div className="border-t border-b border-[#E8E2D9] my-6 py-4 grid grid-cols-2 gap-4">
            <div>
              <div className="text-3xl font-serif font-normal text-[#18181B] tracking-tight">
                {roleConfig.metrics.val1}
              </div>
              <div className="text-xs text-[#52525B] mt-1 font-sans">
                {roleConfig.metrics.label1}
              </div>
            </div>
            <div>
              <div className="text-3xl font-serif font-normal text-[#18181B] tracking-tight">
                {roleConfig.metrics.val2}
              </div>
              <div className="text-xs text-[#52525B] mt-1 font-sans">
                {roleConfig.metrics.label2}
              </div>
            </div>
          </div>

          {/* Numbered Menu Rows (01, 02, 03... exact styling to image) */}
          <div className="divide-y divide-[#E8E2D9]">
            {roleConfig.items.map((item, idx) => (
              <button
                key={idx}
                onClick={() => handleItemClick(item)}
                className="w-full py-4 flex items-start gap-5 text-left group hover:bg-black/[0.02] -mx-2 px-2 rounded-xl transition cursor-pointer"
              >
                {/* Number */}
                <div className="text-2xl font-serif text-[#C2410C] font-normal w-9 shrink-0 pt-0.5 select-none">
                  {item.num}
                </div>

                {/* Text */}
                <div className="flex-1 min-w-0 pr-1">
                  <div className="font-serif text-[17px] font-medium text-[#18181B] leading-snug group-hover:text-[#C2410C] transition">
                    {item.title}
                  </div>
                  <div className="text-xs text-[#71717A] mt-1 leading-relaxed">
                    {item.desc}
                  </div>
                </div>

                {/* Right Arrow */}
                <div className="pt-2 text-slate-300 group-hover:text-[#18181B] group-hover:translate-x-0.5 transition shrink-0">
                  {item.isExternal ? (
                    <ExternalLink className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </div>
              </button>
            ))}
          </div>

          {/* Bottom Utilities Strip */}
          <div className="mt-8 pt-5 border-t border-[#E8E2D9] space-y-3">
            {/* Push Notifications Toggle */}
            <div className="bg-[#F3EFE6] border border-[#E4DEC9] rounded-2xl p-3 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <Bell className="w-4 h-4 text-[#C2410C] shrink-0" />
                <div>
                  <span className="text-xs font-bold text-[#18181B] block">
                    Push Notifications
                  </span>
                  <span className="text-[11px] text-[#71717A]">
                    Live project SLA alerts
                  </span>
                </div>
              </div>
              <button
                onClick={handleNotificationRequest}
                className="px-3 py-1.5 rounded-xl bg-[#18181B] hover:bg-black text-white font-bold text-xs shadow-xs transition cursor-pointer"
              >
                Enable
              </button>
            </div>

            {/* Profile Settings */}
            <button
              onClick={() => handleNavigate('/profile')}
              className="w-full py-3 px-4 rounded-2xl bg-white hover:bg-white/80 text-[#18181B] font-semibold text-xs flex items-center justify-between border border-[#E8E2D9] transition cursor-pointer shadow-2xs"
            >
              <div className="flex items-center gap-2.5">
                <User className="w-4 h-4 text-[#18181B]" />
                <span>My Profile & Settings</span>
              </div>
              <ChevronRight className="w-4 h-4 text-[#71717A]" />
            </button>

            {/* Sign Out */}
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
