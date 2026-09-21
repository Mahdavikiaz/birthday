'use client';

import { motion } from 'framer-motion';

import birthdayConfig from '@/config/birthday';
import StageShell from '@/components/birthday/ui/StageShell';
import JourneyButton from '@/components/birthday/ui/JourneyButton';
import { EASE } from '@/lib/motion';
import useDelayedFlag from '@/lib/useDelayedFlag';

export default function OneMoreThingStage({ onNext }: { onNext: () => void }) {
  const { oneMoreThing } = birthdayConfig;
  const ready = useDelayedFlag(2000);

  return (
    <StageShell>
      <motion.p
        initial={{ opacity: 0, scale: 0.94, filter: 'blur(8px)' }}
        animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
        transition={{ duration: 0.7, ease: EASE }}
        className="font-display text-[clamp(2.4rem,10vw,3.6rem)] leading-none text-paper"
      >
        {oneMoreThing.opener}
      </motion.p>

      <motion.p
        initial={{ opacity: 0, x: -14 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, delay: 0.75, ease: EASE }}
        className="mt-6 font-display text-[clamp(1.5rem,6vw,2.1rem)] leading-snug text-paper/90"
      >
        {oneMoreThing.line}
      </motion.p>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.5, ease: EASE }}
        className="mt-6 max-w-[28rem] text-[0.95rem] leading-relaxed text-mist"
      >
        {oneMoreThing.tease}
      </motion.p>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: ready ? 1 : 0 }}
        transition={{ duration: 0.5, ease: EASE }}
        className="mt-11"
      >
        <JourneyButton onClick={onNext} disabled={!ready}>
          {oneMoreThing.cta}
        </JourneyButton>
      </motion.div>
    </StageShell>
  );
}
