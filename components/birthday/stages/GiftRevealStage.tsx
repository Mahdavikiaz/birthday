'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { Package } from 'lucide-react';

import birthdayConfig from '@/config/birthday';
import StageShell from '@/components/birthday/ui/StageShell';
import JourneyButton from '@/components/birthday/ui/JourneyButton';
import { EASE, lineVariants } from '@/lib/motion';

export default function GiftRevealStage({ onNext }: { onNext: () => void }) {
  const { gift, tracking } = birthdayConfig;
  const reduced = useReducedMotion();

  return (
    <StageShell>
      <motion.h2
        variants={lineVariants}
        className="font-display text-[clamp(1.8rem,7vw,2.6rem)] leading-tight tracking-[-0.01em]"
      >
        {gift.heading}
      </motion.h2>

      <motion.div
        initial={{ opacity: 0, y: 20, rotate: -0.6 }}
        animate={{ opacity: 1, y: 0, rotate: -0.6 }}
        transition={{ duration: 0.8, delay: 0.35, ease: EASE }}
        className="card-surface relative mt-9 rounded-[3px] px-6 py-8"
      >
        {/* Corner ticks, like a printed label. */}
        <span className="absolute left-2 top-2 h-3 w-3 border-l border-t border-white/15" />
        <span className="absolute right-2 top-2 h-3 w-3 border-r border-t border-white/15" />
        <span className="absolute bottom-2 left-2 h-3 w-3 border-b border-l border-white/15" />
        <span className="absolute bottom-2 right-2 h-3 w-3 border-b border-r border-white/15" />

        <div className="flex items-baseline justify-between gap-4">
          <p className="text-[0.7rem] uppercase tracking-[0.18em] text-mist">{gift.cardTitle}</p>
          <p className="font-mono text-[0.65rem] tracking-wider text-dusk">{tracking.courier}</p>
        </div>

        <div className="relative my-9 flex justify-center">
          <motion.div
            aria-hidden="true"
            className="absolute h-24 w-24 rounded-full bg-lilac/20 blur-2xl"
            animate={reduced ? { opacity: 0.6 } : { opacity: [0.35, 0.7, 0.35] }}
            transition={{ duration: 4.5, repeat: reduced ? 0 : Infinity, ease: 'easeInOut' }}
          />
          <Package
            className="relative h-14 w-14 text-lilac-soft"
            strokeWidth={0.9}
            aria-hidden="true"
          />
        </div>

        <div className="border-t border-dashed border-white/[0.09] pt-5">
          <div className="flex items-center gap-2.5">
            <motion.span
              aria-hidden="true"
              className="block h-1.5 w-1.5 rounded-full bg-lilac"
              animate={reduced ? { opacity: 1 } : { opacity: [1, 0.25, 1] }}
              transition={{ duration: 2.2, repeat: reduced ? 0 : Infinity, ease: 'easeInOut' }}
            />
            <p className="text-[0.78rem] uppercase tracking-[0.16em] text-paper">
              {gift.cardStatus}
            </p>
          </div>
          <p className="mt-2 text-[0.9rem] text-mist">{gift.cardHint}</p>
        </div>
      </motion.div>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.9, ease: EASE }}
        className="mt-9 text-[0.95rem] leading-relaxed text-paper/80"
      >
        {gift.description}
      </motion.p>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.15, ease: EASE }}
        className="mt-3 text-[0.95rem] leading-relaxed text-mist"
      >
        {gift.secondary}
      </motion.p>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 1.45, ease: EASE }}
        className="mt-10"
      >
        <JourneyButton onClick={onNext}>{gift.cta}</JourneyButton>
      </motion.div>
    </StageShell>
  );
}
