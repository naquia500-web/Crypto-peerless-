import { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Star, Share, ChevronDown, Activity, CornerUpRight, Briefcase, FileText, Globe, Search, Shield, ChevronRight, Settings, Maximize2, Info } from 'lucide-react';
import { LiveCoinTracker } from './LiveCoinTracker';

interface ChartData {
  time: string;
  price: number;
  volume: number;
}

export function AssetChart() {
  const [data, setData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState<'24h' | '1W' | '1M' | '1Y' | 'All'>('24h');
  const [chartMode, setChartMode] = useState<'Price' | 'MarketCap' | 'TradingView'>('Price');
  const [btcAmount, setBtcAmount] = useState('1');

  useEffect(() => {
    let intervalStr = '1h';
    let limit = 24;
    
    if (timeframe === '24h') { intervalStr = '1h'; limit = 24; }
    if (timeframe === '1W') { intervalStr = '4h'; limit = 42; }
    if (timeframe === '1M') { intervalStr = '1d'; limit = 30; }
    if (timeframe === '1Y') { intervalStr = '1w'; limit = 52; }
    if (timeframe === 'All') { intervalStr = '1M'; limit = 120; }

    let ws: WebSocket | null = null;
    let isActive = true;

    setLoading(true);
    fetch(`https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=${intervalStr}&limit=${limit}`)
      .then(res => res.json())
      .then((json: any[][]) => {
        const formattedData = json.map(candle => {
          const date = new Date(candle[0]);
          let timeLabel = '';
          if (timeframe === '24h') timeLabel = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          else if (timeframe === '1W' || timeframe === '1M') timeLabel = date.toLocaleDateString([], { month: 'short', day: 'numeric' });
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
  }, [timeframe]);

  const currentPrice = data.length > 0 ? data[data.length - 1].price : 75679.99;
  const firstPrice = data.length > 0 ? data[0].price : 75780;
  const isPositive = currentPrice > firstPrice;
  const percentage = (((currentPrice - firstPrice) / firstPrice) * 100).toFixed(2);
  
  const usdValue = (parseFloat(btcAmount || '0') * currentPrice).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div className="bg-white text-slate-900 rounded-xl overflow-hidden font-sans shadow-sm w-full">
      <div className="p-6 md:p-8">
        {/* Header Title Section */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <img 
                src="https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/svg/color/btc.svg" 
                alt="Bitcoin" 
                className="w-8 h-8 rounded-full"
              />
              <h1 className="text-2xl font-bold text-slate-900">Bitcoin</h1>
              <span className="text-slate-500 font-semibold text-sm">BTC</span>
              <span className="bg-slate-100 text-slate-600 text-xs font-bold px-2 py-0.5 rounded ml-1">#1</span>
            </div>
            
            <div className="flex items-center gap-3 mt-1">
              <span className="text-4xl font-bold tracking-tight text-slate-900">
                ${currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              <span className={`flex items-center text-sm font-bold ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                {isPositive ? '▲' : '▼'} {Math.abs(parseFloat(percentage))}% (24h)
              </span>
            </div>

            <div className="mt-2 text-sm">
               <span className="bg-purple-100 text-purple-700 px-3 py-1.5 rounded-full font-semibold flex items-center w-max gap-1 cursor-pointer hover:bg-purple-200 transition-colors">
                 <Activity className="w-3.5 h-3.5" /> Why is BTC's price up today? <ChevronRight className="w-3.5 h-3.5" />
               </span>
            </div>
          </div>
          
          <div className="flex items-center gap-2 mt-2 md:mt-0">
             <button className="flex items-center gap-1.5 text-slate-600 bg-slate-50 border border-slate-200 hover:bg-slate-100 px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors">
               <Star className="w-4 h-4" /> 6M
             </button>
             <button className="flex items-center gap-1.5 text-slate-600 bg-slate-50 border border-slate-200 hover:bg-slate-100 p-1.5 rounded-lg text-sm transition-colors">
               <Share className="w-4 h-4" />
             </button>
          </div>
        </div>

        {/* Chart Header Toggles */}
        <div className="mt-8">
          <h2 className="text-lg font-bold text-slate-800 mb-4">Bitcoin to USD Chart</h2>
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
            <div className="flex items-center bg-slate-100 rounded-lg p-0.5 w-max">
              <button 
                onClick={() => setChartMode('Price')}
                className={`px-3 py-1.5 text-[13px] font-bold rounded-[5px] transition-colors ${chartMode === 'Price' ? 'bg-white shadow text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
              >Price</button>
              <button 
                onClick={() => setChartMode('MarketCap')}
                className={`px-3 py-1.5 text-[13px] font-bold rounded-[5px] transition-colors ${chartMode === 'MarketCap' ? 'bg-white shadow text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
              >Mkt Cap</button>
              <button 
                onClick={() => setChartMode('TradingView')}
                className={`flex items-center gap-1 px-3 py-1.5 text-[13px] font-bold rounded-[5px] transition-colors ${chartMode === 'TradingView' ? 'bg-white shadow text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
              >
                <Activity className="w-3.5 h-3.5" /> TradingView
              </button>
            </div>
            
            <div className="flex items-center gap-2 flex-wrap">
              <button className="flex items-center gap-1 px-3 py-1.5 text-[13px] font-bold text-slate-600 hover:bg-slate-100 rounded-lg">
                Compare <ChevronDown className="w-3.5 h-3.5" />
              </button>
              <div className="w-px h-4 bg-slate-200 mx-1"></div>
              
              {(['24h', '1W', '1M', '1Y', 'All'] as const).map(tf => (
                <button
                  key={tf}
                  onClick={() => setTimeframe(tf)}
                  className={`px-2 py-1 text-[13px] font-bold rounded-lg transition-colors ${
                    timeframe === tf ? 'bg-slate-100 text-slate-900' : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  {tf}
                </button>
              ))}
              <div className="w-px h-4 bg-slate-200 mx-1"></div>
              <button className="px-2 py-1 text-[13px] font-bold text-slate-500 hover:text-slate-900 rounded-md flex items-center gap-1">Log</button>
              <button className="p-1.5 text-slate-500 hover:text-slate-900 rounded-md"><Settings className="w-4 h-4" /></button>
              <button className="p-1.5 text-slate-500 hover:text-slate-900 rounded-md"><Maximize2 className="w-4 h-4" /></button>
            </div>
          </div>
        </div>

        {/* Chart Area */}
        <div className="h-[400px] w-full relative pt-2">
          {chartMode === 'TradingView' ? (
             <iframe 
               key={`tv-${timeframe}`}
               src={`https://s.tradingview.com/widgetembed/?frameElementId=tradingview_widget&symbol=BINANCE%3ABTCUSDT&interval=${timeframe === '24h' ? '15' : timeframe === '1W' ? '60' : timeframe === '1M' ? 'D' : 'W'}&hidesidetoolbar=1&symboledit=1&saveimage=1&toolbarbg=f1f3f6&studies=%5B%5D&theme=light&style=1&timezone=Etc%2FUTC&studies_overrides=%7B%7D&overrides=%7B%7D&enabled_features=%5B%5D&disabled_features=%5B%5D&locale=en`}
               className="w-full h-full border-0"
               title="TradingView Chart"
             />
          ) : loading ? (
             <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 z-10">
              <div className="w-8 h-8 border-2 border-blue-600 border-r-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={isPositive ? '#16c784' : '#ea3943'} stopOpacity={0.2}/>
                    <stop offset="95%" stopColor={isPositive ? '#16c784' : '#ea3943'} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis 
                  dataKey="time" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 11, fill: '#64748B', fontWeight: 500 }}
                  minTickGap={30}
                  dy={10}
                />
                <YAxis 
                  domain={['auto', 'auto']}
                  axisLine={false} 
                  tickLine={false}
                  tick={{ fontSize: 11, fill: '#64748B', fontWeight: 500 }}
                  tickFormatter={(val) => {
                     const formattedVal = chartMode === 'MarketCap' ? val * 19780000 /* proxy supply */ : val;
                     if (formattedVal >= 1e12) return (formattedVal / 1e12).toFixed(2) + 'T';
                     if (formattedVal >= 1e9) return (formattedVal / 1e9).toFixed(2) + 'B';
                     if (formattedVal >= 1e6) return (formattedVal / 1e6).toFixed(2) + 'M';
                     if (formattedVal >= 1000) return (formattedVal / 1000).toFixed(2) + 'K';
                     return formattedVal.toString();
                  }}
                  width={60}
                  orientation="right"
                  dx={10}
                />
                <Tooltip
                  cursor={{ stroke: '#CBD5E1', strokeWidth: 1, strokeDasharray: '3 3' }}
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #E2E8F0', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                  itemStyle={{ color: '#0F172A', fontSize: '14px', fontWeight: 'bold' }}
                  labelStyle={{ color: '#64748B', marginBottom: '4px', fontSize: '12px' }}
                  formatter={(value: number) => {
                     let displayValue = chartMode === 'MarketCap' ? value * 19780000 : value;
                     let formatted = '';
                     if (chartMode === 'MarketCap' && displayValue >= 1e12) formatted = `$${(displayValue/1e12).toFixed(2)}T`;
                     else if (chartMode === 'MarketCap' && displayValue >= 1e9) formatted = `$${(displayValue/1e9).toFixed(2)}B`;
                     else formatted = `$${displayValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
                     return [formatted, chartMode === 'MarketCap' ? 'Market Cap' : 'Price'];
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="price" 
                  stroke={isPositive ? '#16c784' : '#ea3943'} 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorPrice)" 
                  activeDot={{ r: 4, fill: '#fff', stroke: isPositive ? '#16c784' : '#ea3943', strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Ad Banner Placeholder */}
        <div className="w-full mt-6 flex justify-center mb-10">
          <div className="max-w-2xl w-full bg-[#1e3a8a] rounded-lg overflow-hidden flex cursor-pointer hover:opacity-95 transition-opacity relative group shadow-md">
            <div className="flex-1 p-3 flex items-center justify-center gap-4 text-slate-900 text-sm font-bold">
               <div className="w-8 h-8 bg-black rounded-md flex items-center justify-center">E</div>
               <span>$ELONI PRESALE <span className="text-yellow-400">LIVE</span> NOW</span>
            </div>
            <div className="bg-white text-blue-900 px-6 font-bold flex items-center justify-center text-xs w-32 border-l border-slate-200 uppercase">
              Buy $ELONI
            </div>
            <span className="absolute -bottom-5 right-0 text-[10px] text-slate-400">Ad</span>
          </div>
        </div>

        {/* Converter Section */}
        <div className="mb-10">
          <h3 className="text-sm font-bold text-slate-800 mb-4">BTC to USD converter</h3>
          <div className="flex flex-col lg:flex-row items-center gap-1">
             <div className="flex items-center justify-between border border-slate-200 rounded-lg p-3 w-full bg-white hover:border-slate-300 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all">
                <div className="flex items-center gap-2">
                   <img src="https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/svg/color/btc.svg" alt="" className="w-5 h-5" />
                   <span className="text-slate-500 font-bold text-sm">BTC</span>
                </div>
                <input 
                  type="number" 
                  value={btcAmount}
                  onChange={(e) => setBtcAmount(e.target.value)}
                  className="bg-transparent text-right font-bold text-slate-900 focus:outline-none w-full ml-4"
                />
             </div>
             <div className="flex items-center justify-between border border-slate-200 rounded-lg p-3 w-full bg-white hover:border-slate-300 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all">
                <div className="flex items-center gap-2">
                   <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-slate-900 text-[10px] font-bold">$</div>
                   <span className="text-slate-500 font-bold text-sm">USD</span>
                </div>
                <div className="text-right font-bold text-slate-900 w-full ml-4 overflow-hidden text-ellipsis">
                  {usdValue}
                </div>
             </div>
          </div>
        </div>

        {/* Bitcoin Statistics Grid */}
        <div className="mb-10">
           <h3 className="text-sm font-bold text-slate-800 mb-4">Bitcoin statistics</h3>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              
              <div className="flex flex-col border border-slate-200 rounded-lg p-4">
                 <div className="flex items-center gap-1 text-slate-500 text-[11px] font-bold uppercase">Market cap <Info className="w-3.5 h-3.5" /></div>
                 <div className="flex items-center gap-2 mt-1">
                   <span className="text-sm font-bold text-slate-900">$1.51T</span>
                   <span className="flex items-center text-xs font-bold text-red-500">▼ 0.1%</span>
                 </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col border border-slate-200 rounded-lg p-4">
                   <div className="flex items-center gap-1 text-slate-500 text-[11px] font-bold uppercase">Volume (24h) <Info className="w-3.5 h-3.5" /></div>
                   <div className="flex items-center gap-2 mt-1">
                     <span className="text-sm font-bold text-slate-900">$38.69B</span>
                     <span className="flex items-center text-xs font-bold text-green-500">▲ 2.18%</span>
                   </div>
                </div>
                <div className="flex flex-col border border-slate-200 rounded-lg p-4">
                   <div className="flex items-center gap-1 text-slate-500 text-[11px] font-bold uppercase">Vol/Mkt Cap (24h) <Info className="w-3.5 h-3.5" /></div>
                   <div className="flex items-center gap-2 mt-1">
                     <span className="text-sm font-bold text-slate-900">2.54%</span>
                   </div>
                </div>
              </div>

              <div className="flex flex-col border border-slate-200 rounded-lg p-4">
                 <div className="flex items-center gap-1 text-slate-500 text-[11px] font-bold uppercase">FDV <Info className="w-3.5 h-3.5" /></div>
                 <div className="flex items-center gap-2 mt-1">
                   <span className="text-sm font-bold text-slate-900">$1.58T</span>
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col border border-slate-200 rounded-lg p-4 justify-center">
                   <div className="flex justify-between items-center w-full">
                     <div className="flex items-center gap-1 text-slate-500 text-[11px] font-bold uppercase">Total supply <Info className="w-3.5 h-3.5" /></div>
                     <span className="text-sm font-bold text-slate-900">20.01M BTC</span>
                   </div>
                </div>
                <div className="flex flex-col border border-slate-200 rounded-lg p-4 justify-center">
                   <div className="flex justify-between items-center w-full">
                     <div className="flex items-center gap-1 text-slate-500 text-[11px] font-bold uppercase">Max. supply <Info className="w-3.5 h-3.5" /></div>
                     <span className="text-sm font-bold text-slate-900">21M BTC</span>
                   </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 md:col-span-2">
                <div className="flex flex-col border border-slate-200 rounded-lg p-4 justify-center">
                   <div className="flex justify-between items-center w-full">
                     <div className="flex items-center gap-1 text-slate-500 text-[11px] font-bold uppercase">Circulating supply <Info className="w-3.5 h-3.5" /></div>
                     <span className="text-sm font-bold text-slate-900">20.01M BTC</span>
                   </div>
                   <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2">
                     <div className="bg-slate-900 h-1.5 rounded-full" style={{width: '95%'}}></div>
                   </div>
                </div>
                <div className="flex flex-col border border-slate-200 rounded-lg p-4 justify-center">
                   <div className="flex justify-between items-center w-full">
                     <div className="flex items-center gap-1 text-slate-500 text-[11px] font-bold uppercase">Treasury Holdings <Info className="w-3.5 h-3.5" /></div>
                     <span className="text-sm font-bold text-slate-900">1.17M BTC</span>
                   </div>
                </div>
              </div>

           </div>
        </div>

        {/* Extra Lists - Profile Score, Links, etc */}
        <div className="mt-8 pt-4 border-t border-slate-200 flex flex-col gap-4 max-w-2xl text-[13px]">
           <div className="flex justify-between items-center py-2 border-b border-slate-100">
             <span className="text-slate-500 font-bold flex items-center gap-1">Profile score <Info className="w-3.5 h-3.5" /></span>
             <span className="text-green-500 font-bold">100%</span>
           </div>
           
           <div className="flex justify-between items-center py-2 border-b border-slate-100">
             <span className="text-slate-500 font-bold">Website</span>
             <div className="flex gap-2">
               <span className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer font-semibold transition-colors">
                 <Globe className="w-3.5 h-3.5" /> Website
               </span>
               <span className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer font-semibold transition-colors">
                 <FileText className="w-3.5 h-3.5" /> Whitepaper
               </span>
             </div>
           </div>

           <div className="flex justify-between items-center py-2 border-b border-slate-100">
             <span className="text-slate-500 font-bold">Rating (CertiK)</span>
             <span className="font-bold flex items-center gap-2">
               4.9 <span className="text-yellow-400">★★★★★</span>
             </span>
           </div>

           <div className="flex flex-col gap-2 py-2">
             <span className="text-slate-500 font-bold">Tags</span>
             <div className="flex gap-2 flex-wrap">
               <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-md text-xs font-bold">Mineable</span>
               <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-md text-xs font-bold">PoW</span>
               <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-md text-xs font-bold">SHA-256</span>
               <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-md text-xs font-bold">Store Of Value</span>
               <span className="text-slate-400 font-bold px-1 py-1 text-xs cursor-pointer hover:text-slate-600">Show all</span>
             </div>
           </div>

           <button className="w-full mt-2 bg-slate-50 text-slate-700 font-bold py-2 rounded-lg hover:bg-slate-100 transition-colors border border-slate-200">
               More information
           </button>
        </div>

      </div>
    </div>
  );
}
