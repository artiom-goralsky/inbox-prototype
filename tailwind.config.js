const compassPreset = require('@circleco/compass/tailwind/preset');

/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [compassPreset],
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './index.html',
    './node_modules/@circleco/compass/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        border: 'var(--border)',
        ring: 'var(--ring)',
        background: 'var(--background)',
        foreground: 'var(--foreground)',
      },
      // colors: {
      //   primary: {
      //     50: '#f0f9ff',
      //     100: '#e0f2fe',
      //     200: '#bae6fd',
      //     300: '#7dd3fc',
      //     400: '#38bdf8',
      //     500: '#0ea5e9',
      //     600: '#0284c7',
      //     700: '#0369a1',
      //     800: '#075985',
      //     900: '#0c4a6e',
      //   },
      //   dark: {
      //     50: '#f8fafc',
      //     100: '#f1f5f9',
      //     200: '#e2e8f0',
      //     300: '#cbd5e1',
      //     400: '#94a3b8',
      //     500: '#64748b',
      //     600: '#475569',
      //     700: '#334155',
      //     800: '#1e293b',
      //     900: '#0f172a',
      //   },
      //   'header-bg': '#111138',
      //   'header-dropdown': '#2a2a3e',
      //   'header-search': '#0f0f1a',
      // },
      // fontFamily: {
      //   sans: ['Inter', 'system-ui', 'sans-serif'],
      // },
      // boxShadow: {
      //   '2xs': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      //   xs: '0 1px 4px 0 rgba(0, 0, 0, 0.03), 0 1px 4px 0 rgba(0, 0, 0, 0.03)',
      //   main: '0 4px 16px -8px rgba(0, 0, 0, 0.1), 0 3px 12px -4px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(0, 0, 0, 0.04)',
      // },
      animation: {
        fadeIn: 'fadeIn 0.3s ease-out',
        fadeOut: 'fadeOut 0.3s ease-in',
        modalSlideIn: 'modalSlideIn 0.3s ease-out',
        modalSlideOut: 'modalSlideOut 0.3s ease-in',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeOut: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        modalSlideIn: {
          '0%': { opacity: '0', transform: 'scale(0.95) translateY(-10px)' },
          '100%': { opacity: '1', transform: 'scale(1) translateY(0)' },
        },
        modalSlideOut: {
          '0%': { opacity: '1', transform: 'scale(1) translateY(0)' },
          '100%': { opacity: '0', transform: 'scale(0.95) translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
};
