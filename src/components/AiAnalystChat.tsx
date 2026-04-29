import { useState, useRef, useEffect } from 'react';
import { Send, User, TrendingUp } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import Markdown from 'react-markdown';

interface AiAnalystChatProps {
  currentBtcPrice: number;
}

interface Message {
  role: 'user' | 'model';
  content: string;
}

export function AiAnalystChat({ currentBtcPrice }: AiAnalystChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'model',
      content: "Hello! I'm your crypto market analyst, powered by real-time data feeds. How can I assist you with market trends, technical analysis, or project fundamentals today?"
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading || isStreaming) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);
    setIsStreaming(true);

    try {
      // Platform env var or user's provided fallback key
      const finalApiKey = localStorage.getItem('user_api_key') || process.env.GEMINI_API_KEY || 'AIzaSyBQWrotiRDJcPg_Y8EfLk-baV91sJ_08x0';
      if (!finalApiKey) {
        throw new Error("GEMINI_API_KEY is missing. Please add it in the top settings box.");
      }
      
      const ai = new GoogleGenAI(
      process.env.GEMINI_BASE_URL ? { 
        apiKey: finalApiKey,
        httpOptions: { baseUrl: process.env.GEMINI_BASE_URL, apiVersion: 'v1alpha' }
      } : { 
        apiKey: finalApiKey,
        httpOptions: { apiVersion: 'v1alpha' }
      }
    );
      
      const systemInstruction = `Act as an advanced crypto market analyst powered by real-time data, similar to models like ChatGPT or Gemini. Your primary goal is to provide accurate, up-to-the-minute market insights, especially regarding market trends, BTC to INR (Indian Rupee) conversions, and fundamental analysis. 
      Always prioritize current, verified data from reliable sources to ensure factual accuracy. Base all calculations on absolute mathematical truths. Never hallucinate facts or give definitive financial advice. 
      LIVE DATA CONTEXT: The current live price of Bitcoin (BTC) is $${currentBtcPrice.toLocaleString()} USD. For BTC to INR calculations, assume an approximate exchange rate of 1 USD = 83.5 INR and calculate the current INR price dynamically.`;

      // Build contents array skipping the initial greeting
      const historyParts = messages.slice(1).map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }]
      }));
      
      historyParts.push({ role: 'user', parts: [{ text: userMessage }] });

      // Add a temporary empty model message that we will stream into
      setMessages(prev => [...prev, { role: 'model', content: '' }]);

      const responseStream = await ai.models.generateContentStream({
        model: 'gemini-3.1-flash-lite-preview',
        contents: historyParts,
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.1, // Ensure accuracy
        }
      });

      let fullText = '';
      let isFirstChunk = true;
      
      for await (const chunk of responseStream) {
        if (isFirstChunk) {
          setIsLoading(false); // Hide the loading bounce animation
          isFirstChunk = false;
        }
        
        // Ensure input stays disabled while streaming
        if (chunk.text) {
          fullText += chunk.text;
          setMessages(prev => {
            const newMessages = [...prev];
            newMessages[newMessages.length - 1] = { role: 'model', content: fullText };
            return newMessages;
          });
        }
      }
      
    } catch (error: any) {
      const errString = typeof error === 'object' ? JSON.stringify(error) : String(error);
      const isQuota = errString.includes('429') || errString.toLowerCase().includes('quota') || errString.includes('RESOURCE_EXHAUSTED');
      if (!isQuota) {
         console.error(error);
      }
      setIsLoading(false);
      setMessages(prev => {
        const _messages = [...prev];
        const lastMsgIndex = _messages.length - 1;
        // If the last message is the empty model message, replace its content 
        if (_messages[lastMsgIndex].role === 'model' && _messages[lastMsgIndex].content === '') {
           _messages[lastMsgIndex] = {
             role: 'model',
             content: `I am currently experiencing too many requests (API Rate Limit Exceeded). Please try again later.`
           };
           return _messages;
        } else {
           return [...prev, { 
             role: 'model', 
             content: `I am currently experiencing too many requests (API Rate Limit Exceeded). Please try again later.` 
           }];
        }
      });
    } finally {
      setIsLoading(false); // In case it failed before first chunk
      setIsStreaming(false);
    }
  };

  return (
    <div id="ai-analyst" className="bg-[#0B0E11] shadow-[0_0_30px_rgba(45,212,191,0.05)] border border-teal-500/20 rounded-xl flex flex-col h-[600px] overflow-hidden relative">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-teal-500/50 to-transparent"></div>
      <div className="flex items-center gap-3 p-4 border-b border-teal-500/10 bg-teal-500/5">
        <div className="w-8 h-8 rounded-full bg-teal-500/20 text-teal-400 border border-teal-500/50 flex items-center justify-center shadow-[0_0_15px_rgba(45,212,191,0.3)]">
          <TrendingUp className="w-4 h-4" />
        </div>
        <div>
          <h3 className="text-sm font-black uppercase tracking-widest text-white shadow-teal-500/50 drop-shadow-md">AI Analyst</h3>
          <span className="text-[10px] text-teal-400 uppercase tracking-widest font-bold">Live Data Connected</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 custom-scrollbar">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
            <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center border ${
              msg.role === 'user' 
                ? 'bg-blue-500/20 border-blue-500/30 text-blue-400' 
                : 'bg-teal-500/10 border-teal-500/30 text-teal-400 shadow-[0_0_10px_rgba(45,212,191,0.2)]'
            }`}>
              {msg.role === 'user' ? <User className="w-4 h-4" /> : <TrendingUp className="w-4 h-4" />}
            </div>
            <div className={`px-4 py-3 rounded-2xl max-w-[85%] text-sm leading-relaxed ${
              msg.role === 'user' 
                ? 'bg-blue-500/10 text-blue-50 rounded-tr-sm border border-blue-500/20' 
                : 'bg-gradient-to-br from-teal-500/10 to-transparent text-white/90 rounded-tl-sm border border-teal-500/20 markdown-body shadow-[inset_0_1px_0_rgba(45,212,191,0.1)]'
            }`}>
              {msg.role === 'model' ? (
                <div className="prose prose-invert prose-sm max-w-none">
                  <Markdown>{msg.content}</Markdown>
                </div>
              ) : (
                msg.content
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-teal-500/10 border border-teal-500/30 flex items-center justify-center flex-shrink-0 shadow-[0_0_10px_rgba(45,212,191,0.2)]">
               <TrendingUp className="w-4 h-4 text-teal-400" />
            </div>
            <div className="px-4 py-3 rounded-2xl bg-teal-500/5 text-teal-400 border border-teal-500/10 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-400/50 animate-bounce shadow-[0_0_5px_rgba(45,212,191,0.5)]" style={{ animationDelay: '0ms' }} />
              <span className="w-1.5 h-1.5 rounded-full bg-teal-400/50 animate-bounce shadow-[0_0_5px_rgba(45,212,191,0.5)]" style={{ animationDelay: '150ms' }} />
              <span className="w-1.5 h-1.5 rounded-full bg-teal-400/50 animate-bounce shadow-[0_0_5px_rgba(45,212,191,0.5)]" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-teal-500/20 bg-teal-500/5">
        <form 
          onSubmit={(e) => { e.preventDefault(); handleSend(); }}
          className="flex items-center gap-2 bg-[#0B0E11] border border-teal-500/30 p-1.5 rounded-xl focus-within:border-teal-400/60 focus-within:shadow-[0_0_10px_rgba(45,212,191,0.2)] transition-all"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about market trends, BTC analysis..."
            disabled={isLoading || isStreaming}
            className="flex-1 bg-transparent border-none outline-none text-sm text-white px-3 placeholder:text-teal-100/30 disabled:opacity-50"
          />
          <button 
            type="submit"
            disabled={!input.trim() || isLoading || isStreaming}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-teal-500/20 text-teal-400 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-teal-500/40 hover:shadow-[0_0_10px_rgba(45,212,191,0.3)] transition-all"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
