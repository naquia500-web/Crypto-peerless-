import { motion } from 'motion/react';
import { ShieldAlert, TrendingUp, TrendingDown, Info } from 'lucide-react';

export function FearAndGreedIndex() {
  // Using a static but realistic value for UI purposes
  const score = 76; // Greed
  const status = 'Extreme Greed';
  const colorClass = 'text-green-500';

  // Calculate rotation for the semi-circle dial
  // 0 is Fear (left), 100 is Greed (right)
  const rotation = (score / 100) * 180 - 90;

  return (
    <div className="bg-[#131722] rounded-xl p-6 border border-[#2A2E39] shadow-lg relative overflow-hidden flex flex-col gap-6">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            Fear &amp; Greed Index <Info className="w-4 h-4 text-gray-400" />
          </h3>
          <p className="text-sm text-gray-400 mt-1">Multifactorial crypto market sentiment analysis</p>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center py-6 relative">
        <div className="w-64 h-32 relative overflow-hidden mb-4">
          {/* Gauge Background */}
          <div className="w-full h-[200%] border-[24px] border-[#2A2E39] rounded-full absolute top-0 left-0"></div>
          
          {/* Gauge Color Fill (Gradient) */}
          <div className="w-full h-[200%] border-[24px] border-transparent border-t-red-500 border-r-yellow-500 border-b-green-500 border-l-orange-500 rounded-full absolute top-0 left-0 rotate-45 opacity-20"></div>

          {/* Needle pivot */}
          <div className="absolute bottom-[-10px] left-1/2 transform -translate-x-1/2 w-8 h-8 rounded-full bg-[#131722] border-4 border-gray-600 z-10"></div>
          
          {/* Needle */}
          <motion.div 
            initial={{ rotate: -90 }}
            animate={{ rotate: rotation }}
            transition={{ duration: 1.5, type: 'spring', bounce: 0.4 }}
            style={{ transformOrigin: 'bottom center' }}
            className="absolute bottom-0 left-1/2 w-1 h-32 bg-white rounded-t-full -translate-x-1/2 z-0 origin-bottom"
          />
        </div>

        <div className="text-center">
          <div className={`text-5xl font-black ${colorClass} mb-2`}>{score}</div>
          <div className={`text-xl font-bold uppercase tracking-wider ${colorClass}`}>{status}</div>
        </div>
        
        <div className="flex w-full justify-between mt-6 px-4 text-xs font-bold text-gray-500 uppercase tracking-widest">
          <span className="text-red-500">Extreme Fear</span>
          <span className="text-green-500">Extreme Greed</span>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mt-auto pt-4 border-t border-[#2A2E39]">
        <div className="flex flex-col">
          <span className="text-xs text-gray-500 mb-1">Yesterday</span>
          <span className="text-sm font-bold text-white">72 - Greed</span>
        </div>
        <div className="flex flex-col">
          <span className="text-xs text-gray-500 mb-1">Last Week</span>
          <span className="text-sm font-bold text-white">65 - Greed</span>
        </div>
      </div>
    </div>
  );
}
