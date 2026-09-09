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
      boxShadow: {
        neon: '0 0 32px rgba(34, 211, 238, 0.18)',
        green: '0 0 38px rgba(110, 231, 183, 0.16)',
      },
      keyframes: {
        lumenFloat: {
          '0%, 100%': { transform: 'translateX(-50%) translateY(0px) rotate(-0.5deg)' },
          '50%': { transform: 'translateX(-50%) translateY(-10px) rotate(0.8deg)' },
        },
        lumenBreathe: {
          '0%, 100%': { transform: 'translate(-50%, -50%) scale(0.96)', opacity: '0.35' },
          '50%': { transform: 'translate(-50%, -50%) scale(1.04)', opacity: '0.75' },
        },
        lumenBlink: {
          '0%, 42%, 46%, 100%': { transform: 'scaleY(1)' },
          '44%': { transform: 'scaleY(0.08)' },
        },
        lumenWave: {
          '0%, 100%': { transform: 'rotate(-17deg)' },
          '50%': { transform: 'rotate(-36deg)' },
        },
        lumenWaveFast: {
          '0%, 100%': { transform: 'rotate(-12deg)' },
          '25%': { transform: 'rotate(-48deg)' },
          '50%': { transform: 'rotate(-8deg)' },
          '75%': { transform: 'rotate(-42deg)' },
        },
        lumenFlame: {
          '0%, 100%': { transform: 'rotate(-24deg) scaleY(0.94)' },
          '50%': { transform: 'rotate(-17deg) scaleY(1.08) translateY(-2px)' },
        },
        lumenFlameMain: {
          '0%, 100%': { transform: 'rotate(-4deg) scaleY(0.95)' },
          '50%': { transform: 'rotate(5deg) scaleY(1.1) translateY(-3px)' },
        },
        lumenFlameDelayed: {
          '0%, 100%': { transform: 'rotate(21deg) scaleY(1.03)' },
          '50%': { transform: 'rotate(13deg) scaleY(0.92) translateY(2px)' },
        },
        lumenFlameCore: {
          '0%, 100%': { transform: 'rotate(2deg) scaleY(0.86)', opacity: '0.72' },
          '50%': { transform: 'rotate(-4deg) scaleY(1.08)', opacity: '1' },
        },
        lumenOrbit: {
          '0%, 100%': { transform: 'translate(0, 0)', opacity: '0.3' },
          '50%': { transform: 'translate(10px, -18px)', opacity: '1' },
        },
        lumenOrbitDelayed: {
          '0%, 100%': { transform: 'translate(0, 0)', opacity: '0.8' },
          '50%': { transform: 'translate(-12px, 15px)', opacity: '0.25' },
        },
      },
      animation: {
        'lumen-float': 'lumenFloat 4.2s ease-in-out infinite',
        'lumen-breathe': 'lumenBreathe 3.4s ease-in-out infinite',
        'lumen-blink': 'lumenBlink 3.8s ease-in-out infinite',
        'lumen-wave': 'lumenWave 1.45s ease-in-out infinite',
        'lumen-wave-fast': 'lumenWaveFast 0.7s ease-in-out infinite',
        'lumen-flame': 'lumenFlame 1.05s ease-in-out infinite',
        'lumen-flame-main': 'lumenFlameMain 0.82s ease-in-out infinite',
        'lumen-flame-delayed': 'lumenFlameDelayed 1.15s ease-in-out infinite',
        'lumen-flame-core': 'lumenFlameCore 0.66s ease-in-out infinite',
        'lumen-orbit': 'lumenOrbit 3.8s ease-in-out infinite',
        'lumen-orbit-delayed': 'lumenOrbitDelayed 4.4s ease-in-out infinite 0.7s',
      },
    },
  },
  plugins: [],
} satisfies Config
