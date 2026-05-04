import * as fs from 'fs';
import * as path from 'path';

function walkDir(dir: string, callback: (path: string) => void) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(dirPath);
  });
}

const dirToWalk = path.join(process.cwd(), 'src');

walkDir(dirToWalk, (filePath) => {
  if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
    let content = fs.readFileSync(filePath, 'utf-8');
    let changed = false;

    // specific replacement for AssetYield.tsx and AssetMarkets.tsx
    if (content.includes('bg-green-50')) {
      content = content.replace(/text-green-[67]00\s+bg-green-50\s+border-green-[23]00/g, 'text-green-400 bg-green-500/10 border-green-500/20');
      content = content.replace(/text-green-600 bg-green-50/g, 'text-green-400 bg-green-500/10');
      changed = true;
    }
    if (content.includes('bg-red-50')) {
      content = content.replace(/text-red-[67]00\s+bg-red-50\s+border-red-[23]00/g, 'text-red-400 bg-red-500/10 border-red-500/20');
      content = content.replace(/text-red-600 bg-red-50/g, 'text-red-400 bg-red-500/10');
      changed = true;
    }
    if (content.includes('bg-blue-50')) {
      content = content.replace(/text-blue-400\s+bg-blue-50/g, 'text-blue-400 bg-blue-500/10');
      changed = true;
    }
    
    // Replacing remaining text-green-600
    if (content.includes('text-green-600')) {
      content = content.replace(/text-green-600/g, 'text-green-400');
      changed = true;
    }

    if (content.includes('text-red-600')) {
      content = content.replace(/text-red-600/g, 'text-red-400');
      changed = true;
    }

    if (changed) {
      fs.writeFileSync(filePath, content, 'utf-8');
      console.log('Updated', filePath);
    }
  }
});
