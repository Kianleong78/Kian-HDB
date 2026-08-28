import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  SlidersHorizontal,
  ArrowUpDown,
  Building2,
  Sparkles,
  MapPin,
  CheckCircle2,
  GitCompare,
  ArrowRight,
  TrendingDown,
  TrendingUp,
  RotateCcw,
  LayoutGrid,
  List,
  Compass,
  Train,
  Clock,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { HDBProperty, NavigationTab } from '../types';
import { PropertyCommentCountBadge } from '../components/DisqusComments';
import { OneMapLocationSearch } from '../components/OneMapLocationSearch';
import { calculateDistanceMeters, getPropertyCoordinates } from '../utils/geocoding';
import { useTheme } from '../context/ThemeContext';

interface PropertySearchViewProps {
  properties: HDBProperty[];
  selectedProperty: HDBProperty;
  setSelectedProperty: (prop: HDBProperty) => void;
  setActiveTab: (tab: NavigationTab) => void;
  comparisonList: HDBProperty[];
  toggleComparison: (prop: HDBProperty) => void;
}

export const PropertySearchView: React.FC<PropertySearchViewProps> = ({
  properties,
  selectedProperty,
  setSelectedProperty,
  setActiveTab,
  comparisonList,
  toggleComparison,
}) => {
  const { viewMode } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTown, setSelectedTown] = useState('All');
  const [selectedFlatType, setSelectedFlatType] = useState('All');
  const [selectedVerdict, setSelectedVerdict] = useState('All');
  const [maxPrice, setMaxPrice] = useState<number>(1500000);
  const [minLease, setMinLease] = useState<number>(50);
  const [nearMrtOnly, setNearMrtOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'aiScore' | 'priceLow' | 'priceHigh' | 'psfLow' | 'lease' | 'distance'>('aiScore');
  const [viewLayout, setViewLayout] = useState<'grid' | 'list'>('grid');

  // Geocoded center filter state
  const [geoFilter, setGeoFilter] = useState<{ centerLat: number; centerLng: number; maxRadiusKm: number } | null>(null);

  // Available unique towns
  const availableTowns = useMemo(() => {
    const set = new Set<string>();
    properties.forEach((p) => set.add(p.town));
    return Array.from(set).sort();
  }, [properties]);

  // Available flat types
  const availableFlatTypes = useMemo(() => {
    const set = new Set<string>();
    properties.forEach((p) => set.add(p.flatType));
    return Array.from(set).sort();
  }, [properties]);

  const handleFilterByDistance = (centerLat: number, centerLng: number, maxRadiusKm: number) => {
    setGeoFilter({ centerLat, centerLng, maxRadiusKm });
    setSortBy('distance');
  };

  const handleResetLocationFilter = () => {
    setGeoFilter(null);
    setSortBy('aiScore');
  };

  // Filtered properties with location proximity calculation
  const filteredProperties = useMemo(() => {
    return properties
      .map((p) => {
        let distanceToGeoCenter: number | undefined = undefined;
        if (geoFilter) {
          const coords = getPropertyCoordinates(p);
          distanceToGeoCenter = calculateDistanceMeters(
            geoFilter.centerLat,
            geoFilter.centerLng,
            coords.lat,
            coords.lng
          );
        }
        return { ...p, distanceToGeoCenter };
      })
      .filter((p) => {
        if (selectedTown !== 'All' && p.town !== selectedTown) return false;
        if (selectedFlatType !== 'All' && p.flatType !== selectedFlatType) return false;
        if (selectedVerdict !== 'All' && p.verdict !== selectedVerdict) return false;
        if (p.askingPrice > maxPrice) return false;
        if (p.remainingLease < minLease) return false;
        if (nearMrtOnly && p.mrtDistance > 500) return false;

        // Proximity radius filter
        if (geoFilter && p.distanceToGeoCenter !== undefined) {
          if (p.distanceToGeoCenter > geoFilter.maxRadiusKm * 1000) {
            return false;
          }
        }

        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const match =
            p.town.toLowerCase().includes(q) ||
            p.streetName.toLowerCase().includes(q) ||
            p.block.toLowerCase().includes(q) ||
            p.topSchool.toLowerCase().includes(q) ||
            p.mrtStation.toLowerCase().includes(q);
          if (!match) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'distance' && a.distanceToGeoCenter !== undefined && b.distanceToGeoCenter !== undefined) {
          return a.distanceToGeoCenter - b.distanceToGeoCenter;
        }
        if (sortBy === 'aiScore') return b.aiMarketScore - a.aiMarketScore;
        if (sortBy === 'priceLow') return a.askingPrice - b.askingPrice;
        if (sortBy === 'priceHigh') return b.askingPrice - a.askingPrice;
        if (sortBy === 'psfLow') return a.pricePsf - b.pricePsf;
        if (sortBy === 'lease') return b.remainingLease - a.remainingLease;
        return 0;
      });
  }, [
    properties,
    selectedTown,
    selectedFlatType,
    selectedVerdict,
    maxPrice,
    minLease,
    nearMrtOnly,
    searchQuery,
    sortBy,
    geoFilter,
  ]);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedTown('All');
    setSelectedFlatType('All');
    setSelectedVerdict('All');
    setMaxPrice(1500000);
    setMinLease(50);
    setNearMrtOnly(false);
    setSortBy('aiScore');
    setGeoFilter(null);
  };

  const handleSelect = (prop: HDBProperty) => {
    setSelectedProperty(prop);
    setActiveTab('analysis');
  };

  const handleOpenReport = (prop: HDBProperty) => {
    setSelectedProperty(prop);
    setActiveTab('final-report');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 text-slate-800 dark:text-slate-100 transition-colors">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
            <Search className="w-3.5 h-3.5" />
            <span>Singapore HDB Resale Explorer</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
            Property Search & Valuation Radar
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {viewMode === 'simple'
              ? 'Find fair deals, compare asking prices, and check walking distances to MRT.'
              : 'Algorithmic fair value, Monte Carlo distribution ranges, and SLA OneMap proximity.'}
          </p>
        </div>

        {/* View toggles & Quick counter */}
        <div className="flex items-center gap-3">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-3.5 py-2 rounded-2xl text-xs text-slate-600 dark:text-slate-300 shadow-sm">
            Found <span className="font-black text-emerald-600 dark:text-emerald-400 font-mono text-sm">{filteredProperties.length}</span> properties
          </div>
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-1 rounded-2xl flex items-center gap-1 shadow-sm">
            <button
              id="view-layout-grid"
              onClick={() => setViewLayout('grid')}
              className={`p-2 rounded-xl transition-colors ${
                viewLayout === 'grid'
                  ? 'bg-slate-100 dark:bg-slate-800 text-emerald-600 dark:text-emerald-400'
                  : 'text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              id="view-layout-list"
              onClick={() => setViewLayout('list')}
              className={`p-2 rounded-xl transition-colors ${
                viewLayout === 'list'
                  ? 'bg-slate-100 dark:bg-slate-800 text-emerald-600 dark:text-emerald-400'
                  : 'text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
              title="List View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* SLA OneMap Geocoding & Proximity Radar Box */}
      <OneMapLocationSearch
        properties={properties}
        onSelectProperty={handleSelect}
        onFilterByDistance={handleFilterByDistance}
        onResetLocationFilter={handleResetLocationFilter}
      />

      {/* Filter Control Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Town Filter */}
          <div>
            <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5">
              Town / Estate
            </label>
            <select
              id="filter-town"
              value={selectedTown}
              onChange={(e) => setSelectedTown(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs font-medium rounded-xl px-3 py-2.5 focus:outline-none focus:border-emerald-500"
            >
              <option value="All">All Towns ({properties.length})</option>
              {availableTowns.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          {/* Flat Type Filter */}
          <div>
            <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5">
              Flat Type
            </label>
            <select
              id="filter-flat-type"
              value={selectedFlatType}
              onChange={(e) => setSelectedFlatType(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs font-medium rounded-xl px-3 py-2.5 focus:outline-none focus:border-emerald-500"
            >
              <option value="All">All Flat Types</option>
              {availableFlatTypes.map((ft) => (
                <option key={ft} value={ft}>
                  {ft}
                </option>
              ))}
            </select>
          </div>

          {/* AI Valuation Verdict */}
          <div>
            <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5">
              AI Valuation Verdict
            </label>
            <select
              id="filter-verdict"
              value={selectedVerdict}
              onChange={(e) => setSelectedVerdict(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs font-medium rounded-xl px-3 py-2.5 focus:outline-none focus:border-emerald-500"
            >
              <option value="All">All Valuation Statuses</option>
              <option value="Good Value">Good Value</option>
              <option value="Fairly Priced">Fairly Priced</option>
              <option value="Above Market">Above Market</option>
              <option value="Strong Growth">Strong Growth</option>
              <option value="Monitor">Monitor</option>
            </select>
          </div>

          {/* Sort By */}
          <div>
            <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5">
              Sort Results
            </label>
            <select
              id="filter-sort-by"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs font-medium rounded-xl px-3 py-2.5 focus:outline-none focus:border-emerald-500"
            >
              {geoFilter && <option value="distance">📍 Distance to Searched Location</option>}
              <option value="aiScore">AI Overall Score (High to Low)</option>
              <option value="priceLow">Price: Lowest First</option>
              <option value="priceHigh">Price: Highest First</option>
              <option value="psfLow">Price PSF: Lowest First</option>
              <option value="lease">Remaining Lease: Longest First</option>
            </select>
          </div>
        </div>

        {/* Sliders & Quick Toggles */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
          {/* Max Price Slider */}
          <div>
            <div className="flex justify-between text-[11px] mb-1 font-bold text-slate-600 dark:text-slate-400">
              <span>Max Asking Price:</span>
              <span className="font-mono text-emerald-600 dark:text-emerald-400">
                S${(maxPrice / 1000).toFixed(0)}k
              </span>
            </div>
            <input
              type="range"
              min="300000"
              max="1500000"
              step="25000"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
          </div>

          {/* Min Lease Slider */}
          <div>
            <div className="flex justify-between text-[11px] mb-1 font-bold text-slate-600 dark:text-slate-400">
              <span>Min Remaining Lease:</span>
              <span className="font-mono text-sky-600 dark:text-sky-400">{minLease} Years</span>
            </div>
            <input
              type="range"
              min="50"
              max="99"
              step="1"
              value={minLease}
              onChange={(e) => setMinLease(Number(e.target.value))}
              className="w-full accent-sky-500 cursor-pointer"
            />
          </div>

          {/* Quick Checkboxes & Reset */}
          <div className="flex items-center justify-between gap-2 pt-2">
            <label className="flex items-center gap-2 cursor-pointer select-none font-bold text-slate-700 dark:text-slate-300">
              <input
                type="checkbox"
                checked={nearMrtOnly}
                onChange={(e) => setNearMrtOnly(e.target.checked)}
                className="w-4 h-4 rounded text-emerald-500 focus:ring-emerald-500 accent-emerald-500"
              />
              <span>&lt; 500m to MRT</span>
            </label>

            <button
              id="btn-reset-filters"
              onClick={resetFilters}
              className="inline-flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 font-bold"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>
        </div>
      </div>

      {/* Properties Display (Grid or List) */}
      {filteredProperties.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 mx-auto flex items-center justify-center text-slate-400">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-base font-black text-slate-900 dark:text-white">No properties match the selected criteria</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            Try expanding your price range or clearing the location proximity radius to see available HDB flats.
          </p>
          <button
            onClick={resetFilters}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black rounded-xl transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset All Filters</span>
          </button>
        </div>
      ) : viewLayout === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.map((prop) => {
            const isComparing = comparisonList.some((c) => c.id === prop.id);
            const isSelected = selectedProperty.id === prop.id;
            const isGoodValue = prop.verdict === 'Good Value';
            const priceDelta = prop.askingPrice - prop.aiValuation;

            return (
              <div
                key={prop.id}
                id={`property-card-${prop.id}`}
                className={`bg-white dark:bg-slate-900 border rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all flex flex-col justify-between group ${
                  isSelected
                    ? 'border-emerald-500 ring-2 ring-emerald-500/20'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div>
                  {/* Image & Valuation Badge */}
                  <div className="relative h-48 bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <img
                      src={prop.imageUrl}
                      alt={`Blk ${prop.block} ${prop.streetName}`}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />

                    {/* Verdict Tag */}
                    <div className="absolute top-3 left-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider shadow-md backdrop-blur-md ${
                          isGoodValue
                            ? 'bg-emerald-500 text-slate-950'
                            : 'bg-sky-500 text-slate-950'
                        }`}
                      >
                        {prop.verdict}
                      </span>
                    </div>

                    {/* Proximity Distance badge if geocoded */}
                    {prop.distanceToGeoCenter !== undefined && (
                      <div className="absolute top-3 right-3 bg-slate-950/90 text-emerald-400 px-2.5 py-1 rounded-full text-xs font-bold font-mono border border-emerald-500/40 flex items-center gap-1 shadow-md">
                        <Compass className="w-3 h-3" />
                        <span>{(prop.distanceToGeoCenter / 1000).toFixed(1)} km away</span>
                      </div>
                    )}

                    {/* Disqus Comments Count badge */}
                    <div className="absolute bottom-3 right-3">
                      <PropertyCommentCountBadge property={prop} />
                    </div>

                    {/* Basic specs on image */}
                    <div className="absolute bottom-3 left-3 text-white">
                      <div className="text-xs font-medium text-emerald-300 font-mono">{prop.flatType} • {prop.model}</div>
                      <h3 className="text-base font-black leading-tight">Blk {prop.block} {prop.streetName}</h3>
                    </div>
                  </div>

                  {/* Body Details */}
                  <div className="p-5 space-y-4">
                    {/* Price & Valuation Difference */}
                    <div className="flex items-end justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                      <div>
                        <div className="text-[10px] uppercase font-bold text-slate-400">Asking Price</div>
                        <div className="text-xl font-black text-slate-900 dark:text-white font-mono">
                          S${prop.askingPrice.toLocaleString()}
                        </div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                          S${prop.pricePsf} PSF • {prop.sqm} sqm ({prop.sqft} sqft)
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-[10px] uppercase font-bold text-slate-400">AI Fair Value</div>
                        <div className="text-base font-black text-emerald-600 dark:text-emerald-400 font-mono">
                          S${prop.aiValuation.toLocaleString()}
                        </div>
                        <div
                          className={`text-[10px] font-bold font-mono ${
                            prop.askingPrice < prop.aiValuation ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'
                          }`}
                        >
                          {prop.askingPrice < prop.aiValuation
                            ? `-S$${(prop.aiValuation - prop.askingPrice).toLocaleString()} (Save ${(
                                ((prop.aiValuation - prop.askingPrice) / prop.aiValuation) *
                                100
                              ).toFixed(1)}%)`
                            : `+S$${(prop.askingPrice - prop.aiValuation).toLocaleString()} Over`}
                        </div>
                      </div>
                    </div>

                    {/* Quick Specs Grid */}
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800/80">
                        <Train className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <div className="truncate">
                          <div className="text-[9px] text-slate-400 uppercase font-bold">Nearest MRT</div>
                          <div className="font-bold text-slate-800 dark:text-slate-200 truncate">{prop.mrtStation} ({prop.mrtDistance}m)</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800/80">
                        <Clock className="w-3.5 h-3.5 text-sky-500 shrink-0" />
                        <div>
                          <div className="text-[9px] text-slate-400 uppercase font-bold">Remaining Lease</div>
                          <div className="font-bold text-slate-800 dark:text-slate-200">{prop.remainingLease} Years Left</div>
                        </div>
                      </div>
                    </div>

                    {/* Pro Mode: Location & AI Valuation Score breakdown */}
                    {viewMode === 'pro' && (
                      <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs font-mono">
                        <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
                          <span>AI Market Score:</span>
                          <span className="font-black text-emerald-600 dark:text-emerald-400">{prop.aiMarketScore}/100</span>
                        </div>
                        <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
                          <span>Location Score:</span>
                          <span className="font-black text-sky-600 dark:text-sky-400">{prop.locationScores.overallLocationScore}/100</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Actions */}
                <div className="p-5 pt-0 flex items-center gap-2">
                  <button
                    id={`btn-compare-${prop.id}`}
                    onClick={() => toggleComparison(prop)}
                    className={`p-2.5 rounded-2xl border text-xs font-bold transition-all ${
                      isComparing
                        ? 'bg-emerald-500 text-slate-950 border-emerald-500 shadow-md'
                        : 'bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-emerald-500'
                    }`}
                    title={isComparing ? 'Remove from Comparison' : 'Add to Comparison'}
                  >
                    <GitCompare className="w-4 h-4" />
                  </button>

                  <button
                    id={`btn-inspect-${prop.id}`}
                    onClick={() => handleSelect(prop)}
                    className="flex-1 py-2.5 px-4 bg-slate-900 text-white dark:bg-emerald-500 dark:text-slate-950 hover:opacity-90 rounded-2xl text-xs font-black transition flex items-center justify-center gap-1.5 shadow-md"
                  >
                    <span>Valuate & Map</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    id={`btn-report-${prop.id}`}
                    onClick={() => handleOpenReport(prop)}
                    className="p-2.5 rounded-2xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-xs font-bold transition"
                    title="Generate Comprehensive AI Report"
                  >
                    <Sparkles className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* List View */
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-slate-950 text-[10px] uppercase font-black tracking-wider text-slate-400 border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-4 px-4">Property</th>
                  <th className="py-4 px-4">Flat Type</th>
                  <th className="py-4 px-4">Remaining Lease</th>
                  <th className="py-4 px-4">MRT Proximity</th>
                  <th className="py-4 px-4 text-right">Asking Price</th>
                  <th className="py-4 px-4 text-right">AI Fair Value</th>
                  <th className="py-4 px-4 text-center">Status</th>
                  <th className="py-4 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredProperties.map((prop) => (
                  <tr key={prop.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition group">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition">
                        Blk {prop.block} {prop.streetName}
                      </div>
                      <div className="text-[10px] text-slate-400">{prop.town}</div>
                      {prop.distanceToGeoCenter !== undefined && (
                        <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono font-bold">
                          {(prop.distanceToGeoCenter / 1000).toFixed(1)} km from search point
                        </div>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-800 dark:text-slate-200">{prop.flatType}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{prop.sqm} sqm ({prop.sqft} sqft)</div>
                    </td>

                    <td className="py-3.5 px-4 font-mono font-semibold">
                      {prop.remainingLease} yrs
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-800 dark:text-slate-200">{prop.mrtStation}</div>
                      <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono">{prop.mrtDistance}m walk</div>
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono font-black text-slate-900 dark:text-white">
                      S${prop.askingPrice.toLocaleString()}
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono font-black text-emerald-600 dark:text-emerald-400">
                      S${prop.aiValuation.toLocaleString()}
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
                          prop.verdict === 'Good Value'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : 'bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300'
                        }`}
                      >
                        {prop.verdict}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => handleSelect(prop)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-900 text-white dark:bg-emerald-500 dark:text-slate-950 text-xs font-bold hover:opacity-90 transition"
                      >
                        <span>Analyze</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
