'use client';

import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

import { stageVariants } from '@/lib/motion';

type StageShellProps = {
  children: ReactNode;
  /** `column` for reading stages, `wide` for the photo and tracking stages. */
  width?: 'column' | 'wide';
  className?: string;
  /** Scrollable stages (wishes, tracking) align to the top instead of centre. */
  align?: 'center' | 'top';
};

export default function StageShell({
  children,
  width = 'column',
  className = '',
  align = 'center',
}: StageShellProps) {
  return (
    <motion.section
      variants={stageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className={[
        'stage relative z-10 mx-auto flex w-full flex-col',
        width === 'column' ? 'max-w-column' : 'max-w-wide',
        align === 'center' ? 'justify-center' : 'justify-start',
        className,
      ].join(' ')}
    >
      {children}
    </motion.section>
  );
}
