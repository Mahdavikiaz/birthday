'use client';

import { motion, useReducedMotion } from 'framer-motion';

import type { StageId } from '@/lib/journey';

/**
 * Two light washes and a handful of motes. The washes shift position and
 * weight per stage, so the room quietly changes temperature as the journey
 * moves — cool lavender for the chapters, warm candlelight at the cake.
 */

type Tone = {
  lilac: { x: string; y: string; scale: number; opacity: number };
  ember: { x: string; y: string; scale: number; opacity: number };
};

const TONES: Record<StageId, Tone> = {
  landing: {
    lilac: { x: '-18%', y: '-22%', scale: 1, opacity: 0.5 },
    ember: { x: '30%', y: '40%', scale: 0.9, opacity: 0.12 },
  },
  chapter1: {
    lilac: { x: '-30%', y: '-10%', scale: 1.05, opacity: 0.42 },
    ember: { x: '35%', y: '35%', scale: 0.85, opacity: 0.1 },
  },
  chapter2: {
    lilac: { x: '22%', y: '-18%', scale: 1.1, opacity: 0.4 },
    ember: { x: '-25%', y: '30%', scale: 0.9, opacity: 0.12 },
  },
  chapter3: {
    lilac: { x: '0%', y: '0%', scale: 0.8, opacity: 0.55 },
    ember: { x: '0%', y: '10%', scale: 0.7, opacity: 0.2 },
  },
  cake: {
    lilac: { x: '-10%', y: '-30%', scale: 0.9, opacity: 0.22 },
    ember: { x: '0%', y: '-5%', scale: 0.85, opacity: 0.5 },
  },
  wishes: {
    lilac: { x: '-15%', y: '-25%', scale: 1.1, opacity: 0.45 },
    ember: { x: '20%', y: '25%', scale: 0.9, opacity: 0.22 },
  },
  oneMoreThing: {
    lilac: { x: '25%', y: '-15%', scale: 0.95, opacity: 0.38 },
    ember: { x: '-20%', y: '25%', scale: 0.9, opacity: 0.18 },
  },
  gift: {
    lilac: { x: '-5%', y: '-20%', scale: 1, opacity: 0.4 },
    ember: { x: '5%', y: '20%', scale: 1, opacity: 0.26 },
  },
  tracking: {
    lilac: { x: '0%', y: '-35%', scale: 1.25, opacity: 0.32 },
    ember: { x: '15%', y: '45%', scale: 0.8, opacity: 0.12 },
  },
  complete: {
    lilac: { x: '-20%', y: '-25%', scale: 1.1, opacity: 0.45 },
    ember: { x: '20%', y: '20%', scale: 1, opacity: 0.3 },
  },
};

/** Fixed, not random: the same motes every render, no hydration surprises. */
const MOTES = [
  { left: '12%', top: '22%', size: 2, duration: 26, delay: 0 },
  { left: '78%', top: '16%', size: 1.5, duration: 32, delay: 4 },
  { left: '32%', top: '68%', size: 2.5, duration: 29, delay: 8 },
  { left: '88%', top: '58%', size: 1.5, duration: 35, delay: 2 },
  { left: '56%', top: '82%', size: 2, duration: 30, delay: 11 },
  { left: '22%', top: '46%', size: 1.5, duration: 38, delay: 6 },
  { left: '66%', top: '34%', size: 2, duration: 27, delay: 14 },
  { left: '44%', top: '12%', size: 1.5, duration: 33, delay: 9 },
  { left: '8%', top: '76%', size: 2, duration: 31, delay: 17 },
  { left: '92%', top: '86%', size: 1.5, duration: 36, delay: 3 },
];

export default function BackgroundEffects({ stage }: { stage: StageId }) {
  const reduced = useReducedMotion();
  const tone = TONES[stage] ?? TONES.landing;

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      <motion.div
        className="absolute left-1/2 top-1/2 h-[70vmax] w-[70vmax] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[90px]"
        style={{
          background:
            'radial-gradient(circle, rgba(111,99,160,0.55) 0%, rgba(111,99,160,0.18) 42%, rgba(111,99,160,0) 70%)',
        }}
        animate={{
          x: tone.lilac.x,
          y: tone.lilac.y,
          scale: tone.lilac.scale,
          opacity: tone.lilac.opacity,
        }}
        transition={{ duration: reduced ? 0.2 : 1.6, ease: [0.22, 1, 0.36, 1] }}
      />

      <motion.div
        className="absolute left-1/2 top-1/2 h-[55vmax] w-[55vmax] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[100px]"
        style={{
          background:
            'radial-gradient(circle, rgba(233,217,190,0.4) 0%, rgba(233,217,190,0.12) 45%, rgba(233,217,190,0) 72%)',
        }}
        animate={{
          x: tone.ember.x,
          y: tone.ember.y,
          scale: tone.ember.scale,
          opacity: tone.ember.opacity,
        }}
        transition={{ duration: reduced ? 0.2 : 1.8, ease: [0.22, 1, 0.36, 1] }}
      />

      {!reduced && (
        <div className="absolute inset-0">
          {MOTES.map((mote, index) => (
            <span
              key={index}
              className="absolute rounded-full bg-paper/50"
              style={{
                left: mote.left,
                top: mote.top,
                width: mote.size,
                height: mote.size,
                animation: `mote-float ${mote.duration}s ease-in-out ${mote.delay}s infinite`,
                opacity: 0.25,
              }}
            />
          ))}
        </div>
      )}

      {/* Vignette keeps the edges dark so the type always sits on quiet ground. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(120% 90% at 50% 45%, rgba(8,9,13,0) 35%, rgba(8,9,13,0.75) 100%)',
        }}
      />

    </div>
  );
}
