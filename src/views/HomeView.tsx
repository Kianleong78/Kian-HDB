import React, { useState } from 'react';
import {
  Search,
  Sparkles,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Building2,
  Users,
  Compass,
  CheckCircle2,
  FileCheck2,
  Percent,
  MapPin,
  Flame,
  ChevronRight,
  Calculator,
  LineChart,
  Zap,
  Sliders,
  Award,
  Train,
  Clock,
  ExternalLink,
  BookOpen,
  HelpCircle,
} from 'lucide-react';
import { HDBProperty, NavigationTab, UserPersona } from '../types';
import { PropertyCommentCountBadge } from '../components/DisqusComments';
import { DisqusCommunityHub } from '../components/DisqusCommunityHub';
import { GovResaleDatasetExplorer } from '../components/GovResaleDatasetExplorer';
import { OneMapLocationSearch } from '../components/OneMapLocationSearch';
import { UserPersonaBanner } from '../components/UserPersonaBanner';
import { useTheme } from '../context/ThemeContext';
import { SINGAPORE_TOWNS_STATS } from '../data/marketTrendsData';

interface HomeViewProps {
  properties: HDBProperty[];
  selectedProperty: HDBProperty;
  setSelectedProperty: (prop: HDBProperty) => void;
  setActiveTab: (tab: NavigationTab) => void;
  addToCompare: (prop: HDBProperty) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  properties,
  selectedProperty,
  setSelectedProperty,
  setActiveTab,
  addToCompare,
}) => {
  const { theme, viewMode, toggleViewMode } = useTheme();
  const [searchTown, setSearchTown] = useState<string>('All');
  const [searchFlatType, setSearchFlatType] = useState<string>('All');
  const [selectedPersona, setSelectedPersona] = useState<UserPersona | null>('first-timer');

  const handleQuickSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveTab('search');
  };

  const handleInspect = (prop: HDBProperty) => {
    setSelectedProperty(prop);
    setActiveTab('analysis');
  };

  const handleViewFinalReport = (prop: HDBProperty) => {
    setSelectedProperty(prop);
    setActiveTab('final-report');
  };

  return (
    <div className="space-y-12 pb-16 text-slate-800 dark:text-slate-100 transition-colors">
      {/* Hero Section with Bright Aesthetics */}
      <section className="relative overflow-hidden pt-8 pb-14 md:py-16 border-b border-slate-200 dark:border-slate-800 bg-gradient-to-b from-emerald-50/70 via-slate-50/50 to-white dark:from-slate-900 dark:via-slate-950 dark:to-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          {/* View Mode & Hero Badge */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-xs font-bold uppercase tracking-wider shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Singapore HDB Valuation & Location Intelligence</span>
            </div>

            <button
              onClick={toggleViewMode}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition shadow-sm"
            >
              {viewMode === 'simple' ? (
                <>
                  <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  <span>Simple Mode Active</span>
                </>
              ) : (
                <>
                  <Sliders className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Pro Mode Active</span>
                </>
              )}
            </button>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight max-w-4xl mx-auto leading-tight">
            Know the <span className="text-emerald-600 dark:text-emerald-400">Fair Value</span> of any HDB flat across all 26 towns.
          </h1>

          <p className="mt-3 text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            {viewMode === 'simple'
              ? 'Clear, transparent HDB valuations, MRT walking distances, and official Singapore open data in one simple place.'
              : 'Algorithmic fair valuations, 14-category location scores, lease decay modeling, and direct AI recommendations.'}
          </p>

          {/* Quick Search & Instant Valuator Box */}
          <div className="mt-8 max-w-3xl mx-auto bg-white/95 dark:bg-slate-900/90 border border-emerald-200 dark:border-slate-700/80 backdrop-blur-xl p-4 sm:p-5 rounded-3xl shadow-xl">
            <form onSubmit={handleQuickSearch} className="grid grid-cols-1 sm:grid-cols-12 gap-3">
              <div className="sm:col-span-5 text-left">
                <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1 ml-1">
                  Select HDB Town (All 26 Towns)
                </label>
                <select
                  id="home-select-town"
                  value={searchTown}
                  onChange={(e) => setSearchTown(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-semibold rounded-xl px-3 py-2.5 focus:outline-none focus:border-emerald-500"
                >
                  <option value="All">All 26 Singapore Towns ({properties.length} Flats)</option>
                  {SINGAPORE_TOWNS_STATS.map((t) => (
                    <option key={t.town} value={t.town}>
                      {t.town} ({t.region} • {t.matureStatus})
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-4 text-left">
                <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1 ml-1">
                  Flat Type
                </label>
                <select
                  id="home-select-type"
                  value={searchFlatType}
                  onChange={(e) => setSearchFlatType(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-semibold rounded-xl px-3 py-2.5 focus:outline-none focus:border-emerald-500"
                >
                  <option value="All">All Flat Types</option>
                  <option value="3-Room">3-Room (60-70 sqm)</option>
                  <option value="4-Room">4-Room (90-105 sqm)</option>
                  <option value="5-Room">5-Room (110-125 sqm)</option>
                  <option value="Executive">Executive / Maisonette</option>
                </select>
              </div>

              <div className="sm:col-span-3 flex items-end">
                <button
                  id="home-search-btn"
                  type="submit"
                  className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs py-2.5 px-4 rounded-xl transition flex items-center justify-center gap-1.5 shadow-md"
                >
                  <Search className="w-4 h-4" />
                  <span>Search Flats</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* User Persona Guided Experience Banner (Addresses intimidation & tool grouping feedback) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <UserPersonaBanner
          selectedPersona={selectedPersona}
          onSelectPersona={setSelectedPersona}
          onNavigate={(tab) => setActiveTab(tab)}
        />
      </section>

      {/* AI Valuation Methodology Explainer Banner (Addresses "Explain how AI Base Valuation is computed" feedback) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/20 text-[11px] font-bold">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Valuation Transparency</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold">
              How is our AI Base Valuation Computed?
            </h2>
            <p className="text-xs sm:text-sm text-emerald-50 leading-relaxed">
              We combine 180,000+ official Data.gov.sg resale records, SLA OneMap spatial walk times, and Bala's Table lease depreciation regressions.
            </p>
          </div>

          <button
            id="home-methodology-btn"
            onClick={() => setActiveTab('methodology')}
            className="px-5 py-3 bg-white hover:bg-slate-100 text-slate-950 rounded-2xl text-xs font-black transition shadow-lg shrink-0 flex items-center gap-2"
          >
            <span>Read Complete Methodology</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* Featured Analyzed Properties with AI Verdicts */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider">
              <Flame className="w-4 h-4 text-orange-500" /> Featured HDB Valuations Across Singapore
            </div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
              Live Singapore Market Valuations
            </h2>
          </div>

          <button
            id="view-all-props-btn"
            onClick={() => setActiveTab('search')}
            className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 transition"
          >
            <span>Explore All {properties.length} Flats in 26 Towns</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.slice(0, 6).map((prop) => {
            const isGoodValue = prop.verdict === 'Good Value';
            const priceDelta = prop.askingPrice - prop.aiValuation;
            const priceDeltaPct = ((priceDelta / prop.aiValuation) * 100).toFixed(1);

            return (
              <div
                key={prop.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 rounded-3xl p-5 shadow-md hover:shadow-xl flex flex-col justify-between transition-all hover:-translate-y-1"
              >
                <div>
                  {/* Top Badges */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200">
                      {prop.town} • {prop.flatType}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider ${
                        isGoodValue
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-500/40'
                          : 'bg-sky-100 text-sky-800 dark:bg-sky-500/20 dark:text-sky-300 border border-sky-300 dark:border-sky-500/40'
                      }`}
                    >
                      {prop.verdict}
                    </span>
                  </div>

                  <h3 className="text-lg font-black text-slate-900 dark:text-white leading-snug">
                    Blk {prop.block} {prop.streetName}
                  </h3>
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    <span>{prop.sqft} sqft ({prop.sqm} sqm) • {prop.floorLevel}</span>
                    <PropertyCommentCountBadge property={prop} />
                  </div>

                  {/* Price & AI Valuation Comparison Grid */}
                  <div className="grid grid-cols-2 gap-2 mt-4 bg-slate-50 dark:bg-slate-950/60 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800">
                    <div>
                      <div className="text-[10px] text-slate-400 uppercase font-bold">Asking Price</div>
                      <div className="text-base font-black text-slate-900 dark:text-white font-mono">
                        S${prop.askingPrice.toLocaleString()}
                      </div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">S${prop.pricePsf} PSF</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-emerald-600 dark:text-emerald-400 uppercase font-bold">AI Fair Value</div>
                      <div className="text-base font-black text-emerald-600 dark:text-emerald-400 font-mono">
                        S${prop.aiValuation.toLocaleString()}
                      </div>
                      <div className={`text-[10px] font-bold font-mono ${priceDelta <= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>
                        {priceDelta <= 0 ? `-${Math.abs(Number(priceDeltaPct))}% Below Value` : `+${priceDeltaPct}% Over`}
                      </div>
                    </div>
                  </div>

                  {/* Key Highlights */}
                  <div className="mt-3.5 space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                    <div className="flex items-center gap-1.5">
                      <Train className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span className="truncate">{prop.mrtDistance}m to {prop.mrtStation}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-sky-500 shrink-0" />
                      <span className="truncate">{prop.remainingLease} Years Remaining Lease</span>
                    </div>
                  </div>
                </div>

                {/* Card Action CTAs */}
                <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
                  <button
                    id={`home-analyze-${prop.id}`}
                    onClick={() => handleInspect(prop)}
                    className="flex-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white text-xs font-bold py-2.5 px-3 rounded-xl transition text-center"
                  >
                    Valuate & Map
                  </button>
                  <button
                    id={`home-hero-report-${prop.id}`}
                    onClick={() => handleViewFinalReport(prop)}
                    className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black py-2.5 px-3 rounded-xl transition flex items-center justify-center gap-1 shadow-sm"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>AI Report</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Official Singapore Open Data (data.gov.sg) Resale Dataset Explorer */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <GovResaleDatasetExplorer
          properties={properties}
          setSelectedProperty={setSelectedProperty}
          setActiveTab={setActiveTab}
        />
      </section>

      {/* Disqus Live Community Hub & CommentCount Explorer */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <DisqusCommunityHub
          properties={properties}
          selectedProperty={selectedProperty}
          setSelectedProperty={setSelectedProperty}
          setActiveTab={setActiveTab}
        />
      </section>
    </div>
  );
};
