import { Play, Pause, Quote, ChevronRight, Activity } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

const SHAYARIS = [
  {
    text: `"मंज़िल उन्हीं को मिलती है, जिनके सपनों में जान होती है...\nपंखों से कुछ नहीं होता, हौसलों से उड़ान होती है!"`,
    lang: "Hindi",
    author: "Motivational",
  },
  {
    text: `"Success is not final, failure is not fatal:\nIt is the courage to continue that counts."`,
    lang: "English",
    author: "Winston Churchill",
  },
  {
    text: `"कामयाबी के सफर में धूप का बड़ा महत्व है...\nक्योंकि छांव मिलते ही कदम रुकने लगते हैं।"`,
    lang: "Hindi",
    author: "Life Lesson",
  },
  {
    text: `"El único límite a nuestra realización del mañana\nserán nuestras dudas de hoy."`,
    lang: "Spanish",
    author: "F. D. Roosevelt",
  },
  {
    text: `"خودی کو کر بلند اتنا کہ ہر تقدیر سے پہلے...\nخدا بندے سے خود پوچھے بتا تیری رضا کیا ہے"`,
    lang: "Urdu",
    author: "Allama Iqbal",
  },
];

export function UserVideoHero() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isAutoTrack, setIsAutoTrack] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const nextShayari = () => {
    setCurrentIdx((prev) => (prev + 1) % SHAYARIS.length);
  };

  useEffect(() => {
    if (!isAutoTrack) return;
    const interval = setInterval(nextShayari, 8000);
    return () => clearInterval(interval);
  }, [isAutoTrack]);

  const currentShayari = SHAYARIS[currentIdx];

  return (
    <div className="bg-[#131722] border border-[#2A2E39] rounded-2xl overflow-hidden relative group shadow-[0_0_50px_rgba(45,212,191,0.05)] mt-6 mb-8">
      <div className="absolute inset-0 bg-gradient-to-t from-[#131722] via-[#131722]/60 to-black/20 z-10 pointer-events-none" />

      {/* 
        Video Note: As custom video uploads via prompt attachments don't provide a direct static URL, 
        using a high-quality relevant stock video placeholder. 
      */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        className="w-full h-[450px] md:h-[550px] object-cover opacity-70 group-hover:opacity-80 transition-opacity duration-700 mix-blend-screen"
      >
        {/* Placeholder tech/crypto video */}
        <source
          src="https://cdn.pixabay.com/video/2021/04/16/71360-538183181_large.mp4"
          type="video/mp4"
        />
      </video>

      <button
        onClick={togglePlay}
        className="absolute top-6 right-6 z-20 w-12 h-12 bg-[#1E222D]/80 hover:bg-teal-500/20 border border-[#2A2E39] hover:border-teal-500/50 rounded-full flex items-center justify-center backdrop-blur-md transition-all shadow-lg"
      >
        {isPlaying ? (
          <Pause className="w-5 h-5 text-white" />
        ) : (
          <Play className="w-5 h-5 text-white ml-1" />
        )}
      </button>

      <div className="absolute inset-0 z-20 flex flex-col justify-end p-6 md:p-12">
        <div className="max-w-4xl w-full flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex-1">
            <Quote className="w-8 h-8 md:w-10 md:h-10 text-teal-500/50 mb-4 md:mb-6" />
            <div className="min-h-[140px] md:min-h-[180px] flex items-center">
              <AnimatePresence mode="wait">
                <motion.h2
                  key={currentIdx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  className="text-xl md:text-3xl lg:text-4xl font-extrabold text-white leading-relaxed drop-shadow-2xl whitespace-pre-line"
                  style={{ textShadow: "0px 4px 20px rgba(0,0,0,0.8)" }}
                >
                  {currentShayari.text}
                </motion.h2>
              </AnimatePresence>
            </div>
          </div>

          <div className="flex flex-col gap-4 min-w-[220px]">
            {/* Live Indicator Toggle */}
            <button
              onClick={() => setIsAutoTrack(!isAutoTrack)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1E222D]/60 backdrop-blur-md border border-[#2A2E39] hover:border-teal-500/50 transition-all self-start md:self-end"
            >
              <Activity
                className={`w-3.5 h-3.5 ${isAutoTrack ? "text-teal-400 animate-pulse" : "text-gray-500"}`}
              />
              <span
                className={`text-[10px] font-bold uppercase tracking-wider ${isAutoTrack ? "text-teal-400" : "text-gray-400"}`}
              >
                {isAutoTrack ? "Live Text Tracking: ON" : "Live Tracking: OFF"}
              </span>
            </button>

            {/* Language & Author + Next Button */}
            <div className="flex items-center justify-between gap-4 bg-[#1E222D]/80 backdrop-blur-md p-3 rounded-xl border border-[#2A2E39] shadow-2xl">
              <div>
                <p className="text-[#787B86] font-mono text-[10px] uppercase font-bold tracking-widest mb-1">
                  Language: {currentShayari.lang}
                </p>
                <p className="text-teal-400 font-bold text-xs">
                  {currentShayari.author}
                </p>
              </div>
              <button
                onClick={nextShayari}
                className="w-10 h-10 bg-teal-500/10 hover:bg-teal-500/20 border border-teal-500/30 rounded-lg flex items-center justify-center transition-all group/btn"
              >
                <ChevronRight className="w-5 h-5 text-teal-400 group-hover/btn:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
