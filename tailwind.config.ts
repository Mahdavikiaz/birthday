import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './config/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#08090D',
          900: '#0D0F14',
          800: '#111318',
          700: '#171A21',
          600: '#1F232C',
          500: '#2A2F3A',
        },
        paper: '#F5F5F5',
        mist: '#A5A7AE',
        dusk: '#6E717A',
        lilac: {
          DEFAULT: '#B0A4DA',
          soft: '#C8BFE8',
          deep: '#6F63A0',
        },
        ember: '#E9D9BE',
      },
      fontFamily: {
        display: ['var(--font-display)', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'SF Mono', 'Menlo', 'monospace'],
      },
      fontSize: {
        micro: ['0.6875rem', { lineHeight: '1rem', letterSpacing: '0.16em' }],
      },
      maxWidth: {
        column: '34rem',
        wide: '44rem',
      },
      transitionTimingFunction: {
        journey: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      keyframes: {
        drift: {
          '0%, 100%': { transform: 'translate3d(0, 0, 0) scale(1)' },
          '50%': { transform: 'translate3d(2%, -3%, 0) scale(1.08)' },
        },
        breathe: {
          '0%, 100%': { opacity: '0.35' },
          '50%': { opacity: '0.7' },
        },
        flicker: {
          '0%, 100%': { transform: 'scale(1) translateY(0)', opacity: '1' },
          '25%': { transform: 'scale(1.06, 0.97) translateY(-0.5px)', opacity: '0.94' },
          '50%': { transform: 'scale(0.96, 1.05) translateY(0.5px)', opacity: '1' },
          '75%': { transform: 'scale(1.03, 0.99) translateY(-0.3px)', opacity: '0.9' },
        },
      },
      animation: {
        drift: 'drift 28s ease-in-out infinite',
        breathe: 'breathe 6s ease-in-out infinite',
        flicker: 'flicker 1.6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};

export default config;
