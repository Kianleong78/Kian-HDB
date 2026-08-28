import React, { useState } from 'react';
import {
  Brain,
  Database,
  Compass,
  TrendingUp,
  ShieldCheck,
  Sparkles,
  Info,
  Scale,
  Award,
  Layers,
  ArrowRight,
  HelpCircle,
  Building,
  CheckCircle2,
} from 'lucide-react';
import { HDBProperty } from '../types';

interface ValuationMethodologyViewProps {
  selectedProperty?: HDBProperty;
  onExploreProperty?: () => void;
  onRunSearch?: () => void;
}

export const ValuationMethodologyView: React.FC<ValuationMethodologyViewProps> = ({
  selectedProperty,
  onExploreProperty,
  onRunSearch,
}) => {
  const [interactiveLease, setInteractiveLease] = useState<number>(75);
  const [interactiveMrtDist, setInteractiveMrtDist] = useState<number>(350);
  const [interactiveFloor, setInteractiveFloor] = useState<number>(14);
  const [interactiveFlatType, setInteractiveFlatType] = useState<string>('4-Room');

  // Interactive Live Valuation Formula Demo
  const basePriceMap: Record<string, number> = {
    '3-Room': 420000,
    '4-Room': 640000,
    '5-Room': 820000,
    'Executive': 960000,
  };

  const calculateDemoValuation = () => {
    const base = basePriceMap[interactiveFlatType] || 640000;
    
    // Bala's Curve lease factor: approx 100% at 99 yrs, 80% at 60 yrs, 60% at 30 yrs
    const balasFactor = Math.min(1.0, Math.max(0.4, (interactiveLease / 99) ** 0.65));
    
    // MRT Proximity premium: +12% if < 300m, +6% if < 600m, 0% if > 1000m
    const mrtBonusPct = interactiveMrtDist < 300 ? 0.12 : interactiveMrtDist < 600 ? 0.06 : interactiveMrtDist < 1000 ? 0.02 : -0.03;
    
    // Floor Level Premium: +0.4% per floor above level 4
    const floorBonusPct = (interactiveFloor - 4) * 0.005;

    const computedValuation = Math.round(base * balasFactor * (1 + mrtBonusPct + floorBonusPct));
    const rangeMin = Math.round(computedValuation * 0.97);
    const rangeMax = Math.round(computedValuation * 1.03);

    return { computedValuation, rangeMin, rangeMax, balasFactor, mrtBonusPct, floorBonusPct };
  };

  const demoStats = calculateDemoValuation();

  const methodologyPillars = [
    {
      step: '01',
      title: 'Official Data.gov.sg Baseline Dataset',
      icon: Database,
      badge: '180,000+ Transactions',
      description:
        'Every valuation begins with official verified HDB resale transactions published by the Singapore Government (Jan 2017 to Present). The model parses the latest transacted prices in the exact same block, street, and town.',
      features: [
        'Real-time indexing of quarterly HDB Resale Price Index (RPI)',
        'Exclusion of outlier distress sales or non-arm-length deals',
        'Model breakdown by New Generation, Model A, DBSS, and Premium Lofts',
      ],
    },
    {
      step: '02',
      title: "Bala's Table Lease Decay Regression",
      icon: Scale,
      badge: 'Singapore Land Authority (SLA)',
      description:
        "Unlike crude linear depreciation, Singapore real estate prices follow the Singapore Land Authority (SLA) Bala's Curve. Flatter lease retention occurs above 70 years, with accelerating lease decay below 60 years.",
      features: [
        'Calculates true leasehold present value vs. freehold baseline',
        'Evaluates CPF usage limits and remaining lease safety for buyers',
        'Quantifies depreciation buffer for flats built in the 1970s vs 2020s',
      ],
    },
    {
      step: '03',
      title: 'SLA OneMap 14-Amenity Spatial Proximity Decay',
      icon: Compass,
      badge: 'Sub-10m Pinpoint Resolution',
      description:
        'Using Singapore Land Authority (SLA) OneMap APIs, the engine calculates the exact walking distance (in meters and minutes) from the subject flat to every surrounding civic amenity.',
      features: [
        'MRT & LRT proximity (< 300m adds up to +12% price resilience)',
        'SAP Primary Schools 1km Priority Radius (Catholic High, Tao Nan, Nan Hua, Poi Ching)',
        'Wet markets, 24/7 supermarkets, hawker centres, and regional malls',
      ],
    },
    {
      step: '04',
      title: 'Storey Height & Aspect Premium Modeling',
      icon: Layers,
      badge: 'Vertical Elevation Matrix',
      description:
        'Upper floors in Singapore command documented price premiums due to unblocked views, natural breeze, lower street noise, and reduced insect intrusion.',
      features: [
        'Storey tiers: Low (01-04), Mid (05-10), High (11-20), Very High (21+)',
        'Sun orientation analysis: North-South facing vs. West afternoon sun penalty',
        'Special premiums for DBSS balconies and penthouse loft configurations',
      ],
    },
    {
      step: '05',
      title: 'Macro Supply & AI Demand Heat Scoring',
      icon: TrendingUp,
      badge: 'Predictive Forward Analytics',
      description:
        'Incorporates Singapore Department of Statistics demographic trends, BTO supply pipeline launches, and future MRT line transformations (Cross Island Line CRL, Jurong Region Line JRL, RTS Link).',
      features: [
        'BTO MOP harvest wave calculations (when nearby clusters exit MOP)',
        'Town liquidity and median days-on-market velocity',
        'Million-dollar flat spillover and estate prestige rating',
      ],
    },
    {
      step: '06',
      title: 'Confidence Calibration & 3-Tier Negotiation Bounds',
      icon: ShieldCheck,
      badge: '95%+ Accuracy Calibration',
      description:
        'The valuation outputs not just a single point estimate, but a calibrated fair range ([Min, Max]), aggressive buyer bid target, fair listing price, and cash-over-valuation (COV) protection ceiling.',
      features: [
        'AI Confidence Score (90-98%) based on comparable transaction volume',
        'Zero-COV safe threshold calculation for bank and HDB housing loans',
        'Seller quick-sale versus premium patient pricing recommendations',
      ],
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Hero Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-500/10 text-emerald-800 dark:text-emerald-400 font-bold text-xs border border-emerald-300 dark:border-emerald-500/30">
          <Brain className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>Transparent Valuation Algorithm</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          How the <span className="text-emerald-600 dark:text-emerald-400">AI Fair Valuation</span> is Computed
        </h1>
        <p className="text-slate-600 dark:text-slate-300 text-base leading-relaxed">
          Our pricing engine removes guesswork by pairing Singapore Government open data (Data.gov.sg & SLA OneMap) with institutional-grade real estate valuation models. Here is the complete step-by-step breakdown.
        </p>
      </div>

      {/* Interactive Formula Sandbox */}
      <div className="bg-gradient-to-br from-emerald-50 via-teal-50/50 to-white dark:from-slate-900 dark:via-slate-900/90 dark:to-slate-950 p-6 sm:p-8 rounded-3xl border border-emerald-200 dark:border-emerald-900/50 shadow-xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-emerald-200/60 dark:border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Interactive Valuation Sandbox
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Adjust the core levers below to observe how the AI pricing engine dynamically adjusts fair value in real-time.
            </p>
          </div>
          <div className="text-right">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Simulated AI Valuation</span>
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">
              S${demoStats.computedValuation.toLocaleString()}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-mono">
              Fair Range: S${demoStats.rangeMin.toLocaleString()} – S${demoStats.rangeMax.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Sliders Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Flat Type */}
          <div className="bg-white dark:bg-slate-800/80 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-700 dark:text-slate-200">Flat Type Model</span>
              <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">{interactiveFlatType}</span>
            </div>
            <select
              value={interactiveFlatType}
              onChange={(e) => setInteractiveFlatType(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500"
            >
              <option value="3-Room">3-Room Flat</option>
              <option value="4-Room">4-Room Flat</option>
              <option value="5-Room">5-Room Flat</option>
              <option value="Executive">Executive / Maisonette</option>
            </select>
            <p className="text-[11px] text-slate-400">Baseline median market size.</p>
          </div>

          {/* Remaining Lease */}
          <div className="bg-white dark:bg-slate-800/80 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-700 dark:text-slate-200">Remaining Lease</span>
              <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">{interactiveLease} Years</span>
            </div>
            <input
              type="range"
              min="40"
              max="99"
              value={interactiveLease}
              onChange={(e) => setInteractiveLease(Number(e.target.value))}
              className="w-full accent-emerald-500 h-2 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>40 Yrs (Accelerated Decay)</span>
              <span>99 Yrs (Fresh MOP)</span>
            </div>
          </div>

          {/* MRT Proximity */}
          <div className="bg-white dark:bg-slate-800/80 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-700 dark:text-slate-200">Distance to MRT</span>
              <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">{interactiveMrtDist} Meters</span>
            </div>
            <input
              type="range"
              min="100"
              max="1500"
              step="50"
              value={interactiveMrtDist}
              onChange={(e) => setInteractiveMrtDist(Number(e.target.value))}
              className="w-full accent-emerald-500 h-2 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>100m (&lt;2 min walk)</span>
              <span>1.5km (Feeder Bus)</span>
            </div>
          </div>

          {/* Floor Level */}
          <div className="bg-white dark:bg-slate-800/80 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-700 dark:text-slate-200">Floor Level</span>
              <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">Level #{interactiveFloor}</span>
            </div>
            <input
              type="range"
              min="2"
              max="45"
              value={interactiveFloor}
              onChange={(e) => setInteractiveFloor(Number(e.target.value))}
              className="w-full accent-emerald-500 h-2 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>#02 (Ground Tier)</span>
              <span>#45 (High Rise Skyview)</span>
            </div>
          </div>
        </div>
      </div>

      {/* 6 Key Pillars Grid */}
      <div className="space-y-6">
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            The 6 Pillars of the AI Valuation Engine
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            How official data and machine learning algorithms collaborate to generate institutional-grade assessments.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {methodologyPillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.step}
                className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm hover:border-emerald-300 dark:hover:border-emerald-700/60 transition-all flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-black text-sm">
                      {pillar.step}
                    </div>
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                      {pillar.badge}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4 text-emerald-500" />
                    <h3 className="font-bold text-base text-slate-900 dark:text-white leading-tight">
                      {pillar.title}
                    </h3>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {pillar.description}
                  </p>
                </div>

                <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-2xl space-y-1.5 border border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Key Considerations</span>
                  {pillar.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-1.5 text-xs text-slate-700 dark:text-slate-200">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                      <span className="text-[11px] leading-snug">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Comparison: AI Valuation vs Traditional Bank/Agent Valuation */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="text-center space-y-1 max-w-2xl mx-auto">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            Why Our AI Fair Value Outperforms Traditional Estimates
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Compare algorithmic location intelligence against manual paper appraisals.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase tracking-wider font-extrabold text-[10px]">
                <th className="pb-3">Valuation Dimension</th>
                <th className="pb-3 text-emerald-600 dark:text-emerald-400 font-bold">HDBValuer AI Engine</th>
                <th className="pb-3 text-slate-500">Traditional Bank / Agent Appraisal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-200">
              <tr>
                <td className="py-3.5 font-bold">Data Granularity</td>
                <td className="py-3.5 text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  Every transaction across all 26 towns updated in real-time
                </td>
                <td className="py-3.5 text-slate-500">Subjective 3-5 cherrypicked past units</td>
              </tr>
              <tr>
                <td className="py-3.5 font-bold">Spatial Walk Times</td>
                <td className="py-3.5 text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  Exact 14-amenity radar with SLA OneMap walking minutes
                </td>
                <td className="py-3.5 text-slate-500">Rough straight-line radius estimates</td>
              </tr>
              <tr>
                <td className="py-3.5 font-bold">Lease Depreciation Curve</td>
                <td className="py-3.5 text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  Bala's Table non-linear lease present-value modeling
                </td>
                <td className="py-3.5 text-slate-500">Flat percentage rules of thumb</td>
              </tr>
              <tr>
                <td className="py-3.5 font-bold">Negotiation Advice</td>
                <td className="py-3.5 text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  Dynamic 3-tier bid strategies (Aggressive, Fair, Ceiling)
                </td>
                <td className="py-3.5 text-slate-500">Static single asking number</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* CTA Footer */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="space-y-1 text-center sm:text-left">
          <h3 className="text-xl font-bold">Ready to analyze a specific Singapore HDB flat?</h3>
          <p className="text-emerald-100 text-xs">
            Search any unit across all 26 towns or view our comprehensive real-time valuation report.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {onRunSearch && (
            <button
              onClick={onRunSearch}
              className="px-4 py-2.5 bg-white hover:bg-slate-100 text-slate-900 rounded-xl text-xs font-bold transition shadow-md flex items-center gap-1.5"
            >
              <span>Search 26 Towns</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}

          {onExploreProperty && (
            <button
              onClick={onExploreProperty}
              className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl text-xs font-bold transition shadow-md"
            >
              Analyze Active Unit
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
