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

  // Keep active tab in sync with current URL pathname and enforce role route protection
  useEffect(() => {
    if (pathname.includes('/portal')) {
      setActiveTab('portal');
    } else if (pathname.includes('/material')) {
      setActiveTab('material');
    } else if (pathname.includes('/installation')) {
      setActiveTab('installation');
    } else if (pathname.includes('/payments')) {
      setActiveTab('payments');
    } else if (pathname === '/projects' || pathname.startsWith('/projects/')) {
      setActiveTab('projects');
    } else if (pathname === '/inquiries') {
      setActiveTab('inquiries');
    } else if (pathname.includes('/inquiries')) {
      setActiveTab('inquiries');
    } else if (pathname.includes('/quotations')) {
      setActiveTab('quotations');
    } else if (pathname.includes('/team')) {
      setActiveTab('team');
    } else {
      setActiveTab('home');
    }

    // Role Route Protection: Prevent unauthorized roles from entering other department pages
    if (user && user.role !== 'ADMIN' && user.role !== 'OPS_MANAGER') {
      const role = user.role;
      const allowedPrefixes = ['/dashboard', '/track', '/profile'];

      if (role === 'SALESPERSON') {
        allowedPrefixes.push('/inquiries', '/projects', '/quotations');
      } else if (role === 'PORTAL_USER') {
        allowedPrefixes.push('/portal', '/projects');
      } else if (role === 'MATERIAL_MANAGER') {
        allowedPrefixes.push('/material', '/projects');
      } else if (role === 'INSTALLATION_TEAM') {
        allowedPrefixes.push('/installation', '/projects');
      } else if (role === 'ACCOUNTANT') {
        allowedPrefixes.push('/payments', '/projects');
      } else if (role === 'SERVICE_TECH') {
        allowedPrefixes.push('/service');
      }

      const isAllowed = allowedPrefixes.some((prefix) => pathname.startsWith(prefix));
      if (!isAllowed) {
        router.push('/dashboard');
      }
    }
  }, [pathname, user, router]);

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
          { id: 'inquiries', label: 'Inquiries', iconName: 'inquiries', href: '/inquiries' },
          { id: 'projects', label: 'Projects & Docs', iconName: 'docs', href: '/projects' },
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
          { id: 'portal', label: 'Govt Queue', iconName: 'portal', href: '/portal' },
          { id: 'meter', label: 'Meter & Subsidy', iconName: 'subsidy', href: '/portal' },
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
          { id: 'material', label: 'BOM & Unload', iconName: 'material', href: '/material' },
          { id: 'verify', label: 'Verify Proofs', iconName: 'unload', href: '/material' },
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
          { id: 'installation', label: 'My Projects', iconName: 'installation', href: '/installation' },
          { id: 'serials', label: 'Upload Serials', iconName: 'checklist', href: '/installation' },
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
          { id: 'projects', label: 'Projects', iconName: 'ledger', href: '/payments' },
          { id: 'payments', label: 'Log Payment', iconName: 'payments', href: '/payments' },
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
          { id: 'tickets', label: 'Tickets', iconName: 'tickets', href: '/dashboard' },
          { id: 'service', label: 'Service Action', iconName: 'jobs', href: '/dashboard' },
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
        { id: 'inquiries', label: 'Inquiries', iconName: 'inquiries', href: '/inquiries' },
        { id: 'projects', label: 'Projects', iconName: 'jobs', href: '/projects' },
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
    else if (id === 'pipeline' || id === 'inquiries') router.push('/inquiries');
    else if (id === 'projects') router.push('/projects');
    else if (id === 'quotations') router.push('/quotations/new');
    else if (id === 'portal' || id === 'sr' || id === 'subsidy' || id === 'meter') router.push('/portal');
    else if (id === 'material' || id === 'planning' || id === 'unload' || id === 'verify') router.push('/material');
    else if (id === 'installation' || id === 'jobs' || id === 'checklist' || id === 'serials') router.push('/installation');
    else if (id === 'payments' || id === 'milestones' || id === 'accounts') router.push('/payments');
    else if (id === 'team') router.push('/team');
    else if (id === 'tickets' || id === 'service') router.push('/dashboard');
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
