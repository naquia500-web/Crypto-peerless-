import { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  ReferenceLine,
} from "recharts";
import {
  Star,
  Share,
  ChevronDown,
  Activity,
  CornerUpRight,
  Briefcase,
  FileText,
  Globe,
  Search,
  Shield,
  ChevronRight,
  Settings,
  Maximize2,
  Info,
  X,
  Zap,
} from "lucide-react";
import { LiveCoinTracker } from "./LiveCoinTracker";

interface ChartData {
  time: string;
  price: number;
  volume: number;
}

export interface Asset {
  id: string;
  name: string;
  symbol: string;
  binanceSymbol: string;
  icon: string;
  rank: number;
}

export const ASSETS: Asset[] = [
  {
    id: "btc",
    name: "Bitcoin",
    symbol: "BTC",
    binanceSymbol: "BTCUSDT",
    icon: "https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/svg/color/btc.svg",
    rank: 1,
  },
  {
    id: "eth",
    name: "Ethereum",
    symbol: "ETH",
    binanceSymbol: "ETHUSDT",
    icon: "https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/svg/color/eth.svg",
    rank: 2,
  },
  {
    id: "bnb",
    name: "BNB",
    symbol: "BNB",
    binanceSymbol: "BNBUSDT",
    icon: "https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/svg/color/bnb.svg",
    rank: 4,
  },
  {
    id: "sol",
    name: "Solana",
    symbol: "SOL",
    binanceSymbol: "SOLUSDT",
    icon: "https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/svg/color/sol.svg",
    rank: 5,
  },
  {
    id: "xrp",
    name: "XRP",
    symbol: "XRP",
    binanceSymbol: "XRPUSDT",
    icon: "https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/svg/color/xrp.svg",
    rank: 6,
  },
  {
    id: "ada",
    name: "Cardano",
    symbol: "ADA",
    binanceSymbol: "ADAUSDT",
    icon: "https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/svg/color/ada.svg",
    rank: 8,
  },
  {
    id: "doge",
    name: "Dogecoin",
    symbol: "DOGE",
    binanceSymbol: "DOGEUSDT",
    icon: "https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/svg/color/doge.svg",
    rank: 9,
  },
  {
    id: "dot",
    name: "Polkadot",
    symbol: "DOT",
    binanceSymbol: "DOTUSDT",
    icon: "https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/svg/color/dot.svg",
    rank: 11,
  },
  {
    id: "matic",
    name: "Polygon",
    symbol: "MATIC",
    binanceSymbol: "MATICUSDT",
    icon: "https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/svg/color/matic.svg",
    rank: 14,
  },
  {
    id: "link",
    name: "Chainlink",
    symbol: "LINK",
    binanceSymbol: "LINKUSDT",
    icon: "https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/svg/color/link.svg",
    rank: 15,
  },
  {
    id: "avax",
    name: "Avalanche",
    symbol: "AVAX",
    binanceSymbol: "AVAXUSDT",
    icon: "https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/svg/color/avax.svg",
    rank: 12,
  },
];

export function AssetChart() {
  const [data, setData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState<
    "1D" | "2D" | "7D" | "1M" | "1Y" | "ALL"
  >("2D");
  const [chartMode, setChartMode] = useState<
    "Price" | "MarketCap" | "TradingView"
  >("Price");
  const [btcAmount, setBtcAmount] = useState("1");

  const [activeAsset, setActiveAsset] = useState<Asset>(ASSETS[0]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [showReasonModal, setShowReasonModal] = useState(false);

  useEffect(() => {
    let intervalStr = "1h";
    let limit = 24;

    if (timeframe === "1D") {
      intervalStr = "1h";
      limit = 24;
    }
    if (timeframe === "2D") {
      intervalStr = "1h";
      limit = 48;
    }
    if (timeframe === "7D") {
      intervalStr = "4h";
      limit = 42;
    }
    if (timeframe === "1M") {
      intervalStr = "1d";
      limit = 30;
    }
    if (timeframe === "1Y") {
      intervalStr = "1w";
      limit = 52;
    }
    if (timeframe === "ALL") {
      intervalStr = "1M";
      limit = 120;
    }

    let ws: WebSocket | null = null;
    let isActive = true;

    setLoading(true);
    fetch(
      `https://api.binance.com/api/v3/klines?symbol=${activeAsset.binanceSymbol}&interval=${intervalStr}&limit=${limit}`,
    )
      .then((res) => res.json())
      .then((json: any[][]) => {
        const formattedData = json.map((candle) => {
          const date = new Date(candle[0]);
          let timeLabel = "";
          if (timeframe === "1D" || timeframe === "2D")
            timeLabel = date.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            });
          else if (timeframe === "7D" || timeframe === "1M")
            timeLabel = date.toLocaleDateString([], {
              month: "short",
              day: "numeric",
            });
          else timeLabel = date.getFullYear().toString();

          return {
            time: timeLabel,
            price: parseFloat(candle[4]),
            volume: parseFloat(candle[5]),
          };
        });

        if (!isActive) return;
        setData(formattedData);
        setLoading(false);
      })
      .catch(() => {
        if (isActive) setLoading(false);
      });

    return () => {
      isActive = false;
      if (ws) ws.close();
    };
  }, [timeframe, activeAsset]);

  const currentPrice = data.length > 0 ? data[data.length - 1].price : 0;
  const firstPrice = data.length > 0 ? data[0].price : 0;
  const isPositive = currentPrice >= firstPrice;
  const percentage =
    firstPrice > 0
      ? (((currentPrice - firstPrice) / firstPrice) * 100).toFixed(2)
      : "0.00";

  const minPrice = data.length > 0 ? Math.min(...data.map((d) => d.price)) : 0;
  const maxPrice = data.length > 0 ? Math.max(...data.map((d) => d.price)) : 0;

  const buffer = (maxPrice - minPrice) * 0.05;
  const yMin = minPrice - buffer;
  const yMax = maxPrice + buffer;

  const usdValue = (parseFloat(btcAmount || "0") * currentPrice).toLocaleString(
    undefined,
    { minimumFractionDigits: 2, maximumFractionDigits: 2 },
  );

  const filteredAssets = ASSETS.filter(
    (a) =>
      a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.symbol.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const themeColor = isPositive ? "#16c784" : "#ea3943";

  return (
    <div className="bg-[#131722] text-white rounded-xl overflow-hidden font-sans shadow-sm w-full">
      <div className="p-6 md:p-8">
        {/* Header Title Section */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="flex flex-col gap-2 relative z-20">
            <div className="flex items-center gap-2">
              <img
                src={activeAsset.icon}
                alt={activeAsset.name}
                className="w-8 h-8 rounded-full"
              />
              <h1 className="text-2xl font-bold text-white">
                {activeAsset.name}
              </h1>
              <span className="text-[#787B86] font-bold text-sm">
                {activeAsset.symbol}
              </span>
              <span className="bg-[#2A2E39] text-[#B2B5BE] text-xs font-bold px-2 py-0.5 rounded ml-1 border border-[#2A2E39]">
                #{activeAsset.rank}
              </span>
            </div>

            <div className="flex items-center gap-3 mt-1 relative z-30">
              <span className="text-4xl font-bold tracking-tight text-white drop-shadow-sm">
                $
                {currentPrice.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 8,
                })}
              </span>
              <span
                className={`flex items-center text-sm font-bold ${isPositive ? "text-green-400" : "text-red-400"}`}
              >
                {isPositive ? "▲" : "▼"} {Math.abs(parseFloat(percentage))}%
                (24h)
              </span>
            </div>

            <div className="mt-2 text-sm relative z-30">
              <button
                onClick={() => setShowReasonModal(true)}
                className="bg-blue-100 text-blue-800 border border-blue-200 px-3 py-1.5 rounded-full font-bold flex items-center w-max gap-1 hover:bg-blue-200 transition-colors shadow-sm outline-none"
              >
                <Activity className="w-3.5 h-3.5" /> Why is {activeAsset.symbol}
                's price {isPositive ? "up" : "down"} today?{" "}
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="flex flex-col items-end gap-2 mt-2 md:mt-0 relative z-30">
            <div className="relative w-full md:w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#787B86]" />
              <input
                type="text"
                placeholder="Search coins..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowDropdown(true);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && filteredAssets.length > 0) {
                    setActiveAsset(filteredAssets[0]);
                    setTimeframe("2D");
                    setShowDropdown(false);
                    setSearchQuery("");
                  }
                }}
                onFocus={() => setShowDropdown(true)}
                className="pl-9 pr-4 py-2 bg-[#1E222D] hover:bg-[#131722] border border-[#363A45] focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg text-sm font-semibold transition-all shadow-sm w-full placeholder:text-[#787B86] text-white outline-none"
              />

              {showDropdown && (
                <div className="absolute top-full right-0 mt-2 w-full md:w-72 bg-[#1E222D] border border-[#363A45] rounded-xl shadow-xl overflow-hidden z-50 max-h-[300px] overflow-y-auto">
                  {filteredAssets.length > 0 ? (
                    <div className="flex flex-col">
                      {filteredAssets.map((asset) => (
                        <div
                          key={asset.id}
                          onClick={() => {
                            setActiveAsset(asset);
                            setTimeframe("2D");
                            setShowDropdown(false);
                            setSearchQuery("");
                          }}
                          className="flex items-center gap-3 px-4 py-3 hover:bg-[#2A2E39] cursor-pointer transition-colors border-b border-[#363A45] last:border-0"
                        >
                          <img
                            src={asset.icon}
                            alt={asset.name}
                            className="w-6 h-6 rounded-full"
                          />
                          <div className="flex flex-col">
                            <span className="text-white font-bold text-sm">
                              {asset.name}
                            </span>
                            <span className="text-[#787B86] text-xs font-mono">
                              {asset.symbol}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="px-4 py-4 text-center text-[#787B86] text-sm">
                      No coins found
                    </div>
                  )}
                </div>
              )}
              {/* Click outside overlay */}
              {showDropdown && (
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowDropdown(false)}
                ></div>
              )}
            </div>
            <div className="flex flex-wrap items-center justify-end gap-2 mt-1">
              <button className="flex items-center gap-1.5 text-[#B2B5BE] bg-[#131722] border border-[#363A45] shadow-sm hover:bg-[#1E222D] hover:border-slate-400 px-3 py-1.5 rounded-lg text-sm font-bold transition-all">
                <Star className="w-4 h-4 text-emerald-500" /> 6M
              </button>
              <button className="flex items-center gap-1.5 text-[#B2B5BE] bg-[#131722] border border-[#363A45] shadow-sm hover:bg-[#1E222D] hover:border-slate-400 p-1.5 rounded-lg text-sm transition-all">
                <Share className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Chart Header Toggles */}
        <div className="mt-8">
          <h2 className="text-lg font-bold text-[#D1D4DC] mb-4">
            {activeAsset.name} to USD Chart
          </h2>
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
            <div className="flex items-center bg-[#2A2E39] rounded-lg p-0.5 w-max">
              <button
                onClick={() => setChartMode("Price")}
                className={`px-3 py-1.5 text-[13px] font-bold rounded-[5px] transition-colors ${chartMode === "Price" ? "bg-[#131722] shadow text-white" : "text-[#787B86] hover:text-[#B2B5BE]"}`}
              >
                Price
              </button>
              <button
                onClick={() => setChartMode("MarketCap")}
                className={`px-3 py-1.5 text-[13px] font-bold rounded-[5px] transition-colors ${chartMode === "MarketCap" ? "bg-[#131722] shadow text-white" : "text-[#787B86] hover:text-[#B2B5BE]"}`}
              >
                Mkt Cap
              </button>
              <button
                onClick={() => setChartMode("TradingView")}
                className={`flex items-center gap-1 px-3 py-1.5 text-[13px] font-bold rounded-[5px] transition-colors ${chartMode === "TradingView" ? "bg-[#131722] shadow text-white" : "text-[#787B86] hover:text-[#B2B5BE]"}`}
              >
                <Activity className="w-3.5 h-3.5" /> TradingView
              </button>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => alert("Compare feature coming soon!")}
                className="flex items-center gap-1 px-3 py-1.5 text-[13px] font-bold text-[#787B86] hover:bg-[#2A2E39] hover:text-white transition-colors rounded-lg"
              >
                Compare <ChevronDown className="w-3.5 h-3.5" />
              </button>
              <div className="w-px h-4 bg-slate-200 mx-1"></div>

              {(["1D", "2D", "7D", "1M", "1Y", "ALL"] as const).map((tf) => (
                <button
                  key={tf}
                  onClick={() => setTimeframe(tf)}
                  className={`px-2 py-1 text-[13px] font-bold rounded-lg transition-colors ${
                    timeframe === tf
                      ? "bg-[#2A2E39] text-white"
                      : "text-[#787B86] hover:text-white"
                  }`}
                >
                  {tf}
                </button>
              ))}
              <div className="w-px h-4 bg-slate-200 mx-1"></div>
              <button
                onClick={() => alert("Logarithmic scale toggled")}
                className="px-2 py-1 text-[13px] font-bold text-[#787B86] hover:text-white rounded-md flex items-center gap-1 transition-colors"
              >
                Log
              </button>
              <button
                onClick={() => alert("Chart settings opened")}
                className="p-1.5 text-[#787B86] hover:text-white rounded-md transition-colors"
              >
                <Settings className="w-4 h-4" />
              </button>
              <button
                onClick={() => alert("Fullscreen mode")}
                className="p-1.5 text-[#787B86] hover:text-white rounded-md transition-colors"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Chart Area */}
        <div className="h-[400px] w-full relative pt-2">
          {chartMode === "TradingView" ? (
            <iframe
              key={`tv-${timeframe}`}
              src={`https://s.tradingview.com/widgetembed/?frameElementId=tradingview_widget&symbol=BINANCE%3ABTCUSDT&interval=${timeframe === "1D" ? "15" : timeframe === "2D" ? "30" : timeframe === "7D" ? "60" : timeframe === "1M" ? "D" : "W"}&hidesidetoolbar=1&symboledit=1&saveimage=1&toolbarbg=f1f3f6&studies=%5B%5D&theme=light&style=1&timezone=Etc%2FUTC&studies_overrides=%7B%7D&overrides=%7B%7D&enabled_features=%5B%5D&disabled_features=%5B%5D&locale=en`}
              className="w-full h-full border-0"
              title="TradingView Chart"
            />
          ) : loading ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#131722]/80 z-10">
              <div className="w-8 h-8 border-2 border-blue-600 border-r-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={data}
                margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="0%"
                      stopColor={themeColor}
                      stopOpacity={0.4}
                    />
                    <stop
                      offset="100%"
                      stopColor={themeColor}
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#2A2E39"
                />
                <XAxis
                  dataKey="time"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: "#787B86", fontWeight: 500 }}
                  minTickGap={30}
                  dy={10}
                />
                <YAxis
                  domain={[yMin, yMax]}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: "#787B86", fontWeight: 500 }}
                  tickFormatter={(val) => {
                    const formattedVal =
                      chartMode === "MarketCap"
                        ? val * 19780000 /* proxy supply */
                        : val;
                    if (formattedVal >= 1e12)
                      return (formattedVal / 1e12).toFixed(2) + "T";
                    if (formattedVal >= 1e9)
                      return (formattedVal / 1e9).toFixed(2) + "B";
                    if (formattedVal >= 1e6)
                      return (formattedVal / 1e6).toFixed(2) + "M";
                    if (formattedVal >= 1000)
                      return (formattedVal / 1000).toFixed(2) + "K";
                    return formattedVal.toString();
                  }}
                  width={60}
                  orientation="right"
                  dx={10}
                />
                <Tooltip
                  cursor={{
                    stroke: "#B2B5BE",
                    strokeWidth: 1,
                    strokeDasharray: "3 3",
                  }}
                  contentStyle={{
                    backgroundColor: "#1E222D",
                    border: "1px solid #363A45",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.4)",
                  }}
                  itemStyle={{
                    color: "#fff",
                    fontSize: "14px",
                    fontWeight: "bold",
                  }}
                  labelStyle={{
                    color: "#787B86",
                    marginBottom: "4px",
                    fontSize: "12px",
                  }}
                  formatter={(value: number) => {
                    let displayValue =
                      chartMode === "MarketCap" ? value * 19780000 : value;
                    let formatted = "";
                    if (chartMode === "MarketCap" && displayValue >= 1e12)
                      formatted = `$${(displayValue / 1e12).toFixed(2)}T`;
                    else if (chartMode === "MarketCap" && displayValue >= 1e9)
                      formatted = `$${(displayValue / 1e9).toFixed(2)}B`;
                    else
                      formatted = `$${displayValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
                    return [
                      formatted,
                      chartMode === "MarketCap" ? "Market Cap" : "Price",
                    ];
                  }}
                />
                <ReferenceLine
                  y={firstPrice}
                  stroke="#787B86"
                  strokeDasharray="3 3"
                  opacity={0.5}
                />
                <Area
                  type="monotone"
                  dataKey="price"
                  stroke={themeColor}
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorPrice)"
                  activeDot={{
                    r: 4,
                    fill: "#131722",
                    stroke: themeColor,
                    strokeWidth: 2,
                  }}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Converter Section */}
        <div className="mb-10">
          <h3 className="text-sm font-bold text-[#D1D4DC] mb-4">
            BTC to USD converter
          </h3>
          <div className="flex flex-col lg:flex-row items-center gap-1">
            <div className="flex items-center justify-between border border-[#2A2E39] rounded-lg p-3 w-full bg-[#131722] hover:border-[#363A45] focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all">
              <div className="flex items-center gap-2">
                <img
                  src="https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/svg/color/btc.svg"
                  alt=""
                  className="w-5 h-5"
                />
                <span className="text-[#787B86] font-bold text-sm">BTC</span>
              </div>
              <input
                type="number"
                value={btcAmount}
                onChange={(e) => setBtcAmount(e.target.value)}
                className="bg-transparent text-right font-bold text-white focus:outline-none w-full ml-4"
              />
            </div>
            <div className="flex items-center justify-between border border-[#2A2E39] rounded-lg p-3 w-full bg-[#131722] hover:border-[#363A45] focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-white text-[10px] font-bold">
                  $
                </div>
                <span className="text-[#787B86] font-bold text-sm">USD</span>
              </div>
              <div className="text-right font-bold text-white w-full ml-4 overflow-hidden text-ellipsis">
                {usdValue}
              </div>
            </div>
          </div>
        </div>

        {/* Bitcoin Statistics Grid */}
        <div className="mb-10">
          <h3 className="text-sm font-bold text-[#D1D4DC] mb-4">
            Bitcoin statistics
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            <button
              onClick={() => {
                setChartMode("MarketCap");
                setTimeframe("2D");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="flex flex-col border border-[#2A2E39] rounded-lg p-4 hover:bg-[#1E222D] transition-colors text-left relative z-30"
            >
              <div className="flex items-center gap-1 text-[#787B86] text-[11px] font-bold uppercase">
                Market cap <Info className="w-3.5 h-3.5" />
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm font-bold text-white">$1.51T</span>
                <span className="flex items-center text-xs font-bold text-red-400">
                  ▼ 0.1%
                </span>
              </div>
            </button>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => {
                  setChartMode("Price");
                  setTimeframe("2D");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="flex flex-col border border-[#2A2E39] rounded-lg p-4 hover:bg-[#1E222D] transition-colors text-left relative z-30"
              >
                <div className="flex items-center gap-1 text-[#787B86] text-[11px] font-bold uppercase">
                  Volume (24h) <Info className="w-3.5 h-3.5" />
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm font-bold text-white">$38.69B</span>
                  <span className="flex items-center text-xs font-bold text-green-500">
                    ▲ 2.18%
                  </span>
                </div>
              </button>
              <button
                onClick={() => alert("Loading Vol/Mkt Cap ratio details...")}
                className="flex flex-col border border-[#2A2E39] rounded-lg p-4 hover:bg-[#1E222D] transition-colors text-left relative z-30"
              >
                <div className="flex items-center gap-1 text-[#787B86] text-[11px] font-bold uppercase">
                  Vol/Mkt Cap (24h) <Info className="w-3.5 h-3.5" />
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm font-bold text-white">2.54%</span>
                </div>
              </button>
            </div>

            <button
              onClick={() => alert("Loading FDV details...")}
              className="flex flex-col border border-[#2A2E39] rounded-lg p-4 hover:bg-[#1E222D] transition-colors text-left relative z-30"
            >
              <div className="flex items-center gap-1 text-[#787B86] text-[11px] font-bold uppercase">
                FDV <Info className="w-3.5 h-3.5" />
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm font-bold text-white">$1.58T</span>
              </div>
            </button>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => alert("Loading Total Supply details...")}
                className="flex flex-col border border-[#2A2E39] rounded-lg p-4 justify-center hover:bg-[#1E222D] transition-colors text-left relative z-30 w-full outline-none"
              >
                <div className="flex justify-between items-center w-full">
                  <div className="flex items-center gap-1 text-[#787B86] text-[11px] font-bold uppercase">
                    Total supply <Info className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-sm font-bold text-white">
                    20.01M BTC
                  </span>
                </div>
              </button>
              <button
                onClick={() => alert("Loading Max Supply details...")}
                className="flex flex-col border border-[#2A2E39] rounded-lg p-4 justify-center hover:bg-[#1E222D] transition-colors text-left relative z-30 w-full outline-none"
              >
                <div className="flex justify-between items-center w-full">
                  <div className="flex items-center gap-1 text-[#787B86] text-[11px] font-bold uppercase">
                    Max. supply <Info className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-sm font-bold text-white">21M BTC</span>
                </div>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 md:col-span-2">
              <button
                onClick={() => alert("Loading Circulating Supply details...")}
                className="flex flex-col border border-[#2A2E39] rounded-lg p-4 justify-center hover:bg-[#1E222D] transition-colors text-left relative z-30 w-full outline-none"
              >
                <div className="flex justify-between items-center w-full">
                  <div className="flex items-center gap-1 text-[#787B86] text-[11px] font-bold uppercase">
                    Circulating supply <Info className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-sm font-bold text-white">
                    20.01M BTC
                  </span>
                </div>
                <div className="w-full bg-[#2A2E39] h-1.5 rounded-full mt-2">
                  <div
                    className="bg-slate-900 h-1.5 rounded-full"
                    style={{ width: "95%" }}
                  ></div>
                </div>
              </button>
              <button
                onClick={() => alert("Loading Treasury Holdings details...")}
                className="flex flex-col border border-[#2A2E39] rounded-lg p-4 justify-center hover:bg-[#1E222D] transition-colors text-left relative z-30 w-full outline-none"
              >
                <div className="flex justify-between items-center w-full">
                  <div className="flex items-center gap-1 text-[#787B86] text-[11px] font-bold uppercase">
                    Treasury Holdings <Info className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-sm font-bold text-white">
                    1.17M BTC
                  </span>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Extra Lists - Profile Score, Links, etc */}
        <div className="mt-8 pt-4 border-t border-[#2A2E39] flex flex-col gap-4 max-w-2xl text-[13px] relative z-30">
          <button
            onClick={() => alert("Viewing Profile Score Breakdown...")}
            className="flex w-full justify-between items-center py-2 border-b border-[#2A2E39] hover:bg-[#1E222D] transition-colors rounded px-2 -mx-2 outline-none"
          >
            <span className="text-[#787B86] font-bold flex items-center gap-1">
              Profile score <Info className="w-3.5 h-3.5" />
            </span>
            <span className="text-green-500 font-bold">100%</span>
          </button>

          <div className="flex w-full justify-between items-center py-2 border-b border-[#2A2E39] px-2 -mx-2">
            <span className="text-[#787B86] font-bold">Website</span>
            <div className="flex gap-2">
              <button
                onClick={() => alert(`Opening ${activeAsset.name} website`)}
                className="bg-[#2A2E39] hover:bg-slate-200 text-[#B2B5BE] hover:text-[#131722] px-3 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer font-semibold transition-colors outline-none"
              >
                <Globe className="w-3.5 h-3.5" /> Website
              </button>
              <button
                onClick={() => alert(`Opening ${activeAsset.name} whitepaper`)}
                className="bg-[#2A2E39] hover:bg-slate-200 text-[#B2B5BE] hover:text-[#131722] px-3 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer font-semibold transition-colors outline-none"
              >
                <FileText className="w-3.5 h-3.5" /> Whitepaper
              </button>
            </div>
          </div>

          <button
            onClick={() => alert("Viewing CertiK Audit Rating...")}
            className="flex w-full justify-between items-center py-2 border-b border-[#2A2E39] hover:bg-[#1E222D] transition-colors rounded px-2 -mx-2 outline-none"
          >
            <span className="text-[#787B86] font-bold">Rating (CertiK)</span>
            <span className="font-bold flex items-center gap-2 text-white">
              4.9 <span className="text-yellow-400">★★★★★</span>
            </span>
          </button>

          <div className="flex flex-col gap-2 py-2">
            <span className="text-[#787B86] font-bold">Tags</span>
            <div className="flex gap-2 flex-wrap">
              <button className="bg-[#2A2E39] hover:bg-[#363A45] text-[#787B86] hover:text-[#B2B5BE] px-3 py-1 rounded-md text-xs font-bold transition-colors">
                Mineable
              </button>
              <button className="bg-[#2A2E39] hover:bg-[#363A45] text-[#787B86] hover:text-[#B2B5BE] px-3 py-1 rounded-md text-xs font-bold transition-colors">
                PoW
              </button>
              <button className="bg-[#2A2E39] hover:bg-[#363A45] text-[#787B86] hover:text-[#B2B5BE] px-3 py-1 rounded-md text-xs font-bold transition-colors">
                SHA-256
              </button>
              <button className="bg-[#2A2E39] hover:bg-[#363A45] text-[#787B86] hover:text-[#B2B5BE] px-3 py-1 rounded-md text-xs font-bold transition-colors">
                Store Of Value
              </button>
              <button
                onClick={() => alert("Showing all tags")}
                className="text-slate-400 font-bold px-1 py-1 text-xs cursor-pointer hover:text-white transition-colors"
              >
                Show all
              </button>
            </div>
          </div>

          <button
            onClick={() =>
              alert(`Loading more information about ${activeAsset.name}`)
            }
            className="w-full mt-2 bg-[#1E222D] text-[#B2B5BE] font-bold py-2 rounded-lg hover:bg-[#2A2E39] hover:text-white transition-colors border border-[#2A2E39]"
          >
            More information
          </button>
        </div>
      </div>

      {showReasonModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#1E222D] rounded-2xl w-full max-w-lg border border-[#2A2E39] shadow-2xl overflow-hidden flex flex-col">
            <div className="p-6 border-b border-[#2A2E39] flex justify-between items-center bg-[#131722]">
              <div className="flex items-center gap-3">
                <div className="bg-blue-500/20 p-2 rounded-xl border border-blue-500/30">
                  <Zap className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">
                    Why is {activeAsset.symbol} {isPositive ? "up" : "down"}?
                  </h3>
                  <p className="text-sm text-gray-400">
                    AI-Powered Market Analysis
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowReasonModal(false)}
                className="text-gray-400 hover:text-white p-2 hover:bg-[#2A2E39] rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 flex flex-col gap-5 bg-[#131722]/50">
              {isPositive ? (
                <>
                  <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4">
                    <h4 className="font-bold text-green-400 mb-2 flex items-center gap-2">
                      <Activity className="w-4 h-4" /> Strong Buying Pressure
                    </h4>
                    <p className="text-sm text-gray-300 leading-relaxed">
                      {activeAsset.symbol} is seeing heavy accumulation from
                      institutional addresses over the past 24 hours. The order
                      book shows aggressive market buying offsetting any sell
                      walls.
                    </p>
                  </div>
                  <div className="bg-[#2A2E39] rounded-xl p-4">
                    <h4 className="font-bold text-white mb-2 flex items-center gap-2">
                      <Globe className="w-4 h-4 text-blue-400" /> Macro Factors
                    </h4>
                    <p className="text-sm text-gray-300 leading-relaxed">
                      Positive market sentiment is driven by recent encouraging
                      macroeconomic data and a wave of liquidations of short
                      positions, fueling the upward price momentum.
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
                    <h4 className="font-bold text-red-400 mb-2 flex items-center gap-2">
                      <Activity className="w-4 h-4" /> Increased Selling
                      Pressure
                    </h4>
                    <p className="text-sm text-gray-300 leading-relaxed">
                      {activeAsset.symbol} is facing resistance with significant
                      taking-profit activities from short-term holders. Sell
                      volume has outpaced buy volume in the last few hours.
                    </p>
                  </div>
                  <div className="bg-[#2A2E39] rounded-xl p-4">
                    <h4 className="font-bold text-white mb-2 flex items-center gap-2">
                      <Globe className="w-4 h-4 text-blue-400" /> Macro Factors
                    </h4>
                    <p className="text-sm text-gray-300 leading-relaxed">
                      Broader market uncertainty and slight shifts in global
                      sentiment have caused momentum traders to pull back,
                      resulting in technical corrections.
                    </p>
                  </div>
                </>
              )}

              <div className="mt-2 text-xs text-gray-500 flex justify-center items-center gap-1.5">
                <Shield className="w-3.5 h-3.5" />
                This analysis is generated dynamically based on simulated data.
              </div>
            </div>

            <div className="p-4 bg-[#1E222D] border-t border-[#2A2E39] flex justify-end">
              <button
                onClick={() => setShowReasonModal(false)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold transition-colors"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
