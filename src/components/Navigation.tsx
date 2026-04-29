import { motion } from "motion/react";
import { Sparkles } from "lucide-react";
import { ApiKeyManager } from "./ApiKeyManager";

export function Navigation({ onOpenAIHouse, onOpenTradingCoach }: { onOpenAIHouse?: () => void, onOpenTradingCoach?: () => void }) {
  const scrollTo = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <nav className="border-b border-white/10 pb-4 sticky top-0 z-50 bg-[#0B0E11]/80 backdrop-blur-md pt-4">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 flex items-center justify-between">
        <div className="flex flex-col flex-1">
          <span className="text-[10px] uppercase tracking-[0.4em] opacity-50 mb-1">Market Intelligence</span>
          <div className="flex items-center gap-4 flex-wrap">
            <h1 className="text-2xl font-black italic tracking-tighter uppercase">Bitwise Navigator</h1>
            
            <div className="hidden sm:block">
              <ApiKeyManager />
            </div>

            <div className="flex gap-2">
              {onOpenAIHouse && (
                <button 
                  onClick={onOpenAIHouse}
                  className="relative overflow-hidden bg-gradient-to-r from-[#00FF88]/20 to-teal-500/20 hover:from-[#00FF88]/30 hover:to-teal-500/30 text-[#00FF88] border border-[#00FF88]/50 px-4 py-1.5 rounded-full text-[11px] tracking-widest font-black uppercase transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(0,255,136,0.2)] hover:shadow-[0_0_25px_rgba(0,255,136,0.4)] transform hover:scale-105"
                >
                  <div className="absolute inset-0 bg-white/5 opacity-0 hover:opacity-100 transition-opacity mix-blend-overlay"></div>
                  <motion.div
                    animate={{ opacity: [1, 0.5, 1], scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className="w-2 h-2 rounded-full bg-[#00FF88] shadow-[0_0_8px_rgba(0,255,136,0.8)]"
                  ></motion.div>
                  <Sparkles className="w-3.5 h-3.5" />
                  Open AI House
                  
                  {/* Ping Indicator to draw attention */}
                  <span className="absolute -top-1 -right-1 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00FF88] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-teal-400"></span>
                  </span>
                </button>
              )}
              {onOpenTradingCoach && (
                <button 
                  onClick={onOpenTradingCoach}
                  className="relative overflow-hidden bg-gradient-to-r from-blue-500/20 to-indigo-500/20 hover:from-blue-500/30 hover:to-indigo-500/30 text-blue-400 border border-blue-500/50 px-4 py-1.5 rounded-full text-[11px] tracking-widest font-black uppercase transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(59,130,246,0.2)] hover:shadow-[0_0_25px_rgba(59,130,246,0.4)] transform hover:scale-105"
                >
                  <div className="absolute inset-0 bg-white/5 opacity-0 hover:opacity-100 transition-opacity mix-blend-overlay"></div>
                  <motion.div
                    animate={{ opacity: [1, 0.5, 1], scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]"
                  ></motion.div>
                  <Sparkles className="w-3.5 h-3.5" />
                  Trading Coach AI
                </button>
              )}
            </div>
          </div>
        </div>
        
        <nav className="hidden xl:flex gap-6 text-[9px] uppercase tracking-widest font-bold opacity-70 flex-wrap justify-end pl-8">
          {[
            { label: 'Market Sentiment Analysis', id: 'section-market-sentiment' },
            { label: 'Live Trading', id: 'section-live-trading' },
            { label: 'Global Market Alerts', id: 'section-global-alerts' },
            { label: 'Support Contact', id: 'section-support' },
            { label: 'Premium Plans', id: 'section-premium' },
            { label: 'Notifications', id: 'section-notifications' }
          ].map(link => (
            <a 
              key={link.id} 
              href={`#${link.id}`} 
              onClick={(e) => scrollTo(e, link.id)}
              className="hover:opacity-100 hover:text-[#00FF88] transition-colors whitespace-nowrap"
            >
              {link.label}
            </a>
          ))}
        </nav>
        
        <div className="flex items-center gap-3">
          <img src="https://cryptologos.cc/logos/bitcoin-btc-logo.svg?v=025" alt="Bitcoin Logo" className="w-8 h-8 rounded-full border border-white/10 shadow-[0_0_10px_rgba(247,147,26,0.2)] object-contain p-1" />
          <span className="text-xs font-mono font-bold opacity-80 hidden md:block">TRDR_992</span>
        </div>
      </div>
    </nav>
  );
}
