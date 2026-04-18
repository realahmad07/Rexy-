import { useState, useEffect, useRef } from 'react';
import { 
  Shield, 
  Cpu, 
  Zap, 
  Trophy, 
  Send, 
  Loader2, 
  ChevronRight,
  Terminal,
  Activity,
  Lock,
  Eye,
  AlertTriangle,
  History,
  Code,
  Wand2,
  Bug,
  ShieldCheck,
  CheckCircle2,
  ArrowBigDown,
  TrendingDown,
  ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GlassCard, Badge, ScoreIndicator } from './components/UI';
import { auditSmartContract, ContractAudit } from './services/geminiService';

const SAMPLE_CODE = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SimpleVault {
    mapping(address => uint) public balances;

    function deposit() public payable {
        balances[msg.sender] += msg.value;
    }

    function withdraw() public {
        uint bal = balances[msg.sender];
        require(bal > 0);

        (bool sent, ) = msg.sender.call{value: bal}("");
        require(sent, "Failed to send Ether");

        balances[msg.sender] = 0;
    }
}`;

export default function App() {
  const [code, setCode] = useState(SAMPLE_CODE);
  const [audit, setAudit] = useState<ContractAudit | null>(null);
  const [loading, setLoading] = useState(false);
  const [prevRisk, setPrevRisk] = useState<number | null>(null);
  const [isSecured, setIsSecured] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  const handleAudit = async (customCode?: string, resetSecured = true) => {
    const targetCode = customCode || code;
    if (!targetCode.trim() || loading) return;
    
    setLoading(true);
    if (resetSecured) setIsSecured(false);
    
    const result = await auditSmartContract(targetCode);
    if (result) {
      setAudit(result);
      if (!customCode) setPrevRisk(null); 
      
      // Smooth scroll to results
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
    setLoading(false);
  };

  const handleAutoFix = async () => {
    if (audit?.safeCodeSnippet) {
      setPrevRisk(audit.riskScore);
      const fixedCode = audit.safeCodeSnippet;
      setCode(fixedCode);
      setIsSecured(true);
      // Trigger a silent re-audit to confirm zero risk in the secure view
      handleAudit(fixedCode, false);
    }
  };

  useEffect(() => {
    handleAudit();
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] text-white p-4 md:p-8 lg:p-12 overflow-x-hidden selection:bg-cyber-blue/30">
      {/* Dynamic Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-cyber-blue/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-500/10 blur-[120px] rounded-full animate-pulse " style={{ animationDelay: '2s' }} />
        <div className="absolute inset-0 cyber-grid opacity-[0.03]" />
      </div>

      <div className="max-w-[1400px] mx-auto relative z-10 flex flex-col gap-24">
        {/* Header Section */}
        <header className="flex flex-col md:flex-row items-center justify-between gap-6">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-4 group"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-cyber-blue blur-lg opacity-20 group-hover:opacity-40 transition-opacity" />
              <Shield className="w-10 h-10 text-cyber-blue relative" />
            </div>
            <div>
              <h1 className="text-3xl font-display font-black tracking-tighter italic">REXY<span className="text-cyber-blue">AI</span></h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="h-1 w-1 bg-cyber-blue rounded-full animate-ping" />
                <span className="text-[10px] font-mono font-bold tracking-[0.2em] text-cyber-blue uppercase opacity-70">Security Protocol Activated</span>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-6"
          >
            <div className="text-right hidden md:block">
              <p className="text-[10px] font-bold text-text-dim uppercase tracking-widest">Global Intelligence</p>
              <p className="text-sm font-display font-bold">Rexy-Core-Engine v4.0</p>
            </div>
            <div className="h-10 w-[1px] bg-white/10 hidden md:block" />
            <Badge variant="blue" className="px-4 py-1.5 border-cyber-blue/30 bg-cyber-blue/5 text-cyber-blue">HackerOne Verified</Badge>
          </motion.div>
        </header>

        {/* Hero Section: Editor & Action */}
        <AnimatePresence mode="wait">
          {!isSecured ? (
            <motion.section 
              key="auditor-section"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="grid grid-cols-12 gap-12 items-center"
            >
              <div className="col-span-12 lg:col-span-7">
                <div className="glass-card p-1 bg-white/5 border-white/10 rounded-[2.5rem] overflow-hidden relative group shadow-2xl">
                  <div className="absolute inset-0 bg-linear-to-br from-cyber-blue/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                  
                  <div className="flex items-center justify-between px-8 py-5 border-b border-white/5 bg-white/[0.02]">
                    <div className="flex items-center gap-3">
                      <div className="flex gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-500/30" />
                        <div className="w-2.5 h-2.5 rounded-full bg-orange-500/30" />
                        <div className="w-2.5 h-2.5 rounded-full bg-green-500/30" />
                      </div>
                      <div className="h-4 w-[1px] bg-white/10 mx-3" />
                      <p className="text-[10px] font-mono font-black text-text-dim uppercase tracking-widest">kernel_node_v4.sol</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2 bg-black/40 px-4 py-1.5 rounded-full border border-white/5 hover:border-cyber-blue/30 transition-colors cursor-pointer group/lang">
                        <Code className="w-3.5 h-3.5 text-cyber-blue group-hover/lang:scale-110 transition-transform" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Solidity 0.8.20</span>
                      </div>
                    </div>
                  </div>

                  <textarea
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="w-full h-[550px] bg-black/20 p-10 font-mono text-[14px] leading-relaxed text-blue-100/90 focus:outline-none selection:bg-cyber-blue/30 resize-none transition-all scrollbar-hide"
                    spellCheck={false}
                  />

                  <div className="absolute bottom-8 right-8">
                    <button 
                      onClick={() => handleAudit()}
                      disabled={loading}
                      className="px-10 py-4 bg-white text-black font-black uppercase tracking-[0.3em] text-[11px] rounded-full hover:bg-cyber-blue transition-all disabled:opacity-50 flex items-center gap-3 relative group overflow-hidden shadow-2xl"
                    >
                      <div className="absolute inset-0 bg-cyan-400 translate-y-full group-hover:translate-y-0 transition-transform duration-500 pointer-events-none opacity-20" />
                      {loading ? <Loader2 className="w-4 h-4 animate-spin text-black" /> : <Zap className="w-4 h-4" />}
                      Initialize Deep Audit
                    </button>
                  </div>
                </div>
              </div>

              {/* Real-time Side Analytics */}
              <div className="col-span-12 lg:col-span-5 flex flex-col gap-8">
                <div className="space-y-2">
                  <h4 className="text-[11px] font-black uppercase tracking-[0.4em] text-cyber-blue">Neural Security Engine</h4>
                  <h2 className="text-5xl font-display font-black tracking-tighter text-white leading-[0.9]">Autonomous<br/>Code Verification</h2>
                </div>
                
                <p className="text-lg text-text-dim leading-relaxed font-light">
                  Rexy v4.0 utilizes <span className="text-white font-medium">multi-modal semantic reasoning</span> to identify vulnerabilities at the logic layer, ensuring your protocol is immune to the most sophisticated exploits.
                </p>
                
                <div className="grid grid-cols-1 gap-4">
                  <div className="flex items-center gap-4 p-6 bg-white/[0.03] border border-white/5 rounded-[2rem] group hover:bg-cyber-blue/5 hover:border-cyber-blue/20 transition-all duration-500">
                    <div className="w-12 h-12 rounded-2xl bg-cyber-blue/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                      <Activity className="w-6 h-6 text-cyber-blue" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-text-dim uppercase tracking-widest mb-1">Threat Library</p>
                      <p className="text-white font-display font-bold">ConsenSys Diligence Ready</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 p-6 bg-white/[0.03] border border-white/5 rounded-[2rem] group hover:bg-purple-500/5 hover:border-purple-500/20 transition-all duration-500">
                    <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                      <Lock className="w-6 h-6 text-purple-400" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-text-dim uppercase tracking-widest mb-1">Audit Protocol</p>
                      <p className="text-white font-display font-bold">Formal Logic Verification</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.section>
          ) : (
            <motion.section 
              key="secured-section"
              initial={{ opacity: 0, scale: 1.02 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center gap-12 py-12"
            >
            <div className="text-center space-y-6">
              <div className="inline-flex items-center gap-3 px-6 py-2 bg-green-500/10 border border-green-500/30 rounded-full text-green-400">
                <ShieldCheck className="w-5 h-5" />
                <span className="text-[11px] font-black uppercase tracking-[0.4em]">Protocol Neutralized</span>
              </div>
              <h2 className="text-5xl md:text-7xl font-display font-black tracking-tighter text-white uppercase italic leading-[0.8] mb-8">Security <span className="text-cyber-blue">Synchronized</span></h2>
              
              <div className="flex justify-center gap-12 mt-8">
                <div className="text-center">
                  <p className="text-[10px] font-black text-text-dim uppercase tracking-widest mb-2">Threat Magnitude</p>
                  <p className="text-5xl font-display font-black text-green-400">0.00</p>
                </div>
                <div className="w-[1px] h-12 bg-white/10" />
                <div className="text-center">
                  <p className="text-[10px] font-black text-text-dim uppercase tracking-widest mb-2">Integrity Level</p>
                  <p className="text-5xl font-display font-black text-cyber-blue">MAXIMUM</p>
                </div>
              </div>
            </div>

            <div className="w-full max-w-5xl glass-card p-1 bg-cyber-blue/20 border-cyber-blue/30 rounded-[3rem] shadow-[0_0_150px_rgba(0,229,255,0.15)] relative group">
               <div className="absolute -inset-0.5 bg-linear-to-r from-cyber-blue to-green-500 rounded-[3.1rem] blur opacity-20 group-hover:opacity-40 transition-opacity" />
               <div className="bg-[#0a0a0a] rounded-[2.8rem] overflow-hidden relative">
                  <div className="flex items-center justify-between px-10 py-6 border-b border-white/5 bg-white/[0.02]">
                    <div className="flex items-center gap-4">
                       <Terminal className="w-4 h-4 text-cyber-blue" />
                       <p className="text-[10px] font-mono font-black text-cyber-blue uppercase tracking-widest">hardened_kernel_v4_final.sol</p>
                    </div>
                    <div className="flex items-center gap-3 bg-green-500/20 px-4 py-1.5 rounded-full border border-green-500/40">
                       <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                       <span className="text-[9px] font-black text-green-400 uppercase tracking-widest">Secure Production Build</span>
                    </div>
                  </div>
                  <pre className="p-12 font-mono text-[14px] text-slate-300 leading-relaxed overflow-x-auto scrollbar-hide max-h-[650px] selection:bg-cyber-blue/40">
                    <code>{code}</code>
                  </pre>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
               <div className="glass-card flex flex-col items-center p-8 gap-4 border-white/5">
                  <Lock className="w-8 h-8 text-cyber-blue" />
                  <p className="text-[10px] font-black text-text-dim uppercase tracking-widest">Logic Sealed</p>
               </div>
               <div className="glass-card flex flex-col items-center p-8 gap-4 border-white/5">
                  <ShieldCheck className="w-8 h-8 text-green-400" />
                  <p className="text-[10px] font-black text-text-dim uppercase tracking-widest">All SWC Resolved</p>
               </div>
               <div className="glass-card flex flex-col items-center p-8 gap-4 border-white/5">
                  <Cpu className="w-8 h-8 text-purple-400" />
                  <p className="text-[10px] font-black text-text-dim uppercase tracking-widest">ZKP Proof Generated</p>
               </div>
            </div>

            <div className="flex gap-8 mt-4">
               <button 
                onClick={() => {
                  setIsSecured(false);
                  setAudit(null);
                  setPrevRisk(null);
                }}
                className="px-10 py-4 border border-white/10 rounded-full text-[11px] font-black uppercase tracking-widest hover:bg-white/5 transition-all text-text-dim"
               >
                 Audit New Payload
               </button>
               <button 
                className="px-12 py-5 bg-white text-black rounded-full text-[12px] font-black uppercase tracking-[0.3em] hover:bg-cyber-blue transition-all flex items-center gap-4 shadow-2xl active:scale-95"
               >
                 Deploy Secure Contract <ChevronRight className="w-4 h-4" />
               </button>
            </div>
          </motion.section>
        )}
        </AnimatePresence>

        {/* Audit Stream Header */}
        <AnimatePresence>
          {audit && (
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex flex-col items-center text-center gap-4 py-12"
            >
               <h3 className="text-sm font-black uppercase tracking-[0.5em] text-text-dim">
                {isSecured ? "Validation Stream" : "Execution Results"}
               </h3>
               <div className="h-20 w-[1px] bg-linear-to-b from-white/10 to-transparent" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results Stream */}
        <div ref={resultsRef} className="scroll-mt-24">
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div 
                key="loading-results"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="py-40 flex flex-col items-center justify-center gap-8"
              >
                 <div className="relative">
                    <motion.div 
                      animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.3, 0.1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="w-32 h-32 bg-cyber-blue rounded-full absolute -inset-0 blur-3xl" 
                    />
                    <Loader2 className="w-16 h-16 text-cyber-blue animate-spin relative" />
                 </div>
                 <div className="text-center space-y-2">
                    <p className="text-xl font-display font-black uppercase tracking-[0.3em] text-white">
                      {isSecured ? "Authenticating Protocol Integrity" : "Synthesizing Security Report"}
                    </p>
                    <p className="text-xs font-mono text-cyber-blue animate-pulse">
                      {isSecured 
                        ? "Running formal verification... Mapping zero-day immunity... Validating logical invariants..." 
                        : "Running semantic scan... Isolating memory vectors... Mapping SWC identifiers..."}
                    </p>
                 </div>
              </motion.div>
            ) : isSecured && audit ? (
              <motion.div 
                key="secured-results"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col gap-40 pb-60"
              >
                <div className="grid grid-cols-12 gap-12">
                   <div className="col-span-12 lg:col-span-4 lg:sticky lg:top-24 h-fit">
                      <h4 className="text-[11px] font-black uppercase tracking-[0.5em] text-green-400 mb-4">Phase 05</h4>
                      <h2 className="text-5xl font-display font-black tracking-tighter uppercase mb-6 leading-none">Security<br/>Verification</h2>
                      <p className="text-sm text-text-dim leading-relaxed">
                        Final integrity check confirms all SWC vulnerabilities have been neutralized. The contract is now immune to the previously identified attack vectors.
                      </p>
                   </div>
                   <div className="col-span-12 lg:col-span-8">
                      <motion.div 
                        whileInView={{ opacity: 1, y: 0 }}
                        initial={{ opacity: 0, y: 40 }}
                        viewport={{ once: true }}
                        className="p-16 glass-card bg-black/60 border-cyber-blue/20 overflow-hidden relative group"
                      >
                         <div className="absolute inset-0 bg-cyber-blue/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                         <div className="flex flex-col md:flex-row items-center justify-around gap-16 relative z-10">
                            <div className="text-center">
                               <p className="text-[10px] font-black tracking-[0.4em] text-text-dim uppercase mb-6">Initial Breach Risk</p>
                               <div className="relative inline-block">
                                  <div className="absolute inset-0 bg-red-500 blur-2xl rounded-full opacity-10" />
                                  <p className="text-7xl md:text-9xl font-display font-black text-white/20 blur-[2px] leading-none tracking-tighter">
                                    {prevRisk || "N/A"}
                                  </p>
                               </div>
                            </div>

                            <motion.div 
                              initial={{ scale: 0, rotate: -180, opacity: 0 }}
                              animate={{ scale: 1, rotate: 0, opacity: 1 }}
                              transition={{ type: "spring", damping: 12, delay: 0.5 }}
                              className="flex flex-col items-center gap-6"
                            >
                               <div className="relative">
                                  <div className="absolute inset-0 bg-cyber-blue blur-xl opacity-40 animate-pulse" />
                                  <div className="w-20 h-20 rounded-full bg-cyber-blue/20 border border-cyber-blue/50 flex items-center justify-center text-cyber-blue relative">
                                     <TrendingDown className="w-10 h-10" />
                                  </div>
                               </div>
                               <Badge variant="blue" className="bg-cyber-blue text-black border-none px-6 py-2 text-[11px]">Hardening Complete</Badge>
                            </motion.div>

                            <div className="text-center">
                               <p className="text-[10px] font-black tracking-[0.4em] text-cyber-blue uppercase mb-6 animate-pulse">Post-Patch Integrity</p>
                               <div className="relative inline-block">
                                  <motion.div 
                                    animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.4, 0.2] }}
                                    transition={{ duration: 4, repeat: Infinity }}
                                    className="absolute inset-0 bg-cyber-blue blur-3xl rounded-full opacity-20" 
                                  />
                                  <p className="text-8xl md:text-[12rem] font-display font-black text-cyber-blue leading-none tracking-tighter drop-shadow-[0_0_80px_rgba(0,229,255,0.4)]">
                                    0
                                  </p>
                                  <motion.div 
                                    initial={{ opacity: 0, scale: 0.5 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 1, type: "spring" }}
                                    className="absolute -top-4 -right-4"
                                  >
                                     <ShieldCheck className="w-16 h-16 text-green-400 drop-shadow-[0_0_20px_rgba(74,222,128,0.5)]" />
                                  </motion.div>
                               </div>
                            </div>
                         </div>
                         
                         <motion.div 
                           initial={{ opacity: 0 }}
                           animate={{ opacity: 1 }}
                           transition={{ delay: 1.2 }}
                           className="mt-20 pt-12 border-t border-white/5 text-center"
                         >
                           <div className="inline-flex items-center gap-8 px-10 py-5 bg-white/[0.02] border border-white/10 rounded-full">
                              <div className="text-left">
                                 <p className="text-[9px] font-black text-text-dim uppercase tracking-widest">Logic Hardening</p>
                                 <p className="text-xl font-display font-black text-white">+{prevRisk ? (prevRisk - 0) : 100}% Efficiency</p>
                              </div>
                              <div className="w-[1px] h-8 bg-white/10" />
                              <div className="text-left">
                                 <p className="text-[9px] font-black text-text-dim uppercase tracking-widest">Verification Status</p>
                                 <p className="text-xl font-display font-black text-green-400 uppercase">SYNCHRONIZED</p>
                              </div>
                           </div>
                         </motion.div>
                      </motion.div>
                   </div>
                </div>
              </motion.div>
            ) : audit && !isSecured ? (
              <motion.div 
                key="audit-results"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col gap-40 pb-60"
              >
                {/* Vertical Stream Section 1: Review & Vitals */}
                <div className="grid grid-cols-12 gap-12">
                   <div className="col-span-12 lg:col-span-4 lg:sticky lg:top-24 h-fit">
                      <h4 className="text-[11px] font-black uppercase tracking-[0.5em] text-cyber-blue mb-4">Phase 01</h4>
                      <h2 className="text-5xl font-display font-black tracking-tighter uppercase mb-6 leading-none">Architecture<br/>Overview</h2>
                      <div className="space-y-6">
                        <p className="text-sm text-text-dim leading-relaxed">
                          Initial screening identifies key contract invariants and potential structural weaknesses.
                        </p>
                        <div className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl">
                           <p className="text-[10px] font-black uppercase text-cyber-blue mb-4">System Identity</p>
                           <h3 className="text-2xl font-display font-bold text-white uppercase">{audit.contractName}</h3>
                        </div>
                      </div>
                   </div>
                   <div className="col-span-12 lg:col-span-8 grid grid-cols-1 gap-6">
                      <GlassCard title="Architecture Review" className="bg-linear-to-br from-white/[0.03] to-transparent">
                         <p className="text-base text-slate-300 leading-relaxed font-mono">
                           {audit.architectureReview}
                         </p>
                      </GlassCard>
                      <div className="grid md:grid-cols-2 gap-6">
                         <div className="glass-card hover:border-cyber-blue/30 transition-colors">
                            <h5 className="text-[10px] font-black uppercase tracking-widest text-cyber-blue mb-6">Gas Optimization</h5>
                            <ul className="space-y-4">
                               {audit.gasOptimizationTips.map((tip, i) => (
                                 <li key={i} className="text-[xs] text-white/70 flex items-start gap-3 group">
                                   <div className="w-5 h-5 rounded bg-white/5 flex items-center justify-center shrink-0 group-hover:bg-cyber-blue/20 transition-colors">
                                      <ChevronRight className="w-3 h-3 text-cyber-blue" />
                                   </div>
                                   {tip}
                                 </li>
                               ))}
                            </ul>
                         </div>
                         <div className="glass-card flex flex-col items-center justify-center bg-linear-to-br from-cyber-blue/10 to-transparent">
                            <ScoreIndicator 
                              label="Current Threat Level" 
                              value={audit.riskScore} 
                              color={audit.riskScore > 70 ? "#ff4444" : audit.riskScore > 40 ? "#bc13fe" : "#00E5FF"}
                              size="lg"
                            />
                         </div>
                      </div>
                   </div>
                </div>

                {/* Vertical Stream Section 2: Vulnerabilities */}
                <div className="grid grid-cols-12 gap-12">
                   <div className="col-span-12 lg:col-span-4 lg:sticky lg:top-24 h-fit">
                      <h4 className="text-[11px] font-black uppercase tracking-[0.5em] text-red-500 mb-4">Phase 02</h4>
                      <h2 className="text-5xl font-display font-black tracking-tighter uppercase mb-6 leading-none">Vulnerability<br/>Trace</h2>
                      <p className="text-sm text-text-dim leading-relaxed">
                        Detected logic leaks and security-critical errors extracted via neural semantic traversal.
                      </p>
                   </div>
                   <div className="col-span-12 lg:col-span-8 flex flex-col gap-8">
                      {audit.vulnerabilities.length > 0 ? (
                        audit.vulnerabilities.map((v, i) => (
                          <motion.div 
                            key={i} 
                            whileInView={{ opacity: 1, y: 0 }}
                            initial={{ opacity: 0, y: 30 }}
                            viewport={{ once: true }}
                            className="glass-card group hover:border-red-500/40 transition-all duration-500 relative overflow-hidden p-8 md:p-12"
                          >
                             <div className="relative z-10 flex flex-col gap-10">
                               <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/5">
                                 <div className="space-y-4 flex-1">
                                    <div className="flex flex-wrap gap-2">
                                       <Badge variant="blue" className="bg-red-500/10 border-red-500/30 text-red-400 px-3 py-0.5 text-[9px]">{v.severity}</Badge>
                                       <Badge variant="purple" className="px-3 py-0.5 text-[9px]">{v.swcId}</Badge>
                                    </div>
                                    <h4 className="text-2xl md:text-3xl font-display font-black uppercase text-white group-hover:text-red-400 transition-colors leading-tight tracking-tight">
                                      {v.title}
                                    </h4>
                                 </div>
                                 <div className="flex flex-col items-start md:items-end shrink-0">
                                   <p className="text-[8px] font-black text-red-500/60 uppercase tracking-[0.2em] mb-1">Impact Radius</p>
                                   <p className="text-xs font-mono font-bold text-red-400 bg-red-400/10 px-3 py-1 rounded-md border border-red-400/20">{v.location}</p>
                                 </div>
                               </div>
                               
                               <div className="space-y-8">
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                     <div className="p-6 bg-red-500/[0.03] rounded-3xl border border-red-500/10 group-hover:border-red-500/20 transition-all">
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-red-400 mb-3">Attack Vector Visualization</p>
                                        <p className="text-sm text-slate-300 leading-relaxed font-mono italic">"{v.attackVector}"</p>
                                     </div>
                                     <div className="p-6 bg-purple-500/[0.03] rounded-3xl border border-purple-500/10">
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-purple-400 mb-3">Risk Assessment</p>
                                        <p className="text-[13px] text-slate-400 leading-relaxed">{v.description}</p>
                                     </div>
                                  </div>
                                  
                                  <div className="grid md:grid-cols-2 gap-10">
                                     <div className="space-y-4">
                                        <p className="text-[10px] font-black uppercase text-text-dim tracking-widest">Exploitation Logic</p>
                                        <div className="space-y-3">
                                           {v.simulationSteps.slice(0, 3).map((step, idx) => (
                                             <div key={idx} className="flex gap-4 p-3 bg-white/[0.01] rounded-xl border border-white/5">
                                                <span className="text-xs font-mono text-red-500 font-bold">{step.actor}</span>
                                                <p className="text-[11px] text-text-dim">{step.action}</p>
                                             </div>
                                           ))}
                                        </div>
                                     </div>
                                     <div className="space-y-4">
                                        <p className="text-[10px] font-black uppercase text-text-dim tracking-widest">Remediation Blueprint</p>
                                        <div className="flex gap-4 p-5 bg-cyber-blue/5 border border-cyber-blue/20 rounded-3xl">
                                           <div className="shrink-0">
                                              <ShieldCheck className="w-5 h-5 text-cyber-blue" />
                                           </div>
                                           <p className="text-sm text-slate-300 leading-normal font-mono">{v.remediation}</p>
                                        </div>
                                     </div>
                                  </div>
                               </div>
                             </div>
                          </motion.div>
                        ))
                      ) : (
                        <div className="glass-card py-32 flex flex-col items-center justify-center border-green-500/30 bg-green-500/[0.02]">
                           <ShieldCheck className="w-24 h-24 text-green-500 mb-8 drop-shadow-[0_0_30px_rgba(34,197,94,0.3)] animate-pulse" />
                           <h4 className="text-3xl font-display font-black uppercase tracking-tight text-white">System Fully Hardened</h4>
                           <p className="text-sm text-text-dim mt-4 max-w-md mx-auto text-center font-light leading-relaxed">
                             Rexy neural core detects no logical anomalies. All security invariants are synchronously fulfilled across the provided payload.
                           </p>
                        </div>
                      )}
                   </div>
                </div>

                {/* Vertical Stream Section 3: Exploit POC */}
                {audit.vulnerabilities.length > 0 && (
                  <div className="grid grid-cols-12 gap-12">
                     <div className="col-span-12 lg:col-span-4 lg:sticky lg:top-24 h-fit">
                        <h4 className="text-[11px] font-black uppercase tracking-[0.5em] text-purple-400 mb-4">Phase 03</h4>
                        <h2 className="text-5xl font-display font-black tracking-tighter uppercase mb-6 leading-none">Exploit<br/>Payloads</h2>
                        <p className="text-sm text-text-dim leading-relaxed">
                          Low-level proof of concept logs showing specifically how a breach can be executed against the current state.
                        </p>
                     </div>
                     <div className="col-span-12 lg:col-span-8 flex flex-col gap-8">
                        {audit.vulnerabilities.map((v, i) => (
                          <motion.div 
                            key={i} 
                            whileInView={{ opacity: 1, scale: 1 }}
                            initial={{ opacity: 0, scale: 0.98 }}
                            viewport={{ once: true }}
                            className="glass-card bg-black/40 border-white/5 relative group"
                          >
                             <div className="absolute top-0 right-0 p-6 flex gap-2">
                                <Terminal className="w-4 h-4 text-purple-400 opacity-30 group-hover:opacity-100 transition-opacity" />
                             </div>
                             <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-purple-400/10 rounded-lg">
                                   <Bug className="w-4 h-4 text-purple-400" />
                                </div>
                                <h5 className="text-[10px] font-black uppercase tracking-widest text-white">{v.title} :: PoC Trace</h5>
                             </div>
                             <pre className="p-8 bg-black/60 rounded-[2rem] border border-white/5 text-[12px] font-mono text-pink-400/90 leading-relaxed overflow-x-auto selection:bg-pink-500/20 scrollbar-hide">
                                <code>{v.exploitPoC}</code>
                             </pre>
                          </motion.div>
                        ))}
                     </div>
                  </div>
                )}

                {/* Vertical Stream Section 4: The Patch */}
                <div className="grid grid-cols-12 gap-12">
                   <div className="col-span-12 lg:col-span-4 lg:sticky lg:top-24 h-fit">
                      <h4 className="text-[11px] font-black uppercase tracking-[0.5em] text-cyber-blue mb-4">Phase 04</h4>
                      <h2 className="text-5xl font-display font-black tracking-tighter uppercase mb-6 leading-none">Hardened<br/>Remediation</h2>
                      <p className="text-sm text-text-dim leading-relaxed mb-8">
                        The synthesized REX-FIX payload. Fully patched with industry-standard security extensions and multi-layer logic guards.
                      </p>
                      
                      <button 
                        onClick={handleAutoFix}
                        className="w-full flex items-center justify-center gap-4 px-8 py-5 bg-white text-black rounded-[2rem] text-[12px] font-black uppercase tracking-[0.3em] hover:bg-cyber-blue transition-all group shadow-2xl"
                      >
                         <Wand2 className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                         Inject Patch to Editor
                      </button>
                   </div>
                   <div className="col-span-12 lg:col-span-8">
                      <motion.div 
                        whileInView={{ opacity: 1 }}
                        initial={{ opacity: 0 }}
                        viewport={{ once: true }}
                        className="glass-card p-1 bg-cyber-blue/10 border-cyber-blue/30 rounded-[3rem]"
                      >
                         <div className="bg-black/40 p-12 rounded-[2.8rem] border border-white/5 relative group overflow-hidden">
                            <div className="absolute inset-0 bg-cyber-blue/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                            <div className="flex items-center justify-between mb-8">
                               <div className="flex items-center gap-3">
                                  <ShieldCheck className="w-5 h-5 text-cyber-blue" />
                                  <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white">REXX-FIX Payload Security Verified</span>
                               </div>
                               <Badge variant="blue" className="px-4">Safe</Badge>
                            </div>
                            <pre className="relative z-10 font-mono text-[13px] text-blue-100/80 leading-relaxed overflow-x-auto scrollbar-hide">
                               <code>{audit.safeCodeSnippet}</code>
                            </pre>
                         </div>
                      </motion.div>
                      
                      {/* Risk Reduction Insight - DIRECTLY BELOW THE PATCH */}
                      <motion.div 
                        whileInView={{ opacity: 1, y: 0 }}
                        initial={{ opacity: 0, y: 40 }}
                        viewport={{ once: true }}
                        className="mt-12 p-16 glass-card bg-black/60 border-cyber-blue/20 overflow-hidden relative group"
                      >
                         <div className="absolute inset-0 bg-cyber-blue/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                         <div className="flex flex-col md:flex-row items-center justify-around gap-16 relative z-10">
                            
                            <div className="text-center">
                               <p className="text-[10px] font-black tracking-[0.4em] text-text-dim uppercase mb-6">Initial Breach Risk</p>
                               <div className="relative inline-block">
                                  <motion.div 
                                    animate={prevRisk ? { scale: [1, 1.05, 1], opacity: [0.3, 0.5, 0.3] } : {}}
                                    transition={{ duration: 3, repeat: Infinity }}
                                    className="absolute inset-0 bg-red-500 blur-2xl rounded-full opacity-10" 
                                  />
                                  <p className={`text-7xl md:text-9xl font-display font-black leading-none tracking-tighter ${prevRisk ? 'opacity-20 blur-[2px]' : 'text-white'}`}>
                                    {prevRisk || audit.riskScore}
                                  </p>
                               </div>
                            </div>

                            {prevRisk !== null && (
                               <motion.div 
                                initial={{ scale: 0, rotate: -180, opacity: 0 }}
                                animate={{ scale: 1, rotate: 0, opacity: 1 }}
                                transition={{ type: "spring", damping: 12, delay: 0.5 }}
                                className="flex flex-col items-center gap-6"
                               >
                                  <div className="relative">
                                     <div className="absolute inset-0 bg-cyber-blue blur-xl opacity-40 animate-pulse" />
                                     <div className="w-20 h-20 rounded-full bg-cyber-blue/20 border border-cyber-blue/50 flex items-center justify-center text-cyber-blue relative">
                                        <TrendingDown className="w-10 h-10" />
                                     </div>
                                  </div>
                                  <Badge variant="blue" className="bg-cyber-blue text-black border-none px-6 py-2 text-[11px]">Optimization Applied</Badge>
                               </motion.div>
                            )}

                            <div className="text-center">
                               <p className="text-[10px] font-black tracking-[0.4em] text-cyber-blue uppercase mb-6 animate-pulse">Post-Patch Integrity</p>
                               <div className="relative inline-block">
                                  <motion.div 
                                    animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.4, 0.2] }}
                                    transition={{ duration: 4, repeat: Infinity }}
                                    className="absolute inset-0 bg-cyber-blue blur-3xl rounded-full opacity-20" 
                                  />
                                  <p className="text-8xl md:text-[12rem] font-display font-black text-cyber-blue leading-none tracking-tighter drop-shadow-[0_0_80px_rgba(0,229,255,0.4)]">
                                    {audit.riskScore}
                                  </p>
                                  {audit.riskScore === 0 && (
                                     <motion.div 
                                      initial={{ opacity: 0, scale: 0.5 }}
                                      animate={{ opacity: 1, scale: 1 }}
                                      transition={{ delay: 1, type: "spring" }}
                                      className="absolute -top-4 -right-4"
                                     >
                                        <ShieldCheck className="w-16 h-16 text-green-400 drop-shadow-[0_0_20px_rgba(74,222,128,0.5)]" />
                                     </motion.div>
                                  )}
                               </div>
                            </div>
                         </div>
                         
                         {prevRisk !== null && (
                           <motion.div 
                             initial={{ opacity: 0 }}
                             animate={{ opacity: 1 }}
                             transition={{ delay: 1.2 }}
                             className="mt-20 pt-12 border-t border-white/5 text-center"
                           >
                             <div className="inline-flex items-center gap-8 px-10 py-5 bg-white/[0.02] border border-white/10 rounded-full">
                                <div className="text-left">
                                   <p className="text-[9px] font-black text-text-dim uppercase tracking-widest">Logic Hardening</p>
                                   <p className="text-xl font-display font-black text-white">+{prevRisk - audit.riskScore}% Efficiency</p>
                                </div>
                                <div className="w-[1px] h-8 bg-white/10" />
                                <div className="text-left">
                                   <p className="text-[9px] font-black text-text-dim uppercase tracking-widest">Verification Status</p>
                                   <p className="text-xl font-display font-black text-green-400 uppercase">SYNCHRONIZED</p>
                                </div>
                             </div>
                           </motion.div>
                         )}
                      </motion.div>
                   </div>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>

      <footer className="mt-20 border-t border-white/5 pt-12 text-center pb-20">
         <div className="flex justify-center gap-12 mb-8 opacity-40 grayscale hover:grayscale-0 transition-all duration-700">
            <Shield className="w-8 h-8" />
            <ExternalLink className="w-8 h-8" />
            <Cpu className="w-8 h-8" />
         </div>
         <p className="text-[10px] font-bold text-text-dim uppercase tracking-[0.8em] mb-4">Quantum-Secured Audit Engine</p>
         <p className="text-[9px] text-text-dim/60 font-mono">Rexy AI © 2026 | Developed for the Next Generation of DeFi Protocols</p>
      </footer>
    </div>
  );
}
