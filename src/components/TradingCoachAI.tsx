import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bot, X, Target, ShieldAlert, LineChart, Cpu } from 'lucide-react';
import Markdown from 'react-markdown';

export function TradingCoachAI({ onClose }: { onClose: () => void }) {
  const [isLiveMode, setIsLiveMode] = useState(false);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    const runAnalysis = async () => {
      setIsProcessing(true);
      setAnalysis(null);
      
      try {
        await new Promise(r => setTimeout(r, 1500));
        
        const simulatedAnalysis = `### 🟢 Immediate Setup
Look for entry points near recent support gaps. The orderbook shows strong buy intent below $65k.

### 🛡️ Risk Management
Always calculate your risk-reward ratio before entering a trade. Consider using ATR (Average True Range) for stop-loss placement.

### 🔮 Market Foresight
As for 2030, focus on protocols solving real-world interoperability and scalability.
${isLiveMode ? '\n\n**CRITICAL LIVE ALERT**: Unusual option volume detected. Brace for immediate volatility.' : ''}`;

        setAnalysis(simulatedAnalysis);
      } catch (err: any) {
        setAnalysis("Sorry, I encountered an error running the analysis. Please try again.");
      } finally {
        setIsProcessing(false);
      }
    };
    
    runAnalysis();
  }, [isLiveMode]);

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
      >
        <motion.div 
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          className="bg-white border border-blue-500/20 rounded-2xl w-full max-w-3xl h-[85vh] flex flex-col shadow-2xl relative overflow-hidden"
        >
          {/* Header */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-3xl rounded-full pointer-events-none"></div>
          
          <div className="flex items-center justify-between p-4 border-b border-slate-100 relative z-10 bg-slate-50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-500/50 flex items-center justify-center relative">
                <Bot className="w-5 h-5 text-blue-400" />
                <span className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-green-500 border-2 border-[#0B0E11]"></span>
              </div>
              <div>
                <h3 className="font-bold text-slate-900 tracking-wide">Trading Coach AI</h3>
                <p className="text-[10px] uppercase font-mono text-slate-500 tracking-widest flex items-center gap-1">
                  <Cpu className="w-3 h-3" /> Real-time Guidance Module
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setIsLiveMode(!isLiveMode)}
                className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full flex items-center gap-2 border transition-all ${isLiveMode ? 'bg-red-500/10 text-red-500 border-red-500/50 shadow-[0_0_10px_rgba(239,68,68,0.2)]' : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100'}`}
              >
                {isLiveMode && <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>}
                Live Trading Coach {isLiveMode ? 'ON' : 'OFF'}
              </button>

              <button 
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Analysis View */}
          <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 relative z-10 custom-scrollbar">
            {isProcessing ? (
              <div className="flex flex-col items-center justify-center h-full gap-4 text-blue-400">
                <div className="flex gap-2 items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce"></div>
                  <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
                <span className="text-sm font-mono animate-pulse">Generating Coach Report...</span>
              </div>
            ) : analysis ? (
              <div className="bg-slate-50 border border-slate-200 text-slate-700 rounded-2xl p-6 markdown-body prose prose-invert max-w-none shadow-xl">
                 <div className="flex items-center gap-4 mb-4 pb-4 border-b border-slate-200">
                   <Target className="w-5 h-5 text-green-400" />
                   <ShieldAlert className="w-5 h-5 text-orange-400" />
                   <LineChart className="w-5 h-5 text-purple-400" />
                   <span className="ml-2 text-xs font-bold text-slate-500 uppercase tracking-widest font-mono">Strategy Dashboard Generated</span>
                 </div>
                 <Markdown>{analysis}</Markdown>
              </div>
            ) : null}
          </div>

          {/* Bottom Bar */}
          <div className="p-4 border-t border-slate-100 bg-slate-50 relative z-10 flex flex-col gap-3">
            <div className="flex justify-between items-center px-2 text-[10px] font-mono text-slate-900/40">
              <span className="flex items-center gap-1.5"><ShieldAlert className="w-3 h-3 text-orange-400" /> Risk Warning: Trading involves significant risk.</span>
              <span className="flex items-center gap-1.5"><Bot className="w-3 h-3" /> AI analysis is educational, not financial advice.</span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
