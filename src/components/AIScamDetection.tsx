import { motion } from 'motion/react';
import { ShieldCheck, ShieldAlert, Cpu, AlertTriangle } from 'lucide-react';

export function AIScamDetection() {
  const scannedTokens = [
    { name: 'PepeDog (PEPEDOG)', risk: 'Extreme', score: 12, reason: 'Honeypot detected in contract', icon: <AlertTriangle className="w-4 h-4 text-red-500" /> },
    { name: 'Solana (SOL)', risk: 'Safe', score: 98, reason: 'Verified open source & high liquidity', icon: <ShieldCheck className="w-4 h-4 text-green-500" /> },
    { name: 'YieldMax (YMAX)', risk: 'High', score: 35, reason: 'Developer wallet holds 80% supply', icon: <ShieldAlert className="w-4 h-4 text-orange-500" /> },
    { name: 'Aptos (APT)', risk: 'Safe', score: 92, reason: 'Audited by top tier firm', icon: <ShieldCheck className="w-4 h-4 text-green-500" /> },
  ];

  return (
    <div className="bg-[#131722] rounded-xl p-6 border border-[#2A2E39] shadow-lg flex flex-col gap-6">
      <div className="flex items-center justify-between">
         <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Cpu className="w-5 h-5 text-purple-500" /> AI Scam &amp; Risk Detection
          </h3>
          <p className="text-sm text-gray-400 mt-1">Smart contract analysis &amp; liquidity monitoring</p>
         </div>
         <span className="bg-purple-500/10 text-purple-400 px-3 py-1 rounded-full text-xs font-bold border border-purple-500/20">LIVE ACTIVE</span>
      </div>

      <div className="flex-1 flex flex-col gap-4">
        {scannedTokens.map((token, i) => (
          <div key={i} className="flex items-center justify-between p-4 bg-[#1E222D] rounded-lg border border-[#2A2E39] hover:border-purple-500/30 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#131722] flex items-center justify-center border border-[#2A2E39]">
                {token.icon}
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-white text-sm">{token.name}</span>
                <span className="text-xs text-gray-400 max-w-[200px] truncate" title={token.reason}>{token.reason}</span>
              </div>
            </div>
            
            <div className="flex flex-col items-end">
              <span className={`text-xl font-black ${
                token.score > 80 ? 'text-green-500' :
                token.score > 50 ? 'text-yellow-500' :
                token.score > 30 ? 'text-orange-500' : 'text-red-500'
              }`}>{token.score}/100</span>
              <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Trust Score</span>
            </div>
          </div>
        ))}
      </div>

      <button className="w-full py-3 mt-2 bg-[#2A2E39] hover:bg-[#323744] text-white rounded-lg text-sm font-bold transition-colors">
        Analyze Custom Contract
      </button>
    </div>
  );
}
