'use client';

import { motion } from 'framer-motion';
import { Package, RotateCw } from 'lucide-react';

import TrackingStatusBadge from './TrackingStatusBadge';
import { EASE } from '@/lib/motion';
import { formatFullTimestamp, friendlyStatus, placeLabel, placeRegion } from '@/lib/tracking/display';
import { isDelivered } from '@/lib/tracking/normalize';
import type { NormalizedTracking } from '@/lib/tracking/types';

type TrackingSummaryProps = {
  tracking: NormalizedTracking;
  onRefresh: () => void;
  refreshing: boolean;
};

export default function TrackingSummary({ tracking, onRefresh, refreshing }: TrackingSummaryProps) {
  const delivered = isDelivered(tracking);
  const status = friendlyStatus(tracking);
  const lastUpdated = formatFullTimestamp(tracking.lastUpdated);
  const hub = placeLabel(tracking.currentLocation);
  const region = placeRegion(tracking.currentLocation);

  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: EASE }}
      className="card-surface relative overflow-hidden rounded-[4px] px-5 py-6 sm:px-7"
      aria-live="polite"
    >
      <div
        aria-hidden="true"
        className={`absolute -right-16 -top-20 h-48 w-48 rounded-full blur-3xl ${
          delivered ? 'bg-ember/[0.12]' : 'bg-lilac/[0.12]'
        }`}
      />

      <div className="relative flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-[3px] border border-white/[0.09] bg-white/[0.02]">
            <Package
              className={`h-5 w-5 ${delivered ? 'text-ember' : 'text-lilac-soft'}`}
              strokeWidth={1}
              aria-hidden="true"
            />
          </span>
          <p className="text-[0.7rem] uppercase tracking-[0.18em] text-mist">Your gift</p>
        </div>
        <TrackingStatusBadge label={status.badge} delivered={delivered} />
      </div>

      <h3 className="relative mt-6 font-display text-[clamp(1.5rem,6vw,2rem)] leading-snug text-paper">
        {status.headline}
      </h3>

      {hub && (
        <p className="relative mt-2 text-[0.9rem] text-mist">
          {delivered ? 'Last seen at' : 'Currently at'} {hub}
          {region ? <span className="block text-[0.8rem] text-dusk">{region}</span> : null}
        </p>
      )}

      <dl className="relative mt-7 space-y-3 border-t border-white/[0.07] pt-5 text-[0.82rem]">
        {tracking.trackingNumber && (
          <div className="flex items-baseline justify-between gap-4">
            <dt className="text-dusk">Tracking number</dt>
            <dd className="font-mono text-[0.78rem] tracking-wide text-paper/90">
              {tracking.trackingNumber}
            </dd>
          </div>
        )}
        {lastUpdated && (
          <div className="flex items-baseline justify-between gap-4">
            <dt className="text-dusk">Last updated</dt>
            <dd className="tabular text-paper/80">{lastUpdated}</dd>
          </div>
        )}
      </dl>

      <div className="relative mt-6">
        <button
          type="button"
          onClick={onRefresh}
          disabled={refreshing}
          className="inline-flex min-h-[40px] items-center gap-2.5 rounded-full border border-white/[0.12] px-4 py-2 text-[0.65rem] uppercase tracking-[0.18em] text-mist transition-colors duration-200 hover:border-lilac/40 hover:text-paper disabled:opacity-50"
        >
          <RotateCw
            className={`h-3.5 w-3.5 ${refreshing ? 'animate-spin' : ''}`}
            strokeWidth={1.5}
            aria-hidden="true"
          />
          {refreshing ? 'Checking' : 'Refresh status'}
        </button>
      </div>
    </motion.section>
  );
}
