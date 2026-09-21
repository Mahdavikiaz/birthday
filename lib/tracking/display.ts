import type { NormalizedTracking, TrackingPlace } from './types';

const TIME_ZONE = 'Asia/Jakarta';

const dateFormatter = new Intl.DateTimeFormat('en-GB', {
  timeZone: TIME_ZONE,
  day: '2-digit',
  month: 'short',
  year: 'numeric',
});

const shortDateFormatter = new Intl.DateTimeFormat('en-GB', {
  timeZone: TIME_ZONE,
  day: '2-digit',
  month: 'short',
});

const timeFormatter = new Intl.DateTimeFormat('en-GB', {
  timeZone: TIME_ZONE,
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
});

function toDate(iso: string | null | undefined): Date | null {
  if (!iso) return null;
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? null : date;
}

/** "24 Sep 2026 · 09:42 WIB" */
export function formatFullTimestamp(iso: string | null | undefined): string | null {
  const date = toDate(iso);
  if (!date) return null;
  return `${dateFormatter.format(date)} · ${timeFormatter.format(date)} WIB`;
}

/** "24 Sep" */
export function formatShortDate(iso: string | null | undefined): string | null {
  const date = toDate(iso);
  if (!date) return null;
  return shortDateFormatter.format(date);
}

/** "09:42 WIB" */
export function formatTime(iso: string | null | undefined): string | null {
  const date = toDate(iso);
  if (!date) return null;
  return `${timeFormatter.format(date)} WIB`;
}

/**
 * Friendly wording for the headline status. The SPX status is never modified —
 * it stays in the normalized data and in the detailed history.
 */
const FRIENDLY_STATUS: { match: RegExp; headline: string; badge: string }[] = [
  { match: /preparing/i, headline: 'Preparing your gift', badge: 'Getting ready' },
  { match: /out for delivery/i, headline: 'Your gift is almost there', badge: 'Almost there' },
  { match: /delivered/i, headline: 'Your gift has arrived 🎉', badge: 'Arrived' },
  { match: /transit|shipped|picked/i, headline: 'Your gift is on the way', badge: 'On the way' },
  { match: /pending|hold/i, headline: 'Your gift is taking a short break', badge: 'On hold' },
];

export function friendlyStatus(tracking: NormalizedTracking): { headline: string; badge: string } {
  const source = `${tracking.currentStatus.milestoneName} ${tracking.currentStatus.groupName}`.trim();
  const found = FRIENDLY_STATUS.find((entry) => entry.match.test(source));
  if (found) return { headline: found.headline, badge: found.badge };
  // Unknown milestone: show what SPX said rather than guessing.
  const fallback = tracking.currentStatus.milestoneName || tracking.currentStatus.groupName;
  return {
    headline: fallback ? `Latest update: ${fallback}` : 'Your gift is somewhere out there',
    badge: fallback || 'In progress',
  };
}

/**
 * Hub names come through as "Alang Alang Lebar Hub". The full address is long
 * and formatted for couriers, so it only shows when the visitor expands it.
 */
export function placeLabel(place: TrackingPlace | null | undefined): string | null {
  if (!place) return null;
  return place.name || null;
}

/** A short "Palembang, Sumatera Selatan" style line pulled out of the raw address. */
export function placeRegion(place: TrackingPlace | null | undefined): string | null {
  if (!place?.address) return null;
  const parts = place.address
    .split(',')
    .map((part) => part.trim())
    .filter((part) => part.length > 1 && !/^\d+$/.test(part));
  if (parts.length < 2) return null;
  const tail = parts.slice(-3).filter((part) => !/^\d{5}$/.test(part));
  const region = tail.slice(-2).join(', ');
  return region.length > 64 ? null : region;
}
