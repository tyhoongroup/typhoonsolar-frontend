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
  logoSrc?: string;
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
  logoSrc?: string;
}

export const ROLE_THEMES: Record<string, RoleTheme> = {
  ADMIN: {
    role: 'ADMIN',
    roleName: 'Ops Manager',
    tag: 'OM',
    subtitle: 'Jobs, teams and approvals',
    hex: {
      headerBg: '#0B1E36',
      headerGradient: 'linear-gradient(180deg, #162C46 0%, #0B1E36 100%)',
      headerBorder: 'rgba(255, 255, 255, 0.1)',
      headerTextColor: '#FFFFFF',
      headerSubtextColor: 'rgba(255, 255, 255, 0.75)',
      cardDarkBg: '#0B1E36',
      cardDarkGradient: 'radial-gradient(circle at 100% 0, rgba(245,158,11,.15), transparent 60%), #0B1E36',
      accentBg: '#F59E0B',
      accentGradient: 'linear-gradient(180deg, #FBBF24 0%, #D97706 100%)',
      accentShadow: '0 8px 20px rgba(245, 158, 11, 0.35)',
      accentHoverBg: '#D97706',
      accentTextColor: '#0B1E36',
      navBg: '#0B1E36',
      navGradient: 'linear-gradient(180deg, #162C46 0%, #0B1E36 100%)',
      lightBg: '#FBF8F3',
      lightText: '#0B1E36',
      lightBorder: '#E5E7EB',
    },
    headerBg: 'bg-[#0B1E36]',
    headerBorder: 'border-white/10',
    accentBg: 'bg-[#F59E0B]',
    accentHoverBg: 'hover:bg-[#D97706]',
    accentText: 'text-[#0B1E36]',
    navBg: 'bg-[#0B1E36]',
    navActiveBg: 'bg-[#F59E0B]',
    navActiveText: 'text-[#0B1E36]',
    lightBg: 'bg-[#FBF8F3]',
    lightText: 'text-[#0B1E36]',
    lightBorder: 'border-[#E5E7EB]',
  },
  OPS_MANAGER: {
    role: 'OPS_MANAGER',
    roleName: 'Ops Manager',
    tag: 'OM',
    subtitle: 'Jobs, teams and approvals',
    hex: {
      headerBg: '#0B1E36',
      headerGradient: 'linear-gradient(180deg, #162C46 0%, #0B1E36 100%)',
      headerBorder: 'rgba(255, 255, 255, 0.1)',
      headerTextColor: '#FFFFFF',
      headerSubtextColor: 'rgba(255, 255, 255, 0.75)',
      cardDarkBg: '#0B1E36',
      cardDarkGradient: 'radial-gradient(circle at 100% 0, rgba(245,158,11,.15), transparent 60%), #0B1E36',
      accentBg: '#F59E0B',
      accentGradient: 'linear-gradient(180deg, #FBBF24 0%, #D97706 100%)',
      accentShadow: '0 8px 20px rgba(245, 158, 11, 0.35)',
      accentHoverBg: '#D97706',
      accentTextColor: '#0B1E36',
      navBg: '#0B1E36',
      navGradient: 'linear-gradient(180deg, #162C46 0%, #0B1E36 100%)',
      lightBg: '#FBF8F3',
      lightText: '#0B1E36',
      lightBorder: '#E5E7EB',
    },
    headerBg: 'bg-[#0B1E36]',
    headerBorder: 'border-white/10',
    accentBg: 'bg-[#F59E0B]',
    accentHoverBg: 'hover:bg-[#D97706]',
    accentText: 'text-[#0B1E36]',
    navBg: 'bg-[#0B1E36]',
    navActiveBg: 'bg-[#F59E0B]',
    navActiveText: 'text-[#0B1E36]',
    lightBg: 'bg-[#FBF8F3]',
    lightText: 'text-[#0B1E36]',
    lightBorder: 'border-[#E5E7EB]',
  },
  SALESPERSON: {
    role: 'SALESPERSON',
    roleName: 'Salesperson',
    tag: 'RS',
    subtitle: 'Survey, quotation and closing',
    hex: {
      headerBg: '#FAF8F5',
      headerGradient: 'linear-gradient(180deg, #FCC2B4 0%, #FBE4DD 100%)',
      headerBorder: '#EFEAE2',
      headerTextColor: '#1F1235',
      headerSubtextColor: 'rgba(31, 18, 53, 0.7)',
      cardDarkBg: '#1F1235',
      cardDarkGradient: 'radial-gradient(circle at 100% 0, rgba(255,255,255,.14), transparent 55%), #1F1235',
      accentBg: '#FF6B4A',
      accentGradient: 'linear-gradient(180deg, rgba(255,255,255,.2), rgba(0,0,0,.06)), #FF6B4A',
      accentShadow: '0 8px 20px rgba(255, 107, 74, 0.35)',
      accentHoverBg: '#E85535',
      accentTextColor: '#FFFFFF',
      navBg: '#1F1235',
      navGradient: 'linear-gradient(180deg, #2E1F4B 0%, #1F1235 100%)',
      lightBg: '#FAF8F5',
      lightText: '#1F1235',
      lightBorder: '#EFEAE2',
    },
    headerBg: 'bg-[#FAF8F5]',
    headerBorder: 'border-[#EFEAE2]',
    accentBg: 'bg-[#FF6B4A]',
    accentHoverBg: 'hover:bg-[#E85535]',
    accentText: 'text-white',
    navBg: 'bg-[#1F1235]',
    navActiveBg: 'bg-[#FF6B4A]',
    navActiveText: 'text-white',
    lightBg: 'bg-[#FAF8F5]',
    lightText: 'text-[#1F1235]',
    lightBorder: 'border-[#EFEAE2]',
  },
  PORTAL_USER: {
    role: 'PORTAL_USER',
    roleName: 'My Solar Project',
    tag: 'PU',
    subtitle: 'Progress, documents and payments',
    hex: {
      headerBg: '#F4F8F7',
      headerGradient: 'linear-gradient(180deg, #A8EAE2 0%, #D8F3EF 100%)',
      headerBorder: '#D2E5E2',
      headerTextColor: '#0C2A33',
      headerSubtextColor: 'rgba(12, 42, 51, 0.7)',
      cardDarkBg: '#0C2A33',
      cardDarkGradient: 'radial-gradient(circle at 100% 0, rgba(255,255,255,.14), transparent 55%), #0C2A33',
      accentBg: '#2DD4BF',
      accentGradient: 'linear-gradient(180deg, rgba(255,255,255,.2), rgba(0,0,0,.06)), #2DD4BF',
      accentShadow: '0 8px 20px rgba(45, 212, 191, 0.35)',
      accentHoverBg: '#14B8A6',
      accentTextColor: '#0C2A33',
      navBg: '#0C2A33',
      navGradient: 'linear-gradient(180deg, #153F4C 0%, #0C2A33 100%)',
      lightBg: '#F4F8F7',
      lightText: '#0C2A33',
      lightBorder: '#D2E5E2',
    },
    headerBg: 'bg-[#F4F8F7]',
    headerBorder: 'border-[#D2E5E2]',
    accentBg: 'bg-[#2DD4BF]',
    accentHoverBg: 'hover:bg-[#14B8A6]',
    accentText: 'text-[#0C2A33]',
    navBg: 'bg-[#0C2A33]',
    navActiveBg: 'bg-[#2DD4BF]',
    navActiveText: 'text-[#0C2A33]',
    lightBg: 'bg-[#F4F8F7]',
    lightText: 'text-[#0C2A33]',
    lightBorder: 'border-[#D2E5E2]',
  },
  MATERIAL_MANAGER: {
    role: 'MATERIAL_MANAGER',
    roleName: 'Material Manager',
    tag: 'MM',
    subtitle: 'Stock, dispatch and orders',
    hex: {
      headerBg: '#F2F4F5',
      headerGradient: 'linear-gradient(180deg, #F5E5A0 0%, #F3EED6 100%)',
      headerBorder: '#DFE3E6',
      headerTextColor: '#1F2933',
      headerSubtextColor: 'rgba(31, 41, 51, 0.7)',
      cardDarkBg: '#1F2933',
      cardDarkGradient: 'radial-gradient(circle at 100% 0, rgba(255,255,255,.14), transparent 55%), #1F2933',
      accentBg: '#FACC15',
      accentGradient: 'linear-gradient(180deg, rgba(255,255,255,.2), rgba(0,0,0,.06)), #FACC15',
      accentShadow: '0 8px 20px rgba(250, 204, 21, 0.35)',
      accentHoverBg: '#EAB308',
      accentTextColor: '#1F2933',
      navBg: '#1F2933',
      navGradient: 'linear-gradient(180deg, #2D3A47 0%, #1F2933 100%)',
      lightBg: '#F2F4F5',
      lightText: '#1F2933',
      lightBorder: '#DFE3E6',
    },
    headerBg: 'bg-[#F2F4F5]',
    headerBorder: 'border-[#DFE3E6]',
    accentBg: 'bg-[#FACC15]',
    accentHoverBg: 'hover:bg-[#EAB308]',
    accentText: 'text-[#1F2933]',
    navBg: 'bg-[#1F2933]',
    navActiveBg: 'bg-[#FACC15]',
    navActiveText: 'text-[#1F2933]',
    lightBg: 'bg-[#F2F4F5]',
    lightText: 'text-[#1F2933]',
    lightBorder: 'border-[#DFE3E6]',
  },
  INSTALLATION_TEAM: {
    role: 'INSTALLATION_TEAM',
    roleName: 'Install Team',
    tag: 'IT',
    subtitle: 'Installation and commissioning',
    hex: {
      headerBg: '#F3F4F6',
      headerGradient: 'linear-gradient(180deg, #A4E7F3 0%, #D6EFF5 100%)',
      headerBorder: '#E2E5E9',
      headerTextColor: '#1E293B',
      headerSubtextColor: 'rgba(30, 41, 59, 0.7)',
      cardDarkBg: '#1E293B',
      cardDarkGradient: 'radial-gradient(circle at 100% 0, rgba(255,255,255,.14), transparent 55%), #1E293B',
      accentBg: '#22D3EE',
      accentGradient: 'linear-gradient(180deg, rgba(255,255,255,.2), rgba(0,0,0,.06)), #22D3EE',
      accentShadow: '0 8px 20px rgba(34, 211, 238, 0.35)',
      accentHoverBg: '#06B6D4',
      accentTextColor: '#1E293B',
      navBg: '#1E293B',
      navGradient: 'linear-gradient(180deg, #2A384E 0%, #1E293B 100%)',
      lightBg: '#F3F4F6',
      lightText: '#1E293B',
      lightBorder: '#E2E5E9',
    },
    headerBg: 'bg-[#F3F4F6]',
    headerBorder: 'border-[#E2E5E9]',
    accentBg: 'bg-[#22D3EE]',
    accentHoverBg: 'hover:bg-[#06B6D4]',
    accentText: 'text-[#1E293B]',
    navBg: 'bg-[#1E293B]',
    navActiveBg: 'bg-[#22D3EE]',
    navActiveText: 'text-[#1E293B]',
    lightBg: 'bg-[#F3F4F6]',
    lightText: 'text-[#1E293B]',
    lightBorder: 'border-[#E2E5E9]',
  },
  ACCOUNTANT: {
    role: 'ACCOUNTANT',
    roleName: 'Accountant',
    tag: 'AC',
    subtitle: 'Invoices, payments and ledgers',
    hex: {
      headerBg: '#F3F1EC',
      headerGradient: 'linear-gradient(180deg, #E3D3AE 0%, #EDE6D5 100%)',
      headerBorder: '#E3E0D8',
      headerTextColor: '#14231F',
      headerSubtextColor: 'rgba(20, 35, 31, 0.7)',
      cardDarkBg: '#14231F',
      cardDarkGradient: 'radial-gradient(circle at 100% 0, rgba(255,255,255,.14), transparent 55%), #14231F',
      accentBg: '#C8A24A',
      accentGradient: 'linear-gradient(180deg, rgba(255,255,255,.2), rgba(0,0,0,.06)), #C8A24A',
      accentShadow: '0 8px 20px rgba(200, 162, 74, 0.35)',
      accentHoverBg: '#B38E38',
      accentTextColor: '#FFFFFF',
      navBg: '#14231F',
      navGradient: 'linear-gradient(180deg, #213530 0%, #14231F 100%)',
      lightBg: '#F3F1EC',
      lightText: '#14231F',
      lightBorder: '#E3E0D8',
    },
    headerBg: 'bg-[#F3F1EC]',
    headerBorder: 'border-[#E3E0D8]',
    accentBg: 'bg-[#C8A24A]',
    accentHoverBg: 'hover:bg-[#B38E38]',
    accentText: 'text-white',
    navBg: 'bg-[#14231F]',
    navActiveBg: 'bg-[#C8A24A]',
    navActiveText: 'text-white',
    lightBg: 'bg-[#F3F1EC]',
    lightText: 'text-[#14231F]',
    lightBorder: 'border-[#E3E0D8]',
  },
  SERVICE_TECH: {
    role: 'SERVICE_TECH',
    roleName: 'Service Technician',
    tag: 'ST',
    subtitle: 'Warranty, cleaning and maintenance',
    hex: {
      headerBg: '#F3F4F6',
      headerGradient: 'linear-gradient(180deg, #A4E7F3 0%, #D6EFF5 100%)',
      headerBorder: '#E2E5E9',
      headerTextColor: '#1E293B',
      headerSubtextColor: 'rgba(30, 41, 59, 0.7)',
      cardDarkBg: '#1E293B',
      cardDarkGradient: 'radial-gradient(circle at 100% 0, rgba(255,255,255,.14), transparent 55%), #1E293B',
      accentBg: '#22D3EE',
      accentGradient: 'linear-gradient(180deg, rgba(255,255,255,.2), rgba(0,0,0,.06)), #22D3EE',
      accentShadow: '0 8px 20px rgba(34, 211, 238, 0.35)',
      accentHoverBg: '#06B6D4',
      accentTextColor: '#1E293B',
      navBg: '#1E293B',
      lightBg: '#F3F4F6',
      lightText: '#1E293B',
      lightBorder: '#E2E5E9',
    },
    headerBg: 'bg-[#F3F4F6]',
    headerBorder: 'border-[#E2E5E9]',
    accentBg: 'bg-[#22D3EE]',
    accentHoverBg: 'hover:bg-[#06B6D4]',
    accentText: 'text-[#1E293B]',
    navBg: 'bg-[#1E293B]',
    navActiveBg: 'bg-[#22D3EE]',
    navActiveText: 'text-[#1E293B]',
    lightBg: 'bg-[#F3F4F6]',
    lightText: 'text-[#1E293B]',
    lightBorder: 'border-[#E2E5E9]',
  },
  CUSTOMER: {
    role: 'CUSTOMER',
    roleName: 'My Solar Project',
    tag: 'PU',
    subtitle: 'Progress, documents and payments',
    hex: {
      headerBg: '#F4F8F7',
      headerGradient: 'linear-gradient(180deg, #A8EAE2 0%, #D8F3EF 100%)',
      headerBorder: '#D2E5E2',
      headerTextColor: '#0C2A33',
      headerSubtextColor: 'rgba(12, 42, 51, 0.7)',
      cardDarkBg: '#0C2A33',
      cardDarkGradient: 'radial-gradient(circle at 100% 0, rgba(255,255,255,.14), transparent 55%), #0C2A33',
      accentBg: '#2DD4BF',
      accentGradient: 'linear-gradient(180deg, rgba(255,255,255,.2), rgba(0,0,0,.06)), #2DD4BF',
      accentShadow: '0 8px 20px rgba(45, 212, 191, 0.35)',
      accentHoverBg: '#14B8A6',
      accentTextColor: '#0C2A33',
      navBg: '#0C2A33',
      lightBg: '#F4F8F7',
      lightText: '#0C2A33',
      lightBorder: '#D2E5E2',
    },
    headerBg: 'bg-[#F4F8F7]',
    headerBorder: 'border-[#D2E5E2]',
    accentBg: 'bg-[#2DD4BF]',
    accentHoverBg: 'hover:bg-[#14B8A6]',
    accentText: 'text-[#0C2A33]',
    navBg: 'bg-[#0C2A33]',
    navActiveBg: 'bg-[#2DD4BF]',
    navActiveText: 'text-[#0C2A33]',
    lightBg: 'bg-[#F4F8F7]',
    lightText: 'text-[#0C2A33]',
    lightBorder: 'border-[#D2E5E2]',
  },
};

export function getRoleTheme(role?: string): RoleTheme {
  const base = (() => {
    if (!role) return ROLE_THEMES.OPS_MANAGER;
    const upper = role.toUpperCase();
    if (ROLE_THEMES[upper]) return ROLE_THEMES[upper];
    if (upper.includes('MATERIAL')) return ROLE_THEMES.MATERIAL_MANAGER;
    if (upper.includes('INSTALL')) return ROLE_THEMES.INSTALLATION_TEAM;
    if (upper.includes('ACCOUNT')) return ROLE_THEMES.ACCOUNTANT;
    if (upper.includes('PORTAL')) return ROLE_THEMES.PORTAL_USER;
    if (upper.includes('SALES')) return ROLE_THEMES.SALESPERSON;
    if (upper.includes('OPS') || upper.includes('OPERAT') || upper.includes('CONTROL') || upper.includes('ADMIN')) {
      return ROLE_THEMES.OPS_MANAGER;
    }
    return ROLE_THEMES.OPS_MANAGER;
  })();

  return {
    ...base,
    hex: {
      ...base.hex,
      logoSrc: '/images/typhoon-logo.png',
    },
  };
}
