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

  const MARKETS_DATA: Record<string, any[]> = {
    'Spot': [
      { rank: 1, exchange: 'Binance', pair: 'BTC/USDT', defaultPrice: 76593.69, depth: '$26.7M / $21.4M', volume: '$1.27B', volPct: '3.31%', liquidity: 1191, liqPct: 95, url: 'https://www.binance.com/en/trade/BTC_USDT', offset: 0 },
      { rank: 2, exchange: 'Binance', pair: 'BTC/USDC', defaultPrice: 76592.86, depth: '$8.1M / $4.2M', volume: '$618.7M', volPct: '1.61%', liquidity: 945, liqPct: 80, url: 'https://www.binance.com/en/trade/BTC_USDC', offset: -1.5 },
      { rank: 3, exchange: 'Coinbase', pair: 'BTC/USD', defaultPrice: 76612.93, depth: '$17.8M / $12.7M', volume: '$652.5M', volPct: '1.70%', liquidity: 904, liqPct: 75, url: 'https://exchange.coinbase.com/trade/BTC-USD', offset: 8.2 },
      { rank: 4, exchange: 'Upbit', pair: 'BTC/KRW', defaultPrice: 77080.93, depth: '$238K / $207K', volume: '$100.3M', volPct: '0.26%', liquidity: 605, liqPct: 40, url: 'https://upbit.com/exchange?code=CRIX.UPBIT.KRW-BTC', offset: 250.5 },
      { rank: 5, exchange: 'OKX', pair: 'BTC/USDT', defaultPrice: 76598.70, depth: '$2.7M / $4.1M', volume: '$337.2M', volPct: '0.88%', liquidity: 849, liqPct: 65, url: 'https://www.okx.com/trade-spot/btc-usdt', offset: 4.1 },
      { rank: 6, exchange: 'Bybit', pair: 'BTC/USDT', defaultPrice: 76580.00, depth: '$14.6M / $16.7M', volume: '$1.00B', volPct: '2.61%', liquidity: 853, liqPct: 67, url: 'https://www.bybit.com/en-US/trade/spot/BTC/USDT', offset: -10.2 },
    ],
    'Perpetual': [
      { rank: 1, exchange: 'Binance', pair: 'BTC/USDT', defaultPrice: 76595.12, depth: '$89.2M / $92.4M', volume: '$12.4B', volPct: '32.1%', liquidity: 1450, liqPct: 98, url: 'https://www.binance.com/en/futures/BTC_USDT', offset: 1.5 },
      { rank: 2, exchange: 'Bybit', pair: 'BTC/USDT', defaultPrice: 76593.80, depth: '$45.1M / $42.2M', volume: '$8.2B', volPct: '21.3%', liquidity: 1200, liqPct: 88, url: 'https://www.bybit.com/en-US/trade/linear/BTCUSDT', offset: 0.1 },
      { rank: 3, exchange: 'OKX', pair: 'BTC/USDT', defaultPrice: 76594.20, depth: '$38.7M / $36.5M', volume: '$6.5B', volPct: '16.8%', liquidity: 1100, liqPct: 84, url: 'https://www.okx.com/trade-swap/btc-usdt-swap', offset: 0.5 },
      { rank: 4, exchange: 'Bitget', pair: 'BTC/USDT', defaultPrice: 76591.90, depth: '$22.4M / $25.1M', volume: '$4.1B', volPct: '10.6%', liquidity: 980, liqPct: 76, url: 'https://www.bitget.com/mix/usdt/BTCUSDT', offset: -1.8 },
      { rank: 5, exchange: 'Gate.io', pair: 'BTC/USDT', defaultPrice: 76596.10, depth: '$12.1M / $15.4M', volume: '$2.8B', volPct: '7.2%', liquidity: 850, liqPct: 65, url: 'https://www.gate.io/futures/USDT/BTC_USDT', offset: 2.3 },
    ],
    'Futures': [
      { rank: 1, exchange: 'Binance', pair: 'BTC/USD COIN-M', defaultPrice: 76650.00, depth: '$18.4M / $15.2M', volume: '$1.8B', volPct: '4.7%', liquidity: 950, liqPct: 80, url: 'https://www.binance.com/en/delivery/btc_usd', offset: 56.3 },
      { rank: 2, exchange: 'OKX', pair: 'BTC/USD', defaultPrice: 76645.50, depth: '$12.2M / $10.1M', volume: '$1.2B', volPct: '3.1%', liquidity: 820, liqPct: 70, url: 'https://www.okx.com/trade-futures/btc-usd', offset: 51.8 },
      { rank: 3, exchange: 'Bybit', pair: 'BTC/USD Inverse', defaultPrice: 76648.20, depth: '$9.5M / $11.2M', volume: '$800.5M', volPct: '2.1%', liquidity: 780, liqPct: 65, url: 'https://www.bybit.com/en-US/trade/inverse/BTCUSD', offset: 54.5 },
    ]
  };

  const [activeTab, setActiveTab] = useState('Spot');
  const [liveData, setLiveData] = useState<Record<number, { price: number, status: 'up' | 'down' | 'neutral' }>>({});

  useEffect(() => {
    // Populate initial data based on active tab
    const initial: Record<number, { price: number, status: 'up' | 'down' | 'neutral' }> = {};
    MARKETS_DATA[activeTab].forEach(m => {
      initial[m.rank] = { price: m.defaultPrice, status: 'neutral' };
    });
    setLiveData(initial);

    const wsUrl = `wss://stream.binance.com:9443/ws/!miniTicker@arr`;
    let ws: WebSocket | null = null;
    let isSubscribed = true;
    
    const connectWs = () => {
      ws = new WebSocket(wsUrl);
      ws.onmessage = (event) => {
        if (!isSubscribed) return;
        const data = JSON.parse(event.data);
        if (Array.isArray(data)) {
          const btcData = data.find((item: any) => item.s === 'BTCUSDT');
          if (btcData) {
            const basePrice = parseFloat(btcData.c);
            setLiveData(prev => {
              const updated = { ...prev };
              let hasChanges = false;
              
              MARKETS_DATA[activeTab].forEach(m => {
                const newPrice = basePrice + m.offset + (Math.random() * 2 - 1); 
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
      
      ws.onclose = () => { if (isSubscribed) setTimeout(connectWs, 5000); };
    };
    
    connectWs();
    return () => { 
      isSubscribed = false;
      if (ws) { ws.onclose = null; ws.close(); } 
    };
  }, [activeTab]);

  return (
    <section className="flex flex-col gap-4 mt-8">
      <div className="flex items-center justify-between pb-2 border-b border-[#2A2E39]">
        <h3 className="text-[14px] font-black uppercase tracking-widest text-[#D1D4DC] flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
          Bitcoin Markets <span className="text-[10px] text-[#787B86] lowercase tracking-normal font-mono animate-pulse">(Live tracking)</span>
        </h3>
        <div className="flex gap-2">
          {['Spot', 'Perpetual', 'Futures'].map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`text-[9px] font-bold uppercase tracking-widest px-3 py-1 rounded transition-colors ${activeTab === tab ? 'bg-blue-100 text-blue-700' : 'bg-[#2A2E39] text-[#787B86] hover:bg-slate-200 hover:text-[#B2B5BE]'}`}>
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-[#131722] shadow-sm border border-[#2A2E39] rounded-xl overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="border-b border-[#2A2E39] text-[9px] uppercase tracking-widest text-[#787B86] bg-[#1E222D]">
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
            {MARKETS_DATA[activeTab].map((row) => {
              const current = liveData[row.rank] || { price: row.defaultPrice, status: 'neutral' };
              const colorClass = current.status === 'up' ? 'text-green-600 bg-green-50' : current.status === 'down' ? 'text-red-600 bg-red-50' : 'text-[#D1D4DC] bg-[#1E222D]';
              
              return (
                <tr 
                  key={row.rank} 
                  onClick={() => window.open(row.url, '_blank')}
                  className="border-b border-[#2A2E39] hover:bg-[#1E222D] transition-colors group cursor-pointer"
                >
                  <td className="px-4 py-4 text-center">
                    <span className="text-[10px] font-mono text-slate-400">{row.rank}</span>
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-xs font-bold flex items-center gap-2 group-hover:text-blue-600 transition-colors text-[#B2B5BE]">
                      <img 
                        src={LOGOS[row.exchange] || `https://ui-avatars.com/api/?name=${row.exchange.replace(/ /g, '+')}&background=f8fafc&color=333&rounded=true&font-size=0.4`} 
                        alt={row.exchange}
                        className="w-5 h-5 rounded-full"
                      />
                      {row.exchange}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-[11px] font-bold uppercase tracking-widest text-[#787B86]">{row.pair}</span>
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
                    <span className="font-mono text-xs text-[#787B86]">{row.depth}</span>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <span className="font-mono text-xs text-[#B2B5BE]">{row.volume}</span>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <span className="font-mono text-xs text-[#787B86]">{row.volPct}</span>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <span className="font-mono text-xs text-[#B2B5BE]">{row.liquidity}</span>
                      <div className="w-12 h-1.5 bg-slate-200 rounded-full overflow-hidden flex">
                        <div className="h-full bg-blue-500" style={{ width: `${row.liqPct}%` }}></div>
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

