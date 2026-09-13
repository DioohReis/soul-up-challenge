import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    screens: {
      sm: '480px',
      md: '768px',
      lg: '992px',
      xl: '1200px',
      '2xl': '1440px',
    },
    extend: {
      colors: {
        soul: {
          navy: '#071A47',
          deep: '#04122E',
          blue: '#1F5FE0',
          azure: '#338BF2',
          sky: '#5CC8FF',
          ice: '#DFF5FF',
          mist: '#EAF4FF',
          cloud: '#F6FAFF',
        },
      },
      boxShadow: {
        neon: '0 0 32px rgba(34, 211, 238, 0.18)',
        green: '0 0 38px rgba(110, 231, 183, 0.16)',
      },
      keyframes: {
        nexoChatPulse: {
          '0%, 100%': { opacity: '0.3' },
          '50%': { opacity: '1' },
        },
        lumenFloat: {
          '0%, 100%': { transform: 'translateY(0px) rotate(-0.4deg)' },
          '50%': { transform: 'translateY(-9px) rotate(0.4deg)' },
        },
        lumenBlink: {
          '0%, 46%, 49%, 100%': { transform: 'scaleY(1)' },
          '47.5%': { transform: 'scaleY(0.08)' },
        },
        lumenHalo: {
          '0%, 100%': { transform: 'translate(-50%, -50%) scale(0.94)', opacity: '0.25' },
          '50%': { transform: 'translate(-50%, -50%) scale(1.05)', opacity: '0.65' },
        },
        lumenHaloSlow: {
          '0%, 100%': { transform: 'translate(-50%, -50%) scale(1)', opacity: '0.12' },
          '50%': { transform: 'translate(-50%, -50%) scale(1.08)', opacity: '0.35' },
        },
        lumenEnergy: {
          '0%, 100%': { transform: 'translateY(0px) scaleY(0.96)' },
          '50%': { transform: 'translateY(-3px) scaleY(1.05)' },
        },
        lumenCore: {
          '0%, 100%': { opacity: '0.72', transform: 'scale(0.94)' },
          '50%': { opacity: '1', transform: 'scale(1.06)' },
        },
        lumenWave: {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '25%': { transform: 'rotate(-7deg)' },
          '50%': { transform: 'rotate(5deg)' },
          '75%': { transform: 'rotate(-5deg)' },
        },
        lumenShadow: {
          '0%, 100%': { transform: 'scaleX(0.92)', opacity: '0.12' },
          '50%': { transform: 'scaleX(1.06)', opacity: '0.22' },
        },
        nexoSignal: {
          '0%, 100%': { opacity: '0.38', transform: 'scale(0.92)' },
          '50%': { opacity: '1', transform: 'scale(1.08)' },
        },
      },
      animation: {
        'nexo-chat-pulse': 'nexoChatPulse 1s ease-in-out infinite',
        'lumen-float': 'lumenFloat 4.6s ease-in-out infinite',
        'lumen-blink': 'lumenBlink 4.8s ease-in-out infinite',
        'lumen-halo': 'lumenHalo 3.2s ease-in-out infinite',
        'lumen-halo-slow': 'lumenHaloSlow 5.2s ease-in-out infinite',
        'lumen-energy': 'lumenEnergy 1.6s ease-in-out infinite',
        'lumen-core': 'lumenCore 2.4s ease-in-out infinite',
        'lumen-wave': 'lumenWave 0.7s ease-in-out',
        'lumen-shadow': 'lumenShadow 4.6s ease-in-out infinite',
        'nexo-signal': 'nexoSignal 1.35s ease-in-out infinite',
      },
    },
  },
  plugins: [],
} satisfies Config
