import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Info, Loader2 } from 'lucide-react';

export function FearAndGreedIndex() {
  const [data, setData] = useState<{
    score: number;
    status: string;
    yesterdayScore: number;
    yesterdayStatus: string;
    lastWeekScore: number;
    lastWeekStatus: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFNG = async () => {
      try {
        const response = await fetch('https://api.alternative.me/fng/?limit=8');
        const json = await response.json();
        
        if (json && json.data && json.data.length > 0) {
          const today = json.data[0];
          const yesterday = json.data[1];
          const lastWeek = json.data[7];
          
          setData({
            score: parseInt(today.value),
            status: today.value_classification,
            yesterdayScore: parseInt(yesterday.value),
            yesterdayStatus: yesterday.value_classification,
            lastWeekScore: parseInt(lastWeek.value),
            lastWeekStatus: lastWeek.value_classification,
          });
        }
      } catch (error) {
        console.error("Error fetching Fear and Greed index:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchFNG();
    
    // Auto update every 2 hours
    const interval = setInterval(() => {
      fetchFNG();
    }, 2 * 60 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  const score = data?.score || 76;
  const status = data?.status || 'Extreme Greed';
  
  // Calculate color class based on score
  const getColorClass = (val: number) => {
    if (val > 75) return 'text-green-500';
    if (val > 54) return 'text-green-400';
    if (val > 45) return 'text-yellow-500';
    if (val > 24) return 'text-orange-500';
    return 'text-red-500';
  };
  
  const colorClass = getColorClass(score);

  // Calculate rotation for the semi-circle dial
  // 0 is Fear (left), 100 is Greed (right)
  const rotation = (score / 100) * 180 - 90;

  return (
    <div className="bg-[#131722] rounded-xl p-6 border border-[#2A2E39] shadow-lg relative overflow-hidden flex flex-col gap-6">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            Fear &amp; Greed Index <Info className="w-4 h-4 text-gray-400" />
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 ml-2">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></div>
              <span className="text-[9px] font-bold text-blue-500 uppercase tracking-wider">Live Tracker Active</span>
            </div>
          </h3>
          <p className="text-sm text-gray-400 mt-1">Multifactorial crypto market sentiment analysis</p>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center py-6 relative">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-32 text-gray-400">
            <Loader2 className="w-8 h-8 animate-spin mb-2" />
            <span className="text-sm">Loading index...</span>
          </div>
        ) : (
          <>
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
          </>
        )}
      </div>
      
      <div className="grid grid-cols-2 gap-4 mt-auto pt-4 border-t border-[#2A2E39]">
        <div className="flex flex-col">
          <span className="text-xs text-gray-500 mb-1">Yesterday</span>
          {loading ? (
            <div className="h-5 w-24 bg-[#2A2E39] animate-pulse rounded"></div>
          ) : (
             <span className="text-sm font-bold text-white">{data?.yesterdayScore} - {data?.yesterdayStatus}</span>
          )}
        </div>
        <div className="flex flex-col">
          <span className="text-xs text-gray-500 mb-1">Last Week</span>
          {loading ? (
            <div className="h-5 w-24 bg-[#2A2E39] animate-pulse rounded"></div>
          ) : (
            <span className="text-sm font-bold text-white">{data?.lastWeekScore} - {data?.lastWeekStatus}</span>
          )}
        </div>
      </div>
    </div>
  );
}
