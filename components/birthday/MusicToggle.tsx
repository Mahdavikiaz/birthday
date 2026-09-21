'use client';

import { motion } from 'framer-motion';
import { Volume2, VolumeX } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

import birthdayConfig from '@/config/birthday';
import { micro } from '@/lib/motion';

/**
 * Audio only ever starts from a tap. If the file isn't there, the control
 * removes itself rather than sitting in the corner doing nothing.
 */
export default function MusicToggle() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [unavailable, setUnavailable] = useState(false);

  useEffect(() => {
    let cancelled = false;

    // Check the file is actually there before offering the control, so nobody
    // taps a button that can't do anything.
    void fetch(birthdayConfig.audio.src, { method: 'HEAD' })
      .then((response) => {
        if (!cancelled && !response.ok) setUnavailable(true);
      })
      .catch(() => {
        if (!cancelled) setUnavailable(true);
      });

    return () => {
      cancelled = true;
      audioRef.current?.pause();
      audioRef.current = null;
    };
  }, []);

  const toggle = useCallback(async () => {
    if (!audioRef.current) {
      const audio = new Audio(birthdayConfig.audio.src);
      audio.loop = true;
      audio.volume = 0.32;
      audio.addEventListener('error', () => setUnavailable(true));
      audioRef.current = audio;
    }

    const audio = audioRef.current;
    if (playing) {
      audio.pause();
      setPlaying(false);
      return;
    }

    try {
      await audio.play();
      setPlaying(true);
    } catch {
      setUnavailable(true);
    }
  }, [playing]);

  if (!birthdayConfig.audio.enabled || unavailable) return null;

  return (
    <motion.button
      type="button"
      onClick={toggle}
      whileTap={{ scale: 0.94 }}
      transition={micro}
      aria-pressed={playing}
      aria-label={playing ? 'Turn the music off' : 'Turn the music on'}
      className="fixed right-[var(--stage-padding)] top-6 z-30 flex h-10 w-10 items-center justify-center rounded-full border border-white/[0.1] bg-white/[0.03] text-mist transition-colors duration-200 hover:border-lilac/40 hover:text-paper"
    >
      {playing ? (
        <Volume2 className="h-4 w-4" strokeWidth={1.4} aria-hidden="true" />
      ) : (
        <VolumeX className="h-4 w-4" strokeWidth={1.4} aria-hidden="true" />
      )}
    </motion.button>
  );
}
