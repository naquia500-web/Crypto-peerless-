import React, { useState, useMemo } from "react";
import {
  Calculator,
  Pickaxe,
  Scale,
  HandCoins,
  Play,
  Activity,
  ArrowRightLeft,
  DollarSign,
} from "lucide-react";

export function ProCryptoTools() {
  const [activeTab, setActiveTab] = useState<
    "defi" | "mining" | "tax" | "sim" | "compare"
  >("defi");

  // DeFi State
  const [defiDeposit, setDefiDeposit] = useState<number>(10000);
  const [defiSupplyApy, setDefiSupplyApy] = useState<number>(5.5);

  const defiDailyReward = (defiDeposit * (defiSupplyApy / 100)) / 365;
  const defiYearlyReward = defiDeposit * (defiSupplyApy / 100);

  // Mining State
  const [mineHashrate, setMineHashrate] = useState<number>(100);
  const [minePower, setMinePower] = useState<number>(3000);
  const [mineCost, setMineCost] = useState<number>(0.12);

  // Estimate: 1 TH/s ~ $0.05 per day (simplified variable)
  const estRevenuePerTH = 0.05;
  const mineDailyRevenue = mineHashrate * estRevenuePerTH;
  const mineDailyCost = (minePower / 1000) * 24 * mineCost;
  const mineDailyProfit = mineDailyRevenue - mineDailyCost;

  // Compare State
  const [compareCoinA, setCompareCoinA] = useState("Ethereum (ETH)");
  const [compareCoinB, setCompareCoinB] = useState("Solana (SOL)");

  // Futures State
  const [futuresEntry, setFuturesEntry] = useState<number>(65000);
  const [futuresExit, setFuturesExit] = useState<number>(70000);
  const [futuresQuantity, setFuturesQuantity] = useState<number>(1);
  const [futuresLeverage, setFuturesLeverage] = useState<number>(10);
  const [futuresPosition, setFuturesPosition] = useState<"long" | "short">(
    "long",
  );

  const futuresPositionSize = futuresQuantity * futuresEntry;
  const futuresInitialMargin = futuresPositionSize / futuresLeverage;

  const futuresPriceDiff =
    futuresPosition === "long"
      ? futuresExit - futuresEntry
      : futuresEntry - futuresExit;

  const futuresPnl = futuresPriceDiff * futuresQuantity;
  const futuresRoe =
    futuresInitialMargin > 0 ? (futuresPnl / futuresInitialMargin) * 100 : 0;

  const mockDb: Record<string, any> = {
    bitcoin: { cap: "$1.4T", tps: "7", consensus: "PoW", cost: "$4.50" },
    ethereum: { cap: "$340.5B", tps: "15-30", consensus: "PoS", cost: "$2.50" },
    solana: {
      cap: "$42.1B",
      tps: "65,000+",
      consensus: "PoH/PoS",
      cost: "$0.00025",
    },
    cardano: { cap: "$15B", tps: "250", consensus: "dPoS", cost: "$0.10" },
  };

  const getStats = (name: string) => {
    const key = name.toLowerCase();
    if (key.includes("bitcoin") || key.includes("btc"))
      return mockDb["bitcoin"];
    if (key.includes("ethereum") || key.includes("eth"))
      return mockDb["ethereum"];
    if (key.includes("solana") || key.includes("sol")) return mockDb["solana"];
    if (key.includes("cardano") || key.includes("ada"))
      return mockDb["cardano"];
    // Default fallback
    return { cap: "N/A", tps: "N/A", consensus: "Unknown", cost: "N/A" };
  };

  const statsA = getStats(compareCoinA);
  const statsB = getStats(compareCoinB);

  // Tax and Sim State
  const [simBalance, setSimBalance] = useState(100000);
  const [isSimActive, setIsSimActive] = useState(false);

  return (
    <div className="bg-[#131722] rounded-2xl border border-[#2A2E39] shadow-sm overflow-hidden flex flex-col h-[500px]">
      <div className="p-4 border-b border-[#2A2E39] bg-[#1E222D]">
        <h2 className="text-xl font-black text-white mb-4 flex items-center gap-2">
          <Calculator className="w-5 h-5 text-indigo-600" /> Pro Crypto Tools
        </h2>
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {[
            { id: "defi", label: "DeFi Calculator", icon: HandCoins },
            { id: "mining", label: "Mining Calc", icon: Pickaxe },
            { id: "compare", label: "Compare Projects", icon: Activity },
            { id: "tax", label: "Futures Estimator", icon: Scale },
            { id: "sim", label: "Investment Sim", icon: Play },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${
                activeTab === t.id
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "bg-[#131722] text-[#787B86] border border-[#2A2E39] hover:bg-[#2A2E39]"
              }`}
            >
              <t.icon className="w-3.5 h-3.5" /> {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 bg-[#1E222D]">
        {activeTab === "defi" && (
          <div className="max-w-md mx-auto bg-[#131722] p-6 rounded-xl border border-[#2A2E39] shadow-sm">
            <h3 className="font-bold text-white mb-4">
              DeFi Staking & Lending
            </h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-[#787B86] uppercase">
                  Deposit Amount (USD)
                </label>
                <div className="relative mt-1">
                  <DollarSign className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="number"
                    value={defiDeposit}
                    onChange={(e) => setDefiDeposit(Number(e.target.value))}
                    className="w-full pl-9 p-2 bg-[#1E222D] text-white border border-[#2A2E39] rounded-lg text-sm font-semibold focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-colors"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-[#787B86] uppercase">
                  Supply APY (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={defiSupplyApy}
                  onChange={(e) => setDefiSupplyApy(Number(e.target.value))}
                  className="w-full mt-1 p-2 bg-[#1E222D] text-white border border-[#2A2E39] rounded-lg text-sm font-semibold focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-colors"
                />
              </div>

              <div className="pt-4 border-t border-[#2A2E39] flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-[#787B86] text-sm">
                    Estimated Daily Rewards
                  </span>
                  <span className="text-sm font-bold text-white">
                    ${defiDailyReward.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-[#787B86] text-sm">
                    Estimated Yearly Rewards
                  </span>
                  <span className="text-lg font-black text-green-500">
                    ${defiYearlyReward.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "mining" && (
          <div className="max-w-md mx-auto bg-[#131722] p-6 rounded-xl border border-[#2A2E39] shadow-sm">
            <h3 className="font-bold text-white mb-4">
              Mining Profitability Est.
            </h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-[#787B86] uppercase">
                  Hashrate (TH/s)
                </label>
                <input
                  type="number"
                  value={mineHashrate}
                  onChange={(e) => setMineHashrate(Number(e.target.value))}
                  className="w-full mt-1 p-2 bg-[#1E222D] text-white border border-[#2A2E39] rounded-lg text-sm font-semibold focus:border-indigo-500 outline-none transition-colors"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-[#787B86] uppercase">
                    Power (W)
                  </label>
                  <input
                    type="number"
                    value={minePower}
                    onChange={(e) => setMinePower(Number(e.target.value))}
                    className="w-full mt-1 p-2 bg-[#1E222D] text-white border border-[#2A2E39] rounded-lg text-sm font-semibold focus:border-indigo-500 outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#787B86] uppercase">
                    Cost ($/kWh)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={mineCost}
                    onChange={(e) => setMineCost(Number(e.target.value))}
                    className="w-full mt-1 p-2 bg-[#1E222D] text-white border border-[#2A2E39] rounded-lg text-sm font-semibold focus:border-indigo-500 outline-none transition-colors"
                  />
                </div>
              </div>
              <div className="pt-4 border-t border-[#2A2E39] flex flex-col gap-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="font-bold text-[#787B86]">
                    Daily Revenue
                  </span>
                  <span className="font-bold text-white">
                    ${mineDailyRevenue.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="font-bold text-[#787B86]">
                    Daily Power Cost
                  </span>
                  <span className="font-bold text-red-400">
                    -${mineDailyCost.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center mt-2 pt-2 border-t border-dashed border-[#2A2E39]">
                  <span className="font-bold text-[#787B86]">
                    Daily Profit Est.
                  </span>
                  <span
                    className={`text-xl font-black ${mineDailyProfit > 0 ? "text-green-500" : "text-red-400"}`}
                  >
                    {mineDailyProfit > 0 ? "+" : ""}$
                    {mineDailyProfit.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "compare" && (
          <div className="w-full bg-[#131722] p-6 rounded-xl border border-[#2A2E39] shadow-sm">
            <h3 className="font-bold text-white mb-4 text-center">
              Project Comparison
            </h3>
            <div className="flex items-center gap-2 mb-8">
              <div className="flex-1">
                <input
                  type="text"
                  value={compareCoinA}
                  onChange={(e) => setCompareCoinA(e.target.value)}
                  className="w-full p-2 border border-[#2A2E39] rounded-lg text-sm font-semibold bg-[#1E222D] text-white text-center focus:border-indigo-500 outline-none transition-colors"
                  placeholder="e.g. Bitcoin"
                />
              </div>
              <div className="text-slate-500">
                <ArrowRightLeft className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <input
                  type="text"
                  value={compareCoinB}
                  onChange={(e) => setCompareCoinB(e.target.value)}
                  className="w-full p-2 border border-[#2A2E39] rounded-lg text-sm font-semibold bg-[#1E222D] text-white text-center focus:border-indigo-500 outline-none transition-colors"
                  placeholder="e.g. Solana"
                />
              </div>
            </div>

            <table className="w-full text-sm">
              <tbody>
                {[
                  { label: "Market Cap", a: statsA.cap, b: statsB.cap },
                  { label: "TPS (Theoretical)", a: statsA.tps, b: statsB.tps },
                  {
                    label: "Consensus",
                    a: statsA.consensus,
                    b: statsB.consensus,
                  },
                  { label: "Avg Tx Cost", a: statsA.cost, b: statsB.cost },
                ].map((row, i) => (
                  <tr
                    key={i}
                    className="border-b border-[#2A2E39] last:border-0 hover:bg-[#1E222D] transition-colors rounded-lg"
                  >
                    <td className="py-3 font-bold text-[#B2B5BE] w-[40%] text-center">
                      {row.a}
                    </td>
                    <td className="py-3 text-[9px] sm:text-[10px] font-black uppercase text-slate-500 text-center w-[20%] tracking-wider">
                      {row.label}
                    </td>
                    <td className="py-3 font-bold text-[#B2B5BE] w-[40%] text-center">
                      {row.b}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "tax" && (
          <div className="max-w-md mx-auto bg-[#131722] p-6 rounded-xl border border-[#2A2E39] shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Scale className="w-5 h-5 text-indigo-400" />
              <h3 className="font-bold text-white text-lg">
                Futures Estimator
              </h3>
            </div>

            <div className="flex gap-2 mb-4">
              <button
                onClick={() => setFuturesPosition("long")}
                className={`flex-1 py-1.5 rounded-md text-sm font-bold transition-colors ${
                  futuresPosition === "long"
                    ? "bg-green-500/20 text-green-500 border border-green-500/50"
                    : "bg-[#1E222D] text-[#787B86] border border-[#2A2E39] hover:bg-[#2A2E39]"
                }`}
              >
                Long
              </button>
              <button
                onClick={() => setFuturesPosition("short")}
                className={`flex-1 py-1.5 rounded-md text-sm font-bold transition-colors ${
                  futuresPosition === "short"
                    ? "bg-red-500/20 text-red-400 border border-red-500/50"
                    : "bg-[#1E222D] text-[#787B86] border border-[#2A2E39] hover:bg-[#2A2E39]"
                }`}
              >
                Short
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-[#787B86] uppercase">
                    Entry Price
                  </label>
                  <div className="relative mt-1">
                    <DollarSign className="w-4 h-4 text-gray-500 absolute left-2 top-1/2 -translate-y-1/2" />
                    <input
                      type="number"
                      value={futuresEntry}
                      onChange={(e) => setFuturesEntry(Number(e.target.value))}
                      className="w-full pl-7 p-2 bg-[#1E222D] text-white border border-[#2A2E39] rounded-lg text-sm font-semibold focus:border-indigo-500 outline-none transition-colors"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-[#787B86] uppercase">
                    Exit Price
                  </label>
                  <div className="relative mt-1">
                    <DollarSign className="w-4 h-4 text-gray-500 absolute left-2 top-1/2 -translate-y-1/2" />
                    <input
                      type="number"
                      value={futuresExit}
                      onChange={(e) => setFuturesExit(Number(e.target.value))}
                      className="w-full pl-7 p-2 bg-[#1E222D] text-white border border-[#2A2E39] rounded-lg text-sm font-semibold focus:border-indigo-500 outline-none transition-colors"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-[#787B86] uppercase">
                    Quantity (BTC)
                  </label>
                  <input
                    type="number"
                    value={futuresQuantity}
                    onChange={(e) => setFuturesQuantity(Number(e.target.value))}
                    step="0.01"
                    className="w-full mt-1 p-2 bg-[#1E222D] text-white border border-[#2A2E39] rounded-lg text-sm font-semibold focus:border-indigo-500 outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#787B86] uppercase">
                    Leverage (x)
                  </label>
                  <input
                    type="number"
                    value={futuresLeverage}
                    onChange={(e) => setFuturesLeverage(Number(e.target.value))}
                    min="1"
                    max="100"
                    className="w-full mt-1 p-2 bg-[#1E222D] text-white border border-[#2A2E39] rounded-lg text-sm font-semibold focus:border-indigo-500 outline-none transition-colors"
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-[#1E222D] rounded-xl border border-[#2A2E39] flex flex-col gap-3">
              <div className="flex justify-between items-center text-sm">
                <span className="font-bold text-[#787B86]">Initial Margin</span>
                <span className="font-bold text-white">
                  $
                  {futuresInitialMargin.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="font-bold text-[#787B86]">Position Size</span>
                <span className="font-bold text-white">
                  $
                  {futuresPositionSize.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </div>
              <div className="h-px bg-[#2A2E39] my-1" />
              <div className="flex justify-between items-center text-sm">
                <span className="font-bold text-[#787B86]">Estimated PNL</span>
                <span
                  className={`font-black ${futuresPnl >= 0 ? "text-green-500" : "text-red-400"}`}
                >
                  {futuresPnl >= 0 ? "+" : ""}$
                  {futuresPnl.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="font-bold text-[#787B86]">ROE %</span>
                <span
                  className={`font-black ${futuresRoe >= 0 ? "text-green-500" : "text-red-400"}`}
                >
                  {futuresRoe >= 0 ? "+" : ""}
                  {futuresRoe.toFixed(2)}%
                </span>
              </div>
            </div>
          </div>
        )}

        {activeTab === "sim" && (
          <div className="max-w-md mx-auto bg-[#131722] p-8 rounded-xl border border-[#2A2E39] shadow-sm text-center py-10 flex flex-col items-center">
            {!isSimActive ? (
              <>
                <Play className="w-12 h-12 text-green-400 mx-auto mb-4" />
                <h3 className="font-bold text-white mb-2 text-lg">
                  Virtual Trading Simulator
                </h3>
                <p className="text-sm text-[#787B86] mb-6">
                  Start with a virtual $100,000 portfolio. Practice trading
                  strategies without risking real capital.
                </p>
                <button
                  onClick={() => setIsSimActive(true)}
                  className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition-colors uppercase tracking-wider text-sm shadow-md w-full"
                >
                  Launch Simulator
                </button>
              </>
            ) : (
              <div className="w-full text-left">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-bold text-white text-lg">
                    Simulator Active
                  </h3>
                  <span className="px-2 py-1 bg-green-500/20 text-green-500 text-xs font-bold rounded">
                    LIVE
                  </span>
                </div>
                <div className="p-4 bg-[#1E222D] rounded-lg border border-[#2A2E39] mb-4">
                  <div className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">
                    Available Balance
                  </div>
                  <div className="text-3xl font-black text-white">
                    ${simBalance.toLocaleString()}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setSimBalance((prev) => prev - 1000)}
                    className="py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors border border-blue-500"
                  >
                    Buy BTC ($1,000)
                  </button>
                  <button
                    onClick={() => setSimBalance((prev) => prev + 1050)}
                    className="py-3 bg-[#131722] hover:bg-[#1A1E29] text-green-500 font-bold rounded-lg transition-colors border border-[#2A2E39] hover:border-green-500/50"
                  >
                    Sell Position
                  </button>
                </div>
                <button
                  onClick={() => setIsSimActive(false)}
                  className="text-xs text-gray-500 hover:text-gray-300 mt-6 text-center w-full uppercase font-bold"
                >
                  Reset Simulator
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
