import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const ASSETS = [
  { name: 'Gold', ticker: 'GOLD', price: '$4,783.95', change: '+0.03%', isUp: true, logo: 'https://ui-avatars.com/api/?name=Gold&background=EAB308&color=fff&rounded=true' },
  { name: 'Nvidia Corp', ticker: 'NVDA', price: '$201.98', change: '-0.04%', isUp: false, logo: 'https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://nvidia.com&size=64' },
  { name: 'Silver', ticker: 'SILVER', price: '$78.98', change: '-0.07%', isUp: false, logo: 'https://ui-avatars.com/api/?name=Silver&background=94A3B8&color=fff&rounded=true' },
  { name: 'Alphabet Inc', ticker: 'GOOGL', price: '$338.77', change: '+0.40%', isUp: true, logo: 'https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://abc.xyz&size=64' },
  { name: 'Apple Inc.', ticker: 'AAPL', price: '$272.19', change: '-0.31%', isUp: false, logo: 'https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://apple.com&size=64' },
  { name: 'Microsoft Corp', ticker: 'MSFT', price: '$419.80', change: '-0.42%', isUp: false, logo: 'https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://microsoft.com&size=64' },
  { name: 'Amazon.com', ticker: 'AMZN', price: '$254.96', change: '-2.69%', isUp: false, logo: 'https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://amazon.com&size=64' },
  { name: 'Taiwan Semi', ticker: 'TSM', price: '$369.28', change: '+0.83%', isUp: true, logo: 'https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://tsmc.com&size=64' },
  { name: 'Broadcom Inc', ticker: 'AVGO', price: '$398.89', change: '-0.18%', isUp: false, logo: 'https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://broadcom.com&size=64' },
  { name: 'Meta Platforms', ticker: 'META', price: '$675.31', change: '+0.66%', isUp: true, logo: 'https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://meta.com&size=64' },
  { name: 'Tesla, Inc.', ticker: 'TSLA', price: '$394.76', change: '+0.58%', isUp: true, logo: 'https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://tesla.com&size=64' },
  { name: 'Walmart Inc', ticker: 'WMT', price: '$128.12', change: '-0.16%', isUp: false, logo: 'https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://walmart.com&size=64' },
  { name: 'Berkshire', ticker: 'BRK.B', price: '$473.27', change: '+0.25%', isUp: true, logo: 'https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://berkshirehathaway.com&size=64' }
];

const CRYPTOS = [
  { name: 'Phoenix', ticker: 'PHNIX', price: '$0.000023', change: '+13.11%', isUp: true },
  { name: 'Bull', ticker: 'BULL', price: '$0.005701', change: '+16.51%', isUp: true },
  { name: 'Alien Green', ticker: 'AGC', price: '$0.004956', change: '-21.35%', isUp: false },
  { name: 'XRP', ticker: 'XRP', price: '$1.44', change: '-1.04%', isUp: false },
  { name: 'RaveDAO', ticker: 'RAVE', price: '$1.63', change: '+142.65%', isUp: true },
  { name: 'Ethereum', ticker: 'ETH', price: '$2,327.36', change: '-0.42%', isUp: false },
  { name: 'Solana', ticker: 'SOL', price: '$85.93', change: '-0.41%', isUp: false },
  { name: 'Dogecoin', ticker: 'DOGE', price: '$0.09562', change: '-0.76%', isUp: false },
  { name: 'Cardano', ticker: 'ADA', price: '$0.2505', change: '-0.89%', isUp: false },
  { name: 'Shiba Inu', ticker: 'SHIB', price: '$0.0000061', change: '-1.14%', isUp: false },
  { name: 'Pepe', ticker: 'PEPE', price: '$0.0000038', change: '-0.82%', isUp: false }
];

function DensityBlock({ title, items, isCrypto }: { title: string, items: any[], isCrypto?: boolean }) {
  const [liveItems, setLiveItems] = useState(items);

  useEffect(() => {
    let isActive = true;
    const interval = setInterval(() => {
      if (!isActive) return;
      setLiveItems(prev => prev.map(item => {
        if (Math.random() > 0.4) {
             const currentPriceNum = parseFloat(item.price.replace(/[^0-9.-]+/g, ''));
             // jitter by up to 0.1%
             const changeAmt = currentPriceNum * (Math.random() * 0.002 - 0.001);
             const newPriceNum = Math.max(0, currentPriceNum + changeAmt);
             
             let currentChangeNum = parseFloat(item.change.replace(/[^0-9.-]+/g, ''));
             currentChangeNum = currentChangeNum + (Math.random() * 0.1 - 0.05);

             const priceStr = newPriceNum < 0.01 
                ? `$${newPriceNum.toFixed(6)}` 
                : newPriceNum < 1 ? `$${newPriceNum.toFixed(4)}` : `$${newPriceNum.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

             return {
                 ...item,
                 price: priceStr,
                 change: `${currentChangeNum > 0 ? '+' : ''}${currentChangeNum.toFixed(2)}%`,
                 isUp: changeAmt >= 0,
                 flashId: Math.random() // Unique ID to trigger animations
             };
        }
        return item;
      }));
    }, 1000);
    return () => {
      isActive = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-[14px] font-black uppercase tracking-widest text-white border-b border-white/10 pb-2 flex items-center gap-2">
         <div className="w-1.5 h-1.5 rounded-full bg-[#00FF88] animate-pulse"></div>
         {title} <span className="lowercase font-mono text-[8px] animate-pulse opacity-50">(live tracking)</span>
      </h3>
      <div className="flex flex-wrap gap-2">
        {liveItems.map((item, idx) => (
          <div key={idx} className="flex items-center gap-2 px-3 py-1.5 bg-[#0B0E11] shadow-lg border border-white/10 rounded-full hover:bg-white/20 transition-colors cursor-pointer group">
            <img 
              src={isCrypto ? `https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/svg/color/${item.ticker.toLowerCase()}.svg` : item.logo} 
              alt={item.ticker}
              className="w-3.5 h-3.5 rounded-full"
              onError={(e) => {
                (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${item.name.replace(/ /g, '+')}&background=0B0E11&color=fff&rounded=true&font-size=0.4`;
              }}
            />
            <span className="text-[10px] font-bold text-white/60 group-hover:text-white transition-colors uppercase tracking-wide">{item.name}</span>
            <span className="text-[9px] font-bold opacity-40 uppercase">{item.ticker}</span>
            <AnimatePresence mode="popLayout">
              <motion.span 
                key={item.flashId || item.price}
                initial={{ opacity: 0.5, y: -2 }}
                animate={{ opacity: 1, y: 0 }}
                className={`text-[10px] font-mono font-bold px-1 rounded ${item.isUp ? 'text-[#00FF88] bg-[#00FF88]/10' : 'text-[#FF4D4D] bg-[#FF4D4D]/10'}`}
              >
                {item.price}
              </motion.span>
            </AnimatePresence>
            <span className={`text-[10px] font-mono font-bold ${item.isUp ? 'text-[#00FF88]' : 'text-[#FF4D4D]'}`}>
              {item.change}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function AssetDensity() {
  return (
    <section className="flex flex-col gap-8 mt-8">
      <DensityBlock title="Popular Real World Assets" items={ASSETS} isCrypto={false} />
      <DensityBlock title="Most Visited Cryptocurrencies" items={CRYPTOS} isCrypto={true} />
    </section>
  );
}
