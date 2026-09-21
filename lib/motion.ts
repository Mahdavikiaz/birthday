import type { Transition, Variants } from 'framer-motion';

/** One easing curve for the whole site, so every move feels related. */
export const EASE = [0.22, 1, 0.36, 1] as const;

export const micro: Transition = { duration: 0.2, ease: EASE };
export const normal: Transition = { duration: 0.55, ease: EASE };
export const major: Transition = { duration: 0.85, ease: EASE };

/** Stage-level enter / exit. Deliberately slow enough to read as a scene change. */
export const stageVariants: Variants = {
  initial: { opacity: 0, y: 16, filter: 'blur(6px)' },
  animate: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.8, ease: EASE, when: 'beforeChildren', staggerChildren: 0.09 },
  },
  exit: {
    opacity: 0,
    y: -12,
    filter: 'blur(6px)',
    transition: { duration: 0.45, ease: EASE },
  },
};

/** Line-by-line reveal used by the chapters. */
export const lineVariants: Variants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
  exit: { opacity: 0, transition: { duration: 0.25 } },
};

export function staggerAfter(delay: number, gap = 0.09): Transition {
  return { delayChildren: delay, staggerChildren: gap };
}
