import { ExternalLink } from 'lucide-react';

export function AdBanner({ text = "Exclusive Crypto Trading Offers", cta = "Trade Now", url = "#" }: { text?: string, cta?: string, url?: string }) {
  return (
    <a href={url} className="w-full flex items-center justify-between bg-gradient-to-r from-[#1E222D] to-blue-900/30 border border-blue-500/20 rounded-xl p-4 my-2 hover:border-blue-500/40 transition-colors group cursor-pointer shadow-lg relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-blue-500/10 to-transparent pointer-events-none" />
      
      <div className="flex items-center gap-4 relative z-10">
        <div className="bg-[#131722] text-[#787B86] text-[10px] font-bold px-2 py-0.5 rounded border border-[#2A2E39] uppercase tracking-wider">
          AD
        </div>
        <span className="text-white font-medium text-sm sm:text-base group-hover:text-blue-400 transition-colors">{text}</span>
      </div>
      
      <div className="flex items-center gap-2 relative z-10">
        <span className="text-sm font-bold text-blue-500">{cta}</span>
        <ExternalLink className="w-4 h-4 text-blue-500" />
      </div>
    </a>
  );
}
