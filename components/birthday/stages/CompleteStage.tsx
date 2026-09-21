'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

import birthdayConfig from '@/config/birthday';
import Confetti from '@/components/birthday/effects/Confetti';
import StageShell from '@/components/birthday/ui/StageShell';
import JourneyButton from '@/components/birthday/ui/JourneyButton';
import { EASE, lineVariants } from '@/lib/motion';

export default function CompleteStage({ onRestart }: { onRestart: () => void }) {
  const { complete } = birthdayConfig;
  const [confettiKey, setConfettiKey] = useState(0);

  useEffect(() => {
    const timer = window.setTimeout(() => setConfettiKey(1), 400);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <StageShell>
      <Confetti fireKey={confettiKey} count={60} origin={{ x: 0.5, y: 0.4 }} />

      <motion.h2
        variants={lineVariants}
        className="font-display text-[clamp(2.1rem,8vw,3rem)] leading-tight tracking-[-0.01em]"
      >
        {complete.heading}
      </motion.h2>

      <div className="mt-8 space-y-4">
        {complete.lines.map((line, index) => (
          <motion.p
            key={line}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 + index * 0.25, ease: EASE }}
            className="text-[0.98rem] leading-relaxed text-mist"
          >
            {line}
          </motion.p>
        ))}
      </div>

      <motion.p
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.4 + complete.lines.length * 0.25, ease: EASE }}
        className="mt-12 font-display text-[clamp(1.8rem,7vw,2.5rem)] leading-snug text-paper"
      >
        {complete.signoff}
      </motion.p>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.9, ease: EASE }}
        className="mt-12"
      >
        <JourneyButton onClick={onRestart} variant="quiet" trailing="↻">
          {complete.cta}
        </JourneyButton>
      </motion.div>
    </StageShell>
  );
}
