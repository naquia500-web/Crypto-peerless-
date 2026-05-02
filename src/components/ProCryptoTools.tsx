import React, { useState } from 'react';
import { Calculator, Pickaxe, Scale, HandCoins, Play, Activity } from 'lucide-react';

export function ProCryptoTools() {
  const [activeTab, setActiveTab] = useState<'defi' | 'mining' | 'tax' | 'sim' | 'compare'>('defi');

  return (
    <div className="bg-[#131722] rounded-2xl border border-[#2A2E39] shadow-sm overflow-hidden flex flex-col h-[500px]">
      <div className="p-4 border-b border-[#2A2E39] bg-[#1E222D]">
        <h2 className="text-xl font-black text-white mb-4 flex items-center gap-2">
          <Calculator className="w-5 h-5 text-indigo-600" /> Pro Crypto Tools
        </h2>
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {[
            { id: 'defi', label: 'DeFi Calculator', icon: HandCoins },
            { id: 'mining', label: 'Mining Calc', icon: Pickaxe },
            { id: 'tax', label: 'Tax Estimator', icon: Scale },
            { id: 'sim', label: 'Investment Sim', icon: Play },
            { id: 'compare', label: 'Compare Projects', icon: Activity },
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${
                activeTab === t.id 
                  ? 'bg-indigo-600 text-white shadow-sm' 
                  : 'bg-[#131722] text-[#787B86] border border-[#2A2E39] hover:bg-[#2A2E39]'
              }`}
            >
              <t.icon className="w-3.5 h-3.5" /> {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 bg-[#1E222D]">
        {activeTab === 'defi' && (
          <div className="max-w-md mx-auto bg-[#131722] p-6 rounded-xl border border-[#2A2E39] shadow-sm">
            <h3 className="font-bold text-white mb-4">DeFi Lending & Borrowing Calculator</h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-[#787B86] uppercase">Deposit Amount (USD)</label>
                <input type="number" defaultValue={10000} className="w-full mt-1 p-2 border border-[#2A2E39] rounded-lg text-sm font-semibold focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-[#787B86] uppercase">Supply APY (%)</label>
                  <input type="number" defaultValue={5.5} className="w-full mt-1 p-2 border border-[#2A2E39] rounded-lg text-sm font-semibold focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none" />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#787B86] uppercase">Borrow APY (%)</label>
                  <input type="number" defaultValue={3.2} className="w-full mt-1 p-2 border border-[#2A2E39] rounded-lg text-sm font-semibold focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none" />
                </div>
              </div>
              <div className="pt-4 border-t border-[#2A2E39] flex justify-between items-center">
                <span className="font-bold text-[#787B86]">Net Estimated APY</span>
                <span className="text-xl font-black text-green-500">2.3%</span>
              </div>
              <button className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg transition-colors">Calculate Rewards</button>
            </div>
          </div>
        )}

        {activeTab === 'mining' && (
          <div className="max-w-md mx-auto bg-[#131722] p-6 rounded-xl border border-[#2A2E39] shadow-sm">
            <h3 className="font-bold text-white mb-4">Mining Profitability Est.</h3>
             <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-[#787B86] uppercase">Hashrate (TH/s)</label>
                <input type="number" defaultValue={100} className="w-full mt-1 p-2 border border-[#2A2E39] rounded-lg text-sm font-semibold focus:border-indigo-500 outline-none" />
              </div>
              <div>
                <label className="text-xs font-bold text-[#787B86] uppercase">Power Consumption (W) & Cost ($/kWh)</label>
                <div className="flex gap-2 mt-1">
                  <input type="number" defaultValue={3000} className="w-1/2 p-2 border border-[#2A2E39] rounded-lg text-sm font-semibold focus:border-indigo-500 outline-none" />
                  <input type="number" defaultValue={0.12} className="w-1/2 p-2 border border-[#2A2E39] rounded-lg text-sm font-semibold focus:border-indigo-500 outline-none" />
                </div>
              </div>
              <div className="pt-4 border-t border-[#2A2E39] flex justify-between items-center">
                <span className="font-bold text-[#787B86]">Daily Profit Est.</span>
                <span className="text-xl font-black text-green-500">+$4.52</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'tax' && (
          <div className="max-w-md mx-auto bg-[#131722] p-6 rounded-xl border border-[#2A2E39] shadow-sm text-center py-10">
            <Scale className="w-12 h-12 text-indigo-200 mx-auto mb-4" />
            <h3 className="font-bold text-white mb-2">Crypto Tax Estimator</h3>
            <p className="text-sm text-[#787B86] mb-6">Connect your wallets to automatically tag taxable events, calculate short/long term capital gains, and generate reports.</p>
            <button className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg transition-colors">Connect Wallet & Calculate Repo</button>
          </div>
        )}

        {activeTab === 'sim' && (
          <div className="max-w-md mx-auto bg-[#131722] p-6 rounded-xl border border-[#2A2E39] shadow-sm text-center py-10">
            <Play className="w-12 h-12 text-indigo-200 mx-auto mb-4" />
            <h3 className="font-bold text-white mb-2">Virtual Trading Simulator</h3>
            <p className="text-sm text-[#787B86] mb-6">Start with a virtual $100,000 portfolio. Practice trading strategies without risking real capital.</p>
            <button className="px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition-colors uppercase tracking-wider text-sm shadow-md">Launch Simulator</button>
          </div>
        )}

        {activeTab === 'compare' && (
          <div className="w-full bg-[#131722] p-6 rounded-xl border border-[#2A2E39] shadow-sm">
            <h3 className="font-bold text-white mb-4 text-center">Project Comparison</h3>
            <div className="flex items-center gap-4 mb-8">
              <div className="flex-1">
                 <input type="text" defaultValue="Ethereum (ETH)" className="w-full p-2 border border-[#2A2E39] rounded-lg text-sm font-semibold bg-[#1E222D] text-center outline-none" />
              </div>
              <div className="font-black text-slate-300">VS</div>
              <div className="flex-1">
                 <input type="text" defaultValue="Solana (SOL)" className="w-full p-2 border border-[#2A2E39] rounded-lg text-sm font-semibold bg-[#1E222D] text-center outline-none" />
              </div>
            </div>
            
            <table className="w-full text-sm">
              <tbody>
                {[
                  { label: "Market Cap", a: "$340.5B", b: "$42.1B" },
                  { label: "TPS (Theoretical)", a: "15-30", b: "65,000+" },
                  { label: "Consensus", a: "PoS", b: "PoH / PoS" },
                  { label: "Avg Tx Cost", a: "$2.50", b: "$0.00025" },
                ].map((row, i) => (
                  <tr key={i} className="border-b border-[#2A2E39] last:border-0">
                    <td className="py-3 font-bold text-[#B2B5BE] w-1/3 text-center">{row.a}</td>
                    <td className="py-3 text-[10px] font-black uppercase text-slate-400 text-center w-1/3">{row.label}</td>
                    <td className="py-3 font-bold text-[#B2B5BE] w-1/3 text-center">{row.b}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
