/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  safelist: [
    'bg-[#1e1b4b]', 'border-[#2e2a72]', 'bg-[#7c3aed]', 'text-[#6d28d9]', 'border-[#ddd6fe]', 'bg-[#f5f3ff]',
    'bg-[#0b192c]', 'border-[#1b2b42]', 'bg-[#f59e0b]', 'text-[#0b192c]', 'border-[#fde68a]', 'bg-[#fffbeb]',
    'bg-[#0a3d7c]', 'border-[#124d99]', 'bg-[#00a3e0]', 'text-[#0369a1]', 'border-[#bae6fd]', 'bg-[#f0f9ff]',
    'bg-[#063a42]', 'border-[#0a4d57]', 'bg-[#00bfa5]', 'text-[#063a42]', 'border-[#99f6e4]', 'bg-[#f0fdfa]',
    'bg-[#36451e]', 'border-[#4a5e29]', 'bg-[#a3e635]', 'text-[#2e3b18]', 'border-[#d9f99d]', 'bg-[#f7fee7]',
    'bg-[#3e1c0d]', 'border-[#542813]', 'bg-[#f97316]', 'text-[#c2410c]', 'border-[#fed7aa]', 'bg-[#fff7ed]',
    'bg-[#3d1020]', 'border-[#571930]', 'bg-[#e1144a]', 'text-[#be123c]', 'border-[#fecdd3]', 'bg-[#fff1f2]',
    'bg-[#1c1e21]', 'border-[#2d3238]', 'bg-[#facc15]', 'text-[#1c1e21]', 'border-[#fef08a]', 'bg-[#fefce8]',
    'bg-[#064e3b]', 'border-[#0a664e]', 'bg-[#10b981]', 'text-[#047857]', 'border-[#a7f3d0]', 'bg-[#ecfdf5]',
  ],
  theme: {
    extend: {
      colors: {
        typhoon: {
          navy: '#0E2038',
          'navy-light': '#1A3252',
          'navy-dark': '#081424',
          gold: '#F5A623',
          'gold-light': '#FFBE53',
          'gold-dark': '#D4880E',
          sand: '#FAF6F0',
          'sand-dark': '#F0EBE1',
          border: '#EAE5DD',
          muted: '#6B7280',
          card: '#FFFFFF',
          badge: {
            urgent: '#FFF1E5',
            active: '#F3F4F6',
            success: '#E6F9ED',
            overdue: '#FEE2E2',
          },
        },
      },
      borderRadius: {
        '2xl': '20px',
        '3xl': '28px',
      },
      boxShadow: {
        soft: '0 4px 20px -2px rgba(14, 32, 56, 0.06), 0 2px 6px -1px rgba(14, 32, 56, 0.04)',
        floating: '0 8px 30px rgba(14, 32, 56, 0.25)',
      },
      fontFamily: {
        serif: ['"Newsreader"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      fontWeight: {
        light: '300',
        normal: '400',
        medium: '500',
        semibold: '550',
        bold: '550',
        extrabold: '600',
        black: '600',
      },
    },
  },
  plugins: [],
};
