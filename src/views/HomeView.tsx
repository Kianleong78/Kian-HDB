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
} from 'lucide-react';
import { HDBProperty, NavigationTab } from '../types';
import { PropertyCommentCountBadge } from '../components/DisqusComments';
import { DisqusCommunityHub } from '../components/DisqusCommunityHub';
import { GovResaleDatasetExplorer } from '../components/GovResaleDatasetExplorer';

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
  const [searchTown, setSearchTown] = useState<string>('All');
  const [searchFlatType, setSearchFlatType] = useState<string>('All');

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
    <div className="space-y-12 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-16 md:py-20 border-b border-slate-800 bg-radial-[at_top_center] from-slate-900 via-slate-950 to-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          {/* Hero Eyebrow */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Singapore’s #1 AI Property Decision Engine</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight max-w-4xl mx-auto leading-tight">
            Turn HDB data into <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-sky-400">
              smarter property decisions
            </span>{' '}
            in seconds.
          </h1>

          <p className="mt-5 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Algorithmic fair valuations, 14-category location scores, lease decay modeling, and direct AI recommendations for Singapore buyers, sellers, and property agents.
          </p>

          {/* Quick Search & Instant Valuator Box */}
          <div className="mt-8 max-w-3xl mx-auto bg-slate-900/90 border border-slate-700/80 backdrop-blur-xl p-3 sm:p-4 rounded-2xl shadow-2xl">
            <form onSubmit={handleQuickSearch} className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
              <div className="sm:col-span-4 text-left">
                <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1 ml-1">
                  HDB Town / Estate
                </label>
                <select
                  id="home-select-town"
                  value={searchTown}
                  onChange={(e) => setSearchTown(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 text-white text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-emerald-500"
                >
                  <option value="All">All 26 Towns</option>
                  <option value="Bishan">Bishan (Central)</option>
                  <option value="Queenstown">Queenstown (Central)</option>
                  <option value="Tampines">Tampines (East)</option>
                  <option value="Punggol">Punggol (North-East)</option>
                  <option value="Toa Payoh">Toa Payoh (Central)</option>
                  <option value="Clementi">Clementi (West)</option>
                  <option value="Woodlands">Woodlands (North)</option>
                </select>
              </div>

              <div className="sm:col-span-4 text-left">
                <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1 ml-1">
                  Flat Type
                </label>
                <select
                  id="home-select-type"
                  value={searchFlatType}
                  onChange={(e) => setSearchFlatType(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 text-white text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-emerald-500"
                >
                  <option value="All">All Flat Types</option>
                  <option value="3-Room">3-Room (60-70 sqm)</option>
                  <option value="4-Room">4-Room (90-105 sqm)</option>
                  <option value="5-Room">5-Room (110-125 sqm)</option>
                  <option value="Executive">Executive / Multi-Gen</option>
                </select>
              </div>

              <div className="sm:col-span-4 flex items-end">
                <button
                  type="submit"
                  id="home-search-btn"
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-bold text-xs py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-500/20"
                >
                  <Search className="w-4 h-4" />
                  <span>Analyze Resale Market</span>
                </button>
              </div>
            </form>
          </div>

          {/* User Persona Quick Routes */}
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto">
            <button
              id="persona-buyer-btn"
              onClick={() => setActiveTab('buyer-tools')}
              className="bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 hover:border-emerald-500/40 p-3 rounded-xl text-left transition-all group"
            >
              <div className="flex items-center justify-between text-xs text-emerald-400 font-semibold mb-1">
                <span>For Buyers</span>
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
              <div className="text-[11px] text-slate-400">Affordability & CPF Grants</div>
            </button>

            <button
              id="persona-seller-btn"
              onClick={() => setActiveTab('seller-tools')}
              className="bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 hover:border-emerald-500/40 p-3 rounded-xl text-left transition-all group"
            >
              <div className="flex items-center justify-between text-xs text-sky-400 font-semibold mb-1">
                <span>For Sellers</span>
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
              <div className="text-[11px] text-slate-400">Net Resale Cash Proceeds</div>
            </button>

            <button
              id="persona-agent-btn"
              onClick={() => setActiveTab('agent-pro')}
              className="bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 hover:border-emerald-500/40 p-3 rounded-xl text-left transition-all group"
            >
              <div className="flex items-center justify-between text-xs text-purple-400 font-semibold mb-1">
                <span>For Agents</span>
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
              <div className="text-[11px] text-slate-400">Instant CMA & Pitch Decks</div>
            </button>

            <button
              id="persona-report-btn"
              onClick={() => setActiveTab('final-report')}
              className="bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 p-3 rounded-xl text-left transition-all group"
            >
              <div className="flex items-center justify-between text-xs text-emerald-300 font-bold mb-1">
                <span className="flex items-center gap-1"><Sparkles className="w-3 h-3" /> Final AI Report</span>
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
              <div className="text-[11px] text-emerald-400/80">“What should I do?”</div>
            </button>
          </div>
        </div>
      </section>

      {/* Live Market Pulse Ticker Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
            <div className="text-xs text-slate-400 font-medium">HDB Resale Price Index</div>
            <div className="text-2xl font-black text-white mt-1 font-mono">195.8</div>
            <div className="text-[11px] text-emerald-400 flex items-center gap-1 mt-1 font-medium">
              <TrendingUp className="w-3 h-3" /> +1.2% this quarter
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
            <div className="text-xs text-slate-400 font-medium">Median 4-Room PSF</div>
            <div className="text-2xl font-black text-emerald-400 mt-1 font-mono">S$588</div>
            <div className="text-[11px] text-slate-400 mt-1">Across 26 Singapore Towns</div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
            <div className="text-xs text-slate-400 font-medium">Million-Dollar Flats (YTD)</div>
            <div className="text-2xl font-black text-amber-400 mt-1 font-mono">312 units</div>
            <div className="text-[11px] text-slate-400 mt-1">Primarily Dawson, Bishan, TPY</div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
            <div className="text-xs text-slate-400 font-medium">AI Valuation Accuracy</div>
            <div className="text-2xl font-black text-teal-400 mt-1 font-mono">98.4%</div>
            <div className="text-[11px] text-slate-400 mt-1">Within ±2.5% of official HDB</div>
          </div>
        </div>
      </section>

      {/* Featured Analyzed Properties with AI Verdicts */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
              <Flame className="w-4 h-4 text-orange-400" /> Hot Market Opportunities
            </div>
            <h2 className="text-2xl font-bold text-white mt-1">Featured Algorithmic Valuations</h2>
          </div>

          <button
            id="view-all-props-btn"
            onClick={() => setActiveTab('search')}
            className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition-colors"
          >
            <span>View All Search Results</span>
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
                className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 shadow-lg flex flex-col justify-between transition-all hover:-translate-y-1"
              >
                <div>
                  {/* Top Badges */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-800 border border-slate-700 text-slate-200">
                      {prop.town} • {prop.flatType}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-extrabold uppercase tracking-wider ${
                        isGoodValue
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                      }`}
                    >
                      {prop.verdict}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white leading-snug">
                    Blk {prop.block} {prop.streetName}
                  </h3>
                  <div className="flex items-center justify-between text-xs text-slate-400 mt-0.5">
                    <span>{prop.sqft} sqft ({prop.sqm} sqm) • {prop.floorLevel}</span>
                    <PropertyCommentCountBadge property={prop} className="text-slate-400" />
                  </div>

                  {/* Price & AI Valuation Comparison Grid */}
                  <div className="grid grid-cols-2 gap-2 mt-4 bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                    <div>
                      <div className="text-[10px] text-slate-400 uppercase">Asking Price</div>
                      <div className="text-base font-bold text-white font-mono">
                        S${prop.askingPrice.toLocaleString()}
                      </div>
                      <div className="text-[10px] text-slate-400">S${prop.pricePsf} PSF</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-emerald-400 uppercase font-semibold">AI Base Valuation</div>
                      <div className="text-base font-bold text-emerald-400 font-mono">
                        S${prop.aiValuation.toLocaleString()}
                      </div>
                      <div className={`text-[10px] font-semibold ${priceDelta <= 0 ? 'text-emerald-400' : 'text-amber-400'}`}>
                        {priceDelta <= 0 ? `-${Math.abs(Number(priceDeltaPct))}% Below Fair Value` : `+${priceDeltaPct}% Over Base`}
                      </div>
                    </div>
                  </div>

                  {/* Key Highlights */}
                  <div className="mt-3.5 space-y-1.5 text-xs text-slate-300">
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      <span className="truncate">{prop.mrtDistance}m to {prop.mrtStation}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                      <span className="truncate">{prop.topSchool} ({prop.schoolDistance}m)</span>
                    </div>
                  </div>
                </div>

                {/* Card Action CTAs */}
                <div className="mt-5 pt-4 border-t border-slate-800 flex items-center gap-2">
                  <button
                    id={`home-analyze-${prop.id}`}
                    onClick={() => handleInspect(prop)}
                    className="flex-1 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold py-2 px-3 rounded-xl transition-colors text-center"
                  >
                    Deep Analysis
                  </button>
                  <button
                    id={`home-hero-report-${prop.id}`}
                    onClick={() => handleViewFinalReport(prop)}
                    className="flex-1 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold py-2 px-3 rounded-xl transition-colors flex items-center justify-center gap-1"
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

      {/* Hero Feature Pillars */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl">
          <div className="max-w-2xl">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">The HDB Insight AI Advantage</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
              Why Singapore Property Decisions Fail Without AI
            </h2>
            <p className="text-sm text-slate-400 mt-2">
              Traditional portals only show asking prices set by sellers. HDB Insight AI reveals algorithmic fair market values, lease decay curves, and true net transaction cost.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="bg-slate-950/60 p-5 rounded-2xl border border-slate-800">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mb-4">
                <Percent className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Cash-Over-Valuation (COV) Shield</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Accurately forecast official HDB valuation baselines before offering Option fees, preventing unexpected cash shortfalls.
              </p>
            </div>

            <div className="bg-slate-950/60 p-5 rounded-2xl border border-slate-800">
              <div className="w-10 h-10 rounded-xl bg-sky-500/20 border border-sky-500/30 text-sky-400 flex items-center justify-center mb-4">
                <Compass className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">14-Amenity Radar Intelligence</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Calculates exact walking distances and travel isochrones to MRT lines, SAP primary schools, food centres, and polyclinics.
              </p>
            </div>

            <div className="bg-slate-950/60 p-5 rounded-2xl border border-slate-800">
              <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-500/30 text-teal-400 flex items-center justify-center mb-4">
                <FileCheck2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">The Hero Final AI Report</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Aggregates every metric to deliver a definitive, unbiased answer: “Is this a good buy, good sell, or should I continue comparing?”
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
