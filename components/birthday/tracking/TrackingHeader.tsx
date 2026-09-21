'use client';

import { motion } from 'framer-motion';

import { lineVariants } from '@/lib/motion';

export default function TrackingHeader({
  title,
  subtitle,
  demo = false,
}: {
  title: string;
  subtitle: string;
  demo?: boolean;
}) {
  return (
    <header>
      <motion.h2
        variants={lineVariants}
        className="font-display text-[clamp(1.9rem,7vw,2.7rem)] leading-tight tracking-[-0.01em]"
      >
        {title}
      </motion.h2>
      <motion.p variants={lineVariants} className="mt-3 font-display text-[1.05rem] italic text-mist">
        {subtitle}
      </motion.p>

      {demo && (
        <motion.p
          variants={lineVariants}
          className="mt-4 inline-flex rounded-[3px] border border-white/10 px-2.5 py-1 text-[0.65rem] tracking-[0.08em] text-dusk"
        >
          Sample shipment — set SPX_TRACKING_NUMBER to show the real one
        </motion.p>
      )}
    </header>
  );
}
