import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Printer,
  Download,
  Share2,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Building2,
  DollarSign,
  TrendingUp,
  MapPin,
  Clock,
  Compass,
  ArrowRight,
  RotateCw,
  Award,
  Zap,
  Percent,
  Layers,
  ChevronDown,
} from 'lucide-react';
import { HDBProperty, AIPropertyReport, NavigationTab } from '../types';
import { InteractiveMap } from '../components/InteractiveMap';
import { PriceChart } from '../components/PriceChart';
import { PropertyCommentCountBadge, PropertyDiscussionSection } from '../components/DisqusComments';

interface FinalAIReportViewProps {
  property: HDBProperty;
  properties: HDBProperty[];
  setSelectedProperty: (prop: HDBProperty) => void;
  setActiveTab: (tab: NavigationTab) => void;
}

export const FinalAIReportView: React.FC<FinalAIReportViewProps> = ({
  property,
  properties,
  setSelectedProperty,
  setActiveTab,
}) => {
  const [report, setReport] = useState<AIPropertyReport | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [copiedUrl, setCopiedUrl] = useState<boolean>(false);

  // Generate or load AI structured synthesis
  const generateLiveReport = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch('/api/gemini/property-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ propertyContext: property }),
      });
      const data = await res.json();
      if (data.report) {
        setReport(data.report);
      }
    } catch (err) {
      console.error('Report fetch error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    generateLiveReport();
  }, [property.id]);

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  const priceDelta = property.askingPrice - property.aiValuation;
  const priceDeltaPct = ((priceDelta / property.aiValuation) * 100).toFixed(1);
  const isUndervalued = priceDelta <= 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 print:p-0 print:m-0 print:space-y-4">
      {/* Top Banner Control & Hero Identity */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800 print:hidden">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-300 text-slate-950 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                Official Hero Decision Output
              </span>
              <span className="text-xs text-slate-400">Institutional-Grade Valuation Dossier</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white mt-0.5">Final AI Property Report</h1>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Quick property select */}
          <select
            id="report-select-prop"
            value={property.id}
            onChange={(e) => {
              const found = properties.find((p) => p.id === e.target.value);
              if (found) setSelectedProperty(found);
            }}
            className="bg-slate-900 border border-slate-700 text-white text-xs font-semibold rounded-xl px-3 py-2 focus:outline-none"
          >
            {properties.map((p) => (
              <option key={p.id} value={p.id}>
                Blk {p.block} {p.streetName} ({p.town}) - S${(p.askingPrice / 1000).toFixed(0)}k
              </option>
            ))}
          </select>

          <button
            id="report-re-audit-btn"
            onClick={generateLiveReport}
            disabled={isGenerating}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-all flex items-center gap-1.5 border border-slate-700"
          >
            <RotateCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin text-emerald-400' : ''}`} />
            <span>{isGenerating ? 'Analyzing...' : 'Re-Run Audit'}</span>
          </button>

          <button
            id="report-share-btn"
            onClick={handleShare}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors border border-slate-700"
            title="Share Report Link"
          >
            <Share2 className="w-4 h-4" />
          </button>

          <button
            id="report-print-btn"
            onClick={handlePrint}
            className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black transition-all flex items-center gap-1.5 shadow-lg shadow-emerald-500/20"
          >
            <Printer className="w-4 h-4" />
            <span>Print / PDF</span>
          </button>
        </div>
      </div>

      {/* Hero Decision Box: "So, based on everything, what should I do?" */}
      <section className="bg-gradient-to-r from-emerald-950/90 via-slate-900 to-slate-950 border-2 border-emerald-500/60 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-500 text-slate-950">
                Core AI Verdict: {report?.executiveVerdict || property.verdict}
              </span>
              <span className="text-xs text-emerald-300 font-medium">Confidence: {property.aiConfidenceScore}%</span>
              <div className="px-3 py-0.5 rounded-full text-xs bg-slate-950/70 border border-slate-700 text-slate-300">
                <PropertyCommentCountBadge property={property} />
              </div>
            </div>

            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Blk {property.block} {property.streetName}, {property.town}
            </h2>

            <p className="text-sm sm:text-base text-slate-200 font-medium max-w-3xl leading-relaxed">
              {report?.oneSentenceSummary ||
                `Based on our algorithmic analysis of ${property.town} resale trends, cluster comps, and remaining lease (${property.remainingLease} years), this flat is priced ${isUndervalued ? `${Math.abs(Number(priceDeltaPct))}% below` : `${priceDeltaPct}% above`} estimated fair market value. Recommended for buyers seeking ${property.topSchool} school proximity and strong connectivity.`}
            </p>
          </div>

          {/* Large Hero Score Block */}
          <div className="bg-slate-950/90 border border-slate-700 p-5 rounded-2xl flex items-center gap-5 shrink-0 shadow-xl">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 flex items-center justify-center font-black text-3xl shadow-lg shadow-emerald-500/30">
              {report?.overallScore || property.aiMarketScore}
            </div>
            <div>
              <div className="text-[11px] uppercase font-bold text-emerald-400 tracking-wider">AI Overall Score</div>
              <div className="text-lg font-black text-white">Out of 100</div>
              <div className="text-xs text-slate-400">Calculated across 80+ data points</div>
            </div>
          </div>
        </div>

        {/* Clear Action Directives: Buyer Action vs Seller Action */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-800">
          <div className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800/80 space-y-1.5">
            <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Recommended Buyer Action</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {report?.buyerStrategy
                ? `Offer S$${report.buyerStrategy.recommendedOffer.toLocaleString()} (ceiling S$${report.buyerStrategy.maxCeiling.toLocaleString()}). ${report.buyerStrategy.negotiationTactic}`
                : `Open bid at S$${property.buyerSuggestedOffer.aggressive.toLocaleString()} (aggressive) up to S$${property.buyerSuggestedOffer.fair.toLocaleString()} (fair target). Avoid bidding above S$${property.buyerSuggestedOffer.ceiling.toLocaleString()} to eliminate Cash-Over-Valuation (COV) cash outflow.`}
            </p>
          </div>

          <div className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800/80 space-y-1.5">
            <div className="text-xs font-bold text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-sky-400" />
              <span>Recommended Seller Action</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {report?.sellerStrategy
                ? `List at S$${report.sellerStrategy.recommendedListingPrice.toLocaleString()} targeting ${report.sellerStrategy.targetBuyerProfile} (avg ${report.sellerStrategy.expectedDaysOnMarket} days on market).`
                : `List between S$${property.sellerSuggestedListing.marketTarget.toLocaleString()} and S$${property.sellerSuggestedListing.premium.toLocaleString()} highlighting the ${property.mrtDistance}m walk to ${property.mrtStation} and unblocked ${property.floorLevel} views.`}
            </p>
          </div>
        </div>
      </section>

      {/* 4-Pillar Executive Scorecards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Pricing Delta */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-lg">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Asking vs AI Valuation</div>
          <div className="text-2xl font-black text-white font-mono mt-1">
            S${property.askingPrice.toLocaleString()}
          </div>
          <div className="text-xs text-slate-400 mt-0.5">
            AI Base: <span className="font-mono text-emerald-400 font-bold">S${property.aiValuation.toLocaleString()}</span>
          </div>
          <div className="mt-2 text-xs font-bold text-emerald-400">
            {isUndervalued ? `✓ S$${Math.abs(priceDelta).toLocaleString()} Discount` : `+S$${priceDelta.toLocaleString()} Premium`}
          </div>
        </div>

        {/* Fair Price Bracket */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-lg">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Fair Valuation Range</div>
          <div className="text-xl font-black text-emerald-400 font-mono mt-1">
            S${(property.fairPriceMin / 1000).toFixed(0)}k - S${(property.fairPriceMax / 1000).toFixed(0)}k
          </div>
          <div className="text-xs text-slate-400 mt-0.5">Unit PSF: S${property.pricePsf} / sqft</div>
          <div className="mt-2 text-xs font-medium text-slate-300">5-Yr Proj Growth: +{property.projected5YrGrowthPct}%</div>
        </div>

        {/* Location Score */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-lg">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">14-Amenity Location Score</div>
          <div className="text-2xl font-black text-white font-mono mt-1">
            {property.locationScores.overallLocationScore}<span className="text-xs text-slate-400 font-normal">/100</span>
          </div>
          <div className="text-xs text-slate-400 mt-0.5">{property.mrtDistance}m to {property.mrtStation}</div>
          <div className="mt-2 text-xs text-emerald-400 font-medium">Top School: {property.topSchool}</div>
        </div>

        {/* Lease Retention */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-lg">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Remaining Lease & Bala's</div>
          <div className="text-2xl font-black text-sky-400 font-mono mt-1">
            {property.remainingLease} Years
          </div>
          <div className="text-xs text-slate-400 mt-0.5">Commenced {property.leaseCommenceDate}</div>
          <div className="mt-2 text-xs text-slate-200">
            SLA Value Retention: <span className="font-bold text-white">{property.balasCurveRetentionPct}%</span>
          </div>
        </div>
      </section>

      {/* SWOT Analysis Grid */}
      <section className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Multi-Factor Assessment</span>
            <h3 className="text-lg font-bold text-white">Comprehensive Property SWOT & Risk Profile</h3>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Strengths */}
          <div className="bg-slate-950/60 p-5 rounded-2xl border border-slate-800 space-y-2.5">
            <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              <span>Core Strengths</span>
            </div>
            <ul className="space-y-1.5 text-xs text-slate-300">
              {(report?.strengths || [
                `Under 500m walking distance to ${property.mrtStation} MRT`,
                `High floor level (${property.floorLevel}) ensuring natural ventilation and light`,
                `Strong ${property.balasCurveRetentionPct}% SLA lease retention index`,
                `Within SAP school zone for ${property.topSchool}`,
              ]).map((str, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <span className="text-emerald-400 font-bold">•</span>
                  <span>{str}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Weaknesses */}
          <div className="bg-slate-950/60 p-5 rounded-2xl border border-slate-800 space-y-2.5">
            <div className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4" />
              <span>Considerations / Weaknesses</span>
            </div>
            <ul className="space-y-1.5 text-xs text-slate-300">
              {(report?.weaknesses || [
                `Mature estate asking price requires higher CPF OA balance`,
                `High buyer competition in ${property.town} cluster`,
                `Lease decay curve accelerates after 60-year threshold`,
              ]).map((wk, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <span className="text-amber-400 font-bold">•</span>
                  <span>{wk}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Risks & Regulatory Mitigation */}
          <div className="bg-slate-950/60 p-5 rounded-2xl border border-slate-800 space-y-2.5">
            <div className="text-xs font-bold text-red-400 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              <span>Risk & Regulatory Mitigations</span>
            </div>
            <ul className="space-y-1.5 text-xs text-slate-300">
              {(report?.risks || [
                'Ensure HFE approval is locked in before paying option fee',
                'Verify buyer Ethnic Integration Policy (EIP) quota for current month',
                'Check renovation condition to budget additional S$30k-S$60k cash',
              ]).map((risk, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <span className="text-red-400 font-bold">•</span>
                  <span>{risk}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Interactive 14-Category Amenity Map */}
      <InteractiveMap property={property} />

      {/* Full 14-Amenity Walking & Travel Distance Table */}
      <section className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Location Intelligence</div>
            <h3 className="text-xl font-bold text-white mt-0.5">Comprehensive 14-Amenity Proximity Matrix</h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">14 Categories Analyzed</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-3">Amenity Name</th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-3">Walking Time</th>
                <th className="py-3 px-3">Distance</th>
                <th className="py-3 px-3">Rating / Key Highlight</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200">
              {property.amenities.map((amenity) => (
                <tr key={amenity.id} className="hover:bg-slate-800/40 transition-colors font-medium">
                  <td className="py-3.5 px-3 font-bold text-white">{amenity.name}</td>
                  <td className="py-3.5 px-3 uppercase text-[10px] font-bold text-slate-400">
                    {amenity.category.replace('_', ' ')}
                  </td>
                  <td className="py-3.5 px-3 font-mono text-emerald-400 font-bold">
                    {amenity.walkingMinutes} mins walk
                  </td>
                  <td className="py-3.5 px-3 font-mono text-slate-300">{amenity.distanceMeters}m</td>
                  <td className="py-3.5 px-3 text-slate-300">{amenity.highlight || `★ ${amenity.rating}`}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Historical Price Trends & Bala's Curve */}
      <PriceChart
        trends={property.historicalTrends}
        remainingLease={property.remainingLease}
        askingPricePsf={property.pricePsf}
        townName={property.town}
      />

      {/* Cluster Comparable Transactions */}
      <section className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Cluster Verification</div>
            <h3 className="text-xl font-bold text-white mt-0.5">Recent Comparable Transactions</h3>
          </div>
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
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200">
              {property.comparables.map((comp) => (
                <tr key={comp.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-3 font-bold text-white">Blk {comp.block} {comp.streetName}</td>
                  <td className="py-3 px-3 text-slate-300">{comp.storeyRange}</td>
                  <td className="py-3 px-3">{comp.sqft} sqft</td>
                  <td className="py-3 px-3 font-mono font-bold text-emerald-400">S${comp.transactedPrice.toLocaleString()}</td>
                  <td className="py-3 px-3 font-mono text-slate-300">S${comp.pricePsf}</td>
                  <td className="py-3 px-3 text-slate-400">{comp.transactionDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Community Comments & Discussion Section */}
      <div className="print:hidden">
        <PropertyDiscussionSection property={property} />
      </div>

      {/* Next Steps Direct Links */}
      <section className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4 print:hidden">
        <div>
          <h4 className="text-base font-bold text-white">Need Customized Financing or Legal Assistance?</h4>
          <p className="text-xs text-slate-400 mt-1">
            Run the affordability calculator or speak directly with the AI assistant for personalized grant calculations.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('buyer-tools')}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl border border-slate-700 transition-colors"
          >
            Check Affordability
          </button>
          <button
            onClick={() => setActiveTab('ask-ai')}
            className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-xl transition-all shadow-md shadow-emerald-500/20 flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Ask AI Assistant</span>
          </button>
        </div>
      </section>
    </div>
  );
};
