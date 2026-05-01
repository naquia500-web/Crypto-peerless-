import { useState } from 'react';
import { BookOpen, Sparkles, ChevronRight, GraduationCap } from 'lucide-react';
import Markdown from 'react-markdown';

export function CryptoMasterclass() {
  const [topic, setTopic] = useState('Trading Basics');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  const topics = [
    'Trading Basics',
    'Blockchain Technology',
    'Market Analysis',
    'DeFi Ecosystem',
    'Risk Management'
  ];

  const generateContent = async (selectedTopic: string) => {
    setLoading(true);
    try {
      await new Promise(r => setTimeout(r, 1200)); // Simulate generation
      
      const simulatedData: Record<string, string> = {
        'Trading Basics': `## Mastering Trading Basics

Welcome to the foundation of crypto trading. Here we cover the absolute essentials you need before deploying capital.

### 1. Market Orders vs Limit Orders
- **Market Order:** Buy or sell immediately at the best available current price. Use this when speed is more important than the exact price.
- **Limit Order:** Buy or sell at a specific price or better. Use this to control your entry and exit points precisely.

### 2. Candlestick Anatomy
Candle bodies show the open and close, while the wicks (shadows) show the high and low of that period. A green candle means the close was higher than the open.

### 3. Support and Resistance
- **Support:** A price level where a downtrend tends to pause due to a concentration of demand.
- **Resistance:** A price level where an uptrend tends to pause due to a concentration of supply.`,
        'Blockchain Technology': `## Understanding Blockchain Technology

The underlying architecture powering cryptocurrencies.

### Decentralized Ledgers
At its core, a blockchain is a distributed database that is shared among the nodes of a computer network. 

### Cryptographic Hashing
Blocks are securely linked using cryptographic hashes. Once data has been recorded in a given block, it cannot be altered retroactively without the alteration of all subsequent blocks.

### Consensus Mechanisms
- **Proof of Work (PoW):** Requires computational energy (mining). E.g., Bitcoin.
- **Proof of Stake (PoS):** Validators lock capital to secure the network. E.g., Ethereum.`,
        'Market Analysis': `## Deep Dive: Market Analysis

To anticipate market movements, you need to combine different analysis methods.

### Fundamental Analysis (FA)
Evaluating the intrinsic value of an asset. Look at the tokenomics, team, use cases, regulatory environment, and on-chain metrics (active addresses, transaction volume).

### Technical Analysis (TA)
Statistical trends gathered from trading activity, such as price movement and volume.
* **Moving Averages (MA):** Smooths out price data.
* **RSI (Relative Strength Index):** Measures momentum (oversold vs overbought).

### Sentiment Analysis
Gauging the mood of the market. Often measured through social volume or the Fear & Greed Index.`
      };

      const defaultContent = `## ${selectedTopic}\n\nThis is an accelerated learning module for **${selectedTopic}**.\n\n### Core Concepts\n* Topic introduction and historical context.\n* Key mechanisms and structural overview.\n* Best practices and modern applications.\n\nKeep reviewing your curriculum to master these elements.`;

      setContent(simulatedData[selectedTopic] || defaultContent);
    } catch (err: any) {
      setContent("Module generation failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col h-full relative overflow-hidden">
      {/* Background Graphic */}
      <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
        <GraduationCap className="w-64 h-64" />
      </div>

      <div className="flex items-center gap-3 mb-6 relative z-10">
        <div className="p-2.5 bg-blue-500/10 rounded-xl">
          <BookOpen className="w-5 h-5 text-blue-400" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">Crypto Masterclass</h2>
          <p className="text-xs text-slate-500 font-mono mt-0.5">AI-Powered Education Hub</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative z-10">
        <div className="md:col-span-1 flex flex-col gap-2">
          <h3 className="text-[10px] uppercase font-bold tracking-widest text-slate-900/40 mb-2">Curriculum</h3>
          {topics.map(t => (
            <button
              key={t}
              onClick={() => {
                setTopic(t);
                generateContent(t);
              }}
              className={`p-3 text-left rounded-xl border text-sm transition-all focus:outline-none focus:ring-1 focus:ring-blue-500/50 flex justify-between items-center ${
                topic === t ? 'border-blue-500/30 bg-blue-500/10 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.1)]' : 'border-slate-100 bg-slate-50 text-slate-500 hover:bg-slate-50'
              }`}
            >
              <span className="font-medium">{t}</span>
              {topic === t && <ChevronRight className="w-4 h-4" />}
            </button>
          ))}
          {!content && !loading && (
             <div className="mt-4 p-4 rounded-xl border border-slate-100 bg-slate-50 text-xs text-slate-500 text-center flex flex-col items-center gap-2">
               <Sparkles className="w-5 h-5 opacity-50" />
               Select a topic to generate your personalized AI masterclass module.
             </div>
          )}
        </div>

        <div className="md:col-span-3 min-h-[300px] border border-slate-100 rounded-xl bg-slate-50 p-6 flex flex-col">
          {loading ? (
             <div className="flex-1 flex flex-col items-center justify-center gap-4 text-slate-900/40">
               <Sparkles className="w-8 h-8 animate-pulse text-blue-400/50" />
               <div className="text-sm font-mono animate-pulse text-center">Synthesizing {topic} Module...</div>
             </div>
          ) : content ? (
             <div className="prose prose-invert prose-sm max-w-none prose-headings:text-slate-700 prose-p:text-slate-500 prose-a:text-blue-400 overflow-y-auto max-h-[500px] custom-scrollbar pr-4">
                 <div className="markdown-body">
                   <Markdown>{content}</Markdown>
                 </div>
             </div>
          ) : (
             <div className="flex-1 flex flex-col items-center justify-center gap-4 opacity-30">
                <BookOpen className="w-12 h-12" />
                <span className="text-sm font-mono">Module Content Area</span>
             </div>
          )}
        </div>
      </div>
    </div>
  );
}
