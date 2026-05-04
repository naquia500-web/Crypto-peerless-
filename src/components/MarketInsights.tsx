import { useState, useEffect } from "react";
import {
  BookOpen,
  CheckCircle2,
  XCircle,
  GraduationCap,
  ChevronRight,
  HelpCircle,
  Loader2,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface VideoSegment {
  id: number;
  title: string;
  duration: string;
  thumbnail: string;
  views: string;
  description: string;
}

const DEFAULT_VIDEOS: VideoSegment[] = [
  {
    id: 1,
    title: "Introduction to Cryptocurrency",
    duration: "1:00",
    thumbnail:
      "https://images.unsplash.com/photo-1621416894569-0f39ed31d247?q=80&w=400&auto=format&fit=crop",
    views: "12K",
    description:
      "A fundamental overview of digital currencies and their underlying technology.",
  },
  {
    id: 2,
    title: "How the Stock Market Works",
    duration: "0:55",
    thumbnail:
      "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=400&auto=format&fit=crop",
    views: "8.4K",
    description:
      "Learn the basics of equity markets and how traditional trading compares to crypto.",
  },
  {
    id: 3,
    title: "Building a Crypto Portfolio",
    duration: "0:50",
    thumbnail:
      "https://images.unsplash.com/photo-1620321023374-d1a68fbc720d?q=80&w=400&auto=format&fit=crop",
    views: "15K",
    description:
      "Strategies for diversifying your crypto assets and managing systemic risk.",
  },
];

const QUIZ_QUESTIONS = [
  {
    question: "What does 'HODL' commonly stand for in crypto?",
    options: [
      "Hold On for Dear Life",
      "Hold Or Drop Loose",
      "High Order Derivative Logic",
      "Halt On Daily Limits",
    ],
    correctAnswer: 0,
  },
  {
    question: "Which of the following describes a blockchain?",
    options: [
      "A centralized database",
      "A distributed digital ledger",
      "A physical coin",
      "A traditional bank account",
    ],
    correctAnswer: 1,
  },
  {
    question: "What is a 'Smart Contract'?",
    options: [
      "An AI lawyer",
      "A legally binding paper contract",
      "Self-executing code on a blockchain",
      "A physical security device",
    ],
    correctAnswer: 2,
  },
];

export function MarketInsights() {
  const [activeVideo, setActiveVideo] = useState<number | null>(null);
  const [videos, setVideos] = useState<VideoSegment[]>(DEFAULT_VIDEOS);
  const [isFetchingVideos, setIsFetchingVideos] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);

  const fetchAIInsights = async () => {
    setIsFetchingVideos(true);
    try {
      await new Promise((r) => setTimeout(r, 1000));
      // Simulated new videos for realism
      const unsplashThumbnails = [
        "https://images.unsplash.com/photo-1621416894569-0f39ed31d247?q=80&w=400&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=400&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1620321023374-d1a68fbc720d?q=80&w=400&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1605792657360-3f65bea7ce61?q=80&w=400&auto=format&fit=crop",
      ];
      const newVideos = [
        {
          id: Date.now() + 1,
          title: "Live Market Analysis",
          duration: "1:00",
          views: "Live",
          description: "In-depth AI market analysis for today's session.",
          thumbnail:
            unsplashThumbnails[
              Math.floor(Math.random() * unsplashThumbnails.length)
            ],
        },
        ...DEFAULT_VIDEOS.slice(0, 2),
      ];
      setVideos(newVideos);
      setLastUpdated(new Date());
    } catch (e: any) {
      console.warn("Market insights AI fetch failed", e);
    } finally {
      setIsFetchingVideos(false);
    }
  };

  useEffect(() => {
    fetchAIInsights();
    const interval = setInterval(
      () => {
        fetchAIInsights();
      },
      2 * 60 * 60 * 1000,
    );
    return () => clearInterval(interval);
  }, []);

  const handleAnswerSelect = (index: number) => {
    if (showResult) return;
    setSelectedAnswer(index);
    setShowResult(true);
    if (index === QUIZ_QUESTIONS[currentQuestion].correctAnswer) {
      setScore((prev) => prev + 1);
    }
  };

  const nextQuestion = () => {
    if (currentQuestion < QUIZ_QUESTIONS.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      setCurrentQuestion(0);
      setSelectedAnswer(null);
      setShowResult(false);
      setScore(0);
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center">
            <GraduationCap className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              Market Insights
            </h2>
            <p className="text-[11px] text-[#787B86] uppercase tracking-widest font-mono">
              Learn & Earn Knowledge
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 border border-green-500/30 rounded-full">
          <span
            className={`w-2 h-2 rounded-full bg-green-500 ${isFetchingVideos ? "animate-ping" : "animate-pulse"}`}
          ></span>
          <span className="text-[10px] uppercase font-bold text-green-400 tracking-wider">
            {isFetchingVideos ? "AI Analyzing..." : "AI Live Tracker"}
          </span>
          {!isFetchingVideos && (
            <span className="text-[10px] text-white/40 font-mono ml-2">
              Last updated {lastUpdated.toLocaleTimeString()}
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Videos Section */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-widest opacity-70">
              Short Lessons (&lt; 1 min)
            </h3>
            {isFetchingVideos && (
              <Loader2 className="w-3 h-3 text-blue-500 animate-spin" />
            )}
          </div>
          <div className="grid grid-cols-1 gap-4">
            {videos.slice(0, 1).map((video) => (
              <div
                key={video.id}
                className="group relative flex flex-col gap-3 cursor-pointer bg-[#1E222D] p-4 rounded-xl border border-[#2A2E39] hover:border-blue-500/30 transition-colors"
                onClick={() => setActiveVideo(video.id)}
              >
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-full bg-blue-500/20 border border-blue-500/50 flex items-center justify-center">
                      <BookOpen className="w-4 h-4 text-blue-500" />
                    </div>
                    <h4 className="text-sm font-bold text-[#B2B5BE] group-hover:text-blue-400 transition-colors leading-tight">
                      {video.title}
                    </h4>
                  </div>
                  <p className="text-xs text-[#787B86] line-clamp-2 transition-colors">
                    {video.description}
                  </p>
                  <div className="text-[11px] text-white/40 mt-3 font-mono">
                    {video.views} views • {video.duration} runtime
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quiz Section */}
        <div className="lg:col-span-5 bg-gradient-to-br from-blue-900/10 to-transparent border border-blue-500/20 rounded-2xl p-6 relative overflow-hidden flex flex-col">
          <div className="absolute -right-12 -top-12 w-40 h-40 bg-blue-500/10 blur-3xl rounded-full"></div>

          <div className="flex items-center justify-between mb-6 relative z-10">
            <h3 className="text-sm font-bold uppercase tracking-widest text-blue-400 flex items-center gap-2">
              <HelpCircle className="w-4 h-4" /> Crypto Quiz
            </h3>
            <span className="text-[10px] font-mono opacity-50 border border-[#2A2E39] px-2 py-1 rounded-full">
              Q{currentQuestion + 1} / {QUIZ_QUESTIONS.length}
            </span>
          </div>

          <div className="flex-1 flex flex-col relative z-10">
            <h4 className="text-lg font-bold text-white mb-6 leading-snug">
              {QUIZ_QUESTIONS[currentQuestion].question}
            </h4>

            <div className="flex flex-col gap-3 flex-1">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentQuestion}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col gap-3"
                >
                  {QUIZ_QUESTIONS[currentQuestion].options.map(
                    (option, index) => {
                      const isSelected = selectedAnswer === index;
                      const isCorrect =
                        index === QUIZ_QUESTIONS[currentQuestion].correctAnswer;

                      let bgClass =
                        "bg-[#131722] hover:bg-[#1E222D] border-[#2A2E39]";
                      let icon = null;

                      if (showResult) {
                        if (isCorrect) {
                          bgClass =
                            "bg-green-500/10 border-green-500/50 text-green-400";
                          icon = (
                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                          );
                        } else if (isSelected) {
                          bgClass =
                            "bg-red-500/10 border-red-500/50 text-red-400";
                          icon = <XCircle className="w-4 h-4 text-red-400" />;
                        } else {
                          bgClass = "bg-[#131722] border-[#2A2E39] opacity-50";
                        }
                      } else if (isSelected) {
                        bgClass =
                          "bg-blue-500/20 border-blue-500/50 text-blue-400";
                      }

                      return (
                        <button
                          key={index}
                          onClick={() => handleAnswerSelect(index)}
                          disabled={showResult}
                          className={`text-left px-4 py-3 rounded-xl border flex items-center justify-between transition-all duration-300 ${bgClass}`}
                        >
                          <span className="text-sm font-bold opacity-90">
                            {option}
                          </span>
                          {icon}
                        </button>
                      );
                    },
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {showResult && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 flex items-center justify-between"
              >
                <div className="text-[11px] font-mono">
                  {selectedAnswer ===
                  QUIZ_QUESTIONS[currentQuestion].correctAnswer ? (
                    <span className="text-green-400 font-bold">
                      Excellent! +1 Point
                    </span>
                  ) : (
                    <span className="text-red-400">
                      Not quite right. Keep learning!
                    </span>
                  )}
                </div>
                <button
                  onClick={nextQuestion}
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-400 text-[#0B0E11] text-xs font-black uppercase tracking-wider rounded-lg transition-colors flex items-center gap-1"
                >
                  {currentQuestion < QUIZ_QUESTIONS.length - 1
                    ? "Next Question"
                    : "Restart Quiz"}{" "}
                  <ChevronRight className="w-3 h-3" />
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Video Modal Placeholder */}
      <AnimatePresence>
        {activeVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveVideo(null)}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#131722] border border-[#2A2E39] rounded-2xl overflow-hidden w-full max-w-4xl shadow-2xl relative flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="aspect-video bg-black flex items-center justify-center relative w-full border-b border-[#2A2E39]">
                <img
                  src={videos.find((v) => v.id === activeVideo)?.thumbnail}
                  className="w-full h-full object-cover opacity-80"
                />
              </div>
              <div className="p-6 flex justify-between items-start">
                <div className="max-w-2xl">
                  <h3 className="text-2xl font-bold">
                    {videos.find((v) => v.id === activeVideo)?.title}
                  </h3>
                  <p className="text-sm text-[#787B86] mt-2 font-mono">
                    Market Insight • Live
                  </p>
                  <p className="text-[#787B86] mt-4 leading-relaxed">
                    {videos.find((v) => v.id === activeVideo)?.description}
                  </p>
                  <div className="mt-6 p-4 bg-blue-500/5 rounded-xl border border-blue-500/10 text-[#787B86] text-sm">
                    <strong>Note:</strong> This is a condensed, text-and-image
                    based update designed for quick consumption. Continuous
                    macro trends and institutional inflows suggest high velocity
                    in price discovery phases over the coming 48 hours. Keep
                    stop losses tight.
                  </div>
                </div>
                <button
                  onClick={() => setActiveVideo(null)}
                  className="px-4 py-2 bg-[#1E222D] border border-[#2A2E39] hover:bg-[#2A2E39] rounded-lg text-sm font-bold transition-colors shrink-0"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
