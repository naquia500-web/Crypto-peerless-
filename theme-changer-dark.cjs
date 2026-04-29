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

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');

  // Reverse tailwind slate classes back to white/opacity
  content = content.replace(/bg-slate-50/g, 'bg-white/5')
                   .replace(/bg-slate-100/g, 'bg-white/10')
                   .replace(/bg-slate-200/g, 'bg-white/20')
                   .replace(/bg-slate-300/g, 'bg-white/30')
                   .replace(/bg-slate-800/g, 'bg-white/80')
                   .replace(/text-slate-900/g, 'text-white')
                   .replace(/text-slate-800/g, 'text-white/80')
                   .replace(/text-slate-700/g, 'text-white/70')
                   .replace(/text-slate-600/g, 'text-white/60')
                   .replace(/text-slate-500/g, 'text-white/50')
                   .replace(/text-slate-400/g, 'text-white/40')
                   .replace(/text-slate-300/g, 'text-white/30')
                   .replace(/border-slate-100/g, 'border-white/5')
                   .replace(/border-slate-200/g, 'border-white/10')
                   .replace(/border-slate-300/g, 'border-white/20')
                   .replace(/from-slate-100/g, 'from-white/5')
                   .replace(/from-slate-800/g, 'from-white/80')
                   .replace(/to-slate-500/g, 'to-white/50')
                   .replace(/to-slate-600/g, 'to-white/60')
                   .replace(/shadow-sm/g, 'shadow-lg');

  // Hardcode backgrounds
  content = content.replace(/bg-white/g, 'bg-[#0B0E11]')
                   .replace(/bg-\[\#0B0E11\]\/5/g, 'bg-white/5') 
                   .replace(/bg-\[\#0B0E11\]\/10/g, 'bg-white/10')
                   .replace(/bg-\[\#0B0E11\]\/20/g, 'bg-white/20')
                   .replace(/bg-\[\#0B0E11\]\/50/g, 'bg-white/50')
                   .replace(/bg-\[\#0B0E11\]\/80/g, 'bg-[#0B0E11]/80'); 

  // Colors
  content = content.replace(/#10B981/g, '#00FF88')
                   .replace(/#EF4444/g, '#FF4D4D')
                   .replace(/#0f172a/gi, '#fff')
                   .replace(/#F8FAFC/gi, '#0B0E11')
                   .replace(/rgba\(15,23,42/g, 'rgba(255,255,255')
                   .replace(/rgba\(15, 23, 42/g, 'rgba(255, 255, 255')
                   .replace(/&background=0B0E11&color=fff/g, '&background=f8fafc&color=0f172a') // Oops previous was reversed
                   .replace(/&background=f8fafc&color=0f172a/g, '&background=0B0E11&color=fff');

  fs.writeFileSync(file, content);
});
