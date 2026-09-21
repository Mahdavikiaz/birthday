'use client';

import { AnimatePresence, motion } from 'framer-motion';

import birthdayConfig from '@/config/birthday';
import { ACT_COUNT, actIndexOf, padAct, type StageId } from '@/lib/journey';
import { EASE } from '@/lib/motion';

export default function JourneyProgress({ stage }: { stage: StageId }) {
  const actIndex = actIndexOf(stage);
  const visible = actIndex !== null;
  const acts = birthdayConfig.acts;

  return (
    <AnimatePresence>
      {visible && actIndex !== null && (
        <motion.div
          key="progress"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.5, ease: EASE }}
          className="pointer-events-none fixed inset-x-0 bottom-0 z-30 flex justify-center px-[var(--stage-padding)] pb-6 sm:justify-start"
        >
          <div className="flex items-center gap-3">
            <p className="sr-only" aria-live="polite">
              Chapter {actIndex + 1} of {ACT_COUNT}: {acts[actIndex]}
            </p>

            <span aria-hidden="true" className="tabular text-[0.7rem] text-paper/80">
              {padAct(actIndex)}
              <span className="text-dusk"> / {padAct(ACT_COUNT - 1)}</span>
            </span>

            <span aria-hidden="true" className="flex items-center gap-1.5">
              {Array.from({ length: ACT_COUNT }, (_, index) => {
                const state =
                  index < actIndex ? 'done' : index === actIndex ? 'current' : 'upcoming';
                return (
                  <span key={index} className="relative flex h-3 w-3 items-center justify-center">
                    {index > 0 && (
                      <span className="absolute right-full top-1/2 h-px w-1.5 -translate-y-1/2 bg-white/10" />
                    )}
                    <motion.span
                      animate={{
                        scale: state === 'current' ? 1 : 0.7,
                        opacity: state === 'upcoming' ? 0.3 : 1,
                      }}
                      transition={{ duration: 0.4, ease: EASE }}
                      className={[
                        'block h-[5px] w-[5px] rounded-full',
                        state === 'current'
                          ? 'bg-lilac shadow-[0_0_10px_rgba(176,164,218,0.8)]'
                          : state === 'done'
                            ? 'bg-lilac/60'
                            : 'bg-white/35',
                      ].join(' ')}
                    />
                  </span>
                );
              })}
            </span>

            <span
              aria-hidden="true"
              className="hidden text-[0.7rem] tracking-[0.08em] text-dusk sm:inline"
            >
              {acts[actIndex]}
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
