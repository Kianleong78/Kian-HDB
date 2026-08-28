/**
 * Singapore Geocoding & Location Intelligence Engine
 * Integrates Singapore Land Authority (SLA) OneMap Open APIs and Google Maps Platform
 */

import { HDBProperty } from '../types';

export interface OneMapSearchResult {
  searchVal: string;
  blockNo: string;
  roadName: string;
  building: string;
  address: string;
  postalCode: string;
  latitude: number;
  longitude: number;
  x: number;
  y: number;
}

export interface GeocodeLocation {
  displayName: string;
  postalCode?: string;
  block?: string;
  roadName?: string;
  town?: string;
  lat: number;
  lng: number;
  isOfficialSla: boolean;
  mrtProximity?: string;
}

// Complete 26 Singapore Towns SLA Centroid Coordinates
export const TOWN_CENTROIDS_MAP: Record<string, { lat: number; lng: number; mrt: string }> = {
  'Ang Mo Kio': { lat: 1.3699, lng: 103.8496, mrt: 'Ang Mo Kio MRT (NS16/CRL)' },
  'Bedok': { lat: 1.3236, lng: 103.9273, mrt: 'Bedok MRT (EW5)' },
  'Bishan': { lat: 1.3508, lng: 103.8481, mrt: 'Bishan MRT (NS17/CC15)' },
  'Bukit Batok': { lat: 1.3490, lng: 103.7496, mrt: 'Bukit Batok MRT (NS2)' },
  'Bukit Merah': { lat: 1.2819, lng: 103.8239, mrt: 'Redhill MRT (EW18)' },
  'Bukit Panjang': { lat: 1.3784, lng: 103.7619, mrt: 'Bukit Panjang MRT (DT1/BP6)' },
  'Bukit Timah': { lat: 1.3329, lng: 103.7774, mrt: 'Beauty World MRT (DT5)' },
  'Central Area': { lat: 1.2789, lng: 103.8425, mrt: 'Outram Park / Tanjong Pagar MRT' },
  'Choa Chu Kang': { lat: 1.3854, lng: 103.7443, mrt: 'Choa Chu Kang MRT (NS4/JS1)' },
  'Clementi': { lat: 1.3151, lng: 103.7652, mrt: 'Clementi MRT (EW23)' },
  'Geylang': { lat: 1.3182, lng: 103.8871, mrt: 'Paya Lebar MRT (EW8/CC9)' },
  'Hougang': { lat: 1.3713, lng: 103.8924, mrt: 'Hougang MRT (NE14/CRL)' },
  'Jurong East': { lat: 1.3331, lng: 103.7423, mrt: 'Jurong East MRT (NS1/EW24/JE5)' },
  'Jurong West': { lat: 1.3404, lng: 103.7060, mrt: 'Boon Lay / Pioneer MRT' },
  'Kallang/Whampoa': { lat: 1.3121, lng: 103.8624, mrt: 'Kallang / Boon Keng MRT' },
  'Marine Parade': { lat: 1.3027, lng: 103.9074, mrt: 'Marine Parade MRT (TEL TE26)' },
  'Pasir Ris': { lat: 1.3732, lng: 103.9493, mrt: 'Pasir Ris MRT (EW1/CP1/CR5)' },
  'Punggol': { lat: 1.4052, lng: 103.9022, mrt: 'Punggol MRT (NE17/CP4)' },
  'Queenstown': { lat: 1.2942, lng: 103.8058, mrt: 'Queenstown MRT (EW19)' },
  'Sembawang': { lat: 1.4491, lng: 103.8201, mrt: 'Sembawang MRT (NS11)' },
  'Sengkang': { lat: 1.3916, lng: 103.8953, mrt: 'Sengkang MRT (NE16/STC)' },
  'Serangoon': { lat: 1.3497, lng: 103.8736, mrt: 'Serangoon MRT (NE12/CC13)' },
  'Tampines': { lat: 1.3533, lng: 103.9452, mrt: 'Tampines MRT (EW2/DT32)' },
  'Toa Payoh': { lat: 1.3343, lng: 103.8563, mrt: 'Toa Payoh MRT (NS19)' },
  'Woodlands': { lat: 1.4368, lng: 103.7865, mrt: 'Woodlands MRT (NS9/TE2)' },
  'Yishun': { lat: 1.4294, lng: 103.8350, mrt: 'Yishun MRT (NS13)' },
};

// Built-in Singapore Key MRT Stations and Towns Coordinates for Instant Fallback
export const KNOWN_SG_LOCATIONS: GeocodeLocation[] = [
  { displayName: 'Tampines MRT & Town Hub', postalCode: '529538', town: 'Tampines', lat: 1.3533, lng: 103.9452, isOfficialSla: true },
  { displayName: 'Blk 458 Tampines St 42', postalCode: '520458', block: '458', roadName: 'Tampines St 42', town: 'Tampines', lat: 1.35798, lng: 103.95455, isOfficialSla: true },
  { displayName: 'Blk 714 Tampines St 71', postalCode: '520714', block: '714', roadName: 'Tampines St 71', town: 'Tampines', lat: 1.3592, lng: 103.9365, isOfficialSla: true },
  { displayName: 'Blk 489A Tampines St 45', postalCode: '520489', block: '489A', roadName: 'Tampines St 45', town: 'Tampines', lat: 1.3615, lng: 103.9578, isOfficialSla: true },
  { displayName: 'Blk 832 Tampines St 82', postalCode: '520832', block: '832', roadName: 'Tampines St 82', town: 'Tampines', lat: 1.3496, lng: 103.9348, isOfficialSla: true },
  { displayName: 'Blk 406 Ang Mo Kio Ave 10', postalCode: '560406', block: '406', roadName: 'Ang Mo Kio Ave 10', town: 'Ang Mo Kio', lat: 1.3628, lng: 103.8552, isOfficialSla: true },
  { displayName: 'Blk 235 Bishan St 22', postalCode: '570235', block: '235', roadName: 'Bishan St 22', town: 'Bishan', lat: 1.3585, lng: 103.8488, isOfficialSla: true },
  { displayName: 'Blk 506 Bedok North Ave 3', postalCode: '460506', block: '506', roadName: 'Bedok North Ave 3', town: 'Bedok', lat: 1.3328, lng: 103.9324, isOfficialSla: true },
  { displayName: 'Blk 634 Punggol Drive', postalCode: '820634', block: '634', roadName: 'Punggol Drive', town: 'Punggol', lat: 1.4018, lng: 103.9125, isOfficialSla: true },
  { displayName: 'Blk 123 Toa Payoh Lor 1', postalCode: '310123', block: '123', roadName: 'Toa Payoh Lor 1', town: 'Toa Payoh', lat: 1.3385, lng: 103.8492, isOfficialSla: true },
  { displayName: 'Bishan MRT Interchange', postalCode: '579827', town: 'Bishan', lat: 1.3508, lng: 103.8481, isOfficialSla: true },
  { displayName: 'Ang Mo Kio MRT Station', postalCode: '569814', town: 'Ang Mo Kio', lat: 1.3699, lng: 103.8496, isOfficialSla: true },
  { displayName: 'Jurong East MRT Interchange', postalCode: '609642', town: 'Jurong East', lat: 1.3331, lng: 103.7423, isOfficialSla: true },
  { displayName: 'Woodlands MRT Station', postalCode: '738343', town: 'Woodlands', lat: 1.4368, lng: 103.7865, isOfficialSla: true },
  { displayName: 'Punggol MRT & Waterway Point', postalCode: '828761', town: 'Punggol', lat: 1.4052, lng: 103.9022, isOfficialSla: true },
  { displayName: 'Pinnacle@Duxton Central Area', postalCode: '085101', town: 'Central Area', lat: 1.2789, lng: 103.8425, isOfficialSla: true },
  { displayName: 'Marine Parade MRT Station', postalCode: '449298', town: 'Marine Parade', lat: 1.3027, lng: 103.9074, isOfficialSla: true },
  { displayName: 'Clementi MRT Station', postalCode: '129588', town: 'Clementi', lat: 1.3151, lng: 103.7652, isOfficialSla: true },
  { displayName: 'Bukit Timah Beauty World', postalCode: '588177', town: 'Bukit Timah', lat: 1.3412, lng: 103.7761, isOfficialSla: true },
  { displayName: 'Sengkang Compass One Hub', postalCode: '545078', town: 'Sengkang', lat: 1.3916, lng: 103.8953, isOfficialSla: true },
  { displayName: 'Yishun Northpoint City Hub', postalCode: '769098', town: 'Yishun', lat: 1.4294, lng: 103.8350, isOfficialSla: true },
  { displayName: 'Sembawang Sun Plaza Hub', postalCode: '757713', town: 'Sembawang', lat: 1.4491, lng: 103.8201, isOfficialSla: true },
  { displayName: 'Bukit Panjang Plaza Hub', postalCode: '677743', town: 'Bukit Panjang', lat: 1.3784, lng: 103.7619, isOfficialSla: true },
  { displayName: 'Choa Chu Kang Lot One Hub', postalCode: '689812', town: 'Choa Chu Kang', lat: 1.3854, lng: 103.7443, isOfficialSla: true },
  { displayName: 'Bukit Batok West Mall Hub', postalCode: '658713', town: 'Bukit Batok', lat: 1.3490, lng: 103.7496, isOfficialSla: true },
  { displayName: 'Jurong West Jurong Point Hub', postalCode: '648886', town: 'Jurong West', lat: 1.3404, lng: 103.7060, isOfficialSla: true },
  { displayName: 'Hougang Mall Hub', postalCode: '538766', town: 'Hougang', lat: 1.3713, lng: 103.8924, isOfficialSla: true },
  { displayName: 'Serangoon NEX Hub', postalCode: '556083', town: 'Serangoon', lat: 1.3497, lng: 103.8736, isOfficialSla: true },
  { displayName: 'Pasir Ris White Sands Hub', postalCode: '518457', town: 'Pasir Ris', lat: 1.3732, lng: 103.9493, isOfficialSla: true },
  { displayName: 'Geylang Paya Lebar Quarter Hub', postalCode: '409057', town: 'Geylang', lat: 1.3182, lng: 103.8871, isOfficialSla: true },
  { displayName: 'Bukit Merah Central Hub', postalCode: '159465', town: 'Bukit Merah', lat: 1.2819, lng: 103.8239, isOfficialSla: true },
  { displayName: 'Kallang Wave & Boon Keng Hub', postalCode: '397629', town: 'Kallang/Whampoa', lat: 1.3121, lng: 103.8624, isOfficialSla: true },
];

/**
 * Resolves latitude and longitude for any HDBProperty
 */
export function getPropertyCoordinates(property: HDBProperty): { lat: number; lng: number } {
  if (property.lat && property.lng) {
    return { lat: property.lat, lng: property.lng };
  }

  // Look up by postal code
  if (property.postalCode) {
    const found = KNOWN_SG_LOCATIONS.find((k) => k.postalCode === property.postalCode);
    if (found) return { lat: found.lat, lng: found.lng };
  }

  // Look up by town centroid map
  if (property.town && TOWN_CENTROIDS_MAP[property.town]) {
    const centroid = TOWN_CENTROIDS_MAP[property.town];
    return { lat: centroid.lat, lng: centroid.lng };
  }

  // Look up by block + town
  const match = KNOWN_SG_LOCATIONS.find(
    (k) =>
      k.town?.toLowerCase() === property.town?.toLowerCase() ||
      (k.block && k.block === property.block)
  );

  if (match) return { lat: match.lat, lng: match.lng };

  // Default Central Singapore coordinates (Toa Payoh / Bishan)
  return { lat: 1.3521, lng: 103.8198 };
}

/**
 * Calculates straight-line distance in meters between two lat/long points (Haversine Formula)
 */
export function calculateDistanceMeters(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371e3; // Earth radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(R * c);
}

/**
 * Query official Singapore Land Authority (SLA) OneMap Geocoder API
 */
export async function geocodeOneMap(query: string): Promise<OneMapSearchResult[]> {
  if (!query || !query.trim()) return [];

  const cleanQuery = query.trim();
  const url = `https://www.onemap.gov.sg/api/common/elastic/search?searchVal=${encodeURIComponent(
    cleanQuery
  )}&returnGeom=Y&getAddrDetails=Y&pageNum=1`;

  try {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`OneMap API HTTP ${res.status}`);
    }
    const data = await res.json();
    if (data && Array.isArray(data.results) && data.results.length > 0) {
      return data.results.map((r: any) => ({
        searchVal: r.SEARCHVAL || '',
        blockNo: r.BLK_NO || '',
        roadName: r.ROAD_NAME || '',
        building: r.BUILDING === 'NIL' ? '' : r.BUILDING || '',
        address: r.ADDRESS || r.SEARCHVAL || '',
        postalCode: r.POSTAL === 'NIL' ? '' : r.POSTAL || '',
        latitude: parseFloat(r.LATITUDE) || 1.3521,
        longitude: parseFloat(r.LONGITUDE) || 103.8198,
        x: parseFloat(r.X) || 0,
        y: parseFloat(r.Y) || 0,
      }));
    }
    throw new Error('No OneMap results, attempting fallback');
  } catch (error) {
    // Fallback to local regex matching across all 26 towns
    const qLower = cleanQuery.toLowerCase();
    const matches = KNOWN_SG_LOCATIONS.filter(
      (loc) =>
        loc.displayName.toLowerCase().includes(qLower) ||
        (loc.postalCode && loc.postalCode.includes(qLower)) ||
        (loc.town && loc.town.toLowerCase().includes(qLower)) ||
        (loc.roadName && loc.roadName.toLowerCase().includes(qLower))
    );

    if (matches.length > 0) {
      return matches.map((m) => ({
        searchVal: m.displayName,
        blockNo: m.block || '',
        roadName: m.roadName || '',
        building: m.displayName,
        address: `${m.displayName} Singapore ${m.postalCode || ''}`,
        postalCode: m.postalCode || '',
        latitude: m.lat,
        longitude: m.lng,
        x: 0,
        y: 0,
      }));
    }

    // Check if query matches any town name
    for (const [townName, townData] of Object.entries(TOWN_CENTROIDS_MAP)) {
      if (townName.toLowerCase().includes(qLower) || qLower.includes(townName.toLowerCase())) {
        return [
          {
            searchVal: `${townName} Town Centre`,
            blockNo: '',
            roadName: townData.mrt,
            building: `${townName} HDB Hub`,
            address: `${townName} Singapore`,
            postalCode: '',
            latitude: townData.lat,
            longitude: townData.lng,
            x: 0,
            y: 0,
          },
        ];
      }
    }

    return [];
  }
}

/**
 * Generate Google Maps URLs for embedded maps, directions, and Street View
 */
export function getGoogleMapsEmbedUrl(lat: number, lng: number, zoom = 16): string {
  return `https://maps.google.com/maps?q=${lat},${lng}&hl=en&z=${zoom}&output=embed`;
}

export function getGoogleMapsDirectUrl(queryOrAddress: string, lat?: number, lng?: number): string {
  if (lat && lng) {
    return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
  }
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(queryOrAddress + ', Singapore')}`;
}

export function getGoogleMapsDirectionsUrl(destination: string, lat?: number, lng?: number): string {
  if (lat && lng) {
    return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=walking`;
  }
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination + ', Singapore')}&travelmode=walking`;
}

export function getGoogleStreetViewUrl(lat: number, lng: number): string {
  return `https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${lat},${lng}`;
}
