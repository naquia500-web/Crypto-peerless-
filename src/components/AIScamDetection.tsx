import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, ShieldAlert, Cpu, AlertTriangle, Search, Loader2 } from 'lucide-react';

export function AIScamDetection() {
  const [address, setAddress] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  
  const initialTokens = [
    { name: 'PepeDog (PEPEDOG)', risk: 'Extreme', score: 12, reason: 'Honeypot detected in contract', icon: <AlertTriangle className="w-4 h-4 text-red-500" /> },
    { name: 'Solana (SOL)', risk: 'Safe', score: 98, reason: 'Verified open source & high liquidity', icon: <ShieldCheck className="w-4 h-4 text-green-500" /> },
    { name: 'YieldMax (YMAX)', risk: 'High', score: 35, reason: 'Developer wallet holds 80% supply', icon: <ShieldAlert className="w-4 h-4 text-orange-500" /> },
    { name: 'Aptos (APT)', risk: 'Safe', score: 92, reason: 'Audited by top tier firm', icon: <ShieldCheck className="w-4 h-4 text-green-500" /> },
    { name: 'SafeMoon V3', risk: 'Medium', score: 55, reason: 'High buy/sell tax detected', icon: <ShieldAlert className="w-4 h-4 text-yellow-500" /> },
    { name: 'Ethereum (ETH)', risk: 'Safe', score: 99, reason: 'Decentralized and highly secure', icon: <ShieldCheck className="w-4 h-4 text-green-500" /> },
    { name: 'ElonMarsCoin', risk: 'Extreme', score: 5, reason: 'Mint function unprotected and hidden mints', icon: <AlertTriangle className="w-4 h-4 text-red-500" /> },
    { name: 'Arbitrum (ARB)', risk: 'Safe', score: 95, reason: 'L2 contract audited by Offchain Labs', icon: <ShieldCheck className="w-4 h-4 text-green-500" /> },
  ];

  const [scannedTokens, setScannedTokens] = useState<any[]>(initialTokens.slice(0, 4));

  useEffect(() => {
    const updateTokens = () => {
      const now = new Date();
      const windowMs = 2 * 60 * 60 * 1000; // 2 hours
      const currentEpochPeriod = Math.floor(now.getTime() / windowMs);
      
      const startIndex = (currentEpochPeriod * 4) % initialTokens.length;
      const selected = [];
      for (let i = 0; i < 4; i++) {
        selected.push(initialTokens[(startIndex + i) % initialTokens.length]);
      }
      setScannedTokens(selected);
    };

    updateTokens();
    const interval = setInterval(updateTokens, 60000); // Check every minute if epoch changed
    return () => clearInterval(interval);
  }, []);

  const handleScan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.trim()) return;
    
    setIsScanning(true);
    
    // Simulate API call
    setTimeout(() => {
      const generatedScore = Math.floor(Math.random() * 100);
      let risk, reason, icon;
      
      if (generatedScore > 80) {
        risk = 'Safe';
        reason = 'No major risks detected';
        icon = <ShieldCheck className="w-4 h-4 text-green-500" />;
      } else if (generatedScore > 50) {
        risk = 'Medium';
        reason = 'Some centralized functions found';
        icon = <ShieldAlert className="w-4 h-4 text-yellow-500" />;
      } else if (generatedScore > 30) {
        risk = 'High';
        reason = 'Unverifiable liquidity pool';
        icon = <ShieldAlert className="w-4 h-4 text-orange-500" />;
      } else {
        risk = 'Extreme';
        reason = 'Mint function is unprotected';
        icon = <AlertTriangle className="w-4 h-4 text-red-500" />;
      }

      setScannedTokens(prev => [
        { 
          name: `${address.substring(0, 6)}...${address.substring(address.length - 4)}`, 
          risk, 
          score: generatedScore, 
          reason, 
          icon 
        },
        ...prev.slice(0, 3) // Keep only top 4
      ]);
      setAddress('');
      setIsScanning(false);
    }, 1500);
  };

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

      <div className="flex-1 flex flex-col gap-4 overflow-y-auto pr-2 no-scrollbar">
        {scannedTokens.map((token, i) => (
          <div key={i} className="flex items-center justify-between p-4 bg-[#1E222D] rounded-lg border border-[#2A2E39] hover:border-purple-500/30 transition-colors">
            <div className="flex items-center gap-3 w-3/4">
              <div className="w-10 h-10 rounded-full bg-[#131722] flex items-center justify-center border border-[#2A2E39] shrink-0">
                {token.icon}
              </div>
              <div className="flex flex-col overflow-hidden">
                <span className="font-bold text-white text-sm truncate">{token.name}</span>
                <span className="text-xs text-gray-400 truncate" title={token.reason}>{token.reason}</span>
              </div>
            </div>
            
            <div className="flex flex-col items-end shrink-0 pl-2">
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

      <form onSubmit={handleScan} className="mt-2 text-sm font-bold transition-colors w-full">
         <div className="relative flex items-center">
            <Search className="w-4 h-4 text-gray-400 absolute left-3" />
            <input 
              type="text" 
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Paste contract address (e.g. 0x...)" 
              className="w-full bg-[#1E222D] border border-[#2A2E39] rounded-l-lg py-3 pl-9 pr-3 text-white focus:outline-none focus:border-purple-500"
              disabled={isScanning}
            />
            <button 
              type="submit" 
              disabled={isScanning || !address.trim()}
              className="py-3 px-4 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-600/50 text-white rounded-r-lg font-bold transition-colors whitespace-nowrap flex items-center justify-center min-w-[100px]"
            >
              {isScanning ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Analyze'}
            </button>
         </div>
      </form>
    </div>
  );
}
