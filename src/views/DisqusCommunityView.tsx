import React, { useState } from 'react';
import {
  MessageSquare,
  MessageCircle,
  Sparkles,
  Building,
  Filter,
  CheckCircle2,
  Users,
  Search,
  Share2,
  TrendingUp,
  MapPin,
  ExternalLink,
  ShieldCheck,
  Info,
} from 'lucide-react';
import { HDBProperty, NavigationTab } from '../types';
import {
  DISQUS_SHORTNAME,
  SafeDisqusBoundary,
  DisqusUniversalThread,
  ArticleCommentCount,
  getPropertyArticleData,
} from '../components/DisqusComments';

interface DisqusCommunityViewProps {
  properties: HDBProperty[];
  selectedProperty: HDBProperty;
  setSelectedProperty: (prop: HDBProperty) => void;
  setActiveTab: (tab: NavigationTab) => void;
}

export const DisqusCommunityView: React.FC<DisqusCommunityViewProps> = ({
  properties,
  selectedProperty,
  setSelectedProperty,
  setActiveTab,
}) => {
  const [selectedTown, setSelectedTown] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeProperty, setActiveProperty] = useState<HDBProperty>(selectedProperty);

  const towns = ['All', ...Array.from(new Set(properties.map((p) => p.town))).sort()];

  const filteredProperties = properties.filter((p) => {
    if (selectedTown !== 'All' && p.town !== selectedTown) return false;
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const match =
        p.block.toLowerCase().includes(q) ||
        p.streetName.toLowerCase().includes(q) ||
        p.town.toLowerCase().includes(q) ||
        p.flatType.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  const activeArticle = getPropertyArticleData(activeProperty);

  const handleSelect = (prop: HDBProperty) => {
    setActiveProperty(prop);
    setSelectedProperty(prop);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      {/* View Title & Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/40 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
              <MessageCircle className="w-4 h-4" />
              Community & Resident Discussions
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-mono bg-slate-800 text-slate-300 border border-slate-700">
              Disqus Shortname: <strong className="text-emerald-400 font-bold">{DISQUS_SHORTNAME}</strong>
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs text-emerald-400 font-semibold bg-emerald-950/40 border border-emerald-800/60">
              <ShieldCheck className="w-3.5 h-3.5" /> Verified Citizen Feedback
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            HDB Resident & Buyer Community Forum
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-3xl leading-relaxed">
            Real estate buyer discussions, lift upgrading status, estate cleanliness, noise levels, and neighbor insights for every HDB block in Singapore powered by the official Disqus universal embed.
          </p>

          {/* Quick Stat Highlights */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="bg-slate-950/60 border border-slate-800/80 p-3.5 rounded-2xl">
              <div className="text-[11px] text-slate-400 uppercase font-semibold">Active Threads</div>
              <div className="text-xl font-black text-white mt-0.5">{properties.length} Estates</div>
            </div>
            <div className="bg-slate-950/60 border border-slate-800/80 p-3.5 rounded-2xl">
              <div className="text-[11px] text-slate-400 uppercase font-semibold">Active Unit</div>
              <div className="text-base font-black text-emerald-400 truncate mt-0.5">
                Blk {activeProperty.block} {activeProperty.streetName}
              </div>
            </div>
            <div className="bg-slate-950/60 border border-slate-800/80 p-3.5 rounded-2xl">
              <div className="text-[11px] text-slate-400 uppercase font-semibold">Discussion Target</div>
              <div className="text-sm font-bold text-white truncate mt-0.5">{activeProperty.town} Town</div>
            </div>
            <div className="bg-slate-950/60 border border-slate-800/80 p-3.5 rounded-2xl">
              <div className="text-[11px] text-slate-400 uppercase font-semibold">Disqus Shortname</div>
              <div className="text-sm font-mono font-bold text-emerald-400 mt-0.5">{DISQUS_SHORTNAME}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Forum Content: Left list of flats with live comment counts, Right active Disqus universal thread */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Side: Flat / Block Selector with Search & Filter */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-black uppercase tracking-wider text-slate-200 flex items-center gap-2">
                <Building className="w-4 h-4 text-emerald-400" />
                <span>Select Estate Block</span>
              </h2>
              <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-slate-800 text-emerald-400 border border-slate-700">
                {filteredProperties.length} Units
              </span>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by block, street, or town..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
              />
            </div>

            {/* Town Filters */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              {towns.map((town) => (
                <button
                  key={town}
                  onClick={() => setSelectedTown(town)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition shrink-0 ${
                    selectedTown === town
                      ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
                  }`}
                >
                  {town}
                </button>
              ))}
            </div>

            {/* Property List with Live Disqus ArticleCommentCount */}
            <div className="space-y-2 max-h-[620px] overflow-y-auto pr-1">
              {filteredProperties.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs">
                  No properties matched your search query.
                </div>
              ) : (
                filteredProperties.map((prop) => {
                  const isSelected = activeProperty.id === prop.id;
                  const article = getPropertyArticleData(prop);

                  return (
                    <div
                      key={prop.id}
                      onClick={() => handleSelect(prop)}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                        isSelected
                          ? 'bg-emerald-950/40 border-emerald-500 shadow-lg ring-1 ring-emerald-500/30'
                          : 'bg-slate-950/70 hover:bg-slate-800/80 border-slate-800/80'
                      }`}
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-white truncate">
                            Blk {prop.block} {prop.streetName}
                          </span>
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-300 border border-slate-700">
                            {prop.town}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-2">
                          <span>{prop.flatType}</span>
                          <span>•</span>
                          <span className="text-emerald-400 font-medium">S${prop.askingPrice.toLocaleString()}</span>
                          <span>•</span>
                          <span>{prop.floorLevel}</span>
                        </div>
                      </div>

                      {/* Disqus Live Article Comment Count */}
                      <div className="shrink-0 flex flex-col items-end gap-1">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-800 border border-slate-700 text-emerald-300 text-xs font-mono font-bold">
                          <MessageSquare className="w-3 h-3 text-emerald-400" />
                          <ArticleCommentCount
                            shortname={DISQUS_SHORTNAME}
                            article={{
                              url: article.url,
                              id: article.id,
                              title: article.title,
                            }}
                          />
                        </div>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedProperty(prop);
                            setActiveTab('analysis');
                          }}
                          className="text-[10px] text-emerald-400 hover:underline flex items-center gap-0.5"
                        >
                          <span>Valuation Dossier</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Right Side: Active Discussion Embed (<div id="disqus_thread"></div>) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
            {/* Header info for currently active thread */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase">
                    Active Discussion
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    Thread ID: {activeArticle.id}
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-white mt-1.5">
                  Blk {activeProperty.block} {activeProperty.streetName}
                </h2>
                <div className="text-xs text-slate-400 mt-0.5 flex flex-wrap items-center gap-2">
                  <span>{activeProperty.town} Town</span>
                  <span>•</span>
                  <span>{activeProperty.flatType} ({activeProperty.sqm} sqm)</span>
                  <span>•</span>
                  <span>Asking: S${activeProperty.askingPrice.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => {
                    setSelectedProperty(activeProperty);
                    setActiveTab('analysis');
                  }}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black transition shadow-lg shadow-emerald-500/20"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Inspect Valuation</span>
                </button>
              </div>
            </div>

            {/* Community Posting Rules Notice */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 text-xs text-slate-300 leading-relaxed flex items-start gap-3">
              <Info className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white font-bold">Community Guideline:</strong> Share genuine feedback regarding estate cleanliness, renovation nuances, lift upgrading status, morning sun orientation, or corridor privacy. All comments are moderated and verified through Disqus SSO.
              </div>
            </div>

            {/* Official Disqus Universal Thread Box */}
            <div className="bg-slate-950 p-4 sm:p-6 rounded-2xl border border-slate-800 min-h-[480px]">
              <SafeDisqusBoundary
                fallback={
                  <div className="text-center py-20 text-slate-400 text-sm">
                    Disqus discussion thread ready for Blk {activeProperty.block} {activeProperty.streetName}.
                  </div>
                }
              >
                <DisqusUniversalThread
                  url={activeArticle.url}
                  identifier={activeArticle.id}
                  title={activeArticle.title}
                  shortname={DISQUS_SHORTNAME}
                />
              </SafeDisqusBoundary>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
