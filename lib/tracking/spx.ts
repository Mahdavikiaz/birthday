import 'server-only';

import type { SpxOrderData, SpxResponse, TrackingErrorCode } from './types';

const SPX_ENDPOINT = 'https://spx.co.id/shipment/order/open/order/get_order_info';
const REQUEST_TIMEOUT_MS = 10_000;
const CACHE_TTL_MS = 30_000;

export class SpxError extends Error {
  code: TrackingErrorCode;

  constructor(code: TrackingErrorCode, message: string) {
    super(message);
    this.name = 'SpxError';
    this.code = code;
  }
}

/** SPX numbers look like SPXID062889834387; stay permissive but reject junk. */
export function isValidTrackingNumber(value: string): boolean {
  return /^[A-Za-z0-9][A-Za-z0-9-]{5,39}$/.test(value);
}

type CacheEntry = { data: SpxOrderData; fetchedAt: number };

// Module-scope cache. Small, per-instance, and only here so that a visitor
// tapping "Refresh" twice doesn't hit SPX twice.
const cache = new Map<string, CacheEntry>();

function readCache(trackingNumber: string): CacheEntry | null {
  const entry = cache.get(trackingNumber);
  if (!entry) return null;
  if (Date.now() - entry.fetchedAt > CACHE_TTL_MS) {
    cache.delete(trackingNumber);
    return null;
  }
  return entry;
}

export function clearTrackingCache(trackingNumber?: string): void {
  if (trackingNumber) cache.delete(trackingNumber);
  else cache.clear();
}

async function requestSpx(trackingNumber: string): Promise<SpxOrderData> {
  const url = `${SPX_ENDPOINT}?spx_tn=${encodeURIComponent(trackingNumber)}&language_code=id`;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  let response: Response;
  try {
    response = await fetch(url, {
      signal: controller.signal,
      cache: 'no-store',
      headers: {
        accept: 'application/json',
        'accept-language': 'id-ID,id;q=0.9,en;q=0.8',
        'user-agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36',
      },
    });
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new SpxError('TIMEOUT', 'The courier system took too long to answer.');
    }
    throw new SpxError('NETWORK_ERROR', 'Could not reach the courier system.');
  } finally {
    clearTimeout(timeout);
  }

  if (!response.ok) {
    throw new SpxError('UPSTREAM_ERROR', `The courier system answered with ${response.status}.`);
  }

  let payload: SpxResponse;
  try {
    payload = (await response.json()) as SpxResponse;
  } catch {
    throw new SpxError('MALFORMED_RESPONSE', 'The courier system sent something unreadable.');
  }

  if (!payload || typeof payload !== 'object') {
    throw new SpxError('MALFORMED_RESPONSE', 'The courier system sent something unreadable.');
  }

  if (payload.retcode !== 0 || (payload.message && payload.message !== 'success')) {
    throw new SpxError('NOT_FOUND', 'No shipment found for this tracking number yet.');
  }

  const data = payload.data;
  if (!data || typeof data !== 'object') {
    throw new SpxError('NOT_FOUND', 'No shipment found for this tracking number yet.');
  }

  const records = data.sls_tracking_info?.records;
  if (!Array.isArray(records) || records.length === 0) {
    // The order exists but has no scans yet — still useful, the UI shows
    // "preparing to ship". Only a completely shapeless payload is an error.
    if (!data.order_info) {
      throw new SpxError('NOT_FOUND', 'No shipment found for this tracking number yet.');
    }
  }

  return data;
}

export async function fetchSpxOrder(
  trackingNumber: string,
  options: { force?: boolean } = {},
): Promise<{ data: SpxOrderData; fetchedAt: number; cached: boolean }> {
  if (!options.force) {
    const cached = readCache(trackingNumber);
    if (cached) return { data: cached.data, fetchedAt: cached.fetchedAt, cached: true };
  }

  const data = await requestSpx(trackingNumber);
  const fetchedAt = Date.now();
  cache.set(trackingNumber, { data, fetchedAt });
  return { data, fetchedAt, cached: false };
}
