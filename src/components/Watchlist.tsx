import { motion } from "motion/react";

const MOVERS = [
  { symbol: 'NVDA', name: 'Nvidia Corp.', price: '124.50', change: '+4.2%', isPos: true, url: 'nvidia.com' },
  { symbol: 'TSLA', name: 'Tesla Inc.', price: '198.22', change: '-2.1%', isPos: false, url: 'tesla.com' },
  { symbol: 'AAPL', name: 'Apple Inc.', price: '173.50', change: '+0.8%', isPos: true, url: 'apple.com' },
  { symbol: 'MSTR', name: 'MicroStrategy', price: '1540.30', change: '+12.4%', isPos: true, url: 'microstrategy.com' },
  { symbol: 'COIN', name: 'Coinbase Global', price: '210.15', change: '-5.3%', isPos: false, url: 'coinbase.com' },
];

export function Watchlist() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center px-1">
        <h3 className="text-[11px] font-black uppercase tracking-widest opacity-80">Live Ticker</h3>
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></div>
          <span className="text-[9px] font-mono opacity-50 uppercase">Pulse: ON</span>
        </div>
      </div>
      <div className="flex flex-col gap-5">
        {MOVERS.map((asset, i) => (
          <div key={asset.symbol} className="flex justify-between items-center border-b border-[#2A2E39] pb-3 cursor-pointer hover:bg-[#2A2E39] transition-colors px-2 -mx-2 rounded">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#1E222D] border border-[#2A2E39] flex items-center justify-center overflow-hidden shrink-0">
                <img 
                  src={`https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://${asset.url}&size=64`}
                  alt={asset.name}
                  className="w-5 h-5 object-contain"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                />
              </div>
              <div>
                <p className="text-xs font-bold">{asset.symbol}</p>
                <p className="text-[10px] opacity-40 uppercase">{asset.name}</p>
              </div>
            </div>
            <div className="text-right mt-1">
              <span className="block text-sm font-mono font-bold tracking-tight">${asset.price}</span>
              <span className={`block text-[10px] font-mono mt-0.5 ${asset.isPos ? 'accent-green' : 'accent-red'}`}>
                {asset.change}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
