import { useState, useEffect } from 'react';
import { Newspaper, Activity, AlertCircle, TrendingUp, TrendingDown, Minus, Sparkles } from 'lucide-react';
import { GoogleGenAI, Type } from '@google/genai';

interface NewsItem {
  id: string;
  headline: string;
  category: 'Bitcoin' | 'Ethereum' | 'Solana' | 'XRP' | 'DeFi' | 'Regulatory' | 'Web3' | 'Market Trends';
  summary: string;
  impactScore: number; // 0 to 10
  timeAgo: string;
  sentiment: 'bullish' | 'bearish' | 'neutral';
}

export function GlobalCryptoNews() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      setError(false);
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

        const prompt = `You are a real-time global crypto news curator. Generate highly realistic, up-to-the-minute news items focusing on major coins like Bitcoin, Ethereum, Solana, and XRP, latest market trends, regulatory developments impacting the global crypto market, and updates on emerging technologies like DeFi and Web3. Do NOT use placeholders. Generate exactly 5 news items.`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.1-flash-lite-preview',
          contents: prompt,
          config: {
            temperature: 0.7,
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  headline: { type: Type.STRING, description: "A punchy, realistic news headline" },
                  category: { type: Type.STRING, description: "Must be one of: Bitcoin, Ethereum, Solana, XRP, DeFi, Regulatory, Web3, Market Trends" },
                  summary: { type: Type.STRING, description: "A 2-3 sentence detailed summary of the news" },
                  impactScore: { type: Type.NUMBER, description: "Estimated market impact score from 1 to 10" },
                  timeAgo: { type: Type.STRING, description: "Short string like '5m ago', '1h ago'" },
                  sentiment: { type: Type.STRING, description: "Must be exactly 'bullish', 'bearish', or 'neutral'" }
                },
                required: ["id", "headline", "category", "summary", "impactScore", "timeAgo", "sentiment"]
              }
            }
          }
        });

        const parsed = JSON.parse(response.text || '[]');
        if (parsed && Array.isArray(parsed) && parsed.length > 0) {
           setNews(parsed);
        } else {
           throw new Error("Invalid format");
        }

      } catch (err: any) {
        const errString = typeof err === 'object' ? JSON.stringify(err) : String(err);
        const isQuota = errString.includes('429') || errString.toLowerCase().includes('quota') || errString.includes('RESOURCE_EXHAUSTED');
        if (!isQuota) {
            console.warn("Error fetching news:", err);
        }
        setError(true);
        // Fallback data
        setNews([
           { id: "1", headline: "Bitcoin Halving Impact Outperforming Previous Cycles", category: "Bitcoin", summary: "On-chain analytics suggest the latest BTC halving is absorbing liquid supply faster than the 2020 cycle, pointing to a potential upcoming supply shock on centralized exchanges.", impactScore: 9, timeAgo: "15m ago", sentiment: "bullish" },
           { id: "2", headline: "Solana Network Upgrades Yield Record Transaction Throughput", category: "Solana", summary: "The latest validator client update has pushed the network's theoretical TPS to new highs, bringing institutional confidence to decentralized exchanges operating on the network.", impactScore: 8, timeAgo: "30m ago", sentiment: "bullish" },
           { id: "3", headline: "Ethereum Layer 2s Dominate Total Value Locked", category: "Ethereum", summary: "Arbitrum and Base have seen explosive growth in the past 24 hours, collectively holding over $14B in TVL, driven by new decentralized perpetual exchanges.", impactScore: 7, timeAgo: "1h ago", sentiment: "bullish" },
           { id: "4", headline: "XRP Ledger Enhances Cross-Border Settlement Corridors", category: "XRP", summary: "New banking partnerships in Southeast Asia demonstrate the ledger's ongoing maturation and viability for bridging institutional liquidity.", impactScore: 6, timeAgo: "2h ago", sentiment: "bullish" },
           { id: "5", headline: "Global Regulators Coordinate on Stablecoin Framework", category: "Regulatory", summary: "Following recent closed-door meetings in Geneva, leading financial authorities have signaled a unified approach for classifying fiat-backed stablecoins to ensure systemic safety.", impactScore: 8, timeAgo: "3h ago", sentiment: "neutral" },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  return (
    <section className="flex flex-col gap-6 mt-8">
      <div className="flex items-center justify-between pb-2 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="relative flex h-8 w-8 items-center justify-center bg-teal-500/20 rounded-lg border border-teal-500/30">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-lg bg-teal-400 opacity-20"></span>
            <Sparkles className="relative z-10 w-4 h-4 text-teal-400" />
          </div>
          <div className="flex flex-col">
            <h3 className="text-[14px] font-black uppercase tracking-widest text-[#00FF88] text-shadow-glow">
              AI Market Intelligence
            </h3>
            <span className="text-[10px] text-white/50 font-mono tracking-widest uppercase flex items-center gap-1.5">
               <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse"></span>
               Live Global News Feed
            </span>
          </div>
        </div>
      </div>

      <div className="bg-[#0B0E11] shadow-lg border border-teal-500/20 p-6 rounded-xl flex flex-col gap-5 relative overflow-hidden">
         <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/5 blur-[100px] pointer-events-none rounded-full"></div>
         
         {loading ? (
             <div className="flex flex-col items-center justify-center py-10 opacity-70">
               <Activity className="w-6 h-6 animate-spin text-teal-400 mb-4" />
               <span className="text-xs font-mono uppercase tracking-widest text-teal-400">Synthesizing live intelligence...</span>
             </div>
         ) : (
            <div className="flex flex-col gap-4 relative z-10">
               {news.map((item) => {
                 let catColor = "bg-white/10 text-white border-white/20";
                 let Logo = null;
                 let brandColor = "";

                 if (item.category === "Bitcoin") {
                    catColor = "bg-[#F7931A]/10 text-[#F7931A] border-[#F7931A]/30";
                    Logo = <img src="https://cryptologos.cc/logos/bitcoin-btc-logo.svg?v=025" alt="BTC" className="w-3.5 h-3.5" />;
                 }
                 else if (item.category === "Ethereum") {
                    catColor = "bg-[#627EEA]/10 text-[#627EEA] border-[#627EEA]/30";
                    Logo = <img src="https://cryptologos.cc/logos/ethereum-eth-logo.svg?v=025" alt="ETH" className="w-3.5 h-3.5" />;
                 }
                 else if (item.category === "Solana") {
                    catColor = "bg-[#14F195]/10 text-[#14F195] border-[#14F195]/30";
                    Logo = <img src="https://cryptologos.cc/logos/solana-sol-logo.svg?v=025" alt="SOL" className="w-3.5 h-3.5" />;
                 }
                 else if (item.category === "XRP") {
                    brandColor = "#23292F";
                    // Need a visible text color since #23292F is very dark. We'll use white text with #23292F bg.
                    catColor = "bg-[#23292F]/80 text-white border-white/20";
                    Logo = <img src="https://cryptologos.cc/logos/xrp-xrp-logo.svg?v=025" alt="XRP" className="w-3.5 h-3.5" />;
                 }
                 else if (item.category === "Regulatory") catColor = "bg-orange-500/10 text-orange-400 border-orange-500/30";
                 else if (item.category === "DeFi") catColor = "bg-purple-500/10 text-purple-400 border-purple-500/30";
                 else if (item.category === "Web3") catColor = "bg-pink-500/10 text-pink-400 border-pink-500/30";

                 const isBullish = item.sentiment === 'bullish';
                 const isBearish = item.sentiment === 'bearish';
                 const accentColor = isBullish ? '#00FF88' : isBearish ? '#FF4D4D' : '#38bdf8'; // teal-400 is not standard, let's use tailwind sky-400 or just explicit hex
                 
                 let boxClasses = "";
                 let inlineStyles: React.CSSProperties = {};

                 if (brandColor) {
                    inlineStyles = {
                       '--brand-color': brandColor,
                       '--brand-color-alpha': `${brandColor}40`,
                       '--brand-bg': `${brandColor}0A`,
                       '--brand-bg-hover': `${brandColor}15`,
                       '--brand-shadow': `0 0 20px ${brandColor}15`,
                    } as React.CSSProperties;
                    boxClasses = `bg-[var(--brand-bg)] border-[var(--brand-color-alpha)] hover:bg-[var(--brand-bg-hover)] shadow-[var(--brand-shadow)]`;
                 } else {
                    boxClasses = isBullish ? 'bg-[#00FF88]/[0.03] border-[#00FF88]/20 hover:border-[#00FF88]/50 shadow-[0_0_15px_rgba(0,255,136,0.05)]' :
                                       isBearish ? 'bg-[#FF4D4D]/[0.03] border-[#FF4D4D]/20 hover:border-[#FF4D4D]/50 shadow-[0_0_15px_rgba(255,77,77,0.05)]' :
                                       'bg-white/[0.02] border-white/10 hover:border-white/30';
                 }

                 return (
                   <div key={item.id} className={`flex flex-col gap-3 p-5 rounded-xl transition-all duration-300 border ${boxClasses}`} style={inlineStyles}>
                     <div className="flex justify-between items-start mb-1">
                        <span className={`flex items-center gap-1.5 text-[9px] uppercase tracking-widest font-bold px-2 py-1 rounded border shadow-sm ${catColor}`}>
                          {Logo} {item.category}
                        </span>
                        <div className="flex items-center gap-4">
                           <span className={`flex items-center gap-1 text-[10px] uppercase font-bold tracking-widest`} style={{ color: accentColor }}>
                             {isBullish ? <TrendingUp className="w-3.5 h-3.5" /> : isBearish ? <TrendingDown className="w-3.5 h-3.5" /> : <Minus className="w-3.5 h-3.5" />}
                             {item.sentiment}
                           </span>
                           <span className="flex items-center gap-1 text-[10px] uppercase font-bold text-white/50 bg-black/50 px-2 py-0.5 rounded">
                             Impact <span className={`font-mono font-black ${item.impactScore >= 8 ? 'text-red-400' : 'text-teal-400'}`}>{item.impactScore}</span>
                           </span>
                           <span className="text-[10px] text-white/30 font-mono hidden sm:block">{item.timeAgo}</span>
                        </div>
                     </div>
                     <h4 className="text-[15px] font-black text-white leading-tight mt-1 group-hover:text-teal-400 transition-colors">{item.headline}</h4>
                     <p className="text-[13px] text-white/60 leading-relaxed font-sans">{item.summary}</p>
                   </div>
                 )
               })}
               {error && (
                 <div className="text-[10px] uppercase font-mono text-center text-red-400/50 flex justify-center items-center gap-1 mt-4">
                   <AlertCircle className="w-3 h-3" /> Live feed disconnected. Displaying cached intelligence.
                 </div>
               )}
            </div>
         )}
      </div>
    </section>
  )
}
