import { Info } from "lucide-react";
import { useState, useEffect } from "react";

export function MarketCycles() {
  const [puell, setPuell] = useState(0.8344);
  const [dma111, setDma111] = useState(75788);
  const [dma350, setDma350] = useState(194092);
  const [indicators, setIndicators] = useState(0.0);

  useEffect(() => {
    // Simulate high-frequency "live data analysis" per second
    const interval = setInterval(() => {
      setPuell((prev) => Math.max(0.1, prev + (Math.random() * 0.002 - 0.001)));
      setDma111((prev) => prev + (Math.random() * 10 - 5));
      setDma350((prev) => prev + (Math.random() * 20 - 10));
      // Keep indicators fixed mostly but jitter rarely
      if (Math.random() > 0.9) {
        setIndicators((prev) =>
          Math.max(0, Math.min(100, prev + (Math.random() * 0.2 - 0.1))),
        );
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="flex flex-col gap-4 mt-6">
      <div className="flex items-center justify-between pb-2 border-b border-[#2A2E39]">
        <h3 className="text-[14px] font-black uppercase tracking-widest text-[#D1D4DC] flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
          Bitcoin Market Cycles{" "}
          <span className="text-[10px] text-[#787B86] lowercase tracking-normal font-mono animate-pulse">
            (Live analysis)
          </span>
        </h3>
        <button className="text-[9px] font-bold uppercase tracking-widest bg-[#2A2E39] text-[#787B86] hover:text-[#B2B5BE] hover:bg-slate-200 px-3 py-1 rounded transition-colors">
          See More
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Meter 1: Puell Multiple */}
        <div className="bg-[#131722] shadow-sm border border-[#2A2E39] p-5 rounded-xl flex flex-col gap-4 relative overflow-hidden group hover:bg-[#1E222D] transition-colors">
          <div className="flex items-center gap-1.5 text-[#787B86]">
            <span className="text-[10px] font-bold uppercase tracking-widest">
              Puell Multiple Status
            </span>
            <Info className="w-3 h-3" />
          </div>
          <div className="text-2xl font-mono font-bold text-[#D1D4DC]">
            {puell.toFixed(4)}
          </div>

          <div className="mt-2 flex flex-col gap-1.5">
            <div className="flex justify-between text-[9px] uppercase tracking-widest font-bold text-slate-400">
              <span>Undervalued</span>
              <span>Overvalued</span>
            </div>
            {/* The Meter */}
            <div className="relative w-full h-1.5 rounded-full bg-[#2A2E39] overflow-hidden flex">
              <div className="h-full bg-green-500 w-[30%]"></div>
              <div className="h-full bg-slate-300 w-[40%]"></div>
              <div className="h-full bg-red-500 w-[30%]"></div>
              {/* Marker */}
              <div
                className="absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-[#131722] rounded-full shadow-md border border-[#363A45] transition-all duration-1000 ease-linear"
                style={{
                  left: `${Math.min(95, Math.max(5, (puell / 3.0) * 100))}%`,
                }}
              ></div>
            </div>
          </div>
        </div>

        {/* Meter 2: Pi Cycle */}
        <div className="bg-[#131722] shadow-sm border border-[#2A2E39] p-5 rounded-xl flex flex-col gap-4 relative overflow-hidden group hover:bg-[#1E222D] transition-colors">
          <div className="flex items-center gap-1.5 text-[#787B86]">
            <span className="text-[10px] font-bold uppercase tracking-widest">
              Pi Cycle Top Status
            </span>
            <Info className="w-3 h-3" />
          </div>
          <div className="flex justify-between items-center mt-1">
            <div className="flex flex-col gap-1">
              <span className="text-[9px] uppercase tracking-widest text-slate-400">
                111DMA
              </span>
              <span className="font-mono font-bold text-[#D1D4DC] transition-colors">
                $
                {dma111.toLocaleString(undefined, {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                })}
              </span>
            </div>
            <div className="flex flex-col items-center justify-center px-3 py-1 bg-[#2A2E39] rounded mx-2 border border-[#2A2E39]">
              <span className="text-[8px] uppercase tracking-widest text-slate-400">
                Status
              </span>
              <span className="text-[10px] font-bold text-orange-500">
                Didn't Cross
              </span>
            </div>
            <div className="flex flex-col gap-1 text-right">
              <span className="text-[9px] uppercase tracking-widest text-slate-400">
                350DMA x2
              </span>
              <span className="font-mono font-bold text-[#D1D4DC] transition-colors">
                $
                {dma350.toLocaleString(undefined, {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                })}
              </span>
            </div>
          </div>
        </div>

        {/* Meter 3: Market Indicators */}
        <div className="bg-[#131722] shadow-sm border border-[#2A2E39] p-5 rounded-xl flex flex-col gap-4 relative overflow-hidden group hover:bg-[#1E222D] transition-colors">
          <div className="flex items-center gap-1.5 text-[#787B86]">
            <span className="text-[10px] font-bold uppercase tracking-widest">
              Cycle Top Indicators
            </span>
            <Info className="w-3 h-3" />
          </div>
          <div className="flex justify-between items-end">
            <div className="text-2xl font-mono font-bold text-[#D1D4DC]">
              {indicators.toFixed(1)}%
            </div>
            <div className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1">
              Hit: 0/30
            </div>
          </div>

          <div className="mt-2 flex flex-col gap-1.5">
            <div className="flex justify-between text-[9px] uppercase tracking-widest font-bold text-slate-400">
              <span>Hold</span>
              <span>Sell</span>
            </div>
            {/* The Meter */}
            <div className="relative w-full h-1.5 rounded-full bg-[#2A2E39] overflow-hidden flex">
              <div className="h-full bg-green-500 w-[20%]"></div>
              <div className="h-full bg-green-300 w-[20%]"></div>
              <div className="h-full bg-slate-200 w-[20%]"></div>
              <div className="h-full bg-red-300 w-[20%]"></div>
              <div className="h-full bg-red-500 w-[20%]"></div>
              {/* Marker */}
              <div
                className="absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-[#131722] rounded-full shadow-md border border-[#363A45] transition-all duration-1000 ease-linear"
                style={{ left: `${Math.min(95, Math.max(5, indicators))}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
