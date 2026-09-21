import type { SpxOrderData, SpxTrackingRecord } from './types';

/**
 * A stand-in shipment, used only when SPX_TRACKING_NUMBER is not configured
 * (or SPX_DEMO=true). It keeps the last chapters of the journey viewable while
 * you build, and the API flags it with `demo: true` so the UI can say so.
 *
 * Shape and field names mirror the real payload exactly; nothing here is used
 * once a real tracking number exists.
 */

const HOUR = 3600;

type DemoStep = {
  offsetHours: number;
  tracking_code: string;
  tracking_name: string;
  description: string;
  milestone_code: number;
  milestone_name: string;
  location: { name: string; lat: string; lng: string; address: string };
  next?: { name: string; lat: string; lng: string; address: string };
};

const KEDIRI = {
  name: 'Kediri Hub',
  lat: '-7.848016',
  lng: '112.017829',
  address: 'Jl. Raya Kediri, Kediri, Jawa Timur, 64111',
};

const BEKASI = {
  name: 'Bekasi Sorting Center',
  lat: '-6.238270',
  lng: '106.975571',
  address: 'Jl. Raya Bekasi, Bekasi, Jawa Barat, 17121',
};

const PALEMBANG = {
  name: 'Alang Alang Lebar Hub',
  lat: '-2.924281',
  lng: '104.701181',
  address: 'Jl. Alang Alang Lebar, Palembang, Sumatera Selatan, 30151',
};

const STEPS: DemoStep[] = [
  {
    offsetHours: 96,
    tracking_code: 'F000',
    tracking_name: 'Manifested',
    description: 'Pesanan telah dibuat.',
    milestone_code: 1,
    milestone_name: 'Preparing to ship',
    location: KEDIRI,
  },
  {
    offsetHours: 93,
    tracking_code: 'F049',
    tracking_name: 'Local Seller Input LMTN',
    description: 'Penjual sedang menyiapkan pesanan.',
    milestone_code: 1,
    milestone_name: 'Preparing to ship',
    location: KEDIRI,
  },
  {
    offsetHours: 80,
    tracking_code: 'F100',
    tracking_name: 'Pickup From Domestic Seller',
    description: 'Pesanan telah dijemput oleh kurir.',
    milestone_code: 5,
    milestone_name: 'In transit',
    location: KEDIRI,
  },
  {
    offsetHours: 76,
    tracking_code: 'F440',
    tracking_name: 'Enter Domestic First Mile Hub',
    description: 'Pesanan tiba di lokasi transit.',
    milestone_code: 5,
    milestone_name: 'In transit',
    location: KEDIRI,
  },
  {
    offsetHours: 70,
    tracking_code: 'F450',
    tracking_name: 'Left Domestic First Mile Hub',
    description: 'Pesanan meninggalkan lokasi transit.',
    milestone_code: 5,
    milestone_name: 'In transit',
    location: KEDIRI,
    next: BEKASI,
  },
  {
    offsetHours: 52,
    tracking_code: 'F510',
    tracking_name: 'Enter Domestic Sorting Center',
    description: 'Pesanan diproses di lokasi transit.',
    milestone_code: 5,
    milestone_name: 'In transit',
    location: BEKASI,
  },
  {
    offsetHours: 44,
    tracking_code: 'F540',
    tracking_name: 'Left Domestic Sorting Center',
    description: 'Pesanan meninggalkan lokasi transit.',
    milestone_code: 5,
    milestone_name: 'In transit',
    location: BEKASI,
    next: PALEMBANG,
  },
  {
    offsetHours: 14,
    tracking_code: 'F599',
    tracking_name: 'Enter Last Mile Hub',
    description: 'Pesanan tiba di lokasi transit terakhir.',
    milestone_code: 5,
    milestone_name: 'In transit',
    location: PALEMBANG,
  },
  {
    offsetHours: 3,
    tracking_code: 'F600',
    tracking_name: 'Out For Delivery',
    description: 'Pesanan dalam proses pengantaran.',
    milestone_code: 6,
    milestone_name: 'Out for delivery',
    location: PALEMBANG,
  },
];

const EMPTY_LOCATION = {
  location_name: '',
  location_type_name: '',
  lng: '',
  lat: '',
  full_address: '',
};

export function buildDemoOrderData(): SpxOrderData {
  const now = Math.floor(Date.now() / 1000);

  const records: SpxTrackingRecord[] = STEPS.map((step) => ({
    tracking_code: step.tracking_code,
    tracking_name: step.tracking_name,
    description: step.description,
    display_flag: 1,
    actual_time: now - step.offsetHours * HOUR,
    reason_code: 'R00',
    reason_desc: 'R00',
    epod: '',
    current_location: {
      location_name: step.location.name,
      location_type_name: '',
      lat: step.location.lat,
      lng: step.location.lng,
      full_address: step.location.address,
    },
    next_location: step.next
      ? {
          location_name: step.next.name,
          location_type_name: '',
          lat: step.next.lat,
          lng: step.next.lng,
          full_address: step.next.address,
        }
      : { ...EMPTY_LOCATION },
    delivery_on_hold_times: 0,
    buyer_description: step.description,
    seller_description: step.description,
    milestone_code: step.milestone_code,
    milestone_name: step.milestone_name,
  }))
    // The real API returns newest first.
    .reverse();

  const newest = STEPS[STEPS.length - 1];

  return {
    base_info: { product_id: 80050, order_type: 1 },
    parcel_info: { customer_tracking_no: 'DEMO---000000' },
    order_info: {
      sls_tn: 'ID0000000000000',
      spx_tn: 'SPXIDDEMO00000000',
      tracking_code_group_name: newest.milestone_name,
      tracking_code_subgroup_name: newest.tracking_name,
    },
    sls_tracking_info: {
      sls_tn: 'ID0000000000000',
      client_order_id: '0',
      receiver_name: '',
      receiver_type_name: '',
      records,
    },
    is_instant_order: false,
    is_shopee_market_order: false,
    has_epod: false,
  };
}
