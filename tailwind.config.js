/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#111827',
        graphite: '#1F2937',
        canvas: '#F8FAFC',
        body: '#334155',
        muted: '#64748B',
        line: '#E2E8F0',
        accent: { DEFAULT: '#D97706', hover: '#B45309', soft: '#FFF7ED' },
        success: '#166534'
      },
      fontFamily: { sans: ['Inter', 'Noto Sans SC', 'sans-serif'] },
      boxShadow: { lift: '0 20px 50px -24px rgba(15,23,42,.28)' },
      keyframes: {
        'fade-in-down': {
          '0%': { opacity: '0', transform: 'translateY(-8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        }
      },
      animation: {
        'fade-in-down': 'fade-in-down 0.2s ease-out'
      }
    }
  },
  plugins: []
};
