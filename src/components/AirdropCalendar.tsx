import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Gift, ExternalLink, Flame, Info, Clock } from 'lucide-react';

export function AirdropCalendar() {
  const [expandedEvent, setExpandedEvent] = useState<number | null>(null);
  const [activeEvents, setActiveEvents] = useState<any[]>([]);
  const [nextUpdateStr, setNextUpdateStr] = useState('');

  const toggleEvent = (index: number) => {
    if (expandedEvent === index) {
      setExpandedEvent(null);
    } else {
      setExpandedEvent(index);
    }
  };

  const allEvents = [
    { title: 'ZkSync Token Generation', type: 'Airdrop', date: 'May 15', status: 'Confirmed', hot: true, desc: 'Likely the largest airdrop of the year. Make sure you have bridged, provided liquidity and interacted with SyncSwap.', requirement: 'Bridged & Tx Volume' },
    { title: 'LayerZero Snapshot', type: 'Snapshot', date: 'May 10', status: 'Speculated', hot: true, desc: 'The omichain interoperability protocol is rumored to be taking a snapshot soon. Target >10 destination chains and $10k+ volume.', requirement: 'Cross-chain Tx' },
    { title: 'Manta Network Unlocks', type: 'Unlock', date: 'May 05', status: 'Ongoing', hot: false, desc: 'A major unlock of the New Paradigm rewards may introduce volatility.', requirement: 'Holding MANTA' },
    { title: 'Base Network Season 2', type: 'Airdrop', date: 'Jun 01', status: 'Unconfirmed', hot: false, desc: 'Coinbase L2 has no plans for a token, but early protocols on Base might do season 2 airdrops.', requirement: 'DeFi Usage' },
    { title: 'Starknet DeFi Spring', type: 'Rewards', date: 'May 20', status: 'Ongoing', hot: true, desc: 'STRK rewards distributed for volume on specific DEXs', requirement: 'DEX Volume' },
    { title: 'EigenLayer Season 2', type: 'Airdrop', date: 'Jul 10', status: 'Confirmed', hot: true, desc: 'Restaking points converted to tokens for early contributors', requirement: 'Restaked ETH' },
    { title: 'Scroll Mainnet Drop', type: 'Airdrop', date: 'Aug 15', status: 'Unconfirmed', hot: false, desc: 'ZkEVM mainnet active for 8 months. Speculation high.', requirement: 'Scroll Volume' },
    { title: 'Blast L2 Migration', type: 'Unlock', date: 'May 28', status: 'Confirmed', hot: true, desc: 'Points converted to GOLD, bridge unlocks available', requirement: 'Bridged ETH' },
  ];

  useEffect(() => {
    const updateEvents = () => {
      const now = new Date();
      const windowMs = 2 * 60 * 60 * 1000;
      const currentEpochPeriod = Math.floor(now.getTime() / windowMs);
      
      const startIndex = (currentEpochPeriod * 4) % allEvents.length;
      const selected = [];
      for (let i = 0; i < 4; i++) {
        selected.push(allEvents[(startIndex + i) % allEvents.length]);
      }
      setActiveEvents(selected);
    };

    updateEvents();
    const interval = setInterval(updateEvents, 60000); 
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-[#131722] rounded-xl p-6 border border-[#2A2E39] shadow-lg flex flex-col gap-6 h-full min-h-[450px]">
      <div className="flex items-center justify-between">
         <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Gift className="w-5 h-5 text-blue-500" /> Live Airdrops Radar
          </h3>
         <p className="text-sm text-gray-400 mt-1 flex items-center gap-2">
            <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></div>
              <span className="text-[9px] font-bold text-blue-500 uppercase tracking-wider">Live Radar Active</span>
            </span>
          </p>
         </div>
         <CalendarIcon className="w-6 h-6 text-gray-500" />
      </div>

      <div className="flex-1 flex flex-col gap-3 overflow-y-auto no-scrollbar pr-1">
        {activeEvents.map((evt, i) => (
          <div key={i} onClick={() => toggleEvent(i)} className="bg-[#1E222D] rounded-lg border border-[#2A2E39] hover:border-blue-500/30 transition-colors cursor-pointer overflow-hidden flex flex-col">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  {evt.hot && <Flame className="w-4 h-4 text-orange-500" />}
                  <h4 className="font-bold text-white text-sm">{evt.title}</h4>
                </div>
                <div className="flex gap-2 text-xs">
                  <span className="text-blue-400">{evt.type}</span>
                  <span className="text-gray-500 px-2 border-l border-gray-700">{evt.status}</span>
                </div>
              </div>
              <div className="flex items-center gap-4 sm:flex-col sm:items-end sm:gap-1">
                <div className="text-sm font-bold text-gray-300 bg-[#2A2E39] px-3 py-1 rounded-full whitespace-nowrap">{evt.date}</div>
                <button className="text-xs text-blue-500 hover:text-blue-400 flex items-center gap-1 font-bold">
                  Details <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </div>
            
            {expandedEvent === i && (
              <div className="p-4 pt-0 bg-[#1E222D] text-sm border-t border-[#2A2E39] mt-2">
                <div className="flex items-center gap-1 text-slate-300 font-bold mb-2 uppercase text-xs tracking-wider pt-3">
                  <Info className="w-4 h-4 text-blue-500" /> Insight
                </div>
                <p className="text-[#8B92A5] leading-relaxed mb-3">{evt.desc}</p>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500 font-bold uppercase shrink-0">Reqs:</span>
                  <span className="px-2 py-1 bg-[#131722] border border-[#2A2E39] rounded text-slate-300 text-xs font-bold truncate">{evt.requirement}</span>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white rounded text-xs px-3 py-1 font-bold ml-auto transition-colors shrink-0">Action</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <button className="w-full py-3 mt-auto bg-blue-600/10 hover:bg-blue-600/20 text-blue-500 border border-blue-500/20 rounded-lg text-sm font-bold transition-colors">
        View Full Calendar
      </button>
    </div>
  );
}
