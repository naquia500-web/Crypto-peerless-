export function AboutAsset() {
  return (
    <section className="flex flex-col gap-6 mt-8">
      <div className="flex items-center justify-between pb-2 border-b border-[#2A2E39]">
        <h3 className="text-[14px] font-black uppercase tracking-widest text-white">About Bitcoin</h3>
        <button 
          onClick={() => {
            document.getElementById('ai-analyst')?.scrollIntoView({ behavior: 'smooth' });
            // Optionally, focus the input or trigger a message via custom event or state 
          }}
          className="text-[9px] font-bold uppercase tracking-widest bg-[#1E222D] text-orange-400 border border-orange-500/30 px-3 py-1 rounded-full flex items-center gap-1.5 transition-colors hover:bg-orange-500/10 cursor-pointer"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse"></span> Explain with AI
        </button>
      </div>

      {/* SEO/Summary Text */}
      <div className="flex flex-col gap-4">
        <h4 className="font-bold text-lg">What Is Bitcoin (BTC)?</h4>
        <div className="text-sm text-[#787B86] leading-relaxed font-sans flex flex-col gap-3">
          <p>
            <strong className="text-white">Bitcoin</strong> is a decentralized cryptocurrency originally described in a 2008 whitepaper by a person, or group of people, using the alias Satoshi Nakamoto. It was launched soon after, in January 2009.
          </p>
          <p>
            Bitcoin is a peer-to-peer online currency, meaning that all transactions happen directly between equal, independent network participants, without the need for any intermediary to permit or facilitate them. Bitcoin was created, according to Nakamoto's own words, to allow "online payments to be sent directly from one party to another without going through a financial institution."
          </p>
          <p>
            Some concepts for a similar type of a decentralized electronic currency precede BTC, but Bitcoin holds the distinction of being the first-ever cryptocurrency to come into actual use.
          </p>
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-5 border-t border-[#2A2E39] pt-6">
        <h4 className="font-bold text-lg">Bitcoin Price Live Data</h4>
        <p className="text-sm text-[#787B86] leading-relaxed font-sans">
          The live <strong className="text-white">Bitcoin price today</strong> is $76,685.27 USD with a 24-hour trading volume of $38,290,133,383 USD. We update our BTC to USD price in real-time. Bitcoin is up 1.97% in the last 24 hours. The current CoinMarketCap ranking is #1, with a live market cap of $1,535,150,327,473 USD. It has a circulating supply of 20,018,843 BTC coins and a max. supply of 21,000,000 BTC coins.
        </p>
      </div>

    </section>
  );
}
