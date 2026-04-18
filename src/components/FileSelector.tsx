import React, { useState } from 'react';
import { Terminal, Code, Zap, Shield, Search, Terminal as TerminalIcon } from 'lucide-react';
import { motion } from 'motion/react';
import { ContractFile } from '../types';

interface FileSelectorProps {
  onCodeSubmitted: (files: ContractFile[]) => void;
}

export function FileSelector({ onCodeSubmitted }: FileSelectorProps) {
  const [code, setCode] = useState('');
  const [isTerminal, setIsTerminal] = useState(false);

  const handleSubmit = () => {
    if (!code.trim()) return;
    
    onCodeSubmitted([{
      name: 'input_contract.sol',
      content: code
    }]);
  };

  return (
    <div className="flex flex-col gap-8 py-10">
      <div className="flex justify-center gap-4 mb-4">
        <button 
          onClick={() => setIsTerminal(false)}
          className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${!isTerminal ? 'bg-cyber-blue text-black' : 'bg-white/5 text-text-dim hover:bg-white/10'}`}
        >
          <Code className="w-4 h-4" />
          Code Editor
        </button>
        <button 
          onClick={() => setIsTerminal(true)}
          className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${isTerminal ? 'bg-cyber-purple text-white shadow-[0_0_20px_rgba(188,19,254,0.3)]' : 'bg-white/5 text-text-dim hover:bg-white/10'}`}
        >
          <TerminalIcon className="w-4 h-4" />
          Neural Terminal
        </button>
      </div>

      <motion.div 
        key={isTerminal ? 'terminal' : 'editor'}
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`glass-card p-1 border-white/10 relative group transition-all duration-700 ${isTerminal ? 'bg-black shadow-[0_40px_100px_-20px_rgba(0,0,0,0.8)]' : 'bg-white/[0.01]'}`}
      >
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-cyber-blue to-transparent opacity-30 group-hover:opacity-100 transition-opacity" />
        
        <div className="p-6 flex flex-col gap-6">
           <div className="flex items-center justify-between mb-2">
              <div className="flex gap-1.5">
                 <div className="w-2.5 h-2.5 rounded-full bg-red-500/40" />
                 <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/40" />
                 <div className="w-2.5 h-2.5 rounded-full bg-green-500/40" />
              </div>
              <span className="text-[9px] font-mono text-text-dim/40 uppercase tracking-[0.3em]">
                {isTerminal ? 'Audit-OS v4.2.0 // Terminal' : 'Secure-Editor // v1.0'}
              </span>
           </div>

           <div className="relative">
              <textarea 
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder={isTerminal ? "> _ Paste bytecode or source here for high-fidelity scanning..." : "// Paste your smart contract source code here for neural analysis..."}
                className={`w-full min-h-[400px] bg-black/40 border border-white/5 rounded-2xl p-8 text-sm focus:border-cyber-blue outline-none transition-all scrollbar-hide font-mono resize-none ${isTerminal ? 'text-cyber-blue placeholder:text-cyber-blue/20' : 'text-blue-100/60 placeholder:text-text-dim/20'}`}
              />
              {isTerminal && (
                <div className="absolute top-8 left-8 pointer-events-none opacity-20 text-cyber-blue animate-pulse">
                   {!code && <span>_</span>}
                </div>
              )}
           </div>

           <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-4">
              <div className="flex gap-6">
                 <div className="flex items-center gap-2">
                    <Shield className="w-3 h-3 text-cyber-blue" />
                    <span className="text-[8px] font-black uppercase tracking-widest text-text-dim">Static Analysis Ready</span>
                 </div>
                 <div className="flex items-center gap-2">
                    <Search className="w-3 h-3 text-cyber-purple" />
                    <span className="text-[8px] font-black uppercase tracking-widest text-text-dim">Logic Verification Enabled</span>
                 </div>
              </div>

              <button 
                onClick={handleSubmit}
                disabled={!code.trim()}
                className="w-full md:w-auto px-12 py-5 bg-white text-black text-[11px] font-black uppercase tracking-[0.3em] rounded-2xl hover:bg-cyber-blue hover:shadow-[0_0_30px_rgba(0,229,255,0.4)] transition-all disabled:opacity-20 flex items-center justify-center gap-3 active:scale-95 shadow-2xl shadow-white/5"
              >
                <Zap className="w-4 h-4 fill-current" />
                Initialize Neural Scan
              </button>
           </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
        {[
          { icon: Shield, title: 'Zero-Knowledge Privacy', desc: 'Secure local processing. No proprietary code persists beyond the neural scan session.' },
          { icon: Code, title: 'Multi-Chain Support', desc: 'Native support for EVM Solidity, Solana Rust/Anchor, and CosmWasm protocols.' },
          { icon: TerminalIcon, title: 'Neural Hardening', desc: 'AI-driven suggestions to harden state transitions and prevent edge-case logic failures.' }
        ].map((item, idx) => (
          <div key={idx} className="glass-card p-6 border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-all group">
             <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center mb-4 group-hover:bg-cyber-blue/10 transition-colors">
                <item.icon className="w-5 h-5 text-text-dim group-hover:text-cyber-blue transition-colors" />
             </div>
             <h4 className="text-[10px] font-black uppercase text-white tracking-widest mb-2">{item.title}</h4>
             <p className="text-[9px] text-text-dim leading-relaxed uppercase tracking-tight opacity-40">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
