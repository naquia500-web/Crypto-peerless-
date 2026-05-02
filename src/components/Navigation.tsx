import { motion } from "motion/react";
import { Sparkles, ShieldCheck, Globe } from "lucide-react";

export function Navigation() {
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
    <nav className="border-b border-[#2A2E39] sticky top-0 z-50 bg-[#131722]/90 backdrop-blur-xl pt-4 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 flex items-center justify-between pb-4">
        <div className="flex flex-col flex-1">
          <span className="text-[10px] uppercase tracking-[0.4em] text-blue-500 font-extrabold mb-1 flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> Professional Analytics Platform
          </span>
          <div className="flex items-center gap-4 flex-wrap">
            <h1 className="text-2xl font-black italic tracking-tighter uppercase text-white drop-shadow-sm flex items-center gap-2">
              <div className="w-6 h-6 bg-blue-600 rounded-md flex items-center justify-center transform -skew-x-12">
                <span className="text-white text-xs non-italic font-black">B</span>
              </div>
              bitwise-tech
            </h1>
          </div>
        </div>
        
        <nav className="hidden xl:flex gap-6 text-[9px] uppercase tracking-widest font-bold text-[#787B86] flex-wrap justify-end pl-8">
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
          <div className="hidden lg:flex items-center gap-2 cursor-pointer hover:bg-[#2A2E39] px-2 py-1 rounded text-gray-400 hover:text-white transition-colors mr-2">
             <Globe className="w-4 h-4" />
             <span className="text-xs font-bold uppercase">EN / HI</span>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 px-2 py-1 bg-green-500/10 border border-green-500/20 rounded-md text-green-500 mr-2">
            <ShieldCheck className="w-3 h-3" />
            <span className="text-[9px] font-bold tracking-wider uppercase">SSL Secured</span>
          </div>
          <img src="https://cryptologos.cc/logos/bitcoin-btc-logo.svg?v=025" alt="Bitcoin Logo" className="w-8 h-8 rounded-full border border-[#2A2E39] shadow-sm object-contain p-1" />
          <span className="text-xs font-mono font-bold text-[#B2B5BE] hidden md:block">TRDR_992</span>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      <div className="xl:hidden w-full overflow-x-auto no-scrollbar border-t border-[#2A2E39] bg-[#131722]/50">
        <div className="flex gap-6 px-4 py-3 text-[10px] uppercase tracking-widest font-bold text-[#787B86] whitespace-nowrap w-max mx-auto sm:mx-0">
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
