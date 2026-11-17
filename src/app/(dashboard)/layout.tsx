'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Sidebar } from '../../components/desktop/Sidebar';
import { TopBar } from '../../components/desktop/TopBar';
import { BottomNav, NavItem } from '../../components/BottomNav';
import { MoreMenuModal } from '../../components/MoreMenuModal';
import { getRoleTheme } from '@/lib/role-theme';
import { requestNotificationPermission } from '@/lib/fcm-client';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('home');
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('accessToken');
    if (!storedUser || !storedToken || storedToken === 'null' || storedToken === 'undefined') {
      localStorage.clear();
      router.push('/');
      return;
    }
    try {
      setUser(JSON.parse(storedUser));
    } catch {
      localStorage.clear();
      router.push('/');
      return;
    }
    // Register FCM web push notifications
    requestNotificationPermission().catch(console.error);
  }, [router]);

  // Keep active tab in sync with current URL pathname
  useEffect(() => {
    if (pathname.includes('/portal')) {
      setActiveTab('portal');
    } else if (pathname.includes('/material')) {
      setActiveTab('material');
    } else if (pathname.includes('/installation')) {
      setActiveTab('installation');
    } else if (pathname.includes('/payments')) {
      setActiveTab('payments');
    } else if (pathname === '/inquiries') {
      setActiveTab('pipeline');
    } else if (pathname.includes('/inquiries')) {
      setActiveTab('inquiries');
    } else if (pathname.includes('/quotations')) {
      setActiveTab('quotations');
    } else if (pathname.includes('/team')) {
      setActiveTab('team');
    } else {
      setActiveTab('home');
    }
  }, [pathname]);

  const handleSignOut = () => {
    localStorage.clear();
    router.push('/');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-typhoon-sand flex items-center justify-center text-xs text-typhoon-muted">
        Loading Typhoon Solar...
      </div>
    );
  }

  // Role-specific navigation items matching each user type's operational responsibilities
  const getNavItems = (): { mobile: NavItem[]; desktop: any[] } => {
    const role = user.role;

    if (role === 'SALESPERSON') {
      return {
        mobile: [
          { id: 'home', label: 'Home', iconName: 'home', href: '/dashboard' },
          { id: 'inquiries', label: 'New Lead', iconName: 'inquiries', href: '/inquiries/new' },
          { id: 'quotations', label: 'Quotes', iconName: 'quotations', href: '/quotations/new' },
          { id: 'more', label: 'More', iconName: 'more', href: '#more' },
        ],
        desktop: [
          { id: 'dashboard', label: 'My Agenda & Leads', iconName: 'dashboard' },
          { id: 'inquiries', label: 'New Inquiry', iconName: 'inquiries' },
          { id: 'quotations', label: 'Create Quotation', iconName: 'portal' },
        ],
      };
    }

    if (role === 'PORTAL_USER') {
      return {
        mobile: [
          { id: 'home', label: 'Home', iconName: 'home', href: '/dashboard' },
          { id: 'portal', label: 'Govt Portal', iconName: 'portal', href: '/portal' },
          { id: 'sr', label: 'SR Queue', iconName: 'sr', href: '/portal' },
          { id: 'more', label: 'More', iconName: 'more', href: '#more' },
        ],
        desktop: [
          { id: 'dashboard', label: 'Portal Overview', iconName: 'dashboard' },
          { id: 'portal', label: 'DISCOM & National Portal Queue', iconName: 'portal' },
          { id: 'meter', label: 'CEI & Meter Files', iconName: 'inquiries' },
          { id: 'subsidy', label: 'Subsidy Claims', iconName: 'accounts' },
        ],
      };
    }

    if (role === 'MATERIAL_MANAGER') {
      return {
        mobile: [
          { id: 'home', label: 'Home', iconName: 'home', href: '/dashboard' },
          { id: 'material', label: 'Stock & BOM', iconName: 'material', href: '/material' },
          { id: 'unload', label: 'Site Unloads', iconName: 'unload', href: '/material' },
          { id: 'more', label: 'More', iconName: 'more', href: '#more' },
        ],
        desktop: [
          { id: 'dashboard', label: 'Warehouse Stock', iconName: 'dashboard' },
          { id: 'material', label: 'BOM Dispatch & Serials', iconName: 'material' },
        ],
      };
    }

    if (role === 'INSTALLATION_TEAM') {
      return {
        mobile: [
          { id: 'home', label: 'Home', iconName: 'home', href: '/dashboard' },
          { id: 'installation', label: 'Active Sites', iconName: 'installation', href: '/installation' },
          { id: 'checklist', label: 'Fitting Jobs', iconName: 'checklist', href: '/installation' },
          { id: 'more', label: 'More', iconName: 'more', href: '#more' },
        ],
        desktop: [
          { id: 'dashboard', label: 'Installation Queue', iconName: 'dashboard' },
          { id: 'installation', label: 'Structure & Inverter Jobs', iconName: 'installation' },
        ],
      };
    }

    if (role === 'ACCOUNTANT') {
      return {
        mobile: [
          { id: 'home', label: 'Home', iconName: 'home', href: '/dashboard' },
          { id: 'payments', label: 'Ledger', iconName: 'payments', href: '/payments' },
          { id: 'milestones', label: '80/20 Terms', iconName: 'stats', href: '/payments' },
          { id: 'more', label: 'More', iconName: 'more', href: '#more' },
        ],
        desktop: [
          { id: 'dashboard', label: 'Cash Flow Overview', iconName: 'dashboard' },
          { id: 'payments', label: 'Customer Payment Ledgers', iconName: 'accounts' },
        ],
      };
    }

    if (role === 'SERVICE_TECH') {
      return {
        mobile: [
          { id: 'home', label: 'Home', iconName: 'home', href: '/dashboard' },
          { id: 'tickets', label: 'Complaints', iconName: 'tickets', href: '/dashboard' },
          { id: 'plants', label: 'Plants', iconName: 'jobs', href: '/dashboard' },
          { id: 'more', label: 'More', iconName: 'more', href: '#more' },
        ],
        desktop: [
          { id: 'dashboard', label: 'Service & Maintenance', iconName: 'dashboard' },
          { id: 'tickets', label: 'Active Complaints', iconName: 'complaints' },
        ],
      };
    }

    // Default: Operations Manager & Admin
    return {
      mobile: [
        { id: 'home', label: 'Home', iconName: 'home', href: '/dashboard' },
        { id: 'pipeline', label: 'Pipeline', iconName: 'pipeline', href: '/inquiries' },
        { id: 'team', label: 'Team SLA', iconName: 'team', href: '/team' },
        { id: 'more', label: 'More', iconName: 'more', href: '#more' },
      ],
      desktop: [
        { id: 'dashboard', label: 'Control Tower', iconName: 'dashboard' },
        { id: 'pipeline', label: 'All Inquiries & Pipeline', iconName: 'inquiries' },
        { id: 'team', label: 'Team SLA Monitor', iconName: 'team' },
        { id: 'portal', label: 'Govt Portal', iconName: 'portal' },
        { id: 'material', label: 'Warehouse & BOM', iconName: 'material' },
        { id: 'installation', label: 'Installation Queue', iconName: 'installation' },
        { id: 'payments', label: 'Accounts & Ledger', iconName: 'accounts' },
      ],
    };
  };

  const nav = getNavItems();

  const handleNavSelect = (id: string) => {
    if (id === 'more') {
      setIsMoreOpen(true);
      return;
    }
    setActiveTab(id);
    if (id === 'home' || id === 'dashboard') router.push('/dashboard');
    else if (id === 'pipeline') router.push('/inquiries');
    else if (id === 'inquiries') router.push('/inquiries');
    else if (id === 'quotations') router.push('/quotations/new');
    else if (id === 'portal' || id === 'sr' || id === 'subsidy' || id === 'meter') router.push('/portal');
    else if (id === 'material' || id === 'planning' || id === 'unload') router.push('/material');
    else if (id === 'installation' || id === 'jobs' || id === 'checklist') router.push('/installation');
    else if (id === 'payments' || id === 'milestones' || id === 'accounts') router.push('/payments');
    else if (id === 'team') router.push('/team');
    else router.push('/dashboard');
  };

  const theme = getRoleTheme(user?.role);

  return (
    <div className="min-h-screen bg-typhoon-sand">
      {/* 1. DESKTOP VIEW (Screens >= 1024px) */}
      <div className="hidden lg:flex min-h-screen">
        <Sidebar
          roleName={user.role}
          activeItem={activeTab}
          menuItems={nav.desktop}
          onSelect={handleNavSelect}
          onSignOut={handleSignOut}
        />

        <div className="flex-1 ml-[240px] flex flex-col min-h-screen">
          <TopBar
            roleName={user.role}
            userName={user.fullName}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
          <main className="p-8 max-w-[1280px] w-full mx-auto flex-1">
            {children}
          </main>
        </div>
      </div>

      {/* 2. MOBILE VIEW (Screens < 1024px) */}
      <div
        style={{
          backgroundColor: theme.hex.lightBg,
          color: theme.hex.cardDarkBg,
        }}
        className="lg:hidden w-full min-h-screen pb-24 relative overflow-x-hidden font-sans"
      >
        {children}
        <BottomNav
          role={user.role}
          items={nav.mobile}
          activeId={activeTab}
          onTabChange={handleNavSelect}
          onMoreClick={() => setIsMoreOpen(true)}
        />
        <MoreMenuModal
          isOpen={isMoreOpen}
          onClose={() => setIsMoreOpen(false)}
          user={user}
        />
      </div>
    </div>
  );
}
