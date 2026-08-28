import React, { useState } from 'react';
import {
  Sparkles,
  TrendingUp,
  ShieldAlert,
  Percent,
  CheckCircle2,
  Calendar,
  Building,
  MapPin,
  Clock,
  ArrowRight,
  Info,
  DollarSign,
  Briefcase,
  Layers,
  ChevronRight,
  Calculator,
} from 'lucide-react';
import { HDBProperty, NavigationTab } from '../types';
import { PriceChart } from '../components/PriceChart';
import { InteractiveMap } from '../components/InteractiveMap';
import { PropertyCommentCountBadge, PropertyDiscussionSection } from '../components/DisqusComments';

interface PropertyAnalysisViewProps {
  property: HDBProperty;
  setActiveTab: (tab: NavigationTab) => void;
}

export const PropertyAnalysisView: React.FC<PropertyAnalysisViewProps> = ({
  property,
  setActiveTab,
}) => {
  const [activeNegotiationTab, setActiveNegotiationTab] = useState<'buyer' | 'seller'>('buyer');

  const priceDelta = property.askingPrice - property.aiValuation;
  const priceDeltaPct = ((priceDelta / property.aiValuation) * 100).toFixed(1);
  const isUndervalued = priceDelta <= 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-extrabold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                {property.verdict}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                {property.town} • {property.flatType} • {property.model}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                Lease Commenced: {property.leaseCommenceDate} ({property.remainingLease} yrs left)
              </span>
              <div className="px-3 py-1 rounded-full text-xs bg-slate-800/90 text-slate-300 border border-slate-700">
                <PropertyCommentCountBadge property={property} />
              </div>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Blk {property.block} {property.streetName}
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
              {property.description}
            </p>
          </div>

          {/* Large Hero AI Score Badge & CTA */}
          <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end gap-3 shrink-0">
            <div className="bg-slate-950/80 border border-slate-700 p-4 rounded-2xl flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 text-slate-950 flex items-center justify-center font-black text-2xl shadow-lg shadow-emerald-500/20">
                {property.aiMarketScore}
              </div>
              <div>
                <div className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">AI Market Score</div>
                <div className="text-sm font-bold text-white">Out of 100</div>
                <div className="text-[11px] text-slate-400">{property.aiConfidenceScore}% AI Confidence</div>
              </div>
            </div>

            <button
              id="analysis-hero-report-cta"
              onClick={() => setActiveTab('final-report')}
              className="w-full sm:w-auto px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-300 hover:from-emerald-300 hover:to-teal-200 text-slate-950 font-black text-xs transition-all shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Launch Hero Final AI Report</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Core Valuation & Pricing Quadrant */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Asking Price vs Market */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-lg">
          <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Asking Price</div>
          <div className="text-2xl font-black text-white font-mono mt-1">
            S${property.askingPrice.toLocaleString()}
          </div>
          <div className="mt-2 text-xs flex items-center gap-1.5 font-semibold">
            {isUndervalued ? (
              <span className="text-emerald-400 flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" /> {Math.abs(Number(priceDeltaPct))}% Below Valuation
              </span>
            ) : (
              <span className="text-amber-400 flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" /> +{priceDeltaPct}% Over Base Valuation
              </span>
            )}
          </div>
        </div>

        {/* AI Estimated Property Value */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-lg">
          <div className="text-xs text-emerald-400 font-semibold uppercase tracking-wider flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Estimated Value</span>
          </div>
          <div className="text-2xl font-black text-emerald-400 font-mono mt-1">
            S${property.aiValuation.toLocaleString()}
          </div>
          <div className="mt-2 text-xs text-slate-400">
            Fair Range: S${(property.fairPriceMin / 1000).toFixed(0)}k - S${(property.fairPriceMax / 1000).toFixed(0)}k
          </div>
        </div>

        {/* Price PSF & Capital Growth */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-lg">
          <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Unit Price PSF</div>
          <div className="text-2xl font-black text-white font-mono mt-1">
            S${property.pricePsf} <span className="text-xs text-slate-400 font-normal">/ sqft</span>
          </div>
          <div className="mt-2 text-xs text-emerald-400 font-medium">
            5-Yr Growth Forecast: +{property.projected5YrGrowthPct}%
          </div>
        </div>

        {/* Remaining Lease & Bala's Retention */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-lg">
          <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Remaining Lease</div>
          <div className="text-2xl font-black text-sky-400 font-mono mt-1">
            {property.remainingLease} Years
          </div>
          <div className="mt-2 text-xs text-slate-300">
            SLA Value Retention: <span className="font-bold text-white">{property.balasCurveRetentionPct}%</span>
          </div>
        </div>
      </div>

      {/* Historical 1/3/5/10-Yr Price Trends & Bala's Curve */}
      <PriceChart
        trends={property.historicalTrends}
        remainingLease={property.remainingLease}
        askingPricePsf={property.pricePsf}
        townName={property.town}
      />

      {/* Decision Strategy & Negotiation Brackets (Buyer vs Seller) */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Decision Playbook</div>
            <h3 className="text-xl font-bold text-white mt-0.5">Tactical Negotiation & Suggested Pricing</h3>
          </div>

          {/* Toggle Buyer / Seller View */}
          <div className="bg-slate-800 p-1 rounded-xl flex items-center border border-slate-700 text-xs">
            <button
              id="toggle-buyer-strategy"
              onClick={() => setActiveNegotiationTab('buyer')}
              className={`px-4 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
                activeNegotiationTab === 'buyer' ? 'bg-emerald-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              <DollarSign className="w-3.5 h-3.5" />
              <span>Buyer Suggested Offer</span>
            </button>
            <button
              id="toggle-seller-strategy"
              onClick={() => setActiveNegotiationTab('seller')}
              className={`px-4 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
                activeNegotiationTab === 'seller' ? 'bg-emerald-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>Seller Suggested Listing</span>
            </button>
          </div>
        </div>

        {activeNegotiationTab === 'buyer' ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-950/60 border border-slate-800 p-5 rounded-2xl">
              <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Aggressive Opening Offer</div>
              <div className="text-2xl font-black text-white font-mono mt-2">
                S${property.buyerSuggestedOffer.aggressive.toLocaleString()}
              </div>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Aim for early discount. Best used when seller needs quick liquidity or unit has been on market &gt;45 days.
              </p>
            </div>

            <div className="bg-emerald-950/30 border border-emerald-500/40 p-5 rounded-2xl">
              <div className="text-xs font-bold text-emerald-300 uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>AI Recommended Fair Offer</span>
              </div>
              <div className="text-2xl font-black text-emerald-400 font-mono mt-2">
                S${property.buyerSuggestedOffer.fair.toLocaleString()}
              </div>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                Optimal sweet spot matching recent floor cluster comps with near-zero Cash-Over-Valuation (COV) risk.
              </p>
            </div>

            <div className="bg-slate-950/60 border border-slate-800 p-5 rounded-2xl">
              <div className="text-xs font-bold text-amber-400 uppercase tracking-wider">Walk-Away Ceiling Price</div>
              <div className="text-2xl font-black text-white font-mono mt-2">
                S${property.buyerSuggestedOffer.ceiling.toLocaleString()}
              </div>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Maximum allowable bid before yield drops and buyer pays excessive cash premium over appraisal.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-950/60 border border-slate-800 p-5 rounded-2xl">
              <div className="text-xs font-bold text-sky-400 uppercase tracking-wider">Fast-Liquidity Listing</div>
              <div className="text-2xl font-black text-white font-mono mt-2">
                S${property.sellerSuggestedListing.quickSale.toLocaleString()}
              </div>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Targeting closure within 14-21 days for sellers bridging into new BTO/condo key collection.
              </p>
            </div>

            <div className="bg-emerald-950/30 border border-emerald-500/40 p-5 rounded-2xl">
              <div className="text-xs font-bold text-emerald-300 uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Recommended Market Target</span>
              </div>
              <div className="text-2xl font-black text-emerald-400 font-mono mt-2">
                S${property.sellerSuggestedListing.marketTarget.toLocaleString()}
              </div>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                Maximizes net proceeds while staying within active buyer affordability thresholds (MSR 30%).
              </p>
            </div>

            <div className="bg-slate-950/60 border border-slate-800 p-5 rounded-2xl">
              <div className="text-xs font-bold text-purple-400 uppercase tracking-wider">Aggressive Premium Listing</div>
              <div className="text-2xl font-black text-white font-mono mt-2">
                S${property.sellerSuggestedListing.premium.toLocaleString()}
              </div>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Tests upper ceiling of buyer demand for rare unblocked high floors or fully renovated designer units.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Comparable Recent Transactions Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Cluster Benchmark Comps</div>
            <h3 className="text-xl font-bold text-white mt-0.5">Recent Transacted Sales (Same Street & Model)</h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">Past 6 Months</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-3">Block & Street</th>
                <th className="py-3 px-3">Floor Level</th>
                <th className="py-3 px-3">Area</th>
                <th className="py-3 px-3">Transacted Price</th>
                <th className="py-3 px-3">Price PSF</th>
                <th className="py-3 px-3">Date</th>
                <th className="py-3 px-3">Distance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200">
              {property.comparables.map((comp) => (
                <tr key={comp.id} className="hover:bg-slate-800/40 transition-colors font-medium">
                  <td className="py-3.5 px-3 font-semibold text-white">
                    Blk {comp.block} {comp.streetName}
                  </td>
                  <td className="py-3.5 px-3 text-slate-300">{comp.storeyRange}</td>
                  <td className="py-3.5 px-3">{comp.sqft} sqft ({comp.sqm} sqm)</td>
                  <td className="py-3.5 px-3 font-mono font-bold text-emerald-400">
                    S${comp.transactedPrice.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-3 font-mono text-slate-300">S${comp.pricePsf}</td>
                  <td className="py-3.5 px-3 text-slate-400">{comp.transactionDate}</td>
                  <td className="py-3.5 px-3 text-slate-400">{comp.distanceMeters}m away</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Interactive Map & Amenities */}
      <InteractiveMap property={property} />

      {/* Community Comments & Discussion Thread powered by Disqus */}
      <PropertyDiscussionSection property={property} />
    </div>
  );
};
