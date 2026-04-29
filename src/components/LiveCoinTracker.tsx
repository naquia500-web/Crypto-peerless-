import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { getCryptoLogo } from '../lib/logos';

interface CoinConfig {
  symbol: string;
  name: string;
}

const TRACKED_COINS: CoinConfig[] = [
  { symbol: 'BTCUSDT', name: 'Bitcoin' },
  { symbol: 'ETHUSDT', name: 'Ethereum' },
  { symbol: 'SOLUSDT', name: 'Solana' },
  { symbol: 'BNBUSDT', name: 'BNB' },
  { symbol: 'XRPUSDT', name: 'XRP' },
  { symbol: 'ADAUSDT', name: 'Cardano' },
  { symbol: 'DOGEUSDT', name: 'Dogecoin' },
  { symbol: 'AVAXUSDT', name: 'Avalanche' },
];

interface CoinData {
  symbol: string;
  price: number;
  openPrice: number;
  highPrice: number;
  lowPrice: number;
  priceChangePercent: number;
  volume: number;
  status: 'up' | 'down' | 'neutral';
}

export function LiveCoinTracker() {
  const [coinData, setCoinData] = useState<Record<string, CoinData>>({});
  const [loading, setLoading] = useState(true);

  // Fetch initial data once to populate
  useEffect(() => {
    const fetchInitial = async () => {
      try {
        const symbolsStr = JSON.stringify(TRACKED_COINS.map(c => c.symbol));
        const res = await fetch(`https://api.binance.com/api/v3/ticker/24hr?symbols=${encodeURIComponent(symbolsStr)}`);
        const data = await res.json();
        
        const initialData: Record<string, CoinData> = {};
        if (Array.isArray(data)) {
          data.forEach((item: any) => {
            initialData[item.symbol] = {
              symbol: item.symbol,
              price: parseFloat(item.lastPrice),
              openPrice: parseFloat(item.openPrice),
              highPrice: parseFloat(item.highPrice),
              lowPrice: parseFloat(item.lowPrice),
              priceChangePercent: parseFloat(item.priceChangePercent),
              volume: parseFloat(item.quoteVolume),
              status: parseFloat(item.priceChangePercent) >= 0 ? 'up' : 'down'
            };
          });
        }
        setCoinData(initialData);
        setLoading(false);
      } catch (err) {
        console.warn("Failed to fetch initial coin data");
      }
    };
    
    fetchInitial();
  }, []);

  // Set up WebSocket for light-weight real-time price updates (1s frequency)
  useEffect(() => {
    if (loading) return; // Wait until initial data is loaded
    
    const wsUrl = `wss://stream.binance.com:9443/ws/!miniTicker@arr`;
    let ws: WebSocket | null = null;
    
    const connectWs = () => {
      ws = new WebSocket(wsUrl);
      
      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (Array.isArray(data)) {
          setCoinData(prev => {
            const updated = { ...prev };
            let hasChanges = false;
            
            data.forEach((item: any) => {
              const symbol = item.s;
              if (updated[symbol]) {
                const newPrice = parseFloat(item.c);
                const oldPrice = updated[symbol].price;
                
                if (newPrice !== oldPrice) {
                  hasChanges = true;
                  updated[symbol] = {
                    ...updated[symbol],
                    price: newPrice,
                    status: newPrice > oldPrice ? 'up' : (newPrice < oldPrice ? 'down' : updated[symbol].status)
                  };
                }
              }
            });
            
            return hasChanges ? updated : prev;
          });
        }
      };
      
      ws.onerror = () => {
        console.warn("Live ticker websocket error");
      };
      
      ws.onclose = () => {
        // Attempt reconnect after 5s
        setTimeout(connectWs, 5000);
      };
    };
    
    connectWs();
    
    return () => {
      if (ws) {
        ws.onclose = null;
        ws.close();
      }
    };
  }, [loading]);

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-pulse">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="h-24 bg-white/5 rounded-lg border border-white/5"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
      {TRACKED_COINS.map(coin => {
        const data = coinData[coin.symbol];
        if (!data) return null;
        
        const isUp = data.priceChangePercent >= 0;
        const colorClass = isUp ? 'text-[#00FF88]' : 'text-[#FF4D4D]';
        const bgClass = isUp ? 'bg-[#00FF88]/5 border-[#00FF88]/20' : 'bg-[#FF4D4D]/5 border-[#FF4D4D]/20';
        const baseSymbol = coin.symbol.replace('USDT', '');
        
        return (
          <div key={coin.symbol} className={`p-4 rounded-xl border ${bgClass} flex flex-col justify-between transition-colors relative overflow-hidden group hover:bg-white/5`}>
            <div className="flex justify-between items-start mb-2 relative z-10">
              <div className="flex items-center gap-2">
                <img src={getCryptoLogo(baseSymbol) || `https://ui-avatars.com/api/?name=${coin.name.replace(/ /g, '+')}&background=0B0E11&color=fff&rounded=true&font-size=0.4`} alt={baseSymbol} className="w-5 h-5 object-contain" />
                <div className="flex flex-col">
                  <span className="text-white font-bold text-sm tracking-wide">{coin.name}</span>
                  <span className="text-white/40 text-[10px] font-mono tracking-widest">{baseSymbol}</span>
                </div>
              </div>
              <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-black/40 ${colorClass}`}>
                {isUp ? '+' : ''}{data.priceChangePercent.toFixed(2)}%
              </span>
            </div>
            
            <div className="flex justify-between items-end relative z-10">
              <div className="flex flex-col">
                <AnimatePresence mode="popLayout">
                  <motion.span
                    key={data.price}
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`font-mono text-lg font-black tracking-tight ${data.status === 'up' ? 'text-[#00FF88]' : data.status === 'down' ? 'text-[#FF4D4D]' : 'text-white'}`}
                  >
                    ${data.price.toLocaleString(undefined, { minimumFractionDigits: data.price < 2 ? 4 : 2, maximumFractionDigits: data.price < 2 ? 4 : 2 })}
                  </motion.span>
                </AnimatePresence>
              </div>
              <div className="flex flex-col items-end">
                 <span className="text-[9px] text-white/30 uppercase tracking-widest font-mono">24h Vol</span>
                 <span className="text-[10px] text-white/50 font-mono">${(data.volume / 1000000).toFixed(1)}M</span>
              </div>
            </div>
            
            {/* Background decorative elements */}
            <div className={`absolute -right-4 -bottom-4 w-16 h-16 rounded-full blur-xl opacity-20 ${isUp ? 'bg-[#00FF88]' : 'bg-[#FF4D4D]'} group-hover:opacity-40 transition-opacity`}></div>
          </div>
        );
      })}
    </div>
  );
}
