import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Minus } from 'lucide-react';

const FAQ_DATA = [
  {
    id: 1,
    question: 'How live is the data on Finova?',
    englishTitle: 'How live is the data on Finova?',
    answer: 'Our platform connects directly through Binance API and major global WebSockets. This means you get real-time price updates and fresh news feeds in milliseconds without needing a page refresh.'
  },
  {
    id: 2,
    question: 'Can I securely upload my private trading notes?',
    englishTitle: 'Can I securely upload my private trading notes?',
    answer: 'Yes, the data in your "Private Reports" section remains completely restricted to your device (local browser). We do not store any of your documents, images, or private data on our servers.'
  },
  {
    id: 3,
    question: 'Is this platform completely free to use?',
    englishTitle: 'Is this platform completely free to use?',
    answer: 'Absolutely! Finovas main goal is to provide traders with excellent analytics and fast market tracking tools with zero interruptions, ads, or hidden premium fees.'
  },
  {
    id: 4,
    question: 'Does this platform work on mobile devices?',
    englishTitle: 'Does this platform work on mobile devices?',
    answer: 'Yes, Finovas "Artistic Flair" design is fully responsive. You can easily use it on your desktop, laptop, tablet, or smartphone. It automatically adjusts according to screen size.'
  }
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleOpen = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="flex flex-col gap-6">
      <div className="flex justify-between items-end border-b border-[#2A2E39] pb-2">
        <h3 className="text-[11px] font-black uppercase tracking-widest text-white">
          Frequently Asked Questions (FAQ)
        </h3>
      </div>
      
      <div className="flex flex-col">
        {FAQ_DATA.map((faq, index) => {
          const isOpen = openIndex === index;
          
          return (
            <div 
              key={faq.id} 
              className="border-b border-[#2A2E39] last:border-0"
            >
              <button
                onClick={() => toggleOpen(index)}
                className="w-full py-5 flex items-center justify-between text-left group hover:bg-[#2A2E39] transition-colors px-4 -mx-4 rounded"
              >
                <div className="flex flex-col gap-1 pr-8">
                  <h4 className="font-bold text-sm md:text-base text-white group-hover:text-orange-400 transition-colors">
                    {faq.question}
                  </h4>
                  <span className="text-[10px] font-mono opacity-40 uppercase tracking-wide">
                    {faq.englishTitle}
                  </span>
                </div>
                <div className="shrink-0 w-8 h-8 rounded-full border border-[#2A2E39] flex items-center justify-center bg-[#1E222D] group-hover:border-orange-500/50 group-hover:bg-orange-500/10 transition-all text-[#787B86] group-hover:text-orange-500">
                  {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                </div>
              </button>
              
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="pb-6 pt-2 pl-4 pr-12 text-sm text-[#787B86] leading-relaxed font-sans border-l-2 border-orange-500/50 ml-4 mb-4">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
}
