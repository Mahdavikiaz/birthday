'use client';

import { motion } from 'framer-motion';

import birthdayConfig from '@/config/birthday';
import StageShell from '@/components/birthday/ui/StageShell';
import JourneyButton from '@/components/birthday/ui/JourneyButton';
import { lineVariants } from '@/lib/motion';

export default function LandingStage({ onNext }: { onNext: () => void }) {
  const { intro } = birthdayConfig;

  return (
    <StageShell>
      <motion.h1
        variants={lineVariants}
        className="font-display text-[clamp(3rem,13vw,5rem)] leading-[0.95] tracking-[-0.02em]"
      >
        {intro.title}
      </motion.h1>

      <motion.p
        variants={lineVariants}
        className="mt-6 font-display text-[clamp(1.35rem,5.5vw,1.9rem)] italic leading-snug text-paper/90"
      >
        {intro.subtitle}
      </motion.p>

      <motion.p variants={lineVariants} className="mt-4 max-w-[30rem] text-[0.95rem] leading-relaxed text-mist">
        {intro.description}
      </motion.p>

      <motion.div variants={lineVariants} className="mt-12">
        <JourneyButton onClick={onNext}>{intro.cta}</JourneyButton>
      </motion.div>
    </StageShell>
  );
}
