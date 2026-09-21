'use client';

import { motion, useReducedMotion } from 'framer-motion';

export default function TrackingStatusBadge({
  label,
  delivered = false,
}: {
  label: string;
  delivered?: boolean;
}) {
  const reduced = useReducedMotion();

  return (
    <span
      className={[
        'inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[0.65rem] uppercase tracking-[0.16em]',
        delivered
          ? 'border-ember/35 bg-ember/[0.07] text-ember'
          : 'border-lilac/30 bg-lilac/[0.06] text-lilac-soft',
      ].join(' ')}
    >
      <motion.span
        aria-hidden="true"
        className={`block h-1.5 w-1.5 rounded-full ${delivered ? 'bg-ember' : 'bg-lilac'}`}
        animate={reduced || delivered ? { opacity: 1 } : { opacity: [1, 0.3, 1] }}
        transition={{ duration: 2.2, repeat: reduced || delivered ? 0 : Infinity, ease: 'easeInOut' }}
      />
      {label}
    </span>
  );
}
