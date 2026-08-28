import React from 'react';
import { CheckCircle2, Sparkles, Zap, ShieldCheck, ArrowRight, Building2 } from 'lucide-react';
import { NavigationTab } from '../types';

interface PricingViewProps {
  setActiveTab: (tab: NavigationTab) => void;
}

export const PricingView: React.FC<PricingViewProps> = ({ setActiveTab }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Transparent Singapore PropTech Pricing</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          Unbiased Property Intelligence for Every Singaporean
        </h1>
        <p className="text-sm text-slate-400 leading-relaxed">
          From first-time BTO upgraders to veteran property consultants, access institutional-grade HDB algorithmic decision tools.
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
        {/* Tier 1: Free Citizen */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-xl">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Citizen Tier</div>
            <h3 className="text-xl font-bold text-white mt-1">Community Free</h3>
            <p className="text-xs text-slate-400 mt-2">For curious homeowners and general market tracking.</p>

            <div className="mt-6 flex items-baseline gap-1">
              <span className="text-4xl font-black text-white font-mono">S$0</span>
              <span className="text-xs text-slate-400 font-medium">/ forever</span>
            </div>

            <ul className="mt-6 space-y-3 text-xs text-slate-300">
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Search all 26 Singapore HDB Towns</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Basic Fair Price Range estimates</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Town Median Price & 10-Yr RPI trends</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>3 Free AI Property Reports per month</span>
              </li>
            </ul>
          </div>

          <button
            onClick={() => setActiveTab('search')}
            className="mt-8 w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-colors"
          >
            Start Free Now
          </button>
        </div>

        {/* Tier 2: Buyer & Seller Pro (Highlighted) */}
        <div className="bg-gradient-to-b from-slate-900 via-slate-900 to-emerald-950/40 border-2 border-emerald-500 rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-2xl relative">
          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-emerald-400 to-teal-300 text-slate-950 text-[10px] font-black uppercase tracking-wider px-3.5 py-1 rounded-full shadow-lg">
            Most Popular for Movers
          </div>

          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-emerald-400">Homeowner & Buyer</div>
            <h3 className="text-xl font-bold text-white mt-1">Buyer / Seller Pro</h3>
            <p className="text-xs text-slate-300 mt-2">Everything you need to negotiate, calculate grants, and avoid COV.</p>

            <div className="mt-6 flex items-baseline gap-1">
              <span className="text-4xl font-black text-white font-mono">S$19</span>
              <span className="text-xs text-slate-400 font-medium">/ month (cancel anytime)</span>
            </div>

            <ul className="mt-6 space-y-3 text-xs text-slate-200">
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span><strong>Unlimited</strong> Instant Final AI Property Reports</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Interactive 14-Category Amenity Map with walking times</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Bala's Curve Lease Decay Calculator & CPF grant engine</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>What-If Price Simulator & Net Cash Proceeds Waterfall</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Direct Buyer / Seller Negotiation Brackets</span>
              </li>
            </ul>
          </div>

          <button
            onClick={() => setActiveTab('final-report')}
            className="mt-8 w-full py-3 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-300 hover:from-emerald-300 hover:to-teal-200 text-slate-950 font-black text-xs transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Try Pro Experience</span>
          </button>
        </div>

        {/* Tier 3: Agent Enterprise */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-xl">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-purple-400">Realtors & Agencies</div>
            <h3 className="text-xl font-bold text-white mt-1">Agent Pro Enterprise</h3>
            <p className="text-xs text-slate-400 mt-2">Close listings faster with automated CMA decks and client pitches.</p>

            <div className="mt-6 flex items-baseline gap-1">
              <span className="text-4xl font-black text-white font-mono">S$79</span>
              <span className="text-xs text-slate-400 font-medium">/ month</span>
            </div>

            <ul className="mt-6 space-y-3 text-xs text-slate-300">
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
                <span>Instant 1-Click WhatsApp Pitch Generator</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
                <span>AI Undervalued Resale Arbitrage Scanner</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
                <span>Co-branded PDF CMA Export with CEA license tag</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
                <span>Priority Gemini Flash reasoning compute</span>
              </li>
            </ul>
          </div>

          <button
            onClick={() => setActiveTab('agent-pro')}
            className="mt-8 w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition-colors"
          >
            Access Agent Pro
          </button>
        </div>
      </div>
    </div>
  );
};
