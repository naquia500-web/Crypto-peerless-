import { useEffect, useState } from 'react';
import { Clock, Activity, Sparkles, TrendingUp, TrendingDown, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';
import { GoogleGenAI, Type } from '@google/genai';
import { ArticleModal } from './ArticleModal';
import { AllNewsModal } from './AllNewsModal';
import { getCryptoLogo } from '../lib/logos';

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

// Ensure high-quality fallback data
const FALLBACK_NEWS: NewsArticle[] = [
  {
    id: 'fallback-1',
    source: 'NEXUS AI INTELLIGENCE',
    symbol: 'BTCUSDT',
    changePercent: 2.5,
    title: 'Positive Market Trends with Surge in Institutional Investment',
    description: 'Following the recent ETF approval, major Wall Street investors have rapidly started consolidating their positions in the global market, leading to a record surge in prices.',
    published_on: Math.floor(Date.now() / 1000) - 900,
    imageUrl: 'https://images.unsplash.com/photo-1621416894569-0f39ed31d247?q=80&w=1600&auto=format&fit=crop',
    url: '#'
  },
  {
    id: 'fallback-2',
    source: 'NEXUS AI INTELLIGENCE',
    symbol: 'ETHUSDT',
    changePercent: 4.1,
    title: 'Layer-2 Network Transaction Fees Hit All-Time Low',
    description: 'Following new developer proposals and recent upgrades, transaction fees on Layer-2 networks have reached historically low levels.',
    published_on: Math.floor(Date.now() / 1000) - 3600,
    url: '#'
  },
  {
    id: 'fallback-3',
    source: 'NEXUS AI INTELLIGENCE',
    symbol: 'SOLUSDT',
    changePercent: -1.2,
    title: 'Unexpected Surge in Trading Volume Across Asian Markets',
    description: 'Major exchanges in Asia have witnessed a massive increase in trading activities over the past 24 hours, reflecting new investor interest.',
    published_on: Math.floor(Date.now() / 1000) - 7200,
    url: '#'
  },
  {
    id: 'fallback-4',
    source: 'NEXUS AI INTELLIGENCE',
    symbol: 'BNBUSDT',
    changePercent: -3.4,
    title: 'DeFi Total Value Locked (TVL) Reaches New Record Levels',
    description: 'Liquidity is returning to the DeFi space due to improved models in staking and yield farming.',
    published_on: Math.floor(Date.now() / 1000) - 10800,
    url: '#'
  },
  {
    id: 'fallback-5',
    source: 'NEXUS AI INTELLIGENCE',
    symbol: 'XRPUSDT',
    changePercent: 0.8,
    title: 'Institutional Custodians Introduce New Security Standards for Crypto Assets',
    description: 'Major banks and custodian services have announced new security frameworks to safeguard digital assets.',
    published_on: Math.floor(Date.now() / 1000) - 14400,
    url: '#'
  }
];

export function NewsFeed() {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
  const [isAllNewsOpen, setIsAllNewsOpen] = useState(false);

  useEffect(() => {
    const fetchLiveNews = async () => {
      try {
        const finalApiKey = process.env.GEMINI_API_KEY || 'AIzaSyBQWrotiRDJcPg_Y8EfLk-baV91sJ_08x0';
        if (!finalApiKey) {
           throw new Error('GEMINI_API_KEY missing');
        }

        // 1. Fetch live market data to find top 5 gainers for a broader news perspective
        const tickerRes = await fetch('https://api.binance.com/api/v3/ticker/24hr');
        const tickerData = await tickerRes.json();
        
        const topGainers = tickerData
          .filter((t: any) => t.symbol.endsWith('USDT') && parseFloat(t.quoteVolume) > 10000000)
          .sort((a: any, b: any) => parseFloat(b.priceChangePercent) - parseFloat(a.priceChangePercent))
          .slice(0, 5); // 1 Featured, 4 list items
          
        const gainersData = topGainers.map((t: any) => ({
             symbol: t.symbol,
             price: parseFloat(t.lastPrice).toFixed(4),
             changePercent: parseFloat(t.priceChangePercent).toFixed(2) + '%',
        }));

        // 2. Generate professional news text via Nexus AI
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
          contents: `Create highly professional, institutional-grade English news updates for the top 5 crypto gainers right now: ${JSON.stringify(gainersData)}. Act as "Nexus AI", an elite autonomous market analyst. Highlight their powerful price changes and momentum. Do not use generic placeholders. Ensure deep, analytical full textual updates.`,
          config: {
            temperature: 0.7,
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING, description: "Professional catchy news headline in English" },
                  description: { type: Type.STRING, description: "Detailed 2-3 sentence professional market momentum summary in English" },
                  symbol: { type: Type.STRING, description: "The coin symbol" }
                },
                required: ["title", "description", "symbol"]
              }
            }
          }
        });

        const generatedData = JSON.parse(textResponse.text || '[]');
        
        if (generatedData && generatedData.length >= 1) {
          // 3. Generate perfectly matched 16:9 image ONLY for the featured article (index 0) to save speed/tokens
          const articles = await Promise.all(
            generatedData.slice(0, 5).map(async (item: any, idx: number) => {
              const safeImages = [
                'https://images.unsplash.com/photo-1605792657660-596af9009e82?q=80&w=400&auto=format&fit=crop',
                'https://images.unsplash.com/photo-1640340434855-6084b1f4901c?q=80&w=400&auto=format&fit=crop',
                'https://images.unsplash.com/photo-1621416894569-0f39ed31d247?q=80&w=400&auto=format&fit=crop',
                'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?q=80&w=400&auto=format&fit=crop',
                'https://images.unsplash.com/photo-1639762681485-074b7f4ec651?q=80&w=400&auto=format&fit=crop',
                'https://images.unsplash.com/photo-1519162584292-56dfc9eb5db4?q=80&w=400&auto=format&fit=crop',
                'https://images.unsplash.com/photo-1618172193622-ae2d025f4032?q=80&w=400&auto=format&fit=crop',
                'https://images.unsplash.com/photo-1621932953986-15fcfdadb174?q=80&w=400&auto=format&fit=crop',
                'https://images.unsplash.com/photo-1629339942165-4424ee437b6c?q=80&w=400&auto=format&fit=crop'
              ];
              let imageUrl = safeImages[Math.floor(Math.random() * safeImages.length)];
              
              if (idx === 0) {
                try {
                  const imageRes = await ai.models.generateImages({
                    model: 'imagen-3.0-generate-002',
                    prompt: `A highly professional, futuristic, and cutting-edge 3D render representing the crypto token ${item.symbol}. Theme: Institutional finance, neon cyber aesthetic, dark background. No text.`,
                    config: {
                      numberOfImages: 1,
                      aspectRatio: "16:9"
                    }
                  });
                  
                  const base64Image = imageRes.generatedImages?.[0]?.image?.imageBytes;
                  if (base64Image) {
                    imageUrl = `data:image/jpeg;base64,${base64Image}`;
                  }
                } catch (imgError) {
                  // Fallback for featured image
                  imageUrl = 'https://images.unsplash.com/photo-1621416894569-0f39ed31d247?q=80&w=1600&auto=format&fit=crop';
                }
              }
              
              const tokenData = gainersData.find((g: any) => g.symbol === item.symbol);
              return {
                id: `nexus-${item.symbol}-${Date.now()}-${idx}`,
                source: 'NEXUS AI INTELLIGENCE',
                title: item.title,
                description: item.description,
                symbol: item.symbol,
                changePercent: tokenData ? parseFloat(tokenData.changePercent) : undefined,
                imageUrl: imageUrl,
                url: '#',
                published_on: Math.floor(Date.now() / 1000) - (idx * 900)
              };
            })
          );
          
          setNews(articles);
        } else {
          setNews(FALLBACK_NEWS);
        }

      } catch (error: any) {
        const errString = typeof error === 'object' ? JSON.stringify(error) : String(error);
        const isQuota = errString.includes('429') || errString.toLowerCase().includes('quota') || errString.includes('RESOURCE_EXHAUSTED');
        if (!isQuota) {
          console.warn("Failed to fetch live news, falling back to cached content.");
        }
        setNews(FALLBACK_NEWS);
      } finally {
        setLoading(false);
      }
    };

    fetchLiveNews();
    const interval = setInterval(fetchLiveNews, 7200000); // 2 hours
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
  const listArticles = news.slice(1);

  return (
    <section className="flex flex-col h-full bg-[#0B0E11] rounded-xl p-4 shadow-[0_0_40px_rgba(45,212,191,0.03)] border border-teal-500/10">
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
            <div className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse shadow-[0_0_5px_rgba(45,212,191,0.8)]"></div>
            <span className="text-[10px] font-bold text-teal-400 uppercase tracking-widest hidden sm:block">Auto-Updating (2hrs)</span>
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
            <span className="text-sm font-black uppercase tracking-[0.3em] font-mono text-teal-400 text-shadow-glow">NEXUS AI GENERATING INTEL...</span>
            <span className="text-[10px] text-teal-500/60 uppercase tracking-widest mt-2">Synthesizing live markets & assets</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-2">
            
            
              {/* LEFT SIDE: FEATURED ARTICLE */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                onClick={() => setSelectedArticle(featuredArticle)}
                className="lg:col-span-7 group flex flex-col bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden hover:border-teal-500/30 hover:shadow-[0_0_30px_rgba(45,212,191,0.1)] transition-all duration-500 cursor-pointer"
              >
                <div className="w-full aspect-video relative overflow-hidden bg-black/50">
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B0E11] via-black/20 to-transparent z-10 hover:opacity-80 transition-opacity duration-500"></div>
                  {featuredArticle.symbol && getCryptoLogo(featuredArticle.symbol) && (
                    <div className="absolute top-4 left-4 z-20 w-8 h-8 rounded-full bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-center overflow-hidden">
                      <img src={getCryptoLogo(featuredArticle.symbol)!} alt={featuredArticle.symbol} className="w-5 h-5 object-contain" />
                    </div>
                  )}
                  <img 
                    src={featuredArticle.imageUrl || 'https://images.unsplash.com/photo-1621416894569-0f39ed31d247?q=80&w=1600&auto=format&fit=crop'} 
                    alt={featuredArticle.title} 
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-in-out"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-4 right-4 z-20 flex items-center gap-2 bg-black/60 backdrop-blur-md border border-teal-500/20 px-3 py-1.5 rounded-full">
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
                  
                  <p className="text-[15px] md:text-[16px] text-white/70 leading-relaxed font-sans mb-4 flex-1">
                    {featuredArticle.description}
                  </p>
                  
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5 opacity-80">
                    <div className="flex items-center gap-3">
                      <span className="text-[11px] font-black text-teal-500 uppercase tracking-widest bg-teal-500/10 px-2 py-1 rounded">
                        {featuredArticle.source}
                      </span>
                      <div className="flex items-center gap-1 text-[11px] font-mono text-white/50 uppercase tracking-wider">
                        <Clock className="w-3 h-3" />
                        {formatTimeAgo(featuredArticle.published_on)}
                      </div>
                    </div>
                    {featuredArticle.changePercent !== undefined && (
                       <div className={`flex items-center gap-1.5 text-[12px] font-bold ${featuredArticle.changePercent >= 0 ? 'text-[#00FF88]' : 'text-[#FF4D4D]'}`}>
                         {featuredArticle.changePercent >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                         <span>{featuredArticle.changePercent >= 0 ? '+' : ''}{featuredArticle.changePercent}%</span>
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
                    transition={{ delay: 0.1 + (index * 0.1), duration: 0.4, ease: "easeOut" }}
                    key={article.id}
                    onClick={() => setSelectedArticle(article)}
                    className="group bg-white/[0.02] border border-white/5 rounded-xl p-4 hover:border-teal-500/30 hover:bg-teal-500/[0.02] transition-colors cursor-pointer flex gap-4 items-center"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        {article.symbol && getCryptoLogo(article.symbol) && (
                          <img src={getCryptoLogo(article.symbol)!} alt={article.symbol} className="w-4 h-4 rounded-full object-contain" />
                        )}
                        <h5 className="text-[15px] font-bold leading-snug text-white group-hover:text-teal-300 transition-colors line-clamp-2">
                          {article.title}
                        </h5>
                      </div>
                      
                      <p className="text-[13px] text-white/60 leading-relaxed line-clamp-2 mb-3">
                        {article.description}
                      </p>
                      
                      <div className="flex items-center justify-between opacity-70">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold text-teal-500 uppercase tracking-widest">
                            {article.source}
                          </span>
                          <span className="w-1 h-1 rounded-full bg-white/20"></span>
                          <div className="flex items-center gap-1 text-[10px] font-mono text-white/50">
                            <Clock className="w-3 h-3" />
                            {formatTimeAgo(article.published_on)}
                          </div>
                        </div>
                        
                        {article.changePercent !== undefined && (
                          <div className={`flex items-center gap-1 text-[10px] font-bold ${article.changePercent >= 0 ? 'text-[#00FF88]' : 'text-[#FF4D4D]'}`}>
                            {article.changePercent >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                            <span>{article.changePercent >= 0 ? '+' : ''}{article.changePercent}%</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Company Thumbnail Image */}
                    <div className="w-20 h-20 shrink-0 rounded-lg overflow-hidden border border-white/10 relative bg-black/40 flex items-center justify-center p-2">
                      <div className="absolute inset-0 bg-teal-500/5 group-hover:bg-transparent transition-colors z-10"></div>
                      <img 
                        src={article.imageUrl || 'https://images.unsplash.com/photo-1621416894569-0f39ed31d247?q=80&w=400&auto=format&fit=crop'} 
                        alt=""
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                        loading="lazy"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.onerror = null;
                          target.src = 'https://images.unsplash.com/photo-1621416894569-0f39ed31d247?q=80&w=400&auto=format&fit=crop';
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
