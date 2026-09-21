'use client';

import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

import { micro } from '@/lib/motion';

type Variant = 'primary' | 'quiet';

type JourneyButtonProps = {
  children: ReactNode;
  onClick?: () => void;
  variant?: Variant;
  /** Trailing glyph. Defaults to the journey arrow; pass null to drop it. */
  trailing?: ReactNode | null;
  disabled?: boolean;
  className?: string;
  type?: 'button' | 'submit';
  ariaLabel?: string;
};

const base =
  'group inline-flex min-h-[44px] items-center gap-3 rounded-full px-6 py-3 text-[0.7rem] uppercase tracking-[0.2em] transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-40';

const styles: Record<Variant, string> = {
  primary:
    'border border-white/[0.14] bg-white/[0.035] text-paper hover:border-lilac/45 hover:bg-white/[0.07]',
  quiet: 'border border-transparent px-3 text-mist hover:text-paper',
};

export default function JourneyButton({
  children,
  onClick,
  variant = 'primary',
  trailing = '→',
  disabled,
  className = '',
  type = 'button',
  ariaLabel,
}: JourneyButtonProps) {
  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      whileHover={disabled ? undefined : { y: -1 }}
      whileTap={disabled ? undefined : { scale: 0.985 }}
      transition={micro}
      className={`${base} ${styles[variant]} ${className}`}
    >
      <span>{children}</span>
      {trailing ? (
        <span
          aria-hidden="true"
          className="translate-x-0 text-lilac transition-transform duration-200 ease-journey group-hover:translate-x-1"
        >
          {trailing}
        </span>
      ) : null}
    </motion.button>
  );
}
