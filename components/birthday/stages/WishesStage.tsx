'use client';

import { motion } from 'framer-motion';

import birthdayConfig from '@/config/birthday';
import StageShell from '@/components/birthday/ui/StageShell';
import JourneyButton from '@/components/birthday/ui/JourneyButton';
import { EASE, lineVariants } from '@/lib/motion';
import useDelayedFlag from '@/lib/useDelayedFlag';

export default function WishesStage({ onNext }: { onNext: () => void }) {
  const { wishes } = birthdayConfig;
  const paragraphs = wishes.body
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  const lastDelay = 0.45 + (paragraphs.length - 1) * 0.22;
  const ready = useDelayedFlag((lastDelay + 0.6) * 1000);

  return (
    <StageShell align="top">
      <motion.h2
        variants={lineVariants}
        className="font-display text-[clamp(2rem,7.5vw,2.9rem)] leading-tight tracking-[-0.01em]"
      >
        {wishes.heading}
      </motion.h2>

      <div className="mt-8 space-y-5">
        {paragraphs.map((paragraph, index) => (
          <motion.p
            key={paragraph.slice(0, 24)}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.45 + index * 0.22, ease: EASE }}
            className="font-display text-[clamp(1.05rem,4.2vw,1.2rem)] leading-[1.85] text-paper/85"
          >
            {paragraph}
          </motion.p>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: ready ? 1 : 0 }}
        transition={{ duration: 0.5, ease: EASE }}
        className="mt-12"
      >
        <JourneyButton onClick={onNext} disabled={!ready}>
          {wishes.cta}
        </JourneyButton>
      </motion.div>
    </StageShell>
  );
}
