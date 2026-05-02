import React, { useState } from 'react';
import { Calendar, Bell, ArrowRightLeft, Unlock, ExternalLink } from 'lucide-react';

export function MarketEvents() {
  const [activeTab, setActiveTab] = useState<'listings' | 'migrations' | 'unlocks' | 'events'>('listings');

  return (
    <div className="bg-[#131722] rounded-2xl border border-[#2A2E39] shadow-sm overflow-hidden flex flex-col h-[500px]">
      <div className="p-4 border-b border-[#2A2E39] flex gap-2 bg-[#1E222D] overflow-x-auto no-scrollbar">
        {[
          { id: 'listings', label: 'New Listings', icon: Bell },
          { id: 'migrations', label: 'Migrations', icon: ArrowRightLeft },
          { id: 'unlocks', label: 'Token Unlocks', icon: Unlock },
          { id: 'events', label: 'Crypto Events', icon: Calendar },
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-colors ${
              activeTab === t.id 
                ? 'bg-blue-600 text-white shadow-sm' 
                : 'bg-[#131722] text-[#787B86] border border-[#2A2E39] hover:bg-[#1E222D]'
            }`}
          >
            <t.icon className="w-4 h-4" /> {t.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-4 bg-[#1E222D]">
        {activeTab === 'listings' && (
          <div className="space-y-3">
            {[
              { token: 'XYZ', exchange: 'Binance', time: 'In 2 hours', type: 'Spot' },
              { token: 'DEF', exchange: 'Coinbase', time: 'Tomorrow', type: 'Spot' },
              { token: 'GHI', exchange: 'Bybit', time: 'Next Week', type: 'Launchpad' },
            ].map((item, i) => (
              <div key={i} className="bg-[#131722] p-4 rounded-xl border border-[#2A2E39] shadow-sm flex justify-between items-center group hover:border-blue-300 transition-colors cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-black">
                    {item.token[0]}
                  </div>
                  <div>
                    <h4 className="font-bold text-white group-hover:text-blue-600 transition-colors uppercase">{item.token} Listing</h4>
                    <p className="text-xs text-[#787B86] font-medium">on {item.exchange} • {item.type}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded inline-block">{item.time}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'migrations' && (
          <div className="space-y-3">
            {[
              { from: 'OLD', to: 'NEW', status: 'Ongoing', ratio: '1:1', network: 'Ethereum -> Arbitrum' },
              { from: 'TKN', to: 'TKNV2', status: 'Upcoming', ratio: '10:1', network: 'BSC' },
            ].map((item, i) => (
              <div key={i} className="bg-[#131722] p-4 rounded-xl border border-[#2A2E39] shadow-sm flex flex-col gap-3 group hover:border-purple-300 transition-colors cursor-pointer">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <span className="font-black text-white">{item.from}</span>
                    <ArrowRightLeft className="w-4 h-4 text-slate-400" />
                    <span className="font-black text-purple-600">{item.to}</span>
                  </div>
                  <span className={`text-[10px] uppercase tracking-widest font-bold px-2 py-1 rounded ${item.status === 'Ongoing' ? 'bg-green-100 text-green-700' : 'bg-[#2A2E39] text-[#787B86]'}`}>{item.status}</span>
                </div>
                <div className="flex justify-between text-xs text-[#787B86]">
                  <span>Ratio: <strong>{item.ratio}</strong></span>
                  <span>{item.network}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'unlocks' && (
          <div className="space-y-3">
            {[
              { token: 'ARB', amount: '1.2B', value: '$1.4B', pct: '10.5%', date: 'Mar 16, 2024' },
              { token: 'SUI', amount: '34M', value: '$56M', pct: '2.1%', date: 'Next week' },
            ].map((item, i) => (
              <div key={i} className="bg-[#131722] p-4 rounded-xl border border-[#2A2E39] shadow-sm flex justify-between items-center group hover:border-red-300 transition-colors cursor-pointer">
                <div>
                  <h4 className="font-black text-white">{item.token} Unlock</h4>
                  <p className="text-[11px] text-[#787B86] mt-0.5">{item.amount} tokens ({item.pct} cir. supply)</p>
                </div>
                <div className="text-right">
                  <div className="text-sm font-black text-red-500 mb-0.5">{item.value}</div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{item.date}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'events' && (
          <div className="space-y-3">
            {[
              { name: 'Bitcoin Halving', date: 'April 2024 (Est.)', type: 'Macro' },
              { name: 'Ethereum Dencun Upgrade', date: 'March 13, 2024', type: 'Mainnet Upgrade' },
              { name: 'SEC ETF Decision Deadline', date: 'May 23, 2024', type: 'Regulatory' },
            ].map((item, i) => (
              <div key={i} className="bg-[#131722] p-4 rounded-xl border border-[#2A2E39] shadow-sm flex items-start justify-between group hover:border-blue-300 transition-colors cursor-pointer">
                <div>
                  <h4 className="font-bold text-white leading-tight">{item.name}</h4>
                  <p className="text-xs text-blue-600 font-semibold mt-1">{item.type}</p>
                </div>
                <div className="text-right shrink-0 ml-4">
                  <div className="text-xs font-bold text-[#787B86] bg-[#2A2E39] px-2 py-1 rounded">{item.date}</div>
                </div>
              </div>
            ))}
            <div className="flex justify-center pt-2">
               <button className="text-xs font-bold text-blue-600 flex items-center gap-1 hover:underline">View Full Calendar <ExternalLink className="w-3 h-3" /></button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
