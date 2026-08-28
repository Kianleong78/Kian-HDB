import React, { useState } from 'react';
import { TrendingUp, Award, AlertCircle, Info } from 'lucide-react';
import { HistoricalPriceTrend } from '../types';

interface PriceChartProps {
  trends: HistoricalPriceTrend[];
  remainingLease: number;
  askingPricePsf: number;
  townName: string;
}

export const PriceChart: React.FC<PriceChartProps> = ({
  trends,
  remainingLease,
  askingPricePsf,
  townName,
}) => {
  const [activeRange, setActiveRange] = useState<'1Y' | '3Y' | '5Y' | '10Y'>('10Y');
  const [chartMode, setChartMode] = useState<'historical' | 'balas'>('historical');

  // Filter trends based on range
  const visibleTrends = (() => {
    if (activeRange === '1Y') return trends.slice(-2);
    if (activeRange === '3Y') return trends.slice(-3);
    if (activeRange === '5Y') return trends.slice(-4);
    return trends;
  })();

  // Calculate coordinates for SVG line chart
  const maxPsf = Math.max(...visibleTrends.map((t) => Math.max(t.avgPsf, t.townAvgPsf, t.sgNationalAvgPsf, askingPricePsf))) * 1.08;
  const minPsf = Math.min(...visibleTrends.map((t) => Math.min(t.avgPsf, t.townAvgPsf, t.sgNationalAvgPsf))) * 0.92;

  const getSvgY = (psf: number) => {
    return 190 - ((psf - minPsf) / (maxPsf - minPsf || 1)) * 140;
  };

  const getSvgX = (index: number, total: number) => {
    if (total <= 1) return 260;
    return 50 + (index / (total - 1)) * 420;
  };

  // Bala's Curve Data Table (Singapore SLA official leasehold table)
  const balasTable = [
    { lease: 99, pct: 100 },
    { lease: 90, pct: 95.8 },
    { lease: 80, pct: 91.8 },
    { lease: 70, pct: 84.8 },
    { lease: 60, pct: 76.0 },
    { lease: 50, pct: 65.0 },
    { lease: 40, pct: 53.0 },
    { lease: 30, pct: 38.0 },
    { lease: 20, pct: 20.0 },
    { lease: 10, pct: 8.0 },
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl text-slate-100">
      {/* Header with Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              Historical & Lease Modeling
            </span>
            <span className="text-xs text-slate-400">1/3/5/10-Yr PSF Trends</span>
          </div>
          <h4 className="text-lg font-bold text-white mt-1">
            {chartMode === 'historical' ? `${townName} Historical Price PSF vs National Average` : "Singapore SLA Bala's Curve (Leasehold Value Decay)"}
          </h4>
        </div>

        <div className="flex items-center gap-2">
          {/* Mode toggle */}
          <div className="bg-slate-800 p-1 rounded-xl flex items-center border border-slate-700 text-xs">
            <button
              id="chart-mode-historical"
              onClick={() => setChartMode('historical')}
              className={`px-3 py-1 rounded-lg font-medium transition-all ${chartMode === 'historical' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'}`}
            >
              PSF Trends
            </button>
            <button
              id="chart-mode-balas"
              onClick={() => setChartMode('balas')}
              className={`px-3 py-1 rounded-lg font-medium transition-all ${chartMode === 'balas' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'}`}
            >
              Bala's Lease Decay
            </button>
          </div>

          {chartMode === 'historical' && (
            <div className="bg-slate-800 p-1 rounded-xl flex items-center border border-slate-700 text-xs">
              {(['1Y', '3Y', '5Y', '10Y'] as const).map((r) => (
                <button
                  key={r}
                  id={`range-${r}`}
                  onClick={() => setActiveRange(r)}
                  className={`px-2.5 py-1 rounded-lg font-medium transition-all ${activeRange === r ? 'bg-slate-700 text-white font-bold' : 'text-slate-400 hover:text-white'}`}
                >
                  {r}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {chartMode === 'historical' ? (
        <div>
          {/* Line Chart Canvas */}
          <div className="relative pt-4 overflow-hidden">
            <svg viewBox="0 0 520 220" className="w-full h-56 select-none">
              <defs>
                <linearGradient id="propAreaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                </linearGradient>
              </defs>

              {/* Horizontal Grid lines */}
              {[0, 0.25, 0.5, 0.75, 1].map((step, i) => {
                const yVal = 190 - step * 140;
                const psfVal = Math.round(minPsf + step * (maxPsf - minPsf));
                return (
                  <g key={`grid-${i}`}>
                    <line x1="45" y1={yVal} x2="490" y2={yVal} stroke="#334155" strokeWidth="1" strokeDasharray="3 3" opacity="0.4" />
                    <text x="40" y={yVal + 3} fill="#64748b" fontSize="9" textAnchor="end" fontFamily="monospace">
                      ${psfVal}
                    </text>
                  </g>
                );
              })}

              {/* Area Under Property Curve */}
              {visibleTrends.length > 1 && (
                <path
                  d={`M ${getSvgX(0, visibleTrends.length)} 190 ${visibleTrends
                    .map((t, idx) => `L ${getSvgX(idx, visibleTrends.length)} ${getSvgY(t.avgPsf)}`)
                    .join(' ')} L ${getSvgX(visibleTrends.length - 1, visibleTrends.length)} 190 Z`}
                  fill="url(#propAreaGrad)"
                />
              )}

              {/* National Average Line (Gray dashed) */}
              {visibleTrends.length > 1 && (
                <polyline
                  fill="none"
                  stroke="#94a3b8"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                  points={visibleTrends.map((t, idx) => `${getSvgX(idx, visibleTrends.length)},${getSvgY(t.sgNationalAvgPsf)}`).join(' ')}
                />
              )}

              {/* Town Average Line (Sky Blue) */}
              {visibleTrends.length > 1 && (
                <polyline
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="2.5"
                  points={visibleTrends.map((t, idx) => `${getSvgX(idx, visibleTrends.length)},${getSvgY(t.townAvgPsf)}`).join(' ')}
                />
              )}

              {/* Subject Property Line (Emerald Solid) */}
              {visibleTrends.length > 1 && (
                <polyline
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="3"
                  points={visibleTrends.map((t, idx) => `${getSvgX(idx, visibleTrends.length)},${getSvgY(t.avgPsf)}`).join(' ')}
                />
              )}

              {/* Points & Labels */}
              {visibleTrends.map((t, idx) => {
                const x = getSvgX(idx, visibleTrends.length);
                const y = getSvgY(t.avgPsf);
                return (
                  <g key={`pt-${idx}`}>
                    <circle cx={x} cy={y} r="4" fill="#10b981" stroke="#ffffff" strokeWidth="1.5" />
                    <text x={x} y={y - 8} fill="#34d399" fontSize="10" fontWeight="bold" textAnchor="middle">
                      ${t.avgPsf}
                    </text>
                    <text x={x} y="208" fill="#94a3b8" fontSize="10" textAnchor="middle">
                      {t.year}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap items-center justify-between gap-4 mt-2 pt-3 border-t border-slate-800 text-xs">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-1 bg-emerald-400 rounded-full" />
                <span className="text-white font-medium">Cluster / Block PSF</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-1 bg-sky-400 rounded-full" />
                <span className="text-slate-300">{townName} Town Avg</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-1 bg-slate-400 rounded-full border-b border-dashed" />
                <span className="text-slate-400">Singapore National Avg</span>
              </div>
            </div>

            <div className="text-slate-300">
              Current Asking: <span className="font-bold text-emerald-400 font-mono">${askingPricePsf} PSF</span>
            </div>
          </div>
        </div>
      ) : (
        /* Bala's Curve View */
        <div className="pt-3">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            <div className="md:col-span-7">
              <svg viewBox="0 0 460 200" className="w-full h-48 select-none">
                {/* Horizontal scale */}
                <line x1="40" y1="170" x2="430" y2="170" stroke="#475569" strokeWidth="1.5" />
                <line x1="40" y1="20" x2="40" y2="170" stroke="#475569" strokeWidth="1.5" />

                {/* Bala's Curve Line */}
                <path
                  d={`M ${balasTable.map((pt, i) => `${40 + (i / (balasTable.length - 1)) * 390},${170 - (pt.pct / 100) * 140}`).join(' L ')}`}
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="3"
                />

                {/* Current Remaining Lease Marker */}
                {(() => {
                  const x = 40 + ((99 - remainingLease) / 99) * 390;
                  const pct = remainingLease > 70 ? 84.8 : remainingLease > 50 ? 65 : 40;
                  const y = 170 - (pct / 100) * 140;
                  return (
                    <g>
                      <line x1={x} y1="20" x2={x} y2="170" stroke="#10b981" strokeWidth="1.5" strokeDasharray="3 3" />
                      <circle cx={x} cy={y} r="6" fill="#10b981" stroke="#ffffff" strokeWidth="2" />
                      <text x={x} y="15" fill="#34d399" fontSize="10" fontWeight="bold" textAnchor="middle">
                        This Unit: {remainingLease} Yrs ({pct}%)
                      </text>
                    </g>
                  );
                })()}

                <text x="40" y="185" fill="#94a3b8" fontSize="9" textAnchor="middle">99 yrs</text>
                <text x="235" y="185" fill="#94a3b8" fontSize="9" textAnchor="middle">50 yrs</text>
                <text x="430" y="185" fill="#94a3b8" fontSize="9" textAnchor="middle">0 yrs</text>
              </svg>
            </div>

            <div className="md:col-span-5 bg-slate-950/60 p-4 rounded-xl border border-slate-800 text-xs space-y-2.5">
              <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                <Info className="w-4 h-4" />
                <span>Lease Decay Impact</span>
              </div>
              <p className="text-slate-300 leading-relaxed">
                At <span className="text-white font-bold">{remainingLease} years remaining</span>, this unit retains approximately <span className="text-emerald-400 font-bold font-mono">81.5%</span> of freehold equivalent value on the Singapore Land Authority (SLA) table.
              </p>
              <div className="bg-slate-900 p-2 rounded-lg border border-slate-800 flex items-center justify-between text-slate-300">
                <span>CPF Financing Max:</span>
                <span className="font-semibold text-emerald-400">100% Eligible (Age + Lease &gt; 95)</span>
              </div>
              <div className="bg-slate-900 p-2 rounded-lg border border-slate-800 flex items-center justify-between text-slate-300">
                <span>Bank / HDB Loan Tenure:</span>
                <span className="font-semibold text-white">Full 25-30 Years</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
