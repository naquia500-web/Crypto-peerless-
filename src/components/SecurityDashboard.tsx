import { Shield, Smartphone, Key, MapPin, Activity } from 'lucide-react';

export function SecurityDashboard() {
  return (
    <div className="bg-[#131722] rounded-xl p-6 border border-[#2A2E39] shadow-lg flex flex-col gap-6">
      <div className="flex items-center justify-between">
         <div className="flex items-center gap-3">
            <Shield className="w-6 h-6 text-green-500" />
            <div>
              <h3 className="font-bold text-white">Trust &amp; Security</h3>
              <p className="text-xs text-gray-400">Account status &amp; recent activity</p>
            </div>
         </div>
         <span className="text-xs font-bold px-2 py-1 bg-green-500/10 text-green-500 rounded border border-green-500/20">PROTECTED</span>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <div className="flex items-center justify-between bg-[#1E222D] p-3 rounded-lg border border-[#2A2E39]">
          <div className="flex items-center gap-3">
            <Smartphone className="w-4 h-4 text-blue-400" />
             <span className="text-sm text-gray-300">2-Factor Authentication</span>
          </div>
          <span className="text-xs font-bold text-green-500">Enabled</span>
        </div>

        <div className="flex items-center justify-between bg-[#1E222D] p-3 rounded-lg border border-[#2A2E39]">
          <div className="flex items-center gap-3">
            <Key className="w-4 h-4 text-blue-400" />
             <span className="text-sm text-gray-300">End-to-End Encryption</span>
          </div>
          <span className="text-xs font-bold text-green-500">Active</span>
        </div>
      </div>

      <div className="border-t border-[#2A2E39] pt-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Recent Activity</span>
          <Activity className="w-4 h-4 text-gray-500" />
        </div>
        <div className="flex items-start gap-3">
          <MapPin className="w-4 h-4 text-gray-500 mt-1" />
          <div className="flex flex-col">
            <span className="text-sm text-white">Login from Chrome / Windows</span>
            <span className="text-xs text-gray-500">Mumbai, India • 2 mins ago</span>
          </div>
        </div>
      </div>
    </div>
  );
}
