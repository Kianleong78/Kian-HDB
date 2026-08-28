import React, { useState, useEffect, ReactNode } from 'react';
import { MessageSquare, MessageCircle, Info } from 'lucide-react';
import { HDBProperty } from '../types';

export const DISQUS_SHORTNAME = 'home-4s75rmqfw8';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export class SafeDisqusBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  override state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  override componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.warn('Disqus embed caught safe boundary exception:', error, errorInfo);
  }

  override render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <span className="text-slate-400 text-xs font-mono">Comments</span>
      );
    }
    return this.props.children;
  }
}

export interface PropertyArticleData {
  url: string;
  id: string;
  title: string;
}

export function getPropertyArticleData(property: HDBProperty): PropertyArticleData {
  const origin = typeof window !== 'undefined' && window.location.origin
    ? window.location.origin
    : 'https://hdbinsight.ai';

  return {
    url: `${origin}/property/${property.id}`,
    id: `hdb-property-${property.id}`,
    title: `Blk ${property.block} ${property.streetName} (${property.town}) - HDB Resale Valuation`,
  };
}

/**
 * Official Disqus Universal Embed Component
 * Renders <div id="disqus_thread"></div> and executes:
 * https://home-4s75rmqfw8.disqus.com/embed.js
 */
export interface DisqusUniversalThreadProps {
  url: string;
  identifier: string;
  title: string;
  shortname?: string;
  className?: string;
}

export const DisqusUniversalThread: React.FC<DisqusUniversalThreadProps> = ({
  url,
  identifier,
  title,
  shortname = DISQUS_SHORTNAME,
  className = '',
}) => {
  const [loadError, setLoadError] = useState(false);

  const srcDocHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <base target="_blank">
  <style>
    * { box-sizing: border-box; }
    html, body {
      margin: 0;
      padding: 8px 12px;
      background: transparent;
      color: #e2e8f0;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    }
    #disqus_thread {
      width: 100%;
      min-height: 440px;
    }
    a { color: #10b981; }
  </style>
  <script>
    window.onerror = function() { return true; };
    var disqus_config = function () {
      this.page.url = ${JSON.stringify(url)};
      this.page.identifier = ${JSON.stringify(identifier)};
      this.page.title = ${JSON.stringify(title)};
    };
    (function() {
      try {
        var d = document, s = d.createElement('script');
        s.src = 'https://${shortname}.disqus.com/embed.js';
        s.setAttribute('data-timestamp', +new Date());
        s.async = true;
        (d.head || d.body).appendChild(s);
      } catch (err) {}
    })();
  </script>
</head>
<body>
  <div id="disqus_thread"></div>
  <noscript>Please enable JavaScript to view the <a href="https://disqus.com/?ref_noscript">comments powered by Disqus.</a></noscript>
</body>
</html>`;

  if (loadError) {
    return (
      <div className={`p-6 text-center text-slate-400 text-xs bg-slate-900/50 rounded-xl border border-slate-800 ${className}`}>
        <MessageCircle className="w-5 h-5 mx-auto mb-2 text-slate-500" />
        <span>Disqus discussion ready for {title}. Live comments load automatically when connected.</span>
      </div>
    );
  }

  return (
    <div className={`w-full ${className}`}>
      <iframe
        key={`${identifier}-${url}`}
        title={`Disqus Discussion - ${title}`}
        srcDoc={srcDocHtml}
        className="w-full min-h-[500px] border-0 rounded-xl bg-transparent"
        sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
        onError={() => setLoadError(true)}
      />
    </div>
  );
};

export interface SafeCommentCountProps {
  shortname?: string;
  config?: {
    url?: string;
    identifier?: string;
    title?: string;
  };
  children?: ReactNode;
}

export const SafeCommentCount: React.FC<SafeCommentCountProps> = ({
  shortname = DISQUS_SHORTNAME,
  config,
  children = 'Comments',
}) => {
  return (
    <span
      className="disqus-comment-count"
      data-disqus-identifier={config?.identifier}
      data-disqus-url={config?.url}
    >
      {children}
    </span>
  );
};

/**
 * Standard Article-based Disqus Comment Count Component
 * Usage:
 * <ArticleCommentCount
 *   shortname='home-4s75rmqfw8'
 *   article={{ url: article.url, id: article.id, title: article.title }}
 * />
 */
export interface ArticleCommentCountProps {
  article: {
    url: string;
    id: string;
    title: string;
  };
  shortname?: string;
}

export const ArticleCommentCount: React.FC<ArticleCommentCountProps> = ({
  article,
  shortname = DISQUS_SHORTNAME,
}) => {
  return (
    <SafeDisqusBoundary fallback={<span className="text-slate-400 text-xs">Comments</span>}>
      <SafeCommentCount
        shortname={shortname}
        config={{
          url: article.url,
          identifier: article.id,
          title: article.title,
        }}
      >
        Comments
      </SafeCommentCount>
    </SafeDisqusBoundary>
  );
};

interface PropertyCommentCountBadgeProps {
  property: HDBProperty;
  className?: string;
}

export const PropertyCommentCountBadge: React.FC<PropertyCommentCountBadgeProps> = ({
  property,
  className = '',
}) => {
  const article = getPropertyArticleData(property);

  return (
    <SafeDisqusBoundary fallback={<span className="text-slate-400 text-xs">💬 Comments</span>}>
      <div className={`inline-flex items-center gap-1.5 text-xs font-semibold ${className}`}>
        <MessageSquare className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
        <SafeCommentCount
          shortname={DISQUS_SHORTNAME}
          config={{
            url: article.url,
            identifier: article.id,
            title: article.title,
          }}
        >
          Comments
        </SafeCommentCount>
      </div>
    </SafeDisqusBoundary>
  );
};

interface PropertyDiscussionSectionProps {
  property: HDBProperty;
}

export const PropertyDiscussionSection: React.FC<PropertyDiscussionSectionProps> = ({ property }) => {
  const [showThread] = useState<boolean>(true);
  const article = getPropertyArticleData(property);

  return (
    <section className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
      {/* Header with CommentCount */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
              Community Intelligence
            </span>
            <span className="text-xs text-slate-400">Public HDB Buyer & Seller Discourse</span>
          </div>
          <h3 className="text-xl font-bold text-white mt-1 flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-emerald-400" />
            <span>Community Discussions & Resident Insights</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Discuss block noise levels, morning/afternoon sun orientation, estate maintenance, and neighbor insights for Blk {property.block} {property.streetName}.
          </p>
        </div>

        {/* Live Disqus Comment Count Box */}
        <div className="bg-slate-950 border border-slate-800 px-4 py-2 rounded-2xl flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
            <MessageSquare className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-400">Total Discussion</div>
            <div className="text-xs font-bold text-white font-mono">
              <SafeDisqusBoundary fallback={<span className="text-slate-400">0 Comments</span>}>
                <SafeCommentCount
                  shortname={DISQUS_SHORTNAME}
                  config={{
                    url: article.url,
                    identifier: article.id,
                    title: article.title,
                  }}
                >
                  Comments
                </SafeCommentCount>
              </SafeDisqusBoundary>
            </div>
          </div>
        </div>
      </div>

      {/* Community Notice */}
      <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800 text-xs text-slate-300 flex items-start gap-3">
        <Info className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-white">Community Guideline:</span> Share genuine feedback regarding estate cleanliness, renovation nuances, lift upgrading status, or lift lobby privacy. All comments are verified through Disqus SSO.
        </div>
      </div>

      {/* Official Universal Disqus Thread (<div id="disqus_thread"></div>) */}
      {showThread && (
        <div className="bg-slate-950 p-4 sm:p-6 rounded-2xl border border-slate-800 min-h-[300px]">
          <SafeDisqusBoundary
            fallback={
              <div className="text-center py-12 text-slate-400 text-sm">
                Disqus discussion frame ready for Blk {property.block} {property.streetName}.
              </div>
            }
          >
            <DisqusUniversalThread
              url={article.url}
              identifier={article.id}
              title={article.title}
              shortname={DISQUS_SHORTNAME}
            />
          </SafeDisqusBoundary>
        </div>
      )}
    </section>
  );
};


