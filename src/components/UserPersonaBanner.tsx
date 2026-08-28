import React from 'react';
import {
  UserCheck,
  Home,
  DollarSign,
  Briefcase,
  TrendingUp,
  ArrowRight,
  Sparkles,
  Calculator,
  LineChart,
  GitCompare,
  FileCheck2,
  BookOpen,
} from 'lucide-react';
import { NavigationTab, UserPersona } from '../types';

interface UserPersonaBannerProps {
  selectedPersona: UserPersona | null;
  onSelectPersona: (persona: UserPersona) => void;
  onNavigate: (tab: NavigationTab) => void;
}

export const UserPersonaBanner: React.FC<UserPersonaBannerProps> = ({
  selectedPersona,
  onSelectPersona,
  onNavigate,
}) => {
  const personas: {
    id: UserPersona;
    title: string;
    badge: string;
    icon: React.ElementType;
    description: string;
    recommendedTabs: { tab: NavigationTab; label: string; icon: React.ElementType }[];
  }[] = [
    {
      id: 'first-timer',
      title: 'First-Time Buyer',
      badge: 'BTO / Resale Starter',
      icon: Home,
      description: 'Find affordable flats, check CPF housing grants, assess MOP safety, and ensure zero COV.',
      recommendedTabs: [
        { tab: 'search', label: 'Search 26 Towns', icon: Home },
        { tab: 'buyer-tools', label: 'Grant & Affordability', icon: Calculator },
        { tab: 'methodology', label: 'Valuation Guide', icon: BookOpen },
      ],
    },
    {
      id: 'seller',
      title: 'HDB Seller / Upgrader',
      badge: 'Maximize Net Cash',
      icon: DollarSign,
      description: 'Calculate cash proceeds, optimize asking price, plan ABSD timelines, and explore next property.',
      recommendedTabs: [
        { tab: 'seller-tools', label: 'Seller Cash Proceeds', icon: DollarSign },
        { tab: 'analysis', label: 'Unit Valuation Report', icon: LineChart },
        { tab: 'trends', label: 'Market Trends', icon: TrendingUp },
      ],
    },
    {
      id: 'agent',
      title: 'Property Agent Pro',
      badge: 'Client Presentation',
      icon: Briefcase,
      description: 'Generate institutional CMA reports, 14-amenity radar pitch decks, and Bala lease charts.',
      recommendedTabs: [
        { tab: 'agent-pro', label: 'Agent Pro Suite', icon: Briefcase },
        { tab: 'final-report', label: 'AI Pitch Report', icon: FileCheck2 },
        { tab: 'compare', label: 'Multi-Unit Compare', icon: GitCompare },
      ],
    },
    {
      id: 'investor',
      title: 'Savvy Investor',
      badge: 'High Yield & Growth',
      icon: TrendingUp,
      description: 'Identify undervalued estates, track rental yields (5%+), and target future MRT interchange nodes.',
      recommendedTabs: [
        { tab: 'trends', label: '26 Towns Heatmap', icon: TrendingUp },
        { tab: 'compare', label: 'Compare PSF Growth', icon: GitCompare },
        { tab: 'methodology', label: 'Algorithm Audit', icon: BookOpen },
      ],
    },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <UserCheck className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Personalize Your Experience
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Select your objective to reveal curated tools and simplify the interface.
            </p>
          </div>
        </div>

        {selectedPersona && (
          <button
            onClick={() => onSelectPersona(selectedPersona === 'first-timer' ? 'seller' : 'first-timer')}
            className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
          >
            Change Persona
          </button>
        )}
      </div>

      {/* 4 Persona Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {personas.map((p) => {
          const Icon = p.icon;
          const isSelected = selectedPersona === p.id;

          return (
            <div
              key={p.id}
              onClick={() => onSelectPersona(p.id)}
              className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between space-y-3 ${
                isSelected
                  ? 'bg-emerald-500/10 border-emerald-500 dark:border-emerald-400 shadow-md ring-2 ring-emerald-500/20'
                  : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/60 hover:border-emerald-300 dark:hover:border-emerald-600'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                      isSelected
                        ? 'bg-emerald-500 text-slate-950 font-bold'
                        : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300">
                    {p.badge}
                  </span>
                </div>

                <div>
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white">{p.title}</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug mt-1">
                    {p.description}
                  </p>
                </div>
              </div>

              {/* Recommended Quick Actions for this Persona */}
              <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/50 space-y-1">
                <span className="text-[9px] font-extrabold uppercase tracking-wider text-slate-400">
                  Recommended Steps:
                </span>
                <div className="flex flex-wrap gap-1">
                  {p.recommendedTabs.map((rec) => {
                    const RecIcon = rec.icon;
                    return (
                      <button
                        key={rec.tab}
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectPersona(p.id);
                          onNavigate(rec.tab);
                        }}
                        className="flex items-center gap-1 px-2 py-1 rounded-lg bg-white dark:bg-slate-900 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-[10px] font-bold text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition"
                      >
                        <RecIcon className="w-3 h-3 text-emerald-500" />
                        <span>{rec.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
