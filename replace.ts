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

    // Replace text-blue-600 with text-blue-400
    if (content.includes('text-blue-600')) {
      content = content.replace(/text-blue-600/g, 'text-blue-400');
      changed = true;
    }
    // Replace text-red-500 with text-red-400
    if (content.includes('text-red-500')) {
      content = content.replace(/text-red-500/g, 'text-red-400');
      changed = true;
    }
    // Replace accent-green with text-blue-400
    if (content.includes('accent-green')) {
      content = content.replace(/accent-green/g, 'text-blue-400');
      changed = true;
    }
    // Replace accent-red with text-red-400
    if (content.includes('accent-red')) {
      content = content.replace(/accent-red/g, 'text-red-400');
      changed = true;
    }

    if (changed) {
      fs.writeFileSync(filePath, content, 'utf-8');
      console.log('Updated', filePath);
    }
  }
});
