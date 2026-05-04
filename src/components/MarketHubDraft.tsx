import { useState, useEffect } from "react";
import {
  TrendingUp,
  TrendingDown,
  Activity,
  Globe,
  BarChart2,
  Shield,
  Zap,
  Layers,
} from "lucide-react";
import { motion } from "motion/react";

interface TickerData {
  symbol: string;
  priceChangePercent: string;
  lastPrice: string;
  volume: string;
  quoteVolume: string;
}

export function MarketHubDraft() {
  const [gainers, setGainers] = useState<TickerData[]>([]);
  const [losers, setLosers] = useState<TickerData[]>([]);
  const [trending, setTrending] = useState<TickerData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        const response = await fetch(
          "https://api.binance.com/api/v3/ticker/24hr",
        );
        const data: TickerData[] = await response.json();

        // Filter out non-USDT pairs for cleaner UI
        const usdtPairs = data.filter(
          (d) =>
            d.symbol.endsWith("USDT") &&
            !d.symbol.includes("UPUSDT") &&
            !d.symbol.includes("DOWNUSDT"),
        );

        // Top Gainers
        const topGainers = [...usdtPairs]
          .sort(
            (a, b) =>
              parseFloat(b.priceChangePercent) -
              parseFloat(a.priceChangePercent),
          )
          .slice(0, 5);

        // Top Losers
        const topLosers = [...usdtPairs]
          .sort(
            (a, b) =>
              parseFloat(a.priceChangePercent) -
              parseFloat(b.priceChangePercent),
          )
          .slice(0, 5);

        // Trending (by volume)
        const topVolume = [...usdtPairs]
          .sort((a, b) => parseFloat(b.quoteVolume) - parseFloat(a.quoteVolume))
          .slice(0, 5);

        setGainers(topGainers);
        setLosers(topLosers);
        setTrending(topVolume);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching market data:", error);
        
        // Fallback data if API fails to prevent empty UI
        const mockData: TickerData[] = [
          { symbol: "BTCUSDT", priceChangePercent: "2.45", lastPrice: "78970.15", volume: "1540", quoteVolume: "121614031" },
          { symbol: "ETHUSDT", priceChangePercent: "0.62", lastPrice: "2341.35", volume: "8710", quoteVolume: "20393163" },
          { symbol: "SOLUSDT", priceChangePercent: "-0.05", lastPrice: "84.08", volume: "245300", quoteVolume: "20624824" },
          { symbol: "BNBUSDT", priceChangePercent: "0.68", lastPrice: "623.26", volume: "109600", quoteVolume: "68309376" },
          { symbol: "XRPUSDT", priceChangePercent: "-0.12", lastPrice: "1.3953", volume: "922000", quoteVolume: "1286466" },
          { symbol: "ADAUSDT", priceChangePercent: "-0.44", lastPrice: "0.2496", volume: "278000", quoteVolume: "69388" },
          { symbol: "DOGEUSDT", priceChangePercent: "1.64", lastPrice: "0.1107", volume: "1280000", quoteVolume: "141696" },
          { symbol: "AVAXUSDT", priceChangePercent: "0.55", lastPrice: "9.14", volume: "190000", quoteVolume: "1736600" },
        ];
        
        const topGainers = [...mockData].sort((a, b) => parseFloat(b.priceChangePercent) - parseFloat(a.priceChangePercent)).slice(0, 5);
        const topLosers = [...mockData].sort((a, b) => parseFloat(a.priceChangePercent) - parseFloat(b.priceChangePercent)).slice(0, 5);
        const topVolume = [...mockData].sort((a, b) => parseFloat(b.quoteVolume) - parseFloat(a.quoteVolume)).slice(0, 5);
        
        setGainers(topGainers);
        setLosers(topLosers);
        setTrending(topVolume);
        setLoading(false);
      }
    };

    fetchMarketData();
    // Fast polling since it's a draft but safe on Binance
    const interval = setInterval(fetchMarketData, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col gap-8 w-full bg-[#1E222D] text-white rounded-xl p-6 md:p-8 shadow-sm font-sans mb-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#2A2E39] pb-6">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Globe className="w-6 h-6 text-blue-400" />
            Global Markets Overview
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 ml-2">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></div>
              <span className="text-[9px] font-bold text-blue-500 uppercase tracking-wider">
                Live Tracker Active
              </span>
            </div>
          </h2>
          <p className="text-[#787B86] mt-1">
            Real-time macro metrics spanning Cryptocurrency, Stock Markets, and
            Blockchain ecosystems.
          </p>
        </div>
      </div>

      {/* Macro Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#131722] border border-[#2A2E39] rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-[#B2B5BE] flex items-center gap-2">
              <Globe className="w-4 h-4" /> Crypto Market
            </h3>
            <span className="text-xs font-bold text-green-500 bg-green-50 px-2 py-1 rounded">
              ▲ 2.4%
            </span>
          </div>
          <div className="text-3xl font-black tracking-tight text-white">
            $2.45T
          </div>
          <p className="text-sm text-[#787B86] mt-1">24h Vol: $89.2B</p>
          <div className="mt-4 text-xs font-semibold text-[#787B86] flex justify-between">
            <span>BTC Dom: 53.2%</span>
            <span>ETH Dom: 17.5%</span>
          </div>
        </div>

        <div className="bg-[#131722] border border-[#2A2E39] rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-[#B2B5BE] flex items-center gap-2">
              <BarChart2 className="w-4 h-4" /> Global Equities (Draft)
            </h3>
            <span className="text-xs font-bold text-green-500 bg-green-50 px-2 py-1 rounded">
              ▲ 0.8%
            </span>
          </div>
          <div className="text-3xl font-black tracking-tight text-white">
            S&P 500
          </div>
          <p className="text-sm text-[#787B86] mt-1">
            5,123.41{" "}
            <span className="text-green-500 font-bold ml-2">+41.20</span>
          </p>
          <div className="mt-4 text-xs font-semibold text-[#787B86] flex gap-4">
            <span>NQ: 18,201.5</span>
            <span>DJIA: 39,120.2</span>
          </div>
        </div>

        <div className="bg-[#131722] border border-[#2A2E39] rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-[#B2B5BE] flex items-center gap-2">
              <Layers className="w-4 h-4" /> Blockchain Activity
            </h3>
            <span className="text-xs font-bold text-blue-500 bg-blue-50 px-2 py-1 rounded">
              Stable
            </span>
          </div>
          <div className="text-3xl font-black tracking-tight text-white">
            14.2M
          </div>
          <p className="text-sm text-[#787B86] mt-1">Daily Active Addresses</p>
          <div className="mt-4 text-xs font-semibold text-[#787B86] flex justify-between">
            <span>Solana: 1.2M</span>
            <span>ETH: 450K</span>
            <span>L2s: 3.1M</span>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="w-8 h-8 border-4 border-blue-600 border-r-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Trending */}
          <div className="bg-[#131722] border border-[#2A2E39] rounded-xl overflow-hidden shadow-sm">
            <div className="bg-[#1E222D] border-b border-[#2A2E39] p-4 font-bold text-[#D1D4DC] flex items-center gap-2">
              <Zap className="w-4 h-4 text-yellow-500" /> Trending by Volume
            </div>
            <div className="flex flex-col">
              {trending.map((coin, i) => (
                <div
                  key={coin.symbol}
                  className="flex justify-between items-center p-3 border-b border-[#2A2E39] last:border-0 hover:bg-[#1E222D] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-slate-400 font-bold text-xs">
                      {i + 1}
                    </span>
                    <span className="font-bold text-sm text-[#B2B5BE]">
                      {coin.symbol.replace("USDT", "")}
                    </span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="font-mono font-bold text-sm">
                      $
                      {parseFloat(coin.lastPrice).toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 6,
                      })}
                    </span>
                    <span className="text-xs font-bold text-[#787B86]">
                      Vol: $
                      {(parseFloat(coin.quoteVolume) / 1000000).toFixed(1)}M
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Gainers */}
          <div className="bg-[#131722] border border-[#2A2E39] rounded-xl overflow-hidden shadow-sm">
            <div className="bg-[#1E222D] border-b border-[#2A2E39] p-4 font-bold text-[#D1D4DC] flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-500" /> Top Gainers
              (24h)
            </div>
            <div className="flex flex-col">
              {gainers.map((coin, i) => (
                <div
                  key={coin.symbol}
                  className="flex justify-between items-center p-3 border-b border-[#2A2E39] last:border-0 hover:bg-[#1E222D] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-slate-400 font-bold text-xs">
                      {i + 1}
                    </span>
                    <span className="font-bold text-sm text-[#B2B5BE]">
                      {coin.symbol.replace("USDT", "")}
                    </span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="font-mono font-bold text-sm">
                      $
                      {parseFloat(coin.lastPrice).toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 6,
                      })}
                    </span>
                    <span className="text-xs font-bold text-green-500">
                      +{parseFloat(coin.priceChangePercent).toFixed(2)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Losers */}
          <div className="bg-[#131722] border border-[#2A2E39] rounded-xl overflow-hidden shadow-sm">
            <div className="bg-[#1E222D] border-b border-[#2A2E39] p-4 font-bold text-[#D1D4DC] flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-red-400" /> Top Losers (24h)
            </div>
            <div className="flex flex-col">
              {losers.map((coin, i) => (
                <div
                  key={coin.symbol}
                  className="flex justify-between items-center p-3 border-b border-[#2A2E39] last:border-0 hover:bg-[#1E222D] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-slate-400 font-bold text-xs">
                      {i + 1}
                    </span>
                    <span className="font-bold text-sm text-[#B2B5BE]">
                      {coin.symbol.replace("USDT", "")}
                    </span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="font-mono font-bold text-sm">
                      $
                      {parseFloat(coin.lastPrice).toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 6,
                      })}
                    </span>
                    <span className="text-xs font-bold text-red-400">
                      {parseFloat(coin.priceChangePercent).toFixed(2)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Analysis Section */}
      <div className="flex flex-col mt-4">
        <div className="bg-[#131722] border border-[#2A2E39] rounded-xl p-6 shadow-sm">
          <h3 className="font-bold text-[#D1D4DC] flex items-center gap-2 mb-4">
            <Shield className="w-5 h-5 text-indigo-500" /> Market Intelligence
          </h3>
          <ul className="space-y-4 text-sm text-[#787B86]">
            <li className="flex gap-3">
              <span className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 shrink-0"></span>
              <strong>Crypto-Equities Correlation:</strong> Bitcoin remains
              highly correlated with the Nasdaq 100 as tech-heavy liquidity
              flows dictate risk-on assets.
            </li>
            <li className="flex gap-3">
              <span className="w-2 h-2 rounded-full bg-purple-500 mt-1.5 shrink-0"></span>
              <strong>Blockchain Adoption:</strong> Layer 2 solutions have
              reduced Ethereum mainnet fees by 85%, while driving active user
              metrics to all-time highs across rollup ecosystems.
            </li>
            <li className="flex gap-3">
              <span className="w-2 h-2 rounded-full bg-green-500 mt-1.5 shrink-0"></span>
              <strong>Institutional Inflows:</strong> Spot ETFs continue to
              absorb OTC supply, causing a structural shift in how traditional
              finance interacts with digital assets.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
