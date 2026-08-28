import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  MapPin,
  Compass,
  CheckCircle2,
  Navigation,
  Sparkles,
  RefreshCw,
  Sliders,
  X,
  ExternalLink,
  ChevronRight,
  Info,
} from 'lucide-react';
import {
  geocodeOneMap,
  OneMapSearchResult,
  KNOWN_SG_LOCATIONS,
  calculateDistanceMeters,
  getGoogleMapsDirectUrl,
} from '../utils/geocoding';
import { HDBProperty } from '../types';

interface OneMapLocationSearchProps {
  properties: HDBProperty[];
  onSelectProperty?: (prop: HDBProperty) => void;
  onFilterByDistance?: (centerLat: number, centerLng: number, maxRadiusKm: number) => void;
  onResetLocationFilter?: () => void;
}

export const OneMapLocationSearch: React.FC<OneMapLocationSearchProps> = ({
  properties,
  onSelectProperty,
  onFilterByDistance,
  onResetLocationFilter,
}) => {
  const [searchInput, setSearchInput] = useState('');
  const [suggestions, setSuggestions] = useState<OneMapSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [activeResolvedLocation, setActiveResolvedLocation] = useState<OneMapSearchResult | null>(null);
  const [radiusKm, setRadiusKm] = useState<number>(3); // default 3km
  const [statusText, setStatusText] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Debounced search with SLA OneMap
  useEffect(() => {
    if (!searchInput.trim() || searchInput.trim().length < 2) {
      setSuggestions([]);
      setIsDropdownOpen(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const results = await geocodeOneMap(searchInput);
        setSuggestions(results.slice(0, 5));
        setIsDropdownOpen(results.length > 0);
      } catch (err) {
        console.warn('Geocoding search err:', err);
      } finally {
        setIsLoading(false);
      }
    }, 280);

    return () => clearTimeout(timer);
  }, [searchInput]);

  // Handle clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectLocation = (loc: OneMapSearchResult) => {
    setActiveResolvedLocation(loc);
    setSearchInput(loc.address || loc.searchVal);
    setIsDropdownOpen(false);
    setStatusText(`Resolved to SLA Coordinates (${loc.latitude.toFixed(4)}, ${loc.longitude.toFixed(4)})`);

    if (onFilterByDistance) {
      onFilterByDistance(loc.latitude, loc.longitude, radiusKm);
    }
  };

  const handleApplyQuickPreset = (presetSearch: string) => {
    setSearchInput(presetSearch);
    // Find in known locations
    const known = KNOWN_SG_LOCATIONS.find(
      (k) =>
        k.displayName.toLowerCase().includes(presetSearch.toLowerCase()) ||
        (k.postalCode && k.postalCode === presetSearch)
    );

    if (known) {
      const formatted: OneMapSearchResult = {
        searchVal: known.displayName,
        blockNo: known.block || '',
        roadName: known.roadName || '',
        building: known.displayName,
        address: `${known.displayName} Singapore ${known.postalCode || ''}`,
        postalCode: known.postalCode || '',
        latitude: known.lat,
        longitude: known.lng,
        x: 0,
        y: 0,
      };
      handleSelectLocation(formatted);
    }
  };

  const handleClearLocation = () => {
    setSearchInput('');
    setActiveResolvedLocation(null);
    setSuggestions([]);
    setStatusText(null);
    if (onResetLocationFilter) {
      onResetLocationFilter();
    }
  };

  const handleRadiusChange = (newRadius: number) => {
    setRadiusKm(newRadius);
    if (activeResolvedLocation && onFilterByDistance) {
      onFilterByDistance(activeResolvedLocation.latitude, activeResolvedLocation.longitude, newRadius);
    }
  };

  return (
    <div
      ref={containerRef}
      id="onemap-location-search-box"
      className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4 text-slate-800 dark:text-slate-100 transition-colors"
    >
      {/* Top Header & Official SLA Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800/80 pb-3">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
            <Compass className="w-4 h-4" />
          </span>
          <div>
            <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
              <span>Singapore OneMap Geocoding & Proximity Radar</span>
              <span className="text-[10px] uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold border border-emerald-300 dark:border-emerald-700">
                SLA Open API
              </span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Type any 6-digit postal code (e.g. 520458, 560406), MRT station, or block to filter HDBs by proximity.
            </p>
          </div>
        </div>

        {activeResolvedLocation && (
          <button
            onClick={handleClearLocation}
            className="inline-flex items-center gap-1 text-xs text-rose-500 hover:text-rose-600 dark:text-rose-400 font-bold self-start sm:self-center"
          >
            <X className="w-3.5 h-3.5" />
            <span>Reset Location</span>
          </button>
        )}
      </div>

      {/* Input Bar with Loading Indicator */}
      <div className="relative">
        <div className="relative flex items-center">
          <div className="absolute left-3.5 text-slate-400 pointer-events-none">
            {isLoading ? <RefreshCw className="w-4 h-4 animate-spin text-emerald-500" /> : <Search className="w-4 h-4" />}
          </div>

          <input
            id="onemap-search-input"
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onFocus={() => {
              if (suggestions.length > 0) setIsDropdownOpen(true);
            }}
            placeholder="Search by 6-digit Postal Code (e.g. 520458), MRT (e.g. Tampines MRT), or Street..."
            className="w-full pl-10 pr-24 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 dark:focus:border-emerald-500 shadow-inner"
          />

          <div className="absolute right-2 flex items-center gap-1">
            {searchInput && (
              <button
                onClick={() => setSearchInput('')}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-lg"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              onClick={() => {
                if (suggestions.length > 0) handleSelectLocation(suggestions[0]);
              }}
              className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl text-xs font-black transition shadow-sm"
            >
              Geocode
            </button>
          </div>
        </div>

        {/* Dropdown Suggestions List */}
        {isDropdownOpen && suggestions.length > 0 && (
          <div className="absolute left-0 right-0 top-full mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl z-50 overflow-hidden divide-y divide-slate-100 dark:divide-slate-800">
            <div className="px-3.5 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-50 dark:bg-slate-950 flex items-center justify-between">
              <span>OneMap SLA Geocoded Matches</span>
              <span className="font-mono text-emerald-500">Live API</span>
            </div>

            {suggestions.map((sug, idx) => (
              <button
                key={`${sug.postalCode}-${idx}`}
                onClick={() => handleSelectLocation(sug)}
                className="w-full text-left p-3 hover:bg-emerald-50 dark:hover:bg-slate-800/80 transition flex items-center justify-between gap-3 group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 group-hover:bg-emerald-500 group-hover:text-slate-950 text-slate-600 dark:text-slate-300 transition">
                    <MapPin className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition">
                      {sug.building || sug.searchVal}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                      {sug.address}
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  {sug.postalCode && (
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono text-[10px] font-bold border border-slate-200 dark:border-slate-700">
                      S({sug.postalCode})
                    </span>
                  )}
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-500 inline ml-1" />
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Quick Postal Code & Landmark Test Chips */}
      <div className="flex flex-wrap items-center gap-1.5 text-xs">
        <span className="text-[11px] font-bold text-slate-400 mr-1">Quick SG Test Points:</span>
        <button
          onClick={() => handleApplyQuickPreset('520458')}
          className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-emerald-500/10 hover:border-emerald-500/40 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-[11px] font-semibold transition"
        >
          📍 Blk 458 Tampines (520458)
        </button>
        <button
          onClick={() => handleApplyQuickPreset('560406')}
          className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-emerald-500/10 hover:border-emerald-500/40 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-[11px] font-semibold transition"
        >
          📍 Blk 406 AMK (560406)
        </button>
        <button
          onClick={() => handleApplyQuickPreset('570235')}
          className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-emerald-500/10 hover:border-emerald-500/40 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-[11px] font-semibold transition"
        >
          📍 Blk 235 Bishan (570235)
        </button>
        <button
          onClick={() => handleApplyQuickPreset('Tampines MRT')}
          className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-emerald-500/10 hover:border-emerald-500/40 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-[11px] font-semibold transition"
        >
          🚇 Tampines MRT (529538)
        </button>
      </div>

      {/* Geocoded Active Location Banner & Distance Filter Slider */}
      {activeResolvedLocation && (
        <div className="bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-500/30 rounded-2xl p-4 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <div>
                <div className="text-xs font-black text-emerald-800 dark:text-emerald-300">
                  {activeResolvedLocation.building || activeResolvedLocation.searchVal}
                </div>
                <div className="text-[11px] text-slate-600 dark:text-slate-400 font-mono">
                  {activeResolvedLocation.address} • Lat: {activeResolvedLocation.latitude.toFixed(4)}, Lng: {activeResolvedLocation.longitude.toFixed(4)}
                </div>
              </div>
            </div>

            <a
              href={getGoogleMapsDirectUrl(activeResolvedLocation.address, activeResolvedLocation.latitude, activeResolvedLocation.longitude)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-emerald-300 dark:border-emerald-700 text-xs font-bold text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 transition shadow-sm self-start sm:self-center"
            >
              <span>View in Google Maps</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {/* Proximity Radius Selector */}
          <div className="pt-2 border-t border-emerald-500/20 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-700 dark:text-slate-300">Proximity Radius:</span>
              <span className="font-mono font-black text-emerald-600 dark:text-emerald-400">Within {radiusKm} km</span>
            </div>

            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 5, 10].map((r) => (
                <button
                  key={r}
                  onClick={() => handleRadiusChange(r)}
                  className={`px-2.5 py-1 rounded-xl text-xs font-bold transition ${
                    radiusKm === r
                      ? 'bg-emerald-500 text-slate-950 shadow-md font-black'
                      : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-emerald-400'
                  }`}
                >
                  {r}km
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
