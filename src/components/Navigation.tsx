import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Sparkles,
  ShieldCheck,
  Globe,
  Moon,
  Sun,
  Menu,
  X,
  ChevronRight,
  ChevronDown,
  User,
  Settings,
  Bell,
  Search,
  Star,
  PieChart,
} from "lucide-react";
import { AuthModal } from "./AuthModal";

export function Navigation() {
  const [isLight, setIsLight] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null);
  const [authModalConfig, setAuthModalConfig] = useState<{
    isOpen: boolean;
    mode: "login" | "signup";
  }>({ isOpen: false, mode: "signup" });
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    // Check local storage for session
    const session = localStorage.getItem("cmc_session");
    if (session) {
      setIsAuthenticated(true);
      setUserEmail(session);
    }
  }, []);

  const handleLogout = () => {
    if (window.confirm("Log out?")) {
      setIsAuthenticated(false);
      setUserEmail("");
      localStorage.removeItem("cmc_session");
    }
  };

  useEffect(() => {
    if (isLight) {
      document.documentElement.classList.add("theme-light");
    } else {
      document.documentElement.classList.remove("theme-light");
    }
  }, [isLight]);

  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  const scrollTo = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    setIsMobileMenuOpen(false); // Close mobile menu if open
    const el = document.getElementById(id);
    if (el) {
      const headerOffset = 130;
      const elementPosition = el.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <nav className="border-b border-[#2A2E39] sticky top-0 z-50 bg-[#131722]/90 backdrop-blur-xl pt-4 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 flex items-center justify-between pb-4">
        <div className="flex flex-col flex-1">
          <span className="text-[10px] uppercase tracking-[0.4em] text-blue-500 font-extrabold mb-1 flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> Professional Analytics Platform
          </span>
          <div className="flex items-center gap-4 flex-wrap">
            <h1 className="text-2xl font-black italic tracking-tighter uppercase text-white drop-shadow-sm flex items-center gap-2">
              <div className="w-6 h-6 bg-blue-600 rounded-md flex items-center justify-center transform -skew-x-12">
                <span className="text-white text-xs non-italic font-black">
                  B
                </span>
              </div>
              bitwise-tech
            </h1>
          </div>
        </div>

        <nav className="hidden xl:flex gap-6 text-[9px] uppercase tracking-widest font-bold text-[#787B86] flex-wrap justify-end pl-8">
          {[
            { label: "Overview", id: "section-overview" },
            { label: "Global Markets", id: "section-global-market" },
            { label: "Watchlist", id: "section-watchlist" },
            { label: "About", id: "section-about" },
            { label: "News", id: "section-news" },
            { label: "Sentiment", id: "section-market-sentiment" },
            { label: "Insights", id: "section-insights" },
            { label: "Learn", id: "section-masterclass" },
            { label: "Support", id: "section-support" },
          ].map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              onClick={(e) => scrollTo(e, link.id)}
              className="hover:text-blue-400 transition-colors whitespace-nowrap"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3 xl:ml-8">
          <button
            onClick={() => setIsLight(!isLight)}
            className="hidden sm:flex items-center justify-center w-8 h-8 rounded-lg bg-[#2A2E39] hover:bg-[#363A45] text-gray-400 hover:text-white transition-colors border border-[#363A45]"
            title="Toggle Light/Dark Theme"
          >
            {isLight ? (
              <Moon className="w-4 h-4" />
            ) : (
              <Sun className="w-4 h-4" />
            )}
          </button>
          <div className="hidden lg:flex items-center gap-2 cursor-pointer hover:bg-[#2A2E39] px-2 py-1 rounded text-gray-400 hover:text-white transition-colors mr-2">
            <Globe className="w-4 h-4" />
            <span className="text-xs font-bold uppercase">EN / HI</span>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 px-2 py-1 bg-green-500/10 border border-green-500/20 rounded-md text-green-500 mr-2">
            <ShieldCheck className="w-3 h-3" />
            <span className="text-[9px] font-bold tracking-wider uppercase">
              SSL Secured
            </span>
          </div>
          {isAuthenticated ? (
            <div
              className="hidden sm:flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
              onClick={handleLogout}
            >
              <img
                src={`https://ui-avatars.com/api/?name=${userEmail}&background=2A2E39&color=fff`}
                alt="Profile"
                className="w-8 h-8 rounded-full border border-[#2A2E39] shadow-sm object-contain"
              />
              <span className="text-xs font-mono font-bold text-[#B2B5BE] hidden md:block max-w-[100px] truncate">
                {userEmail.split("@")[0]}
              </span>
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-3">
              <button
                onClick={() =>
                  setAuthModalConfig({ isOpen: true, mode: "login" })
                }
                className="text-sm font-bold text-gray-300 hover:text-white transition-colors"
              >
                Log In
              </button>
              <button
                onClick={() =>
                  setAuthModalConfig({ isOpen: true, mode: "signup" })
                }
                className="text-sm font-bold bg-[#3861FB] hover:bg-[#2f53d7] text-white px-4 py-1.5 rounded-lg transition-colors"
              >
                Sign Up
              </button>
            </div>
          )}

          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="xl:hidden flex items-center justify-center w-8 h-8 rounded-lg bg-[#2A2E39] text-gray-400 border border-[#363A45]"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Mobile Sub-Navigation */}
      <div className="xl:hidden w-full overflow-x-auto no-scrollbar border-t border-[#2A2E39] bg-[#131722]">
        <div className="flex gap-6 px-4 py-3 text-sm font-bold text-[#B2B5BE] whitespace-nowrap w-max sm:mx-0">
          {[
            { label: "Overview", id: "section-overview" },
            { label: "Markets", id: "section-global-market" },
            { label: "News", id: "section-news" },
            { label: "Community", id: "section-support" },
            { label: "Insights", id: "section-insights" },
            { label: "Watchlist", id: "section-watchlist" },
            { label: "Learn", id: "section-masterclass" },
            { label: "About", id: "section-about" },
          ].map((link) => (
            <a
              key={"subnav-" + link.id}
              href={`#${link.id}`}
              onClick={(e) => scrollTo(e, link.id)}
              className="hover:text-blue-500 transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>

      {/* Mobile Navigation Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "tween", duration: 0.2 }}
            className={`fixed inset-0 z-[100] flex flex-col overflow-y-auto ${isLight ? "bg-white" : "bg-[#131722]"}`}
          >
            <div
              className={`flex items-center justify-between p-4 border-b ${isLight ? "border-gray-200" : "border-[#2A2E39]"}`}
            >
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center">
                  <svg
                    width="28"
                    height="28"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-2-5.5V9.5l3.5 2 3.5-2v5.5H15V12l-1.5 1-1.5-1v2.5H10z"
                      fill="currentColor"
                      className={isLight ? "text-black" : "text-white"}
                    />
                  </svg>
                </div>
                <span
                  className={`font-bold text-[17px] ${isLight ? "text-black" : "text-white"}`}
                >
                  CoinMarketCap
                </span>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className={`w-8 h-8 flex items-center justify-center ${isLight ? "text-gray-500" : "text-gray-400"}`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-col flex-1 pb-8">
              {/* Menu Links */}
              <div className="flex flex-col">
                {[
                  {
                    label: "Cryptocurrencies",
                    dropdown: true,
                    subItems: [
                      "Ranking",
                      "Recently Added",
                      "Categories",
                      "Spotlight",
                      "Gainers & Losers",
                      "Global Charts",
                      "Historical Snapshots",
                    ],
                  },
                  {
                    label: "Dashboards",
                    dropdown: true,
                    subItems: [
                      "Overview",
                      "Market Cap",
                      "Volume",
                      "Derivatives",
                    ],
                  },
                  {
                    label: "DexScan",
                    dropdown: true,
                    subItems: [
                      "Ethereum",
                      "BNB Chain",
                      "Polygon",
                      "Solana",
                      "Avalanche",
                    ],
                  },
                  {
                    label: "Exchanges",
                    dropdown: true,
                    subItems: ["Spot", "Derivatives", "DEX", "Lending"],
                  },
                  {
                    label: "Community",
                    dropdown: true,
                    subItems: ["Feed", "Articles"],
                  },
                  {
                    label: "Products",
                    dropdown: true,
                    subItems: [
                      "Converter",
                      "Mobile Apps",
                      "Blockchain Explorer",
                      "Crypto API",
                      "Site Widgets",
                    ],
                  },
                  {
                    label: "API",
                    dropdown: true,
                    subItems: ["Pricing", "Documentation", "Status"],
                  },
                  { label: "Watchlist", icon: Star },
                  { label: "Portfolio", icon: PieChart },
                  {
                    label: "My Diamonds",
                    icon: ({ className }: any) => (
                      <svg
                        className={className}
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M12 2l7 7-7 13-7-13 7-7z" />
                      </svg>
                    ),
                  },
                  {
                    label: "CMC AI",
                    icon: ({ className }: any) => (
                      <Sparkles className={className} />
                    ),
                    dropdown: true,
                    subItems: ["Chatbot", "Market Analysis"],
                  },
                  { label: "Notifications", icon: Bell },
                  {
                    label: "Settings",
                    icon: User,
                    dropdown: true,
                    subItems: ["Account", "Preferences", "Security"],
                  },
                ].map((item, idx) => (
                  <div key={idx} className="flex flex-col">
                    <button
                      onClick={() =>
                        item.dropdown
                          ? setExpandedMenu(
                              expandedMenu === item.label ? null : item.label,
                            )
                          : null
                      }
                      className={`flex items-center justify-between px-4 py-3.5 border-b transition-colors ${isLight ? "border-gray-100 hover:bg-gray-50" : "border-[#2A2E39]/50 hover:bg-[#1E222D]"}`}
                    >
                      <div className="flex items-center gap-3">
                        {item.icon && (
                          <item.icon className="w-4 h-4 text-gray-400" />
                        )}
                        <span
                          className={`font-bold text-sm ${isLight ? "text-[#0F172A]" : "text-gray-200"}`}
                        >
                          {item.label}
                        </span>
                      </div>
                      {item.dropdown && (
                        <ChevronDown
                          className={`w-4 h-4 text-gray-400 transition-transform ${expandedMenu === item.label ? "rotate-180" : ""}`}
                        />
                      )}
                    </button>
                    {item.dropdown && expandedMenu === item.label && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className={`flex flex-col overflow-hidden ${isLight ? "bg-gray-50" : "bg-[#1E222D]"}`}
                      >
                        {item.subItems?.map((sub, childIdx) => (
                          <button
                            key={childIdx}
                            className={`text-left px-8 py-3 text-sm font-semibold border-b last:border-0 ${isLight ? "text-gray-600 border-gray-200 hover:bg-gray-100" : "text-gray-400 border-[#2A2E39] hover:bg-[#2A2E39]"}`}
                          >
                            {sub}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </div>
                ))}
              </div>

              <div className="p-4 flex flex-col gap-3 mt-2">
                {/* Account Actions */}
                {isAuthenticated ? (
                  <button
                    onClick={handleLogout}
                    className="w-full bg-[#1E222D] border border-[#2A2E39] hover:bg-[#2A2E39] text-white font-bold py-2.5 rounded text-sm transition-colors flex items-center justify-center gap-2"
                  >
                    <img
                      src={`https://ui-avatars.com/api/?name=${userEmail}&background=2A2E39&color=fff`}
                      alt="Profile"
                      className="w-5 h-5 rounded-full"
                    />
                    Log Out ({userEmail.split("@")[0]})
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() =>
                        setAuthModalConfig({ isOpen: true, mode: "signup" })
                      }
                      className="w-full bg-[#3861FB] hover:bg-[#2f53d7] text-white font-bold py-2.5 rounded text-sm transition-colors"
                    >
                      Create an account
                    </button>
                    <button
                      onClick={() =>
                        setAuthModalConfig({ isOpen: true, mode: "login" })
                      }
                      className="w-full bg-[#3861FB] hover:bg-[#2f53d7] text-white font-bold py-2.5 rounded text-sm transition-colors"
                    >
                      Log in
                    </button>
                  </>
                )}

                {/* Settings Actions */}
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <button
                    className={`flex items-center justify-center gap-1 py-2 rounded text-xs font-bold ${isLight ? "bg-gray-100 text-gray-800" : "bg-[#1E222D] text-gray-300"}`}
                  >
                    English <span className="text-[10px]">▼</span>
                  </button>
                  <button
                    className={`flex items-center justify-center gap-1 py-2 rounded text-xs font-bold ${isLight ? "bg-gray-100 text-gray-800" : "bg-[#1E222D] text-gray-300"}`}
                  >
                    <span className="text-green-500 rounded-full bg-green-100 w-3.5 h-3.5 flex items-center justify-center text-[10px] mr-0.5">
                      $
                    </span>{" "}
                    USD <span className="text-[10px]">▼</span>
                  </button>
                </div>

                {/* Theme Selector */}
                <div
                  className={`mt-2 flex rounded p-0.5 ${isLight ? "bg-gray-100" : "bg-[#1E222D]"}`}
                >
                  <button
                    className={`flex-1 py-1.5 text-xs font-bold rounded ${!isLight ? "text-gray-400" : "bg-white shadow-sm text-gray-800"}`}
                    onClick={() => setIsLight(true)}
                  >
                    Light
                  </button>
                  <button
                    className={`flex-1 py-1.5 text-xs font-bold rounded ${isLight ? "text-gray-400" : "bg-[#2A2E39] shadow-sm text-white"}`}
                    onClick={() => setIsLight(false)}
                  >
                    Dark
                  </button>
                  <button
                    className={`flex-1 py-1.5 text-xs font-bold rounded ${isLight ? "text-gray-500" : "text-gray-500"}`}
                  >
                    System
                  </button>
                </div>

                {/* Footer Links */}
                <div className="flex flex-col items-center gap-2 mt-6">
                  <div
                    className={`flex items-center justify-center gap-3 text-[11px] font-bold ${isLight ? "text-gray-500" : "text-gray-500"}`}
                  >
                    <a href="#">Disclaimer</a>
                    <span>•</span>
                    <a href="#">Request Form</a>
                    <span>•</span>
                    <a href="#">Terms of Use</a>
                  </div>
                  <div
                    className={`flex items-center justify-center gap-3 text-[11px] font-bold ${isLight ? "text-gray-500" : "text-gray-500"}`}
                  >
                    <a href="#">Privacy Policy</a>
                    <span>•</span>
                    <a href="#">About</a>
                  </div>
                </div>

                {/* Social Icons */}
                <div className="flex items-center justify-center gap-4 mt-4 mb-4">
                  {[
                    "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z", // X
                    "M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z", // FB
                    "M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a5.96 5.96 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.622-.168.9-.505 1.204-.826 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.896-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z", // Telegram
                    "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z", // LI
                    "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z", // Insta
                    "M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.753 0 .528-.231 1.002-.596 1.328.011.164.02.327.02.492 0 3.14-3.208 5.688-7.164 5.688-3.958 0-7.164-2.548-7.164-5.688 0-.154.006-.307.018-.458-.335-.333-.54-.783-.54-1.282 0-.967.786-1.753 1.754-1.753.463 0 .88.172 1.185.466 1.189-.834 2.812-1.385 4.594-1.47l.88-4.116a.321.321 0 0 1 .362-.25l3.056.643c.123-.526.596-.921 1.166-.921zm-6.666 8.872a1.42 1.42 0 0 0-1.417 1.417 1.417 1.417 0 0 0 1.417 1.419 1.42 1.42 0 0 0 1.419-1.419A1.42 1.42 0 0 0 10.344 13.616zm3.312 0a1.42 1.42 0 0 0-1.417 1.417 1.417 1.417 0 0 0 1.417 1.419 1.42 1.42 0 0 0 1.419-1.419A1.42 1.42 0 0 0 13.656 13.616zm-3.312 3.992c-1.343 0-2.583.39-3.197.994l.573.642c.488-.484 1.545-.8 2.624-.8 1.08 0 2.136.316 2.624.8l.573-.642c-.614-.604-1.854-.994-3.197-.994z", // Reddit
                  ].map((path, i) => (
                    <a
                      key={i}
                      href="#"
                      className={`w-6 h-6 flex items-center justify-center ${isLight ? "text-gray-500 hover:text-gray-800" : "text-gray-500 hover:text-gray-300"}`}
                    >
                      <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                        <path d={path} />
                      </svg>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AuthModal
        isOpen={authModalConfig.isOpen}
        onClose={() =>
          setAuthModalConfig((prev) => ({ ...prev, isOpen: false }))
        }
        initialMode={authModalConfig.mode}
        onSuccess={(email) => {
          if (email) {
            setIsAuthenticated(true);
            setUserEmail(email);
            localStorage.setItem("cmc_session", email);
          }
        }}
        isLight={isLight}
      />
    </nav>
  );
}
