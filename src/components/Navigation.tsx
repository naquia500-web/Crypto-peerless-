import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, ShieldCheck, Globe, Moon, Sun, Menu, X, ChevronRight, User, Settings, Bell, Search, Star, PieChart } from "lucide-react";

export function Navigation() {
  const [isLight, setIsLight] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (isLight) {
      document.documentElement.classList.add('theme-light');
    } else {
      document.documentElement.classList.remove('theme-light');
    }
  }, [isLight]);

  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const scrollTo = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    setIsMobileMenuOpen(false); // Close mobile menu if open
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
          <button 
            onClick={() => setIsLight(!isLight)}
            className="hidden sm:flex items-center justify-center w-8 h-8 rounded-lg bg-[#2A2E39] hover:bg-[#363A45] text-gray-400 hover:text-white transition-colors border border-[#363A45]"
            title="Toggle Light/Dark Theme"
          >
            {isLight ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </button>
          <div className="hidden lg:flex items-center gap-2 cursor-pointer hover:bg-[#2A2E39] px-2 py-1 rounded text-gray-400 hover:text-white transition-colors mr-2">
             <Globe className="w-4 h-4" />
             <span className="text-xs font-bold uppercase">EN / HI</span>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 px-2 py-1 bg-green-500/10 border border-green-500/20 rounded-md text-green-500 mr-2">
            <ShieldCheck className="w-3 h-3" />
            <span className="text-[9px] font-bold tracking-wider uppercase">SSL Secured</span>
          </div>
          <img src="https://cryptologos.cc/logos/bitcoin-btc-logo.svg?v=025" alt="Bitcoin Logo" className="w-8 h-8 rounded-full border border-[#2A2E39] shadow-sm object-contain p-1 hidden sm:block" />
          <span className="text-xs font-mono font-bold text-[#B2B5BE] hidden md:block">TRDR_992</span>
          
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="xl:hidden flex items-center justify-center w-8 h-8 rounded-lg bg-[#2A2E39] text-gray-400 border border-[#363A45]"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>
      
      {/* Mobile Sub-Navigation */}
      <div className="xl:hidden w-full overflow-x-auto no-scrollbar border-t border-[#2A2E39] bg-[#131722]">
        <div className="flex gap-6 px-4 py-3 text-sm font-bold text-[#B2B5BE] whitespace-nowrap w-max sm:mx-0">
          {[
            { label: 'Overview', id: 'section-overview' },
            { label: 'Markets', id: 'section-global-market' },
            { label: 'News', id: 'section-news' },
            { label: 'Community', id: 'section-support' },
            { label: 'Insights', id: 'section-insights' },
            { label: 'Watchlist', id: 'section-watchlist' },
            { label: 'Learn', id: 'section-masterclass' },
            { label: 'About', id: 'section-about' }
          ].map(link => (
            <a 
              key={'subnav-'+link.id} 
              href={`#${link.id}`} 
              onClick={(e) => scrollTo(e, link.id)}
              className="hover:text-blue-500 transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
      
      {/* Mobile Navigation Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[100] bg-[#131722] flex flex-col overflow-y-auto"
          >
            <div className="flex items-center justify-between p-4 border-b border-[#2A2E39]">
              <div className="flex items-center gap-2">
                 <div className="w-7 h-7 bg-blue-600 rounded-md flex items-center justify-center transform -skew-x-12">
                  <span className="text-white text-xs non-italic font-black">B</span>
                 </div>
                 <span className="font-extrabold italic text-lg uppercase tracking-tighter text-white">bitwise-tech</span>
              </div>
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-4 flex flex-col gap-5">
              {/* Account Actions */}
              <div className="flex flex-col gap-3">
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors">
                  Create an account
                </button>
                <button className="w-full bg-[#1E222D] border border-[#2A2E39] text-white font-bold py-3 rounded-lg transition-colors">
                  Log in
                </button>
              </div>

              {/* Toggles */}
              <div className="grid grid-cols-2 gap-3 mt-2">
                <div className="bg-[#1E222D] border border-[#2A2E39] rounded-lg p-2 flex items-center justify-between cursor-pointer">
                  <span className="text-sm font-bold text-gray-300">English</span>
                  <Globe className="w-4 h-4 text-gray-400" />
                </div>
                <div className="bg-[#1E222D] border border-[#2A2E39] rounded-lg p-2 flex items-center justify-between cursor-pointer">
                  <span className="text-sm font-bold text-gray-300 text-green-500">$ USD</span>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </div>
              </div>

              {/* Theme Toggle Wrapper */}
              <div className="bg-[#1E222D] border border-[#2A2E39] rounded-lg p-1 flex">
                <button 
                  onClick={() => setIsLight(true)}
                  className={`flex-1 py-2 text-xs font-bold rounded-md flex items-center justify-center gap-2 transition-colors ${isLight ? 'bg-[#2A2E39] text-white shadow-sm' : 'text-gray-400'}`}
                >
                  <Sun className="w-3.5 h-3.5" /> Light
                </button>
                <button 
                  onClick={() => setIsLight(false)}
                  className={`flex-1 py-2 text-xs font-bold rounded-md flex items-center justify-center gap-2 transition-colors ${!isLight ? 'bg-[#2A2E39] text-white shadow-sm' : 'text-gray-400'}`}
                >
                  <Moon className="w-3.5 h-3.5" /> Dark
                </button>
              </div>

              {/* Menu Links */}
              <div className="flex flex-col border-t border-[#2A2E39] mt-2 pt-2 gap-0">
                {[
                  { label: 'Watchlist', icon: Star, id: 'section-watchlist' },
                  { label: 'Portfolio', icon: PieChart, id: 'section-overview' },
                  { label: 'Platform Tools', icon: Settings, id: 'section-overview' },
                  { label: 'AI Scanner', icon: Sparkles, id: 'section-insights' },
                  { label: 'Notifications', icon: Bell, id: 'section-news' },
                  { label: 'Account Settings', icon: User, id: 'section-support' }
                ].map((item, idx) => (
                  <button 
                    key={idx}
                    onClick={(e) => scrollTo(e, item.id)}
                    className="flex items-center justify-between py-4 border-b border-[#2A2E39] border-opacity-50"
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className="w-5 h-5 text-gray-400" />
                      <span className="font-bold text-white tracking-wide text-sm">{item.label}</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-500" />
                  </button>
                ))}
              </div>

              {/* Footer Links */}
              <div className="flex flex-col items-center gap-4 mt-6 text-xs font-bold text-gray-500">
                <div className="flex gap-4">
                  <span>Disclaimer</span>
                  <span>Terms of Use</span>
                  <span>Privacy Policy</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
