import { useState, useEffect } from 'react';
import { Wallet, Plus, ArrowUpRight, ArrowDownRight, RefreshCw, Layers } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getCryptoLogo } from '../lib/logos';

interface PortfolioItem {
  id: string;
  symbol: string;
  name: string;
  amount: number;
  avgBuyPrice: number;
}

const LOCAL_STORAGE_KEY = 'finova_portfolio_data';

// Initial dummy data if no local storage
const DEFAULT_PORTFOLIO: PortfolioItem[] = [
  { id: '1', symbol: 'BTC', name: 'Bitcoin', amount: 0.15, avgBuyPrice: 45000 },
  { id: '2', symbol: 'ETH', name: 'Ethereum', amount: 2.5, avgBuyPrice: 2200 },
  { id: '3', symbol: 'SOL', name: 'Solana', amount: 45, avgBuyPrice: 65 }
];

export function PortfolioTracker() {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [livePrices, setLivePrices] = useState<Record<string, number>>({});
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Load from local storage or defaults
  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      try {
        setItems(JSON.parse(saved));
      } catch (e) {
        setItems(DEFAULT_PORTFOLIO);
      }
    } else {
      setItems(DEFAULT_PORTFOLIO);
    }
  }, []);

  // Save to local storage whenever items change
  useEffect(() => {
    if (items.length > 0) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(items));
    }
  }, [items]);

  // Fetch live prices
  const fetchPrices = async () => {
    setIsRefreshing(true);
    try {
      const symbolsList = items.map(i => `${i.symbol}USDT`).join(',');
      // For simplicity, we'll fetch individual prices or just mock it if Binace API restricts bulk queries
      // We'll iterate over the current typical top coins
      const coinsToFetch = ['BTCUSDT', 'ETHUSDT', 'SOLUSDT', 'BNBUSDT', 'ADAUSDT'];
      const responses = await Promise.all(
        coinsToFetch.map(s => fetch(`https://api.binance.com/api/v3/ticker/price?symbol=${s}`).catch(() => null))
      );
      
      const newPrices: Record<string, number> = {};
      
      for (const res of responses) {
        if (res && res.ok) {
          const data = await res.json();
          const symbol = data.symbol.replace('USDT', '');
          newPrices[symbol] = parseFloat(data.price);
        }
      }

      // Fallbacks in case api fails or coin not found in that list
      newPrices['BTC'] = newPrices['BTC'] || 76500;
      newPrices['ETH'] = newPrices['ETH'] || 2900;
      newPrices['SOL'] = newPrices['SOL'] || 145;
      
      setLivePrices(prev => ({ ...prev, ...newPrices }));
    } catch (e) {
      console.warn("Failed to fetch live prices", e);
    } finally {
      setTimeout(() => setIsRefreshing(false), 500);
    }
  };

  useEffect(() => {
    if (items.length > 0) {
      fetchPrices();
    }
    const int = setInterval(fetchPrices, 30000);
    return () => clearInterval(int);
  }, [items]);

  // Calculations
  const totalValue = items.reduce((sum, item) => sum + (item.amount * (livePrices[item.symbol] || item.avgBuyPrice)), 0);
  const totalCost = items.reduce((sum, item) => sum + (item.amount * item.avgBuyPrice), 0);
  const totalProfit = totalValue - totalCost;
  const profitPercentage = totalCost > 0 ? (totalProfit / totalCost) * 100 : 0;

  return (
    <section className="flex flex-col gap-6 mt-8">
      <div className="flex items-center justify-between pb-2 border-b border-slate-200">
        <h3 className="text-[14px] font-black uppercase tracking-widest text-slate-900 flex items-center gap-2">
          <Wallet className="w-5 h-5 text-teal-400" />
          Hardware Portfolio
        </h3>
        <button 
          onClick={fetchPrices}
          className={`px-3 py-1.5 rounded bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition-colors flex items-center gap-2 text-[10px] uppercase font-bold tracking-widest ${isRefreshing ? 'opacity-50' : ''}`}
        >
          <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin text-teal-400' : ''}`} /> Sync
        </button>
      </div>

      <div className="bg-white shadow-lg border border-slate-200 p-6 rounded-xl flex flex-col gap-6">
        
        {/* Top Summary */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 p-5 rounded-xl border border-slate-100 bg-slate-50">
          <div className="flex flex-col gap-1">
             <span className="text-[10px] uppercase tracking-widest font-bold opacity-50 text-slate-900 flex items-center gap-2">
               <Layers className="w-3 h-3" /> Total Balance
             </span>
             <h2 className="text-3xl font-black text-slate-900 truncate max-w-[200px] md:max-w-md">
               ${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
             </h2>
          </div>
          
          <div className="flex flex-col items-end gap-1">
             <span className="text-[10px] uppercase tracking-widest font-bold opacity-50 text-slate-900">All-Time Pnl</span>
             <div className={`flex items-center gap-1.5 text-lg font-black ${totalProfit >= 0 ? 'text-blue-600' : 'text-red-500'}`}>
               {totalProfit >= 0 ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownRight className="w-5 h-5" />}
               ${Math.abs(totalProfit).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
               <span className="text-sm">({totalProfit >= 0 ? '+' : ''}{profitPercentage.toFixed(2)}%)</span>
             </div>
          </div>
        </div>

        {/* Holdings List */}
        <div className="flex flex-col gap-3">
           <div className="grid grid-cols-4 px-4 py-2 text-[10px] uppercase tracking-widest font-bold text-slate-500 border-b border-slate-100">
             <div className="col-span-1">Asset</div>
             <div className="col-span-1 text-right">Holdings</div>
             <div className="col-span-1 text-right">Price</div>
             <div className="col-span-1 text-right">PnL</div>
           </div>
           
           {items.map(item => {
             const currentPrice = livePrices[item.symbol] || item.avgBuyPrice;
             const value = item.amount * currentPrice;
             const cost = item.amount * item.avgBuyPrice;
             const pnl = value - cost;
             const pnlPercent = cost > 0 ? (pnl / cost) * 100 : 0;
             const isProfitable = pnl >= 0;

             return (
               <div key={item.id} className="grid grid-cols-4 px-4 py-3 bg-slate-50 hover:bg-slate-50 border border-slate-100 rounded-lg items-center transition-colors">
                 <div className="col-span-1 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-black/50 border border-slate-200 flex items-center justify-center font-bold text-xs overflow-hidden">
                      {getCryptoLogo(item.symbol) ? (
                        <img src={getCryptoLogo(item.symbol)!} alt={item.symbol} className="w-5 h-5" />
                      ) : (
                        item.symbol[0]
                      )}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-slate-900 leading-none">{item.symbol}</span>
                      <span className="text-[10px] text-slate-900/40">{item.name}</span>
                    </div>
                 </div>
                 <div className="col-span-1 flex flex-col items-end">
                    <span className="text-sm font-mono text-slate-700 leading-none">{item.amount.toLocaleString()}</span>
                    <span className="text-[10px] font-mono text-slate-900/40">${value.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                 </div>
                 <div className="col-span-1 flex flex-col items-end">
                    <span className="text-sm font-mono text-slate-700 leading-none">${currentPrice.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                 </div>
                 <div className="col-span-1 flex flex-col items-end">
                    <span className={`text-sm font-mono font-bold leading-none ${isProfitable ? 'text-blue-600' : 'text-red-500'}`}>
                      {isProfitable ? '+' : ''}${pnl.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                    </span>
                    <span className={`text-[10px] font-mono ${isProfitable ? 'text-blue-600/70' : 'text-red-500/70'}`}>
                      {pnlPercent.toFixed(2)}%
                    </span>
                 </div>
               </div>
             )
           })}
        </div>

      </div>
    </section>
  );
}
