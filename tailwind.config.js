/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
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
        serif: ['Georgia', 'Cambria', 'Times New Roman', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

