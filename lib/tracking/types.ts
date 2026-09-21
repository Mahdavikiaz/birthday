/**
 * Types for the SPX Express `get_order_info` response, and for the normalized
 * shape the UI is allowed to see.
 *
 * Everything on the raw side is optional: the upstream payload varies by
 * shipment and we never assume a field exists.
 */

/* ------------------------------------------------------------------ raw ---- */

export interface SpxLocation {
  location_name?: string;
  location_type_name?: string;
  lng?: string;
  lat?: string;
  full_address?: string;
}

export interface SpxTrackingRecord {
  tracking_code?: string;
  tracking_name?: string;
  description?: string;
  display_flag?: number;
  actual_time?: number;
  reason_code?: string;
  reason_desc?: string;
  epod?: string;
  current_location?: SpxLocation;
  next_location?: SpxLocation;
  delivery_on_hold_times?: number;
  display_flag_v2?: number;
  buyer_description?: string;
  seller_description?: string;
  milestone_code?: number;
  milestone_name?: string;
}

export interface SpxOrderInfo {
  sls_tn?: string;
  spx_tn?: string;
  tracking_code_group_name?: string;
  tracking_code_subgroup_name?: string;
  order_id?: number;
  order_max_update_limit?: number;
}

export interface SpxSlsTrackingInfo {
  sls_tn?: string;
  client_order_id?: string;
  receiver_name?: string;
  receiver_type_name?: string;
  records?: SpxTrackingRecord[];
}

export interface SpxOrderData {
  base_info?: { product_id?: number; order_type?: number };
  parcel_info?: { customer_tracking_no?: string };
  order_info?: SpxOrderInfo;
  sls_tracking_info?: SpxSlsTrackingInfo;
  is_instant_order?: boolean;
  is_shopee_market_order?: boolean;
  has_epod?: boolean;
}

export interface SpxResponse {
  retcode?: number;
  data?: SpxOrderData;
  message?: string;
  detail?: string;
  debug?: string;
}

/* ----------------------------------------------------------- normalized ---- */

export interface TrackingPlace {
  name: string | null;
  latitude: number | null;
  longitude: number | null;
  address: string | null;
}

export interface TrackingEventData {
  trackingCode: string;
  trackingName: string;
  description: string;
  /** ISO 8601, UTC. Formatting into Asia/Jakarta happens at render time. */
  timestamp: string;
  timestampUnix: number;
  milestoneCode: number | null;
  milestoneName: string;
  location: TrackingPlace;
  nextLocation: TrackingPlace;
}

export interface NormalizedTracking {
  trackingNumber: string;
  currentStatus: {
    groupName: string;
    subgroupName: string;
    milestoneCode: number | null;
    milestoneName: string;
  };
  lastUpdated: string | null;
  currentLocation: TrackingPlace;
  /** Chronological: oldest first. */
  events: TrackingEventData[];
}

/** One step of the headline milestone timeline. */
export interface MilestoneStep {
  code: number | null;
  name: string;
  state: 'done' | 'current' | 'upcoming';
  /** The most recent event within this milestone, if it has happened. */
  representative: TrackingEventData | null;
  /** How many raw events sit under this milestone. */
  eventCount: number;
}

/* --------------------------------------------------------- api contract --- */

export type TrackingErrorCode =
  | 'MISSING_TRACKING_NUMBER'
  | 'INVALID_TRACKING_NUMBER'
  | 'NOT_FOUND'
  | 'UPSTREAM_ERROR'
  | 'TIMEOUT'
  | 'NETWORK_ERROR'
  | 'MALFORMED_RESPONSE';

export interface TrackingSuccessPayload {
  ok: true;
  fetchedAt: string;
  /** True when the server is serving sample data because no tracking number is configured. */
  demo: boolean;
  tracking: NormalizedTracking;
}

export interface TrackingErrorPayload {
  ok: false;
  code: TrackingErrorCode;
  message: string;
}

export type TrackingPayload = TrackingSuccessPayload | TrackingErrorPayload;
