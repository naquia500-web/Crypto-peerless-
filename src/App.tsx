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
import { UserReports } from "./components/UserReports";
import { MarketTracker } from "./components/MarketTracker";
import { FAQ } from "./components/FAQ";
import { MarketHubDraft } from "./components/MarketHubDraft";
import { LiveCoinTracker } from "./components/LiveCoinTracker";
import { UserVideoHero } from "./components/UserVideoHero";

import { PremiumFeatures } from "./components/PremiumFeatures";
import { CryptoMasterclass } from "./components/CryptoMasterclass";
import { AIPortfolioDoctor } from "./components/AIPortfolioDoctor";

// New specialized toolkit features
import { WhaleTracker } from "./components/WhaleTracker";
import { MarketEvents } from "./components/MarketEvents";
import { CryptoBeginnerHub } from "./components/CryptoBeginnerHub";
import { ProCryptoTools } from "./components/ProCryptoTools";

// Newly requested advanced features
import { FearAndGreedIndex } from "./components/FearAndGreedIndex";
import { AIScamDetection } from "./components/AIScamDetection";
import { AirdropCalendar } from "./components/AirdropCalendar";
import { SecurityDashboard } from "./components/SecurityDashboard";

export default function App() {
  const [currentBtcPrice, setCurrentBtcPrice] = useState<number>(76683.5);

  useEffect(() => {
    // Shared live price fetch to populate multiple descendants
    const fetchBtcPrice = async () => {
      try {
        const res = await fetch(
          "https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT",
        );
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
    <div className="min-h-screen bg-[#1E222D] text-white selection:bg-blue-500/30 flex flex-col gap-8 font-sans">
      <Navigation />
      <MarketMarquee />

      <main className="flex-1 w-full max-w-[1440px] mx-auto px-4 lg:px-8 xl:px-12 grid grid-cols-1 lg:grid-cols-12 gap-8 pb-12 mt-2">
        {/* Main Left Column */}
        <div className="lg:col-span-8 flex flex-col gap-8">
          {/* Top Asset Chart */}
          <div id="section-overview">
            <AssetChart />
          </div>

          {/* User Video with Shayari */}
          <UserVideoHero />

          <div id="section-global-market">
            <MarketHubDraft />
            <div className="mt-4">
              <LiveCoinTracker />
            </div>
          </div>

          {/* New Advanced Trading Tools Row */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 pt-8 border-t border-[#2A2E39]">
            <WhaleTracker />
            <ProCryptoTools />
          </div>

          {/* Events calendar & beginners row */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-8 pt-8 border-t border-[#2A2E39]">
            <CryptoBeginnerHub />
            <MarketEvents />
          </div>

          {/* Advanced Market Analytics & Trust Features */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-8 pt-8 border-t border-[#2A2E39]">
            <div className="xl:col-span-1">
              <FearAndGreedIndex />
            </div>
            <div className="xl:col-span-1">
              <AIScamDetection />
            </div>
            <div className="xl:col-span-1">
              <AirdropCalendar />
            </div>
          </div>

          {/* New Sections based on user screenshots */}
          <div id="section-markets">
            <AssetMarkets />
          </div>
          <div id="section-yield">
            <AssetYield />
          </div>

          <div id="section-market-cycles">
            <MarketCycles />
          </div>
          <SimilarCoins />
          <div id="section-treasuries">
            <TreasuryHoldings />
          </div>
          <AssetDensity />

          <GlobalPrices currentBtcPrice={currentBtcPrice} />
          <div id="section-about">
            <AboutAsset />
          </div>

          <div
            id="section-market-sentiment"
            className="mt-8 pt-8 border-t border-[#2A2E39]"
          >
            <MarketSentimentAnalysis />
          </div>

          <div id="section-community">
            <CommunitySentiment />
          </div>

          {/* Pre-existing Sections */}
          <div
            id="section-whale-tracker"
            className="mt-8 pt-8 border-t border-[#2A2E39]"
          >
            <MarketTracker />
          </div>
          <div
            id="section-insights"
            className="mt-8 pt-8 border-t border-[#2A2E39]"
          >
            <MarketInsights />
          </div>
          <div
            id="section-news"
            className="mt-8 pt-8 border-t border-[#2A2E39]"
          >
            <NewsFeed />
          </div>
          <div className="mt-8 pt-8 border-t border-[#2A2E39]">
            <GlobalCryptoNews />
          </div>

          <div
            id="section-support"
            className="mt-8 pt-8 border-t border-[#2A2E39]"
          >
            <SupportAndCommunity />
          </div>

          <div
            id="section-premium"
            className="mt-8 pt-8 border-t border-[#2A2E39]"
          >
            <PremiumFeatures />
          </div>

          <div
            id="section-masterclass"
            className="mt-8 pt-8 border-t border-[#2A2E39]"
          >
            <CryptoMasterclass />
          </div>

          <div
            id="section-portfolio-doctor"
            className="mt-8 pt-8 border-t border-[#2A2E39]"
          >
            <AIPortfolioDoctor />
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="lg:col-span-4 flex flex-col gap-6 lg:pl-8 lg:ticker-border">
          <PortfolioTracker />
          <SecurityDashboard />
          <div id="section-watchlist">
            <Watchlist />
          </div>
          <div id="section-notifications" className="mt-auto">
            <UserReports />
          </div>
        </div>

        {/* FAQ - Keep as is per user instructions */}
        <div className="lg:col-span-12 mt-8 pt-8 border-t border-[#2A2E39]">
          <FAQ />
        </div>
      </main>

      {/* Enhanced Footer */}
      <footer className="w-full bg-[#1E222D] border-t border-[#2A2E39] pt-12 pb-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div className="flex flex-col gap-4">
              <h4 className="text-white font-bold text-sm tracking-wider uppercase">
                Products
              </h4>
              <ul className="flex flex-col gap-2 text-xs text-[#787B86]">
                <li>
                  <a
                    href="#"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors"
                  >
                    Academy
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors"
                  >
                    Advertise
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors"
                  >
                    CMC Labs
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors"
                  >
                    Top Stories
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors"
                  >
                    Crypto API
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors"
                  >
                    Real-World Assets
                  </a>
                </li>
              </ul>
            </div>
            <div className="flex flex-col gap-4">
              <h4 className="text-white font-bold text-sm tracking-wider uppercase">
                Company
              </h4>
              <ul className="flex flex-col gap-2 text-xs text-[#787B86]">
                <li>
                  <a
                    href="#"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors"
                  >
                    About us
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors"
                  >
                    Terms of use
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors"
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors"
                  >
                    Community Rules
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors"
                  >
                    Disclaimer
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-orange-500 font-bold"
                  >
                    Careers — We're hiring!
                  </a>
                </li>
              </ul>
            </div>
            <div className="flex flex-col gap-4">
              <h4 className="text-white font-bold text-sm tracking-wider uppercase">
                Support
              </h4>
              <ul className="flex flex-col gap-2 text-xs text-[#787B86]">
                <li>
                  <a
                    href="#"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors"
                  >
                    Get Listed
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors"
                  >
                    Request Form
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors"
                  >
                    Contact Support
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors"
                  >
                    FAQ
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors"
                  >
                    Glossary
                  </a>
                </li>
              </ul>
            </div>
            <div className="flex flex-col gap-4">
              <h4 className="text-white font-bold text-sm tracking-wider uppercase">
                Socials
              </h4>
              <ul className="flex flex-col gap-2 text-xs text-[#787B86]">
                <li>
                  <a
                    href="https://twitter.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors"
                  >
                    X (Twitter)
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors"
                  >
                    Community
                  </a>
                </li>
                <li>
                  <a
                    href="https://telegram.org"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors"
                  >
                    Telegram
                  </a>
                </li>
                <li>
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors"
                  >
                    Instagram
                  </a>
                </li>
                <li>
                  <a
                    href="https://reddit.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors"
                  >
                    Reddit
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center text-[10px] font-mono opacity-30 border-t border-[#2A2E39] pt-6 gap-4">
            <span>
              © 2026 Finova Financial Services Group. All rights reserved.
            </span>
            <div className="flex gap-6">
              <span>SYSTEM STATUS: OPTIMAL</span>
              <span>NETWORK: MAINNET-SECURE</span>
              <span>LATENCY: 14MS</span>
            </div>
          </div>
        </div>
      </footer>

      <AnimatePresence></AnimatePresence>
    </div>
  );
}
