/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#0A1526',
          900: '#10233F', // Primary Color
          800: '#162C4E',
          700: '#1E3B65',
          600: '#2A4E82',
        },
        slateBlue: {
          DEFAULT: '#334A68', // Secondary Color
          300: '#647D9E',
          400: '#4A6890',
          500: '#334A68',
          600: '#25374E',
          700: '#182434',
        },
        engBlue: {
          50: '#EBF3FB',
          100: '#D7E7F8',
          500: '#2878D0', // Engineering Blue Accent
          600: '#1F61A9',
          700: '#184C84',
        },
        neutralBg: '#F4F6F9', // Soft Neutral Gray
        amberWarn: {
          50: '#FFFBEB',
          500: '#F59E0B',
          600: '#D97706',
        },
        alarmRed: {
          50: '#FEF2F2',
          500: '#EF4444',
          600: '#DC2626',
        },
        verifiedGreen: {
          50: '#ECFDF5',
          500: '#10B981',
          600: '#059669',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace'],
        arabic: ['Cairo', 'Noto Sans Arabic', 'Segoe UI', 'Tahoma', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
