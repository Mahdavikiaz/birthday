'use client';

import { motion } from 'framer-motion';

import birthdayConfig from '@/config/birthday';
import StageShell from '@/components/birthday/ui/StageShell';
import JourneyButton from '@/components/birthday/ui/JourneyButton';
import { EASE, lineVariants } from '@/lib/motion';
import useDelayedFlag from '@/lib/useDelayedFlag';

/** A gentle stagger of indents, so the list reads as handwriting, not a table. */
const INDENTS = ['0rem', '1.1rem', '2rem', '1.1rem', '0rem'];

export default function ChapterTwoStage({ onNext }: { onNext: () => void }) {
  const { chapterTwo } = birthdayConfig.chapters;
  const traits = chapterTwo.traits;
  const lastTraitDelay = 0.3 + (traits.length - 1) * 0.34;
  const ready = useDelayedFlag((lastTraitDelay + 0.9) * 1000);

  return (
    <StageShell>
      <motion.h2
        variants={lineVariants}
        className="font-display text-[clamp(2.1rem,8vw,3.1rem)] leading-tight tracking-[-0.01em]"
      >
        {chapterTwo.title}
      </motion.h2>

      <ul className="mt-10 space-y-3">
        {traits.map((trait, index) => (
          <motion.li
            key={trait}
            initial={{ opacity: 0, y: 16, filter: 'blur(4px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{
              duration: 0.6,
              delay: 0.3 + index * 0.34,
              ease: EASE,
            }}
            // style={{ marginLeft: INDENTS[index % INDENTS.length] }}
            className="font-display text-[clamp(1.5rem,6.5vw,2.1rem)] leading-tight text-paper"
          >
            {trait}
          </motion.li>
        ))}
      </ul>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: lastTraitDelay + 0.5, ease: EASE }}
        className="mt-10 max-w-[28rem] text-[0.95rem] leading-relaxed text-mist"
      >
        {chapterTwo.closing}
      </motion.p>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: ready ? 1 : 0 }}
        transition={{ duration: 0.5, ease: EASE }}
        className="mt-10"
      >
        <JourneyButton onClick={onNext} disabled={!ready}>
          {chapterTwo.cta}
        </JourneyButton>
      </motion.div>
    </StageShell>
  );
}
