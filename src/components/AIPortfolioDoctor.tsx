import { useState } from 'react';
import { Stethoscope, ShieldCheck, Activity, Link as LinkIcon, RefreshCw, AlertTriangle } from 'lucide-react';
import Markdown from 'react-markdown';

interface PortfolioData {
  asset: string;
  amount: number;
  value: number;
}

export function AIPortfolioDoctor() {
  const [isConnected, setIsConnected] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState('');

  // Mock portfolio for demonstration (in reality this would fetch from a connected wallet)
  const [portfolio] = useState<PortfolioData[]>([
    { asset: 'BTC', amount: 0.5, value: 38341.75 },
    { asset: 'ETH', amount: 4.2, value: 12400.20 },
    { asset: 'SOL', amount: 150, value: 21000.00 },
    { asset: 'DOGE', amount: 10000, value: 1500.00 },
  ]);

  const totalValue = portfolio.reduce((sum, item) => sum + item.value, 0);

  const connectWallet = () => {
    setIsConnected(true);
  };

  const runAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      await new Promise(r => setTimeout(r, 1500)); // Simulate AI computation delay
      
      const btcPercent = ((portfolio.find(a => a.asset === 'BTC')?.value || 0) / totalValue * 100).toFixed(1);
      const ethPercent = ((portfolio.find(a => a.asset === 'ETH')?.value || 0) / totalValue * 100).toFixed(1);
      
      const simulatedAnalysis = `### 🩺 Portfolio Health Report

**Overall Status:** Moderately Healthy 
**Risk Profile:** Medium-High

#### Asset Allocation Breakdown
*   **Top Heavy:** Your portfolio is heavily concentrated in Bitcoin (${btcPercent}%) and Ethereum (${ethPercent}%). This provides a strong, relatively stable foundation but restricts extreme upside potential.
*   **Meme Coin Exposure:** Holding DOGE exposes you to high volatility. Ensure this represents only capital you are willing to lose entirely.

#### Diversification Score: 72/100
You lack exposure to emerging sectors such as Layer-2 scaling solutions, Real World Assets (RWA), or AI-focused tokens. 

#### Doctor's Recommendations
1.  **Rebalance:** Maintain your strong BTC foundation, but consider securing some profits from SOL to reallocate into lower-cap projects if your goal is aggressive growth.
2.  **Risk Management:** Set structural stop-losses on altcoins like DOGE to protect against sudden market drawdowns.
3.  **Explore Yield:** Your ETH could be staked to generate passive yield, compounding your holdings over time.`;

      setAnalysis(simulatedAnalysis);
    } catch (err: any) {
      setAnalysis("Diagnostic error, tracking lost.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="bg-[#131722] border border-[#2A2E39] rounded-2xl p-6 flex flex-col h-full relative overflow-hidden">
      <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
        <Stethoscope className="w-64 h-64" />
      </div>

      <div className="flex justify-between items-start mb-6 relative z-10">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-teal-500/10 rounded-xl">
            <Stethoscope className="w-5 h-5 text-teal-400" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">AI Portfolio Doctor</h2>
            <p className="text-xs text-[#787B86] font-mono mt-0.5">Secure Analysis & Diversification</p>
          </div>
        </div>
        
        {!isConnected ? (
          <button 
            onClick={connectWallet}
            className="flex items-center gap-2 px-4 py-2 bg-[#1E222D] hover:bg-[#2A2E39] border border-[#2A2E39] rounded-lg text-xs font-bold uppercase tracking-widest text-[#787B86] transition-colors"
          >
            <LinkIcon className="w-3.5 h-3.5" />
            Connect Portfolio
          </button>
        ) : (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-teal-500/10 border border-teal-500/20 rounded-lg text-xs font-bold uppercase tracking-widest text-teal-400">
            <ShieldCheck className="w-3.5 h-3.5" />
            Connected
          </div>
        )}
      </div>

      {!isConnected ? (
        <div className="flex-1 flex flex-col items-center justify-center p-8 border border-dashed border-[#2A2E39] rounded-xl bg-[#1E222D]">
          <Activity className="w-12 h-12 text-white/20 mb-4" />
          <p className="text-sm text-[#787B86] text-center max-w-sm">Connect your exchange or wallet to allow the AI Doctor to scan your holdings and provide personalized health checks.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative z-10">
          <div className="lg:col-span-1 flex flex-col gap-4">
            <div className="bg-[#1E222D] border border-[#2A2E39] rounded-xl p-4">
              <h3 className="text-[10px] uppercase font-bold tracking-widest text-white/40 mb-3">Current Holdings</h3>
              <div className="text-2xl font-bold font-mono text-white mb-4">
                ${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </div>
              <div className="flex flex-col gap-2">
                {portfolio.map(asset => (
                  <div key={asset.asset} className="flex justify-between items-center text-sm border-b border-[#2A2E39] pb-2 last:border-0 last:pb-0">
                    <span className="font-bold text-[#787B86]">{asset.asset}</span>
                    <span className="font-mono text-[#787B86]">${asset.value.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <button 
              onClick={runAnalysis}
              disabled={isAnalyzing}
              className="w-full py-3 bg-teal-500/10 hover:bg-teal-500/20 border border-teal-500/30 rounded-xl text-teal-400 text-xs font-bold uppercase tracking-widest transition-all focus:outline-none focus:ring-1 focus:ring-teal-500/50 flex justify-center items-center gap-2"
            >
              {isAnalyzing ? (
                <><RefreshCw className="w-4 h-4 animate-spin text-teal-400" /> Analyzing...</>
              ) : (
                <><Activity className="w-4 h-4" /> Run Health Check</>
              )}
            </button>
          </div>

          <div className="lg:col-span-2 min-h-[300px] border border-[#2A2E39] rounded-xl bg-[#1E222D] p-6 flex flex-col">
            {isAnalyzing ? (
              <div className="flex-1 flex flex-col items-center justify-center gap-4 text-white/40">
                 <Stethoscope className="w-8 h-8 animate-pulse text-teal-400/50" />
                 <div className="text-sm font-mono animate-pulse text-center">Diagnosing Portfolio Risk Profile...</div>
              </div>
            ) : analysis ? (
              <div className="prose prose-invert prose-sm max-w-none prose-headings:text-[#B2B5BE] prose-p:text-[#787B86] prose-a:text-teal-400 prose-strong:text-white overflow-y-auto max-h-[500px] custom-scrollbar pr-4">
                 <div className="markdown-body">
                   <Markdown>{analysis}</Markdown>
                 </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center gap-4 opacity-30">
                  <ShieldCheck className="w-12 h-12" />
                  <span className="text-sm font-mono text-center max-w-xs">Run a health check to receive institutional-grade risk and diversification advice.</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
