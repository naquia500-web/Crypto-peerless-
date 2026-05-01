import { useState, useRef, ChangeEvent } from 'react';
import { UploadCloud, FileText, Image as ImageIcon, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface UploadItem {
  id: string;
  name: string;
  type: 'image' | 'text';
  content: string; // URL for image, actual text for text files
  date: string;
}

export function UserReports() {
  const [uploads, setUploads] = useState<UploadItem[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const isImage = file.type.startsWith('image/');
      const isText = file.type === 'text/plain' || file.name.endsWith('.md') || file.name.endsWith('.csv');

      if (!isImage && !isText) continue;

      const reader = new FileReader();
      
      reader.onload = (event) => {
        const newUpload: UploadItem = {
          id: Math.random().toString(36).substr(2, 9),
          name: file.name,
          type: isImage ? 'image' : 'text',
          content: event.target?.result as string,
          date: new Date().toLocaleDateString(),
        };
        setUploads(prev => [newUpload, ...prev]);
      };

      if (isImage) {
        reader.readAsDataURL(file);
      } else {
        reader.readAsText(file);
      }
    }
    
    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeUpload = (id: string) => {
    setUploads(prev => prev.filter(u => u.id !== id));
  };

  return (
    <div className="bg-white shadow-lg border border-slate-200 p-6 rounded-xl flex flex-col h-full">
      <div className="flex flex-col gap-1 mb-4 border-b border-slate-200 pb-4">
        <span className="text-[10px] font-bold opacity-40 uppercase tracking-widest">Quick Submit</span>
        <div className="flex justify-between items-center">
          <h4 className="text-sm font-bold uppercase">Field Report</h4>
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="text-[9px] font-bold uppercase tracking-widest flex items-center gap-1.5 opacity-50 hover:opacity-100 hover:text-orange-500 transition-all"
          >
            <UploadCloud className="w-3 h-3" />
            Upload
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileUpload} 
            className="hidden" 
            accept="image/*,.txt,.md,.csv"
            multiple
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4">
        {uploads.length === 0 ? (
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-slate-200 rounded-lg p-8 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-slate-100 transition-colors h-full"
          >
            <UploadCloud className="w-6 h-6 opacity-30" />
            <span className="text-[10px] opacity-40 uppercase font-bold text-center mt-2">Upload Intel<br/>(Image or Text)</span>
          </div>
        ) : (
          <AnimatePresence>
            {uploads.map((item) => (
              <motion.div 
                key={item.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-slate-50 border border-slate-200 rounded-lg p-4 group relative"
              >
                <div className="flex items-start justify-between mb-2">
                  <span className="text-[10px] font-bold uppercase opacity-50 block truncate max-w-[70%]">User Report: {item.name}</span>
                  <span className="text-[9px] font-mono opacity-30 whitespace-nowrap">{item.date}</span>
                </div>
                <div className="mt-2">
                  {item.type === 'image' ? (
                    <img src={item.content} alt={item.name} className="max-h-32 rounded border border-slate-200 object-cover w-full" />
                  ) : (
                    <p className="text-xs leading-relaxed italic text-slate-500">
                      "{item.content.substring(0, 150)}{item.content.length > 150 ? '...' : ''}"
                    </p>
                  )}
                </div>
                <button 
                  onClick={() => removeUpload(item.id)}
                  className="absolute top-2 right-2 p-1.5 text-slate-500 hover:text-red-400 rounded-md opacity-0 group-hover:opacity-100 transition-all"
                >
                  <X className="w-3 h-3" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
