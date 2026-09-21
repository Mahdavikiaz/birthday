'use client';

import { useEffect, useState } from 'react';
import { useReducedMotion } from 'framer-motion';

/**
 * True after `delay` ms. Used for reveals that should finish before a CTA
 * appears. With reduced motion the flag is true immediately, so nobody is left
 * waiting on an animation they asked not to see.
 */
export function useDelayedFlag(delay: number): boolean {
  const reduced = useReducedMotion();
  const [ready, setReady] = useState(delay <= 0);

  useEffect(() => {
    if (reduced || delay <= 0) {
      setReady(true);
      return;
    }
    setReady(false);
    const timer = window.setTimeout(() => setReady(true), delay);
    return () => window.clearTimeout(timer);
  }, [delay, reduced]);

  return ready;
}

export default useDelayedFlag;
