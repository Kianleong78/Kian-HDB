import React, { useState } from 'react';
import {
  MessageSquare,
  MessageCircle,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Building,
  Filter,
  CheckCircle2,
  Users,
} from 'lucide-react';
import { HDBProperty, NavigationTab } from '../types';
import {
  DISQUS_SHORTNAME,
  SafeDisqusBoundary,
  SafeCommentCount,
  getPropertyArticleData,
  DisqusUniversalThread,
} from './DisqusComments';

interface DisqusCommunityHubProps {
  properties: HDBProperty[];
  selectedProperty: HDBProperty;
  setSelectedProperty: (prop: HDBProperty) => void;
  setActiveTab: (tab: NavigationTab) => void;
}

export const DisqusCommunityHub: React.FC<DisqusCommunityHubProps> = ({
  properties,
  selectedProperty,
  setSelectedProperty,
  setActiveTab,
}) => {
  const [selectedTown, setSelectedTown] = useState<string>('All');
  const [activeDiscussProp, setActiveDiscussProp] = useState<HDBProperty>(selectedProperty);

  const towns = ['All', ...Array.from(new Set(properties.map((p) => p.town))).sort()];

  const filteredProperties = properties.filter((p) => {
    if (selectedTown !== 'All' && p.town !== selectedTown) return false;
    return true;
  });

  const activeArticle = getPropertyArticleData(activeDiscussProp);

  const handleSelectProperty = (prop: HDBProperty) => {
    setActiveDiscussProp(prop);
    setSelectedProperty(prop);
  };

  const handleGoToAnalysis = (prop: HDBProperty) => {
    setSelectedProperty(prop);
    setActiveTab('analysis');
  };

  return (
    <section className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
      {/* Section Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
              <MessageCircle className="w-3.5 h-3.5" />
              Live Resident Discussions & Comments
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-slate-800 text-slate-300 border border-slate-700">
              Disqus Shortname: {DISQUS_SHORTNAME}
            </span>
            <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Verified SSO
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-white mt-2 flex items-center gap-2">
            <span>HDB Resident & Buyer Community Forum</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-3xl leading-relaxed">
            Real estate buyer discussions, lift upgrading status, noise levels, morning sun orientation, and neighbor feedback for every block in Singapore.
          </p>
        </div>

        {/* Town Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
          <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          {towns.slice(0, 5).map((town) => (
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
      </div>

      {/* Main Grid: Property List with CommentCount on left, Live Discussion Embed on right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Properties with Live CommentCount */}
        <div className="lg:col-span-5 space-y-2.5 max-h-[520px] overflow-y-auto pr-1">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-between">
            <span>Select Block to View Discussion</span>
            <span className="text-emerald-400 font-mono">{filteredProperties.length} Units</span>
          </div>

          {filteredProperties.map((prop) => {
            const isSelected = activeDiscussProp.id === prop.id;
            const article = getPropertyArticleData(prop);

            return (
              <div
                key={prop.id}
                onClick={() => handleSelectProperty(prop)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                  isSelected
                    ? 'bg-emerald-950/40 border-emerald-500/50 shadow-md ring-1 ring-emerald-500/30'
                    : 'bg-slate-950/60 hover:bg-slate-800/80 border-slate-800/80'
                }`}
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-white truncate">
                      Blk {prop.block} {prop.streetName}
                    </span>
                    <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-slate-800 text-slate-300">
                      {prop.town}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    {prop.flatType} • S${prop.askingPrice.toLocaleString()} • {prop.floorLevel}
                  </div>
                </div>

                {/* Disqus CommentCount badge */}
                <div className="shrink-0 flex flex-col items-end gap-1">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-800/90 border border-slate-700 text-emerald-300 text-xs font-mono font-bold">
                    <MessageSquare className="w-3 h-3 text-emerald-400" />
                    <SafeDisqusBoundary fallback={<span className="text-slate-400">Comments</span>}>
                      <SafeCommentCount
                        shortname={DISQUS_SHORTNAME}
                        config={{
                          url: article.url,
                          identifier: article.id,
                          title: article.title,
                        }}
                      >
                        {/* Placeholder Text */}
                        Comments
                      </SafeCommentCount>
                    </SafeDisqusBoundary>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleGoToAnalysis(prop);
                    }}
                    className="text-[10px] text-emerald-400 hover:underline flex items-center gap-0.5"
                  >
                    <span>Valuation</span>
                    <ArrowRight className="w-2.5 h-2.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Active Property Discussion Embed Thread */}
        <div className="lg:col-span-7 bg-slate-950 p-5 sm:p-6 rounded-2xl border border-slate-800 flex flex-col justify-between space-y-4">
          <div className="border-b border-slate-800 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase">
                  Active Thread
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  ID: {activeArticle.id}
                </span>
              </div>
              <h3 className="text-base font-bold text-white mt-1">
                Blk {activeDiscussProp.block} {activeDiscussProp.streetName}, {activeDiscussProp.town}
              </h3>
            </div>

            <button
              onClick={() => handleGoToAnalysis(activeDiscussProp)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition shadow-sm shrink-0"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Full Property Analysis</span>
            </button>
          </div>

          {/* Disqus Universal Thread Embed */}
          <div className="min-h-[360px]">
            <SafeDisqusBoundary
              fallback={
                <div className="text-center py-16 text-slate-400 text-sm">
                  Disqus discussion thread ready for Blk {activeDiscussProp.block} {activeDiscussProp.streetName}.
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
    </section>
  );
};
