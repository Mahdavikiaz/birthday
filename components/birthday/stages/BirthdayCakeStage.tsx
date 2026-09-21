'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';

import birthdayConfig from '@/config/birthday';
import Candle from '@/components/birthday/effects/Candle';
import Confetti from '@/components/birthday/effects/Confetti';
import StageShell from '@/components/birthday/ui/StageShell';
import JourneyButton from '@/components/birthday/ui/JourneyButton';
import { EASE, lineVariants } from '@/lib/motion';

export default function BirthdayCakeStage({ onNext }: { onNext: () => void }) {
  const { cake } = birthdayConfig;
  const reduced = useReducedMotion();
  const [blown, setBlown] = useState(false);
  const [confettiKey, setConfettiKey] = useState(0);
  const timers = useRef<number[]>([]);

  useEffect(() => {
    const pending = timers.current;
    return () => {
      pending.forEach((timer) => window.clearTimeout(timer));
    };
  }, []);

  const makeWish = useCallback(() => {
    if (blown) return;
    setBlown(true);

    // No microphone, no permission prompt: the button is the breath.
    timers.current.push(window.setTimeout(() => setConfettiKey((key) => key + 1), 450));
    timers.current.push(window.setTimeout(onNext, reduced ? 1400 : 3200));
  }, [blown, onNext, reduced]);

  return (
    <StageShell className="items-center text-center">
      <Confetti fireKey={confettiKey} count={80} origin={{ x: 0.5, y: 0.45 }} />

      <motion.p
        variants={lineVariants}
        className="font-display text-[clamp(1.4rem,5.5vw,1.8rem)] text-mist"
      >
        {cake.intro}
      </motion.p>

      <motion.p
        variants={lineVariants}
        className="mt-2 font-display text-[clamp(1.5rem,6vw,2.1rem)] leading-snug text-paper"
      >
        {cake.lead}
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0, scale: blown ? 0.98 : 1 }}
        transition={{ duration: 0.8, delay: 0.2, ease: EASE }}
        className="relative mt-6 w-[min(82vw,340px)]"
      >
        {cake.photo && (
          <motion.figure
            initial={{ opacity: 0, y: 12, rotate: -7 }}
            animate={{ opacity: 1, y: 0, rotate: -7 }}
            transition={{ duration: 0.9, delay: 0.75, ease: EASE }}
            className="absolute bottom-[16%] left-0 z-0 w-[38%] bg-[#EAE4D8] p-1.5 pb-4 shadow-[0_20px_36px_-18px_rgba(0,0,0,0.95)]"
          >
            <div className="relative aspect-[4/5] w-full overflow-hidden bg-ink-800">
              <Image
                src={cake.photo.src}
                alt={cake.photo.alt ?? `A photo of ${birthdayConfig.fullName}`}
                fill
                sizes="140px"
                priority
                className="object-cover"
              />
            </div>
          </motion.figure>
        )}

        {/* The cake sits in front, so the photo reads as propped on the table. */}
        <div className="relative z-10">
          <Candle lit={!blown} blown={blown} className="h-auto w-full" />
        </div>
      </motion.div>

      <div className="mt-4 flex min-h-[5.5rem] flex-col items-center">
        <AnimatePresence mode="wait">
          {!blown ? (
            <motion.div
              key="wish"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8, transition: { duration: 0.3 } }}
              transition={{ duration: 0.6, delay: 0.5, ease: EASE }}
              className="flex flex-col items-center"
            >
              <p className="font-display text-[clamp(1.3rem,5vw,1.7rem)] text-paper/90">
                {cake.prompt}
              </p>
              <div className="mt-6">
                <JourneyButton onClick={makeWish} trailing="✨">
                  {cake.cta}
                </JourneyButton>
              </div>
            </motion.div>
          ) : (
            <motion.p
              key="after"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7, ease: EASE }}
              className="font-display text-[clamp(1.2rem,4.8vw,1.5rem)] italic text-paper/80"
            >
              {cake.afterBlow}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </StageShell>
  );
}
