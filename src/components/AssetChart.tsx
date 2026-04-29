import { useEffect, useState, useMemo } from 'react';
import { ComposedChart, Area, Bar, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Share, Star, Globe, FileText, Github, Shield, Search, ChevronRight, Activity, ArrowRightLeft, SlidersHorizontal } from 'lucide-react';
import { LiveCoinTracker } from './LiveCoinTracker';

interface ChartData {
  time: string;
  price: number;
  volume: number;
  sma20?: number;
  ema50?: number;
}

const SUB_NAV = ['Overview', 'Markets', 'News', 'Community', 'Yield', 'Market Cycles', 'Treasuries'];

function StatBlock({ label, value, change, highlight }: { label: string, value: string, change?: string, highlight?: boolean }) {
  return (
    <div className="flex flex-col gap-1 p-3 bg-white/5 border border-white/5 rounded-lg">
      <span className="text-[10px] text-white/50 font-bold uppercase tracking-widest">{label}</span>
      <div className="flex items-center gap-2">
        <span className={`font-mono text-sm ${highlight ? 'text-white font-bold' : 'text-white/90'}`}>{value}</span>
        {change && (
          <span className={`text-[10px] font-mono font-bold px-1 py-0.5 rounded bg-white/5 ${change.startsWith('+') ? 'text-[#00FF88]' : 'text-[#FF4D4D]'}`}>
            {change}
          </span>
        )}
      </div>
    </div>
  );
}

function LinkPill({ icon: Icon, label, href }: { icon: any, label: string, href?: string }) {
  if (href) {
    return (
      <a href={href} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-white/20 border border-white/10 transition-colors rounded-full rounded-tr-sm group inline-flex cursor-pointer">
        <Icon className="w-3.5 h-3.5 opacity-50 group-hover:opacity-100 transition-opacity" />
        <span className="text-[11px] font-bold uppercase tracking-wider opacity-80">{label}</span>
      </a>
    );
  }
  return (
    <button className="flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-white/20 border border-white/10 transition-colors rounded-full rounded-tr-sm group inline-flex">
      <Icon className="w-3.5 h-3.5 opacity-50 group-hover:opacity-100 transition-opacity" />
      <span className="text-[11px] font-bold uppercase tracking-wider opacity-80">{label}</span>
    </button>
  );
}

export function AssetChart() {
  const [data, setData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState<'1D' | '1W' | '1M' | '1Y' | 'ALL'>('1D');
  const [activeTab, setActiveTab] = useState('Overview');
  const [btcAmount, setBtcAmount] = useState('1');
  const [isWatched, setIsWatched] = useState(false);
  const [shareText, setShareText] = useState('Share');
  const [showSMA, setShowSMA] = useState(false);
  const [showEMA, setShowEMA] = useState(false);
  const [showBB, setShowBB] = useState(false);

  const calculateIndicators = (rawData: { time: string, price: number, volume: number }[]) => {
    const smaPeriod = 20;
    const emaPeriod = 50;
    const bbPeriod = 20;
    const bbStdDev = 2;
    
    let emaPrev = rawData.length > 0 ? rawData[0].price : 0;
    const multiplier = 2 / (emaPeriod + 1);

    return rawData.map((d, index) => {
      let sma20: number | undefined = undefined;
      let ema50: number | undefined = undefined;
      let bbUpper: number | undefined = undefined;
      let bbLower: number | undefined = undefined;
      
      // Calculate SMA and BB
      if (index >= smaPeriod - 1) {
        let sum = 0;
        for (let i = 0; i < smaPeriod; i++) {
          sum += rawData[index - i].price;
        }
        sma20 = sum / smaPeriod;

        let varianceSum = 0;
        for (let i = 0; i < bbPeriod; i++) {
          varianceSum += Math.pow(rawData[index - i].price - sma20, 2);
        }
        const stdDev = Math.sqrt(varianceSum / bbPeriod);
        bbUpper = sma20 + bbStdDev * stdDev;
        bbLower = sma20 - bbStdDev * stdDev;
      }
      
      // Calculate EMA
      if (index > 0) {
        ema50 = (d.price - emaPrev) * multiplier + emaPrev;
        emaPrev = ema50;
      } else {
        ema50 = d.price;
      }

      return {
        ...d,
        sma20,
        ema50,
        bbUpper,
        bbLower
      };
    });
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Bitcoin Live Stats',
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setShareText('Copied!');
        setTimeout(() => setShareText('Share'), 2000);
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    let intervalStr = '1h';
    let limit = 24;
    
    if (timeframe === '1D') { intervalStr = '1h'; limit = 24; }
    if (timeframe === '1W') { intervalStr = '4h'; limit = 42; }
    if (timeframe === '1M') { intervalStr = '1d'; limit = 30; }
    if (timeframe === '1Y') { intervalStr = '1w'; limit = 52; }
    if (timeframe === 'ALL') { intervalStr = '1M'; limit = 120; }

    let ws: WebSocket | null = null;
    let isActive = true;

    setLoading(true);
    fetch(`https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=${intervalStr}&limit=${limit}`)
      .then(res => res.json())
      .then((json: any[][]) => {
        const formattedData = json.map(candle => {
          const date = new Date(candle[0]);
          let timeLabel = '';
          if (timeframe === '1D') timeLabel = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          else if (timeframe === '1W' || timeframe === '1M') timeLabel = date.toLocaleDateString([], { month: 'short', day: 'numeric' });
          else timeLabel = date.getFullYear().toString();

          return {
            time: timeLabel,
            price: parseFloat(candle[4]),
            volume: parseFloat(candle[5]),
          };
        });
        
        if (!isActive) return;
        setData(calculateIndicators(formattedData));
        setLoading(false);
        
        // Setup Websocket for live main chart data
        const wsUrl = `wss://stream.binance.com:9443/ws/btcusdt@ticker`;
        const connectWs = () => {
          if (!isActive) return;
          ws = new WebSocket(wsUrl);
          ws.onmessage = (event) => {
            const tData = JSON.parse(event.data);
            const livePrice = parseFloat(tData.c);
            
            // Randomly update the graph point to simulate high-frequency analysis
            if (Math.random() > 0.4) {
              setData(prev => {
                  if (prev.length === 0) return prev;
                  const newPoint = { ...prev[prev.length - 1], price: livePrice };
                  const newData = [...prev.slice(0, prev.length - 1), newPoint];
                  return calculateIndicators(newData);
              });
            }
          };
          ws.onclose = () => {
            if (isActive) setTimeout(connectWs, 5000);
          };
        };
        connectWs();
      })
      .catch((err) => {
        // Fallback silently if adblockers block Binance API
        if (isActive) setLoading(false);
      });
      
    return () => {
      isActive = false;
      if (ws) ws.close();
    };
  }, [timeframe]);

  const currentPrice = data.length > 0 ? data[data.length - 1].price : 76683.50;
  const firstPrice = data.length > 0 ? data[0].price : 75000;
  const highPrice = data.length > 0 ? Math.max(...data.map(d => d.price)) : 0;
  const lowPrice = data.length > 0 ? Math.min(...data.map(d => d.price)) : 0;
  const isPositive = currentPrice >= firstPrice;
  const percentage = (((currentPrice - firstPrice) / firstPrice) * 100).toFixed(2);

  const [stats, setStats] = useState({
    marketCap: "$1.53T",
    volume: "$38.28B",
    volMcap: "2.45%",
    supply: "19.71M BTC"
  });

  useEffect(() => {
    // Try to approximate stats from currentPrice if live data isn't directly available here
    if (currentPrice > 0) {
      const supply = 19710000; // rough current supply
      const mcap = (supply * currentPrice) / 1e12; // in Trillions
      
      const v = data.length > 0 ? data.reduce((acc, curr) => acc + (curr.volume * curr.price), 0) : 0;
      const volB = (v > 0 ? v : 38000000000) / 1e9; // in Billions

      setStats({
        marketCap: `$${mcap.toFixed(2)}T`,
        volume: `$${volB.toFixed(2)}B`,
        volMcap: `${((volB * 1e9) / (mcap * 1e12) * 100).toFixed(2)}%`,
        supply: "19.71M BTC"
      });
    }
  }, [currentPrice, data]);

  const usdValue = (parseFloat(btcAmount || '0') * currentPrice).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <section className="flex flex-col gap-6">
      
      {/* Sub Navigation */}
      <div className="flex overflow-x-auto gap-6 border-b border-white/10 pb-2 custom-scrollbar">
        {SUB_NAV.map((nav) => (
          <button 
            key={nav} 
            onClick={() => {
              setActiveTab(nav);
              const idMap: Record<string, string> = {
                'Overview': 'section-overview',
                'Markets': 'section-markets',
                'News': 'section-news',
                'Community': 'section-community',
                'Yield': 'section-yield',
                'Market Cycles': 'section-market-cycles',
                'Treasuries': 'section-treasuries'
              };
              const targetId = idMap[nav];
              if (targetId) {
                const element = document.getElementById(targetId);
                if (element) {
                   element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
              }
            }}
            className={`text-[11px] font-bold uppercase tracking-widest whitespace-nowrap transition-colors ${activeTab === nav ? 'text-orange-500 border-b-2 border-orange-500 pb-2 -mb-[9px]' : 'text-white/50 hover:text-white'}`}
          >
            {nav}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-0 rounded-2xl overflow-hidden border border-white/10 bg-[#0B0E11] relative shadow-2xl">
        {/* Sleek Top Banner */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[orange] to-transparent opacity-50"></div>
        
        {/* Header Section */}
        <div className="p-6 md:p-8 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 bg-gradient-to-b from-white/5 to-transparent">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full border border-white/10 p-1 flex items-center justify-center bg-white/5 shadow-[0_0_15px_rgba(255,255,255,0.05)]">
                <img 
                  src="https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/svg/color/btc.svg" 
                  alt="Bitcoin Logo" 
                  className="w-full h-full rounded-full"
                />
              </div>
              <div>
                <h1 className="text-3xl font-black italic tracking-tighter uppercase text-transparent bg-clip-text bg-gradient-to-br from-white/80 to-white/50">Bitcoin</h1>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] font-mono font-bold text-orange-400 bg-orange-400/10 border border-orange-400/20 px-1.5 py-0.5 rounded">BTC</span>
                  <span className="text-[10px] uppercase font-bold text-white/50 tracking-widest">Rank #1</span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col mt-2">
              <span className="text-[10px] uppercase font-bold tracking-widest text-white/40 mb-1 flex items-center gap-2">
                 <div className="w-1.5 h-1.5 rounded-full bg-[#00FF88] animate-pulse"></div> Live Market Price <span className="lowercase font-mono text-[8px] animate-pulse">(live tracking)</span>
              </span>
              <div className="flex items-baseline gap-4">
                <span className="text-5xl md:text-6xl font-mono font-black tracking-tighter text-white drop-shadow-lg">
                  ${currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
                {!loading && (
                  <span className={`text-xl font-mono font-bold flex items-center gap-1 ${isPositive ? 'text-[#00FF88] drop-shadow-[0_0_8px_rgba(0,255,136,0.5)]' : 'text-[#FF4D4D] drop-shadow-[0_0_8px_rgba(255,77,77,0.5)]'}`}>
                    {isPositive ? '↗' : '↘'} {Math.abs(parseFloat(percentage))}%
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end gap-3 w-full md:w-auto mt-4 md:mt-0">
            <div className="flex gap-2 w-full md:w-auto">
              <button 
                onClick={() => setIsWatched(!isWatched)}
                className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 ${isWatched ? 'bg-orange-500/20 border-orange-500/50 text-orange-400' : 'bg-white/5 hover:bg-white/20 border-white/10'} border rounded-lg transition-all text-[11px] font-bold uppercase tracking-widest shadow-lg`}
              >
                <Star className={`w-3.5 h-3.5 ${isWatched ? 'fill-orange-400' : ''}`} /> {isWatched ? 'Watching' : 'Watch'}
              </button>
              <button 
                onClick={handleShare}
                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-white/5 hover:bg-white/20 border border-white/10 rounded-lg transition-all text-[11px] font-bold uppercase tracking-widest shadow-lg"
              >
                <Share className="w-3.5 h-3.5" /> {shareText}
              </button>
            </div>
             <div className="flex bg-white/5 p-1 rounded-lg border border-white/10 w-full md:w-auto mt-2">
              {(['1D', '1W', '1M', '1Y', 'ALL'] as const).map(tf => (
                <button
                  key={tf}
                  onClick={() => setTimeframe(tf)}
                  className={`flex-1 md:flex-none px-4 py-1.5 text-[10px] uppercase tracking-widest font-black rounded-md transition-colors ${
                    timeframe === tf ? 'bg-white/10 text-white shadow-lg border border-white/5' : 'text-white/50 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {tf}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Technical Data Bar */}
        {!loading && data.length > 0 && (
           <div className="grid grid-cols-2 shadow-inner border-b border-white/5">
             <div className="flex items-center justify-between p-3 px-6 border-r border-white/5 bg-white/5">
               <span className="text-[9px] uppercase font-bold text-white/40 tracking-widest">Period High</span>
               <span className="font-mono text-xs font-bold text-[#00FF88]">${highPrice.toLocaleString(undefined, {minimumFractionDigits:2})}</span>
             </div>
             <div className="flex items-center justify-between p-3 px-6 bg-white/5">
               <span className="text-[9px] uppercase font-bold text-white/40 tracking-widest">Period Low</span>
               <span className="font-mono text-xs font-bold text-[#FF4D4D]">${lowPrice.toLocaleString(undefined, {minimumFractionDigits:2})}</span>
             </div>
           </div>
        )}

        {/* Technical Indicator Toggles */}
        <div className="flex flex-wrap items-center gap-3 px-6 py-3 border-b border-white/5 bg-white/[0.02]">
          <SlidersHorizontal className="w-4 h-4 text-white/50" />
          <span className="text-[10px] uppercase font-bold text-white/50 tracking-widest mr-2">Indicators:</span>
          
          <button 
            onClick={() => setShowSMA(!showSMA)}
            className={`px-3 py-1 text-[10px] font-bold rounded border transition-colors ${showSMA ? 'bg-purple-500/20 text-purple-400 border-purple-500/50' : 'bg-transparent text-white/50 border-white/10 hover:bg-white/5'}`}
          >
            SMA (20)
          </button>
          
          <button 
            onClick={() => setShowEMA(!showEMA)}
            className={`px-3 py-1 text-[10px] font-bold rounded border transition-colors ${showEMA ? 'bg-blue-500/20 text-blue-400 border-blue-500/50' : 'bg-transparent text-white/50 border-white/10 hover:bg-white/5'}`}
          >
            EMA (50)
          </button>

          <button 
            onClick={() => setShowBB(!showBB)}
            className={`px-3 py-1 text-[10px] font-bold rounded border transition-colors ${showBB ? 'bg-teal-500/20 text-teal-400 border-teal-500/50' : 'bg-transparent text-white/50 border-white/10 hover:bg-white/5'}`}
          >
            Bollinger Bands (20, 2)
          </button>
        </div>

        {/* Chart Area */}
        <div className="h-[380px] w-full relative bg-[#0B0E11] pt-4 pr-2">
          {loading ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/50 backdrop-blur-sm z-10">
              <div className="w-10 h-10 border-2 border-orange-500 border-r-transparent border-t-transparent rounded-full animate-spin" />
              <span className="mt-4 text-[10px] uppercase tracking-widest opacity-50 font-mono animate-pulse">Establishing Secure Connection...</span>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
              <ComposedChart data={data}>
                <defs>
                  <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={isPositive ? '#00FF88' : '#FF4D4D'} stopOpacity={0.3}/>
                    <stop offset="100%" stopColor={isPositive ? '#00FF88' : '#FF4D4D'} stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis 
                  dataKey="time" 
                  axisLine={{ stroke: 'rgba(255,255,255,0.05)' }} 
                  tickLine={false} 
                  tick={{ fontSize: 9, fill: 'rgba(255,255,255,0.4)', fontFamily: 'JetBrains Mono', fontWeight: 600 }}
                  minTickGap={50}
                  dy={15}
                />
                <YAxis 
                  yAxisId="price"
                  domain={['auto', 'auto']}
                  axisLine={false} 
                  tickLine={false}
                  tick={{ fontSize: 9, fill: 'rgba(255,255,255,0.5)', fontFamily: 'JetBrains Mono', fontWeight: 600 }}
                  tickFormatter={(val) => `$${val.toLocaleString()}`}
                  width={70}
                  orientation="right"
                  dx={10}
                />
                <YAxis 
                  yAxisId="volume"
                  domain={[0, 'auto']}
                  hide
                />
                <Tooltip
                  cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1, strokeDasharray: '3 3' }}
                  contentStyle={{ backgroundColor: 'rgba(11, 14, 17, 0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '4px', boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }}
                  itemStyle={{ color: '#fff', fontFamily: 'JetBrains Mono', fontSize: '12px', fontWeight: 'bold' }}
                  labelStyle={{ color: 'rgba(255,255,255,0.5)', marginBottom: '6px', fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 'bold' }}
                  formatter={(value: number, name: string) => {
                     let formattedName = name;
                     if (name === 'price') formattedName = 'Price';
                     if (name === 'volume') formattedName = 'Vol';
                     if (name === 'sma20') formattedName = 'SMA 20';
                     if (name === 'ema50') formattedName = 'EMA 50';
                     if (name === 'bbUpper') formattedName = 'BB Upper';
                     if (name === 'bbLower') formattedName = 'BB Lower';
                     
                     const formattedValue = (name === 'volume') 
                        ? value.toLocaleString(undefined, { maximumFractionDigits: 0 })
                        : `$${value.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
                        
                     return [formattedValue, formattedName];
                  }}
                />
                <Bar 
                  yAxisId="volume" 
                  dataKey="volume" 
                  fill={isPositive ? '#00FF88' : '#FF4D4D'} 
                  opacity={0.15} 
                  barSize={4}
                  radius={[2,2,0,0]}
                />
                <Area 
                  yAxisId="price"
                  type="monotone" 
                  dataKey="price" 
                  stroke={isPositive ? '#00FF88' : '#FF4D4D'} 
                  strokeWidth={2.5}
                  fillOpacity={1} 
                  fill="url(#colorPrice)" 
                  activeDot={{ r: 5, fill: '#FFFFFF', stroke: isPositive ? '#00FF88' : '#FF4D4D', strokeWidth: 2.5 }}
                />
                {showBB && (
                   <Area
                     yAxisId="price"
                     type="monotone"
                     dataKey="bbUpper"
                     stroke="#14b8a6"
                     strokeWidth={1}
                     strokeDasharray="4 4"
                     fill="#14b8a6"
                     fillOpacity={0.05}
                     activeDot={false}
                   />
                )}
                {showBB && (
                   <Area
                     yAxisId="price"
                     type="monotone"
                     dataKey="bbLower"
                     stroke="#14b8a6"
                     strokeWidth={1}
                     strokeDasharray="4 4"
                     fill="transparent"
                     activeDot={false}
                   />
                )}
                {showSMA && (
                   <Line
                     yAxisId="price"
                     type="monotone"
                     dataKey="sma20"
                     stroke="#a855f7"
                     strokeWidth={2}
                     dot={false}
                     activeDot={false}
                   />
                )}
                {showEMA && (
                   <Line
                     yAxisId="price"
                     type="monotone"
                     dataKey="ema50"
                     stroke="#3b82f6"
                     strokeWidth={2}
                     dot={false}
                     activeDot={false}
                   />
                )}
              </ComposedChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Converter / Quick Execution Section */}
        <div className="border-t border-white/5 bg-gradient-to-r from-white/5 to-transparent p-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
             <div className="flex items-center gap-3 w-full md:w-auto">
               <div className="w-10 h-10 rounded shrink-0 bg-white/5 border border-white/10 flex items-center justify-center">
                 <ArrowRightLeft className="w-5 h-5 text-white/50" />
               </div>
               <div>
                 <h3 className="text-[12px] uppercase font-black tracking-widest text-white">Execution Calculator</h3>
                 <span className="text-[10px] text-white/50 uppercase tracking-widest font-bold">Real-time Conversion</span>
               </div>
             </div>

             <div className="flex items-center gap-2 w-full md:w-auto">
               <div className="flex items-center bg-[#0B0E11] border border-white/10 rounded-lg overflow-hidden h-14 flex-1 md:w-56 transition-colors focus-within:border-white/20 focus-within:ring-1 focus-within:ring-slate-200">
                 <span className="text-[10px] font-black uppercase tracking-widest text-white/50 px-4 bg-white/5 h-full flex items-center border-r border-white/5">BTC</span>
                 <input 
                    type="number" 
                    value={btcAmount}
                    onChange={(e) => setBtcAmount(e.target.value)}
                    className="w-full bg-transparent px-4 font-mono text-lg text-white focus:outline-none"
                  />
               </div>
               <span className="text-white/40 font-bold mx-2">=</span>
               <div className="flex items-center bg-[#0B0E11] border border-white/10 rounded-lg overflow-hidden h-14 flex-1 md:w-56">
                 <span className="text-[10px] font-black uppercase tracking-widest text-[#00FF88] px-4 bg-white/5 h-full flex items-center border-r border-white/5">USD</span>
                 <div className="w-full px-4 font-mono text-lg text-white/60 overflow-hidden text-ellipsis whitespace-nowrap">
                   ${usdValue}
                 </div>
               </div>
             </div>
          </div>
        </div>

      </div>  {/* Grid Stats */}
        {/* Live Coin Tracker Replace */}
        <div className="mt-8 border-t border-white/10 pt-6">
          <h3 className="text-[10px] uppercase font-black tracking-widest opacity-80 mb-4 flex items-center gap-2">
            <Activity className="w-3.5 h-3.5 opacity-50" /> Live Market Pulse
          </h3>
          <LiveCoinTracker />
        </div>

        {/* Official Links */}
        <div className="mt-8 border-t border-white/10 pt-6">
          <h3 className="text-[10px] uppercase font-black tracking-widest opacity-80 mb-4 flex items-center gap-2">
            <Globe className="w-3.5 h-3.5 opacity-50" /> Official Links
          </h3>
          <div className="flex flex-wrap gap-3">
            <LinkPill icon={Globe} label="Website" href="https://bitcoin.org" />
            <LinkPill icon={FileText} label="Whitepaper" href="https://bitcoin.org/bitcoin.pdf" />
            <LinkPill icon={Github} label="Source Code" href="https://github.com/bitcoin/bitcoin" />
            <LinkPill icon={Search} label="Explorers" href="https://mempool.space" />
            <LinkPill icon={Shield} label="CertiK Rating: 4.9" href="https://skynet.certik.com" />
          </div>
        </div>

    </section>
  );
}