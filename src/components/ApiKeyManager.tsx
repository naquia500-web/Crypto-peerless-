import { useState, useEffect } from 'react';
import { Key, Save, Check } from 'lucide-react';

export function ApiKeyManager() {
  const [apiKey, setApiKey] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const savedKey = localStorage.getItem('user_api_key');
    if (savedKey) {
      setApiKey(savedKey);
      setIsSaved(true);
    }
  }, []);

  const handleSave = () => {
    if (apiKey.trim()) {
      localStorage.setItem('user_api_key', apiKey.trim());
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2000);
    } else {
      localStorage.removeItem('user_api_key');
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2000);
    }
  };

  return (
    <div className="flex items-center gap-2 bg-white border border-blue-500/30 shadow-[0_0_15px_rgba(0,255,136,0.1)] px-3 py-2 rounded-xl transition-all focus-within:border-blue-500/60 focus-within:shadow-[0_0_20px_rgba(0,255,136,0.2)]">
      <div className="flex items-center justify-center p-1.5 bg-blue-500/10 rounded-lg">
        <Key className="w-4 h-4 text-blue-600" />
      </div>
      <input
        type="password"
        value={apiKey}
        onChange={(e) => setApiKey(e.target.value)}
        placeholder="Paste your API Key (Gemini/OpenRouter)..."
        className="bg-transparent border-none outline-none text-xs text-slate-900 focus:ring-0 placeholder:text-slate-900/30 w-56 sm:w-72 font-mono"
      />
      <button
        onClick={handleSave}
        className="p-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-100 rounded-lg text-slate-500 hover:text-slate-900 transition-colors ml-1"
        title="Save Key"
      >
        {isSaved ? <Check className="w-3.5 h-3.5 text-blue-600" /> : <Save className="w-3.5 h-3.5" />}
      </button>
    </div>
  );
}
