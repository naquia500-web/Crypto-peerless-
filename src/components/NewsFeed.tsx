import { useEffect, useState } from "react";
import {
  Clock,
  Activity,
  Sparkles,
  TrendingUp,
  TrendingDown,
  ChevronRight,
} from "lucide-react";
import { motion } from "motion/react";
import { ArticleModal } from "./ArticleModal";
import { AllNewsModal } from "./AllNewsModal";
import { getCryptoLogo } from "../lib/logos";

interface NewsArticle {
  id: string;
  source: string;
  title: string;
  description: string;
  symbol?: string;
  changePercent?: number;
  imageUrl?: string;
  url: string;
  published_on: number;
}

export function NewsFeed() {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(
    null,
  );
  const [isAllNewsOpen, setIsAllNewsOpen] = useState(false);

  useEffect(() => {
    const fetchLiveNews = async () => {
      try {
        const res = await fetch(
          "https://min-api.cryptocompare.com/data/v2/news/?lang=EN",
        );
        const json = await res.json();

        if (json && Array.isArray(json.Data) && json.Data.length > 0) {
          const formattedNews: NewsArticle[] = json.Data.slice(0, 15).map(
            (item: any) => ({
              id: item.id,
              source: item.source_info?.name || "NEXUS AI INTELLIGENCE",
              title: item.title,
              description:
                item.body.length > 150
                  ? item.body.substring(0, 150) + "..."
                  : item.body,
              symbol: item.categories.split("|")[0] || "BTC", // Just extracting roughly the first category for symbol
              imageUrl: item.imageurl,
              url: item.url,
              published_on: item.published_on,
            }),
          );

          setNews(formattedNews);
        }
      } catch (error) {
        console.error("Failed to fetch live news", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLiveNews();

    // Refresh every 1 hour (3600000 ms) automatically
    const interval = setInterval(fetchLiveNews, 3600000);
    return () => clearInterval(interval);
  }, []);

  const formatTimeAgo = (timestamp: number) => {
    const seconds = Math.floor(Date.now() / 1000) - timestamp;
    if (seconds < 60) return `Just now`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} mins ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hours ago`;
    const days = Math.floor(hours / 24);
    return `${days} days ago`;
  };

  const featuredArticle = news[0];
  const listArticles = news.slice(1, 6); // show next 5 articles

  return (
    <section className="flex flex-col h-full bg-[#131722] rounded-xl p-4 shadow-[0_0_40px_rgba(45,212,191,0.03)] border border-teal-500/10">
      {/* Banner / Header */}
      <div className="flex justify-between items-center border-b border-teal-500/20 pb-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-teal-500/20 flex items-center justify-center border border-teal-500/40 shadow-[0_0_15px_rgba(45,212,191,0.3)]">
            <TrendingUp className="w-4 h-4 text-teal-400" />
          </div>
          <h3 className="text-[16px] font-black uppercase tracking-[0.2em] text-white drop-shadow-[0_0_10px_rgba(45,212,191,0.5)]">
            "NEXUS AI" LIVE MARKET INTEL
          </h3>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 shadow-[0_0_10px_rgba(45,212,191,0.2)] ml-2">
            <div className="w-1.5 h-1.5 rounded-full bg-teal-400 shadow-[0_0_5px_rgba(45,212,191,0.8)] animate-pulse"></div>
            <span className="text-[10px] font-bold text-teal-400 uppercase tracking-widest hidden sm:block">
              Live AI Tracker
            </span>
          </div>
        </div>
      </div>

      {/* Feed Content - CoinMarketCap Style Dashboard */}
      <div className="flex-1">
        {loading || !featuredArticle ? (
          <div className="py-24 flex flex-col items-center justify-center opacity-70">
            <div className="relative mb-6">
              <Activity className="w-10 h-10 animate-spin text-teal-400" />
              <div className="absolute inset-0 w-10 h-10 animate-ping opacity-50 text-teal-400 rounded-full border-2 border-teal-400"></div>
            </div>
            <span className="text-sm font-black uppercase tracking-[0.3em] font-mono text-teal-400 text-shadow-glow">
              NEXUS AI GENERATING INTEL...
            </span>
            <span className="text-[10px] text-teal-500/60 uppercase tracking-widest mt-2">
              Synthesizing live markets & assets
            </span>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-2">
            {/* LEFT SIDE: FEATURED ARTICLE */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              onClick={() => setSelectedArticle(featuredArticle)}
              className="lg:col-span-7 group flex flex-col bg-[#1E222D] border border-[#2A2E39] rounded-2xl overflow-hidden hover:border-teal-500/30 hover:shadow-[0_0_30px_rgba(45,212,191,0.1)] transition-all duration-500 cursor-pointer"
            >
              <div className="w-full aspect-video relative overflow-hidden bg-[#131722]">
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B0E11] via-black/20 to-transparent z-10 hover:opacity-80 transition-opacity duration-500"></div>
                {featuredArticle.symbol &&
                  getCryptoLogo(featuredArticle.symbol) && (
                    <div className="absolute top-4 left-4 z-20 w-8 h-8 rounded-full bg-[#131722] backdrop-blur-md border border-[#2A2E39] flex items-center justify-center overflow-hidden">
                      <img
                        src={getCryptoLogo(featuredArticle.symbol)!}
                        alt={featuredArticle.symbol}
                        className="w-5 h-5 object-contain"
                      />
                    </div>
                  )}
                <img
                  src={
                    featuredArticle.imageUrl ||
                    "https://images.unsplash.com/photo-1621416894569-0f39ed31d247?q=80&w=1600&auto=format&fit=crop"
                  }
                  alt={featuredArticle.title}
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-in-out"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 right-4 z-20 flex items-center gap-2 bg-[#131722] backdrop-blur-md border border-teal-500/20 px-3 py-1.5 rounded-full">
                  <Sparkles className="w-3 h-3 text-teal-400" />
                  <span className="text-[10px] font-bold text-teal-400 uppercase tracking-widest">
                    AI Featured Image
                  </span>
                </div>
              </div>

              <div className="p-6 flex flex-col flex-1">
                <h4 className="text-2xl md:text-3xl font-bold leading-tight mb-3 text-white group-hover:text-teal-300 transition-colors duration-300 tracking-tight">
                  {featuredArticle.title}
                </h4>

                <p className="text-[15px] md:text-[16px] text-[#787B86] leading-relaxed font-sans mb-4 flex-1">
                  {featuredArticle.description}
                </p>

                <div className="flex items-center justify-between mt-auto pt-4 border-t border-[#2A2E39] opacity-80">
                  <div className="flex items-center gap-3">
                    <span className="text-[11px] font-black text-teal-500 uppercase tracking-widest bg-teal-500/10 px-2 py-1 rounded">
                      {featuredArticle.source}
                    </span>
                    <div className="flex items-center gap-1 text-[11px] font-mono text-[#787B86] uppercase tracking-wider">
                      <Clock className="w-3 h-3" />
                      {formatTimeAgo(featuredArticle.published_on)}
                    </div>
                  </div>
                  {featuredArticle.changePercent !== undefined && (
                    <div
                      className={`flex items-center gap-1.5 text-[12px] font-bold ${featuredArticle.changePercent >= 0 ? "text-blue-400" : "text-red-400"}`}
                    >
                      {featuredArticle.changePercent >= 0 ? (
                        <TrendingUp className="w-4 h-4" />
                      ) : (
                        <TrendingDown className="w-4 h-4" />
                      )}
                      <span>
                        {featuredArticle.changePercent >= 0 ? "+" : ""}
                        {featuredArticle.changePercent}%
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>

            {/* RIGHT SIDE: LIST ARTICLES */}
            <div className="lg:col-span-5 flex flex-col gap-4">
              {listArticles.map((article, index) => (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    delay: 0.1 + index * 0.1,
                    duration: 0.4,
                    ease: "easeOut",
                  }}
                  key={article.id}
                  onClick={() => setSelectedArticle(article)}
                  className="group bg-[#1E222D] border border-[#2A2E39] rounded-xl p-4 hover:border-teal-500/30 hover:bg-teal-500/[0.02] transition-colors cursor-pointer flex gap-4 items-center"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      {article.symbol && getCryptoLogo(article.symbol) && (
                        <img
                          src={getCryptoLogo(article.symbol)!}
                          alt={article.symbol}
                          className="w-4 h-4 rounded-full object-contain"
                        />
                      )}
                      <h5 className="text-[15px] font-bold leading-snug text-white group-hover:text-teal-300 transition-colors line-clamp-2">
                        {article.title}
                      </h5>
                    </div>

                    <p className="text-[13px] text-[#787B86] leading-relaxed line-clamp-2 mb-3">
                      {article.description}
                    </p>

                    <div className="flex items-center justify-between opacity-70">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-teal-500 uppercase tracking-widest">
                          {article.source}
                        </span>
                        <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                        <div className="flex items-center gap-1 text-[10px] font-mono text-[#787B86]">
                          <Clock className="w-3 h-3" />
                          {formatTimeAgo(article.published_on)}
                        </div>
                      </div>

                      {article.changePercent !== undefined && (
                        <div
                          className={`flex items-center gap-1 text-[10px] font-bold ${article.changePercent >= 0 ? "text-blue-400" : "text-red-400"}`}
                        >
                          {article.changePercent >= 0 ? (
                            <TrendingUp className="w-3 h-3" />
                          ) : (
                            <TrendingDown className="w-3 h-3" />
                          )}
                          <span>
                            {article.changePercent >= 0 ? "+" : ""}
                            {article.changePercent}%
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Company Thumbnail Image */}
                  <div className="w-20 h-20 shrink-0 rounded-lg overflow-hidden border border-[#2A2E39] relative bg-[#1E222D] flex items-center justify-center p-2">
                    <div className="absolute inset-0 bg-teal-500/5 group-hover:bg-transparent transition-colors z-10"></div>
                    <img
                      src={
                        article.imageUrl ||
                        "https://images.unsplash.com/photo-1621416894569-0f39ed31d247?q=80&w=400&auto=format&fit=crop"
                      }
                      alt=""
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                      loading="lazy"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.onerror = null;
                        target.src =
                          "https://images.unsplash.com/photo-1621416894569-0f39ed31d247?q=80&w=400&auto=format&fit=crop";
                      }}
                    />
                  </div>
                </motion.div>
              ))}

              {/* View All Button */}
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                onClick={() => setIsAllNewsOpen(true)}
                className="mt-2 w-full py-3.5 rounded-xl border border-teal-500/20 bg-teal-500/5 text-teal-400 text-xs font-bold uppercase tracking-widest hover:bg-teal-500/10 hover:border-teal-500/40 transition-all shadow-[0_0_15px_rgba(45,212,191,0.05)]"
              >
                Read all live updates
              </motion.button>
            </div>
          </div>
        )}
      </div>

      <ArticleModal
        isOpen={!!selectedArticle}
        onClose={() => setSelectedArticle(null)}
        article={selectedArticle}
      />
      <AllNewsModal
        isOpen={isAllNewsOpen}
        onClose={() => setIsAllNewsOpen(false)}
        onSelectArticle={(article) => {
          setSelectedArticle(article);
        }}
      />
    </section>
  );
}
