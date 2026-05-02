import { useEffect, useState } from 'react';

interface TickerData {
  symbol: string;
  price: string;
  changePercent: string;
}

const INITIAL_SYMBOLS = [
  { symbol: 'BTCUSDT', name: 'Bitcoin' },
  { symbol: 'ETHUSDT', name: 'Ethereum' },
  { symbol: 'SOLUSDT', name: 'Solana' },
  { symbol: 'BNBUSDT', name: 'BNB' },
  { symbol: 'XRPUSDT', name: 'XRP' },
];

export function MarketMarquee() {
  const [tickers, setTickers] = useState<Record<string, TickerData>>({});

  useEffect(() => {
    // We only connect to a few streams to keep it lightweight
    const streams = INITIAL_SYMBOLS.map(s => `${s.symbol.toLowerCase()}@ticker`).join('/');
    const ws = new WebSocket(`wss://stream.binance.com:9443/ws/${streams}`);

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.s && data.c && data.P) {
        setTickers(prev => ({
          ...prev,
          [data.s]: {
            symbol: data.s,
            price: parseFloat(data.c).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
            changePercent: parseFloat(data.P).toFixed(2),
          }
        }));
      }
    };

    return () => ws.close();
  }, []);

  return (
    <div className="border-b border-[#2A2E39] bg-[#131722] overflow-hidden whitespace-nowrap h-12 flex items-center">
      <div className="animate-marquee inline-flex gap-8 px-4" style={{ animation: 'marquee 30s linear infinite' }}>
        {[...INITIAL_SYMBOLS, ...INITIAL_SYMBOLS].map((asset, i) => {
          const data = tickers[asset.symbol];
          const isPositive = data ? parseFloat(data.changePercent) >= 0 : true;
          
          return (
            <div key={`${asset.symbol}-${i}`} className="inline-flex items-center gap-3 text-sm">
              <span className="text-xs font-bold uppercase tracking-widest text-[#787B86]">{asset.name}</span>
              {data ? (
                <>
                  <span className="data-value text-white font-mono font-bold">${data.price}</span>
                  <span className={`inline-flex items-center text-[10px] font-mono font-bold ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                    {isPositive ? '+' : ''}{parseFloat(data.changePercent).toFixed(2)}%
                  </span>
                </>
              ) : (
                <span className="text-slate-400 font-mono text-xs animate-pulse">Loading...</span>
              )}
            </div>
          );
        })}
      </div>
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
