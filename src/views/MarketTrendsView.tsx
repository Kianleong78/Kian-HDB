import React, { useState } from 'react';
import {
  TrendingUp,
  BarChart3,
  Flame,
  Award,
  ShieldCheck,
  Building2,
  Info,
  Calendar,
  Layers,
  ArrowUpRight,
  Filter,
} from 'lucide-react';
import { SINGAPORE_TOWNS_STATS, RESALE_PRICE_INDEX_DATA, MILLION_DOLLAR_HDB_INSIGHTS } from '../data/marketTrendsData';
import { HDBProperty, NavigationTab } from '../types';
import { GovResaleDatasetExplorer } from '../components/GovResaleDatasetExplorer';

interface MarketTrendsViewProps {
  properties: HDBProperty[];
  setSelectedProperty: (prop: HDBProperty) => void;
  setActiveTab: (tab: NavigationTab) => void;
}

export const MarketTrendsView: React.FC<MarketTrendsViewProps> = ({
  properties,
  setSelectedProperty,
  setActiveTab,
}) => {
  const [selectedRegion, setSelectedRegion] = useState<string>('All');
  const [selectedMaturity, setSelectedMaturity] = useState<string>('All');

  const filteredTowns = SINGAPORE_TOWNS_STATS.filter((t) => {
    if (selectedRegion !== 'All' && t.region !== selectedRegion) return false;
    if (selectedMaturity !== 'All' && t.matureStatus !== selectedMaturity) return false;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider">
          <TrendingUp className="w-3.5 h-3.5" />
          <span>Singapore HDB Macro Intelligence</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">National Market Trends & Town Heatmaps</h1>
        <p className="text-xs text-slate-400 mt-1">
          Historical Resale Price Index (RPI), town-by-town median prices, million-dollar transactions, and regulatory frameworks.
        </p>
      </div>

      {/* RPI 10-Year Macro Chart */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Official Benchmark</div>
            <h3 className="text-lg font-bold text-white mt-0.5">10-Year HDB Resale Price Index (2016 - 2026)</h3>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 px-2.5 py-1 rounded-full font-semibold">
              Current Index: 195.8 (+45.4% 5-Yr)
            </span>
          </div>
        </div>

        {/* SVG Resale Price Index */}
        <div className="overflow-x-auto pt-4">
          <svg viewBox="0 0 640 220" className="w-full min-w-[500px] h-56 select-none">
            <defs>
              <linearGradient id="rpiGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* Gridlines */}
            {[120, 140, 160, 180, 200].map((idxVal, i) => {
              const y = 190 - ((idxVal - 120) / 90) * 150;
              return (
                <g key={`rpi-grid-${i}`}>
                  <line x1="45" y1={y} x2="620" y2={y} stroke="#334155" strokeWidth="1" strokeDasharray="3 3" opacity="0.4" />
                  <text x="40" y={y + 3} fill="#64748b" fontSize="9" textAnchor="end" fontFamily="monospace">
                    {idxVal}
                  </text>
                </g>
              );
            })}

            {/* Area */}
            <path
              d={`M 60 190 ${RESALE_PRICE_INDEX_DATA.map((d, idx) => {
                const x = 60 + (idx / (RESALE_PRICE_INDEX_DATA.length - 1)) * 550;
                const y = 190 - ((d.index - 120) / 90) * 150;
                return `L ${x} ${y}`;
              }).join(' ')} L 610 190 Z`}
              fill="url(#rpiGrad)"
            />

            {/* Polyline */}
            <polyline
              fill="none"
              stroke="#10b981"
              strokeWidth="3.5"
              points={RESALE_PRICE_INDEX_DATA.map((d, idx) => {
                const x = 60 + (idx / (RESALE_PRICE_INDEX_DATA.length - 1)) * 550;
                const y = 190 - ((d.index - 120) / 90) * 150;
                return `${x},${y}`;
              }).join(' ')}
            />

            {/* Nodes */}
            {RESALE_PRICE_INDEX_DATA.map((d, idx) => {
              const x = 60 + (idx / (RESALE_PRICE_INDEX_DATA.length - 1)) * 550;
              const y = 190 - ((d.index - 120) / 90) * 150;
              return (
                <g key={`rpi-node-${idx}`}>
                  <circle cx={x} cy={y} r="4" fill="#10b981" stroke="#ffffff" strokeWidth="1.5" />
                  <text x={x} y={y - 8} fill="#34d399" fontSize="9" fontWeight="bold" textAnchor="middle">
                    {d.index}
                  </text>
                  <text x={x} y="208" fill="#94a3b8" fontSize="8" textAnchor="middle">
                    {d.quarter.replace(' Q1', '')}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* Official Data.gov.sg Resale Dataset Explorer */}
      <GovResaleDatasetExplorer
        properties={properties}
        setSelectedProperty={setSelectedProperty}
        setActiveTab={setActiveTab}
      />

      {/* Town-by-Town Comprehensive Median Price Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Singapore Estates</div>
            <h3 className="text-xl font-bold text-white mt-0.5">Town-by-Town Resale Pricing & Demand Heatmap</h3>
          </div>

          <div className="flex items-center gap-3">
            <select
              id="filter-trend-region"
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="bg-slate-800 border border-slate-700 text-white text-xs rounded-xl px-3 py-1.5 focus:outline-none"
            >
              <option value="All">All Regions</option>
              <option value="Central">Central</option>
              <option value="East">East</option>
              <option value="West">West</option>
              <option value="North">North</option>
              <option value="North-East">North-East</option>
            </select>

            <select
              id="filter-trend-mature"
              value={selectedMaturity}
              onChange={(e) => setSelectedMaturity(e.target.value)}
              className="bg-slate-800 border border-slate-700 text-white text-xs rounded-xl px-3 py-1.5 focus:outline-none"
            >
              <option value="All">All Estates</option>
              <option value="Mature">Mature Estates</option>
              <option value="Non-Mature">Non-Mature Estates</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-3">HDB Town</th>
                <th className="py-3 px-3">Region / Status</th>
                <th className="py-3 px-3">Median 3-Room</th>
                <th className="py-3 px-3">Median 4-Room</th>
                <th className="py-3 px-3">Median 5-Room</th>
                <th className="py-3 px-3">Avg PSF</th>
                <th className="py-3 px-3">YoY Growth</th>
                <th className="py-3 px-3">AI Demand Heat</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200">
              {filteredTowns.map((t) => (
                <tr key={t.town} className="hover:bg-slate-800/40 transition-colors font-medium">
                  <td className="py-3.5 px-3 font-bold text-white flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-slate-400" />
                    <span>{t.town}</span>
                  </td>
                  <td className="py-3.5 px-3">
                    <span className="text-slate-300">{t.region}</span> •{' '}
                    <span className={t.matureStatus === 'Mature' ? 'text-amber-300' : 'text-sky-300'}>
                      {t.matureStatus}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 font-mono">S${(t.median3RoomPrice / 1000).toFixed(0)}k</td>
                  <td className="py-3.5 px-3 font-mono font-bold text-white">S${(t.median4RoomPrice / 1000).toFixed(0)}k</td>
                  <td className="py-3.5 px-3 font-mono">S${(t.median5RoomPrice / 1000).toFixed(0)}k</td>
                  <td className="py-3.5 px-3 font-mono text-emerald-400">S${t.avgPsf}</td>
                  <td className="py-3.5 px-3 text-emerald-400 font-semibold">+{t.yoyGrowthPct}%</td>
                  <td className="py-3.5 px-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                        t.aiDemandHeat === 'Very High'
                          ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                          : t.aiDemandHeat === 'High'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      }`}
                    >
                      {t.aiDemandHeat}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Million-Dollar Flats & New Standard / Plus / Prime Framework */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Million Dollar Flats */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center font-bold">
                <Award className="w-4 h-4" />
              </div>
              <h3 className="text-base font-bold text-white">Million-Dollar HDB Benchmark Records</h3>
            </div>
            <span className="text-xs text-amber-400 font-bold">312 Transactions YTD</span>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            Record transactions continue to be concentrated in DBSS developments (The Peak, Natura Loft) and city-fringe high-floor Pinnacle@Duxton / Dawson clusters.
          </p>

          <div className="space-y-2 text-xs">
            {MILLION_DOLLAR_HDB_INSIGHTS.map((rec, i) => (
              <div key={i} className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="font-bold text-white">{rec.estate}</div>
                  <div className="text-[11px] text-slate-400">{rec.flatType} • Storey {rec.storey} • {rec.date}</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-amber-400 font-mono text-sm">S${rec.transactedPrice.toLocaleString()}</div>
                  <div className="text-[10px] text-slate-400 font-mono">S${rec.psf} PSF</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* HDB Standard vs Plus vs Prime (PLH) Framework */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-300 flex items-center justify-center font-bold">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-white">Standard vs Plus vs Prime (PLH) Classification</h3>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            From late 2024 onwards, new BTO projects adhere to the 3-tier framework with progressive resale conditions.
          </p>

          <div className="space-y-2.5 text-xs">
            <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 space-y-1">
              <div className="flex items-center justify-between text-slate-200 font-bold">
                <span>Standard Flats (Islandwide)</span>
                <span className="text-emerald-400">5-Year MOP</span>
              </div>
              <p className="text-[11px] text-slate-400">Standard subsidies, whole flat rental allowed after 5-yr MOP, standard income eligibility.</p>
            </div>

            <div className="bg-slate-950/60 p-3 rounded-xl border border-indigo-500/30 space-y-1">
              <div className="flex items-center justify-between text-indigo-300 font-bold">
                <span>Plus Flats (Choicier Locations / Near MRT)</span>
                <span className="text-indigo-400">10-Year MOP</span>
              </div>
              <p className="text-[11px] text-slate-400">Higher initial subsidies, 6-8% subsidy clawback on first resale, S$14,000 resale buyer income ceiling, no whole-unit rental.</p>
            </div>

            <div className="bg-slate-950/60 p-3 rounded-xl border border-purple-500/30 space-y-1">
              <div className="flex items-center justify-between text-purple-300 font-bold">
                <span>Prime Flats (PLH Central Locations)</span>
                <span className="text-purple-400">10-Year MOP + Strict Resale</span>
              </div>
              <p className="text-[11px] text-slate-400">Highest subsidies, 9-12% subsidy clawback upon resale, S$14k income ceiling for all future resale buyers.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
