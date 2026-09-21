'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';

/**
 * A quiet, grown-up cake: one tier, a hairline ribbon, a single taper.
 * No piping, no sprinkles — the only colour in the scene is the flame.
 */

type CandleProps = {
  lit: boolean;
  /** Set once the candle has been blown out, to release the smoke. */
  blown: boolean;
  className?: string;
};

const SMOKE_PATHS = [
  'M130 92 C 124 76, 136 68, 129 52 C 124 40, 132 32, 130 22',
  'M130 92 C 138 78, 128 66, 136 54 C 142 44, 134 36, 138 26',
  'M130 92 C 120 80, 128 70, 120 58 C 114 48, 122 40, 118 30',
];

export default function Candle({ lit, blown, className = '' }: CandleProps) {
  const reduced = useReducedMotion();

  return (
    <svg
      viewBox="0 0 260 300"
      className={className}
      role="img"
      aria-label={lit ? 'A birthday cake with one lit candle' : 'A birthday cake, candle blown out'}
    >
      <defs>
        <linearGradient id="cake-body" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#242935" />
          <stop offset="60%" stopColor="#1A1E27" />
          <stop offset="100%" stopColor="#12151B" />
        </linearGradient>
        <linearGradient id="cake-top" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#333A4A" />
          <stop offset="100%" stopColor="#242A37" />
        </linearGradient>
        <linearGradient id="plate" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#161A22" />
          <stop offset="50%" stopColor="#222734" />
          <stop offset="100%" stopColor="#161A22" />
        </linearGradient>
        <linearGradient id="candle" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#C9BC9F" />
          <stop offset="45%" stopColor="#E9D9BE" />
          <stop offset="100%" stopColor="#B7AA8E" />
        </linearGradient>
        <radialGradient id="flame" cx="50%" cy="62%" r="60%">
          <stop offset="0%" stopColor="#FFFDF6" />
          <stop offset="35%" stopColor="#F7E3B5" />
          <stop offset="75%" stopColor="#E9A860" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#E9A860" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="halo" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#F3D9A8" stopOpacity="0.55" />
          <stop offset="60%" stopColor="#E9A860" stopOpacity="0.16" />
          <stop offset="100%" stopColor="#E9A860" stopOpacity="0" />
        </radialGradient>
        <filter id="soften" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="6" />
        </filter>
      </defs>

      {/* Candlelight in the room */}
      <motion.circle
        cx="130"
        cy="86"
        r="86"
        fill="url(#halo)"
        animate={{ opacity: lit ? 1 : 0, scale: lit ? 1 : 0.86 }}
        style={{ originX: '130px', originY: '86px' }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      />

      {/* Shadow under the plate */}
      <ellipse cx="130" cy="256" rx="104" ry="12" fill="#05060A" opacity="0.7" filter="url(#soften)" />

      {/* Plate */}
      <ellipse cx="130" cy="248" rx="98" ry="13" fill="url(#plate)" />
      <ellipse
        cx="130"
        cy="248"
        rx="98"
        ry="13"
        fill="none"
        stroke="#F5F5F5"
        strokeOpacity="0.09"
      />

      {/* Cake */}
      <ellipse cx="130" cy="240" rx="72" ry="13" fill="#12151B" />
      <rect x="58" y="158" width="144" height="82" fill="url(#cake-body)" />
      <ellipse cx="130" cy="158" rx="72" ry="13" fill="url(#cake-top)" />
      <ellipse cx="130" cy="158" rx="72" ry="13" fill="none" stroke="#F5F5F5" strokeOpacity="0.1" />

      {/* Ribbon */}
      <path d="M58 206 H202" stroke="#B0A4DA" strokeOpacity="0.4" strokeWidth="1.25" />
      <path d="M58 211 H202" stroke="#E9D9BE" strokeOpacity="0.22" strokeWidth="0.75" />

      {/* Quietly embossed age */}
      <text
        x="130"
        y="192"
        textAnchor="middle"
        fontFamily="var(--font-display)"
        fontSize="30"
        fill="#F5F5F5"
        fillOpacity="0.09"
        letterSpacing="2"
      >
        23
      </text>

      {/* Pool of light on the top surface */}
      <motion.ellipse
        cx="130"
        cy="158"
        rx="54"
        ry="9"
        fill="#F3D9A8"
        animate={{ opacity: lit ? 0.16 : 0.03 }}
        transition={{ duration: 0.9 }}
      />

      {/* Candle */}
      <rect x="124" y="98" width="12" height="62" rx="3" fill="url(#candle)" />
      <ellipse cx="130" cy="98" rx="6" ry="2" fill="#F1E6D2" fillOpacity="0.9" />
      <path d="M130 98 V 90" stroke="#3A3F4B" strokeWidth="2" strokeLinecap="round" />

      {/* Flame */}
      <AnimatePresence>
        {lit && (
          <motion.g
            key="flame"
            style={{ originX: '130px', originY: '90px' }}
            initial={{ opacity: 0, scale: 0.4 }}
            animate={
              reduced
                ? { opacity: 1, scale: 1 }
                : {
                    opacity: [1, 0.92, 1, 0.95, 1],
                    scale: [1, 1.05, 0.97, 1.03, 1],
                    x: [0, 0.6, -0.5, 0.3, 0],
                  }
            }
            exit={{ opacity: 0, scale: 0.15, y: 6, transition: { duration: 0.4 } }}
            transition={
              reduced
                ? { duration: 0.3 }
                : { duration: 2.4, repeat: Infinity, ease: 'easeInOut' }
            }
          >
            <circle cx="130" cy="74" r="20" fill="url(#halo)" />
            <path
              d="M130 56 C 140 70, 141 80, 130 90 C 119 80, 120 70, 130 56 Z"
              fill="url(#flame)"
            />
            <path
              d="M130 68 C 135 76, 135 82, 130 88 C 125 82, 125 76, 130 68 Z"
              fill="#FFFBF0"
              fillOpacity="0.75"
            />
          </motion.g>
        )}
      </AnimatePresence>

      {/* Smoke, once the flame is out */}
      {blown && !reduced && (
        <g>
          {SMOKE_PATHS.map((path, index) => (
            <motion.path
              key={path}
              d={path}
              fill="none"
              stroke="#A5A7AE"
              strokeWidth={index === 0 ? 1.6 : 1}
              strokeLinecap="round"
              initial={{ opacity: 0, pathLength: 0, y: 0 }}
              animate={{ opacity: [0, 0.35, 0], pathLength: 1, y: -26 }}
              transition={{
                duration: 2.6,
                delay: index * 0.22,
                ease: 'easeOut',
              }}
            />
          ))}
        </g>
      )}
    </svg>
  );
}
