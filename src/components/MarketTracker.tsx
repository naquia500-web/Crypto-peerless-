import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Activity } from 'lucide-react';
import { getCryptoLogo } from '../lib/logos';

const COINS = [
  { id: 'BTCUSDT', name: 'Bitcoin', symbol: 'BTC' },
  { id: 'ETHUSDT', name: 'Ethereum', symbol: 'ETH' },
  { id: 'SOLUSDT', name: 'Solana', symbol: 'SOL' },
  { id: 'BNBUSDT', name: 'BNB', symbol: 'BNB' },
  { id: 'XRPUSDT', name: 'XRP', symbol: 'XRP' },
  { id: 'DOGEUSDT', name: 'Dogecoin', symbol: 'DOGE' },
  { id: 'ADAUSDT', name: 'Cardano', symbol: 'ADA' },
  { id: 'AVAXUSDT', name: 'Avalanche', symbol: 'AVAX' }
];

interface CoinData {
  s: string; // symbol
  c: string; // last price
  p: string; // price change
  P: string; // price change percent
  q: string; // quote volume (USDT)
}

export function MarketTracker() {
  const [data, setData] = useState<Record<string, CoinData>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
      // Initial fetch via REST API for quick load
    const symbolsString = `[${COINS.map(c => `"${c.id}"`).join(',')}]`;
    const symbols = encodeURIComponent(symbolsString);
    fetch(`https://api.binance.com/api/v3/ticker/24hr?symbols=${symbols}`)
      .then(res => res.json())
      .then((json: any[]) => {
        const initialData: Record<string, CoinData> = {};
        if (Array.isArray(json)) {
          json.forEach(item => {
            initialData[item.symbol] = {
              s: item.symbol,
              c: item.lastPrice,
              p: item.priceChange,
              P: item.priceChangePercent,
              q: item.quoteVolume
            };
          });
          setData(initialData);
        }
        setLoading(false);
      })
      .catch((err) => {
        // Fallback silently let websocket handle it
        setLoading(false);
      });

    // Subscribing to live WebSocket streams
    const streams = COINS.map(c => `${c.id.toLowerCase()}@ticker`).join('/');
    const ws = new WebSocket(`wss://stream.binance.com:9443/ws/${streams}`);

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.s && msg.c) {
        setData(prev => ({
          ...prev,
          [msg.s]: {
            s: msg.s,
            c: msg.c,
            p: msg.p,
            P: msg.P,
            q: msg.q
          }
        }));
      }
    };

    return () => ws.close();
  }, []);

  const formatCurrency = (val: string | number) => {
    const num = typeof val === 'string' ? parseFloat(val) : val;
    if (isNaN(num)) return '-';
    if (num >= 1000) return num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    if (num >= 1) return num.toLocaleString(undefined, { minimumFractionDigits: 3, maximumFractionDigits: 3 });
    return num.toLocaleString(undefined, { minimumFractionDigits: 4, maximumFractionDigits: 5 });
  };

  const formatVolume = (val: string | number) => {
    const num = typeof val === 'string' ? parseFloat(val) : val;
    if (isNaN(num)) return '-';
    if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
    if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
    if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K';
    return num.toLocaleString(undefined, { maximumFractionDigits: 0 });
  };

  return (
    <section className="flex flex-col gap-4">
      <div className="flex justify-between items-end border-b border-slate-200 pb-2">
        <div className="flex items-center gap-3">
          <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-900">Bitcoin Whale Live Tracker</h3>
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-orange-500/10 border border-orange-500/20">
            <div className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse"></div>
            <span className="text-[9px] font-bold text-orange-500 uppercase tracking-wider">Live</span>
          </div>
        </div>
      </div>
      
      <div className="bg-white shadow-lg border border-slate-200 rounded-xl overflow-hidden relative min-h-[300px]">
        {loading ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center opacity-50 z-10">
            <Activity className="w-8 h-8 animate-spin mb-4 text-orange-500" />
            <span className="text-xs uppercase tracking-widest font-mono">Loading Data...</span>
          </div>
        ) : null}
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="border-b border-slate-200 text-[10px] uppercase tracking-widest opacity-50 bg-slate-50">
                <th className="px-4 py-3 font-bold">Symbol</th>
                <th className="px-4 py-3 font-bold">Name</th>
                <th className="px-4 py-3 font-bold text-right">Last Price</th>
                <th className="px-4 py-3 font-bold text-right">Change</th>
                <th className="px-4 py-3 font-bold text-right">% Change</th>
                <th className="px-4 py-3 font-bold text-right">Volume (24h)</th>
              </tr>
            </thead>
            <tbody>
              {COINS.map((coin, idx) => {
                const coinData = data[coin.id];
                const isPositive = coinData ? parseFloat(coinData.p) >= 0 : true;
                
                return (
                  <motion.tr 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: idx * 0.05 }}
                    key={coin.id} 
                    className="border-b border-slate-100 hover:bg-slate-100 transition-colors group cursor-pointer"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <img 
                          src={getCryptoLogo(coin.symbol) || `https://ui-avatars.com/api/?name=${coin.name.replace(/ /g, '+')}&background=0B0E11&color=fff&rounded=true&font-size=0.4`} 
                          alt={coin.symbol}
                          className="w-5 h-5 rounded-full object-contain"
                        />
                        <span className="text-xs font-bold uppercase tracking-wide text-slate-900">{coin.symbol}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-[11px] opacity-60 uppercase font-bold">{coin.name}</span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      {coinData ? (
                        <span className="font-mono font-bold text-[13px] text-slate-900 tracking-tight">
                          ${formatCurrency(coinData.c)}
                        </span>
                      ) : (
                        <span className="font-mono text-slate-900/40 text-xs">...</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {coinData ? (
                        <span className={`font-mono font-bold text-[12px] tracking-tight ${isPositive ? 'accent-green' : 'accent-red'}`}>
                          {isPositive ? '+' : ''}{formatCurrency(coinData.p)}
                        </span>
                      ) : (
                        <span className="font-mono text-slate-900/40 text-xs">...</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {coinData ? (
                        <span className={`font-mono font-bold text-[12px] tracking-tight px-1.5 py-0.5 rounded bg-slate-50 ${isPositive ? 'accent-green' : 'accent-red'}`}>
                          {isPositive ? '+' : ''}{parseFloat(coinData.P).toFixed(2)}%
                        </span>
                      ) : (
                        <span className="font-mono text-slate-900/40 text-xs">...</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {coinData ? (
                        <span className="font-mono text-[12px] opacity-70 tracking-tight">
                          ${formatVolume(coinData.q)}
                        </span>
                      ) : (
                        <span className="font-mono text-slate-900/40 text-xs">...</span>
                      )}
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
