import { useState, useRef } from 'react';
import { Shield, Upload, Send, MessageSquare, AlertTriangle, CheckCircle2, Image as ImageIcon, HeartHandshake, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const GUIDELINES = [
  { id: 1, title: 'Be Respectful', icon: HeartHandshake, desc: 'Treat everyone with respect. Harassment, hate speech, or personal attacks are strictly forbidden.' },
  { id: 2, title: 'No Spam or Scams', icon: AlertTriangle, desc: 'Do not post unsolicited promotional content, phishing links, or try to sell services.' },
  { id: 3, title: 'Protect Your Privacy', icon: Shield, desc: 'Never share your private keys, seed phrases, or sensitive personal information.' },
  { id: 4, title: 'Stay on Topic', icon: MessageSquare, desc: 'Keep discussions relevant to cryptocurrency, markets, and the platform features.' },
];

export function SupportAndCommunity() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setSelectedImages([]);
      // normally we would reset the form fields here too
    }, 4000);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFiles(Array.from(e.target.files));
    }
  };

  const handleFiles = (files: File[]) => {
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    setSelectedImages(prev => [...prev, ...imageFiles]);
  };

  const removeImage = (indexToRemove: number) => {
    setSelectedImages(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center">
          <Shield className="w-4 h-4" />
        </div>
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            Support & Community
          </h2>
          <p className="text-[11px] text-slate-500 uppercase tracking-widest font-mono">
            Get Help & Read Guidelines
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Community Guidelines */}
        <div className="flex flex-col gap-4">
          <div className="p-6 bg-slate-50 border border-slate-100 rounded-2xl h-full">
            <h3 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
              <HeartHandshake className="w-5 h-5 text-blue-400" />
              Community Guidelines
            </h3>
            <p className="text-sm text-slate-500 mb-6">
              To ensure a safe and welcoming environment for everyone in our network, we ask all members to strictly adhere to the following rules.
            </p>
            
            <div className="flex flex-col gap-4">
              {GUIDELINES.map((rule) => {
                const Icon = rule.icon;
                return (
                  <div key={rule.id} className="flex gap-4 p-4 rounded-xl bg-white border border-slate-100 hover:border-slate-200 transition-colors">
                    <div className="mt-1">
                      <div className="w-8 h-8 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                        <Icon className="w-4 h-4" />
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 mb-1">{rule.title}</h4>
                      <p className="text-xs text-slate-500 leading-relaxed font-sans">{rule.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Support Form */}
        <div className="flex flex-col gap-4">
          <form onSubmit={handleSubmit} className="p-6 bg-gradient-to-br from-[#0B0E11] to-blue-900/10 border border-slate-200 hover:border-blue-500/30 transition-colors rounded-2xl flex flex-col relative overflow-hidden h-full">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 blur-3xl rounded-full pointer-events-none"></div>
            
            <div className="relative z-10">
              <h3 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-blue-400" />
                Contact Support
              </h3>
              <p className="text-sm text-slate-500 mb-6">
                Need help with your account or encountered a bug? Send us a message and our team will get back to you shortly.
              </p>

              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Name</label>
                    <input required type="text" placeholder="John Doe" className="bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-900 focus:border-blue-500 focus:outline-none transition-colors" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Email</label>
                    <input required type="email" placeholder="john@example.com" className="bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-900 focus:border-blue-500 focus:outline-none transition-colors" />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Issue Type</label>
                  <select className="bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-900 focus:border-blue-500 focus:outline-none transition-colors appearance-none">
                    <option value="general">General Inquiry</option>
                    <option value="technical">Technical Support</option>
                    <option value="billing">Billing Issue</option>
                    <option value="report">Report a User</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Message</label>
                  <textarea required rows={4} placeholder="Describe your issue in detail..." className="bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-900 focus:border-blue-500 focus:outline-none transition-colors resize-none"></textarea>
                </div>

                {/* Image Upload Area */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                    <ImageIcon className="w-3.5 h-3.5" /> Attachments (Optional)
                  </label>
                  
                  <div 
                    className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-colors ${dragActive ? 'border-blue-500 bg-blue-500/5' : 'border-slate-200 bg-slate-50 hover:border-slate-300'}`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <input 
                      ref={fileInputRef}
                      type="file" 
                      accept="image/*" 
                      multiple 
                      className="hidden" 
                      onChange={handleChange}
                    />
                    <Upload className="w-6 h-6 text-slate-900/40 mx-auto mb-2" />
                    <p className="text-xs text-slate-500">Click to upload or drag and drop images here</p>
                    <p className="text-[10px] text-slate-900/40 mt-1 font-mono">PNG, JPG up to 5MB</p>
                  </div>
                  
                  {/* Image Preview List */}
                  {selectedImages.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {selectedImages.map((file, i) => (
                        <div key={i} className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-md py-1 px-2 pr-1">
                          <ImageIcon className="w-3 h-3 text-blue-400" />
                          <span className="text-[10px] text-slate-500 max-w-[100px] truncate">{file.name}</span>
                          <button 
                            type="button" 
                            onClick={(e) => { e.stopPropagation(); removeImage(i); }}
                            className="p-1 hover:bg-slate-100 rounded text-slate-900/40 hover:text-red-400 transition-colors"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                </div>

                <div className="mt-2">
                  <button 
                    type="submit" 
                    disabled={isSubmitted}
                    className={`w-full py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                      isSubmitted 
                        ? 'bg-green-500/20 text-green-400 border border-green-500/50'
                        : 'bg-blue-500 hover:bg-blue-600 text-slate-900'
                    }`}
                  >
                    {isSubmitted ? (
                      <><CheckCircle2 className="w-4 h-4" /> Message Sent Successfully!</>
                    ) : (
                      <><Send className="w-4 h-4" /> Send Message</>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}
