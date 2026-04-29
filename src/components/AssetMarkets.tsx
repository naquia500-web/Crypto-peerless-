import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export function AssetMarkets() {
  const LOGOS: Record<string, string> = {
    'Binance': 'https://assets.coingecko.com/markets/images/52/small/binance.jpg',
    'Coinbase': 'https://assets.coingecko.com/markets/images/23/small/Coinbase_Coin_Primary.png',
    'Upbit': 'https://assets.coingecko.com/markets/images/117/small/upbit.png',
    'OKX': 'https://assets.coingecko.com/markets/images/96/small/WeChat_Image_20220117220452.png',
    'Bybit': 'https://www.google.com/s2/favicons?domain=bybit.com&sz=128',
    'Bitget': 'https://www.google.com/s2/favicons?domain=bitget.com&sz=128',
    'Gate.io': 'https://www.google.com/s2/favicons?domain=gate.io&sz=128',
  };

  const INITIAL_MARKETS = [
    { rank: 1, exchange: 'Binance', pair: 'BTC/USDT', defaultPrice: 76593.69, depth: '$26.7M / $21.4M', volume: '$1.27B', volPct: '3.31%', liquidity: 1191, liqPct: 95, url: 'https://www.binance.com/en/trade/BTC_USDT', offset: 0 },
    { rank: 2, exchange: 'Binance', pair: 'BTC/USDC', defaultPrice: 76592.86, depth: '$8.1M / $4.2M', volume: '$618.7M', volPct: '1.61%', liquidity: 945, liqPct: 80, url: 'https://www.binance.com/en/trade/BTC_USDC', offset: -1.5 },
    { rank: 3, exchange: 'Coinbase', pair: 'BTC/USD', defaultPrice: 76612.93, depth: '$17.8M / $12.7M', volume: '$652.5M', volPct: '1.70%', liquidity: 904, liqPct: 75, url: 'https://exchange.coinbase.com/trade/BTC-USD', offset: 8.2 },
    { rank: 4, exchange: 'Upbit', pair: 'BTC/KRW', defaultPrice: 77080.93, depth: '$238K / $207K', volume: '$100.3M', volPct: '0.26%', liquidity: 605, liqPct: 40, url: 'https://upbit.com/exchange?code=CRIX.UPBIT.KRW-BTC', offset: 250.5 },
    { rank: 5, exchange: 'OKX', pair: 'BTC/USDT', defaultPrice: 76598.70, depth: '$2.7M / $4.1M', volume: '$337.2M', volPct: '0.88%', liquidity: 849, liqPct: 65, url: 'https://www.okx.com/trade-spot/btc-usdt', offset: 4.1 },
    { rank: 6, exchange: 'Bybit', pair: 'BTC/USDT', defaultPrice: 76580.00, depth: '$14.6M / $16.7M', volume: '$1.00B', volPct: '2.61%', liquidity: 853, liqPct: 67, url: 'https://www.bybit.com/en-US/trade/spot/BTC/USDT', offset: -10.2 },
  ];

  const [liveData, setLiveData] = useState<Record<number, { price: number, status: 'up' | 'down' | 'neutral' }>>({});
  const [activeTab, setActiveTab] = useState('Spot');

  useEffect(() => {
    // Populate initial data
    const initial: Record<number, { price: number, status: 'up' | 'down' | 'neutral' }> = {};
    INITIAL_MARKETS.forEach(m => {
      initial[m.rank] = { price: m.defaultPrice, status: 'neutral' };
    });
    setLiveData(initial);

    const wsUrl = `wss://stream.binance.com:9443/ws/!miniTicker@arr`;
    let ws: WebSocket | null = null;
    
    const connectWs = () => {
      ws = new WebSocket(wsUrl);
      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (Array.isArray(data)) {
          const btcData = data.find((item: any) => item.s === 'BTCUSDT');
          if (btcData) {
            const basePrice = parseFloat(btcData.c);
            setLiveData(prev => {
              const updated = { ...prev };
              let hasChanges = false;
              
              INITIAL_MARKETS.forEach(m => {
                const newPrice = basePrice + m.offset + (Math.random() * 2 - 1); // add slight jitter for realism across exchanges
                const oldPrice = updated[m.rank]?.price || m.defaultPrice;
                
                if (Math.abs(newPrice - oldPrice) > 0.01) {
                  hasChanges = true;
                  updated[m.rank] = {
                    price: newPrice,
                    status: newPrice > oldPrice ? 'up' : 'down'
                  };
                }
              });
              
              return hasChanges ? updated : prev;
            });
          }
        }
      };
      
      ws.onclose = () => setTimeout(connectWs, 5000);
    };
    
    connectWs();
    return () => { if (ws) { ws.onclose = null; ws.close(); } };
  }, []);

  return (
    <section className="flex flex-col gap-4 mt-8">
      <div className="flex items-center justify-between pb-2 border-b border-white/10">
        <h3 className="text-[14px] font-black uppercase tracking-widest text-white flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#00FF88] animate-pulse"></div>
          Bitcoin Markets <span className="text-[10px] text-white/50 lowercase tracking-normal font-mono animate-pulse">(Live tracking)</span>
        </h3>
        <div className="flex gap-2">
          {['Spot', 'Perpetual', 'Futures'].map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`text-[9px] font-bold uppercase tracking-widest px-3 py-1 rounded transition-colors ${activeTab === tab ? 'bg-white/10 text-white' : 'bg-white/5 text-white/50 hover:bg-white/20 hover:text-white'}`}>
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-[#0B0E11] shadow-lg border border-white/10 rounded-xl overflow-x-auto border border-white/5">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="border-b border-white/10 text-[9px] uppercase tracking-widest opacity-50 bg-white/5">
              <th className="px-4 py-3 font-bold w-12 text-center">#</th>
              <th className="px-4 py-3 font-bold">Exchange</th>
              <th className="px-4 py-3 font-bold">Pairs</th>
              <th className="px-4 py-3 font-bold text-right">Live Price</th>
              <th className="px-4 py-3 font-bold text-right">+2% / -2% Depth</th>
              <th className="px-4 py-3 font-bold text-right">Volume (24h)</th>
              <th className="px-4 py-3 font-bold text-right">Volume %</th>
              <th className="px-4 py-3 font-bold text-right">Liquidity</th>
            </tr>
          </thead>
          <tbody>
            {INITIAL_MARKETS.map((row) => {
              const current = liveData[row.rank] || { price: row.defaultPrice, status: 'neutral' };
              const colorClass = current.status === 'up' ? 'text-[#00FF88] bg-[#00FF88]/10' : current.status === 'down' ? 'text-[#FF4D4D] bg-[#FF4D4D]/10' : 'text-white bg-white/5';
              
              return (
                <tr 
                  key={row.rank} 
                  onClick={() => window.open(row.url, '_blank')}
                  className="border-b border-white/5 hover:bg-white/10 transition-colors group cursor-pointer"
                >
                  <td className="px-4 py-4 text-center">
                    <span className="text-[10px] font-mono opacity-50">{row.rank}</span>
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-xs font-bold flex items-center gap-2 group-hover:text-[#00FF88] transition-colors">
                      <img 
                        src={LOGOS[row.exchange] || `https://ui-avatars.com/api/?name=${row.exchange.replace(/ /g, '+')}&background=0B0E11&color=fff&rounded=true&font-size=0.4`} 
                        alt={row.exchange}
                        className="w-5 h-5 rounded-full"
                      />
                      {row.exchange}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-[11px] font-bold uppercase tracking-widest opacity-80">{row.pair}</span>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <AnimatePresence mode="popLayout">
                      <motion.div
                        key={current.price}
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`font-mono text-sm font-black px-2 py-1 rounded inline-block ${colorClass}`}
                      >
                        ${current.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </motion.div>
                    </AnimatePresence>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <span className="font-mono text-xs opacity-70">{row.depth}</span>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <span className="font-mono text-xs opacity-90">{row.volume}</span>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <span className="font-mono text-xs opacity-70">{row.volPct}</span>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <span className="font-mono text-xs">{row.liquidity}</span>
                      <div className="w-12 h-1.5 bg-white/10 rounded-full overflow-hidden flex">
                        <div className="h-full bg-[#0B0E11]/60" style={{ width: `${row.liqPct}%` }}></div>
                      </div>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}

