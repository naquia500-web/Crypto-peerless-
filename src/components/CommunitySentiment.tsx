import { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, MessageSquare, Repeat2, Activity } from 'lucide-react';
import { GoogleGenAI, Type } from '@google/genai';

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

const FALLBACK_POSTS: CommunityPost[] = [
  {
    id: "fb-1",
    username: "AlphaTrader",
    handle: "@AlphaTrader_99",
    avatar_url: "https://api.dicebear.com/7.x/identicon/svg?seed=AlphaTrader&backgroundColor=0e1217",
    content: "Bitcoin just held the daily 200 EMA with massive volume. Institutional flows are clearly absorbing the retail panic selling. Macro setup remains highly bullish going into Q4. Volume is telling the real story today.",
    post_image: "https://images.unsplash.com/photo-1640340434855-6084b1f4901c?q=80&w=800&auto=format&fit=crop",
    likes: "34.5K",
    comments: "1.2K",
    shares: "4.1K",
    timestamp: "12m"
  },
  {
    id: "fb-2",
    username: "WhaleWatcher",
    handle: "@WhaleWatcher_X",
    avatar_url: "https://api.dicebear.com/7.x/identicon/svg?seed=WhaleWatcher&backgroundColor=0e1217",
    content: "On-chain data confirms 15,000 BTC moved off exchanges in the last 24 hours. The supply shock is real. Don't let the short-term noise distract you from the structural deficit.",
    likes: "28.1K",
    comments: "850",
    shares: "2.3K",
    timestamp: "45m"
  },
  {
    id: "fb-3",
    username: "DeFi_Analyst",
    handle: "@DeFi_Analyst_0x",
    avatar_url: "https://api.dicebear.com/7.x/identicon/svg?seed=DeFi_Analyst&backgroundColor=0e1217",
    content: "Ethereum's layer-2 TVL just hit a new all-time high despite the choppy price action. The fundamental network growth is diverging from the spot price. Historically, price eventually follows utilization.",
    post_image: "https://images.unsplash.com/photo-1621416894569-0f39ed31d247?q=80&w=800&auto=format&fit=crop",
    likes: "15.9K",
    comments: "420",
    shares: "1.1K",
    timestamp: "1h"
  },
  {
    id: "fb-4",
    username: "MacroSigma",
    handle: "@MacroSigma_7",
    avatar_url: "https://api.dicebear.com/7.x/identicon/svg?seed=MacroSigma&backgroundColor=0e1217",
    content: "Yield curve flattening while crypto dominance consolidates. This is textbook accumulation phase behavior before a liquidity expansion cycle. Patience is the ultimate edge right now.",
    likes: "45.2K",
    comments: "3.5K",
    shares: "8.9K",
    timestamp: "2h"
  }
];

export function CommunitySentiment() {
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [bullPercentage, setBullPercentage] = useState(80);
  const [hasVoted, setHasVoted] = useState(false);

  const handleVote = (type: 'bull' | 'bear') => {
    if (hasVoted) return;
    setHasVoted(true);
    setBullPercentage(prev => type === 'bull' ? Math.min(prev + 2, 99) : Math.max(prev - 2, 1));
  };

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const finalApiKey = process.env.GEMINI_API_KEY || 'AIzaSyBQWrotiRDJcPg_Y8EfLk-baV91sJ_08x0';
        if (!finalApiKey) {
           throw new Error('GEMINI_API_KEY missing');
        }

        const ai = new GoogleGenAI(
      process.env.GEMINI_BASE_URL ? { 
        apiKey: finalApiKey,
        httpOptions: { baseUrl: process.env.GEMINI_BASE_URL, apiVersion: 'v1alpha' }
      } : { 
        apiKey: finalApiKey,
        httpOptions: { apiVersion: 'v1alpha' }
      }
    );
        const textResponse = await ai.models.generateContent({
          model: 'gemini-3.1-flash-lite-preview',
          contents: `Act as an autonomous Community Management AI for the 'Community' section of the platform. Your sole task is to dynamically generate and manage highly realistic, professional-grade user-generated content (UGC) related to cryptocurrency, trading, and global markets. 

You must strictly adhere to the following parameters:
1. Professional Content: Generate insightful, market-relevant posts (e.g., technical analysis, macro-economic impacts, bullish/bearish market sentiments, and DeFi updates). The tone must be professional, engaging, and authentic to elite crypto communities.
2. High-Volume Engagement: Assign realistic, high-volume engagement metrics to every post to simulate an extremely active platform. Likes should range from 5k to 50k; Comments from 200 to 5k; and Shares from 100 to 10k. Display these as strings ending in 'K' where appropriate (e.g., "12.5K").
3. Safe & Unique User IDs: Create 100% unique, highly plausible alphanumeric usernames and crypto-personas (e.g., @AlphaTrader_99, @WhaleWatcher_X).
4. Output Format: Provide the final output in a structured JSON format with an array of 4 posts. Include 'has_image' as a boolean (make it true for 1 or 2 posts).`,
          config: {
            temperature: 0.8,
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  username: { type: Type.STRING, description: "Display name (e.g., CryptoInsider)" },
                  handle: { type: Type.STRING, description: "Social handle (e.g., @CryptoInsider_99)" },
                  content: { type: Type.STRING, description: "The content of the post" },
                  has_image: { type: Type.BOOLEAN, description: "Should this post have a chart image attached?" },
                  likes: { type: Type.STRING, description: "Number of likes (e.g., '14.2K')" },
                  comments: { type: Type.STRING, description: "Number of comments (e.g., '1.1K')" },
                  shares: { type: Type.STRING, description: "Number of shares (e.g., '450')" },
                  timestamp: { type: Type.STRING, description: "Time string (e.g., '1h', '2h', '15m')" }
                },
                required: ["id", "username", "handle", "content", "has_image", "likes", "comments", "shares", "timestamp"]
              }
            }
          }
        });

        const generatedData = JSON.parse(textResponse.text || '[]');
        if (generatedData && generatedData.length > 0) {
           const enhancedPosts = generatedData.map((post: any) => {
             // Add DiceBear Avatar
             post.avatar_url = `https://api.dicebear.com/7.x/identicon/svg?seed=${post.username}&backgroundColor=0e1217`;
             
             // Optionally add a random Crypto Unsplash image if AI decided it has an image
             if (post.has_image) {
               // Use a random combination to bypass caching on identical requests
               const randomId = Math.floor(Math.random() * 1000);
               // Adding crypto,trading keywords directly to source.unsplash is deprecated, using specific curated collections/ids or just standard images API
               const cryptoImages = [
                 'https://images.unsplash.com/photo-1640340434855-6084b1f4901c?q=80&w=800&auto=format&fit=crop',
                 'https://images.unsplash.com/photo-1621416894569-0f39ed31d247?q=80&w=800&auto=format&fit=crop',
                 'https://images.unsplash.com/photo-1605792657660-596af9009e82?q=80&w=800&auto=format&fit=crop',
                 'https://images.unsplash.com/photo-1622630998477-20b41cd0e071?q=80&w=800&auto=format&fit=crop'
               ];
               post.post_image = cryptoImages[Math.floor(Math.random() * cryptoImages.length)];
             }
             return post;
           });
           setPosts(enhancedPosts);
        } else {
           setPosts(FALLBACK_POSTS);
        }
      } catch (error: any) {
        const errString = typeof error === 'object' ? JSON.stringify(error) : String(error);
        const isQuota = errString.includes('429') || errString.toLowerCase().includes('quota') || errString.includes('RESOURCE_EXHAUSTED');
        if (!isQuota) {
           console.warn("Failed to generate community posts, falling back to cached content.", error);
        }
        setPosts(FALLBACK_POSTS);
      } finally {
        setLoadingPosts(false);
      }
    };

    fetchPosts();
    const interval = setInterval(fetchPosts, 7200000); // 2 hours
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="flex flex-col gap-6 mt-8">
      <div className="flex items-center justify-between pb-2 border-b border-white/10">
        <h3 className="text-[14px] font-black uppercase tracking-widest text-white">Market Community Updates</h3>
      </div>

      <div className="bg-[#0B0E11] shadow-lg border border-white/10 p-6 rounded-xl flex flex-col gap-5">
        <div className="flex justify-between items-center text-[10px] uppercase font-bold tracking-widest opacity-60">
          <span className="flex items-center gap-2">Community Sentiment <span className="opacity-50 lowercase font-sans">6.4M votes</span></span>
        </div>

        {/* Sentiment Meter & Polls */}
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1 flex flex-col gap-2">
            <div className="flex justify-between font-mono font-bold text-sm mb-1">
              <span className="text-[#00FF88] flex items-center gap-1"><TrendingUp className="w-4 h-4" /> BTC Sentiment: {bullPercentage}%</span>
              <span className="text-[#FF4D4D] flex items-center gap-1">{100 - bullPercentage}% <TrendingDown className="w-4 h-4" /></span>
            </div>
            <div className="flex w-full h-3 rounded-full overflow-hidden gap-1 bg-white/5">
              <div className="h-full bg-gradient-to-r from-[#00FF88]/50 to-[#00FF88] transition-all duration-1000" style={{ width: `${bullPercentage}%` }}></div>
              <div className="h-full bg-gradient-to-l from-[#FF4D4D]/50 to-[#FF4D4D] transition-all duration-1000" style={{ width: `${100 - bullPercentage}%` }}></div>
            </div>
            <div className="flex gap-4 mt-3">
              <button 
                onClick={() => handleVote('bull')}
                disabled={hasVoted}
                className={`flex-1 py-2.5 rounded-lg border border-[#00FF88]/30 text-[#00FF88] transition-all text-[11px] uppercase font-bold tracking-widest flex justify-center items-center gap-2 ${hasVoted ? 'opacity-50 cursor-not-allowed bg-white/5' : 'hover:bg-[#00FF88]/10 hover:shadow-[0_0_15px_rgba(0,255,136,0.2)]'}`}
              >
                <TrendingUp className="w-4 h-4" /> Bullish
              </button>
              <button 
                onClick={() => handleVote('bear')}
                disabled={hasVoted}
                className={`flex-1 py-2.5 rounded-lg border border-[#FF4D4D]/30 text-[#FF4D4D] transition-all text-[11px] uppercase font-bold tracking-widest flex justify-center items-center gap-2 ${hasVoted ? 'opacity-50 cursor-not-allowed bg-white/5' : 'hover:bg-[#FF4D4D]/10 hover:shadow-[0_0_15px_rgba(255,77,77,0.2)]'}`}
              >
                <TrendingDown className="w-4 h-4" /> Bearish
              </button>
            </div>
            {hasVoted && (
              <div className="text-center mt-2 text-[10px] text-[#00FF88] font-mono tracking-widest uppercase">
                Vote Registered • 6,432,192 Total Votes
              </div>
            )}
          </div>
          
          <div className="flex-1 flex flex-col gap-2 p-4 bg-white/5 rounded-xl border border-white/10">
             <h4 className="text-[11px] font-bold uppercase tracking-widest text-white/80 mb-2">Next Month Price Prediction</h4>
             <div className="space-y-3">
               <div>
                  <div className="flex justify-between text-xs font-mono text-white/60 mb-1">
                    <span>Above $85k</span>
                    <span>68%</span>
                  </div>
                  <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden"><div className="h-full bg-blue-500 w-[68%]"></div></div>
               </div>
               <div>
                  <div className="flex justify-between text-xs font-mono text-white/60 mb-1">
                    <span>$70k - $85k</span>
                    <span>22%</span>
                  </div>
                  <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden"><div className="h-full bg-yellow-500 w-[22%]"></div></div>
               </div>
               <div>
                  <div className="flex justify-between text-xs font-mono text-white/60 mb-1">
                    <span>Below $70k</span>
                    <span>10%</span>
                  </div>
                  <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden"><div className="h-full bg-red-400 w-[10%]"></div></div>
               </div>
             </div>
             <button className="mt-2 text-[10px] uppercase font-bold text-teal-400 hover:text-teal-300 tracking-widest text-right">Submit Your Estimate &rarr;</button>
          </div>
        </div>

        {/* Community Posts area */}
        <div className="mt-4 flex flex-col gap-4 border-t border-white/10 pt-6">
          {loadingPosts ? (
            <div className="flex flex-col items-center justify-center py-10 opacity-70">
              <Activity className="w-6 h-6 animate-spin text-teal-400 mb-4" />
              <span className="text-xs font-mono uppercase tracking-widest text-teal-400">Loading Community Intel...</span>
            </div>
          ) : posts.length > 0 ? (
            posts.map((post) => (
              <div key={post.id} className="flex gap-4 p-4 bg-white/5 rounded-xl border border-white/5 hover:border-teal-500/30 transition-all cursor-pointer group">
                {post.avatar_url ? (
                  <img src={post.avatar_url} alt={post.username} className="w-10 h-10 rounded-full shrink-0 border border-teal-500/40 bg-[#0e1217]" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-teal-500/20 text-teal-400 font-bold flex items-center justify-center shrink-0 border border-teal-500/40">
                    {post.username.charAt(0)}
                  </div>
                )}
                <div className="flex flex-col gap-2 w-full">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm font-bold text-white">
                      {post.username} <span className="text-blue-400 text-xs">✓</span>
                      <span className="text-[10px] opacity-40 font-mono font-normal">{post.handle} · {post.timestamp}</span>
                    </div>
                  </div>
                  <p className="text-sm text-white/70 leading-relaxed font-sans mt-1">
                    {post.content}
                  </p>
                  
                  {post.post_image && (
                    <div className="mt-2 w-full max-h-48 overflow-hidden rounded-lg border border-white/10 opacity-80 group-hover:opacity-100 transition-opacity">
                      <img src={post.post_image} alt="Chart/Data" className="w-full h-full object-cover" />
                    </div>
                  )}

                  <div className="flex items-center gap-6 mt-3 text-white/50">
                    <button className="flex items-center gap-1.5 hover:text-[#00FF88] transition-colors group-hover:text-white/80"><TrendingUp className="w-4 h-4" /> <span className="text-xs font-mono font-bold text-[#00FF88]">{post.likes}</span></button>
                    <button className="flex items-center gap-1.5 hover:text-white transition-colors"><MessageSquare className="w-4 h-4" /> <span className="text-xs font-mono">{post.comments}</span></button>
                    <button className="flex items-center gap-1.5 hover:text-white transition-colors"><Repeat2 className="w-4 h-4" /> <span className="text-xs font-mono">{post.shares}</span></button>
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
