export function TreasuryHoldings() {
  const holdings = [
    { rank: 1, name: 'MicroStrategy', ticker: 'MSTR', country: 'US', holdings: '214,246', value: '$16.4B', cost: '$35.1K', logo: 'https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://microstrategy.com&size=64' },
    { rank: 2, name: 'MARA Holdings, Inc.', ticker: 'MARA', country: 'US', holdings: '17,314', value: '$1.32B', cost: '--', logo: 'https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://mara.com&size=64' },
    { rank: 3, name: 'Tesla, Inc.', ticker: 'TSLA', country: 'US', holdings: '9,720', value: '$745M', cost: '$33.3K', logo: 'https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://tesla.com&size=64' },
    { rank: 4, name: 'Coinbase Global', ticker: 'COIN', country: 'US', holdings: '9,000', value: '$690M', cost: '--', logo: 'https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://coinbase.com&size=64' },
    { rank: 5, name: 'Hut 8 Mining Corp', ticker: 'HUT', country: 'CA', holdings: '9,113', value: '$698M', cost: '--', logo: 'https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://hut8.io&size=64' },
    { rank: 6, name: 'Block, Inc.', ticker: 'SQ', country: 'US', holdings: '8,027', value: '$615M', cost: '$27.4K', logo: 'https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://block.xyz&size=64' },
  ];

  return (
    <section className="flex flex-col gap-4 mt-8">
      <div className="flex items-center justify-between pb-2 border-b border-white/10">
        <h3 className="text-[14px] font-black uppercase tracking-widest text-white">Bitcoin Treasury Holdings</h3>
        <button 
          onClick={() => window.open('https://bitcointreasuries.net', '_blank')}
          className="text-[9px] font-bold uppercase tracking-widest bg-white/5 hover:bg-white/20 px-3 py-1 rounded transition-colors"
        >
          View Complete List
        </button>
      </div>

      <div className="bg-[#0B0E11] shadow-lg border border-white/10 rounded-xl overflow-x-auto border border-white/5">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="border-b border-white/10 text-[9px] uppercase tracking-widest opacity-50 bg-white/5">
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
                onClick={() => window.open(`https://finance.yahoo.com/quote/${row.ticker}`, '_blank')}
                className="border-b border-white/5 hover:bg-white/10 transition-colors group cursor-pointer"
              >
                <td className="px-4 py-4 text-center">
                  <span className="text-[10px] font-mono opacity-50">{row.rank}</span>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2 group-hover:text-blue-400 transition-colors">
                    <img 
                      src={row.logo} 
                      alt={row.name} 
                      className="w-5 h-5 rounded-full bg-white/10"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${row.name.replace(/ /g, '+')}&background=0B0E11&color=fff&rounded=true&font-size=0.4`;
                      }}
                    />
                    <span className="text-xs font-bold">{row.name}</span>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <span className="text-[10px] font-bold uppercase tracking-widest opacity-60 bg-white/5 px-2 py-0.5 rounded">{row.ticker}</span>
                </td>
                <td className="px-4 py-4 text-center">
                  <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">{row.country}</span>
                </td>
                <td className="px-4 py-4 text-right">
                  <span className="font-mono text-xs font-bold text-white">{row.holdings}</span>
                </td>
                <td className="px-4 py-4 text-right">
                  <span className="font-mono text-xs opacity-80">{row.value}</span>
                </td>
                <td className="px-4 py-4 text-right">
                  <span className="font-mono text-xs opacity-50">{row.cost}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
