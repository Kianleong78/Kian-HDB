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
} from 'lucide-react';
import { HDBProperty, NavigationTab } from '../types';
import { PropertyCommentCountBadge } from '../components/DisqusComments';

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
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTown, setSelectedTown] = useState('All');
  const [selectedFlatType, setSelectedFlatType] = useState('All');
  const [selectedVerdict, setSelectedVerdict] = useState('All');
  const [maxPrice, setMaxPrice] = useState<number>(1500000);
  const [minLease, setMinLease] = useState<number>(50);
  const [nearMrtOnly, setNearMrtOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'aiScore' | 'priceLow' | 'priceHigh' | 'psfLow' | 'lease'>('aiScore');
  const [viewLayout, setViewLayout] = useState<'grid' | 'list'>('grid');

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

  // Filtered properties
  const filteredProperties = useMemo(() => {
    return properties.filter((p) => {
      if (selectedTown !== 'All' && p.town !== selectedTown) return false;
      if (selectedFlatType !== 'All' && p.flatType !== selectedFlatType) return false;
      if (selectedVerdict !== 'All' && p.verdict !== selectedVerdict) return false;
      if (p.askingPrice > maxPrice) return false;
      if (p.remainingLease < minLease) return false;
      if (nearMrtOnly && p.mrtDistance > 500) return false;

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
    }).sort((a, b) => {
      if (sortBy === 'aiScore') return b.aiMarketScore - a.aiMarketScore;
      if (sortBy === 'priceLow') return a.askingPrice - b.askingPrice;
      if (sortBy === 'priceHigh') return b.askingPrice - a.askingPrice;
      if (sortBy === 'psfLow') return a.pricePsf - b.pricePsf;
      if (sortBy === 'lease') return b.remainingLease - a.remainingLease;
      return 0;
    });
  }, [properties, selectedTown, selectedFlatType, selectedVerdict, maxPrice, minLease, nearMrtOnly, searchQuery, sortBy]);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedTown('All');
    setSelectedFlatType('All');
    setSelectedVerdict('All');
    setMaxPrice(1500000);
    setMinLease(60);
    setNearMrtOnly(false);
    setSortBy('aiScore');
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider">
            <Search className="w-3.5 h-3.5" />
            <span>Singapore HDB Resale Explorer</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">Property Search & Valuation Radar</h1>
          <p className="text-xs text-slate-400 mt-1">
            Compare asking price against algorithmic fair value and location score across Singapore.
          </p>
        </div>

        {/* View toggles & Quick counter */}
        <div className="flex items-center gap-3">
          <div className="bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl text-xs text-slate-300">
            Found <span className="font-bold text-emerald-400 font-mono">{filteredProperties.length}</span> properties
          </div>
          <div className="bg-slate-900 border border-slate-800 p-1 rounded-xl flex items-center gap-1">
            <button
              id="view-layout-grid"
              onClick={() => setViewLayout('grid')}
              className={`p-1.5 rounded-lg transition-colors ${viewLayout === 'grid' ? 'bg-slate-800 text-emerald-400' : 'text-slate-400 hover:text-white'}`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              id="view-layout-list"
              onClick={() => setViewLayout('list')}
              className={`p-1.5 rounded-lg transition-colors ${viewLayout === 'list' ? 'bg-slate-800 text-emerald-400' : 'text-slate-400 hover:text-white'}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Multi-Dimensional Filter Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl space-y-4">
        {/* Top Search query input */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            id="search-input-main"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Town, Street Name, Block, School, or MRT station..."
            className="w-full bg-slate-950/80 border border-slate-700 text-white pl-10 pr-4 py-2.5 rounded-xl text-xs focus:outline-none focus:border-emerald-500 placeholder-slate-500"
          />
        </div>

        {/* Dropdown filters grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div>
            <label className="block text-[10px] font-semibold text-slate-400 uppercase mb-1">Town</label>
            <select
              id="filter-town"
              value={selectedTown}
              onChange={(e) => setSelectedTown(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 text-white text-xs rounded-xl px-2.5 py-2 focus:outline-none focus:border-emerald-500"
            >
              <option value="All">All Towns ({properties.length})</option>
              {availableTowns.map((town) => (
                <option key={town} value={town}>
                  {town}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-semibold text-slate-400 uppercase mb-1">Flat Type</label>
            <select
              id="filter-flat-type"
              value={selectedFlatType}
              onChange={(e) => setSelectedFlatType(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 text-white text-xs rounded-xl px-2.5 py-2 focus:outline-none focus:border-emerald-500"
            >
              <option value="All">All Types</option>
              {availableFlatTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-semibold text-slate-400 uppercase mb-1">AI Verdict</label>
            <select
              id="filter-verdict"
              value={selectedVerdict}
              onChange={(e) => setSelectedVerdict(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 text-white text-xs rounded-xl px-2.5 py-2 focus:outline-none focus:border-emerald-500"
            >
              <option value="All">All Verdicts</option>
              <option value="Good Value">Good Value (Undervalued)</option>
              <option value="Fairly Priced">Fairly Priced</option>
              <option value="Strong Growth">Strong Growth</option>
              <option value="Above Market">Above Market</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-semibold text-slate-400 uppercase mb-1">
              Max Price: S${(maxPrice / 1000).toFixed(0)}k
            </label>
            <input
              type="range"
              id="filter-max-price"
              min={400000}
              max={1500000}
              step={25000}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-emerald-400"
            />
          </div>

          <div>
            <label className="block text-[10px] font-semibold text-slate-400 uppercase mb-1">
              Min Lease: {minLease} yrs
            </label>
            <input
              type="range"
              id="filter-min-lease"
              min={50}
              max={95}
              step={5}
              value={minLease}
              onChange={(e) => setMinLease(Number(e.target.value))}
              className="w-full accent-emerald-400"
            />
          </div>

          <div>
            <label className="block text-[10px] font-semibold text-slate-400 uppercase mb-1">Sort Order</label>
            <select
              id="filter-sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full bg-slate-800 border border-slate-700 text-white text-xs rounded-xl px-2.5 py-2 focus:outline-none focus:border-emerald-500 font-medium"
            >
              <option value="aiScore">AI Score (Highest)</option>
              <option value="priceLow">Price: Low to High</option>
              <option value="priceHigh">Price: High to Low</option>
              <option value="psfLow">PSF: Low to High</option>
              <option value="lease">Lease Remaining (Longest)</option>
            </select>
          </div>
        </div>

        {/* Quick Checkbox & Reset */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800 text-xs">
          <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              id="filter-mrt-check"
              checked={nearMrtOnly}
              onChange={(e) => setNearMrtOnly(e.target.checked)}
              className="rounded accent-emerald-400"
            />
            <span>Near MRT only (&lt;500m walking distance)</span>
          </label>

          <button
            id="filter-reset-btn"
            onClick={resetFilters}
            className="flex items-center gap-1.5 text-slate-400 hover:text-slate-200 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Filters</span>
          </button>
        </div>
      </div>

      {/* Comparison Drawer Indicator if active */}
      {comparisonList.length > 0 && (
        <div className="bg-gradient-to-r from-emerald-950/80 to-slate-900 border border-emerald-500/40 rounded-2xl p-4 flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500 text-slate-950 flex items-center justify-center font-bold">
              <GitCompare className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">
                {comparisonList.length} Properties Selected for Comparison
              </div>
              <div className="text-[11px] text-slate-300">
                {comparisonList.map((c) => `Blk ${c.block} ${c.town}`).join(' vs ')}
              </div>
            </div>
          </div>

          <button
            id="go-to-compare-btn"
            onClick={() => setActiveTab('compare')}
            className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-all shadow-md shadow-emerald-500/20 flex items-center gap-1.5"
          >
            <span>Launch Head-to-Head</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Results Grid / List */}
      {viewLayout === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.map((prop) => {
            const isCompared = comparisonList.some((c) => c.id === prop.id);
            const priceDelta = prop.askingPrice - prop.aiValuation;
            const priceDeltaPct = ((priceDelta / prop.aiValuation) * 100).toFixed(1);

            return (
              <div
                key={prop.id}
                className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 shadow-lg flex flex-col justify-between transition-all hover:shadow-2xl"
              >
                <div>
                  {/* Card Header & Badges */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-800 border border-slate-700 text-slate-200">
                      {prop.town} • {prop.flatType}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-extrabold uppercase tracking-wider ${
                        prop.verdict === 'Good Value'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                      }`}
                    >
                      {prop.verdict}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white leading-tight">
                    Blk {prop.block} {prop.streetName}
                  </h3>
                  <div className="flex items-center justify-between text-xs text-slate-400 mt-1">
                    <span>{prop.sqft} sqft ({prop.sqm} sqm) • {prop.floorLevel}</span>
                    <PropertyCommentCountBadge property={prop} className="text-slate-400" />
                  </div>

                  {/* Pricing Comparison Box */}
                  <div className="grid grid-cols-2 gap-2 mt-4 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                    <div>
                      <div className="text-[10px] text-slate-400 uppercase">Asking Price</div>
                      <div className="text-base font-black text-white font-mono">
                        S${prop.askingPrice.toLocaleString()}
                      </div>
                      <div className="text-[10px] text-slate-400">S${prop.pricePsf} PSF</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-emerald-400 uppercase font-semibold">AI Fair Valuation</div>
                      <div className="text-base font-black text-emerald-400 font-mono">
                        S${prop.aiValuation.toLocaleString()}
                      </div>
                      <div className={`text-[10px] font-semibold ${priceDelta <= 0 ? 'text-emerald-400' : 'text-amber-400'}`}>
                        {priceDelta <= 0 ? `${priceDeltaPct}% Below Base` : `+${priceDeltaPct}% Over Base`}
                      </div>
                    </div>
                  </div>

                  {/* Location Scores Radar Bar */}
                  <div className="mt-3.5 bg-slate-800/40 p-2.5 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
                        {prop.aiMarketScore}
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-400 uppercase">AI Market Score</div>
                        <div className="text-xs font-semibold text-slate-200">{prop.aiConfidenceScore}% Confidence</div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-[10px] text-slate-400 uppercase">Location Score</div>
                      <div className="text-xs font-bold text-emerald-400">{prop.locationScores.overallLocationScore}/100</div>
                    </div>
                  </div>

                  {/* Highlights */}
                  <div className="mt-3 space-y-1 text-xs text-slate-300">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span className="truncate">{prop.mrtDistance}m to {prop.mrtStation}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                      <span className="truncate">{prop.topSchool} ({prop.schoolDistance}m)</span>
                    </div>
                  </div>
                </div>

                {/* Card Bottom CTAs */}
                <div className="mt-5 pt-3 border-t border-slate-800 space-y-2">
                  <div className="flex items-center gap-2">
                    <button
                      id={`search-analyze-${prop.id}`}
                      onClick={() => handleSelect(prop)}
                      className="flex-1 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold py-2 px-3 rounded-xl transition-colors text-center"
                    >
                      Inspect Valuation
                    </button>
                    <button
                      id={`search-report-${prop.id}`}
                      onClick={() => handleOpenReport(prop)}
                      className="flex-1 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold py-2 px-3 rounded-xl transition-colors flex items-center justify-center gap-1"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Hero AI Report</span>
                    </button>
                  </div>

                  <button
                    id={`search-compare-toggle-${prop.id}`}
                    onClick={() => toggleComparison(prop)}
                    className={`w-full py-1.5 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-1.5 ${
                      isCompared
                        ? 'bg-emerald-500 text-slate-950 font-bold'
                        : 'bg-slate-950/60 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800'
                    }`}
                  >
                    <GitCompare className="w-3.5 h-3.5" />
                    <span>{isCompared ? 'Added to Compare ✓' : '+ Add to Compare'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* List View */
        <div className="space-y-3">
          {filteredProperties.map((prop) => {
            const isCompared = comparisonList.some((c) => c.id === prop.id);
            const priceDelta = prop.askingPrice - prop.aiValuation;

            return (
              <div
                key={prop.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-slate-700 transition-colors shadow-lg"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-base text-white">
                      Blk {prop.block} {prop.streetName}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-semibold">
                      {prop.town} • {prop.flatType}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                      {prop.verdict}
                    </span>
                    <PropertyCommentCountBadge property={prop} className="text-slate-400 text-xs ml-2" />
                  </div>
                  <div className="text-xs text-slate-400 flex flex-wrap items-center gap-4">
                    <span>{prop.sqft} sqft ({prop.sqm} sqm)</span>
                    <span>•</span>
                    <span>{prop.floorLevel}</span>
                    <span>•</span>
                    <span>{prop.remainingLease} yrs lease</span>
                    <span>•</span>
                    <span>{prop.mrtDistance}m to MRT</span>
                  </div>
                </div>

                {/* Price metrics */}
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <div className="text-base font-black text-white font-mono">
                      S${prop.askingPrice.toLocaleString()}
                    </div>
                    <div className="text-xs text-emerald-400 font-mono">
                      AI Val: S${prop.aiValuation.toLocaleString()} ({priceDelta <= 0 ? 'Undervalued' : 'Premium'})
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      id={`list-analyze-${prop.id}`}
                      onClick={() => handleSelect(prop)}
                      className="bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold py-2 px-3 rounded-xl transition-colors"
                    >
                      Analysis
                    </button>
                    <button
                      id={`list-hero-${prop.id}`}
                      onClick={() => handleOpenReport(prop)}
                      className="bg-emerald-500 text-slate-950 hover:bg-emerald-400 text-xs font-bold py-2 px-3 rounded-xl transition-colors flex items-center gap-1"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>AI Report</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
