import React, { useState, useEffect } from "react";
import {
  Activity,
  ArrowRight,
  ArrowDown,
  ArrowUp,
  Filter,
  AlertTriangle,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface Trade {
  id: string;
  type: "buy" | "sell";
  amountBTC: number;
  priceUSD: number;
  totalUSD: number;
  time: string;
  isWhale: boolean;
}

export function WhaleTracker() {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [filter, setFilter] = useState<"all" | "whale" | "retail">("all");

  useEffect(() => {
    // Simulate live trades
    const interval = setInterval(() => {
      const isBuy = Math.random() > 0.5;
      const isWhale = Math.random() > 0.8;

      let amountBTC = 0;
      if (isWhale) {
        amountBTC = 10 + Math.random() * 500;
      } else {
        amountBTC = 0.01 + Math.random() * 5;
      }

      const priceUSD = 76500 + (Math.random() * 400 - 200);
      const totalUSD = amountBTC * priceUSD;

      const newTrade: Trade = {
        id: Math.random().toString(36).substr(2, 9),
        type: isBuy ? "buy" : "sell",
        amountBTC,
        priceUSD,
        totalUSD,
        time: new Date().toLocaleTimeString([], { hour12: false }),
        isWhale,
      };

      setTrades((prev) => [newTrade, ...prev].slice(0, 50));
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  const filteredTrades = trades.filter((t) => {
    if (filter === "whale") return t.isWhale;
    if (filter === "retail") return !t.isWhale;
    return true;
  });

  return (
    <div className="bg-[#131722] rounded-2xl border border-[#2A2E39] shadow-sm overflow-hidden flex flex-col h-[500px]">
      <div className="p-4 border-b border-[#2A2E39] flex justify-between items-center bg-[#1E222D]">
        <h2 className="text-lg font-black text-[#D1D4DC] flex items-center gap-2">
          <Activity className="w-5 h-5 text-blue-400" /> Live Trades & Whale
          Alerts
        </h2>
        <div className="flex gap-2">
          {(["all", "whale", "retail"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg uppercase tracking-wider transition-colors ${
                filter === f
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-[#131722] text-[#787B86] border border-[#2A2E39] hover:bg-[#1E222D]"
              }`}
            >
              {f === "whale"
                ? "Whales (>10 BTC)"
                : f === "retail"
                  ? "Retail"
                  : "All"}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto w-full p-2 bg-[#131722]">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-[10px] uppercase tracking-widest text-[#787B86] border-b border-[#2A2E39] sticky top-0 bg-[#131722] z-10">
              <th className="p-2">Time</th>
              <th className="p-2">Type</th>
              <th className="p-2 text-right">Price</th>
              <th className="p-2 text-right">Amount (BTC)</th>
              <th className="p-2 text-right font-black">Total (USD)</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence initial={false}>
              {filteredTrades.map((trade) => (
                <motion.tr
                  key={trade.id}
                  initial={{
                    opacity: 0,
                    y: -10,
                    backgroundColor:
                      trade.type === "buy"
                        ? "rgba(34, 197, 94, 0.1)"
                        : "rgba(239, 68, 68, 0.1)",
                  }}
                  animate={{ opacity: 1, y: 0, backgroundColor: "transparent" }}
                  className={`border-b border-[#2A2E39] text-sm font-mono transition-colors hover:bg-[#1E222D] ${
                    trade.isWhale
                      ? "text-orange-500 font-bold"
                      : "text-[#787B86]"
                  }`}
                >
                  <td className="p-2 opacity-70">{trade.time}</td>
                  <td className="p-2">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold ${
                        trade.type === "buy"
                          ? "text-green-700 bg-green-100"
                          : "text-red-700 bg-red-100"
                      }`}
                    >
                      {trade.type === "buy" ? (
                        <ArrowUp className="w-3 h-3" />
                      ) : (
                        <ArrowDown className="w-3 h-3" />
                      )}
                      {trade.type.toUpperCase()}
                      {trade.isWhale && (
                        <AlertTriangle className="w-3 h-3 ml-1 text-orange-500" />
                      )}
                    </span>
                  </td>
                  <td className="p-2 text-right">
                    $
                    {trade.priceUSD.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </td>
                  <td className="p-2 text-right">
                    {trade.amountBTC.toLocaleString(undefined, {
                      minimumFractionDigits: 4,
                      maximumFractionDigits: 4,
                    })}
                  </td>
                  <td
                    className={`p-2 text-right font-black tracking-tight ${trade.isWhale ? "text-orange-600" : "text-white"}`}
                  >
                    $
                    {trade.totalUSD.toLocaleString(undefined, {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    })}
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
            {filteredTrades.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="text-center p-8 text-[#787B86] text-sm"
                >
                  Waiting for live trades...
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
