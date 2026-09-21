import type {
  MilestoneStep,
  NormalizedTracking,
  SpxLocation,
  SpxOrderData,
  SpxTrackingRecord,
  TrackingEventData,
  TrackingPlace,
} from './types';

const EMPTY_PLACE: TrackingPlace = {
  name: null,
  latitude: null,
  longitude: null,
  address: null,
};

/**
 * The milestones SPX is known to emit, in shipment order. Used only to render
 * the steps that have *not* happened yet — anything the API actually returns is
 * trusted over this list, including codes and names we've never seen.
 */
export const KNOWN_MILESTONES: { code: number; name: string }[] = [
  { code: 1, name: 'Preparing to ship' },
  { code: 5, name: 'In transit' },
  { code: 6, name: 'Out for delivery' },
  { code: 8, name: 'Delivered' },
];

export const DELIVERED_MILESTONE_CODE = 8;

function text(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

function coordinate(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  const parsed = Number(trimmed);
  if (!Number.isFinite(parsed)) return null;
  // 0,0 is the null island — SPX uses it as "unknown", never as a real hub.
  if (parsed === 0) return null;
  return parsed;
}

function normalizePlace(location: SpxLocation | undefined): TrackingPlace {
  if (!location) return { ...EMPTY_PLACE };
  const latitude = coordinate(location.lat);
  const longitude = coordinate(location.lng);
  return {
    name: text(location.location_name) || null,
    latitude,
    longitude,
    address: text(location.full_address) || null,
  };
}

export function hasCoordinates(
  place: TrackingPlace,
): place is TrackingPlace & { latitude: number; longitude: number } {
  return place.latitude !== null && place.longitude !== null;
}

function normalizeRecord(record: SpxTrackingRecord): TrackingEventData | null {
  const unix = typeof record.actual_time === 'number' ? record.actual_time : null;
  if (unix === null || !Number.isFinite(unix) || unix <= 0) return null;

  const description =
    text(record.buyer_description) || text(record.description) || text(record.seller_description);

  const milestoneCode =
    typeof record.milestone_code === 'number' && Number.isFinite(record.milestone_code)
      ? record.milestone_code
      : null;

  const trackingName = text(record.tracking_name);
  const milestoneName = text(record.milestone_name) || trackingName || 'Update';

  return {
    trackingCode: text(record.tracking_code),
    trackingName: trackingName || milestoneName,
    description,
    timestamp: new Date(unix * 1000).toISOString(),
    timestampUnix: unix,
    milestoneCode,
    milestoneName,
    location: normalizePlace(record.current_location),
    nextLocation: normalizePlace(record.next_location),
  };
}

/**
 * Turns the raw `data` object into the only shape the UI is allowed to read.
 * Records arrive newest-first; events come out oldest-first because the journey
 * timeline reads forwards.
 */
export function normalizeSPXResponse(data: SpxOrderData | undefined | null): NormalizedTracking {
  const orderInfo = data?.order_info ?? {};
  const rawRecords = Array.isArray(data?.sls_tracking_info?.records)
    ? (data!.sls_tracking_info!.records as SpxTrackingRecord[])
    : [];

  const events = rawRecords
    .map(normalizeRecord)
    .filter((event): event is TrackingEventData => event !== null)
    .sort((a, b) => a.timestampUnix - b.timestampUnix);

  const latest = events.length > 0 ? events[events.length - 1] : null;

  const groupName = text(orderInfo.tracking_code_group_name);
  const subgroupName = text(orderInfo.tracking_code_subgroup_name);

  return {
    trackingNumber: text(orderInfo.spx_tn) || text(data?.parcel_info?.customer_tracking_no),
    currentStatus: {
      groupName: groupName || latest?.milestoneName || '',
      subgroupName,
      milestoneCode: latest?.milestoneCode ?? null,
      milestoneName: latest?.milestoneName || groupName || '',
    },
    lastUpdated: latest?.timestamp ?? null,
    currentLocation: latest ? latest.location : { ...EMPTY_PLACE },
    events,
  };
}

/** Stable key for grouping — code when present, otherwise the name. */
function milestoneKey(event: TrackingEventData): string {
  return event.milestoneCode !== null ? `c:${event.milestoneCode}` : `n:${event.milestoneName}`;
}

/**
 * Collapses the raw history into the headline journey.
 *
 * Several codes share one milestone (F510 / F540 / F599 are all "In transit"),
 * so each milestone appears once, represented by its most recent event. Every
 * raw record is still available in `tracking.events` for the detail view.
 */
export function buildMilestoneJourney(tracking: NormalizedTracking): MilestoneStep[] {
  const { events } = tracking;
  if (events.length === 0) {
    return KNOWN_MILESTONES.map((milestone, index) => ({
      code: milestone.code,
      name: milestone.name,
      state: index === 0 ? 'current' : 'upcoming',
      representative: null,
      eventCount: 0,
    }));
  }

  const groups = new Map<
    string,
    { code: number | null; name: string; first: number; latest: TrackingEventData; count: number }
  >();

  for (const event of events) {
    const key = milestoneKey(event);
    const existing = groups.get(key);
    if (!existing) {
      groups.set(key, {
        code: event.milestoneCode,
        name: event.milestoneName,
        first: event.timestampUnix,
        latest: event,
        count: 1,
      });
      continue;
    }
    existing.count += 1;
    existing.first = Math.min(existing.first, event.timestampUnix);
    if (event.timestampUnix >= existing.latest.timestampUnix) existing.latest = event;
  }

  const reached = [...groups.values()].sort((a, b) => a.first - b.first);
  const currentKey = milestoneKey(events[events.length - 1]);

  const steps: MilestoneStep[] = reached.map((group) => {
    const key = group.code !== null ? `c:${group.code}` : `n:${group.name}`;
    return {
      code: group.code,
      name: group.name,
      state: key === currentKey ? 'current' : 'done',
      representative: group.latest,
      eventCount: group.count,
    };
  });

  // Nothing after the current step was flagged as current (e.g. an unknown
  // milestone key) — fall back to marking the last reached step.
  if (!steps.some((step) => step.state === 'current') && steps.length > 0) {
    steps[steps.length - 1].state = 'current';
  }

  const reachedCodes = reached
    .map((group) => group.code)
    .filter((code): code is number => code !== null);
  const highestReached = reachedCodes.length > 0 ? Math.max(...reachedCodes) : null;
  const reachedCodeSet = new Set(reachedCodes);

  const upcoming: MilestoneStep[] = KNOWN_MILESTONES.filter(
    (milestone) =>
      !reachedCodeSet.has(milestone.code) &&
      (highestReached === null || milestone.code > highestReached),
  ).map((milestone) => ({
    code: milestone.code,
    name: milestone.name,
    state: 'upcoming' as const,
    representative: null,
    eventCount: 0,
  }));

  return [...steps, ...upcoming];
}

export function isDelivered(tracking: NormalizedTracking): boolean {
  if (tracking.currentStatus.milestoneCode === DELIVERED_MILESTONE_CODE) return true;
  return /delivered/i.test(tracking.currentStatus.milestoneName || tracking.currentStatus.groupName);
}

/**
 * The route the parcel has taken, as distinct places with coordinates.
 * Consecutive events at the same hub collapse into one point.
 */
export function buildRoute(tracking: NormalizedTracking): TrackingPlace[] {
  const points: TrackingPlace[] = [];
  for (const event of tracking.events) {
    const place = event.location;
    if (!hasCoordinates(place)) continue;
    const previous = points[points.length - 1];
    if (
      previous &&
      previous.latitude === place.latitude &&
      previous.longitude === place.longitude
    ) {
      continue;
    }
    points.push(place);
  }
  return points;
}

/** Only returned when SPX actually gives a next hop — never invented. */
export function getNextStop(tracking: NormalizedTracking): TrackingPlace | null {
  for (let index = tracking.events.length - 1; index >= 0; index -= 1) {
    const next = tracking.events[index].nextLocation;
    if (hasCoordinates(next) || next.name) return next;
  }
  return null;
}
