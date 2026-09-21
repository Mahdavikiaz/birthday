import { NextResponse } from 'next/server';

import { buildDemoOrderData } from '@/lib/tracking/demo';
import { normalizeSPXResponse } from '@/lib/tracking/normalize';
import { SpxError, fetchSpxOrder, isValidTrackingNumber } from '@/lib/tracking/spx';
import type { TrackingErrorPayload, TrackingSuccessPayload } from '@/lib/tracking/types';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

function fail(code: TrackingErrorPayload['code'], message: string, status: number) {
  return NextResponse.json<TrackingErrorPayload>({ ok: false, code, message }, { status });
}

/**
 * GET /api/tracking
 *
 * The client never needs to know the tracking number: the server reads
 * SPX_TRACKING_NUMBER. A `trackingNumber` query parameter is accepted for
 * local testing and is validated the same way.
 *
 * `?refresh=1` bypasses the short server-side cache.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const requested = searchParams.get('trackingNumber')?.trim();
  const force = searchParams.get('refresh') === '1';

  const configured = process.env.SPX_TRACKING_NUMBER?.trim();
  const trackingNumber = requested || configured || '';
  const demoRequested = process.env.SPX_DEMO === 'true';

  // No tracking number configured yet (or demo explicitly asked for): serve the
  // sample shipment rather than a dead end, flagged so the UI can say so.
  if (demoRequested || !trackingNumber) {
    return NextResponse.json<TrackingSuccessPayload>({
      ok: true,
      fetchedAt: new Date().toISOString(),
      demo: true,
      tracking: normalizeSPXResponse(buildDemoOrderData()),
    });
  }

  if (!isValidTrackingNumber(trackingNumber)) {
    return fail('INVALID_TRACKING_NUMBER', 'That tracking number doesn’t look right.', 400);
  }

  try {
    const { data, fetchedAt } = await fetchSpxOrder(trackingNumber, { force });
    const tracking = normalizeSPXResponse(data);

    if (!tracking.trackingNumber) tracking.trackingNumber = trackingNumber;

    return NextResponse.json<TrackingSuccessPayload>({
      ok: true,
      fetchedAt: new Date(fetchedAt).toISOString(),
      demo: false,
      tracking,
    });
  } catch (error) {
    if (error instanceof SpxError) {
      const status = error.code === 'NOT_FOUND' ? 404 : error.code === 'TIMEOUT' ? 504 : 502;
      return fail(error.code, error.message, status);
    }
    return fail('UPSTREAM_ERROR', 'The courier system isn’t responding right now.', 502);
  }
}
