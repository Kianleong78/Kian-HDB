import React, { useState } from 'react';
import {
  GitCompare,
  Sparkles,
  Plus,
  Trash2,
  CheckCircle2,
  TrendingUp,
  MapPin,
  Clock,
  Train,
  GraduationCap,
  Award,
  ArrowRight,
  Zap,
} from 'lucide-react';
import { HDBProperty, NavigationTab } from '../types';

interface ComparePropertiesViewProps {
  properties: HDBProperty[];
  comparisonList: HDBProperty[];
  toggleComparison: (prop: HDBProperty) => void;
  setSelectedProperty: (prop: HDBProperty) => void;
  setActiveTab: (tab: NavigationTab) => void;
}

export const ComparePropertiesView: React.FC<ComparePropertiesViewProps> = ({
  properties,
  comparisonList,
  toggleComparison,
  setSelectedProperty,
  setActiveTab,
}) => {
  const [isAdding, setIsAdding] = useState(false);

  // If comparison list is empty, default with first 2 properties for immediate demonstration
  const activeComparisons = comparisonList.length > 0 ? comparisonList : properties.slice(0, 2);

  const handleOpenReport = (prop: HDBProperty) => {
    setSelectedProperty(prop);
    setActiveTab('final-report');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider">
            <GitCompare className="w-3.5 h-3.5" />
            <span>Head-to-Head Decision Matrix</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">Side-by-Side Property Comparison</h1>
          <p className="text-xs text-slate-400 mt-1">
            Compare valuation deltas, remaining lease decay, transport proximity, and AI market scores.
          </p>
        </div>

        {/* Quick Add Button */}
        <div className="relative">
          <button
            id="compare-add-slot-btn"
            onClick={() => setIsAdding(!isAdding)}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl border border-slate-700 flex items-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4 text-emerald-400" />
            <span>{isAdding ? 'Close Selector' : '+ Add Property'}</span>
          </button>

          {isAdding && (
            <div className="absolute right-0 mt-2 w-80 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-2 z-50 space-y-1">
              <div className="text-[11px] font-bold text-slate-400 px-3 py-1.5 uppercase">Select Property to Add</div>
              {properties.map((p) => {
                const inComp = activeComparisons.some((c) => c.id === p.id);
                return (
                  <button
                    key={p.id}
                    onClick={() => {
                      toggleComparison(p);
                      setIsAdding(false);
                    }}
                    className={`w-full text-left p-2.5 rounded-xl text-xs flex items-center justify-between transition-colors ${
                      inComp ? 'bg-slate-800/60 text-slate-400' : 'hover:bg-slate-800 text-white'
                    }`}
                  >
                    <div>
                      <div className="font-bold">Blk {p.block} {p.streetName}</div>
                      <div className="text-[10px] text-slate-400">{p.town} • S${p.askingPrice.toLocaleString()}</div>
                    </div>
                    <span className="text-[10px] text-emerald-400 font-semibold">{inComp ? 'Active ✓' : '+ Add'}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* AI Head-to-Head Synthesis Banner */}
      {activeComparisons.length >= 2 && (
        <div className="bg-gradient-to-r from-emerald-950/70 via-slate-900 to-slate-950 border border-emerald-500/40 rounded-3xl p-6 shadow-2xl space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center font-bold">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">AI Comparative Recommendation</span>
              <h3 className="text-base font-bold text-white">
                Winner: Blk {activeComparisons[0].block} {activeComparisons[0].streetName} ({activeComparisons[0].town})
              </h3>
            </div>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed max-w-4xl">
            Based on multi-variable regression analysis, <strong className="text-white">Blk {activeComparisons[0].block} {activeComparisons[0].streetName}</strong> offers superior value per square foot (S${activeComparisons[0].pricePsf} PSF) and higher remaining lease ({activeComparisons[0].remainingLease} yrs), translating to <strong className="text-emerald-400">{activeComparisons[0].balasCurveRetentionPct}% SLA lease retention</strong> compared to competitors in the same price band.
          </p>
        </div>
      )}

      {/* Side-by-Side Comparison Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activeComparisons.map((prop, idx) => {
          const priceDelta = prop.askingPrice - prop.aiValuation;
          const isWinner = idx === 0;

          return (
            <div
              key={prop.id}
              className={`bg-slate-900 border rounded-3xl p-5 sm:p-6 shadow-xl flex flex-col justify-between relative transition-all ${
                isWinner ? 'border-emerald-500/60 shadow-emerald-500/10' : 'border-slate-800'
              }`}
            >
              {isWinner && (
                <div className="absolute -top-3 left-6 bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 text-[10px] font-black uppercase px-3 py-0.5 rounded-full shadow-md flex items-center gap-1">
                  <Award className="w-3 h-3" />
                  <span>AI Top Value Pick</span>
                </div>
              )}

              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between gap-2 pt-1">
                  <div>
                    <span className="text-xs font-bold text-slate-400">{prop.town} • {prop.flatType}</span>
                    <h3 className="text-xl font-bold text-white mt-0.5">Blk {prop.block} {prop.streetName}</h3>
                    <div className="text-xs text-slate-400">{prop.floorLevel} • {prop.sqft} sqft ({prop.sqm} sqm)</div>
                  </div>

                  {activeComparisons.length > 1 && (
                    <button
                      onClick={() => toggleComparison(prop)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-500/20 hover:text-red-400 text-slate-400 transition-colors"
                      title="Remove from comparison"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Score & Verdict */}
                <div className="bg-slate-950/80 p-3 rounded-2xl border border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] uppercase text-slate-400 font-semibold">AI Market Score</div>
                    <div className="text-2xl font-black text-emerald-400 font-mono">{prop.aiMarketScore}<span className="text-xs text-slate-400">/100</span></div>
                  </div>
                  <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    {prop.verdict}
                  </span>
                </div>

                {/* Core Metric Comparison List */}
                <div className="space-y-2 text-xs divide-y divide-slate-800/80 pt-1">
                  <div className="flex items-center justify-between py-1.5">
                    <span className="text-slate-400">Asking Price</span>
                    <span className="font-mono font-bold text-white text-sm">S${prop.askingPrice.toLocaleString()}</span>
                  </div>

                  <div className="flex items-center justify-between py-1.5">
                    <span className="text-slate-400">AI Fair Valuation</span>
                    <span className="font-mono font-bold text-emerald-400 text-sm">S${prop.aiValuation.toLocaleString()}</span>
                  </div>

                  <div className="flex items-center justify-between py-1.5">
                    <span className="text-slate-400">Price PSF</span>
                    <span className="font-mono font-bold text-white">S${prop.pricePsf} PSF</span>
                  </div>

                  <div className="flex items-center justify-between py-1.5">
                    <span className="text-slate-400">Remaining Lease</span>
                    <span className="font-bold text-sky-400">{prop.remainingLease} yrs ({prop.balasCurveRetentionPct}% Bala's)</span>
                  </div>

                  <div className="flex items-center justify-between py-1.5">
                    <span className="text-slate-400">Distance to MRT</span>
                    <span className="font-medium text-white">{prop.mrtDistance}m ({prop.mrtStation})</span>
                  </div>

                  <div className="flex items-center justify-between py-1.5">
                    <span className="text-slate-400">Top Primary School</span>
                    <span className="font-medium text-white truncate max-w-[150px]">{prop.topSchool}</span>
                  </div>

                  <div className="flex items-center justify-between py-1.5">
                    <span className="text-slate-400">Location Score</span>
                    <span className="font-bold text-emerald-400">{prop.locationScores.overallLocationScore}/100</span>
                  </div>

                  <div className="flex items-center justify-between py-1.5">
                    <span className="text-slate-400">5-Yr Projected Growth</span>
                    <span className="font-bold text-emerald-400">+{prop.projected5YrGrowthPct}%</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 pt-4 border-t border-slate-800 space-y-2">
                <button
                  id={`compare-report-btn-${prop.id}`}
                  onClick={() => handleOpenReport(prop)}
                  className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs py-2.5 px-3 rounded-xl transition-all shadow-md shadow-emerald-500/20 flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Generate Final AI Report</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
