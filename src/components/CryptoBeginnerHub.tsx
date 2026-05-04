import React, { useState, useEffect } from "react";
import {
  BookOpen,
  Trophy,
  Gift,
  Target,
  Code,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  PlayCircle,
  Clock,
} from "lucide-react";

export function CryptoBeginnerHub() {
  const [points, setPoints] = useState(120);
  const [activeTab, setActiveTab] = useState<"intro" | "quiz" | "course">(
    "intro",
  );
  const [quizState, setQuizState] = useState<"start" | "playing" | "end">(
    "start",
  );
  const [currentQ, setCurrentQ] = useState(0);
  const [nextUpdateStr, setNextUpdateStr] = useState("");

  // Course Viewer State
  const [activeCourse, setActiveCourse] = useState<any>(null);
  const [activeModule, setActiveModule] = useState<number>(0);
  const [completedModules, setCompletedModules] = useState<
    Record<string, number[]>
  >({});

  const allQuizQuestions = [
    {
      q: "What is the primary function of a blockchain?",
      options: [
        "Distributed Ledger",
        "Cloud Storage",
        "Web Browser",
        "Social Network",
      ],
      a: 0,
    },
    {
      q: "What does APY stand for?",
      options: [
        "Annual Price Yield",
        "Average Percentage Yield",
        "Annual Percentage Yield",
        "Actual Price Yearly",
      ],
      a: 2,
    },
    {
      q: "Which consensus mechanism does Ethereum use now?",
      options: [
        "Proof of Work",
        "Proof of History",
        "Proof of Space",
        "Proof of Stake",
      ],
      a: 3,
    },
    {
      q: "What is a Smart Contract?",
      options: [
        "A legal document",
        "Self-executing code",
        "A human lawyer",
        "A crypto wallet",
      ],
      a: 1,
    },
    {
      q: "What does 'HODL' stand for in crypto?",
      options: [
        "Hold On for Dear Life",
        "Have Only Digital Ledger",
        "Hold Over Digital Life",
        "Nothing, it's a typo",
      ],
      a: 3,
    },
    {
      q: "What limits the maximum supply of Bitcoin?",
      options: [
        "The CEO of Bitcoin",
        "Satoshi's Private Key",
        "Its source code (21 Million)",
        "Miners voting",
      ],
      a: 2,
    },
    {
      q: "What is a 'Seed Phrase'?",
      options: [
        "A password for an exchange",
        "A master recovery key",
        "A type of crypto token",
        "A mining algorithm",
      ],
      a: 1,
    },
    {
      q: "What is a Decentralized Exchange (DEX)?",
      options: [
        "Binance",
        "Coinbase",
        "A peer-to-peer trading protocol",
        "A central bank system",
      ],
      a: 2,
    },
  ];

  const [activeQuizQuestions, setActiveQuizQuestions] = useState(
    allQuizQuestions.slice(0, 3),
  );

  useEffect(() => {
    const updateQuestions = () => {
      const now = new Date();
      const windowMs = 2 * 60 * 60 * 1000;
      const currentEpochPeriod = Math.floor(now.getTime() / windowMs);

      const startIndex = (currentEpochPeriod * 3) % allQuizQuestions.length;
      const selectedQuestions = [];
      for (let i = 0; i < 3; i++) {
        selectedQuestions.push(
          allQuizQuestions[(startIndex + i) % allQuizQuestions.length],
        );
      }
      setActiveQuizQuestions(selectedQuestions);
    };

    updateQuestions();
    const interval = setInterval(updateQuestions, 60000);
    return () => clearInterval(interval);
  }, []);

  const courses = [
    {
      id: "crypto101",
      title: "Crypto 101: The Basics",
      desc: "Understand wallets, keys, and how to buy your first crypto.",
      points: 100,
      icon: BookOpen,
      color: "text-blue-500",
      bg: "bg-blue-100",
      content: [
        {
          title: "What is Cryptocurrency?",
          text: "Cryptocurrency is a digital or virtual currency that is secured by cryptography, which makes it nearly impossible to counterfeit or double-spend. Many cryptocurrencies are decentralized networks based on blockchain technology—a distributed ledger enforced by a disparate network of computers.",
        },
        {
          title: "Public vs Private Keys",
          text: "Think of your public key like your bank account number—anyone can send money to it. Your private key is like your ATM PIN. Never share your private key with anyone!",
        },
        {
          title: "Hot vs Cold Wallets",
          text: "Hot wallets are connected to the internet and are convenient for active trading. Cold wallets are physical devices that store your crypto offline, providing maximum security for long-term holding.",
        },
        {
          title: "Your First Purchase",
          text: "To buy crypto, you typically need to sign up for a centralized exchange (like Binance or Coinbase), verify your identity (KYC), deposit fiat currency (like USD or EUR), and execute a trade.",
        },
      ],
    },
    {
      id: "defi",
      title: "Defi Simplified",
      desc: "Lending, borrowing, and swapping without intermediaries.",
      points: 250,
      icon: Target,
      color: "text-purple-500",
      bg: "bg-purple-100",
      content: [
        {
          title: "What is DeFi?",
          text: "DeFi, or Decentralized Finance, refers to financial services built on blockchain technology that operate without traditional intermediaries like banks or brokerages. It relies on smart contracts to execute financial transactions automatically.",
        },
        {
          title: "Decentralized Exchanges (DEXs)",
          text: "DEXs like Uniswap or PancakeSwap allow users to trade cryptocurrencies directly with one another. Instead of an order book, they typically use Automated Market Makers (AMMs) and Liquidity Pools.",
        },
        {
          title: "Yield Farming",
          text: "Yield farming involves lending or staking your cryptocurrency in a DeFi protocol to earn rewards or interest. It can be highly profitable but comes with risks like smart contract bugs or impermanent loss.",
        },
      ],
    },
    {
      id: "web3",
      title: "Smart Contracts & Web3",
      desc: "How code dictates the future of decentralized internet.",
      points: 200,
      icon: Code,
      color: "text-amber-500",
      bg: "bg-amber-100",
      content: [
        {
          title: "What are Smart Contracts?",
          text: "Smart contracts are self-executing contracts where the terms of the agreement between buyer and seller are directly written into lines of code. The code and the agreements contained therein exist across a distributed, decentralized blockchain network.",
        },
        {
          title: "The Web3 Vision",
          text: "Web1 was read-only. Web2 is read-write (user-generated content controlled by tech giants). Web3 is read-write-own. It envisions a decentralized internet where users have ownership and control over their data, digital identity, and transactions.",
        },
      ],
    },
  ];

  const handleAnswer = (index: number) => {
    if (index === activeQuizQuestions[currentQ].a) {
      setPoints((p) => p + 50);
    }
    if (currentQ < activeQuizQuestions.length - 1) {
      setCurrentQ(currentQ + 1);
    } else {
      setQuizState("end");
    }
  };

  const openCourse = (course: any) => {
    setActiveCourse(course);
    setActiveModule(0);
    setActiveTab("course");
  };

  const closeCourse = () => {
    setActiveCourse(null);
    setActiveTab("intro");
  };

  const completeModule = () => {
    if (!activeCourse) return;

    // Mark current module as completed
    const currentCompleted = completedModules[activeCourse.id] || [];
    if (!currentCompleted.includes(activeModule)) {
      setCompletedModules({
        ...completedModules,
        [activeCourse.id]: [...currentCompleted, activeModule],
      });
      // Award points for completing a module
      setPoints(
        (p) =>
          p + Math.floor(activeCourse.points / activeCourse.content.length),
      );
    }

    // Go to next module or back to intro if finished
    if (activeModule < activeCourse.content.length - 1) {
      setActiveModule(activeModule + 1);
    } else {
      closeCourse();
    }
  };

  return (
    <div className="bg-[#131722] rounded-2xl border border-[#2A2E39] shadow-sm overflow-hidden flex flex-col h-full min-h-[400px]">
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-6 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#131722]/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/4"></div>
        <div className="flex justify-between items-center relative z-10">
          <div>
            <h2 className="text-2xl font-black mb-1">Beginner's Hub</h2>
            <p className="text-emerald-100 text-sm font-medium">
              Learn, earn points, and master crypto.
            </p>
          </div>
          <div className="bg-[#131722]/20 backdrop-blur-md border border-white/30 px-4 py-2 rounded-xl flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-300 fill-yellow-300" />
            <div>
              <div className="text-[10px] uppercase font-bold text-emerald-100 tracking-wider">
                Your Points
              </div>
              <div className="text-xl font-black leading-none">{points}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex border-b border-[#2A2E39]">
        <button
          onClick={() => {
            setActiveTab("intro");
            setActiveCourse(null);
          }}
          className={`flex-1 py-3 text-sm font-bold uppercase tracking-wider transition-colors ${activeTab === "intro" || activeTab === "course" ? "text-emerald-600 border-b-2 border-emerald-600" : "text-[#787B86] hover:bg-[#1E222D]"}`}
        >
          Learning Paths
        </button>
        <button
          onClick={() => {
            setActiveTab("quiz");
            setActiveCourse(null);
          }}
          className={`flex-1 py-3 text-sm font-bold uppercase tracking-wider transition-colors ${activeTab === "quiz" ? "text-emerald-600 border-b-2 border-emerald-600" : "text-[#787B86] hover:bg-[#1E222D]"}`}
        >
          Live Quiz
        </button>
      </div>

      <div className="flex-1 p-6 bg-[#1E222D] overflow-y-auto relative">
        {activeTab === "intro" && (
          <div className="space-y-4">
            {courses.map((course, i) => {
              const completedCount = (completedModules[course.id] || []).length;
              const totalModules = course.content.length;
              const progress = (completedCount / totalModules) * 100;

              return (
                <div
                  key={i}
                  onClick={() => openCourse(course)}
                  className="bg-[#131722] rounded-xl p-4 border border-[#2A2E39] shadow-sm hover:border-emerald-300 hover:shadow-md transition-all cursor-pointer group"
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-12 h-12 rounded-full ${course.bg} ${course.color} flex items-center justify-center shrink-0`}
                    >
                      <course.icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-white group-hover:text-emerald-600 transition-colors">
                        {course.title}
                      </h3>
                      <p className="text-sm text-[#787B86] mt-1">
                        {course.desc}
                      </p>

                      {completedCount > 0 && (
                        <div className="mt-3 w-full bg-[#1E222D] rounded-full h-1.5 overflow-hidden">
                          <div
                            className="bg-emerald-500 h-full"
                            style={{ width: `${progress}%` }}
                          ></div>
                        </div>
                      )}

                      <div className="flex items-center gap-4 mt-3">
                        <span className="text-xs font-bold text-slate-400 bg-[#2A2E39] px-2 py-1 rounded">
                          {totalModules} Modules
                        </span>
                        <span className="text-xs font-bold text-yellow-600 bg-yellow-50 px-2 py-1 rounded border border-yellow-200 flex items-center gap-1">
                          <Gift className="w-3 h-3" /> +{course.points} pts
                        </span>
                        {completedCount === totalModules && (
                          <span className="text-xs font-bold text-emerald-500 flex items-center gap-1 ml-auto">
                            <CheckCircle2 className="w-4 h-4" /> Completed
                          </span>
                        )}
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-emerald-500 self-center hidden sm:block" />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {activeTab === "course" && activeCourse && (
          <div className="h-full flex flex-col max-w-2xl mx-auto w-full">
            <button
              onClick={closeCourse}
              className="text-[#787B86] hover:text-white flex items-center gap-2 mb-6 font-bold text-sm transition-colors w-fit"
            >
              <ChevronLeft className="w-4 h-4" /> Back to Paths
            </button>

            <div className="bg-[#131722] p-6 rounded-2xl border border-[#2A2E39] shadow-sm mb-4">
              <div className="flex items-center gap-4 mb-6">
                <div
                  className={`w-10 h-10 rounded-full ${activeCourse.bg} ${activeCourse.color} flex items-center justify-center shrink-0`}
                >
                  <activeCourse.icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-white">
                    {activeCourse.title}
                  </h3>
                  <p className="text-sm text-[#787B86] font-medium">
                    Module {activeModule + 1} of {activeCourse.content.length}
                  </p>
                </div>
              </div>

              <div className="mb-6">
                <div className="w-full bg-[#1E222D] rounded-full h-2 mb-6 overflow-hidden">
                  <div
                    className="bg-emerald-500 h-full transition-all duration-500 ease-out"
                    style={{
                      width: `${(activeModule / activeCourse.content.length) * 100}%`,
                    }}
                  ></div>
                </div>

                <h4 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                  <PlayCircle className="w-5 h-5 text-emerald-500" />
                  {activeCourse.content[activeModule].title}
                </h4>
                <div className="text-[#B2B5BE] leading-relaxed space-y-4">
                  <p>{activeCourse.content[activeModule].text}</p>
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-[#2A2E39]">
                <button
                  onClick={completeModule}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center gap-2 text-sm"
                >
                  {activeModule === activeCourse.content.length - 1
                    ? "Finish Course"
                    : "Next Module"}{" "}
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === "quiz" && (
          <div className="h-full flex flex-col justify-center max-w-md mx-auto">
            {quizState === "start" && (
              <div className="text-center bg-[#131722] p-8 rounded-2xl border border-[#2A2E39] shadow-sm">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-black text-white mb-2">
                  Live Crypto Challenge
                </h3>
                <p className="text-[#787B86] text-sm mb-6">
                  Test your knowledge and earn up to 150 points.
                </p>

                <div className="flex items-center justify-center gap-2 mb-6 text-emerald-500 font-bold text-xs bg-emerald-500/10 py-1.5 px-3 rounded-full w-fit mx-auto border border-emerald-500/20">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                  <span className="text-[10px] uppercase tracking-wider">
                    Live Tracker Active
                  </span>
                </div>

                <button
                  onClick={() => {
                    setQuizState("playing");
                    setCurrentQ(0);
                  }}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all uppercase tracking-wider text-sm"
                >
                  Start Live Quiz
                </button>
              </div>
            )}

            {quizState === "playing" && (
              <div className="bg-[#131722] p-6 rounded-2xl border border-[#2A2E39] shadow-sm">
                <div className="flex justify-between items-center mb-6 text-sm font-bold text-[#787B86] uppercase tracking-wider">
                  <span>
                    Question {currentQ + 1} of {activeQuizQuestions.length}
                  </span>
                  <span className="text-emerald-600 font-black">
                    +50 Pts each
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white mb-6">
                  {activeQuizQuestions[currentQ].q}
                </h3>
                <div className="space-y-3">
                  {activeQuizQuestions[currentQ].options.map((opt, i) => (
                    <button
                      key={i}
                      onClick={() => handleAnswer(i)}
                      className="w-full text-left p-4 rounded-xl border border-[#2A2E39] hover:border-emerald-500 hover:bg-emerald-50 font-medium text-[#B2B5BE] hover:text-emerald-700 transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-emerald-50/10"
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {quizState === "end" && (
              <div className="text-center bg-[#131722] p-8 rounded-2xl border border-[#2A2E39] shadow-sm">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-black text-white mb-2">
                  Challenge Complete!
                </h3>
                <p className="text-[#787B86] text-sm mb-6">
                  Great job. Live questions updating constantly.
                </p>
                <button
                  onClick={() => {
                    setQuizState("start");
                    setActiveTab("intro");
                    setActiveCourse(null);
                  }}
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
