import React from 'react';
import { Building2, ShieldCheck, Sparkles } from 'lucide-react';
import { NavigationTab } from '../types';

interface FooterProps {
  setActiveTab: (tab: NavigationTab) => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab }) => {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 text-xs mt-20 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-10 border-b border-slate-800/80">
          {/* Brand Col */}
          <div className="md:col-span-4 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-slate-950 font-bold">
                <Building2 className="w-4 h-4" />
              </div>
              <span className="text-base font-extrabold text-white">HDB Insight AI</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              Singapore’s premier algorithmic HDB resale valuation and decision intelligence platform. Turning official open data into objective property clarity in seconds.
            </p>
            <div className="flex items-center gap-2 text-emerald-400 text-[11px] font-medium">
              <ShieldCheck className="w-4 h-4" />
              <span>Grounded in official HDB, SLA, and MOE Open Data</span>
            </div>
          </div>

          {/* Quick Links for Consumers */}
          <div className="md:col-span-3 space-y-2.5">
            <h5 className="text-xs font-bold text-white uppercase tracking-wider">Property Intelligence</h5>
            <ul className="space-y-1.5 text-slate-400">
              <li>
                <button id="footer-link-search" onClick={() => setActiveTab('search')} className="hover:text-emerald-400 transition-colors">
                  Property Search & Valuator
                </button>
              </li>
              <li>
                <button id="footer-link-analysis" onClick={() => setActiveTab('analysis')} className="hover:text-emerald-400 transition-colors">
                  Fair Price & Valuation Engine
                </button>
              </li>
              <li>
                <button id="footer-link-disqus-forum" onClick={() => setActiveTab('community-discussions')} className="hover:text-emerald-400 transition-colors">
                  Disqus Community Forum
                </button>
              </li>
              <li>
                <button id="footer-link-trends" onClick={() => setActiveTab('trends')} className="hover:text-emerald-400 transition-colors">
                  Singapore Town Market Trends
                </button>
              </li>
              <li>
                <button id="footer-link-compare" onClick={() => setActiveTab('compare')} className="hover:text-emerald-400 transition-colors">
                  Head-to-Head Comparison
                </button>
              </li>
              <li>
                <button id="footer-link-report" onClick={() => setActiveTab('final-report')} className="hover:text-emerald-400 transition-colors flex items-center gap-1 font-semibold text-emerald-400">
                  <Sparkles className="w-3 h-3" /> Final AI Property Report
                </button>
              </li>
            </ul>
          </div>

          {/* Calculators & Tools */}
          <div className="md:col-span-3 space-y-2.5">
            <h5 className="text-xs font-bold text-white uppercase tracking-wider">Calculators & Tools</h5>
            <ul className="space-y-1.5 text-slate-400">
              <li>
                <button id="footer-link-buyer" onClick={() => setActiveTab('buyer-tools')} className="hover:text-emerald-400 transition-colors">
                  HDB Affordability & CPF Grants
                </button>
              </li>
              <li>
                <button id="footer-link-seller" onClick={() => setActiveTab('seller-tools')} className="hover:text-emerald-400 transition-colors">
                  Net Resale Cash Proceeds
                </button>
              </li>
              <li>
                <button id="footer-link-agent" onClick={() => setActiveTab('agent-pro')} className="hover:text-emerald-400 transition-colors">
                  Agent Pro CMA & Pitch Decks
                </button>
              </li>
              <li>
                <button id="footer-link-ask-ai" onClick={() => setActiveTab('ask-ai')} className="hover:text-emerald-400 transition-colors">
                  Ask AI Property Assistant
                </button>
              </li>
              <li>
                <button id="footer-link-pricing" onClick={() => setActiveTab('pricing')} className="hover:text-emerald-400 transition-colors">
                  PropTech Plans & Pricing
                </button>
              </li>
            </ul>
          </div>

          {/* Legal / Data Disclaimer */}
          <div className="md:col-span-2 space-y-2.5">
            <h5 className="text-xs font-bold text-white uppercase tracking-wider">Disclaimer</h5>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              HDB Insight AI provides algorithmic estimates for reference and decision support only. Official HDB valuations and HFE letters determine final transaction eligibility.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
          <div>
            <span>© {new Date().getFullYear()} HDB Insight AI. Built for Singapore Real Estate Decision Makers.</span>
          </div>
          <div className="flex items-center gap-4">
            <span>Data Source: Data.gov.sg / HDB Resale Index</span>
            <span>MSR 30% / TDSR 55% Compliant</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
