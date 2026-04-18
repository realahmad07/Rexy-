import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, Send, X, Loader2, Bot, User } from 'lucide-react';
import { chatWithRexy, ContractAudit } from '../services/geminiService';

interface Props {
  code: string;
  audit: ContractAudit | null;
}

export const SecurityChat = ({ code, audit }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'model'; text: string }[]>([
    { role: 'model', text: "Neural Security Link established. I am Rexy. How can I assist with your protocol verification today?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg = input;
    setInput("");
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    try {
      const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));
      
      const response = await chatWithRexy(userMsg, { code, audit }, history);
      setMessages(prev => [...prev, { role: 'model', text: response || "Verification inconclusive. Re-linking neural core..." }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'model', text: "Error: Could not reach Security Oracle." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Trigger Button */}
      <button 
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-8 right-8 w-16 h-16 rounded-full bg-linear-to-br from-cyber-blue to-cyber-purple flex items-center justify-center shadow-2xl z-50 hover:scale-110 transition-transform active:scale-95 group ${isOpen ? 'hidden' : 'flex'}`}
      >
        <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 rounded-full transition-opacity" />
        <MessageSquare className="w-7 h-7 text-white" />
        {audit && audit.vulnerabilities.length > 0 && (
           <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full border-2 border-black flex items-center justify-center text-[10px] font-black">
              {audit.vulnerabilities.length}
           </div>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 100 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 100 }}
            className="fixed bottom-8 right-8 w-[400px] h-[600px] bg-dark-bg border border-white/10 rounded-[2.5rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.8)] z-50 flex flex-col overflow-hidden glass-card p-0"
          >
             <div className="p-6 border-b border-white/5 bg-white/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-xl bg-cyber-blue/20 flex items-center justify-center">
                      <Bot className="w-6 h-6 text-cyber-blue" />
                   </div>
                   <div>
                      <h4 className="text-sm font-display font-black text-white uppercase tracking-tight">Rexy Neural Core</h4>
                      <p className="text-[10px] font-black text-cyber-blue uppercase tracking-widest flex items-center gap-1.5">
                         <span className="w-1.5 h-1.5 bg-cyber-blue rounded-full animate-pulse" />
                         Active Security Session
                      </p>
                   </div>
                </div>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-white/5 rounded-full transition-colors"
                >
                   <X className="w-5 h-5 text-text-dim" />
                </button>
             </div>

             <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
                {messages.map((m, i) => (
                   <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[85%] p-5 rounded-3xl text-sm leading-relaxed ${
                        m.role === 'user' 
                        ? 'bg-cyber-blue text-black font-medium rounded-tr-none' 
                        : 'bg-white/5 text-slate-300 border border-white/5 rounded-tl-none'
                      }`}>
                         <p>{m.text}</p>
                      </div>
                   </div>
                ))}
                {loading && (
                   <div className="flex justify-start">
                      <div className="bg-white/5 p-5 rounded-3xl rounded-tl-none border border-white/5">
                         <Loader2 className="w-5 h-5 text-cyber-blue animate-spin" />
                      </div>
                   </div>
                )}
             </div>

             <div className="p-6 border-t border-white/5 bg-black/40">
                <div className="relative">
                   <input 
                     type="text"
                     value={input}
                     onChange={(e) => setInput(e.target.value)}
                     onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                     placeholder="Inquire about logic..."
                     className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-cyber-blue/50 transition-all pr-14"
                   />
                   <button 
                     onClick={handleSend}
                     disabled={loading || !input.trim()}
                     className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-cyber-blue text-black rounded-lg disabled:opacity-50 transition-all active:scale-90"
                   >
                      <Send className="w-4 h-4" />
                   </button>
                </div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
