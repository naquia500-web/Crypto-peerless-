import { motion, AnimatePresence } from 'motion/react';
import { X, Globe, Clock, ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';

interface AllNewsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectArticle: (article: any) => void;
}

const FALLBACK_EXTENDED_NEWS = [
  {
    id: "ext-fb-1",
    source: "NEXUS AI GLOBAL",
    title: "Massive Surge in Global Crypto Markets",
    description: "Institutional investors have started pouring significant capital into Bitcoin and Ethereum, causing a massive surge and positive momentum in global crypto markets.",
    symbol: "BTCUSDT",
    published_on: Math.floor(Date.now() / 1000) - 300
  },
  {
    id: "ext-fb-2",
    source: "NEXUS AI GLOBAL",
    title: "New Bull Run? Will Altcoins Also Gain Momentum?",
    description: "With continuous gains in major currencies, smaller and emerging altcoins are now showing recovery and volume growth, bolstering investor confidence.",
    symbol: "ETHUSDT",
    published_on: Math.floor(Date.now() / 1000) - 600
  },
  {
    id: "ext-fb-3",
    source: "NEXUS AI GLOBAL",
    title: "Heavy Buying in Web3 and Gaming Tokens",
    description: "Technological upgrades and news of new project launches have brought the Web3 and gaming sectors back into the spotlight. Volume is steadily increasing.",
    symbol: "SOLUSDT",
    published_on: Math.floor(Date.now() / 1000) - 900
  },
  {
    id: "ext-fb-4",
    source: "NEXUS AI GLOBAL",
    title: "DeFi Total Value Locked (TVL) Approaching New Record",
    description: "Investors have locked massive amounts of capital in the decentralized finance sector. Heavy traffic is being observed on lending and borrowing platforms.",
    symbol: "BNBUSDT",
    published_on: Math.floor(Date.now() / 1000) - 1200
  }
];

export function AllNewsModal({ isOpen, onClose, onSelectArticle }: AllNewsModalProps) {
  const [extendedNews, setExtendedNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && extendedNews.length === 0) {
      fetchExtendedNews();
    }
  }, [isOpen]);

  const fetchExtendedNews = async () => {
    try {
      setLoading(true);
      await new Promise(r => setTimeout(r, 1000));
      setExtendedNews(FALLBACK_EXTENDED_NEWS);
    } catch (error: any) {
      setExtendedNews(FALLBACK_EXTENDED_NEWS);
    } finally {
      setLoading(false);
    }
  };

  const getThumbnailImage = (index: number) => {
    const images = [
      'https://images.unsplash.com/photo-1605792657660-596af9009e82?q=80&w=400&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1640340434855-6084b1f4901c?q=80&w=400&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1621416894569-0f39ed31d247?q=80&w=400&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?q=80&w=400&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1639762681485-074b7f4ec651?q=80&w=400&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1519162584292-56dfc9eb5db4?q=80&w=400&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1618172193622-ae2d025f4032?q=80&w=400&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1621932953986-15fcfdadb174?q=80&w=400&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1629339942165-4424ee437b6c?q=80&w=400&auto=format&fit=crop'
    ];
    return images[index % images.length];
  };

  const formatTimeAgo = (timestamp: number) => {
    const seconds = Math.floor(Date.now() / 1000) - timestamp;
    if (seconds < 60) return `Just now`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} mins ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hours ago`;
    const days = Math.floor(hours / 24);
    return `${days} days ago`;
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-40 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-md"
        />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-5xl h-[90vh] bg-[#0B0E11] rounded-2xl border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="flex justify-between items-center p-6 border-b border-white/10 bg-black/20 shrink-0">
            <div className="flex items-center gap-3">
               <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                  <Globe className="w-5 h-5 text-teal-400" />
               </div>
               <div>
                 <h2 className="text-xl font-black uppercase tracking-widest text-white">ALL LIVE UPDATES</h2>
                 <p className="text-xs text-white/50 uppercase tracking-wider font-mono">Global Market Intel</p>
               </div>
            </div>
            <button 
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors border border-white/10"
            >
              <X className="w-5 h-5 text-white/70" />
            </button>
          </div>

          {/* Content Area */}
          <div className="overflow-y-auto flex-1 p-6 custom-scrollbar">
            {loading ? (
              <div className="h-full flex flex-col items-center justify-center opacity-50">
                <div className="w-8 h-8 border-2 border-teal-400 border-t-transparent rounded-full animate-spin mb-4"></div>
                <span className="text-sm font-mono tracking-widest uppercase">Fetching global feeds...</span>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {extendedNews.map((article, i) => (
                  <motion.div
                    key={article.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => {
                        onClose();
                        onSelectArticle(article);
                    }}
                    className="group bg-white/5 border border-white/10 rounded-xl p-5 hover:border-teal-500/40 hover:bg-teal-500/5 transition-all cursor-pointer flex gap-4 items-center"
                  >
                    <div className="w-16 h-16 shrink-0 rounded-lg overflow-hidden border border-white/10 relative bg-black flex items-center justify-center p-2">
                      <img 
                        src={getThumbnailImage(i) || 'https://images.unsplash.com/photo-1621416894569-0f39ed31d247?q=80&w=400&auto=format&fit=crop'} 
                        alt=""
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                        loading="lazy"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.onerror = null;
                          target.src = 'https://images.unsplash.com/photo-1621416894569-0f39ed31d247?q=80&w=400&auto=format&fit=crop';
                        }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h5 className="text-[14px] font-bold leading-snug mb-2 text-white group-hover:text-teal-300 transition-colors line-clamp-2">
                        {article.title}
                      </h5>
                      <div className="flex items-center justify-between opacity-70">
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] font-bold text-teal-500 uppercase tracking-widest">
                            {article.source}
                          </span>
                          <span className="w-1 h-1 rounded-full bg-white/20"></span>
                          <div className="flex items-center gap-1 text-[9px] font-mono text-white/50">
                            <Clock className="w-3 h-3" />
                            {formatTimeAgo(article.published_on)}
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-teal-500/50 group-hover:text-teal-400 group-hover:translate-x-1 transition-all" />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
