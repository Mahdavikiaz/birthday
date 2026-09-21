'use client';

import { motion } from 'framer-motion';

import birthdayConfig from '@/config/birthday';
import StageShell from '@/components/birthday/ui/StageShell';
import JourneyButton from '@/components/birthday/ui/JourneyButton';
import { EASE, lineVariants } from '@/lib/motion';
import useDelayedFlag from '@/lib/useDelayedFlag';

export default function ChapterOneStage({ onNext }: { onNext: () => void }) {
  const { chapterOne } = birthdayConfig.chapters;
  const ready = useDelayedFlag(1100);

  return (
    <StageShell>
      <motion.h2
        variants={lineVariants}
        className="font-display text-[clamp(2.1rem,8vw,3.1rem)] leading-tight tracking-[-0.01em]"
      >
        {chapterOne.title}
      </motion.h2>

      <div className="mt-10 border-l border-white/[0.09] pl-6">
        {chapterOne.lines.map((line, index) => (
          <motion.p
            key={line}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35 + index * 0.45, ease: EASE }}
            className="font-display text-[clamp(1.2rem,4.8vw,1.55rem)] leading-[1.6] text-paper/90 [&+&]:mt-5"
          >
            {line}
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
          {chapterOne.cta}
        </JourneyButton>
      </motion.div>
    </StageShell>
  );
}
