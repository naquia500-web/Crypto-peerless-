import { motion, AnimatePresence } from 'motion/react';
import { X, Bot, Sparkles, TrendingUp, Clock } from 'lucide-react';
import { useState, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';

interface ArticleModalProps {
  isOpen: boolean;
  onClose: () => void;
  article: any;
}

export function ArticleModal({ isOpen, onClose, article }: ArticleModalProps) {
  const [detailedAnalysis, setDetailedAnalysis] = useState<string>('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && article && !detailedAnalysis) {
      generateAnalysis();
    }
  }, [isOpen, article]);

  const generateAnalysis = async () => {
    try {
      setLoading(true);
      const finalApiKey = process.env.GEMINI_API_KEY || 'AIzaSyBQWrotiRDJcPg_Y8EfLk-baV91sJ_08x0';
      if (!finalApiKey) throw new Error('API Key missing');

      const ai = new GoogleGenAI(
      process.env.GEMINI_BASE_URL ? { 
        apiKey: finalApiKey,
        httpOptions: { baseUrl: process.env.GEMINI_BASE_URL, apiVersion: 'v1alpha' }
      } : { 
        apiKey: finalApiKey,
        httpOptions: { apiVersion: 'v1alpha' }
      }
    );
      const prompt = `You are a powerful AI Agent named Nexus. Provide a detailed, professional, institutional-grade analysis in English about this crypto market news:
Headline: ${article?.title}
Symbol: ${article?.symbol || 'Crypto'}
Brief: ${article?.description}

Write a comprehensive 3-paragraph detailed description of what this means for the market, investors, and the future outlook. Ensure the tone is highly professional and accurate. Format the output elegantly using markdown.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.1-flash-lite-preview',
        contents: prompt,
        config: { temperature: 0.7 }
      });

      setDetailedAnalysis(response.text || 'Analysis unavailable.');
    } catch (error: any) {
      const errString = typeof error === 'object' ? JSON.stringify(error) : String(error);
      const isQuota = errString.includes('429') || errString.toLowerCase().includes('quota') || errString.includes('RESOURCE_EXHAUSTED');
      if (!isQuota) {
         console.warn("Failed to generate article analysis.", error);
      }
      setDetailedAnalysis('**API Quota Exceeded (429 - Resource Exhausted).**\n\nI am currently experiencing too many requests. Please try again later or check your API quota.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-4xl max-h-[90vh] bg-[#0B0E11] rounded-2xl border border-teal-500/30 shadow-[0_0_50px_rgba(45,212,191,0.1)] flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="flex justify-between items-center p-6 border-b border-white/10 shrink-0">
            <div className="flex items-center gap-3">
               <div className="w-10 h-10 rounded-full bg-teal-500/20 flex items-center justify-center border border-teal-500/40">
                  <Bot className="w-5 h-5 text-teal-400" />
               </div>
               <div>
                 <h2 className="text-lg font-black uppercase tracking-widest text-white shadow-teal-500/50">NEXUS AI <span className="text-teal-400">DEEP ANALYSIS</span></h2>
                 <p className="text-xs text-white/50 uppercase tracking-wider font-mono">Autonomous Contextual Intel</p>
               </div>
            </div>
            <button 
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors border border-white/10"
            >
              <X className="w-5 h-5 text-white/70" />
            </button>
          </div>

          {/* Content Area */}
          <div className="overflow-y-auto flex-1 p-6 lg:p-8 custom-scrollbar">
            {article && (
              <div className="flex flex-col lg:flex-row gap-8">
                {/* Left side: Original Image & Brief */}
                <div className="w-full lg:w-1/3 flex flex-col gap-4 shrink-0">
                  {article.imageUrl && (
                    <div className="w-full aspect-video rounded-xl overflow-hidden border border-white/10 relative">
                      <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover" />
                      {article.symbol && (
                        <div className="absolute top-2 right-2 bg-black/60 px-2 py-1 rounded backdrop-blur-md text-[10px] font-bold text-teal-400 border border-teal-500/30">
                          {article.symbol}
                        </div>
                      )}
                    </div>
                  )}
                  <h3 className="text-xl font-bold leading-tight text-white">{article.title}</h3>
                  <div className="flex items-center gap-2 text-xs text-white/50 font-mono">
                    <Clock className="w-3 h-3" />
                    <span>Live Market Snapshot</span>
                  </div>
                  <p className="text-sm text-white/60 leading-relaxed border-l-2 border-teal-500/30 pl-3">
                    {article.description}
                  </p>
                </div>

                {/* Right side: AI Detailed Description */}
                <div className="w-full lg:w-2/3">
                  <div className="bg-teal-500/5 border border-teal-500/20 rounded-xl p-6 relative h-full">
                    <div className="absolute -top-3 left-6 bg-[#0B0E11] px-3 flex items-center gap-2">
                       <Sparkles className="w-4 h-4 text-teal-400" />
                       <span className="text-xs font-bold uppercase tracking-widest text-teal-400">Detailed AI Context</span>
                    </div>
                    
                    {loading ? (
                      <div className="flex flex-col items-center justify-center h-full py-12 opacity-70">
                        <TrendingUp className="w-8 h-8 text-teal-400 animate-bounce mb-4" />
                        <span className="text-sm font-mono tracking-widest text-teal-400 uppercase">Synthesizing deep analysis...</span>
                        <div className="w-32 h-1 bg-white/10 mt-4 rounded-full overflow-hidden">
                          <div className="h-full bg-teal-400 animate-pulse w-full"></div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-sm md:text-base text-white/80 leading-loose prose prose-invert prose-p:mb-4 prose-teal max-w-none">
                        {detailedAnalysis.split('\n\n').map((paragraph, i) => (
                           <p key={i}>{paragraph}</p>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
