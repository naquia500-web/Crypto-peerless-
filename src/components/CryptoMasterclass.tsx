import { useState } from 'react';
import { BookOpen, Sparkles, ChevronRight, GraduationCap } from 'lucide-react';
import Markdown from 'react-markdown';
import OpenAI from 'openai';

export function CryptoMasterclass() {
  const [topic, setTopic] = useState('Trading Basics');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const topics = [
    'Trading Basics',
    'Blockchain Technology',
    'Market Analysis',
    'DeFi Ecosystem',
    'Risk Management'
  ];

  const generateContent = async (selectedTopic: string) => {
    setLoading(true);
    setError(null);
    try {
      const apiKey = localStorage.getItem('user_api_key') || typeof process !== 'undefined' && process.env.OPENROUTER_API_KEY || (typeof process !== 'undefined' && process.env.OPENAI_API_KEY) || import.meta.env.VITE_OPENAI_API_KEY;
      const isOR = apiKey?.startsWith("sk-or-");
      const isGemini = apiKey && !apiKey.startsWith("sk-");
      
      if (!apiKey) {
         throw new Error("Missing API Key. Please provide it in the input box, or add it via Settings.");
      }
      
      const openai = new OpenAI({
         baseURL: isGemini ? "https://generativelanguage.googleapis.com/v1beta/openai/" : isOR ? "https://openrouter.ai/api/v1" : undefined,
         apiKey: apiKey,
         dangerouslyAllowBrowser: true,
         defaultHeaders: isOR ? {
           "HTTP-Referer": window.location.origin,
           "X-Title": "Crypto AI Tools"
         } : undefined
      });
      
      const response = await openai.chat.completions.create({
        model: isGemini ? "gemini-2.5-flash" : isOR ? "openai/gpt-4o-mini" : "gpt-4o-mini", // Fallback to accessible model
        messages: [
          { role: "system", content: "You are an expert Crypto Masterclass AI. Provide comprehensive, accurate educational content about " + selectedTopic + "." },
        ],
        max_tokens: 2000
      });
      
      const generatedContent = response.choices[0]?.message?.content;
      if (!generatedContent) {
         throw new Error("No content generated.");
      }
      
      setContent(generatedContent);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#0B0E11] border border-white/10 rounded-2xl p-6 flex flex-col h-full relative overflow-hidden">
      {/* Background Graphic */}
      <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
        <GraduationCap className="w-64 h-64" />
      </div>

      <div className="flex items-center gap-3 mb-6 relative z-10">
        <div className="p-2.5 bg-blue-500/10 rounded-xl">
          <BookOpen className="w-5 h-5 text-blue-400" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight">Crypto Masterclass</h2>
          <p className="text-xs text-white/50 font-mono mt-0.5">AI-Powered Education Hub</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative z-10">
        <div className="md:col-span-1 flex flex-col gap-2">
          <h3 className="text-[10px] uppercase font-bold tracking-widest text-white/40 mb-2">Curriculum</h3>
          {topics.map(t => (
            <button
              key={t}
              onClick={() => {
                setTopic(t);
                generateContent(t);
              }}
              className={`p-3 text-left rounded-xl border text-sm transition-all focus:outline-none focus:ring-1 focus:ring-blue-500/50 flex justify-between items-center ${
                topic === t ? 'border-blue-500/30 bg-blue-500/10 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.1)]' : 'border-white/5 bg-white/[0.02] text-white/60 hover:bg-white/[0.05]'
              }`}
            >
              <span className="font-medium">{t}</span>
              {topic === t && <ChevronRight className="w-4 h-4" />}
            </button>
          ))}
          {!content && !loading && (
             <div className="mt-4 p-4 rounded-xl border border-white/5 bg-white/[0.02] text-xs text-white/50 text-center flex flex-col items-center gap-2">
               <Sparkles className="w-5 h-5 opacity-50" />
               Select a topic to generate your personalized AI masterclass module.
             </div>
          )}
        </div>

        <div className="md:col-span-3 min-h-[300px] border border-white/5 rounded-xl bg-black/40 p-6 flex flex-col">
          {loading ? (
             <div className="flex-1 flex flex-col items-center justify-center gap-4 text-white/40">
               <Sparkles className="w-8 h-8 animate-pulse text-blue-400/50" />
               <div className="text-sm font-mono animate-pulse text-center">Synthesizing {topic} Module...<br /><span className="text-[10px] opacity-50">Powered by OpenAI</span></div>
             </div>
          ) : error ? (
             <div className="flex-1 flex flex-col items-center justify-center gap-2 text-red-400/80">
               <div className="text-sm border border-red-500/20 bg-red-500/10 p-4 rounded-lg text-center max-w-sm">
                 <span className="font-bold flex items-center justify-center gap-2 mb-2">
                   Error
                 </span>
                 {error}
               </div>
             </div>
          ) : content ? (
             <div className="prose prose-invert prose-sm max-w-none prose-headings:text-white/90 prose-p:text-white/70 prose-a:text-blue-400 overflow-y-auto max-h-[500px] custom-scrollbar pr-4">
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
