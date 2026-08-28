export interface GovResaleRecord {
  _id: number;
  month: string;
  town: string;
  flat_type: string;
  block: string;
  street_name: string;
  storey_range: string;
  floor_area_sqm: string | number;
  flat_model: string;
  lease_commence_date: string | number;
  remaining_lease: string;
  resale_price: string | number;
  sqft?: number;
  price_psf?: number;
}

export interface GovDatasetColumnMeta {
  name: string;
  columnTitle: string;
  dataType: string;
  index: string;
  isCategorical: boolean;
  description?: string;
}

export interface GovDatasetMetadata {
  datasetId: string;
  name: string;
  description: string;
  managedBy: string;
  format: string;
  coverageStart: string;
  coverageEnd: string;
  lastUpdatedAt: string;
  contactEmails: string[];
  totalRecordsInSource: number;
  endpoints: {
    first5Url: string;
    tampines4RoomUrl: string;
    metadataUrl: string;
    datastoreSearchBase: string;
  };
  columnMetadata: GovDatasetColumnMeta[];
}

export const DATA_GOV_SG_DATASET_ID = 'd_8b84c4ee58e3cfc0ece0d773c8ca6abc';

export const DATA_GOV_SG_ENDPOINTS = {
  first5Url:
    'https://data.gov.sg/api/action/datastore_search?resource_id=d_8b84c4ee58e3cfc0ece0d773c8ca6abc&limit=5',
  tampines4RoomUrl:
    'https://data.gov.sg/api/action/datastore_search?resource_id=d_8b84c4ee58e3cfc0ece0d773c8ca6abc&limit=5&filters=%7B%22town%22%3A%22TAMPINES%22%2C%22flat_type%22%3A%224%20ROOM%22%7D',
  metadataUrl:
    'https://api-production.data.gov.sg/v2/public/api/datasets/d_8b84c4ee58e3cfc0ece0d773c8ca6abc/metadata',
  datastoreSearchBase:
    'https://data.gov.sg/api/action/datastore_search',
};

export const DATA_GOV_SG_METADATA: GovDatasetMetadata = {
  datasetId: DATA_GOV_SG_DATASET_ID,
  name: 'Resale flat prices based on registration date from Jan-2017 onwards',
  description: `Notes:
1. The approximate floor area includes any recess area purchased, space adding item under HDB's upgrading programmes, roof terrace, etc.
2. The transactions exclude resale transactions that may not reflect the full market price such as resale between relatives and resale of part shares.
3. Resale prices should be taken as indicative only as the resale prices agreed between buyers and sellers are dependent on many factors.`,
  managedBy: 'Housing & Development Board (HDB)',
  format: 'CSV / JSON REST API',
  coverageStart: '2017-01-01',
  coverageEnd: 'Present (Continuously Updated)',
  lastUpdatedAt: '2026-08-28',
  contactEmails: ['lau_pei_wen@hdb.gov.sg'],
  totalRecordsInSource: 239196,
  endpoints: DATA_GOV_SG_ENDPOINTS,
  columnMetadata: [
    {
      name: 'month',
      columnTitle: 'Month',
      dataType: 'Month (YYYY-MM)',
      index: '0',
      isCategorical: true,
      description: 'Transaction registration month and year (e.g. 2017-01)',
    },
    {
      name: 'town',
      columnTitle: 'Town',
      dataType: 'Text',
      index: '1',
      isCategorical: true,
      description: 'Designated HDB Town / Estate (e.g. TAMPINES, ANG MO KIO, BISHAN)',
    },
    {
      name: 'flat_type',
      columnTitle: 'Flat Type',
      dataType: 'Text',
      index: '2',
      isCategorical: true,
      description: 'HDB flat room classification (e.g. 2 ROOM, 3 ROOM, 4 ROOM, 5 ROOM, EXECUTIVE)',
    },
    {
      name: 'block',
      columnTitle: 'Block',
      dataType: 'Text',
      index: '3',
      isCategorical: true,
      description: 'HDB residential block number (e.g. 406, 458, 714)',
    },
    {
      name: 'street_name',
      columnTitle: 'Street Name',
      dataType: 'Text',
      index: '4',
      isCategorical: true,
      description: 'Official postal street designation (e.g. ANG MO KIO AVE 10, TAMPINES ST 42)',
    },
    {
      name: 'storey_range',
      columnTitle: 'Storey Range',
      dataType: 'Text',
      index: '5',
      isCategorical: true,
      description: 'Vertical floor elevation bracket (e.g. 01 TO 03, 04 TO 06, 10 TO 12)',
    },
    {
      name: 'floor_area_sqm',
      columnTitle: 'Floor Area Sqm',
      dataType: 'Text / Numeric',
      index: '6',
      isCategorical: true,
      description: 'Usable floor area measured in square meters (sqm)',
    },
    {
      name: 'flat_model',
      columnTitle: 'Flat Model',
      dataType: 'Text',
      index: '7',
      isCategorical: true,
      description: 'HDB architectural layout design (e.g. Improved, New Generation, Model A, Simplified)',
    },
    {
      name: 'lease_commence_date',
      columnTitle: 'Lease Commence Date',
      dataType: 'Text (YYYY)',
      index: '8',
      isCategorical: true,
      description: 'Original 99-year lease commencement year (e.g. 1978, 1988, 1997)',
    },
    {
      name: 'remaining_lease',
      columnTitle: 'Remaining Lease',
      dataType: 'Text',
      index: '9',
      isCategorical: true,
      description: 'Precise tenure balance at transaction point (e.g. 70 years 01 month)',
    },
    {
      name: 'resale_price',
      columnTitle: 'Resale Price',
      dataType: 'Numeric (SGD)',
      index: '10',
      isCategorical: false,
      description: 'Officially registered transacted resale consideration in Singapore Dollars ($SGD)',
    },
  ],
};

/**
 * # 1. First 5 Resale Transactions (Jan 2017 onwards)
 * Endpoint: https://data.gov.sg/api/action/datastore_search?resource_id=d_8b84c4ee58e3cfc0ece0d773c8ca6abc&limit=5
 */
export const FIRST_5_GOV_RESALE_TRANSACTIONS: GovResaleRecord[] = [
  {
    _id: 1,
    month: '2017-01',
    town: 'ANG MO KIO',
    flat_type: '2 ROOM',
    block: '406',
    street_name: 'ANG MO KIO AVE 10',
    storey_range: '10 TO 12',
    floor_area_sqm: '44',
    flat_model: 'Improved',
    lease_commence_date: '1979',
    remaining_lease: '61 years 04 months',
    resale_price: '232000',
    sqft: 474,
    price_psf: 489,
  },
  {
    _id: 2,
    month: '2017-01',
    town: 'ANG MO KIO',
    flat_type: '3 ROOM',
    block: '108',
    street_name: 'ANG MO KIO AVE 4',
    storey_range: '01 TO 03',
    floor_area_sqm: '67',
    flat_model: 'New Generation',
    lease_commence_date: '1978',
    remaining_lease: '60 years 07 months',
    resale_price: '250000',
    sqft: 721,
    price_psf: 347,
  },
  {
    _id: 3,
    month: '2017-01',
    town: 'ANG MO KIO',
    flat_type: '3 ROOM',
    block: '602',
    street_name: 'ANG MO KIO AVE 5',
    storey_range: '01 TO 03',
    floor_area_sqm: '67',
    flat_model: 'New Generation',
    lease_commence_date: '1980',
    remaining_lease: '62 years 05 months',
    resale_price: '262000',
    sqft: 721,
    price_psf: 363,
  },
  {
    _id: 4,
    month: '2017-01',
    town: 'ANG MO KIO',
    flat_type: '3 ROOM',
    block: '465',
    street_name: 'ANG MO KIO AVE 10',
    storey_range: '04 TO 06',
    floor_area_sqm: '68',
    flat_model: 'New Generation',
    lease_commence_date: '1980',
    remaining_lease: '62 years 01 month',
    resale_price: '265000',
    sqft: 732,
    price_psf: 362,
  },
  {
    _id: 5,
    month: '2017-01',
    town: 'ANG MO KIO',
    flat_type: '3 ROOM',
    block: '601',
    street_name: 'ANG MO KIO AVE 5',
    storey_range: '01 TO 03',
    floor_area_sqm: '67',
    flat_model: 'New Generation',
    lease_commence_date: '1980',
    remaining_lease: '62 years 05 months',
    resale_price: '265000',
    sqft: 721,
    price_psf: 367,
  },
];

/**
 * # 2. Filtered: 4-room flats in Tampines
 * Endpoint: https://data.gov.sg/api/action/datastore_search?resource_id=d_8b84c4ee58e3cfc0ece0d773c8ca6abc&limit=5&filters=%7B%22town%22%3A%22TAMPINES%22%2C%22flat_type%22%3A%224%20ROOM%22%7D
 */
export const TAMPINES_4ROOM_GOV_RESALE_TRANSACTIONS: GovResaleRecord[] = [
  {
    _id: 940,
    month: '2017-01',
    town: 'TAMPINES',
    flat_type: '4 ROOM',
    block: '458',
    street_name: 'TAMPINES ST 42',
    storey_range: '10 TO 12',
    floor_area_sqm: '84',
    flat_model: 'Simplified',
    lease_commence_date: '1988',
    remaining_lease: '70 years 01 month',
    resale_price: '370000',
    sqft: 904,
    price_psf: 409,
  },
  {
    _id: 941,
    month: '2017-01',
    town: 'TAMPINES',
    flat_type: '4 ROOM',
    block: '714',
    street_name: 'TAMPINES ST 71',
    storey_range: '01 TO 03',
    floor_area_sqm: '100',
    flat_model: 'Model A',
    lease_commence_date: '1997',
    remaining_lease: '79 years 02 months',
    resale_price: '385000',
    sqft: 1076,
    price_psf: 358,
  },
  {
    _id: 942,
    month: '2017-01',
    town: 'TAMPINES',
    flat_type: '4 ROOM',
    block: '489A',
    street_name: 'TAMPINES ST 45',
    storey_range: '10 TO 12',
    floor_area_sqm: '104',
    flat_model: 'Model A',
    lease_commence_date: '1989',
    remaining_lease: '71 years 05 months',
    resale_price: '394000',
    sqft: 1119,
    price_psf: 352,
  },
  {
    _id: 943,
    month: '2017-01',
    town: 'TAMPINES',
    flat_type: '4 ROOM',
    block: '369',
    street_name: 'TAMPINES ST 34',
    storey_range: '01 TO 03',
    floor_area_sqm: '100',
    flat_model: 'Model A',
    lease_commence_date: '1997',
    remaining_lease: '79 years 02 months',
    resale_price: '395000',
    sqft: 1076,
    price_psf: 367,
  },
  {
    _id: 944,
    month: '2017-01',
    town: 'TAMPINES',
    flat_type: '4 ROOM',
    block: '832',
    street_name: 'TAMPINES ST 82',
    storey_range: '04 TO 06',
    floor_area_sqm: '84',
    flat_model: 'Simplified',
    lease_commence_date: '1984',
    remaining_lease: '66 years 11 months',
    resale_price: '398000',
    sqft: 904,
    price_psf: 440,
  },
];

/**
 * Helper to fetch transactions with optional filters and limits from data.gov.sg
 */
export async function fetchGovResaleData(options?: {
  limit?: number;
  town?: string;
  flatType?: string;
  offset?: number;
}): Promise<{ records: GovResaleRecord[]; total: number; apiUrl: string }> {
  const limit = options?.limit || 5;
  const params = new URLSearchParams();
  params.set('resource_id', DATA_GOV_SG_DATASET_ID);
  params.set('limit', String(limit));

  if (options?.offset) {
    params.set('offset', String(options.offset));
  }

  const filtersObj: Record<string, string> = {};
  if (options?.town && options.town !== 'ALL') {
    filtersObj.town = options.town.toUpperCase();
  }
  if (options?.flatType && options.flatType !== 'ALL') {
    filtersObj.flat_type = options.flatType.toUpperCase();
  }

  if (Object.keys(filtersObj).length > 0) {
    params.set('filters', JSON.stringify(filtersObj));
  }

  const apiUrl = `${DATA_GOV_SG_ENDPOINTS.datastoreSearchBase}?${params.toString()}`;
  const response = await fetch(apiUrl);
  if (!response.ok) {
    throw new Error(`Data.gov.sg HTTP ${response.status}: ${response.statusText}`);
  }

  const json = await response.json();
  if (!json.success || !json.result?.records) {
    throw new Error('Invalid response structure from Data.gov.sg');
  }

  const records: GovResaleRecord[] = json.result.records.map((r: any) => {
    const sqm = parseFloat(r.floor_area_sqm) || 0;
    const sqft = Math.round(sqm * 10.7639);
    const price = parseFloat(r.resale_price) || 0;
    const psf = sqft > 0 ? Math.round(price / sqft) : 0;
    return {
      ...r,
      sqft,
      price_psf: psf,
    };
  });

  return {
    records,
    total: json.result.total || records.length,
    apiUrl,
  };
}

/**
 * Helper to fetch Dataset Metadata from V2 endpoint
 */
export async function fetchGovDatasetMetadataApi(): Promise<any> {
  const response = await fetch(DATA_GOV_SG_ENDPOINTS.metadataUrl);
  if (!response.ok) {
    throw new Error(`Metadata API HTTP ${response.status}`);
  }
  const json = await response.json();
  return json.data;
}
