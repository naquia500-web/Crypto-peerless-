import { TrendingUp, TrendingDown, MessageCircle, BarChart3, Globe } from 'lucide-react';
import { motion } from 'motion/react';
import { getCryptoLogo } from '../lib/logos';

interface SentimentData {
  id: string;
  symbol: string;
  name: string;
  sentimentScore: number; // 0 to 100
  trend: 'positive' | 'negative' | 'neutral';
  socialVolume: string;
  topKeywords: string[];
}

const mockSentimentData: SentimentData[] = [
  {
    id: "btc",
    symbol: "BTC",
    name: "Bitcoin",
    sentimentScore: 82,
    trend: 'positive',
    socialVolume: '45.2K mentions/hr',
    topKeywords: ['Halving', 'ETF flows', 'Bull run']
  },
  {
    id: "eth",
    symbol: "ETH",
    name: "Ethereum",
    sentimentScore: 75,
    trend: 'positive',
    socialVolume: '28.5K mentions/hr',
    topKeywords: ['Layer 2', 'Fees', 'Smart Contracts']
  },
  {
    id: "sol",
    symbol: "SOL",
    name: "Solana",
    sentimentScore: 88,
    trend: 'positive',
    socialVolume: '32.1K mentions/hr',
    topKeywords: ['Throughput', 'Airdrops', 'Speed']
  },
  {
    id: "xrp",
    symbol: "XRP",
    name: "XRP",
    sentimentScore: 45,
    trend: 'negative',
    socialVolume: '15.4K mentions/hr',
    topKeywords: ['Lawsuit', 'Cross-border', 'SEC']
  },
  {
    id: "ada",
    symbol: "ADA",
    name: "Cardano",
    sentimentScore: 55,
    trend: 'neutral',
    socialVolume: '8.2K mentions/hr',
    topKeywords: ['Smart Contracts', 'Development', 'Community']
  }
];

export function MarketSentimentAnalysis() {
  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
          <Globe className="w-4 h-4" />
        </div>
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            Market Sentiment Analysis
          </h2>
          <p className="text-[11px] text-slate-500 uppercase tracking-widest font-mono">
            Social & News Pulse
          </p>
        </div>
      </div>

      <div className="bg-white shadow-lg border border-slate-200 rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-indigo-400" />
              <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider">AI Sentiment Scanner</h3>
            </div>
            <span className="text-[10px] font-mono opacity-50 border border-slate-200 px-2 py-1 rounded-full flex items-center gap-1">
              <MessageCircle className="w-3 h-3" /> Live Analysis
            </span>
          </div>
          <p className="text-xs text-slate-900/40 mt-2 font-mono">Aggregating real-time emotional indicators across 1,000+ social communities and news outlets.</p>
        </div>

        <div className="divide-y divide-slate-200">
          {mockSentimentData.map((coin, idx) => {
            const isPos = coin.trend === 'positive';
            const isNeg = coin.trend === 'negative';
            const barMaxWidth = `${coin.sentimentScore}%`;

            return (
              <motion.div 
                key={coin.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="p-5 hover:bg-slate-50 transition-colors flex flex-col md:flex-row md:items-center gap-6"
              >
                {/* Coin Info */}
                <div className="flex items-center gap-4 md:w-1/4 shrink-0">
                  <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center overflow-hidden p-2">
                    <img src={getCryptoLogo(coin.symbol) || `https://ui-avatars.com/api/?name=${coin.name}&background=0B0E11&color=fff&rounded=true`} alt={coin.symbol} className="w-full h-full object-contain" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-slate-900 text-sm tracking-wide">{coin.name}</span>
                    <span className="text-[10px] font-mono text-slate-500">{coin.symbol}</span>
                  </div>
                </div>

                {/* Sentiment Gauge */}
                <div className="flex-1 flex flex-col gap-2">
                  <div className="flex justify-between items-center text-xs font-mono font-bold">
                    <span className="text-red-400">Fear</span>
                    <span className={isPos ? "text-green-400" : isNeg ? "text-red-400" : "text-yellow-400"}>
                      Sentiment Rating: {coin.sentimentScore}/100
                    </span>
                    <span className="text-green-400">Greed</span>
                  </div>
                  <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden flex items-center relative">
                    <div className="absolute top-0 bottom-0 left-0 bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 w-full opacity-30"></div>
                    <motion.div 
                      className="absolute top-0 bottom-0 bg-white"
                      style={{ width: '4px', left: barMaxWidth }}
                      initial={{ left: '50%' }}
                      animate={{ left: barMaxWidth }}
                      transition={{ duration: 1, ease: "easeOut" }}
                    ></motion.div>
                  </div>
                </div>

                {/* Social Highlights */}
                <div className="md:w-1/3 flex flex-col items-end gap-2 shrink-0">
                  <div className="flex items-center gap-1.5 opacity-60">
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span className="text-[11px] font-mono">{coin.socialVolume}</span>
                  </div>
                  <div className="flex gap-1.5 flex-wrap justify-end">
                    {coin.topKeywords.map(keyword => (
                      <span key={keyword} className="text-[9px] uppercase tracking-widest bg-slate-50 border border-slate-200 px-1.5 py-0.5 rounded text-slate-500">
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  );
}
