'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Sidebar } from '../../components/desktop/Sidebar';
import { TopBar } from '../../components/desktop/TopBar';
import { BottomNav, NavItem } from '../../components/BottomNav';
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
  const [activeTab, setActiveTab] = useState('inquiries');

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

  // Role-specific navigation items
  const getNavItems = (): { mobile: NavItem[]; desktop: any[] } => {
    const role = user.role;

    if (role === 'SALESPERSON') {
      return {
        mobile: [
          { id: 'home', label: 'Home', iconName: 'home', href: '/dashboard' },
          { id: 'visits', label: 'Visits', iconName: 'visits', href: '/visits' },
          { id: 'inquiries', label: 'Inquiries', iconName: 'inquiries', href: '/inquiries' },
          { id: 'profile', label: 'Profile', iconName: 'user', href: '/profile' },
        ],
        desktop: [
          { id: 'dashboard', label: 'My Visits & Agenda', iconName: 'dashboard' },
          { id: 'inquiries', label: 'My Inquiries', iconName: 'inquiries' },
          { id: 'quotations', label: 'Quotations', iconName: 'portal' },
        ],
      };
    }

    if (role === 'MATERIAL_MANAGER') {
      return {
        mobile: [
          { id: 'home', label: 'Home', iconName: 'home', href: '/dashboard' },
          { id: 'planning', label: 'Planning', iconName: 'planning', href: '/material' },
          { id: 'profile', label: 'Profile', iconName: 'user', href: '/profile' },
        ],
        desktop: [
          { id: 'dashboard', label: 'Material Dispatch', iconName: 'material' },
          { id: 'planning', label: 'Rooftop Unloads', iconName: 'inquiries' },
        ],
      };
    }

    if (role === 'ACCOUNTANT') {
      return {
        mobile: [
          { id: 'home', label: 'Home', iconName: 'home', href: '/dashboard' },
          { id: 'payments', label: 'Payments', iconName: 'inquiries', href: '/payments' },
          { id: 'profile', label: 'Profile', iconName: 'user', href: '/profile' },
        ],
        desktop: [
          { id: 'dashboard', label: 'Financial Overview', iconName: 'accounts' },
          { id: 'payments', label: 'Milestone Ledgers', iconName: 'inquiries' },
        ],
      };
    }

    // Default: Operations Manager & Admin
    return {
      mobile: [
        { id: 'home', label: 'Home', iconName: 'home', href: '/dashboard' },
        { id: 'inquiries', label: 'Inquiries', iconName: 'inquiries', href: '/inquiries' },
        { id: 'team', label: 'Team', iconName: 'team', href: '/team' },
        { id: 'profile', label: 'Profile', iconName: 'user', href: '/profile' },
      ],
      desktop: [
        { id: 'dashboard', label: 'All Inquiries', iconName: 'inquiries' },
        { id: 'team', label: 'Team Tracker', iconName: 'team' },
        { id: 'portal', label: 'Govt Portal', iconName: 'portal' },
        { id: 'accounts', label: 'Accounts & Ledger', iconName: 'accounts' },
        { id: 'service', label: 'After-Service', iconName: 'service' },
      ],
    };
  };

  const nav = getNavItems();

  return (
    <div className="min-h-screen bg-typhoon-sand">
      {/* 1. DESKTOP VIEW (Screens >= 1024px) */}
      <div className="hidden lg:flex min-h-screen">
        <Sidebar
          roleName={user.role}
          activeItem={activeTab}
          menuItems={nav.desktop}
          onSelect={(id) => {
            setActiveTab(id);
            if (id === 'team') router.push('/team');
            else if (id === 'portal') router.push('/portal');
            else if (id === 'planning' || id === 'material') router.push('/material');
            else if (id === 'installation') router.push('/installation');
            else if (id === 'payments' || id === 'accounts') router.push('/payments');
            else router.push('/dashboard');
          }}
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
      <div className="lg:hidden max-w-md mx-auto min-h-screen pb-24 relative shadow-xl bg-typhoon-sand">
        {children}
        <BottomNav
          role={user.role}
          items={nav.mobile}
          activeId={activeTab}
          onTabChange={(id) => {
            setActiveTab(id);
            if (id === 'team') router.push('/team');
            else if (id === 'portal') router.push('/portal');
            else if (id === 'planning' || id === 'material') router.push('/material');
            else if (id === 'installation') router.push('/installation');
            else if (id === 'payments' || id === 'accounts') router.push('/payments');
            else if (id === 'home') router.push('/dashboard');
          }}
        />
      </div>
    </div>
  );
}

