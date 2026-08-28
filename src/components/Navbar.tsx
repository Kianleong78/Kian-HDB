import React, { useState } from 'react';
import {
  Building2,
  Search,
  LineChart,
  GitCompare,
  Calculator,
  BadgeDollarSign,
  Briefcase,
  Bot,
  CreditCard,
  FileCheck2,
  Menu,
  X,
  Sparkles,
  ChevronDown,
  Home,
  TrendingUp,
  MessageCircle,
} from 'lucide-react';
import { HDBProperty, NavigationTab } from '../types';

interface NavbarProps {
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  properties: HDBProperty[];
  selectedProperty: HDBProperty;
  setSelectedProperty: (prop: HDBProperty) => void;
  comparisonList: HDBProperty[];
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  properties,
  selectedProperty,
  setSelectedProperty,
  comparisonList,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isPropertyDropdownOpen, setIsPropertyDropdownOpen] = useState(false);

  const navItems: { id: NavigationTab; label: string; icon: React.ElementType; isHero?: boolean }[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'search', label: 'Property Search', icon: Search },
    { id: 'analysis', label: 'Property Analysis', icon: LineChart },
    { id: 'community-discussions', label: 'Disqus Forum', icon: MessageCircle },
    { id: 'trends', label: 'Market Trends', icon: TrendingUp },
    { id: 'compare', label: 'Compare Properties', icon: GitCompare },
    { id: 'buyer-tools', label: 'Buyer Tools', icon: Calculator },
    { id: 'seller-tools', label: 'Seller Tools', icon: BadgeDollarSign },
    { id: 'agent-pro', label: 'Agent Pro', icon: Briefcase },
    { id: 'ask-ai', label: 'Ask AI', icon: Bot },
    { id: 'pricing', label: 'Pricing', icon: CreditCard },
    { id: 'final-report', label: 'Final AI Report', icon: FileCheck2, isHero: true },
  ];

  return (
    <header className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-md border-b border-slate-800 text-slate-100">
      {/* Top Value Proposition & Property Quick Context Ribbon */}
      <div className="bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-950 border-b border-slate-800/80 px-4 py-1.5 text-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-slate-300">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-medium text-emerald-400">Singapore HDB Intelligence</span>
            <span className="hidden sm:inline text-slate-500">|</span>
            <span className="hidden md:inline text-slate-400 italic">“Turn HDB data into smarter property decisions in seconds.”</span>
          </div>

          {/* Active Analyzed Unit Quick Switcher */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <button
                id="property-switcher-btn"
                onClick={() => setIsPropertyDropdownOpen(!isPropertyDropdownOpen)}
                className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700/80 border border-slate-700 px-2.5 py-1 rounded-lg text-xs transition-colors"
              >
                <span className="text-slate-400">Active Unit:</span>
                <span className="font-bold text-emerald-400 truncate max-w-[140px] sm:max-w-[200px]">
                  Blk {selectedProperty.block} {selectedProperty.streetName}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {isPropertyDropdownOpen && (
                <div className="absolute right-0 mt-1.5 w-72 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-1.5 z-50 space-y-1">
                  <div className="text-[11px] font-semibold text-slate-400 px-2.5 py-1">Select Property to Inspect</div>
                  {properties.map((p) => (
                    <button
                      key={p.id}
                      id={`select-prop-${p.id}`}
                      onClick={() => {
                        setSelectedProperty(p);
                        setIsPropertyDropdownOpen(false);
                      }}
                      className={`w-full text-left px-2.5 py-2 rounded-lg text-xs transition-all flex items-center justify-between ${
                        p.id === selectedProperty.id ? 'bg-emerald-500/20 text-emerald-300 font-semibold' : 'hover:bg-slate-800 text-slate-200'
                      }`}
                    >
                      <div>
                        <div className="font-medium">Blk {p.block} {p.streetName}</div>
                        <div className="text-[10px] text-slate-400">{p.town} • {p.flatType} • S${p.askingPrice.toLocaleString()}</div>
                      </div>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-emerald-400 font-mono">
                        {p.verdict}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div
            id="brand-logo"
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-slate-950 shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <Building2 className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-black tracking-tight text-white">HDB Insight</span>
                <span className="text-xs px-1.5 py-0.5 rounded-md bg-emerald-500 text-slate-950 font-bold uppercase tracking-wider">AI</span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium tracking-wide">Singapore PropTech & FinTech</p>
            </div>
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden xl:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              if (item.isHero) {
                return (
                  <button
                    key={item.id}
                    id={`nav-tab-${item.id}`}
                    onClick={() => setActiveTab(item.id)}
                    className={`ml-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-lg ${
                      isActive
                        ? 'bg-gradient-to-r from-emerald-400 to-teal-300 text-slate-950 shadow-emerald-500/30 scale-105'
                        : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{item.label}</span>
                    <span className="text-[9px] uppercase px-1 py-0.2 rounded bg-slate-950/40 text-white font-mono">HERO</span>
                  </button>
                );
              }

              return (
                <button
                  key={item.id}
                  id={`nav-tab-${item.id}`}
                  onClick={() => setActiveTab(item.id)}
                  className={`px-2.5 py-2 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-slate-800 text-emerald-400 font-semibold border border-slate-700'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                  {item.id === 'compare' && comparisonList.length > 0 && (
                    <span className="w-4 h-4 rounded-full bg-emerald-500 text-slate-950 text-[10px] font-bold flex items-center justify-center">
                      {comparisonList.length}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Quick CTA button for desktop */}
          <div className="hidden lg:flex xl:hidden items-center gap-2">
            <button
              id="quick-hero-report-btn"
              onClick={() => setActiveTab('final-report')}
              className="px-3 py-1.5 rounded-lg bg-emerald-500 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Final AI Report</span>
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="xl:hidden flex items-center gap-2">
            <button
              id="mobile-menu-toggle"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="xl:hidden bg-slate-900 border-b border-slate-800 px-4 pt-2 pb-6 space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`mobile-nav-tab-${item.id}`}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center justify-between ${
                  isActive
                    ? 'bg-emerald-500 text-slate-950 font-bold'
                    : item.isHero
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>
                {item.isHero && (
                  <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-slate-950/60 text-emerald-400">
                    HERO OUTPUT
                  </span>
                )}
                {item.id === 'compare' && comparisonList.length > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-400 text-slate-950 text-xs font-bold">
                    {comparisonList.length}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
