import React, { useState } from 'react';
import { BookOpen, Trophy, Gift, Target, Code, CheckCircle2, ChevronRight } from 'lucide-react';

export function CryptoBeginnerHub() {
  const [points, setPoints] = useState(120);
  const [activeTab, setActiveTab] = useState<'intro' | 'quiz'>('intro');
  const [quizState, setQuizState] = useState<'start' | 'playing' | 'end'>('start');
  const [currentQ, setCurrentQ] = useState(0);

  const quizQuestions = [
    { q: "What is the primary function of a blockchain?", options: ["Distributed Ledger", "Cloud Storage", "Web Browser", "Social Network"], a: 0 },
    { q: "What does APY stand for?", options: ["Annual Price Yield", "Average Percentage Yield", "Annual Percentage Yield", "Actual Price Yearly"], a: 2 },
    { q: "Which consensus mechanism does Ethereum use now?", options: ["Proof of Work", "Proof of History", "Proof of Space", "Proof of Stake"], a: 3 },
  ];

  const handleAnswer = (index: number) => {
    if (index === quizQuestions[currentQ].a) {
      setPoints(p => p + 50);
    }
    if (currentQ < quizQuestions.length - 1) {
      setCurrentQ(currentQ + 1);
    } else {
      setQuizState('end');
    }
  };

  return (
    <div className="bg-[#131722] rounded-2xl border border-[#2A2E39] shadow-sm overflow-hidden flex flex-col h-full min-h-[400px]">
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-6 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#131722]/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/4"></div>
        <div className="flex justify-between items-center relative z-10">
          <div>
            <h2 className="text-2xl font-black mb-1">Beginner's Hub</h2>
            <p className="text-emerald-100 text-sm font-medium">Learn, earn points, and master crypto.</p>
          </div>
          <div className="bg-[#131722]/20 backdrop-blur-md border border-white/30 px-4 py-2 rounded-xl flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-300 fill-yellow-300" />
            <div>
              <div className="text-[10px] uppercase font-bold text-emerald-100 tracking-wider">Your Points</div>
              <div className="text-xl font-black leading-none">{points}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex border-b border-[#2A2E39]">
        <button onClick={() => setActiveTab('intro')} className={`flex-1 py-3 text-sm font-bold uppercase tracking-wider transition-colors ${activeTab === 'intro' ? 'text-emerald-600 border-b-2 border-emerald-600' : 'text-[#787B86] hover:bg-[#1E222D]'}`}>Learning Paths</button>
        <button onClick={() => setActiveTab('quiz')} className={`flex-1 py-3 text-sm font-bold uppercase tracking-wider transition-colors ${activeTab === 'quiz' ? 'text-emerald-600 border-b-2 border-emerald-600' : 'text-[#787B86] hover:bg-[#1E222D]'}`}>Daily Quiz</button>
      </div>

      <div className="flex-1 p-6 bg-[#1E222D] overflow-y-auto">
        {activeTab === 'intro' && (
          <div className="space-y-4">
            {[
              { title: "Crypto 101: The Basics", desc: "Understand wallets, keys, and how to buy your first crypto.", modules: 4, points: 100, icon: BookOpen, color: "text-blue-500", bg: "bg-blue-100" },
              { title: "Defi Simplified", desc: "Lending, borrowing, and swapping without intermediaries.", modules: 6, points: 250, icon: Target, color: "text-purple-500", bg: "bg-purple-100" },
              { title: "Smart Contracts & Web3", desc: "How code dictates the future of decentralized internet.", modules: 5, points: 200, icon: Code, color: "text-amber-500", bg: "bg-amber-100" },
            ].map((course, i) => (
              <div key={i} className="bg-[#131722] rounded-xl p-4 border border-[#2A2E39] shadow-sm hover:border-emerald-300 hover:shadow-md transition-all cursor-pointer group flex items-start gap-4">
                <div className={`w-12 h-12 rounded-full ${course.bg} ${course.color} flex items-center justify-center shrink-0`}>
                  <course.icon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-white group-hover:text-emerald-600 transition-colors">{course.title}</h3>
                  <p className="text-sm text-[#787B86] mt-1">{course.desc}</p>
                  <div className="flex items-center gap-4 mt-3">
                    <span className="text-xs font-bold text-slate-400 bg-[#2A2E39] px-2 py-1 rounded">{course.modules} Modules</span>
                    <span className="text-xs font-bold text-yellow-600 bg-yellow-50 px-2 py-1 rounded border border-yellow-200 flex items-center gap-1"><Gift className="w-3 h-3" /> +{course.points} pts</span>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-emerald-500 self-center" />
              </div>
            ))}
          </div>
        )}

        {activeTab === 'quiz' && (
          <div className="h-full flex flex-col justify-center max-w-md mx-auto">
            {quizState === 'start' && (
              <div className="text-center bg-[#131722] p-8 rounded-2xl border border-[#2A2E39] shadow-sm">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-black text-white mb-2">Daily Crypto Challenge</h3>
                <p className="text-[#787B86] text-sm mb-6">Test your knowledge and earn up to 150 points today.</p>
                <button 
                  onClick={() => { setQuizState('playing'); setCurrentQ(0); }}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all uppercase tracking-wider text-sm"
                >
                  Start Quiz
                </button>
              </div>
            )}
            
            {quizState === 'playing' && (
              <div className="bg-[#131722] p-6 rounded-2xl border border-[#2A2E39] shadow-sm">
                <div className="flex justify-between items-center mb-6 text-sm font-bold text-[#787B86] uppercase tracking-wider">
                  <span>Question {currentQ + 1} of {quizQuestions.length}</span>
                  <span className="text-emerald-600 font-black">+50 Pts each</span>
                </div>
                <h3 className="text-lg font-bold text-white mb-6">{quizQuestions[currentQ].q}</h3>
                <div className="space-y-3">
                  {quizQuestions[currentQ].options.map((opt, i) => (
                    <button
                      key={i}
                      onClick={() => handleAnswer(i)}
                      className="w-full text-left p-4 rounded-xl border border-[#2A2E39] hover:border-emerald-500 hover:bg-emerald-50 font-medium text-[#B2B5BE] hover:text-emerald-700 transition-all"
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {quizState === 'end' && (
              <div className="text-center bg-[#131722] p-8 rounded-2xl border border-[#2A2E39] shadow-sm">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-black text-white mb-2">Challenge Complete!</h3>
                <p className="text-[#787B86] text-sm mb-6">Great job. Come back tomorrow for more questions and points.</p>
                <button 
                  onClick={() => { setQuizState('start'); setActiveTab('intro'); }}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all uppercase tracking-wider text-sm"
                >
                  Back to Learning
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
