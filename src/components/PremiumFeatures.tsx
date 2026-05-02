import { useState, useEffect } from 'react';
import { Bot, BellRing, ChevronRight, Lock, Zap, ArrowRight, ShieldAlert, Activity, TrendingUp, TrendingDown, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getCryptoLogo } from '../lib/logos';

interface AlertData {
  id: string;
  coin: string;
  symbol: string;
  type: 'pump' | 'dump';
  message: string;
  price: string;
}

export function PremiumFeatures() {
  const [alertsEnabled, setAlertsEnabled] = useState(false);
  const [activeAlerts, setActiveAlerts] = useState<AlertData[]>([]);

  useEffect(() => {
    if (!alertsEnabled) return;

    const coins = [
      { name: 'Bitcoin', symbol: 'BTC', price: '$76,420.50' },
      { name: 'Ethereum', symbol: 'ETH', price: '$3,845.20' },
      { name: 'Solana', symbol: 'SOL', price: '$145.80' },
      { name: 'Avalanche', symbol: 'AVAX', price: '$35.20' }
    ];

    const generateAlert = () => {
      const coin = coins[Math.floor(Math.random() * coins.length)];
      const isPump = Math.random() > 0.5;
      const amount = (Math.random() * 5 + 2).toFixed(2);
      
      const newAlert: AlertData = {
        id: Math.random().toString(36).substr(2, 9),
        coin: coin.name,
        symbol: coin.symbol,
        type: isPump ? 'pump' : 'dump',
        message: `${coin.symbol} just ${isPump ? 'jumped' : 'dropped'} ${amount}% in the last 5 minutes. High volume detected.`,
        price: coin.price
      };

      // Native browser notification (if permitted)
      if ("Notification" in window && Notification.permission === "granted") {
        new Notification(`Market Alert: ${coin.symbol} ${isPump ? 'Surge' : 'Drop'}`, {
          body: newAlert.message,
          icon: getCryptoLogo(coin.symbol)
        });
      }

      setActiveAlerts(prev => [newAlert, ...prev].slice(0, 3)); // Keep only latest 3
      
      // Auto dismiss after 5s
      setTimeout(() => {
        setActiveAlerts(current => current.filter(a => a.id !== newAlert.id));
      }, 5000);
    };

    // Attempt to request permission if not granted
    if ("Notification" in window && Notification.permission !== "granted" && Notification.permission !== "denied") {
      Notification.requestPermission();
    }

    const interval = setInterval(generateAlert, 5000 + Math.random() * 10000); // Random interval between 5s and 15s
    return () => clearInterval(interval);
  }, [alertsEnabled]);

  const dismissAlert = (id: string) => {
    setActiveAlerts(prev => prev.filter(a => a.id !== id));
  };

  return (
    <div className="flex flex-col gap-6 w-full relative">
      {/* In-app Notification Toasts */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-3 pointer-events-none">
        <AnimatePresence>
          {activeAlerts.map(alert => (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              className="bg-[#1E222D] border border-[#2A2E39] shadow-2xl rounded-xl p-4 w-80 flex items-start gap-3 pointer-events-auto relative overflow-hidden"
            >
              <div className={`absolute top-0 left-0 w-1 h-full ${alert.type === 'pump' ? 'bg-green-500' : 'bg-red-500'}`}></div>
              
              <div className="w-10 h-10 rounded-full bg-[#1E222D] flex items-center justify-center shrink-0 p-1">
                <img src={getCryptoLogo(alert.symbol) || `https://ui-avatars.com/api/?name=${alert.symbol}&background=random`} alt={alert.symbol} className="w-full h-full object-contain" />
              </div>
              
              <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-bold text-white text-sm">{alert.coin} Alert</h4>
                  <span className={`text-[10px] font-bold ${alert.type === 'pump' ? 'text-green-400' : 'text-red-400'} flex items-center gap-1`}>
                    {alert.type === 'pump' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  </span>
                </div>
                <p className="text-xs text-[#787B86] leading-relaxed mb-2">{alert.message}</p>
                <div className="text-[10px] font-mono text-white/40">Current Price: <span className="text-[#787B86]">{alert.price}</span></div>
              </div>

              <button onClick={() => dismissAlert(alert.id)} className="absolute top-2 right-2 text-white/40 hover:text-white transition-colors">
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="flex items-center gap-3 mb-2">
        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-500/20 to-red-500/20 text-orange-400 flex items-center justify-center border border-orange-500/50">
          <Zap className="w-4 h-4" />
        </div>
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            Premium Features
          </h2>
          <p className="text-[11px] text-[#787B86] uppercase tracking-widest font-mono">
            Exclusive Tools for Advanced Traders
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Global Market Alert System */}
        <div id="section-global-alerts" className="p-6 bg-gradient-to-br from-[#0B0E11] to-purple-900/10 border border-purple-500/20 rounded-2xl relative overflow-hidden group hover:border-purple-500/50 transition-all duration-500 flex flex-col">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 blur-3xl rounded-full pointer-events-none group-hover:bg-purple-500/20 transition-all"></div>
          
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-purple-500/20 border border-purple-500/50 flex items-center justify-center relative">
                <Activity className={`w-6 h-6 text-purple-400 ${alertsEnabled ? 'animate-pulse' : ''}`} />
              </div>
              {alertsEnabled && (
                <div className="flex items-center gap-1.5 px-3 py-1 bg-green-500/10 border border-green-500/30 rounded-full">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                  <span className="text-[10px] uppercase font-bold text-green-400 tracking-wider">Live Tracker Active</span>
                </div>
              )}
            </div>
            <div className="px-3 py-1 rounded-full text-[10px] uppercase font-bold bg-purple-500/10 text-purple-400 border border-purple-500/30 tracking-wider">
              Alerts Network
            </div>
          </div>
          
          <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">Global Market Alert System</h3>
          <p className="text-sm text-[#787B86] mb-6 min-h-[60px] leading-relaxed">
            Analyzes real-time data and news from all major crypto exchanges globally to send instant notifications on significant market movements or anomalies.
          </p>
          
          <div className="mt-auto pt-4 flex gap-3">
            <button 
              onClick={() => {
                if (!alertsEnabled && "Notification" in window && Notification.permission !== "granted" && Notification.permission !== "denied") {
                  Notification.requestPermission();
                }
                setAlertsEnabled(!alertsEnabled);
              }}
              className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 group/btn ${
                alertsEnabled 
                  ? 'bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 hover:border-red-500/60' 
                  : 'bg-purple-500 text-white hover:shadow-[0_0_20px_rgba(168,85,247,0.4)]'
              }`}
            >
              {alertsEnabled ? 'Stop Alerts Tracker' : 'Activate Live Tracker'} 
              {!alertsEnabled && <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
