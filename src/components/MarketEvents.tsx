import React, { useState, useEffect } from 'react';
import { Calendar, Bell, ArrowRightLeft, Unlock, ExternalLink, ChevronRight, Info, Clock } from 'lucide-react';

export function MarketEvents() {
  const [activeTab, setActiveTab] = useState<'listings' | 'migrations' | 'unlocks' | 'events'>('listings');
  const [expandedEvent, setExpandedEvent] = useState<string | null>(null);
  
  const [activeItems, setActiveItems] = useState<any>({
    listings: [], migrations: [], unlocks: [], events: []
  });
  const [nextUpdateStr, setNextUpdateStr] = useState('');

  const allData = {
    listings: [
      { id: 'l1', token: 'XYZ', exchange: 'Binance', time: 'In 2 hours', type: 'Spot', pair: 'XYZ/USDT', desc: 'XYZ is a highly anticipated layer-2 solution for cross-chain liquidity. Trading will open precisely at 14:00 UTC with an initial deposit limit.' },
      { id: 'l2', token: 'DEF', exchange: 'Coinbase', time: 'Tomorrow', type: 'Spot', pair: 'DEF/USD', desc: 'DEF Protocol brings privacy to smart contracts. Coinbase will enable trading dynamically once liquidity conditions are met.' },
      { id: 'l3', token: 'GHI', exchange: 'Bybit', time: 'Next Week', type: 'Launchpad', pair: 'GHI/USDT', desc: 'GHI token will be sold via Bybit Launchpad. Snapshot period for MNT holding starts this weekend. Over 5M GHI in rewards allocated.' },
      { id: 'l4', token: 'JKL', exchange: 'KuCoin', time: 'In 5 hours', type: 'Spot', pair: 'JKL/USDT', desc: 'JKL network expands the decentralized computing paradigm. Initial DEX offering completed yesterday.' },
      { id: 'l5', token: 'MNO', exchange: 'OKX', time: 'In 1 day', type: 'Futures', pair: 'MNO/USDT-PERP', desc: 'MNO perpetual contracts open. Leverage up to 50x supported.' },
      { id: 'l6', token: 'PQR', exchange: 'Kraken', time: 'In 3 days', type: 'Spot', pair: 'PQR/EUR', desc: 'PQR brings real-world assets to the blockchain.' },
    ],
    migrations: [
      { id: 'm1', from: 'OLD', to: 'NEW', status: 'Ongoing', ratio: '1:1', network: 'Ethereum -> Arbitrum', desc: 'The OLD token is deprecating. Users must bridge their tokens to Arbitrum using the official portal to receive NEW tokens. Ensure you have ETH for gas.' },
      { id: 'm2', from: 'TKN', to: 'TKNV2', status: 'Upcoming', ratio: '10:1', network: 'BSC', desc: 'A total supply reduction migration. 10 old TKNs become 1 TKNV2. Dex liquidity will automatically migrate in 48 hours.' },
      { id: 'm3', from: 'ALPHA', to: 'BETA', status: 'Upcoming', ratio: '1:1', network: 'Solana', desc: 'V1 protocol deprecated. V2 rewards kick in post-migration.' },
      { id: 'm4', from: 'LND', to: 'vLND', status: 'Ongoing', ratio: '1:1', network: 'Polygon', desc: 'Migration to the new governance token wrapper is live.' },
    ],
    unlocks: [
      { id: 'u1', token: 'ARB', amount: '1.2B', value: '$1.4B', pct: '10.5%', date: 'Mar 16, 2024', dist: 'Team & Investors' },
      { id: 'u2', token: 'SUI', amount: '34M', value: '$56M', pct: '2.1%', date: 'Next week', dist: 'Community Reserve' },
      { id: 'u3', token: 'OP', amount: '24M', value: '$40M', pct: '2.5%', date: 'End of Month', dist: 'Core Contributors' },
      { id: 'u4', token: 'DYDX', amount: '15M', value: '$30M', pct: '1.8%', date: 'In 3 days', dist: 'Treasury' },
    ],
    events: [
      { id: 'e1', name: 'Bitcoin Halving', date: 'April 2024 (Est.)', type: 'Macro', desc: 'The block reward for miners gets cut in half, from 6.25 BTC to 3.125 BTC, heavily reducing new supply.' },
      { id: 'e2', name: 'Ethereum Dencun Upgrade', date: 'March 13, 2024', type: 'Mainnet Upgrade', desc: 'Introduces proto-danksharding (EIP-4844) to massively reduce transaction fees for Layer 2 rollups.' },
      { id: 'e3', name: 'SEC ETF Decision Deadline', date: 'May 23, 2024', type: 'Regulatory', desc: 'The absolute final deadline for the approval or denial of the VanEck Spot Ethereum ETF.' },
      { id: 'e4', name: 'MiCA Framework LIVE', date: 'June 2024', type: 'Regulatory', desc: 'European framework for crypto-assets begins coming into active effect across member states.' },
      { id: 'e5', name: 'Solana Firedancer Client', date: 'July 2024', type: 'Mainnet Upgrade', desc: 'New validator client rollout expected to significantly improve throughput and reliability.' },
      { id: 'e6', name: 'Fed Interest Rate Decision', date: 'Next Wednesday', type: 'Macro', desc: 'FOMC meeting concludes, rate pause expected but dot plot will guide markets.' },
    ]
  };

  useEffect(() => {
    const updateData = () => {
      const now = new Date();
      const windowMs = 2 * 60 * 60 * 1000;
      const currentEpochPeriod = Math.floor(now.getTime() / windowMs);
      
      const selectItems = (arr: any[], count: number) => {
        const start = (currentEpochPeriod * count) % arr.length;
        const res = [];
        for (let i = 0; i < count; i++) {
          res.push(arr[(start + i) % arr.length]);
        }
        return res;
      };

      setActiveItems({
        listings: selectItems(allData.listings, 3),
        migrations: selectItems(allData.migrations, 2),
        unlocks: selectItems(allData.unlocks, 2),
        events: selectItems(allData.events, 3)
      });
    };

    updateData();
    const interval = setInterval(updateData, 60000); 
    return () => clearInterval(interval);
  }, []);

  const toggleEvent = (id: string) => {
    if (expandedEvent === id) {
      setExpandedEvent(null);
    } else {
      setExpandedEvent(id);
    }
  };

  return (
    <div className="bg-[#131722] rounded-2xl border border-[#2A2E39] shadow-sm overflow-hidden flex flex-col h-[500px]">
      <div className="p-4 border-b border-[#2A2E39] flex gap-2 bg-[#1E222D] overflow-x-auto no-scrollbar justify-between">
        <div className="flex gap-2">
          {[
            { id: 'listings', label: 'New Listings', icon: Bell },
            { id: 'migrations', label: 'Migrations', icon: ArrowRightLeft },
            { id: 'unlocks', label: 'Token Unlocks', icon: Unlock },
            { id: 'events', label: 'Crypto Events', icon: Calendar },
          ].map(t => (
            <button
              key={t.id}
              onClick={() => { setActiveTab(t.id as any); setExpandedEvent(null); }}
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
        <div className="flex items-center gap-2 text-[#787B86] text-xs font-bold whitespace-nowrap px-2">
          <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20">
             <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></div>
             <span className="text-[9px] font-bold text-blue-500 uppercase tracking-wider">Live Tracker Active</span>
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 bg-[#1E222D]">
        {activeTab === 'listings' && (
          <div className="space-y-3">
            {activeItems.listings.map((item: any) => (
              <div key={item.id} onClick={() => toggleEvent(item.id)} className="bg-[#131722] rounded-xl border border-[#2A2E39] shadow-sm flex flex-col group hover:border-blue-300 transition-colors cursor-pointer overflow-hidden">
                <div className="p-4 flex justify-between items-center bg-[#131722]">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-black shrink-0">
                      {item.token[0]}
                    </div>
                    <div>
                      <h4 className="font-bold text-white group-hover:text-blue-500 transition-colors uppercase">{item.token} Listing</h4>
                      <p className="text-xs text-[#787B86] font-medium">on {item.exchange} • {item.type}</p>
                    </div>
                  </div>
                  <div className="text-right flex items-center gap-2">
                    <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded inline-block">{item.time}</span>
                  </div>
                </div>
                {expandedEvent === item.id && (
                  <div className="p-4 bg-[#1E222D] border-t border-[#2A2E39] text-sm">
                    <div className="flex items-center gap-1 text-slate-300 font-bold mb-2 uppercase text-xs tracking-wider">
                      <Info className="w-4 h-4 text-blue-500" /> Event Details
                    </div>
                    <p className="text-[#8B92A5] leading-relaxed mb-3">{item.desc}</p>
                    <div className="flex gap-2">
                       <span className="px-2 py-1 bg-[#131722] border border-[#2A2E39] rounded text-slate-300 font-mono text-xs">Pair: {item.pair}</span>
                       <button className="px-2 py-1 bg-blue-600 hover:bg-blue-700 rounded text-white font-bold text-xs ml-auto transition-colors">Set Alert</button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {activeTab === 'migrations' && (
          <div className="space-y-3">
            {activeItems.migrations.map((item: any) => (
              <div key={item.id} onClick={() => toggleEvent(item.id)} className="bg-[#131722] rounded-xl border border-[#2A2E39] shadow-sm flex flex-col group hover:border-purple-300 transition-colors cursor-pointer overflow-hidden">
                <div className="p-4 flex flex-col gap-3">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <span className="font-black text-white">{item.from}</span>
                      <ArrowRightLeft className="w-4 h-4 text-slate-400 group-hover:text-purple-400 transition-colors" />
                      <span className="font-black text-purple-600">{item.to}</span>
                    </div>
                    <span className={`text-[10px] uppercase tracking-widest font-bold px-2 py-1 rounded ${item.status === 'Ongoing' ? 'bg-green-100 text-green-700' : 'bg-[#2A2E39] text-[#787B86]'}`}>{item.status}</span>
                  </div>
                  <div className="flex justify-between text-xs text-[#787B86]">
                    <span>Ratio: <strong>{item.ratio}</strong></span>
                    <span>{item.network}</span>
                  </div>
                </div>
                {expandedEvent === item.id && (
                  <div className="p-4 bg-[#1E222D] border-t border-[#2A2E39] text-sm">
                    <p className="text-[#8B92A5] leading-relaxed mb-3">{item.desc}</p>
                    <button className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 rounded-md text-white font-bold text-xs transition-colors w-full uppercase tracking-wider text-center">Migration Portal</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {activeTab === 'unlocks' && (
          <div className="space-y-3">
            {activeItems.unlocks.map((item: any) => (
              <div key={item.id} onClick={() => toggleEvent(item.id)} className="bg-[#131722] rounded-xl border border-[#2A2E39] shadow-sm flex flex-col group hover:border-red-300 transition-colors cursor-pointer overflow-hidden">
                <div className="p-4 flex justify-between items-center">
                  <div>
                    <h4 className="font-black text-white group-hover:text-red-400 transition-colors">{item.token} Unlock</h4>
                    <p className="text-[11px] text-[#787B86] mt-0.5">{item.amount} tokens ({item.pct} cir. supply)</p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-black text-red-500 mb-0.5">{item.value}</div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{item.date}</div>
                  </div>
                </div>
                {expandedEvent === item.id && (
                  <div className="p-4 bg-[#1E222D] border-t border-[#2A2E39] flex flex-col gap-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-[#787B86]">Beneficiary:</span>
                      <span className="text-slate-300 font-bold">{item.dist}</span>
                    </div>
                    <div className="w-full bg-[#131722] rounded-full h-1.5 mt-1 overflow-hidden">
                      <div className="bg-red-500 h-full" style={{ width: '85%' }}></div>
                    </div>
                    <div className="text-[10px] text-right text-[#787B86]">85% unvested remaining</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {activeTab === 'events' && (
          <div className="space-y-3">
            {activeItems.events.map((item: any) => (
              <div key={item.id} onClick={() => toggleEvent(item.id)} className="bg-[#131722] rounded-xl border border-[#2A2E39] shadow-sm flex flex-col group hover:border-blue-300 transition-colors cursor-pointer overflow-hidden">
                <div className="p-4 flex items-start justify-between">
                  <div>
                    <h4 className="font-bold text-white leading-tight group-hover:text-blue-400 transition-colors">{item.name}</h4>
                    <p className="text-xs text-blue-600 font-semibold mt-1">{item.type}</p>
                  </div>
                  <div className="text-right shrink-0 ml-4">
                    <div className="text-xs font-bold text-[#787B86] bg-[#2A2E39] px-2 py-1 rounded">{item.date}</div>
                  </div>
                </div>
                {expandedEvent === item.id && (
                  <div className="p-4 bg-[#1E222D] border-t border-[#2A2E39] text-sm">
                    <p className="text-[#8B92A5] leading-relaxed">{item.desc}</p>
                  </div>
                )}
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
