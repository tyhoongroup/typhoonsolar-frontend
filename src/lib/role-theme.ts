export interface RoleColors {
  headerBg: string;
  headerGradient?: string;
  headerBorder: string;
  headerTextColor?: string;
  headerSubtextColor?: string;
  cardDarkBg?: string;
  cardDarkGradient?: string;
  accentBg: string;
  accentGradient?: string;
  accentShadow?: string;
  accentHoverBg: string;
  accentTextColor: string;
  navBg: string;
  navGradient?: string;
  lightBg: string;
  lightText: string;
  lightBorder: string;
}

export interface RoleTheme {
  role: string;
  roleName: string;
  tag: string;
  subtitle: string;
  // Raw Hex colors for guaranteed inline rendering
  hex: RoleColors;
  // Tailwind utility classes
  headerBg: string;
  headerBorder: string;
  accentBg: string;
  accentHoverBg: string;
  accentText: string;
  navBg: string;
  navActiveBg: string;
  navActiveText: string;
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
    hex: {
      headerBg: '#1e1b4b',
      headerGradient: 'linear-gradient(135deg, #2e266d 0%, #1e1b4b 70%, #151336 100%)',
      headerBorder: '#2e2a72',
      headerTextColor: '#ffffff',
      headerSubtextColor: 'rgba(255, 255, 255, 0.7)',
      cardDarkBg: '#1e1b4b',
      cardDarkGradient: 'linear-gradient(145deg, #26225e 0%, #1e1b4b 100%)',
      accentBg: '#7c3aed',
      accentGradient: 'linear-gradient(135deg, #9055ff 0%, #7c3aed 70%, #6322d6 100%)',
      accentShadow: '0 8px 24px -4px rgba(124, 58, 237, 0.4)',
      accentHoverBg: '#6d28d9',
      accentTextColor: '#ffffff',
      navBg: '#1e1b4b',
      navGradient: 'linear-gradient(180deg, #26225e 0%, #1e1b4b 100%)',
      lightBg: '#f5f3ff',
      lightText: '#6d28d9',
      lightBorder: '#ddd6fe',
    },
    headerBg: 'bg-[#1e1b4b]',
    headerBorder: 'border-[#2e2a72]',
    accentBg: 'bg-[#7c3aed]',
    accentHoverBg: 'hover:bg-[#6d28d9]',
    accentText: 'text-white',
    navBg: 'bg-[#1e1b4b]',
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
    hex: {
      headerBg: '#D9A23A',        // 60% Butterscotch Gold
      headerGradient: 'linear-gradient(135deg, #E6B552 0%, #D9A23A 55%, #C28C28 100%)', // Premium warm gold sheen
      headerBorder: '#B88428',    // Deep Butterscotch Gold Border
      headerTextColor: '#1E1F24', // 30% Graphite Ink Text for contrast on Gold
      headerSubtextColor: 'rgba(30, 31, 36, 0.78)',
      cardDarkBg: '#1E1F24',      // 30% Graphite Ink
      cardDarkGradient: 'linear-gradient(145deg, #2A2C34 0%, #1E1F24 60%, #151619 100%)', // Premium graphite ink gradient
      accentBg: '#2448FF',        // 10% Hyper Cobalt
      accentGradient: 'linear-gradient(135deg, #3D62FF 0%, #2448FF 60%, #1539E6 100%)', // Vivid cobalt luster
      accentShadow: '0 8px 24px -4px rgba(36, 72, 255, 0.45)', // Premium soft glow
      accentHoverBg: '#1B3AE6',
      accentTextColor: '#ffffff', // Crisp white on Cobalt
      navBg: '#1E1F24',           // 30% Graphite Ink
      navGradient: 'linear-gradient(180deg, #282A32 0%, #1E1F24 100%)',
      lightBg: '#FDF9F2',         // Soft warm canvas tint
      lightText: '#1E1F24',
      lightBorder: '#E8D4A9',
    },
    headerBg: 'bg-[#D9A23A]',
    headerBorder: 'border-[#B88428]',
    accentBg: 'bg-[#2448FF]',
    accentHoverBg: 'hover:bg-[#1B3AE6]',
    accentText: 'text-white',
    navBg: 'bg-[#1E1F24]',
    navActiveBg: 'bg-[#2448FF]',
    navActiveText: 'text-white',
    lightBg: 'bg-[#FDF9F2]',
    lightText: 'text-[#1E1F24]',
    lightBorder: 'border-[#E8D4A9]',
  },
  SALESPERSON: {
    role: 'SALESPERSON',
    roleName: 'Salesperson',
    tag: 'RS',
    subtitle: 'Survey, quotation and closing',
    hex: {
      headerBg: '#0a3d7c',
      headerBorder: '#124d99',
      accentBg: '#00a3e0',
      accentHoverBg: '#0284c7',
      accentTextColor: '#ffffff',
      navBg: '#0a3d7c',
      lightBg: '#f0f9ff',
      lightText: '#0369a1',
      lightBorder: '#bae6fd',
    },
    headerBg: 'bg-[#0a3d7c]',
    headerBorder: 'border-[#124d99]',
    accentBg: 'bg-[#00a3e0]',
    accentHoverBg: 'hover:bg-[#0284c7]',
    accentText: 'text-white',
    navBg: 'bg-[#0a3d7c]',
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
    hex: {
      headerBg: '#063a42',
      headerBorder: '#0a4d57',
      accentBg: '#00bfa5',
      accentHoverBg: '#0d9488',
      accentTextColor: '#063a42',
      navBg: '#063a42',
      lightBg: '#f0fdfa',
      lightText: '#0f766e',
      lightBorder: '#99f6e4',
    },
    headerBg: 'bg-[#063a42]',
    headerBorder: 'border-[#0a4d57]',
    accentBg: 'bg-[#00bfa5]',
    accentHoverBg: 'hover:bg-[#0d9488]',
    accentText: 'text-[#063a42]',
    navBg: 'bg-[#063a42]',
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
    hex: {
      headerBg: '#36451e',
      headerBorder: '#4a5e29',
      accentBg: '#a3e635',
      accentHoverBg: '#84cc16',
      accentTextColor: '#2e3b18',
      navBg: '#36451e',
      lightBg: '#f7fee7',
      lightText: '#4d7c0f',
      lightBorder: '#d9f99d',
    },
    headerBg: 'bg-[#36451e]',
    headerBorder: 'border-[#4a5e29]',
    accentBg: 'bg-[#a3e635]',
    accentHoverBg: 'hover:bg-[#84cc16]',
    accentText: 'text-[#2e3b18]',
    navBg: 'bg-[#36451e]',
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
    hex: {
      headerBg: '#3e1c0d',
      headerBorder: '#542813',
      accentBg: '#f97316',
      accentHoverBg: '#ea580c',
      accentTextColor: '#ffffff',
      navBg: '#3e1c0d',
      lightBg: '#fff7ed',
      lightText: '#c2410c',
      lightBorder: '#fed7aa',
    },
    headerBg: 'bg-[#3e1c0d]',
    headerBorder: 'border-[#542813]',
    accentBg: 'bg-[#f97316]',
    accentHoverBg: 'hover:bg-[#ea580c]',
    accentText: 'text-white',
    navBg: 'bg-[#3e1c0d]',
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
    hex: {
      headerBg: '#3d1020',
      headerBorder: '#571930',
      accentBg: '#e1144a',
      accentHoverBg: '#be123c',
      accentTextColor: '#ffffff',
      navBg: '#3d1020',
      lightBg: '#fff1f2',
      lightText: '#be123c',
      lightBorder: '#fecdd3',
    },
    headerBg: 'bg-[#3d1020]',
    headerBorder: 'border-[#571930]',
    accentBg: 'bg-[#e1144a]',
    accentHoverBg: 'hover:bg-[#be123c]',
    accentText: 'text-white',
    navBg: 'bg-[#3d1020]',
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
    hex: {
      headerBg: '#1c1e21',
      headerBorder: '#2d3238',
      accentBg: '#facc15',
      accentHoverBg: '#eab308',
      accentTextColor: '#1c1e21',
      navBg: '#1c1e21',
      lightBg: '#fefce8',
      lightText: '#a16207',
      lightBorder: '#fef08a',
    },
    headerBg: 'bg-[#1c1e21]',
    headerBorder: 'border-[#2d3238]',
    accentBg: 'bg-[#facc15]',
    accentHoverBg: 'hover:bg-[#eab308]',
    accentText: 'text-[#1c1e21]',
    navBg: 'bg-[#1c1e21]',
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
    hex: {
      headerBg: '#064e3b',
      headerBorder: '#0a664e',
      accentBg: '#10b981',
      accentHoverBg: '#059669',
      accentTextColor: '#ffffff',
      navBg: '#064e3b',
      lightBg: '#ecfdf5',
      lightText: '#047857',
      lightBorder: '#a7f3d0',
    },
    headerBg: 'bg-[#064e3b]',
    headerBorder: 'border-[#0a664e]',
    accentBg: 'bg-[#10b981]',
    accentHoverBg: 'hover:bg-[#059669]',
    accentText: 'text-white',
    navBg: 'bg-[#064e3b]',
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
