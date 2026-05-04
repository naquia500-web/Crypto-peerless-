import { useEffect, useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  MessageSquare,
  Repeat2,
  Activity,
} from "lucide-react";

interface CommunityPost {
  id: string;
  username: string;
  handle: string;
  avatar_url?: string;
  content: string;
  post_image?: string;
  likes: string;
  comments: string;
  shares: string;
  timestamp: string;
}

export function CommunitySentiment() {
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [bullPercentage, setBullPercentage] = useState(80);
  const [hasVoted, setHasVoted] = useState(false);

  const handleVote = (type: "bull" | "bear") => {
    if (hasVoted) return;
    setHasVoted(true);
    setBullPercentage((prev) =>
      type === "bull" ? Math.min(prev + 2, 99) : Math.max(prev - 2, 1),
    );
  };

  useEffect(() => {
    const fetchLiveSentimentData = async () => {
      try {
        const [res, newsRes] = await Promise.all([
          fetch("https://api.binance.com/api/v3/ticker/24hr"),
          fetch("https://min-api.cryptocompare.com/data/v2/news/?lang=EN"),
        ]);
        const data = await res.json();
        const newsData = await newsRes.json();

        const articles = Array.isArray(newsData?.Data)
          ? newsData.Data.slice(0, 4)
          : [];

        let btc = data.find((t: any) => t.symbol === "BTCUSDT");

        const nowMs = Date.now();
        // Generate pseudo-random metrics based on current hour
        const seed = Math.floor(nowMs / (60 * 60 * 1000));

        const dynamicPosts: CommunityPost[] = [
          {
            id: `post-1-${seed}`,
            username: "AlphaTrader",
            handle: "@AlphaTrader_99",
            avatar_url:
              "https://api.dicebear.com/7.x/identicon/svg?seed=AlphaTrader&backgroundColor=0e1217",
            content: articles[0]
              ? `${articles[0].title}. ${articles[0].body.substring(0, 100)}...`
              : `Bitcoin holding strong above $${parseFloat(btc?.lastPrice || "0").toLocaleString(undefined, { maximumFractionDigits: 0 })}. Institutional flows are clearly absorbing the retail panic selling.`,
            post_image:
              articles[0]?.imageurl ||
              "https://images.unsplash.com/photo-1640340434855-6084b1f4901c?q=80&w=800&auto=format&fit=crop",
            likes: (seed % 50) + 10 + "K",
            comments: (seed % 10) + 1 + "K",
            shares: (seed % 20) + 2 + "K",
            timestamp: (seed % 50) + 5 + "m",
          },
          {
            id: `post-2-${seed}`,
            username: "WhaleWatcher",
            handle: "@WhaleWatcher_X",
            avatar_url:
              "https://api.dicebear.com/7.x/identicon/svg?seed=WhaleWatcher&backgroundColor=0e1217",
            content: articles[1]
              ? `${articles[1].title}. ${articles[1].body.substring(0, 100)}...`
              : `On-chain data confirms massive flow off exchanges. Supply shock is real. Don't let the short-term noise distract you.`,
            post_image:
              articles[1]?.imageurl ||
              "https://images.unsplash.com/photo-1621416894569-0f39ed31d247?q=80&w=800&auto=format&fit=crop",
            likes: (seed % 40) + 15 + "K",
            comments: (seed % 8) + 1 + "K",
            shares: (seed % 15) + 1 + "K",
            timestamp: (seed % 40) + 15 + "m",
          },
          {
            id: `post-3-${seed}`,
            username: "DeFi_Analyst",
            handle: "@DeFi_Analyst_0x",
            avatar_url:
              "https://api.dicebear.com/7.x/identicon/svg?seed=DeFi_Analyst&backgroundColor=0e1217",
            content: articles[2]
              ? `${articles[2].title}. ${articles[2].body.substring(0, 100)}...`
              : `Ethereum's layer-2 TVL just hit a new all-time high despite the choppy price action.`,
            post_image:
              articles[2]?.imageurl ||
              "https://images.unsplash.com/photo-1605792657660-596af9009e82?q=80&w=800&auto=format&fit=crop",
            likes: (seed % 30) + 5 + ".5K",
            comments: (seed % 5) + 1 + "K",
            shares: (seed % 10) + 1 + "K",
            timestamp: "1h",
          },
          {
            id: `post-4-${seed}`,
            username: "MacroSigma",
            handle: "@MacroSigma_7",
            avatar_url:
              "https://api.dicebear.com/7.x/identicon/svg?seed=MacroSigma&backgroundColor=0e1217",
            content: articles[3]
              ? `${articles[3].title}. ${articles[3].body.substring(0, 100)}...`
              : `Yield curve flattening while crypto dominance consolidates. Patience is the ultimate edge right now. Watching closely.`,
            post_image:
              articles[3]?.imageurl ||
              "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop",
            likes: (seed % 60) + 20 + "K",
            comments: (seed % 12) + 1 + ".5K",
            shares: (seed % 25) + 3 + "K",
            timestamp: "2h",
          },
        ];

        setPosts(dynamicPosts);

        // Update bull percentage based on BTC 24hr change + some randomness
        if (btc) {
          let baseBull = 50 + parseFloat(btc.priceChangePercent) * 5; // +1% = +5% bull
          baseBull = Math.max(20, Math.min(95, baseBull));
          setBullPercentage(Math.floor(baseBull));
        }
      } catch (error: any) {
        console.error("Failed to fetch sentiment intel", error);
      } finally {
        setLoadingPosts(false);
      }
    };

    fetchLiveSentimentData();

    const interval = setInterval(fetchLiveSentimentData, 3600000); // 1 hour
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="flex flex-col gap-6 mt-8">
      <div className="flex items-center justify-between pb-2 border-b border-[#2A2E39]">
        <h3 className="text-[14px] font-black uppercase tracking-widest text-white flex items-center gap-2">
          Market Community Updates
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 ml-2">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></div>
            <span className="text-[9px] font-bold text-blue-500 uppercase tracking-wider">
              Live Tracker Active
            </span>
          </div>
        </h3>
      </div>

      <div className="bg-[#131722] shadow-lg border border-[#2A2E39] p-6 rounded-xl flex flex-col gap-5">
        <div className="flex justify-between items-center text-[10px] uppercase font-bold tracking-widest opacity-60">
          <span className="flex items-center gap-2">
            Community Sentiment{" "}
            <span className="opacity-50 lowercase font-sans">6.4M votes</span>
          </span>
        </div>

        {/* Sentiment Meter & Polls */}
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1 flex flex-col gap-2">
            <div className="flex justify-between font-mono font-bold text-sm mb-1">
              <span className="text-blue-400 flex items-center gap-1">
                <TrendingUp className="w-4 h-4" /> BTC Sentiment:{" "}
                {bullPercentage}%
              </span>
              <span className="text-red-400 flex items-center gap-1">
                {100 - bullPercentage}% <TrendingDown className="w-4 h-4" />
              </span>
            </div>
            <div className="flex w-full h-3 rounded-full overflow-hidden gap-1 bg-[#1E222D]">
              <div
                className="h-full bg-gradient-to-r from-[#00FF88]/50 to-[#00FF88] transition-all duration-1000"
                style={{ width: `${bullPercentage}%` }}
              ></div>
              <div
                className="h-full bg-gradient-to-l from-red-500/50 to-red-500 transition-all duration-1000"
                style={{ width: `${100 - bullPercentage}%` }}
              ></div>
            </div>
            <div className="flex gap-4 mt-3">
              <button
                onClick={() => handleVote("bull")}
                disabled={hasVoted}
                className={`flex-1 py-2.5 rounded-lg border border-blue-500/30 text-blue-400 transition-all text-[11px] uppercase font-bold tracking-widest flex justify-center items-center gap-2 ${hasVoted ? "opacity-50 cursor-not-allowed bg-[#1E222D]" : "hover:bg-blue-500/10 hover:shadow-[0_0_15px_rgba(0,255,136,0.2)]"}`}
              >
                <TrendingUp className="w-4 h-4" /> Bullish
              </button>
              <button
                onClick={() => handleVote("bear")}
                disabled={hasVoted}
                className={`flex-1 py-2.5 rounded-lg border border-red-500/30 text-red-400 transition-all text-[11px] uppercase font-bold tracking-widest flex justify-center items-center gap-2 ${hasVoted ? "opacity-50 cursor-not-allowed bg-[#1E222D]" : "hover:bg-red-500/10 hover:shadow-[0_0_15px_rgba(255,77,77,0.2)]"}`}
              >
                <TrendingDown className="w-4 h-4" /> Bearish
              </button>
            </div>
            {hasVoted && (
              <div className="text-center mt-2 text-[10px] text-blue-400 font-mono tracking-widest uppercase">
                Vote Registered • 6,432,192 Total Votes
              </div>
            )}
          </div>

          <div className="flex-1 flex flex-col gap-2 p-4 bg-[#1E222D] rounded-xl border border-[#2A2E39]">
            <h4 className="text-[11px] font-bold uppercase tracking-widest text-[#787B86] mb-2">
              Next Month Price Prediction
            </h4>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs font-mono text-[#787B86] mb-1">
                  <span>Above $85k</span>
                  <span>68%</span>
                </div>
                <div className="w-full h-1.5 bg-[#2A2E39] rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 w-[68%]"></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs font-mono text-[#787B86] mb-1">
                  <span>$70k - $85k</span>
                  <span>22%</span>
                </div>
                <div className="w-full h-1.5 bg-[#2A2E39] rounded-full overflow-hidden">
                  <div className="h-full bg-yellow-500 w-[22%]"></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs font-mono text-[#787B86] mb-1">
                  <span>Below $70k</span>
                  <span>10%</span>
                </div>
                <div className="w-full h-1.5 bg-[#2A2E39] rounded-full overflow-hidden">
                  <div className="h-full bg-red-400 w-[10%]"></div>
                </div>
              </div>
            </div>
            <button className="mt-2 text-[10px] uppercase font-bold text-teal-400 hover:text-teal-300 tracking-widest text-right">
              Submit Your Estimate &rarr;
            </button>
          </div>
        </div>

        {/* Community Posts area */}
        <div className="mt-4 flex flex-col gap-4 border-t border-[#2A2E39] pt-6">
          {loadingPosts ? (
            <div className="flex flex-col items-center justify-center py-10 opacity-70">
              <Activity className="w-6 h-6 animate-spin text-teal-400 mb-4" />
              <span className="text-xs font-mono uppercase tracking-widest text-teal-400">
                Loading Community Intel...
              </span>
            </div>
          ) : posts.length > 0 ? (
            posts.map((post) => (
              <div
                key={post.id}
                className="flex gap-4 p-4 bg-[#1E222D] rounded-xl border border-[#2A2E39] hover:border-teal-500/30 transition-all cursor-pointer group"
              >
                {post.avatar_url ? (
                  <img
                    src={post.avatar_url}
                    alt={post.username}
                    className="w-10 h-10 rounded-full shrink-0 border border-teal-500/40 bg-[#131722]"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-teal-500/20 text-teal-400 font-bold flex items-center justify-center shrink-0 border border-teal-500/40">
                    {post.username.charAt(0)}
                  </div>
                )}
                <div className="flex flex-col gap-2 w-full">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm font-bold text-white">
                      {post.username}{" "}
                      <span className="text-blue-400 text-xs">✓</span>
                      <span className="text-[10px] opacity-40 font-mono font-normal">
                        {post.handle} · {post.timestamp}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-[#787B86] leading-relaxed font-sans mt-1">
                    {post.content}
                  </p>

                  {post.post_image && (
                    <div className="mt-2 w-full max-h-48 overflow-hidden rounded-lg border border-[#2A2E39] opacity-80 group-hover:opacity-100 transition-opacity relative group-hover:shadow-[0_0_20px_rgba(45,212,191,0.15)]">
                      <img
                        src={post.post_image}
                        alt="Chart/Data"
                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                        referrerPolicy="no-referrer"
                        loading="lazy"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.onerror = null;
                          target.src =
                            "https://images.unsplash.com/photo-1621416894569-0f39ed31d247?q=80&w=800&auto=format&fit=crop";
                        }}
                      />
                    </div>
                  )}

                  <div className="flex items-center gap-6 mt-3 text-[#787B86]">
                    <button className="flex items-center gap-1.5 hover:text-blue-400 transition-colors group-hover:text-[#787B86]">
                      <TrendingUp className="w-4 h-4" />{" "}
                      <span className="text-xs font-mono font-bold text-blue-400">
                        {post.likes}
                      </span>
                    </button>
                    <button className="flex items-center gap-1.5 hover:text-white transition-colors">
                      <MessageSquare className="w-4 h-4" />{" "}
                      <span className="text-xs font-mono">{post.comments}</span>
                    </button>
                    <button className="flex items-center gap-1.5 hover:text-white transition-colors">
                      <Repeat2 className="w-4 h-4" />{" "}
                      <span className="text-xs font-mono">{post.shares}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-10 text-white/40 text-xs font-mono uppercase tracking-widest">
              No recent updates found.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
