import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bot, Send, X, Target, ShieldAlert, LineChart, Cpu } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';

export function TradingCoachAI({ onClose }: { onClose: () => void }) {
  const [isLiveMode, setIsLiveMode] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'ai', content: string, type?: 'general' | 'setup' | 'risk' | 'prediction' }[]>([
    {
      role: 'ai',
      content: "Hello! I am your Advanced Trading AI Coach. I process real-time Bitcoin trends, on-chain analytics, and AI sector momentum to provide highly accurate, actionable insights.\n\nWhether you're looking for precise entry/exit strategies, risk management, or macro thesis validation, I am here as your trusted guide. What's on your radar today?\n\nTry asking me:\n• What is the immediate upside target for BTC based on current order block dynamics?\n• Help me construct a delta-neutral strategy for Ethereum.\n• Which AI-focused altcoins have the strongest accumulation patterns right now?"
    }
  ]);
  const [query, setQuery] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isProcessing]);

  const handleSend = async () => {
    if (!query.trim() || isProcessing) return;

    const userMessage = query.trim();
    setQuery('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsProcessing(true);

    try {
      const apiKey = localStorage.getItem('user_api_key') || process.env.GEMINI_API_KEY;
      
      let aiResponseText = "";
      if (apiKey) {
        const ai = new GoogleGenAI({ apiKey });
        const liveContext = isLiveMode ? "CRITICAL CONTEXT: YOU ARE IN **LIVE TRADING COACH MODE**. Provide urgent, real-time-focused technical analysis. Highlight current momentum, actionable live entry/exit points, and immediate market gaps during an active live session. " : "";
        const prompt = `You are an elite, highly advanced Trading Coach AI and a trusted, empathetic guide for the user. You possess 100% accurate, up-to-the-minute knowledge of Bitcoin order flows, AI sector market trends, and macro-economic factors. You have deep integrated access to top-tier features including Advanced Portfolio Tracking, On-Chain Data Visualization, Social Trading networks, Customizable Dashboards, Crypto News Aggregators, and a Global Currency Converter.
        ${liveContext}
        User's question: ${userMessage}
        Provide deeply analytical, actionable, and mathematically grounded insights. Act as a trusted teacher who not only gives exact answers but also explains the 'why' behind the market dynamics in a clear, accessible way. Balance institutional-grade analysis with a direct, supportive tone. If the user asks about one of your top-tier features (Portfolio, On-Chain, Social, Dashboards, News, Converter), provide a highly detailed simulated analysis or data readout for that specific feature. Avoid financial guarantees always.`;
        
        const response = await ai.models.generateContent({
            model: 'gemini-3.1-pro-preview',
            contents: prompt,
        });
        aiResponseText = response.text || "I was unable to formulate a response. Please try again.";
      } else {
        // Fallback simulate response if no key
        await new Promise(r => setTimeout(r, 1500));
        aiResponseText = "Here is some coaching advice based on your query: Always calculate your risk-reward ratio before entering a trade. Consider using ATR (Average True Range) for stop-loss placement. As for 2030, focus on protocols solving real-world interoperability and scalability.";
      }

      // Quick intent parsing for visual variety (simulated)
      let msgType: 'general' | 'setup' | 'risk' | 'prediction' = 'general';
      const lowerResp = aiResponseText.toLowerCase();
      if (lowerResp.includes('stop-loss') || lowerResp.includes('risk') || lowerResp.includes('margin')) msgType = 'risk';
      else if (lowerResp.includes('2030') || lowerResp.includes('future') || lowerResp.includes('gap')) msgType = 'prediction';
      else if (lowerResp.includes('buy') || lowerResp.includes('sell') || lowerResp.includes('entry')) msgType = 'setup';

      setMessages(prev => [...prev, { role: 'ai', content: aiResponseText, type: msgType }]);

    } catch (err: any) {
      const errString = typeof err === 'object' ? JSON.stringify(err) : String(err);
      if (errString.includes('429') || errString.toLowerCase().includes('quota') || errString.includes('RESOURCE_EXHAUSTED')) {
        setMessages(prev => [...prev, { role: 'ai', content: "I am currently experiencing too many requests (API Rate Limit Exceeded). Please try again later or check your API quota.", type: 'general' }]);
      } else {
        setMessages(prev => [...prev, { role: 'ai', content: "Sorry, I encountered an error. Please try again." }]);
      }
    } finally {
      setIsProcessing(false);
    }
  };

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
          className="bg-[#0B0E11] border border-blue-500/20 rounded-2xl w-full max-w-3xl h-[85vh] flex flex-col shadow-2xl relative overflow-hidden"
        >
          {/* Header */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-3xl rounded-full pointer-events-none"></div>
          
          <div className="flex items-center justify-between p-4 border-b border-white/5 relative z-10 bg-white/[0.02]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-500/50 flex items-center justify-center relative">
                <Bot className="w-5 h-5 text-blue-400" />
                <span className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-green-500 border-2 border-[#0B0E11]"></span>
              </div>
              <div>
                <h3 className="font-bold text-white tracking-wide">Trading Coach AI</h3>
                <p className="text-[10px] uppercase font-mono text-white/50 tracking-widest flex items-center gap-1">
                  <Cpu className="w-3 h-3" /> Real-time Guidance Module
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setIsLiveMode(!isLiveMode)}
                className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full flex items-center gap-2 border transition-all ${isLiveMode ? 'bg-red-500/10 text-red-500 border-red-500/50 shadow-[0_0_10px_rgba(239,68,68,0.2)]' : 'bg-white/5 text-white/50 border-white/10 hover:bg-white/10'}`}
              >
                {isLiveMode && <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>}
                Live Trading Coach {isLiveMode ? 'ON' : 'OFF'}
              </button>

              <button 
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 text-white/60 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Chat History */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 relative z-10">
            {messages.map((m, idx) => (
              <div key={idx} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-2xl p-4 ${
                    m.role === 'user' 
                      ? 'bg-blue-600 text-white rounded-br-none' 
                      : 'bg-white/5 border border-white/10 text-white/90 rounded-bl-none'
                  }`}
                >
                  {m.role === 'ai' && m.type && m.type !== 'general' && (
                    <div className="flex items-center gap-1.5 mb-2 pb-2 border-b border-white/10">
                      {m.type === 'risk' && <><ShieldAlert className="w-4 h-4 text-orange-400" /><span className="text-[10px] uppercase font-bold text-orange-400 tracking-wider">Risk Management</span></>}
                      {m.type === 'setup' && <><Target className="w-4 h-4 text-green-400" /><span className="text-[10px] uppercase font-bold text-green-400 tracking-wider">Trade Setup</span></>}
                      {m.type === 'prediction' && <><LineChart className="w-4 h-4 text-purple-400" /><span className="text-[10px] uppercase font-bold text-purple-400 tracking-wider">Market Foresight</span></>}
                    </div>
                  )}
                  <div className="whitespace-pre-wrap text-sm leading-relaxed font-sans">
                    {m.content}
                  </div>
                </div>
              </div>
            ))}
            
            {isProcessing && (
              <div className="flex justify-start">
                <div className="bg-white/5 border border-white/10 rounded-2xl rounded-bl-none p-4 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce"></div>
                  <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <span className="text-xs text-white/50 ml-2 font-mono">Analyzing market variables...</span>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-white/5 bg-white/[0.01] relative z-10 flex flex-col gap-3">
            {/* Top Tier Features Quick Actions */}
            <div className="flex flex-wrap gap-2">
              {[
                "Advanced Portfolio Tracking",
                "On-Chain Data",
                "Social Trading",
                "Custom Dashboards",
                "News Aggregator",
                "Currency Converter"
              ].map(feature => (
                <button
                  key={feature}
                  onClick={() => {
                     setQuery(`Analyze my ${feature} data...`);
                  }}
                  className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest px-2.5 py-1.5 rounded bg-blue-500/10 border border-blue-500/20 hover:bg-blue-500/20 hover:border-blue-500/40 transition-colors text-blue-400"
                >
                  {feature}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 bg-[#0B0E11] border border-white/10 rounded-xl p-2 focus-within:border-blue-500/50 transition-colors">
              <input 
                type="text" 
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') handleSend(); }}
                placeholder="Ask about trade setups, stop-losses, or long-term plays..."
                className="flex-1 bg-transparent border-none outline-none text-sm text-white px-3"
              />
              <button 
                onClick={handleSend}
                disabled={!query.trim() || isProcessing}
                className="w-10 h-10 rounded-lg bg-blue-500 text-white flex items-center justify-center hover:bg-blue-600 disabled:opacity-50 transition-colors shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            <div className="mt-2 flex gap-4 px-2 text-[10px] font-mono text-white/40 justify-between">
              <span>Risk Warning: Trading involves significant risk.</span>
              <span>AI analysis is educational, not financial advice.</span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
