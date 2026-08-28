import React, { useState } from 'react';
import {
  Briefcase,
  Sparkles,
  Share2,
  FileText,
  Copy,
  Check,
  Building2,
  TrendingUp,
  ShieldCheck,
  Send,
  Users,
  Search,
  ExternalLink,
} from 'lucide-react';
import { HDBProperty, NavigationTab } from '../types';

interface AgentProViewProps {
  properties: HDBProperty[];
  selectedProperty: HDBProperty;
  setSelectedProperty: (prop: HDBProperty) => void;
  setActiveTab: (tab: NavigationTab) => void;
}

export const AgentProView: React.FC<AgentProViewProps> = ({
  properties,
  selectedProperty,
  setSelectedProperty,
  setActiveTab,
}) => {
  const [copiedPitch, setCopiedPitch] = useState(false);
  const [targetClientName, setTargetClientName] = useState('Mr. & Mrs. Tan');
  const [clientType, setClientType] = useState<'buyer' | 'seller'>('buyer');

  // Undervalued properties for scanner
  const undervaluedList = properties.filter((p) => p.askingPrice <= p.aiValuation || p.verdict === 'Good Value');

  // WhatsApp Pitch template
  const pitchText = `Hi ${targetClientName}! 🏡

I performed an AI Comparative Market Analysis on *Blk ${selectedProperty.block} ${selectedProperty.streetName} (${selectedProperty.town})*:

• *Flat Type*: ${selectedProperty.flatType} (${selectedProperty.sqft} sqft / ${selectedProperty.sqm} sqm)
• *Asking Price*: S$${selectedProperty.askingPrice.toLocaleString()} (S$${selectedProperty.pricePsf} PSF)
• *AI Algorithmic Fair Value*: S$${selectedProperty.aiValuation.toLocaleString()}
• *AI Verdict*: ${selectedProperty.verdict} (Market Score: ${selectedProperty.aiMarketScore}/100)
• *Key Proximity*: ${selectedProperty.mrtDistance}m to ${selectedProperty.mrtStation} | ${selectedProperty.schoolDistance}m to ${selectedProperty.topSchool}
• *Remaining Lease*: ${selectedProperty.remainingLease} yrs (${selectedProperty.balasCurveRetentionPct}% SLA value retention)

${
  clientType === 'buyer'
    ? `💡 *Buyer Strategy*: Recommended fair offer is *S$${selectedProperty.buyerSuggestedOffer.fair.toLocaleString()}* to secure the unit without Cash-Over-Valuation (COV).`
    : `💡 *Seller Strategy*: Target listing price is *S$${selectedProperty.sellerSuggestedListing.marketTarget.toLocaleString()}* to optimize net cash proceeds within 21 days.`
}

Let's arrange a viewing or discussion this week!`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(pitchText);
    setCopiedPitch(true);
    setTimeout(() => setCopiedPitch(false), 2500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-purple-400 uppercase tracking-wider">
            <Briefcase className="w-3.5 h-3.5" />
            <span>Agent Pro Decision Suite</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">Real Estate Agent CMA & Client Presentation Hub</h1>
          <p className="text-xs text-slate-400 mt-1">
            Generate Comparative Market Analysis decks, client WhatsApp briefs, and scan undervalued clusters.
          </p>
        </div>

        <button
          onClick={() => setActiveTab('final-report')}
          className="px-4 py-2 bg-gradient-to-r from-emerald-400 to-teal-300 text-slate-950 text-xs font-bold rounded-xl flex items-center gap-2 shadow-lg"
        >
          <Sparkles className="w-4 h-4" />
          <span>Launch Full AI Report</span>
        </button>
      </div>

      {/* Grid: WhatsApp Generator & Undervalued Scanner */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Client Pitch & Deck Generator */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2 text-white font-bold text-base">
              <Share2 className="w-4 h-4 text-purple-400" />
              <span>Instant Client WhatsApp Pitch & CMA Brief</span>
            </div>
            <span className="text-xs text-slate-400">1-Click Copy</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-semibold text-slate-400 uppercase mb-1">Client Name</label>
              <input
                type="text"
                id="agent-client-name"
                value={targetClientName}
                onChange={(e) => setTargetClientName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 text-white text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-[10px] font-semibold text-slate-400 uppercase mb-1">Pitch Perspective</label>
              <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-xl border border-slate-700">
                <button
                  id="pitch-type-buyer"
                  onClick={() => setClientType('buyer')}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                    clientType === 'buyer' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  For Buyer
                </button>
                <button
                  id="pitch-type-seller"
                  onClick={() => setClientType('seller')}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                    clientType === 'seller' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  For Seller
                </button>
              </div>
            </div>
          </div>

          {/* Formatted Preview Box */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 font-mono text-xs text-slate-300 leading-relaxed whitespace-pre-wrap select-all">
            {pitchText}
          </div>

          <div className="flex items-center gap-3">
            <button
              id="copy-pitch-btn"
              onClick={copyToClipboard}
              className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                copiedPitch
                  ? 'bg-emerald-500 text-slate-950'
                  : 'bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-600/20'
              }`}
            >
              {copiedPitch ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copiedPitch ? 'Copied to Clipboard! ✓' : 'Copy Pitch for WhatsApp'}</span>
            </button>
          </div>
        </div>

        {/* Right: Undervalued Arbitrage Scanner */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2 text-white font-bold text-base">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>AI Undervalued Scanner</span>
            </div>
            <span className="text-xs text-emerald-400 font-bold">{undervaluedList.length} Opportunities</span>
          </div>

          <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
            {undervaluedList.map((p) => {
              const delta = p.aiValuation - p.askingPrice;
              const isCurrent = p.id === selectedProperty.id;

              return (
                <div
                  key={p.id}
                  onClick={() => setSelectedProperty(p)}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                    isCurrent
                      ? 'bg-emerald-950/40 border-emerald-500/50 shadow-md'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="font-bold text-white text-xs">
                        Blk {p.block} {p.streetName}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {p.town} • {p.flatType} • {p.remainingLease} yrs
                      </div>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      Score: {p.aiMarketScore}
                    </span>
                  </div>

                  <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-800/80 text-xs">
                    <div>
                      <span className="text-slate-400 text-[10px]">Asking: </span>
                      <span className="font-mono font-bold text-white">S${p.askingPrice.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-emerald-400 font-bold font-mono">
                        {delta >= 0 ? `+S$${delta.toLocaleString()} Below Val` : 'Fair Market'}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
