import { motion } from "motion/react";
import { Sparkles } from "lucide-react";
import { ApiKeyManager } from "./ApiKeyManager";

export function Navigation({ onOpenAIHouse, onOpenTradingCoach }: { onOpenAIHouse?: () => void, onOpenTradingCoach?: () => void }) {
  const scrollTo = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      const headerOffset = 130;
      const elementPosition = el.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <nav className="border-b border-slate-200 sticky top-0 z-50 bg-white/80 backdrop-blur-md pt-4">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 flex items-center justify-between pb-4">
        <div className="flex flex-col flex-1">
          <span className="text-[10px] uppercase tracking-[0.4em] text-slate-500 mb-1">Market Intelligence</span>
          <div className="flex items-center gap-4 flex-wrap">
            <h1 className="text-2xl font-black italic tracking-tighter uppercase text-slate-900">bitwise-tech</h1>
            
            <div className="hidden sm:block">
              <ApiKeyManager />
            </div>

            <div className="flex gap-2">
              {onOpenAIHouse && (
                <button 
                  onClick={onOpenAIHouse}
                  className="relative overflow-hidden bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 text-blue-600 border border-blue-200 px-4 py-1.5 rounded-full text-[11px] tracking-widest font-black uppercase transition-all flex items-center gap-2 shadow-sm transform hover:scale-105"
                >
                  <motion.div
                    animate={{ opacity: [1, 0.5, 1], scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className="w-2 h-2 rounded-full bg-blue-600"
                  ></motion.div>
                  <Sparkles className="w-3.5 h-3.5" />
                  Open AI House
                  
                  {/* Ping Indicator to draw attention */}
                  <span className="absolute -top-1 -right-1 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
                  </span>
                </button>
              )}
              {onOpenTradingCoach && (
                <button 
                  onClick={onOpenTradingCoach}
                  className="relative overflow-hidden bg-gradient-to-r from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 text-purple-600 border border-purple-200 px-4 py-1.5 rounded-full text-[11px] tracking-widest font-black uppercase transition-all flex items-center gap-2 shadow-sm transform hover:scale-105"
                >
                  <motion.div
                    animate={{ opacity: [1, 0.5, 1], scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className="w-2 h-2 rounded-full bg-purple-600"
                  ></motion.div>
                  <Sparkles className="w-3.5 h-3.5" />
                  Trading Coach AI
                </button>
              )}
            </div>
          </div>
        </div>
        
        <nav className="hidden xl:flex gap-6 text-[9px] uppercase tracking-widest font-bold text-slate-500 flex-wrap justify-end pl-8">
          {[
            { label: 'Overview', id: 'section-overview' },
            { label: 'Global Markets', id: 'section-global-market' },
            { label: 'Watchlist', id: 'section-watchlist' },
            { label: 'About', id: 'section-about' },
            { label: 'News', id: 'section-news' },
            { label: 'Sentiment', id: 'section-market-sentiment' },
            { label: 'Insights', id: 'section-insights' },
            { label: 'Learn', id: 'section-masterclass' },
            { label: 'Support', id: 'section-support' }
          ].map(link => (
            <a 
              key={link.id} 
              href={`#${link.id}`} 
              onClick={(e) => scrollTo(e, link.id)}
              className="hover:text-blue-600 transition-colors whitespace-nowrap"
            >
              {link.label}
            </a>
          ))}
        </nav>
        
        <div className="flex items-center gap-3 xl:ml-8">
          <img src="https://cryptologos.cc/logos/bitcoin-btc-logo.svg?v=025" alt="Bitcoin Logo" className="w-8 h-8 rounded-full border border-slate-200 shadow-sm object-contain p-1" />
          <span className="text-xs font-mono font-bold text-slate-700 hidden md:block">TRDR_992</span>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      <div className="xl:hidden w-full overflow-x-auto no-scrollbar border-t border-slate-100 bg-white/50">
        <div className="flex gap-6 px-4 py-3 text-[10px] uppercase tracking-widest font-bold text-slate-500 whitespace-nowrap w-max mx-auto sm:mx-0">
          {[
            { label: 'Overview', id: 'section-overview' },
            { label: 'Global Markets', id: 'section-global-market' },
            { label: 'Watchlist', id: 'section-watchlist' },
            { label: 'About', id: 'section-about' },
            { label: 'News', id: 'section-news' },
            { label: 'Sentiment', id: 'section-market-sentiment' },
            { label: 'Insights', id: 'section-insights' },
            { label: 'Learn', id: 'section-masterclass' },
            { label: 'Support', id: 'section-support' }
          ].map(link => (
            <a 
              key={'mobile-'+link.id} 
              href={`#${link.id}`} 
              onClick={(e) => scrollTo(e, link.id)}
              className="hover:text-blue-600 transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}
