import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Markdown from 'react-markdown';

interface ModelVersion {
  id: string;
  name: string;
  version: string;
  description: string;
  parameters: string;
  status: 'Online' | 'Offline' | 'Training';
  accuracy: number;
  colorHex: string;
}

const AI_MODELS: ModelVersion[] = [
  { id: 'gpt-4o', name: 'GPT-4o (OpenAI)', version: 'latest', description: 'Advanced multimodal reasoning for complex market sentiment and fundamental analysis.', parameters: '1.8T', status: 'Online', accuracy: 99.2, colorHex: '#10a37f' },
  { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro (Google)', version: '1.5', description: 'Massive context window for analyzing years of historical market data and whitepapers simultaneously.', parameters: '1T+', status: 'Online', accuracy: 98.9, colorHex: '#4285F4' },
  { id: 'claude-3-5-sonnet', name: 'Claude 3.5 Sonnet (Anthropic)', version: '3.5', description: 'High-speed, highly intelligent analysis for rapid news summarization and trading insights.', parameters: 'Unknown', status: 'Online', accuracy: 98.7, colorHex: '#D97757' },
  { id: 'claude-3-opus', name: 'Claude 3 Opus', version: '3.0', description: 'Deep reasoning model for macro-economic forecasting and long-term investment strategies.', parameters: 'Unknown', status: 'Online', accuracy: 98.5, colorHex: '#D97757' },
  { id: 'llama-3', name: 'Llama 3 (Meta)', version: '400B', description: 'Open-source powerhouse fine-tuned for crypto and traditional finance quantitative metrics.', parameters: '400B', status: 'Online', accuracy: 97.4, colorHex: '#0668E1' },
  { id: 'grok-1-5', name: 'Grok 1.5 (xAI)', version: '1.5', description: 'Real-time social media sentiment analysis and trend prediction based on live X (Twitter) data.', parameters: '314B', status: 'Online', accuracy: 96.8, colorHex: '#EAEAEA' },
  { id: 'mistral-large-2', name: 'Mistral Large 2', version: '24.07', description: 'State-of-the-art multilingual reasoning for global market developments and regulatory tracking.', parameters: '123B', status: 'Online', accuracy: 97.1, colorHex: '#F97316' },
  { id: 'deepseek-v2', name: 'DeepSeek-V2', version: '2.0', description: 'Highly optimized coding and math model for algorithmic trading script generation and backtesting.', parameters: '236B', status: 'Online', accuracy: 96.5, colorHex: '#4F46E5' },
  { id: 'command-r-plus', name: 'Command R+ (Cohere)', version: '1.0', description: 'Enterprise-grade RAG model for querying external financial databases and extracting structured data.', parameters: '104B', status: 'Online', accuracy: 96.9, colorHex: '#F43F5E' },
  { id: 'nexus-quant', name: 'Nexus Core', version: 'v4.2.1', description: 'Proprietary ensemble engine combining signals from all models for ultimate market intelligence.', parameters: 'Custom', status: 'Online', accuracy: 99.8, colorHex: '#00FF88' }
];

export function AIHouse({ onClose }: { onClose: () => void }) {
  const [activeModel, setActiveModel] = useState<string>(AI_MODELS[0].id);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [marketData, setMarketData] = useState<any[]>([]);
  
  // Real-time market data ticker
  useEffect(() => {
    let lastPrices: Record<string, number> = {};
    
    // Initial fetch
    const fetchMarketData = async () => {
      try {
        const symbols = ['BTCUSDT', 'ETHUSDT', 'SOLUSDT', 'BNBUSDT', 'XRPUSDT', 'ADAUSDT'];
        const res = await fetch(`https://api.binance.com/api/v3/ticker/price`);
        const data = await res.json();
        
        if (Array.isArray(data)) {
           const filtered = data.filter(item => symbols.includes(item.symbol));
           setMarketData(filtered.map(item => {
             const price = parseFloat(item.price);
             const previousPrice = lastPrices[item.symbol] || price;
             lastPrices[item.symbol] = price;
             
             return {
               symbol: item.symbol,
               price: price,
               change: price >= previousPrice ? 'up' : 'down'
             };
           }));
        }
      } catch (err) {
        console.warn('Market data fetch error in AI House:', err);
      }
    };

    fetchMarketData();
    const interval = setInterval(fetchMarketData, 1000); // refresh every second
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const runAnalysis = async () => {
      if (marketData.length === 0) return;
      setIsProcessing(true);
      setAnalysis(null);
      
      try {
        await new Promise(r => setTimeout(r, 1500)); // Simulate AI computation

        const selectedModel = AI_MODELS.find(m => m.id === activeModel);
        const btc = marketData.find(m => m.symbol === 'BTCUSDT');
        const btcPrice = btc ? btc.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : 'Unknown';

        const simulatedReport = `### ${selectedModel?.name} Core Analysis

**System Telemetry:** Live
**Primary Asset Tracking:** BTC at $${btcPrice}

#### Market Microstructure
The current order book depth implies a consolidation phase. Sellers are absorbing buy volume at local highs, while passive bidders defend the lower boundary.

#### Advanced Metrics
*   **Volatility Index:** Expected to compress in the next 12 hours before a directional breakout.
*   **Liquidity Profiling:** Significant liquidity voids exist below current support. Breakdowns may see accelerated downward movement.

*Conclusion:* Maintain Delta neutral strategies until decisive volume invalidates the current range. Monitoring on-chain inflows continuously.`;

        setAnalysis(simulatedReport);
      } catch (err: any) {
         setAnalysis('Connection to distributed neural network lost. Please try again later.');
      } finally {
        setIsProcessing(false);
      }
    };
    
    runAnalysis();
  }, [activeModel, marketData.length > 0]); // Dependency trick to run once market data loads, or model changes

  const activeModelData = AI_MODELS.find(m => m.id === activeModel) || AI_MODELS[0];

  return (
    <div className="fixed inset-0 z-[100] flex bg-[#030406]/95 backdrop-blur-2xl">
      <div className="flex-1 flex flex-col h-full w-full border-x border-white/5 bg-[#050709] shadow-2xl">
        {/* Header */}
        <header className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#0B0E11]/80">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-black italic tracking-tighter uppercase text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]">AI HOUSE</h2>
            <div className="h-4 w-px bg-white/20 hidden sm:block"></div>
            <div className="hidden sm:flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#00FF88] animate-pulse"></div>
              <span className="text-[11px] uppercase tracking-widest font-mono text-white/70">Core Systems Online</span>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 rounded-lg flex items-center justify-center border border-white/5 bg-white/5 hover:bg-white/10 hover:text-yellow-400 hover:border-yellow-400/50 transition-all"
          >
            <svg className="w-5 h-5 text-current" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </header>

        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          {/* Models Sidebar */}
          <div className="w-full lg:w-72 border-r border-white/10 flex flex-col overflow-y-auto bg-[#0A0D10]/50 backdrop-blur-sm z-10 custom-scrollbar">
            <div className="p-4 border-b border-white/5">
              <h3 className="text-[10px] uppercase tracking-widest font-bold text-white/50 mb-3">Neural Architectures</h3>
              <div className="space-y-2">
                {AI_MODELS.map(model => {
                  const isActive = activeModel === model.id;
                  return (
                  <button
                    key={model.id}
                    onClick={() => setActiveModel(model.id)}
                    className={`relative w-full text-left p-2.5 rounded-xl border transition-all duration-300 group ${isActive ? 'bg-black/80 overflow-hidden scale-[1.02]' : 'border-white/5 bg-white/[0.02] hover:bg-white/10'}`}
                    style={isActive ? { borderColor: model.colorHex, boxShadow: `0 0 30px ${model.colorHex}40, inset 0 0 20px ${model.colorHex}20` } : { borderLeftColor: model.colorHex, borderLeftWidth: '3px' }}
                  >
                    {isActive && (
                      <div className="absolute inset-0 z-0 pointer-events-none">
                        <div className="absolute inset-0 opacity-20" style={{ backgroundColor: model.colorHex }}></div>
                        <div className="absolute inset-0 opacity-40 animate-pulse mix-blend-overlay" style={{ background: `linear-gradient(135deg, transparent, ${model.colorHex}, transparent)` }}></div>
                        <div className="absolute -left-1/2 top-0 w-[200%] h-0.5 animate-[spin_3s_linear_infinite]" style={{ background: `linear-gradient(90deg, transparent, ${model.colorHex}, transparent)` }}></div>
                      </div>
                    )}
                    <div className="relative flex justify-between items-center mb-1 z-10">
                      <span className={`text-[11px] font-black uppercase tracking-wider transition-all duration-300 ${isActive ? 'translate-x-1' : 'group-hover:translate-x-1'}`} style={isActive ? { color: '#ffffff', textShadow: `0 0 10px ${model.colorHex}, 0 0 20px ${model.colorHex}, 0 0 30px ${model.colorHex}` } : { color: model.colorHex, textShadow: `0 0 8px ${model.colorHex}60` }}>{model.name}</span>
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-black/80" style={isActive ? { color: '#fff', textShadow: `0 0 5px ${model.colorHex}`, border: `1px solid ${model.colorHex}50`, boxShadow: `0 0 10px ${model.colorHex}40` } : { color: 'rgba(255,255,255,0.6)' }}>{model.version}</span>
                    </div>
                    <p className="relative text-[10px] text-white/70 leading-snug mb-2 line-clamp-1 z-10 font-medium" style={isActive ? { textShadow: `0 0 15px ${model.colorHex}80` } : {}}>{model.description}</p>
                    <div className="relative flex justify-between items-end text-[9px] font-mono text-white/50 z-10">
                      <span>[{model.parameters}]</span>
                      <span className={`px-1 py-0.5 rounded backdrop-blur-sm ${model.status === 'Online' ? 'text-[#00FF88] bg-[#00FF88]/10' : 'text-yellow-500 bg-yellow-500/10'}`} style={isActive ? { boxShadow: `0 0 10px ${model.colorHex}30` } : {}}>{model.status}</span>
                    </div>
                  </button>
                  );
                })}
              </div>
            </div>
            
            {/* Live Data Feed inside Sidebar */}
            <div className="p-4 flex-1">
              <h3 className="text-[10px] uppercase tracking-widest font-bold text-white/50 mb-3 flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full animate-ping"></div>
                Live Telemetry
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {marketData.length > 0 ? marketData.map((data) => (
                  <div key={data.symbol} className="flex flex-col p-2.5 rounded-lg border border-white/5 bg-[#12161A] font-mono shadow-sm">
                    <span className="text-white/60 text-[9px] mb-1">{data.symbol.replace('USDT', '')}</span>
                    <AnimatePresence mode="popLayout">
                      <motion.span 
                        key={`${data.price}`}
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`text-xs font-bold ${data.change === 'up' ? 'text-[#00FF88]' : 'text-[#FF4D4D]'}`}
                      >
                        ${data.price.toFixed(2)}
                      </motion.span>
                    </AnimatePresence>
                  </div>
                )) : (
                  <div className="col-span-2 text-xs text-white/30 font-mono text-center py-4 bg-white/5 rounded-lg border border-white/5">Initializing datastream...</div>
                )}
              </div>
            </div>
          </div>

          {/* Main Interface */}
          <div className="flex-1 flex flex-col relative overflow-hidden bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] bg-opacity-20 before:absolute before:inset-0 before:bg-[#050709]/95 z-0">
            {/* Analysis Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth z-10 w-full flex justify-center items-start custom-scrollbar">
              {isProcessing || marketData.length === 0 ? (
                <div className="mt-20 flex flex-col items-center">
                   <div 
                      className="w-12 h-12 border-4 rounded-full animate-spin mb-4"
                      style={{ borderRightColor: activeModelData.colorHex, borderTopColor: activeModelData.colorHex, borderBottomColor: `transparent`, borderLeftColor: `transparent` }}
                   ></div>
                   <span className="text-sm font-mono font-bold text-white/70 uppercase tracking-widest animate-pulse">Running {activeModelData.name} Analysis...</span>
                </div>
              ) : analysis ? (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="w-full max-w-4xl"
                >
                  <div 
                     className="rounded-2xl p-6 shadow-xl bg-[#1A1F26] text-white/90 shadow-black/80 w-full"
                     style={{ borderLeftColor: activeModelData.colorHex, borderLeftWidth: '4px', borderTopColor: 'rgba(255,255,255,0.05)', borderRightColor: 'rgba(255,255,255,0.05)', borderBottomColor: 'rgba(255,255,255,0.05)', borderStyle: 'solid' }}
                  >
                    <div className="flex items-center gap-2 mb-4 border-b border-white/5 pb-3">
                      <span 
                         className="text-[12px] font-mono tracking-widest uppercase font-bold"
                         style={{ color: activeModelData.colorHex, textShadow: `0 0 5px ${activeModelData.colorHex}40` }}
                      >
                        {activeModelData.name} LIVE ANALYSIS REPORT
                      </span>
                      <span className="text-[10px] font-mono opacity-30">
                        {new Date().toLocaleTimeString()}
                      </span>
                    </div>
                    <div className="prose prose-invert max-w-none text-sm/relaxed markdown-body">
                      <Markdown>{analysis}</Markdown>
                    </div>
                  </div>
                </motion.div>
              ) : null}
            </div>

            {/* Bottom Status Bar */}
            <div className="p-4 border-t border-white/10 bg-[#0B0E11]/90 backdrop-blur-md z-10 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
              <div className="flex items-center justify-between text-[10px] font-mono text-white/40 px-2 uppercase tracking-wide">
                <span>Telemetry frequency: 1000ms</span>
                <span className="flex items-center gap-2">Active Node: <span className="text-yellow-400/80 font-bold">{activeModelData.name}</span></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
