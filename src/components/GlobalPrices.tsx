import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { getCryptoLogo } from '../lib/logos';

interface GlobalPricesProps {
  currentBtcPrice?: number;
}

const INITIAL_TRENDING = [
  { name: 'RaveDAO', symbol: 'RAVE', price: '$1.7096', change: '+137.23%', isUp: true },
  { name: 'Bitcoin', symbol: 'BTC', price: '$76,683.50', change: '+1.92%', isUp: true },
  { name: 'Cardano', symbol: 'ADA', price: '$0.2504', change: '+1.48%', isUp: true },
  { name: 'Polkadot', symbol: 'DOT', price: '$1.2863', change: '+2.40%', isUp: true },
  { name: 'Open Campus', symbol: 'EDU', price: '$0.0561', change: '+23.58%', isUp: true }
];

export function GlobalPrices({ currentBtcPrice = 76683.50 }: GlobalPricesProps) {
  const [pairs, setPairs] = useState([
    { target: 'EUR', name: 'Euro', baseRate: 0.92, currentRate: 0.92, symbol: '€' },
    { target: 'GBP', name: 'Pound Sterling', baseRate: 0.79, currentRate: 0.79, symbol: '£' },
    { target: 'CNY', name: 'Chinese Yuan', baseRate: 7.23, currentRate: 7.23, symbol: '¥' },
    { target: 'CAD', name: 'Canadian Dollar', baseRate: 1.36, currentRate: 1.36, symbol: '$' },
    { target: 'AUD', name: 'Australian Dollar', baseRate: 1.52, currentRate: 1.52, symbol: '$' },
    { target: 'JPY', name: 'Japanese Yen', baseRate: 151.20, currentRate: 151.20, symbol: '¥' },
    { target: 'KRW', name: 'South Korean Won', baseRate: 1350.50, currentRate: 1350.50, symbol: '₩' },
    { target: 'INR', name: 'Indian Rupee', baseRate: 83.20, currentRate: 83.20, symbol: '₹' },
    { target: 'BRL', name: 'Brazilian Real', baseRate: 5.05, currentRate: 5.05, symbol: 'R$' },
    { target: 'ZAR', name: 'South African', baseRate: 18.90, currentRate: 18.90, symbol: 'R' }
  ]);

  const [liveTrending, setLiveTrending] = useState(INITIAL_TRENDING);

  useEffect(() => {
    let isActive = true;
    const interval = setInterval(() => {
      if (!isActive) return;
      
      // Jitter FX rates
      setPairs(prev => prev.map(p => {
        if (Math.random() > 0.5) {
          const drift = p.baseRate * (Math.random() * 0.002 - 0.001);
          return { ...p, currentRate: p.baseRate + drift, flashId: Math.random() };
        }
        return p;
      }));

      // Jitter trending coins
      setLiveTrending(prev => prev.map(item => {
        if (Math.random() > 0.4) {
             const currentPriceNum = item.name === 'Bitcoin' 
                ? currentBtcPrice 
                : parseFloat(item.price.replace(/[^0-9.-]+/g, ''));
             
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
  }, [currentBtcPrice]);

  return (
    <section className="flex flex-col gap-8 mt-8">
      
      {/* Global Prices block */}
      <div className="flex flex-col gap-4">
        <h3 className="text-[14px] font-black uppercase tracking-widest text-white border-b border-white/10 pb-2 flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-[#00FF88] animate-pulse"></div>
          Global Bitcoin Prices <span className="lowercase font-mono text-[8px] animate-pulse opacity-50">(live tracking)</span>
        </h3>
        <div className="flex flex-wrap gap-2">
          {pairs.map((pair: any) => (
            <div key={pair.target} className="flex items-center gap-2 px-3 py-2 bg-white/5 hover:bg-white/20 border border-white/5 rounded transition-colors group cursor-pointer">
              <img 
                src={`https://flagcdn.com/w20/${pair.target === 'EUR' ? 'eu' : pair.target === 'GBP' ? 'gb' : pair.target === 'CNY' ? 'cn' : pair.target === 'CAD' ? 'ca' : pair.target === 'AUD' ? 'au' : pair.target === 'JPY' ? 'jp' : pair.target === 'KRW' ? 'kr' : pair.target === 'INR' ? 'in' : pair.target === 'BRL' ? 'br' : 'za'}.png`} 
                alt={`${pair.target} flag`}
                className="w-4 h-3 rounded-sm object-cover" 
              />
              <span className="text-[10px] font-bold uppercase tracking-widest">BTC/{pair.target}</span>
              <span className="text-[9px] opacity-40 uppercase">{pair.name}</span>
              <AnimatePresence mode="popLayout">
                <motion.span 
                  key={pair.flashId || pair.target}
                  initial={{ opacity: 0.5, y: -2 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-[11px] font-mono font-bold text-[#00FF88] ml-1 bg-[#00FF88]/10 px-1 rounded"
                >
                  {pair.symbol}{(currentBtcPrice * pair.currentRate).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </motion.span>
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>

      {/* Trending Block */}
      <div className="flex flex-col gap-4">
        <h3 className="text-[14px] font-black uppercase tracking-widest text-white border-b border-white/10 pb-2 flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-[#00FF88] animate-pulse"></div>
          Trending <span className="lowercase font-mono text-[8px] animate-pulse opacity-50">(live tracking)</span>
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {liveTrending.map((coin: any) => (
            <div key={coin.name} className="flex flex-col gap-2 p-4 bg-[#0B0E11] shadow-lg border border-white/10 rounded-xl hover:-translate-y-1 transition-transform cursor-pointer">
              <img 
                src={getCryptoLogo(coin.symbol) || `https://ui-avatars.com/api/?name=${coin.name.replace(/ /g, '+')}&background=0B0E11&color=fff&rounded=true&font-size=0.4`} 
                alt={coin.name}
                className="w-6 h-6 rounded-full mb-2 bg-white/10"
              />
              <span className="font-bold text-sm text-white">{coin.name}</span>
              <AnimatePresence mode="popLayout">
                <motion.span 
                  key={coin.flashId || coin.price}
                  initial={{ opacity: 0.5, y: -2 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`font-mono text-xs font-bold px-1 py-0.5 rounded w-fit ${coin.isUp ? 'text-[#00FF88] bg-[#00FF88]/10' : 'text-[#FF4D4D] bg-[#FF4D4D]/10'}`}
                >
                  {coin.price}
                </motion.span>
              </AnimatePresence>
              <span className={`font-mono text-[11px] font-bold ${coin.isUp ? 'text-[#00FF88]' : 'text-[#FF4D4D]'}`}>
                {coin.change}
              </span>
            </div>
          ))}
        </div>
      </div>

    </section>
  );
}
