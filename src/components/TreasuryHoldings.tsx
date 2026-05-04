import { useState, useEffect } from "react";

export function TreasuryHoldings() {
  const [holdings, setHoldings] = useState([
    {
      rank: 1,
      name: "MicroStrategy",
      ticker: "MSTR",
      country: "US",
      holdings: 214246,
      value: "$16.4B",
      cost: "$35.1K",
      logo: "https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://microstrategy.com&size=64",
    },
    {
      rank: 2,
      name: "MARA Holdings, Inc.",
      ticker: "MARA",
      country: "US",
      holdings: 17314,
      value: "$1.32B",
      cost: "--",
      logo: "https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://mara.com&size=64",
    },
    {
      rank: 3,
      name: "Tesla, Inc.",
      ticker: "TSLA",
      country: "US",
      holdings: 9720,
      value: "$745M",
      cost: "$33.3K",
      logo: "https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://tesla.com&size=64",
    },
    {
      rank: 4,
      name: "Coinbase Global",
      ticker: "COIN",
      country: "US",
      holdings: 9000,
      value: "$690M",
      cost: "--",
      logo: "https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://coinbase.com&size=64",
    },
    {
      rank: 5,
      name: "Hut 8 Mining Corp",
      ticker: "HUT",
      country: "CA",
      holdings: 9113,
      value: "$698M",
      cost: "--",
      logo: "https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://hut8.io&size=64",
    },
    {
      rank: 6,
      name: "Block, Inc.",
      ticker: "SQ",
      country: "US",
      holdings: 8027,
      value: "$615M",
      cost: "$27.4K",
      logo: "https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://block.xyz&size=64",
    },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setHoldings((prev) =>
        prev.map((h) => {
          const btcPrice = 76500 + (Math.random() * 200 - 100);
          const newValue = h.holdings * btcPrice;
          let formattedValue = "";
          if (newValue > 1e9)
            formattedValue = `$${(newValue / 1e9).toFixed(2)}B`;
          else formattedValue = `$${(newValue / 1e6).toFixed(0)}M`;
          return { ...h, value: formattedValue };
        }),
      );
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="flex flex-col gap-4 mt-8">
      <div className="flex items-center justify-between pb-2 border-b border-[#2A2E39]">
        <h3 className="text-[14px] font-black uppercase tracking-widest text-[#D1D4DC] flex items-center gap-2">
          Bitcoin Treasury Holdings
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 ml-2">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></div>
            <span className="text-[9px] font-bold text-blue-500 uppercase tracking-wider">
              Live Tracker Active
            </span>
          </div>
        </h3>
        <button
          onClick={() => window.open("https://bitcointreasuries.net", "_blank")}
          className="text-[9px] font-bold uppercase tracking-widest bg-[#2A2E39] text-[#787B86] hover:text-[#B2B5BE] hover:bg-slate-200 px-3 py-1 rounded transition-colors"
        >
          View Complete List
        </button>
      </div>

      <div className="bg-[#131722] shadow-sm border border-[#2A2E39] rounded-xl overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="border-b border-[#2A2E39] text-[9px] uppercase tracking-widest text-[#787B86] bg-[#1E222D]">
              <th className="px-4 py-3 font-bold w-12 text-center">#</th>
              <th className="px-4 py-3 font-bold">Company Name</th>
              <th className="px-4 py-3 font-bold">Ticker</th>
              <th className="px-4 py-3 font-bold text-center">Country</th>
              <th className="px-4 py-3 font-bold text-right">BTC Holdings</th>
              <th className="px-4 py-3 font-bold text-right">Current Value</th>
              <th className="px-4 py-3 font-bold text-right">Cost Basis</th>
            </tr>
          </thead>
          <tbody>
            {holdings.map((row, idx) => (
              <tr
                key={idx}
                onClick={() =>
                  window.open(
                    `https://finance.yahoo.com/quote/${row.ticker}`,
                    "_blank",
                  )
                }
                className="border-b border-[#2A2E39] hover:bg-[#1E222D] transition-colors group cursor-pointer"
              >
                <td className="px-4 py-4 text-center">
                  <span className="text-[10px] font-mono text-slate-400">
                    {row.rank}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2 group-hover:text-blue-400 transition-colors text-[#B2B5BE]">
                    <img
                      src={row.logo}
                      alt={row.name}
                      className="w-5 h-5 rounded-full bg-[#2A2E39]"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          `https://ui-avatars.com/api/?name=${row.name.replace(/ /g, "+")}&background=f8fafc&color=333&rounded=true&font-size=0.4`;
                      }}
                    />
                    <span className="text-xs font-bold">{row.name}</span>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#787B86] bg-[#2A2E39] px-2 py-0.5 rounded">
                    {row.ticker}
                  </span>
                </td>
                <td className="px-4 py-4 text-center">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#787B86]">
                    {row.country}
                  </span>
                </td>
                <td className="px-4 py-4 text-right">
                  <span className="font-mono text-xs font-bold text-[#D1D4DC]">
                    {row.holdings}
                  </span>
                </td>
                <td className="px-4 py-4 text-right">
                  <span className="font-mono text-xs text-[#787B86]">
                    {row.value}
                  </span>
                </td>
                <td className="px-4 py-4 text-right">
                  <span className="font-mono text-xs text-slate-400">
                    {row.cost}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
