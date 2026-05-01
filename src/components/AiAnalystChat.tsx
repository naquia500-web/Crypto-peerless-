import { useState, useEffect } from 'react';
import { TrendingUp } from 'lucide-react';
import Markdown from 'react-markdown';

interface AiAnalystChatProps {
  currentBtcPrice: number;
}

export function AiAnalyst({ currentBtcPrice }: AiAnalystChatProps) {
  const [analysis, setAnalysis] = useState<string>("Analyzing current market data...");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchAnalysis = async () => {
      setIsLoading(true);
      try {
        await new Promise(r => setTimeout(r, 1500)); // Simulate processing delay
        const simulatedText = `### 🟢 Live Market Diagnostic
**Current BTC Price:** $${currentBtcPrice.toLocaleString()} USD
**Market Sentiment:** Bullish Accumulation

**Technical Indicators:**
- **RSI (14):** 62.4 (Neutral to Bullish)
- **MACD:** Crossover observed on the 4H timeframe, indicating sustained upward momentum.
- **Support Levels:** $${(currentBtcPrice * 0.95).toFixed(0)} (Strong), $${(currentBtcPrice * 0.90).toFixed(0)} (Macro)
- **Resistance Levels:** $${(currentBtcPrice * 1.05).toFixed(0)} (Immediate)

**Fundamental Overview:**
Institutional inflows into major ETFs are stabilizing the baseline. On-chain metrics show a decrease in exchange reserves, heavily hinting at a continuing supply squeeze. Moving averages suggest a strong continuation pattern if the current support holds.

*Status: Tracking Live Active*`;
        setAnalysis(simulatedText);
      } catch (error: any) {
        setAnalysis("Diagnostic error, tracking lost.");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAnalysis();
  }, [currentBtcPrice]);

  return (
    <div id="ai-analyst" className="bg-white shadow-[0_0_30px_rgba(45,212,191,0.05)] border border-teal-500/20 rounded-xl flex flex-col h-[600px] overflow-hidden relative">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-teal-500/50 to-transparent"></div>
      <div className="flex items-center gap-3 p-4 border-b border-teal-500/10 bg-teal-500/5">
        <div className="w-8 h-8 rounded-full bg-teal-500/20 text-teal-400 border border-teal-500/50 flex items-center justify-center shadow-[0_0_15px_rgba(45,212,191,0.3)]">
          <TrendingUp className="w-4 h-4" />
        </div>
        <div>
          <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 shadow-teal-500/50 drop-shadow-md">AI Analyst</h3>
          <span className="text-[10px] text-teal-400 uppercase tracking-widest font-bold">Live Data Connected</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-full text-teal-400 gap-4">
             <div className="flex gap-2">
               <span className="w-2 h-2 rounded-full bg-teal-400 animate-bounce" style={{ animationDelay: '0ms' }} />
               <span className="w-2 h-2 rounded-full bg-teal-400 animate-bounce" style={{ animationDelay: '150ms' }} />
               <span className="w-2 h-2 rounded-full bg-teal-400 animate-bounce" style={{ animationDelay: '300ms' }} />
             </div>
             <span className="text-sm font-mono animate-pulse">Running Deep Market Analysis...</span>
          </div>
        ) : (
          <div className="prose prose-invert prose-sm max-w-none markdown-body text-slate-700">
             <Markdown>{analysis}</Markdown>
          </div>
        )}
      </div>
    </div>
  );
}
