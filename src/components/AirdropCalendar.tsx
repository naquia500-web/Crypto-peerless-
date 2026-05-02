import { Calendar as CalendarIcon, Gift, ExternalLink, Flame } from 'lucide-react';

export function AirdropCalendar() {
  const events = [
    { title: 'ZkSync Token Generation', type: 'Airdrop', date: 'May 15', status: 'Confirmed', hot: true },
    { title: 'LayerZero Snapshot', type: 'Snapshot', date: 'May 10', status: 'Speculated', hot: true },
    { title: 'Manta Network Unlocks', type: 'Unlock', date: 'May 05', status: 'Ongoing', hot: false },
    { title: 'Base Network Season 2', type: 'Airdrop', date: 'Jun 01', status: 'Unconfirmed', hot: false },
  ];

  return (
    <div className="bg-[#131722] rounded-xl p-6 border border-[#2A2E39] shadow-lg flex flex-col gap-6 h-full">
      <div className="flex items-center justify-between">
         <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Gift className="w-5 h-5 text-blue-500" /> Airdrops &amp; ICO Calendar
          </h3>
          <p className="text-sm text-gray-400 mt-1">Don't miss the next big opportunity</p>
         </div>
         <CalendarIcon className="w-6 h-6 text-gray-500" />
      </div>

      <div className="flex-1 flex flex-col gap-3">
        {events.map((evt, i) => (
          <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-[#1E222D] rounded-lg border border-[#2A2E39] gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                {evt.hot && <Flame className="w-4 h-4 text-orange-500" />}
                <h4 className="font-bold text-white text-sm">{evt.title}</h4>
              </div>
              <div className="flex gap-2 text-xs">
                <span className="text-blue-400">{evt.type}</span>
                <span className="text-gray-500 px-2 border-l border-gray-700">{evt.status}</span>
              </div>
            </div>
            <div className="flex items-center gap-4 sm:flex-col sm:items-end sm:gap-1">
              <div className="text-sm font-bold text-gray-300 bg-[#2A2E39] px-3 py-1 rounded-full">{evt.date}</div>
              <button className="text-xs text-blue-500 hover:text-blue-400 flex items-center gap-1 font-bold">
                Details <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <button className="w-full py-3 mt-2 bg-blue-600/10 hover:bg-blue-600/20 text-blue-500 border border-blue-500/20 rounded-lg text-sm font-bold transition-colors">
        View Full Calendar
      </button>
    </div>
  );
}
