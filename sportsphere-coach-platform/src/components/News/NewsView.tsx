import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Newspaper,
  Search,
  Bookmark,
  Share2,
  Clock,
  Flame,
  ChevronRight,
  X,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  TrendingUp,
  Tag,
  Eye,
  ThumbsUp,
  MessageSquare,
} from 'lucide-react';
import { NEWS_BULLETINS } from '../../data/mockData';
import { NewsBulletin, NewsScope, TabView } from '../../types/sports';

interface NewsViewProps {
  onShowToast: (title: string, message?: string, type?: 'success' | 'info' | 'warning') => void;
  onNavigate?: (tab: TabView, targetId?: string) => void;
}

export const NewsView: React.FC<NewsViewProps> = ({ onShowToast, onNavigate }) => {
  const [newsList, setNewsList] = useState<NewsBulletin[]>(NEWS_BULLETINS);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedScope, setSelectedScope] = useState<NewsScope | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeArticle, setActiveArticle] = useState<NewsBulletin | null>(null);
  const [savedOnly, setSavedOnly] = useState<boolean>(false);
  const [likedArticles, setLikedArticles] = useState<Record<string, boolean>>({})

  const categories = [
    { key: 'all', label: 'All News' },
    { key: 'Football', label: 'Football' },
    { key: 'Athletics', label: 'Athletics & Track' },
    { key: 'Cricket', label: 'Cricket Combine' },
    { key: 'Basketball', label: 'Basketball' },
    { key: 'Scouting', label: 'Scouting & Recruits' },
    { key: 'Regulations', label: 'Rules & Governance' },
    { key: 'Science', label: 'Sports Science & GPS' },
  ];

  const scopes: { key: NewsScope | 'all'; label: string; emoji: string; color: string }[] = [
    { key: 'all', label: 'All Levels', emoji: '🌐', color: 'bg-slate-600' },
    { key: 'local', label: 'Local', emoji: '📍', color: 'bg-emerald-600' },
    { key: 'district', label: 'District', emoji: '🏙️', color: 'bg-amber-600' },
    { key: 'national', label: 'National', emoji: '🇮🇳', color: 'bg-blue-600' },
    { key: 'international', label: 'International', emoji: '🌍', color: 'bg-purple-600' },
  ];

  const filteredNews = useMemo(() => {
    return newsList.filter((item) => {
      if (savedOnly && !item.isBookmarked) return false;
      if (selectedScope !== 'all') {
        if (!item.scope || item.scope !== selectedScope) return false;
      }
      if (selectedCategory !== 'all') {
        const cat = selectedCategory.toLowerCase();
        if (
          !item.category.toLowerCase().includes(cat) &&
          !item.tag.toLowerCase().includes(cat)
        ) {
          return false;
        }
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          item.title.toLowerCase().includes(q) ||
          item.summary.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q) ||
          item.tag.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [newsList, selectedCategory, selectedScope, searchQuery, savedOnly]);

  const toggleBookmark = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setNewsList((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isBookmarked: !item.isBookmarked } : item
      )
    );
    const item = newsList.find((n) => n.id === id);
    if (item?.isBookmarked) {
      onShowToast('Removed from Saved Articles', 'Article unbookmarked', 'info');
    } else {
      onShowToast('Article Saved', 'Added to your coach reading list', 'success');
    }
  };

  const handleShare = (title: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    navigator.clipboard?.writeText(window.location.href);
    onShowToast('Article Link Copied', `"${title}" link copied to clipboard`, 'success');
  };

  const toggleLike = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setLikedArticles((prev) => ({ ...prev, [id]: !prev[id] }));
    onShowToast('Article Liked', 'Added your coach endorsement', 'info');
  };

  const heroArticle = newsList[0];
  const trendingArticles = newsList.slice(1, 4);

  return (
    <div className="flex flex-col w-full pb-24 max-w-6xl mx-auto px-4 sm:px-6 space-y-6">
      {/* Header Banner */}
      <section className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/80 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
              <Newspaper className="w-4 h-4" />
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#131B2E] font-['Plus_Jakarta_Sans'] tracking-tight">
              SportSphere Intelligence & News
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Official federation bulletins, transfer windows, combine dates, and sports science analysis
          </p>
        </div>

        {/* Saved Articles Toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSavedOnly(!savedOnly)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              savedOnly
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${savedOnly ? 'fill-white' : ''}`} />
            <span>Saved Bulletins</span>
          </button>
        </div>
      </section>

      {/* Breaking News Live Ticker */}
      <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-300/60 flex items-center gap-3 text-xs">
        <span className="px-2 py-0.5 rounded-md bg-amber-600 text-white text-[10px] font-extrabold uppercase font-['Plus_Jakarta_Sans'] tracking-wider shrink-0 flex items-center gap-1">
          <Flame className="w-3 h-3 fill-white" />
          Live Wire
        </span>
        <div className="overflow-hidden whitespace-nowrap min-w-0">
          <p className="font-semibold text-amber-950 truncate">
            🔴 BCCI grassroots combine dates released across 12 zones · NCAA Division I recruiting window open for coaches · New biometric chip telemetry standards announced for U19 season.
          </p>
        </div>
      </div>

      {/* Search & Category Filter Strip */}
      <section className="space-y-3">
        <div className="flex flex-col sm:flex-row items-center gap-2.5">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search news, regulations, athlete names, federation updates..."
              className="w-full h-11 pl-9 pr-8 rounded-xl bg-white text-slate-900 text-xs sm:text-sm placeholder:text-slate-400 border border-slate-200/80 shadow-xs focus:outline-none focus:border-blue-600 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.key;
            return (
              <button
                key={cat.key}
                onClick={() => setSelectedCategory(cat.key)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-all cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Geographic Scope Filter */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider shrink-0">Scope:</span>
          <div className="flex gap-2 overflow-x-auto no-scrollbar py-0.5">
            {scopes.map((scope) => {
              const isActive = selectedScope === scope.key;
              const count = scope.key === 'all'
                ? newsList.length
                : newsList.filter((n) => n.scope === scope.key).length;
              return (
                <button
                  key={scope.key}
                  onClick={() => setSelectedScope(scope.key)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold shrink-0 flex items-center gap-1.5 transition-all cursor-pointer border ${
                    isActive
                      ? `${scope.color} text-white border-transparent shadow-sm`
                      : 'bg-white text-slate-600 border-slate-200/80 hover:bg-slate-50'
                  }`}
                >
                  <span>{scope.emoji}</span>
                  <span>{scope.label}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-extrabold ${
                    isActive ? 'bg-white/25 text-white' : 'bg-slate-100 text-slate-500'
                  }`}>{count}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Lead Story */}
      {!savedOnly && !searchQuery && selectedCategory === 'all' && heroArticle && (
        <section className="relative rounded-3xl overflow-hidden bg-slate-900 text-white shadow-lg border border-slate-800">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
            <div className="lg:col-span-7 relative h-64 lg:h-auto min-h-[280px]">
              <img
                src={heroArticle.image || 'https://lh3.googleusercontent.com/aida-public/AB6AXuADjkkyc8d7A33bLPtrhXHPgWXliY_vDkZZzEMSblj1mzvU82v-EOxeeOgi_ZXj8xVj1nZnBP4h3BXQbzEeupPEcT4FbKQLysm7AbqBaxPb7cJxPrnnsijSY5nBk3EAdF0brD_DcM1bxli1j2NHOxZKrg1AfucuSzTbF7A7ZpP8bHqyc-MwOfNjwG-bAsexCt1jylepwy4vtzX2PbUmbQ7kDRjCWPhS4WLACNntEgqC9665hfQSbKiHSg'}
                alt={heroArticle.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent lg:hidden" />
            </div>

            <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between bg-slate-950/90 backdrop-blur-md">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-full bg-blue-600 text-white text-[10px] font-extrabold uppercase tracking-wider font-['Plus_Jakarta_Sans']">
                    {heroArticle.tag}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">
                    {heroArticle.readTime} · {heroArticle.timestamp}
                  </span>
                </div>

                <h2 className="text-xl sm:text-2xl font-extrabold font-['Plus_Jakarta_Sans'] leading-tight text-white">
                  {heroArticle.title}
                </h2>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed line-clamp-3">
                  {heroArticle.summary}
                </p>
              </div>

              <div className="pt-6 flex items-center justify-between gap-3 border-t border-slate-800/80">
                <button
                  onClick={() => setActiveArticle(heroArticle)}
                  className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold font-['Plus_Jakarta_Sans'] flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
                >
                  <span>Read Full Bulletin</span>
                  <ChevronRight className="w-4 h-4" />
                </button>

                <div className="flex items-center gap-1">
                  <button
                    onClick={(e) => toggleBookmark(heroArticle.id, e)}
                    className="w-9 h-9 rounded-xl bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
                    title="Bookmark Article"
                  >
                    <Bookmark
                      className={`w-4 h-4 ${heroArticle.isBookmarked ? 'fill-blue-400 text-blue-400' : ''}`}
                    />
                  </button>
                  <button
                    onClick={(e) => handleShare(heroArticle.title, e)}
                    className="w-9 h-9 rounded-xl bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
                    title="Share Article"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Main Articles Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900 font-['Plus_Jakarta_Sans'] flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-blue-600" />
            <span>Latest News & Scouting Reports ({filteredNews.length})</span>
          </h3>
          <span className="text-xs text-slate-500 font-medium">Updated every 15 minutes</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredNews.map((article) => {
            const isLiked = likedArticles[article.id];

            return (
              <article
                key={article.id}
                onClick={() => setActiveArticle(article)}
                className="flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200/80 hover:shadow-md hover:border-blue-300 transition-all cursor-pointer group"
              >
                {/* Media Image */}
                <div className="relative h-44 bg-slate-900 overflow-hidden">
                  <img
                    src={
                      article.image ||
                      'https://lh3.googleusercontent.com/aida-public/AB6AXuDB75JciHHWikOZrNjhw0YAGatvturcJrZfq66hH5EVv-yyn8NIMrRseyTgeRSUkp1pWHc9Xf-ZqqGgsmK1_S2ZAFm1hFHTPNkNFq_x8FCMBh75A2pNyhdG-UP_bwR6Pvt0ihf35y_RfSOtMQp2P5BcHn_rnwPIRi3hlUjJKRFgz5GnJB4YGUF63Fbpmp-CC86s6cauFGe7xk81ojhff5BU362JL4LXjg87xLt8PaN-KP4_UHGd0J1LiA'
                    }
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />

                  <div className="absolute top-3 inset-x-3 flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-md bg-white/95 backdrop-blur-md text-slate-900 text-[10px] font-bold font-['Plus_Jakarta_Sans'] uppercase tracking-wider shadow-sm">
                      {article.tag}
                    </span>
                    <button
                      onClick={(e) => toggleBookmark(article.id, e)}
                      className="w-8 h-8 rounded-full bg-black/50 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/70 transition-colors"
                    >
                      <Bookmark
                        className={`w-4 h-4 ${article.isBookmarked ? 'fill-blue-400 text-blue-400' : ''}`}
                      />
                    </button>
                  </div>

                  <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-white text-[11px]">
                    <span className="font-semibold truncate opacity-90">{article.category}</span>
                    <span className="shrink-0 opacity-80">{article.timestamp}</span>
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-4 flex-1 flex flex-col justify-between gap-3">
                  <div className="space-y-1.5">
                    <h4 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors font-['Plus_Jakarta_Sans'] line-clamp-2 leading-snug">
                      {article.title}
                    </h4>
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {article.summary}
                    </p>
                  </div>

                  {/* Footer & Actions */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{article.readTime}</span>
                      </div>
                      {article.scope && (() => {
                        const scopeMeta: Record<string, { emoji: string; label: string; color: string }> = {
                          local: { emoji: '📍', label: 'Local', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
                          district: { emoji: '🏙️', label: 'District', color: 'bg-amber-50 text-amber-700 border-amber-200' },
                          national: { emoji: '🇮🇳', label: 'National', color: 'bg-blue-50 text-blue-700 border-blue-200' },
                          international: { emoji: '🌍', label: 'Intl', color: 'bg-purple-50 text-purple-700 border-purple-200' },
                        };
                        const meta = scopeMeta[article.scope];
                        return meta ? (
                          <span className={`px-1.5 py-0.5 rounded-md text-[10px] font-bold border ${meta.color} flex items-center gap-0.5`}>
                            <span>{meta.emoji}</span>
                            <span>{meta.label}</span>
                          </span>
                        ) : null;
                      })()}
                    </div>

                    <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={(e) => toggleLike(article.id, e)}
                        className={`p-1.5 rounded-lg transition-colors flex items-center gap-1 text-[11px] font-semibold ${
                          isLiked
                            ? 'bg-blue-50 text-blue-600'
                            : 'hover:bg-slate-100 text-slate-600'
                        }`}
                      >
                        <ThumbsUp className={`w-3.5 h-3.5 ${isLiked ? 'fill-blue-600' : ''}`} />
                        <span>{isLiked ? '14' : '13'}</span>
                      </button>

                      <button
                        onClick={(e) => handleShare(article.title, e)}
                        className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors"
                        title="Share article"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {filteredNews.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-200/80 p-6 space-y-2">
            <Newspaper className="w-8 h-8 text-slate-300 mx-auto" />
            <h4 className="text-sm font-bold text-slate-800">No Articles Found</h4>
            <p className="text-xs text-slate-500">
              Try adjusting your search keywords or switching category filters.
            </p>
          </div>
        )}
      </section>

      {/* Full Article Reader Modal */}
      <AnimatePresence>
        {activeArticle && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-[#0F172A]/70 backdrop-blur-sm"
              onClick={() => setActiveArticle(null)}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-2xl bg-white rounded-3xl p-6 sm:p-8 shadow-2xl z-10 space-y-5 max-h-[90vh] overflow-y-auto"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b pb-4 border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-full bg-blue-100 text-blue-800 text-[10px] font-extrabold uppercase tracking-wider font-['Plus_Jakarta_Sans']">
                    {activeArticle.tag}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">
                    {activeArticle.category} · {activeArticle.timestamp}
                  </span>
                </div>
                <button
                  onClick={() => setActiveArticle(null)}
                  className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-900 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Title & Meta */}
              <div className="space-y-2">
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-['Plus_Jakarta_Sans'] leading-tight">
                  {activeArticle.title}
                </h2>
                <div className="flex items-center gap-3 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> {activeArticle.readTime}
                  </span>
                  <span>•</span>
                  <span>Published by SportSphere Editorial Board</span>
                </div>
              </div>

              {/* Hero Image if available */}
              {activeArticle.image && (
                <div className="w-full h-56 sm:h-72 rounded-2xl overflow-hidden bg-slate-100">
                  <img
                    src={activeArticle.image}
                    alt={activeArticle.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Article Full Body */}
              <div className="space-y-4 text-sm sm:text-base text-slate-700 leading-relaxed font-['Inter']">
                <p className="font-semibold text-slate-900 border-l-4 border-blue-600 pl-3 py-0.5 bg-blue-50/50 rounded-r-lg">
                  {activeArticle.summary}
                </p>

                <p>
                  {activeArticle.fullBody ||
                    'Sports governance committees have emphasized the vital importance of consistent athlete benchmarking and physical readiness tracking ahead of upcoming sanctioned tournaments. With collegiate recruiters and talent scouts accelerating their evaluation timelines, coaches must ensure that data submission remains verified through official radar benchmarks.'}
                </p>

                <p>
                  Key operational focal points include maintaining weekly load-management protocols, standardizing pitch-side telemetry measurements, and establishing clear tactical communication lines between academy directors, club scouts, and student athletes.
                </p>
              </div>

              {/* Actions Footer */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleLike(activeArticle.id)}
                    className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors"
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>Endorse / Like</span>
                  </button>
                  <button
                    onClick={() => toggleBookmark(activeArticle.id)}
                    className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors"
                  >
                    <Bookmark className="w-3.5 h-3.5" />
                    <span>{activeArticle.isBookmarked ? 'Saved' : 'Save'}</span>
                  </button>
                </div>

                <button
                  onClick={() => handleShare(activeArticle.title)}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share Bulletin</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
