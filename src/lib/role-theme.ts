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
      headerBg: '#EEE7DA',        // 60% Seashell Linen
      headerGradient: 'linear-gradient(135deg, #F8F3EA 0%, #EEE7DA 55%, #DFD6C5 100%)', // Premium linen sheen
      headerBorder: '#D3C8B4',    // Soft Linen border
      headerTextColor: '#6E4A33', // 30% Cedar Brown Text for contrast on Linen
      headerSubtextColor: 'rgba(110, 74, 51, 0.78)',
      cardDarkBg: '#6E4A33',      // 30% Cedar Brown
      cardDarkGradient: 'linear-gradient(145deg, #82583C 0%, #6E4A33 60%, #553926 100%)', // Rich Cedar Brown gradient
      accentBg: '#1F3DFF',        // 10% Klein Cobalt
      accentGradient: 'linear-gradient(135deg, #3D58FF 0%, #1F3DFF 60%, #102EE6 100%)', // Vivid cobalt luster
      accentShadow: '0 8px 24px -4px rgba(31, 61, 255, 0.45)', // Premium soft glow
      accentHoverBg: '#102EE6',
      accentTextColor: '#ffffff', // Crisp white on Cobalt
      navBg: '#6E4A33',           // 30% Cedar Brown
      navGradient: 'linear-gradient(180deg, #82583C 0%, #6E4A33 100%)',
      lightBg: '#FBF9F5',         // Soft linen tint
      lightText: '#6E4A33',
      lightBorder: '#E5DDCF',
      logoSrc: '/images/typhoon-logo-ops.png',
    },
    headerBg: 'bg-[#EEE7DA]',
    headerBorder: 'border-[#D3C8B4]',
    accentBg: 'bg-[#1F3DFF]',
    accentHoverBg: 'hover:bg-[#102EE6]',
    accentText: 'text-white',
    navBg: 'bg-[#6E4A33]',
    navActiveBg: 'bg-[#1F3DFF]',
    navActiveText: 'text-white',
    lightBg: 'bg-[#FBF9F5]',
    lightText: 'text-[#6E4A33]',
    lightBorder: 'border-[#E5DDCF]',
    logoSrc: '/images/typhoon-logo-ops.png',
  },
  SALESPERSON: {
    role: 'SALESPERSON',
    roleName: 'Salesperson',
    tag: 'RS',
    subtitle: 'Survey, quotation and closing',
    hex: {
      headerBg: '#BCD3E6',        // 60% Powder Blue
      headerGradient: 'linear-gradient(135deg, #CCE0EF 0%, #BCD3E6 55%, #A7C2D7 100%)', // Soft airy blue sheen
      headerBorder: '#9BBCCE',    // Powder Blue border
      headerTextColor: '#1C374D', // Deep navy for contrast on Powder Blue
      headerSubtextColor: 'rgba(28, 55, 77, 0.78)',
      cardDarkBg: '#1C374D',      // Deep navy structural container
      cardDarkGradient: 'linear-gradient(145deg, #274B68 0%, #1C374D 60%, #142838 100%)',
      accentBg: '#FFC22E',        // 10% Sunflower Gold
      accentGradient: 'linear-gradient(135deg, #FFD25E 0%, #FFC22E 60%, #E6A810 100%)', // Radiant sunflower luster
      accentShadow: '0 8px 24px -4px rgba(255, 194, 46, 0.45)', // Premium soft glow
      accentHoverBg: '#E6A810',
      accentTextColor: '#2B2105', // Dark bronze for optimal readability on gold
      navBg: '#1C374D',           // Deep navy dock
      navGradient: 'linear-gradient(180deg, #274B68 0%, #1C374D 100%)',
      lightBg: '#F1EEE6',         // 30% Pearl White
      lightText: '#1C374D',
      lightBorder: '#DFD9CB',
      logoSrc: '/images/typhoon-logo-salesperson.png',
    },
    headerBg: 'bg-[#BCD3E6]',
    headerBorder: 'border-[#9BBCCE]',
    accentBg: 'bg-[#FFC22E]',
    accentHoverBg: 'hover:bg-[#E6A810]',
    accentText: 'text-[#2B2105]',
    navBg: 'bg-[#1C374D]',
    navActiveBg: 'bg-[#FFC22E]',
    navActiveText: 'text-[#2B2105]',
    lightBg: 'bg-[#F1EEE6]',
    lightText: 'text-[#1C374D]',
    lightBorder: 'border-[#DFD9CB]',
    logoSrc: '/images/typhoon-logo-salesperson.png',
  },
  PORTAL_USER: {
    role: 'PORTAL_USER',
    roleName: 'Portal user',
    tag: 'RP',
    subtitle: 'DISCOM and PM Surya Ghar portals',
    hex: {
      headerBg: '#1F6F78',        // 60% Ocean Teal
      headerGradient: 'linear-gradient(135deg, #288B96 0%, #1F6F78 55%, #16545B 100%)', // Deep ocean teal gradient
      headerBorder: '#17565D',
      headerTextColor: '#ffffff', // Crisp white on Ocean Teal
      headerSubtextColor: 'rgba(255, 255, 255, 0.85)',
      cardDarkBg: '#16545B',
      cardDarkGradient: 'linear-gradient(145deg, #227983 0%, #16545B 100%)',
      accentBg: '#FF5A4E',        // 10% Coral Red
      accentGradient: 'linear-gradient(135deg, #FF766C 0%, #FF5A4E 60%, #E63D31 100%)', // Vivid coral red
      accentShadow: '0 8px 24px -4px rgba(255, 90, 78, 0.45)',
      accentHoverBg: '#E63D31',
      accentTextColor: '#ffffff',
      navBg: '#16545B',
      navGradient: 'linear-gradient(180deg, #1F6F78 0%, #16545B 100%)',
      lightBg: '#F2EBDF',         // 30% Seashell White
      lightText: '#1F6F78',
      lightBorder: '#E2D5C3',
      logoSrc: '/images/typhoon-logo-portal.png',
    },
    headerBg: 'bg-[#1F6F78]',
    headerBorder: 'border-[#17565D]',
    accentBg: 'bg-[#FF5A4E]',
    accentHoverBg: 'hover:bg-[#E63D31]',
    accentText: 'text-white',
    navBg: 'bg-[#16545B]',
    navActiveBg: 'bg-[#FF5A4E]',
    navActiveText: 'text-white',
    lightBg: 'bg-[#F2EBDF]',
    lightText: 'text-[#1F6F78]',
    lightBorder: 'border-[#E2D5C3]',
    logoSrc: '/images/typhoon-logo-portal.png',
  },
  MATERIAL_MANAGER: {
    role: 'MATERIAL_MANAGER',
    roleName: 'Material manager',
    tag: 'SM',
    subtitle: 'Warehouse stock and delivery',
    hex: {
      headerBg: '#D8C3A0',        // 60% Desert Sand
      headerGradient: 'linear-gradient(135deg, #E2D1B3 0%, #D8C3A0 55%, #CBB38B 100%)', // Warm desert sand sheen
      headerBorder: '#BFA77F',
      headerTextColor: '#5B5E3C', // 30% Olive Drab
      headerSubtextColor: 'rgba(91, 94, 60, 0.78)',
      cardDarkBg: '#5B5E3C',      // 30% Olive Drab
      cardDarkGradient: 'linear-gradient(145deg, #6C7047 0%, #5B5E3C 60%, #484B30 100%)',
      accentBg: '#FFD21F',        // 10% Signal Yellow
      accentGradient: 'linear-gradient(135deg, #FFE052 0%, #FFD21F 60%, #E6B800 100%)', // Bright signal yellow
      accentShadow: '0 8px 24px -4px rgba(255, 210, 31, 0.45)',
      accentHoverBg: '#E6B800',
      accentTextColor: '#2D2E1C', // Dark olive for readability on yellow
      navBg: '#5B5E3C',           // 30% Olive Drab
      navGradient: 'linear-gradient(180deg, #6C7047 0%, #5B5E3C 100%)',
      lightBg: '#FAF6F0',
      lightText: '#5B5E3C',
      lightBorder: '#E5D9C4',
      logoSrc: '/images/typhoon-logo-material.png',
    },
    headerBg: 'bg-[#D8C3A0]',
    headerBorder: 'border-[#BFA77F]',
    accentBg: 'bg-[#FFD21F]',
    accentHoverBg: 'hover:bg-[#E6B800]',
    accentText: 'text-[#2D2E1C]',
    navBg: 'bg-[#5B5E3C]',
    navActiveBg: 'bg-[#FFD21F]',
    navActiveText: 'text-[#2D2E1C]',
    lightBg: 'bg-[#FAF6F0]',
    lightText: 'text-[#5B5E3C]',
    lightBorder: 'border-[#E5D9C4]',
    logoSrc: '/images/typhoon-logo-material.png',
  },
  INSTALLATION_TEAM: {
    role: 'INSTALLATION_TEAM',
    roleName: 'Installation team',
    tag: 'IT',
    subtitle: 'Rooftop installation jobs',
    hex: {
      headerBg: '#F2F2EF',        // 60% Cloud White
      headerGradient: 'linear-gradient(135deg, #FAFAFA 0%, #F2F2EF 55%, #E5E5DF 100%)', // Clean cloud white sheen
      headerBorder: '#D9D9D2',
      headerTextColor: '#2D2D29', // Deep charcoal-sand contrast
      headerSubtextColor: 'rgba(45, 45, 41, 0.75)',
      cardDarkBg: '#3D3629',      // Deep sand dune container
      cardDarkGradient: 'linear-gradient(145deg, #574D3A 0%, #3D3629 100%)',
      accentBg: '#2350FF',        // 10% Cobalt Flash
      accentGradient: 'linear-gradient(135deg, #466DFF 0%, #2350FF 60%, #123FE6 100%)', // High energy cobalt flash
      accentShadow: '0 8px 24px -4px rgba(35, 80, 255, 0.45)',
      accentHoverBg: '#123FE6',
      accentTextColor: '#ffffff',
      navBg: '#3D3629',           // Deep sand dune dock
      navGradient: 'linear-gradient(180deg, #4A4130 0%, #302A20 100%)',
      lightBg: '#FAF9F7',         // 30% Sand Dune tint
      lightText: '#2D2D29',
      lightBorder: '#E5DEC9',
      logoSrc: '/images/typhoon-logo-install.png',
    },
    headerBg: 'bg-[#F2F2EF]',
    headerBorder: 'border-[#D9D9D2]',
    accentBg: 'bg-[#2350FF]',
    accentHoverBg: 'hover:bg-[#123FE6]',
    accentText: 'text-white',
    navBg: 'bg-[#3D3629]',
    navActiveBg: 'bg-[#2350FF]',
    navActiveText: 'text-white',
    lightBg: 'bg-[#FAF9F7]',
    lightText: 'text-[#2D2D29]',
    lightBorder: 'border-[#E5DEC9]',
    logoSrc: '/images/typhoon-logo-install.png',
  },
  ACCOUNTANT: {
    role: 'ACCOUNTANT',
    roleName: 'Accountant',
    tag: 'MA',
    subtitle: 'Payment milestones and receipts',
    hex: {
      headerBg: '#F2F1EE',        // 60% Chalk White
      headerGradient: 'linear-gradient(135deg, #FAF9F7 0%, #F2F1EE 55%, #E3E1DC 100%)', // Chalk white matte sheen
      headerBorder: '#D6D4CD',
      headerTextColor: '#121214', // 30% Onyx Black
      headerSubtextColor: 'rgba(18, 18, 20, 0.75)',
      cardDarkBg: '#121214',      // 30% Onyx Black
      cardDarkGradient: 'linear-gradient(145deg, #202024 0%, #121214 60%, #0A0A0C 100%)',
      accentBg: '#7B4DFF',        // 10% Electric Violet
      accentGradient: 'linear-gradient(135deg, #966FFF 0%, #7B4DFF 60%, #6330E6 100%)', // Vibrant electric violet
      accentShadow: '0 8px 24px -4px rgba(123, 77, 255, 0.45)',
      accentHoverBg: '#6330E6',
      accentTextColor: '#ffffff',
      navBg: '#121214',           // 30% Onyx Black
      navGradient: 'linear-gradient(180deg, #202024 0%, #121214 100%)',
      lightBg: '#F9F9F8',
      lightText: '#121214',
      lightBorder: '#E2E0D8',
      logoSrc: '/images/typhoon-logo-accountant.png',
    },
    headerBg: 'bg-[#F2F1EE]',
    headerBorder: 'border-[#D6D4CD]',
    accentBg: 'bg-[#7B4DFF]',
    accentHoverBg: 'hover:bg-[#6330E6]',
    accentText: 'text-white',
    navBg: 'bg-[#121214]',
    navActiveBg: 'bg-[#7B4DFF]',
    navActiveText: 'text-white',
    lightBg: 'bg-[#F9F9F8]',
    lightText: 'text-[#121214]',
    lightBorder: 'border-[#E2E0D8]',
    logoSrc: '/images/typhoon-logo-accountant.png',
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
  if (!role) return ROLE_THEMES.OPS_MANAGER;
  const upper = role.toUpperCase();
  if (ROLE_THEMES[upper]) return ROLE_THEMES[upper];
  if (upper.includes('MATERIAL')) return ROLE_THEMES.MATERIAL_MANAGER;
  if (upper.includes('INSTALL')) return ROLE_THEMES.INSTALLATION_TEAM;
  if (upper.includes('ACCOUNT')) return ROLE_THEMES.ACCOUNTANT;
  if (upper.includes('PORTAL')) return ROLE_THEMES.PORTAL_USER;
  if (upper.includes('SALES')) return ROLE_THEMES.SALESPERSON;
  if (upper.includes('OPS') || upper.includes('OPERAT') || upper.includes('CONTROL')) return ROLE_THEMES.OPS_MANAGER;
  return ROLE_THEMES.OPS_MANAGER;
}
