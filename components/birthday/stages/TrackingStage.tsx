'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useCallback, useEffect, useRef, useState } from 'react';

import birthdayConfig from '@/config/birthday';
import Confetti from '@/components/birthday/effects/Confetti';
import TrackingHeader from '@/components/birthday/tracking/TrackingHeader';
import TrackingMap from '@/components/birthday/tracking/TrackingMap';
import TrackingSummary from '@/components/birthday/tracking/TrackingSummary';
import TrackingTimeline from '@/components/birthday/tracking/TrackingTimeline';
import StageShell from '@/components/birthday/ui/StageShell';
import JourneyButton from '@/components/birthday/ui/JourneyButton';
import { EASE } from '@/lib/motion';
import { isDelivered } from '@/lib/tracking/normalize';
import type { TrackingPayload, TrackingSuccessPayload } from '@/lib/tracking/types';

type Status = 'loading' | 'ready' | 'error';

const ERROR_COPY: Record<string, string> = {
  NOT_FOUND: 'Hmm… we couldn’t find this shipment yet.',
  INVALID_TRACKING_NUMBER: 'That tracking number doesn’t look right.',
  MISSING_TRACKING_NUMBER: 'No tracking number has been set up yet.',
};

const FALLBACK_ERROR = 'Looks like the courier system isn’t responding right now.';

export default function TrackingStage({ onNext }: { onNext: () => void }) {
  const { tracking: copy } = birthdayConfig;

  const [status, setStatus] = useState<Status>('loading');
  const [payload, setPayload] = useState<TrackingSuccessPayload | null>(null);
  const [message, setMessage] = useState<string>(FALLBACK_ERROR);
  const [refreshing, setRefreshing] = useState(false);
  const [confettiKey, setConfettiKey] = useState(0);

  const inFlight = useRef(false);
  const celebrated = useRef(false);

  const load = useCallback(async (force = false) => {
    if (inFlight.current) return;
    inFlight.current = true;
    if (force) setRefreshing(true);

    try {
      const response = await fetch(`/api/tracking${force ? '?refresh=1' : ''}`, {
        cache: 'no-store',
      });
      const data = (await response.json()) as TrackingPayload;

      if (!data.ok) {
        setMessage(ERROR_COPY[data.code] ?? FALLBACK_ERROR);
        setStatus('error');
        return;
      }

      setPayload(data);
      setStatus('ready');

      if (isDelivered(data.tracking) && !celebrated.current) {
        celebrated.current = true;
        window.setTimeout(() => setConfettiKey((key) => key + 1), 600);
      }
    } catch {
      setMessage(FALLBACK_ERROR);
      setStatus('error');
    } finally {
      inFlight.current = false;
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const delivered = payload ? isDelivered(payload.tracking) : false;

  return (
    <StageShell width="wide" align="top">
      <Confetti fireKey={confettiKey} count={90} origin={{ x: 0.5, y: 0.35 }} />

      <TrackingHeader title={copy.title} subtitle={copy.subtitle} demo={payload?.demo ?? false} />

      <div className="mt-9">
        <AnimatePresence mode="wait">
          {status === 'loading' && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: EASE }}
              className="card-surface flex items-center gap-3 rounded-[4px] px-5 py-8"
            >
              <motion.span
                className="block h-1.5 w-1.5 rounded-full bg-lilac"
                animate={{ opacity: [1, 0.2, 1] }}
                transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
                aria-hidden="true"
              />
              <p className="text-[0.95rem] text-mist">Checking where your gift is…</p>
            </motion.div>
          )}

          {status === 'error' && (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: EASE }}
              className="card-surface rounded-[4px] px-5 py-7"
              role="status"
            >
              <p className="text-[1rem] text-paper/90">{message}</p>
              <p className="mt-2 text-[0.85rem] text-mist">
                It’s still on its way — the courier just isn’t saying much at the moment.
              </p>
              <div className="mt-6">
                <JourneyButton onClick={() => void load(true)} trailing="↻">
                  TRY AGAIN
                </JourneyButton>
              </div>
            </motion.div>
          )}

          {status === 'ready' && payload && (
            <motion.div
              key="ready"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: EASE }}
            >
              <TrackingSummary
                tracking={payload.tracking}
                onRefresh={() => void load(true)}
                refreshing={refreshing}
              />

              <TrackingMap tracking={payload.tracking} />

              <TrackingTimeline tracking={payload.tracking} />

              {delivered && (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.5, ease: EASE }}
                  className="mt-10 font-display text-[clamp(1.4rem,5.5vw,1.9rem)] text-paper"
                >
                  Your gift has arrived. 🎉
                </motion.p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-12">
        <JourneyButton onClick={onNext}>{copy.cta}</JourneyButton>
      </div>
    </StageShell>
  );
}
