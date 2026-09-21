'use client';

import { formatShortDate, formatTime } from '@/lib/tracking/display';
import type { TrackingEventData } from '@/lib/tracking/types';

export default function TrackingEvent({
  event,
  isLatest = false,
}: {
  event: TrackingEventData;
  isLatest?: boolean;
}) {
  const date = formatShortDate(event.timestamp);
  const time = formatTime(event.timestamp);
  const hub = event.location.name;

  return (
    <li className="relative flex gap-4 pl-4">
      <span
        aria-hidden="true"
        className={`absolute left-0 top-[0.45rem] block h-1.5 w-1.5 rounded-full ${
          isLatest ? 'bg-lilac' : 'bg-white/25'
        }`}
      />

      <div className="w-[4.6rem] shrink-0 pt-px">
        {date && <p className="tabular text-[0.72rem] text-paper/70">{date}</p>}
        {time && <p className="tabular text-[0.68rem] text-dusk">{time}</p>}
      </div>

      <div className="min-w-0 flex-1 pb-5">
        <p className="text-[0.85rem] text-paper/90">{event.trackingName}</p>
        {event.description && (
          <p className="mt-1 text-[0.8rem] leading-relaxed text-mist">{event.description}</p>
        )}
        {hub && <p className="mt-1 text-[0.72rem] text-dusk">{hub}</p>}
      </div>
    </li>
  );
}
