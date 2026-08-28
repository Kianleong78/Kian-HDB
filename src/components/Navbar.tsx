import React, { useState, useRef, useEffect } from 'react';
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
  Sun,
  Moon,
  Zap,
  Sliders,
  BookOpen,
  MapPin,
  Check,
} from 'lucide-react';
import { HDBProperty, NavigationTab } from '../types';
import { useTheme } from '../context/ThemeContext';

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
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const { theme, toggleTheme, viewMode, toggleViewMode } = useTheme();

  // Close dropdowns on outside click
  const navRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
        setIsPropertyDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navGroups = [
    {
      id: 'explore-group',
      label: 'Explore & Search',
      icon: Search,
      isActive: activeTab === 'home' || activeTab === 'search' || activeTab === 'trends',
      items: [
        { id: 'home' as NavigationTab, label: 'Home Overview', desc: 'Summary dashboard & active unit', icon: Home },
        { id: 'search' as NavigationTab, label: 'Search 26 Towns', desc: 'Filter all flats, proximity & price', icon: Search },
        { id: 'trends' as NavigationTab, label: '26 Towns Market Trends', desc: 'Resale index, PSF growth & heatmaps', icon: TrendingUp },
      ],
    },
    {
      id: 'valuation-group',
      label: 'Valuation & Intelligence',
      icon: LineChart,
      isActive: activeTab === 'analysis' || activeTab === 'methodology' || activeTab === 'compare',
      items: [
        { id: 'analysis' as NavigationTab, label: 'Property Analysis', desc: '14-amenity radar & Bala lease decay', icon: LineChart },
        { id: 'methodology' as NavigationTab, label: 'Valuation Methodology', desc: 'How the AI fair price is computed', icon: BookOpen },
        {
          id: 'compare' as NavigationTab,
          label: 'Compare Properties',
          desc: 'Head-to-head metrics & specs',
          icon: GitCompare,
          badge: comparisonList.length > 0 ? `${comparisonList.length}` : undefined,
        },
      ],
    },
    {
      id: 'tools-group',
      label: 'Tools by Role',
      icon: Calculator,
      isActive:
        activeTab === 'buyer-tools' ||
        activeTab === 'seller-tools' ||
        activeTab === 'agent-pro' ||
        activeTab === 'community-discussions',
      items: [
        { id: 'buyer-tools' as NavigationTab, label: 'First-Time Buyer Suite', desc: 'CPF grants & mortgage calculator', icon: Calculator },
        { id: 'seller-tools' as NavigationTab, label: 'Seller Cash Proceeds', desc: 'HDB resale levy & net proceeds', icon: BadgeDollarSign },
        { id: 'agent-pro' as NavigationTab, label: 'Agent Pro Suite', desc: 'Client CMA & presentation deck', icon: Briefcase },
        { id: 'community-discussions' as NavigationTab, label: 'Disqus Community Forum', desc: 'Neighborhood discussions & reviews', icon: MessageCircle },
      ],
    },
  ];

  return (
    <header ref={navRef} className="sticky top-0 z-50 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 transition-colors">
      {/* Top Banner Ribbon */}
      <div className="bg-slate-50 dark:bg-slate-900/80 border-b border-slate-200/80 dark:border-slate-800/80 px-4 py-1 text-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-bold text-emerald-600 dark:text-emerald-400">Singapore HDB Valuation & Location Intelligence</span>
            <span className="hidden md:inline text-slate-400 dark:text-slate-500">• 26 Towns Coverage • Data.gov.sg Verified</span>
          </div>

          {/* Quick Context Switchers & Preferences */}
          <div className="flex items-center gap-2">
            {/* View Mode Toggle (Simple Mode vs Pro Mode) */}
            <button
              id="toggle-view-mode-btn"
              onClick={toggleViewMode}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'simple'
                  ? 'bg-emerald-500 text-slate-950 shadow-sm'
                  : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-300'
              }`}
              title={viewMode === 'simple' ? 'Switch to Pro Mode (Advanced analytics)' : 'Switch to Simple Mode (Clean & easy)'}
            >
              {viewMode === 'simple' ? <Zap className="w-3.5 h-3.5 fill-current" /> : <Sliders className="w-3.5 h-3.5" />}
              <span>{viewMode === 'simple' ? 'Simple' : 'Pro'}</span>
            </button>

            {/* Light / Dark Mode Toggle */}
            <button
              id="theme-toggle-btn"
              onClick={toggleTheme}
              className="p-1.5 rounded-lg bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {theme === 'dark' ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-slate-700" />}
            </button>

            {/* Active Property Quick Dropdown */}
            <div className="relative">
              <button
                id="property-switcher-btn"
                onClick={() => setIsPropertyDropdownOpen(!isPropertyDropdownOpen)}
                className="flex items-center gap-1.5 bg-slate-200/80 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 px-2.5 py-1 rounded-lg text-xs transition-colors"
              >
                <span className="text-slate-500 dark:text-slate-400 hidden sm:inline">Active Unit:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400 truncate max-w-[120px] sm:max-w-[160px]">
                  {selectedProperty.town} • Blk {selectedProperty.block}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
              </button>

              {isPropertyDropdownOpen && (
                <div className="absolute right-0 mt-1.5 w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl p-2 z-50 space-y-1 max-h-96 overflow-y-auto">
                  <div className="text-[11px] font-bold text-slate-400 px-2.5 py-1 uppercase tracking-wider">
                    Select Active Flat ({properties.length} available)
                  </div>
                  {properties.map((p) => (
                    <button
                      key={p.id}
                      id={`select-prop-${p.id}`}
                      onClick={() => {
                        setSelectedProperty(p);
                        setIsPropertyDropdownOpen(false);
                      }}
                      className={`w-full text-left px-2.5 py-2 rounded-xl text-xs transition-all flex items-center justify-between ${
                        p.id === selectedProperty.id
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold'
                          : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200'
                      }`}
                    >
                      <div>
                        <div className="font-bold truncate max-w-[180px]">Blk {p.block} {p.streetName}</div>
                        <div className="text-[10px] text-slate-400">{p.town} • {p.flatType}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-mono font-bold text-emerald-600 dark:text-emerald-400">S${(p.askingPrice / 1000).toFixed(0)}k</div>
                        <div className="text-[10px] text-slate-400 font-mono">Score {p.aiMarketScore}</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main App Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div
            id="brand-logo"
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-lg sm:text-xl tracking-tight text-slate-900 dark:text-white">
                  HDB<span className="text-emerald-500">Valuer</span>
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-extrabold bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-500/40">
                  AI PRO
                </span>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium -mt-0.5">
                Official Data.gov.sg & OneMap Intelligence
              </p>
            </div>
          </div>

          {/* Desktop Streamlined Navigation Hierarchy */}
          <nav className="hidden lg:flex items-center gap-2">
            {/* Direct Home Tab */}
            <button
              id="nav-home"
              onClick={() => {
                setActiveTab('home');
                setOpenDropdown(null);
              }}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition ${
                activeTab === 'home'
                  ? 'bg-slate-100 dark:bg-slate-800 text-emerald-600 dark:text-emerald-400'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-900'
              }`}
            >
              <Home className="w-4 h-4" />
              <span>Home</span>
            </button>

            {/* Direct Search Tab */}
            <button
              id="nav-search"
              onClick={() => {
                setActiveTab('search');
                setOpenDropdown(null);
              }}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition ${
                activeTab === 'search'
                  ? 'bg-slate-100 dark:bg-slate-800 text-emerald-600 dark:text-emerald-400'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-900'
              }`}
            >
              <Search className="w-4 h-4" />
              <span>Search Flats</span>
            </button>

            {/* Navigation Dropdown Groups */}
            {navGroups.map((group) => {
              const GroupIcon = group.icon;
              const isOpen = openDropdown === group.id;

              return (
                <div key={group.id} className="relative">
                  <button
                    onClick={() => setOpenDropdown(isOpen ? null : group.id)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition ${
                      group.isActive || isOpen
                        ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40'
                        : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-900'
                    }`}
                  >
                    <GroupIcon className="w-3.5 h-3.5" />
                    <span>{group.label}</span>
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown Menu */}
                  {isOpen && (
                    <div className="absolute left-0 mt-2 w-72 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl p-2 z-50 space-y-1">
                      {group.items.map((item) => {
                        const ItemIcon = item.icon;
                        const isCurrentActive = activeTab === item.id;

                        return (
                          <button
                            key={item.id}
                            id={`dropdown-nav-${item.id}`}
                            onClick={() => {
                              setActiveTab(item.id);
                              setOpenDropdown(null);
                            }}
                            className={`w-full text-left p-2.5 rounded-xl text-xs transition flex items-start gap-2.5 ${
                              isCurrentActive
                                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold'
                                : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200'
                            }`}
                          >
                            <div className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-emerald-500 mt-0.5">
                              <ItemIcon className="w-4 h-4" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <span className="font-bold">{item.label}</span>
                                {item.badge && (
                                  <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-500 text-slate-950 font-black">
                                    {item.badge}
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-normal leading-tight mt-0.5">
                                {item.desc}
                              </p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}

            {/* Ask AI Chatbot */}
            <button
              id="nav-ask-ai"
              onClick={() => {
                setActiveTab('ask-ai');
                setOpenDropdown(null);
              }}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition ${
                activeTab === 'ask-ai'
                  ? 'bg-slate-100 dark:bg-slate-800 text-emerald-600 dark:text-emerald-400'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-900'
              }`}
            >
              <Bot className="w-4 h-4" />
              <span>Ask AI</span>
            </button>

            {/* Pricing Tab */}
            <button
              id="nav-pricing"
              onClick={() => {
                setActiveTab('pricing');
                setOpenDropdown(null);
              }}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition ${
                activeTab === 'pricing'
                  ? 'bg-slate-100 dark:bg-slate-800 text-emerald-600 dark:text-emerald-400'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-900'
              }`}
            >
              <CreditCard className="w-4 h-4" />
              <span>Pricing</span>
            </button>

            {/* Final AI Report Hero CTA */}
            <button
              id="nav-final-report"
              onClick={() => {
                setActiveTab('final-report');
                setOpenDropdown(null);
              }}
              className={`ml-2 flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition shadow-sm ${
                activeTab === 'final-report'
                  ? 'bg-emerald-500 text-slate-950 shadow-emerald-500/20'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white'
              }`}
            >
              <FileCheck2 className="w-3.5 h-3.5" />
              <span>AI Report</span>
            </button>
          </nav>

          {/* Mobile Actions */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              id="mobile-quick-report"
              onClick={() => setActiveTab('final-report')}
              className="flex items-center gap-1 px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl text-xs font-bold shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Report</span>
            </button>

            <button
              id="mobile-menu-toggle"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 px-4 pt-2 pb-6 space-y-3 max-h-[85vh] overflow-y-auto">
          {/* Quick Preferences Bar in Mobile Menu */}
          <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
            <button
              onClick={toggleViewMode}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                viewMode === 'simple' ? 'bg-emerald-500 text-slate-950' : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>{viewMode === 'simple' ? 'Simple Mode' : 'Pro Mode'}</span>
            </button>

            <button
              onClick={toggleTheme}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300"
            >
              {theme === 'dark' ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5" />}
              <span>{theme === 'dark' ? 'Light Theme' : 'Dark Theme'}</span>
            </button>
          </div>

          {/* Grouped Mobile Links */}
          <div className="space-y-4">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 px-1">
                Explore & Valuation
              </span>
              <div className="grid grid-cols-2 gap-1.5 mt-1">
                {[
                  { id: 'home' as NavigationTab, label: 'Home', icon: Home },
                  { id: 'search' as NavigationTab, label: 'Search 26 Towns', icon: Search },
                  { id: 'analysis' as NavigationTab, label: 'Analysis', icon: LineChart },
                  { id: 'methodology' as NavigationTab, label: 'Methodology', icon: BookOpen },
                  { id: 'trends' as NavigationTab, label: 'Market Trends', icon: TrendingUp },
                  { id: 'compare' as NavigationTab, label: 'Compare Units', icon: GitCompare },
                ].map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-bold text-left transition ${
                        isActive
                          ? 'bg-emerald-500 text-slate-950'
                          : 'bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      <span className="truncate">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 px-1">
                Tools & AI Assistant
              </span>
              <div className="grid grid-cols-2 gap-1.5 mt-1">
                {[
                  { id: 'buyer-tools' as NavigationTab, label: 'Buyer Tools', icon: Calculator },
                  { id: 'seller-tools' as NavigationTab, label: 'Seller Tools', icon: BadgeDollarSign },
                  { id: 'agent-pro' as NavigationTab, label: 'Agent Pro', icon: Briefcase },
                  { id: 'community-discussions' as NavigationTab, label: 'Disqus Forum', icon: MessageCircle },
                  { id: 'ask-ai' as NavigationTab, label: 'Ask AI', icon: Bot },
                  { id: 'pricing' as NavigationTab, label: 'Pricing Plans', icon: CreditCard },
                ].map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-bold text-left transition ${
                        isActive
                          ? 'bg-emerald-500 text-slate-950'
                          : 'bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      <span className="truncate">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
