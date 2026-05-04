import React, { useState, useEffect } from "react";
import {
  Shield,
  Smartphone,
  Key,
  MapPin,
  Activity,
  Loader2,
  Fingerprint,
} from "lucide-react";

export function SecurityDashboard() {
  const [activityIndex, setActivityIndex] = useState(0);
  const [nextUpdateStr, setNextUpdateStr] = useState("");

  const activities = [
    {
      type: "Login",
      device: "Chrome / Windows",
      location: "Mumbai, India",
      timeStr: "2 mins ago",
    },
    {
      type: "Login",
      device: "Safari / iOS",
      location: "Delhi, India",
      timeStr: "1 hour ago",
    },
    {
      type: "API Key",
      device: "System Process",
      location: "Frankfurt, DE",
      timeStr: "Just now",
    },
    {
      type: "Login",
      device: "Firefox / macOS",
      location: "Bangalore, India",
      timeStr: "5 mins ago",
    },
    {
      type: "Session Auth",
      device: "Mobile App / Android",
      location: "Pune, India",
      timeStr: "15 mins ago",
    },
    {
      type: "Withdrawal",
      device: "Chrome / ChromeOS",
      location: "Singapore",
      timeStr: "22 mins ago",
    },
    {
      type: "New Device",
      device: "Edge / Windows",
      location: "Dubai, UAE",
      timeStr: "1 day ago",
    },
  ];

  useEffect(() => {
    const updateLog = () => {
      const now = new Date();
      // 2 hours in ms
      const windowMs = 2 * 60 * 60 * 1000;
      const currentEpochPeriod = Math.floor(now.getTime() / windowMs);

      setActivityIndex(currentEpochPeriod % activities.length);
    };

    updateLog();
    const interval = setInterval(updateLog, 60000);
    return () => clearInterval(interval);
  }, [activities.length]);

  const currentActivity = activities[activityIndex];

  return (
    <div className="bg-[#131722] rounded-xl p-6 border border-[#2A2E39] shadow-lg flex flex-col gap-6 h-full min-h-[360px]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Shield className="w-6 h-6 text-green-500" />
          <div>
            <h3 className="font-bold text-white">Trust & Security</h3>
            <p className="text-xs text-gray-400">
              Account status & recent activity
            </p>
          </div>
        </div>
        <span className="text-xs font-bold px-2 py-1 bg-green-500/10 text-green-500 rounded border border-green-500/20">
          PROTECTED
        </span>
      </div>

      <div className="flex-1 flex flex-col gap-3">
        <div className="flex items-center justify-between bg-[#1E222D] p-3 rounded-lg border border-[#2A2E39] hover:border-green-500/30 transition-colors">
          <div className="flex items-center gap-3">
            <Smartphone className="w-4 h-4 text-blue-400" />
            <span className="text-sm text-gray-300 font-medium">
              2-Factor Authentication
            </span>
          </div>
          <span className="text-xs font-bold text-green-500 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>{" "}
            Enabled
          </span>
        </div>

        <div className="flex items-center justify-between bg-[#1E222D] p-3 rounded-lg border border-[#2A2E39] hover:border-green-500/30 transition-colors">
          <div className="flex items-center gap-3">
            <Key className="w-4 h-4 text-blue-400" />
            <span className="text-sm text-gray-300 font-medium">
              End-to-End Encryption
            </span>
          </div>
          <span className="text-xs font-bold text-green-500 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>{" "}
            Active
          </span>
        </div>

        <div className="flex items-center justify-between bg-[#1E222D] p-3 rounded-lg border border-[#2A2E39] hover:border-purple-500/30 transition-colors">
          <div className="flex items-center gap-3">
            <Fingerprint className="w-4 h-4 text-purple-400" />
            <span className="text-sm text-gray-300 font-medium">
              Anti-Phishing Code
            </span>
          </div>
          <span className="text-xs font-bold text-green-500 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Set
          </span>
        </div>
      </div>

      <div className="border-t border-[#2A2E39] pt-4 mt-auto">
        <div className="flex items-center justify-between mb-3 border-b border-[#1E222D] pb-2">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
            <Activity className="w-3.5 h-3.5 text-gray-500" /> Recent Activity
          </span>
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></div>
            <span className="text-[9px] font-bold text-blue-500 uppercase tracking-wider">
              Live Tracker Active
            </span>
          </div>
        </div>
        <div className="flex items-start gap-3 bg-[#131722] p-2 rounded-lg group hover:bg-[#1E222D] transition-colors cursor-default">
          <div className="bg-[#2A2E39] p-2 rounded-full shrink-0 mt-0.5 group-hover:bg-[#323744] transition-colors">
            <MapPin className="w-4 h-4 text-gray-400" />
          </div>
          <div className="flex flex-col flex-1 overflow-hidden">
            <span className="text-sm text-white font-bold truncate leading-tight group-hover:text-blue-400 transition-colors">
              {currentActivity.type} / {currentActivity.device}
            </span>
            <span className="text-xs text-gray-500 truncate mt-1 font-medium">
              {currentActivity.location} • {currentActivity.timeStr}
            </span>
          </div>
          <div className="flex items-center gap-1 text-xs font-bold text-green-500 bg-green-500/10 px-2 py-1 rounded ml-auto shrink-0 self-center">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>{" "}
            Verified
          </div>
        </div>
      </div>
    </div>
  );
}
