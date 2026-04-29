import { Info } from 'lucide-react';
import { useState, useEffect } from 'react';

export function MarketCycles() {
  const [puell, setPuell] = useState(0.8344);
  const [dma111, setDma111] = useState(75788);
  const [dma350, setDma350] = useState(194092);
  const [indicators, setIndicators] = useState(0.0);

  useEffect(() => {
    // Simulate high-frequency "live data analysis" per second
    const interval = setInterval(() => {
      setPuell(prev => Math.max(0.1, prev + (Math.random() * 0.002 - 0.001)));
      setDma111(prev => prev + (Math.random() * 10 - 5));
      setDma350(prev => prev + (Math.random() * 20 - 10));
      // Keep indicators fixed mostly but jitter rarely
      if (Math.random() > 0.9) {
         setIndicators(prev => Math.max(0, Math.min(100, prev + (Math.random() * 0.2 - 0.1))));
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="flex flex-col gap-4 mt-6">
      <div className="flex items-center justify-between pb-2 border-b border-white/10">
        <h3 className="text-[14px] font-black uppercase tracking-widest text-white flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#00FF88] animate-pulse"></div>
          Bitcoin Market Cycles <span className="text-[10px] text-white/50 lowercase tracking-normal font-mono animate-pulse">(Live analysis)</span>
        </h3>
        <button className="text-[9px] font-bold uppercase tracking-widest bg-white/5 hover:bg-white/20 px-3 py-1 rounded transition-colors">See More</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Meter 1: Puell Multiple */}
        <div className="bg-[#0B0E11] shadow-lg border border-white/10 p-5 rounded-xl flex flex-col gap-4 relative overflow-hidden group hover:bg-white/5 transition-colors">
          <div className="flex items-center gap-1.5 opacity-70">
            <span className="text-[10px] font-bold uppercase tracking-widest">Puell Multiple Status</span>
            <Info className="w-3 h-3" />
          </div>
          <div className="text-2xl font-mono font-bold">{puell.toFixed(4)}</div>
          
          <div className="mt-2 flex flex-col gap-1.5">
            <div className="flex justify-between text-[9px] uppercase tracking-widest font-bold opacity-50">
              <span>Undervalued</span>
              <span>Overvalued</span>
            </div>
            {/* The Meter */}
            <div className="relative w-full h-1.5 rounded-full bg-white/10 overflow-hidden flex">
              <div className="h-full bg-[#00FF88] w-[30%]"></div>
              <div className="h-full bg-white/20 w-[40%]"></div>
              <div className="h-full bg-[#FF4D4D] w-[30%]"></div>
              {/* Marker */}
              <div 
                className="absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-[#0B0E11] rounded-full shadow-[0_0_10px_rgba(255,255,255,0.8)] border border-white transition-all duration-1000 ease-linear"
                style={{ left: `${Math.min(95, Math.max(5, (puell / 3.0) * 100))}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Meter 2: Pi Cycle */}
        <div className="bg-[#0B0E11] shadow-lg border border-white/10 p-5 rounded-xl flex flex-col gap-4 relative overflow-hidden group hover:bg-white/5 transition-colors">
          <div className="flex items-center gap-1.5 opacity-70">
            <span className="text-[10px] font-bold uppercase tracking-widest">Pi Cycle Top Status</span>
            <Info className="w-3 h-3" />
          </div>
          <div className="flex justify-between items-center mt-1">
            <div className="flex flex-col gap-1">
              <span className="text-[9px] uppercase tracking-widest opacity-50">111DMA</span>
              <span className="font-mono font-bold transition-colors">${dma111.toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 0})}</span>
            </div>
            <div className="flex flex-col items-center justify-center px-3 py-1 bg-white/5 rounded mx-2 border border-white/5">
              <span className="text-[8px] uppercase tracking-widest opacity-50">Status</span>
              <span className="text-[10px] font-bold text-orange-500">Didn't Cross</span>
            </div>
            <div className="flex flex-col gap-1 text-right">
              <span className="text-[9px] uppercase tracking-widest opacity-50">350DMA x2</span>
              <span className="font-mono font-bold transition-colors">${dma350.toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 0})}</span>
            </div>
          </div>
        </div>

        {/* Meter 3: Market Indicators */}
        <div className="bg-[#0B0E11] shadow-lg border border-white/10 p-5 rounded-xl flex flex-col gap-4 relative overflow-hidden group hover:bg-white/5 transition-colors">
          <div className="flex items-center gap-1.5 opacity-70">
            <span className="text-[10px] font-bold uppercase tracking-widest">Cycle Top Indicators</span>
            <Info className="w-3 h-3" />
          </div>
          <div className="flex justify-between items-end">
             <div className="text-2xl font-mono font-bold">{indicators.toFixed(1)}%</div>
             <div className="text-[10px] font-mono opacity-50 uppercase tracking-widest mb-1">Hit: 0/30</div>
          </div>
          
          <div className="mt-2 flex flex-col gap-1.5">
            <div className="flex justify-between text-[9px] uppercase tracking-widest font-bold opacity-50">
              <span>Hold</span>
              <span>Sell</span>
            </div>
            {/* The Meter */}
            <div className="relative w-full h-1.5 rounded-full bg-white/10 overflow-hidden flex">
              <div className="h-full bg-[#00FF88] w-[20%]"></div>
              <div className="h-full bg-[#00FF88]/50 w-[20%]"></div>
              <div className="h-full bg-[#0B0E11]/30 w-[20%]"></div>
              <div className="h-full bg-[#FF4D4D]/50 w-[20%]"></div>
              <div className="h-full bg-[#FF4D4D] w-[20%]"></div>
              {/* Marker */}
              <div 
                className="absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-[#0B0E11] rounded-full shadow-[0_0_10px_rgba(255,255,255,0.8)] border border-white transition-all duration-1000 ease-linear"
                style={{ left: `${Math.min(95, Math.max(5, indicators))}%` }}
              ></div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
