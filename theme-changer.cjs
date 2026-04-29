const fs = require('fs');
const path = require('path');

const walk = (dir) => {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      results.push(file);
    }
  });
  return results;
}

const files = walk('./src');

const replaceMap = [
  // Major Backgrounds
  { k: 'bg-\\[#0B0E11\\]', v: 'bg-slate-50' },
  { k: 'bg-\\[#030405\\]', v: 'bg-white' },
  { k: 'bg-\\[#050709\\]', v: 'bg-white' },

  // Text colors specific
  { k: 'text-white/50', v: 'text-slate-500' },
  { k: 'text-white/60', v: 'text-slate-500' },
  { k: 'text-white/70', v: 'text-slate-600' },
  { k: 'text-white/80', v: 'text-slate-700' },
  { k: 'text-white/40', v: 'text-slate-500' },
  { k: 'text-white/30', v: 'text-slate-400' },
  { k: 'text-white/20', v: 'text-slate-400' },

  // Borders
  { k: 'border-white/10', v: 'border-slate-200' },
  { k: 'border-white/5', v: 'border-slate-100' },
  { k: 'border-white/20', v: 'border-slate-300' },
  { k: 'border-white', v: 'border-slate-300' },

  // Background Opacities
  { k: 'bg-white/5', v: 'bg-slate-50' },
  { k: 'bg-white/10', v: 'bg-slate-100' },
  { k: 'bg-white/20', v: 'bg-slate-200' },
  { k: 'bg-white/\\[0\\.01\\]', v: 'bg-slate-50' },

  // Hover states
  { k: 'hover:bg-white/5', v: 'hover:bg-slate-100' },
  { k: 'hover:bg-white/10', v: 'hover:bg-slate-200' },
  
  // Custom specific
  { k: 'glass', v: 'bg-white shadow-sm border border-slate-200' },
  { k: 'from-white/\\[0\\.02\\]', v: 'from-slate-100' },
  { k: 'from-white/\\[0\\.03\\]', v: 'from-slate-100' },
  { k: 'from-white', v: 'from-slate-800' },
  { k: 'to-white/50', v: 'to-slate-500' },
  { k: 'to-white', v: 'to-slate-600' },

  // Base text color
  { k: 'hover:text-white', v: 'hover:text-slate-900' },
  { k: 'text-white', v: 'text-slate-900' },
];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let originalContent = content;

  // Direct string replacements for specific cases
  const literalMap = {
    '&background=0B0E11&color=fff': '&background=f8fafc&color=0f172a',
    '&background=0B0E11': '&background=f8fafc',
    'rgba(255,255,255,0.3)': 'rgba(15,23,42,0.4)',
    'rgba(255, 255, 255, 0.3)': 'rgba(15, 23, 42, 0.4)',
    'rgba(255,255,255,0.4)': 'rgba(15,23,42,0.5)',
    'rgba(255,255,255,0.5)': 'rgba(15,23,42,0.6)',
    'rgba(255,255,255,0.03)': 'rgba(15,23,42,0.05)',
    'rgba(255,255,255,0.05)': 'rgba(15,23,42,0.05)',
    'rgba(255,255,255,0.1)': 'rgba(15,23,42,0.1)',
    'rgba(5, 7, 9, 0.95)': 'rgba(255, 255, 255, 0.95)',
    'rgba(11, 14, 17, 0.95)': 'rgba(255, 255, 255, 0.95)',
    "color: '#fff'": "color: '#0f172a'",
    'color: "#fff"': 'color: "#0f172a"',
    'fill="#fff"': 'fill="#0f172a"',
    "fill: '#fff'": "fill: '#0f172a'",
    '#00FF88': '#10B981',
    '#FF4D4D': '#EF4444'
  };

  for(const [k, v] of Object.entries(literalMap)) {
    content = content.split(k).join(v);
  }

  // Regex replacements for tailwind classes
  for (const item of replaceMap) {
    let escapedKey = item.k.replace(/\//g, '\\/'); // Only escape forward slash, brackets already escaped in map
    let regex = new RegExp(`(?<=[\\s"'\\\`>])${escapedKey}(?=[\\s"'\\\`<])`, 'g');
    content = content.replace(regex, item.v);
  }

  if (content !== originalContent) {
    fs.writeFileSync(file, content);
  }
});
