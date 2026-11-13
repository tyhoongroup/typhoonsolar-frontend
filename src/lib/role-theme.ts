export interface RoleTheme {
  role: string;
  roleName: string;
  tag: string;
  subtitle: string;
  // Header styling
  headerBg: string;
  headerBorder: string;
  // Accent styling for buttons & active navigation
  accentBg: string;
  accentHoverBg: string;
  accentText: string;
  // Bottom navigation
  navBg: string;
  navActiveBg: string;
  navActiveText: string;
  // Soft badge / card highlight
  lightBg: string;
  lightText: string;
  lightBorder: string;
}

export const ROLE_THEMES: Record<string, RoleTheme> = {
  ADMIN: {
    role: 'ADMIN',
    roleName: 'Admin',
    tag: 'AD',
    subtitle: 'Full control and team management',
    headerBg: 'bg-[#1e1b4b]',
    headerBorder: 'border-[#2e2a72]',
    accentBg: 'bg-[#7c3aed]',
    accentHoverBg: 'hover:bg-[#6d28d9]',
    accentText: 'text-white',
    navBg: 'bg-[#1e1b4b]/95',
    navActiveBg: 'bg-[#7c3aed]',
    navActiveText: 'text-white',
    lightBg: 'bg-[#f5f3ff]',
    lightText: 'text-[#6d28d9]',
    lightBorder: 'border-[#ddd6fe]',
  },
  OPS_MANAGER: {
    role: 'OPS_MANAGER',
    roleName: 'Control tower',
    tag: 'AK',
    subtitle: 'Lead assignment and SLA delays',
    headerBg: 'bg-[#0b192c]',
    headerBorder: 'border-[#1b2b42]',
    accentBg: 'bg-[#f59e0b]',
    accentHoverBg: 'hover:bg-[#d97706]',
    accentText: 'text-[#0b192c]',
    navBg: 'bg-[#0b192c]/95',
    navActiveBg: 'bg-[#f59e0b]',
    navActiveText: 'text-[#0b192c]',
    lightBg: 'bg-[#fffbeb]',
    lightText: 'text-[#b45309]',
    lightBorder: 'border-[#fde68a]',
  },
  SALESPERSON: {
    role: 'SALESPERSON',
    roleName: 'Salesperson',
    tag: 'RS',
    subtitle: 'Survey, quotation and closing',
    headerBg: 'bg-[#0a3d7c]',
    headerBorder: 'border-[#124d99]',
    accentBg: 'bg-[#00a3e0]',
    accentHoverBg: 'hover:bg-[#0284c7]',
    accentText: 'text-white',
    navBg: 'bg-[#0a3d7c]/95',
    navActiveBg: 'bg-[#00a3e0]',
    navActiveText: 'text-white',
    lightBg: 'bg-[#f0f9ff]',
    lightText: 'text-[#0369a1]',
    lightBorder: 'border-[#bae6fd]',
  },
  PORTAL_USER: {
    role: 'PORTAL_USER',
    roleName: 'Portal user',
    tag: 'RP',
    subtitle: 'DISCOM and PM Surya Ghar portals',
    headerBg: 'bg-[#063a42]',
    headerBorder: 'border-[#0a4d57]',
    accentBg: 'bg-[#00bfa5]',
    accentHoverBg: 'hover:bg-[#0d9488]',
    accentText: 'text-[#063a42]',
    navBg: 'bg-[#063a42]/95',
    navActiveBg: 'bg-[#00bfa5]',
    navActiveText: 'text-[#063a42]',
    lightBg: 'bg-[#f0fdfa]',
    lightText: 'text-[#0f766e]',
    lightBorder: 'border-[#99f6e4]',
  },
  MATERIAL_MANAGER: {
    role: 'MATERIAL_MANAGER',
    roleName: 'Material manager',
    tag: 'SM',
    subtitle: 'Warehouse stock and delivery',
    headerBg: 'bg-[#36451e]',
    headerBorder: 'border-[#4a5e29]',
    accentBg: 'bg-[#a3e635]',
    accentHoverBg: 'hover:bg-[#84cc16]',
    accentText: 'text-[#2e3b18]',
    navBg: 'bg-[#36451e]/95',
    navActiveBg: 'bg-[#a3e635]',
    navActiveText: 'text-[#2e3b18]',
    lightBg: 'bg-[#f7fee7]',
    lightText: 'text-[#4d7c0f]',
    lightBorder: 'border-[#d9f99d]',
  },
  INSTALLATION_TEAM: {
    role: 'INSTALLATION_TEAM',
    roleName: 'Installation team',
    tag: 'IT',
    subtitle: 'Rooftop installation jobs',
    headerBg: 'bg-[#3e1c0d]',
    headerBorder: 'border-[#542813]',
    accentBg: 'bg-[#f97316]',
    accentHoverBg: 'hover:bg-[#ea580c]',
    accentText: 'text-white',
    navBg: 'bg-[#3e1c0d]/95',
    navActiveBg: 'bg-[#f97316]',
    navActiveText: 'text-white',
    lightBg: 'bg-[#fff7ed]',
    lightText: 'text-[#c2410c]',
    lightBorder: 'border-[#fed7aa]',
  },
  ACCOUNTANT: {
    role: 'ACCOUNTANT',
    roleName: 'Accountant',
    tag: 'MA',
    subtitle: 'Payment milestones and receipts',
    headerBg: 'bg-[#3d1020]',
    headerBorder: 'border-[#571930]',
    accentBg: 'bg-[#e1144a]',
    accentHoverBg: 'hover:bg-[#be123c]',
    accentText: 'text-white',
    navBg: 'bg-[#3d1020]/95',
    navActiveBg: 'bg-[#e1144a]',
    navActiveText: 'text-white',
    lightBg: 'bg-[#fff1f2]',
    lightText: 'text-[#be123c]',
    lightBorder: 'border-[#fecdd3]',
  },
  SERVICE_TECH: {
    role: 'SERVICE_TECH',
    roleName: 'Service technician',
    tag: 'ST',
    subtitle: 'Warranty, cleaning and maintenance',
    headerBg: 'bg-[#1c1e21]',
    headerBorder: 'border-[#2d3238]',
    accentBg: 'bg-[#facc15]',
    accentHoverBg: 'hover:bg-[#eab308]',
    accentText: 'text-[#1c1e21]',
    navBg: 'bg-[#1c1e21]/95',
    navActiveBg: 'bg-[#facc15]',
    navActiveText: 'text-[#1c1e21]',
    lightBg: 'bg-[#fefce8]',
    lightText: 'text-[#a16207]',
    lightBorder: 'border-[#fef08a]',
  },
  CUSTOMER: {
    role: 'CUSTOMER',
    roleName: 'Customer Tracking',
    tag: 'TS',
    subtitle: 'Public tracking link · no login',
    headerBg: 'bg-[#064e3b]',
    headerBorder: 'border-[#0a664e]',
    accentBg: 'bg-[#10b981]',
    accentHoverBg: 'hover:bg-[#059669]',
    accentText: 'text-white',
    navBg: 'bg-[#064e3b]/95',
    navActiveBg: 'bg-[#10b981]',
    navActiveText: 'text-white',
    lightBg: 'bg-[#ecfdf5]',
    lightText: 'text-[#047857]',
    lightBorder: 'border-[#a7f3d0]',
  },
};

export function getRoleTheme(role?: string): RoleTheme {
  if (!role || !ROLE_THEMES[role]) {
    return ROLE_THEMES.OPS_MANAGER;
  }
  return ROLE_THEMES[role];
}

