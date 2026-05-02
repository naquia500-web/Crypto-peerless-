import * as fs from 'fs';
import * as path from 'path';

const dir = './src';

const regexes = [
  { p: /\bbg-white\b/g, r: "bg-[#131722]" },
  { p: /\bbg-slate-50\b/g, r: "bg-[#1E222D]" },
  { p: /\bbg-slate-100\b/g, r: "bg-[#2A2E39]" },
  { p: /\bborder-slate-100\b/g, r: "border-[#2A2E39]" },
  { p: /\bborder-slate-200\b/g, r: "border-[#2A2E39]" },
  { p: /\bborder-slate-300\b/g, r: "border-[#363A45]" },
  { p: /\btext-slate-900\b/g, r: "text-white" },
  { p: /\btext-slate-800\b/g, r: "text-[#D1D4DC]" },
  { p: /\btext-slate-700\b/g, r: "text-[#B2B5BE]" },
  { p: /\btext-slate-600\b/g, r: "text-[#787B86]" },
  { p: /\btext-slate-500\b/g, r: "text-[#787B86]" },
  { p: /\btext-slate-400\b/g, r: "text-slate-400" }, // keep distinct
  { p: /\btext-slate-300\b/g, r: "text-slate-300" }, // keep distinct
  { p: /\bhover:bg-slate-50\b/g, r: "hover:bg-[#1E222D]" },
  { p: /\bhover:bg-slate-100\b/g, r: "hover:bg-[#2A2E39]" },
  { p: /\bhover:border-slate-200\b/g, r: "hover:border-[#363A45]" },
  { p: /\bhover:border-slate-300\b/g, r: "hover:border-[#434651]" },
  { p: /\bhover:text-slate-900\b/g, r: "hover:text-white" },
  { p: /\bhover:text-slate-700\b/g, r: "hover:text-[#B2B5BE]" },
  { p: /\bbg-\[\#0B0E11\]\b/g, r: "bg-[#0B0E11]" } // baseline
];

function processDir(directory: string) {
  const files = fs.readdirSync(directory);
  for (const file of files) {
    const fullPath = path.join(directory, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let original = content;
      for (const { p, r } of regexes) {
        content = content.replace(p, r);
      }
      if (content !== original) {
        fs.writeFileSync(fullPath, content);
        console.log(`Updated ${fullPath}`);
      }
    }
  }
}

processDir(dir);
