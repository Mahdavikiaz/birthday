'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Check, ChevronDown } from 'lucide-react';
import { useMemo, useState } from 'react';

import TrackingEvent from './TrackingEvent';
import { EASE } from '@/lib/motion';
import { formatShortDate, formatTime } from '@/lib/tracking/display';
import { buildMilestoneJourney } from '@/lib/tracking/normalize';
import type { NormalizedTracking } from '@/lib/tracking/types';

export default function TrackingTimeline({ tracking }: { tracking: NormalizedTracking }) {
  const [expanded, setExpanded] = useState(false);
  const reduced = useReducedMotion();

  const steps = useMemo(() => buildMilestoneJourney(tracking), [tracking]);
  // The headline timeline reads forwards; the detail log reads like a feed,
  // newest first, which is how you actually check on a parcel.
  const detailedEvents = useMemo(() => [...tracking.events].reverse(), [tracking.events]);

  return (
    <section className="mt-10">
      <ol className="relative">
        {steps.map((step, index) => {
          const isLast = index === steps.length - 1;
          const representative = step.representative;
          const date = formatShortDate(representative?.timestamp);
          const time = formatTime(representative?.timestamp);

          return (
            <motion.li
              key={`${step.code ?? 'x'}-${step.name}`}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 + index * 0.08, ease: EASE }}
              className="relative flex gap-4 pb-7 last:pb-0"
            >
              {!isLast && (
                <span
                  aria-hidden="true"
                  className={`absolute left-[10px] top-6 h-[calc(100%-1rem)] w-px ${
                    step.state === 'upcoming' ? 'bg-white/[0.08]' : 'bg-lilac/25'
                  }`}
                />
              )}

              <span className="relative z-10 mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center">
                {step.state === 'done' && (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full border border-lilac/35 bg-ink-900">
                    <Check className="h-3 w-3 text-lilac" strokeWidth={2} aria-hidden="true" />
                  </span>
                )}
                {step.state === 'current' && (
                  <>
                    {!reduced && (
                      <motion.span
                        aria-hidden="true"
                        className="absolute h-5 w-5 rounded-full border border-lilac/50"
                        animate={{ scale: [1, 1.6], opacity: [0.7, 0] }}
                        transition={{ duration: 2.4, repeat: Infinity, ease: 'easeOut' }}
                      />
                    )}
                    <span className="h-[9px] w-[9px] rounded-full bg-lilac shadow-[0_0_12px_rgba(176,164,218,0.9)]" />
                  </>
                )}
                {step.state === 'upcoming' && (
                  <span className="h-[9px] w-[9px] rounded-full border border-white/20" />
                )}
              </span>

              <div className="min-w-0 flex-1">
                <p
                  className={[
                    'leading-snug',
                    step.state === 'current'
                      ? 'font-display text-[1.15rem] text-paper'
                      : step.state === 'done'
                        ? 'text-[0.95rem] text-paper/75'
                        : 'text-[0.95rem] text-dusk',
                  ].join(' ')}
                >
                  {step.name}
                </p>

                {representative && (
                  <p className="mt-1 text-[0.75rem] text-dusk">
                    <span className="tabular">
                      {date}
                      {date && time ? ' · ' : ''}
                      {time}
                    </span>
                    {representative.location.name ? ` — ${representative.location.name}` : ''}
                  </p>
                )}

                {step.eventCount > 1 && (
                  <p className="mt-1 text-[0.7rem] text-dusk/70">
                    {step.eventCount} updates in this stage
                  </p>
                )}
              </div>
            </motion.li>
          );
        })}
      </ol>

      {detailedEvents.length > 0 && (
        <div className="mt-8 border-t border-white/[0.07] pt-5">
          <button
            type="button"
            onClick={() => setExpanded((value) => !value)}
            aria-expanded={expanded}
            aria-controls="detailed-journey"
            className="inline-flex min-h-[40px] items-center gap-2 text-[0.72rem] uppercase tracking-[0.16em] text-mist transition-colors duration-200 hover:text-paper"
          >
            {expanded ? 'Hide detailed journey' : 'View detailed journey'}
            <ChevronDown
              className={`h-3.5 w-3.5 transition-transform duration-300 ${
                expanded ? 'rotate-180' : ''
              }`}
              strokeWidth={1.5}
              aria-hidden="true"
            />
          </button>

          <AnimatePresence initial={false}>
            {expanded && (
              <motion.div
                id="detailed-journey"
                key="detail"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: reduced ? 0.15 : 0.5, ease: EASE }}
                className="overflow-hidden"
              >
                <p className="pt-5 text-[0.7rem] text-dusk">Most recent first</p>
                <ol className="mt-4 border-l border-white/[0.07] pl-2">
                  {detailedEvents.map((event, index) => (
                    <TrackingEvent
                      key={`${event.trackingCode}-${event.timestampUnix}-${index}`}
                      event={event}
                      isLatest={index === 0}
                    />
                  ))}
                </ol>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </section>
  );
}
