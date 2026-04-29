/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { AnimatePresence } from "motion/react";
import { Navigation } from "./components/Navigation";
import { MarketMarquee } from "./components/MarketMarquee";
import { AssetChart } from "./components/AssetChart";
import { AssetMarkets } from "./components/AssetMarkets";
import { AssetYield } from "./components/AssetYield";
import { MarketCycles } from "./components/MarketCycles";
import { SimilarCoins } from "./components/SimilarCoins";
import { TreasuryHoldings } from "./components/TreasuryHoldings";
import { AssetDensity } from "./components/AssetDensity";
import { GlobalPrices } from "./components/GlobalPrices";
import { AboutAsset } from "./components/AboutAsset";
import { CommunitySentiment } from "./components/CommunitySentiment";
import { MarketSentimentAnalysis } from "./components/MarketSentimentAnalysis";
import { SupportAndCommunity } from "./components/SupportAndCommunity";
import { NewsFeed } from "./components/NewsFeed";
import { GlobalCryptoNews } from "./components/GlobalCryptoNews";
import { MarketInsights } from "./components/MarketInsights";
import { Watchlist } from "./components/Watchlist";
import { PortfolioTracker } from "./components/PortfolioTracker";
import { AiAnalystChat } from "./components/AiAnalystChat";
import { UserReports } from "./components/UserReports";
import { MarketTracker } from "./components/MarketTracker";
import { FAQ } from "./components/FAQ";
import { AIHouse } from "./components/AIHouse";

import { PremiumFeatures } from "./components/PremiumFeatures";
import { TradingCoachAI } from "./components/TradingCoachAI";
import { CryptoMasterclass } from "./components/CryptoMasterclass";
import { AIPortfolioDoctor } from "./components/AIPortfolioDoctor";

export default function App() {
  const [currentBtcPrice, setCurrentBtcPrice] = useState<number>(76683.50);
  const [showAIHouse, setShowAIHouse] = useState(false);
  const [showTradingCoach, setShowTradingCoach] = useState(false);

  useEffect(() => {
    // Shared live price fetch to populate multiple descendants
    const fetchBtcPrice = async () => {
      try {
        const res = await fetch('https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT');
        const data = await res.json();
        if (data && data.price) {
          setCurrentBtcPrice(parseFloat(data.price));
        }
      } catch (err) {
        // Silently use default if failed
      }
    };
    fetchBtcPrice();
    const int = setInterval(fetchBtcPrice, 15000);
    return () => clearInterval(int);
  }, []);

  return (
    <div className="min-h-screen bg-[#0B0E11] text-white selection:bg-orange-500/30 flex flex-col gap-6">
      <Navigation 
        onOpenAIHouse={() => setShowAIHouse(true)} 
        onOpenTradingCoach={() => setShowTradingCoach(true)}
      />
      <MarketMarquee />
      
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8 pb-8 mt-4">
        
        {/* Main Left Column */}
        <div className="lg:col-span-8 flex flex-col gap-8">
          {/* Top Asset Chart */}
          <div id="section-overview">
            <AssetChart />
          </div>

          {/* New Sections based on user screenshots */}
          <div id="section-markets"><AssetMarkets /></div>
          <div id="section-yield"><AssetYield /></div>
          
          <div id="section-market-cycles"><MarketCycles /></div>
          <SimilarCoins />
          <div id="section-treasuries"><TreasuryHoldings /></div>
          <AssetDensity />
          
          <GlobalPrices currentBtcPrice={currentBtcPrice} />
          <AboutAsset />
          
          <div id="section-market-sentiment" className="mt-8 pt-8 border-t border-white/10">
            <MarketSentimentAnalysis />
          </div>

          <div id="section-community"><CommunitySentiment /></div>
          
          {/* Pre-existing Sections */}
          <div className="mt-8 pt-8 border-t border-white/10">
            <MarketTracker />
          </div>
          <div id="section-insights" className="mt-8 pt-8 border-t border-white/10">
            <MarketInsights />
          </div>
          <div id="section-news" className="mt-8 pt-8 border-t border-white/10">
            <NewsFeed />
          </div>
          <div className="mt-8 pt-8 border-t border-white/10">
            <GlobalCryptoNews />
          </div>

          <div id="section-support" className="mt-8 pt-8 border-t border-white/10">
            <SupportAndCommunity />
          </div>

          <div id="section-premium" className="mt-8 pt-8 border-t border-white/10">
            <PremiumFeatures onOpenLiveCoach={() => setShowTradingCoach(true)} />
          </div>

          <div id="section-masterclass" className="mt-8 pt-8 border-t border-white/10">
            <CryptoMasterclass />
          </div>

          <div id="section-portfolio-doctor" className="mt-8 pt-8 border-t border-white/10">
            <AIPortfolioDoctor />
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="lg:col-span-4 flex flex-col gap-6 lg:pl-8 lg:ticker-border">
          <PortfolioTracker />
          <Watchlist />
          <AiAnalystChat currentBtcPrice={currentBtcPrice} />
          <div id="section-notifications" className="mt-auto">
            <UserReports />
          </div>
        </div>

        {/* FAQ - Keep as is per user instructions */}
        <div className="lg:col-span-12 mt-8 pt-8 border-t border-white/10">
          <FAQ />
        </div>

      </main>
      
      {/* Enhanced Footer */}
      <footer className="w-full bg-[#050709] border-t border-white/10 pt-12 pb-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div className="flex flex-col gap-4">
              <h4 className="text-white font-bold text-sm tracking-wider uppercase">Products</h4>
              <ul className="flex flex-col gap-2 text-xs text-white/50">
                <li className="hover:text-white transition-colors cursor-pointer">Academy</li>
                <li className="hover:text-white transition-colors cursor-pointer">Advertise</li>
                <li className="hover:text-white transition-colors cursor-pointer">CMC Labs</li>
                <li className="hover:text-white transition-colors cursor-pointer">Top Stories</li>
                <li className="hover:text-white transition-colors cursor-pointer">Crypto API</li>
                <li className="hover:text-white transition-colors cursor-pointer">Real-World Assets</li>
              </ul>
            </div>
            <div className="flex flex-col gap-4">
              <h4 className="text-white font-bold text-sm tracking-wider uppercase">Company</h4>
              <ul className="flex flex-col gap-2 text-xs text-white/50">
                <li className="hover:text-white transition-colors cursor-pointer">About us</li>
                <li className="hover:text-white transition-colors cursor-pointer">Terms of use</li>
                <li className="hover:text-white transition-colors cursor-pointer">Privacy Policy</li>
                <li className="hover:text-white transition-colors cursor-pointer">Community Rules</li>
                <li className="hover:text-white transition-colors cursor-pointer">Disclaimer</li>
                <li className="text-orange-500 font-bold cursor-pointer">Careers — We're hiring!</li>
              </ul>
            </div>
            <div className="flex flex-col gap-4">
              <h4 className="text-white font-bold text-sm tracking-wider uppercase">Support</h4>
              <ul className="flex flex-col gap-2 text-xs text-white/50">
                <li className="hover:text-white transition-colors cursor-pointer">Get Listed</li>
                <li className="hover:text-white transition-colors cursor-pointer">Request Form</li>
                <li className="hover:text-white transition-colors cursor-pointer">Contact Support</li>
                <li className="hover:text-white transition-colors cursor-pointer">FAQ</li>
                <li className="hover:text-white transition-colors cursor-pointer">Glossary</li>
              </ul>
            </div>
            <div className="flex flex-col gap-4">
              <h4 className="text-white font-bold text-sm tracking-wider uppercase">Socials</h4>
              <ul className="flex flex-col gap-2 text-xs text-white/50">
                <li className="hover:text-white transition-colors cursor-pointer">X (Twitter)</li>
                <li className="hover:text-white transition-colors cursor-pointer">Community</li>
                <li className="hover:text-white transition-colors cursor-pointer">Telegram</li>
                <li className="hover:text-white transition-colors cursor-pointer">Instagram</li>
                <li className="hover:text-white transition-colors cursor-pointer">Reddit</li>
              </ul>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-center text-[10px] font-mono opacity-30 border-t border-white/10 pt-6 gap-4">
            <span>© 2026 Finova Financial Services Group. All rights reserved.</span>
            <div className="flex gap-6">
              <span>SYSTEM STATUS: OPTIMAL</span>
              <span>NETWORK: MAINNET-SECURE</span>
              <span>LATENCY: 14MS</span>
            </div>
          </div>
        </div>
      </footer>

      <AnimatePresence>
        {showAIHouse && <AIHouse onClose={() => setShowAIHouse(false)} />}
        {showTradingCoach && <TradingCoachAI onClose={() => setShowTradingCoach(false)} />}
      </AnimatePresence>
    </div>
  );
}
