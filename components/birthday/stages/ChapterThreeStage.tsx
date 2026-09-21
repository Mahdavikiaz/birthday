'use client';

import { motion, useReducedMotion } from 'framer-motion';

import birthdayConfig from '@/config/birthday';
import StageShell from '@/components/birthday/ui/StageShell';
import JourneyButton from '@/components/birthday/ui/JourneyButton';
import { EASE } from '@/lib/motion';
import useDelayedFlag from '@/lib/useDelayedFlag';

export default function ChapterThreeStage({ onNext }: { onNext: () => void }) {
  const { chapterThree } = birthdayConfig.chapters;
  const reduced = useReducedMotion();
  const ready = useDelayedFlag(1800);

  return (
    <StageShell>
      <div className="space-y-6">
        {chapterThree.lines.map((line, index) => (
          <motion.p
            key={line}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: index === 0 ? 0.65 : 1, y: 0 }}
            transition={{ duration: 0.7, delay: index * 0.6, ease: EASE }}
            className={
              index === 0
                ? 'font-display text-[clamp(1.5rem,6vw,2rem)] text-mist'
                : 'font-display text-[clamp(1.6rem,6.5vw,2.3rem)] leading-snug text-paper'
            }
          >
            {line}
          </motion.p>
        ))}
      </div>

      {/* A line drawn downwards towards something out of frame. */}
      <div className="relative mt-12 h-20 w-px overflow-visible bg-gradient-to-b from-white/20 to-transparent">
        <motion.span
          className="absolute -left-[3px] top-0 block h-[7px] w-[7px] rounded-full bg-lilac"
          initial={{ y: 0, opacity: 0 }}
          animate={
            reduced
              ? { opacity: 0.8, y: 70 }
              : { y: [0, 70], opacity: [0, 1, 0.15] }
          }
          transition={
            reduced
              ? { duration: 0.3 }
              : { duration: 2.6, repeat: Infinity, ease: 'easeInOut', delay: 1 }
          }
          style={{ boxShadow: '0 0 12px rgba(176,164,218,0.9)' }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: ready ? 1 : 0 }}
        transition={{ duration: 0.5, ease: EASE }}
        className="mt-10"
      >
        <JourneyButton onClick={onNext} disabled={!ready}>
          {chapterThree.cta}
        </JourneyButton>
      </motion.div>
    </StageShell>
  );
}
