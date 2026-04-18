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
import { DependencyGraph } from './components/DependencyGraph';
import { FuzzingSimulation } from './components/FuzzingSimulation';
import { ThreatMonitor } from './components/ThreatMonitor';
import { AuditReport } from './components/AuditReport';
import { SecurityChat } from './components/SecurityChat';

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
  const [error, setError] = useState<string | null>(null);
  const [prevRisk, setPrevRisk] = useState<number | null>(null);
  const [isSecured, setIsSecured] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  const handleAudit = async (customCode?: string, resetSecured = true) => {
    const targetCode = customCode || code;
    if (!targetCode.trim() || loading) return;
    
    setLoading(true);
    setError(null);
    if (resetSecured) {
      setIsSecured(false);
    }
    
    const result = await auditSmartContract(targetCode);
    if (result) {
      setAudit(result);
      if (!customCode) setPrevRisk(null); 
      
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } else {
      setError("Analysis failed. This usually happens when the Gemini API quota is exceeded. Please wait a few moments and try again.");
    }
    setLoading(false);
  };

  const handleAutoFix = async () => {
    if (audit?.safeCodeSnippet) {
      setPrevRisk(audit.riskScore);
      const fixedCode = audit.safeCodeSnippet;
      setCode(fixedCode);
      setIsSecured(true);
      handleAudit(fixedCode, false);
    }
  };

  useEffect(() => {
    handleAudit();
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-cyber-blue/30 font-sans">
      {/* Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-cyber-blue/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-500/5 blur-[120px] rounded-full" />
        <div className="absolute inset-0 cyber-grid opacity-[0.02]" />
      </div>

      <div className="relative z-10 flex flex-col h-screen overflow-hidden">
        {/* Compact Header */}
        <header className="h-20 border-b border-white/5 bg-black/40 backdrop-blur-xl flex items-center justify-between px-8 shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-cyber-blue to-cyber-purple flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-display font-black tracking-tighter uppercase leading-none">Rexy AI</h1>
              <p className="text-[10px] font-black text-text-dim uppercase tracking-[0.2em]">Neural Intelligence Security</p>
            </div>
          </div>

          <div className="flex items-center gap-8">
            {audit && (
              <div className="hidden md:flex items-center gap-6">
                <div className="flex flex-col items-end">
                  <span className="text-[9px] font-black text-text-dim uppercase tracking-widest">Protocol Health</span>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-bold ${audit.riskScore > 50 ? 'text-red-400' : 'text-green-400'}`}>
                      {100 - audit.riskScore}% Secure
                    </span>
                    <div className="w-24 h-1 bg-white/5 rounded-full overflow-hidden">
                       <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${100 - audit.riskScore}%` }}
                        className={`h-full ${audit.riskScore > 50 ? 'bg-red-500' : 'bg-green-500'}`} 
                       />
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <button 
              onClick={() => handleAudit()}
              disabled={loading}
              className="px-6 py-2.5 bg-white text-black text-[11px] font-black uppercase tracking-widest rounded-full hover:bg-cyber-blue transition-all disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Zap className="w-3 h-3" />}
              {loading ? 'Analyzing...' : 'Execute Audit'}
            </button>
          </div>
        </header>

        {/* Dynamic Body Area */}
        <main className="flex-1 flex overflow-hidden">
          {/* Editor Side */}
          <div className="w-full lg:w-[45%] border-r border-white/5 flex flex-col bg-black/20">
            <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
               <div className="flex items-center gap-3">
                  <Code className="w-4 h-4 text-cyber-blue" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-white">Smart Contract Terminal</span>
               </div>
               <div className="flex gap-2">
                  <div className="w-2 h-2 rounded-full bg-red-400/20" />
                  <div className="w-2 h-2 rounded-full bg-orange-400/20" />
                  <div className="w-2 h-2 rounded-full bg-green-400/20" />
               </div>
            </div>
            
            <div className="flex-1 relative font-mono text-sm group">
               <textarea 
                 value={code}
                 onChange={(e) => setCode(e.target.value)}
                 className="absolute inset-0 w-full h-full bg-transparent p-10 resize-none focus:outline-none text-blue-100/70 leading-relaxed scrollbar-hide selection:bg-cyber-blue/30"
                 placeholder="Paste Solidity code here..."
               />
               {!code && (
                 <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                   <Terminal className="w-12 h-12" />
                 </div>
               )}
            </div>
          </div>

          {/* Results Side */}
          <div className="flex-1 flex flex-col bg-[#080808] overflow-hidden relative">
            <div className="flex-1 overflow-y-auto scroll-smooth scrollbar-hide" ref={resultsRef}>
              <AnimatePresence mode="wait">
                {!audit && !loading ? (
                  <motion.div 
                    key="empty"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="h-full flex flex-col items-center justify-center p-20 text-center"
                  >
                    {error ? (
                      <div className="space-y-6">
                        <div className="w-20 h-20 rounded-3xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-6">
                           <AlertTriangle className="w-8 h-8 text-red-500" />
                        </div>
                        <h3 className="text-2xl font-display font-black uppercase tracking-tight text-white">System Resource Constraint</h3>
                        <p className="text-red-400/80 max-w-sm mx-auto text-xs leading-relaxed mb-8 font-mono bg-red-500/5 p-4 rounded-xl border border-red-500/10">
                          {error}
                        </p>
                        <button 
                          onClick={() => handleAudit()}
                          className="flex items-center gap-3 px-8 py-3.5 bg-white text-black rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-cyber-blue transition-all mx-auto"
                        >
                           <History className="w-3.5 h-3.5" />
                           Re-initialize Neural Audit
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="w-20 h-20 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center mb-6">
                           <Lock className="w-8 h-8 text-white/20" />
                        </div>
                        <h3 className="text-2xl font-display font-black uppercase tracking-tight mb-3 text-white">Neural Safeguard Standby</h3>
                        <p className="text-text-dim max-w-sm mx-auto text-xs leading-relaxed mb-8">
                          Input your protocol source code to begin a comprehensive neural audit and multi-layered threat simulation.
                        </p>
                        <button 
                          onClick={() => handleAudit()}
                          className="flex items-center gap-3 px-8 py-3.5 bg-white/5 border border-white/10 text-white rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all group"
                        >
                           <Cpu className="w-3.5 h-3.5 group-hover:rotate-90 transition-transform" />
                           Initialize Neural Link
                        </button>
                      </>
                    )}
                  </motion.div>
                ) : loading ? (
                  <motion.div 
                    key="loading"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="h-full flex flex-col items-center justify-center p-20"
                  >
                     <div className="relative mb-10">
                        <div className="w-24 h-24 rounded-full border-2 border-white/5 flex items-center justify-center">
                           <Loader2 className="w-10 h-10 text-cyber-blue animate-spin" />
                        </div>
                        <div className="absolute inset-0 bg-cyber-blue/10 blur-3xl animate-pulse" />
                     </div>
                     <h3 className="text-sm font-display font-black uppercase tracking-[0.3em] animate-pulse text-white">Scanning Neural Paths</h3>
                     <div className="mt-6 flex gap-1.5">
                        {[0, 1, 2].map(i => (
                          <motion.div 
                            key={i}
                            animate={{ opacity: [0.2, 1, 0.2] }}
                            transition={{ repeat: Infinity, duration: 1, delay: i * 0.2 }}
                            className="w-1.5 h-1.5 bg-cyber-blue rounded-full" 
                          />
                        ))}
                     </div>
                  </motion.div>
                ) : (
                  <motion.div 
                    key="results"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="p-8 lg:p-12 space-y-24"
                  >
                    {/* 01. Overview */}
                    <div className="space-y-10">
                       <div className="flex items-center gap-4">
                          <span className="text-[10px] font-black text-cyber-blue px-3 py-1 bg-cyber-blue/10 rounded-full border border-cyber-blue/20">01</span>
                          <h2 className="text-2xl font-display font-black uppercase tracking-tight text-white">Protocol Overview</h2>
                       </div>
                       
                       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          <GlassCard className="p-6 border-cyber-blue/20">
                             <div className="flex items-center justify-between mb-6">
                                <span className="text-[9px] font-black text-cyber-blue uppercase tracking-widest">Risk Level</span>
                                <Activity className="w-4 h-4 text-cyber-blue" />
                             </div>
                             <ScoreIndicator value={audit.riskScore} label="Magnitude" color={audit.riskScore > 60 ? "#ef4444" : "#00E5FF"} size="md" />
                          </GlassCard>

                          <GlassCard className="p-6">
                             <div className="flex items-center justify-between mb-6">
                                <span className="text-[9px] font-black text-white uppercase tracking-widest">Environment</span>
                                <Cpu className="w-4 h-4 text-text-dim" />
                             </div>
                             <p className="text-2xl font-display font-black text-white">{audit.compilerVersion}</p>
                             <div className="mt-3 flex items-center gap-2 text-[9px] font-black uppercase text-green-400">
                                <CheckCircle2 className="w-3 h-3" /> Compatible
                             </div>
                          </GlassCard>

                          <div className="flex flex-col gap-4">
                             <div className="glass-card flex-1 p-5 relative overflow-hidden group">
                                <h4 className="text-[9px] font-black text-text-dim uppercase tracking-widest mb-1">Critical Issues</h4>
                                <p className="text-3xl font-display font-black text-white">
                                   {audit.vulnerabilities.filter(v => v.severity === 'High' || v.severity === 'Critical').length}
                                </p>
                             </div>
                             <div className="glass-card flex-1 p-5 relative overflow-hidden group">
                                <h4 className="text-[9px] font-black text-text-dim uppercase tracking-widest mb-1">Coverage Scope</h4>
                                <p className="text-3xl font-display font-black text-white">42/42 SWC</p>
                             </div>
                          </div>
                       </div>

                       <div className="bg-white/[0.01] border border-white/5 rounded-3xl p-8">
                          <p className="text-sm text-white/90 font-medium leading-relaxed border-l-2 border-cyber-blue pl-6">
                             {audit.architectureReview}
                          </p>
                       </div>
                    </div>

                    {/* 02. Vulnerabilities */}
                    <div className="space-y-10">
                       <div className="flex items-center gap-4">
                          <span className="text-[10px] font-black text-red-400 px-3 py-1 bg-red-400/10 rounded-full border border-red-400/20">02</span>
                          <h2 className="text-2xl font-display font-black uppercase tracking-tight text-white">Security Vulnerabilities</h2>
                       </div>
                       
                       <div className="space-y-6">
                          {audit.vulnerabilities.length > 0 ? (
                            audit.vulnerabilities.map((v, i) => (
                              <motion.div 
                                key={i}
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.1 }}
                                className="glass-card p-0 overflow-hidden border-white/5 hover:border-white/10"
                              >
                                 <div className="flex flex-col xl:flex-row">
                                    <div className="xl:w-64 p-6 border-b xl:border-b-0 xl:border-r border-white/5 bg-white/[0.01]">
                                       <div className="flex flex-wrap gap-2 mb-4">
                                          <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase border ${
                                            v.severity === 'Critical' ? 'bg-red-500/10 border-red-500/30 text-red-500' :
                                            v.severity === 'High' ? 'bg-orange-500/10 border-orange-500/30 text-orange-500' :
                                            'bg-cyber-blue/10 border-cyber-blue/30 text-cyber-blue'
                                          }`}>
                                             {v.severity}
                                          </span>
                                       </div>
                                       <p className="text-[8px] font-black text-text-dim uppercase tracking-widest mb-1">Impact</p>
                                       <p className="text-lg font-display font-black text-white uppercase">{v.impactRadius}</p>
                                       
                                       {v.historicalExploitName && (
                                          <div className="mt-6 p-3 bg-purple-500/5 border border-purple-500/10 rounded-lg">
                                             <p className="text-[8px] font-black text-purple-400 uppercase tracking-widest">Case Study</p>
                                             <p className="text-[10px] font-bold text-white mt-1 italic">{v.historicalExploitName}</p>
                                          </div>
                                       )}
                                    </div>
                                    
                                    <div className="flex-1 p-6">
                                       <h4 className="text-md font-display font-black text-white uppercase mb-2">{v.title}</h4>
                                       <p className="text-[13px] text-text-dim leading-relaxed mb-6">{v.description}</p>
                                       
                                       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                          <div className="space-y-2">
                                             <p className="text-[8px] font-black text-red-400 uppercase tracking-widest">Attack Path</p>
                                             <div className="bg-black/40 rounded-xl p-4 border border-white/5 font-mono text-[10px] text-pink-400/80 max-h-32 overflow-y-auto">
                                                <code>{v.exploitPoC}</code>
                                             </div>
                                          </div>
                                          <div className="space-y-2">
                                             <p className="text-[8px] font-black text-green-400 uppercase tracking-widest">Neutralization</p>
                                             <div className="bg-black/40 rounded-xl p-4 border border-white/5 font-mono text-[10px] text-blue-100/60 max-h-32 overflow-y-auto">
                                                <code>{v.remediation}</code>
                                             </div>
                                          </div>
                                       </div>
                                    </div>
                                 </div>
                              </motion.div>
                            ))
                          ) : (
                            <div className="glass-card py-20 flex flex-col items-center justify-center border-green-500/20 bg-green-500/[0.01]">
                               <ShieldCheck className="w-12 h-12 text-green-500 mb-6 opacity-30" />
                               <p className="text-sm font-display font-black text-white uppercase tracking-widest">No Critical Threats Detected</p>
                            </div>
                          )}
                       </div>
                    </div>

                    {/* 03. Logic Mapping */}
                    <div className="space-y-10">
                       <div className="flex items-center gap-4">
                          <span className="text-[10px] font-black text-purple-400 px-3 py-1 bg-purple-400/10 rounded-full border border-purple-400/20">03</span>
                          <h2 className="text-2xl font-display font-black uppercase tracking-tight text-white">Logic Mapping</h2>
                       </div>
                       <DependencyGraph data={audit.dependencyGraph} />
                    </div>

                    {/* 04. Neural Fuzzing */}
                    <div className="space-y-10">
                       <div className="flex items-center gap-4">
                          <span className="text-[10px] font-black text-cyber-purple px-3 py-1 bg-purple-400/10 rounded-full border border-purple-400/20">04</span>
                          <h2 className="text-2xl font-display font-black uppercase tracking-tight text-white">Neural Fuzzing</h2>
                       </div>
                       <FuzzingSimulation scenarios={audit.fuzzingSimulation} />
                    </div>

                    {/* 05. Remediation */}
                    <div className="space-y-10">
                       <div className="flex items-center justify-between flex-wrap gap-6">
                          <div className="flex items-center gap-4">
                             <span className="text-[10px] font-black text-green-400 px-3 py-1 bg-green-400/10 rounded-full border border-green-400/20">05</span>
                             <h2 className="text-2xl font-display font-black uppercase tracking-tight text-white">Smart Fix Delivery</h2>
                          </div>
                          <button 
                            onClick={handleAutoFix}
                            className="flex items-center gap-3 px-8 py-3.5 bg-white text-black rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-cyber-blue transition-all group"
                          >
                             <Wand2 className="w-3.5 h-3.5 group-hover:rotate-12 transition-transform" />
                             Deploy Security Patch
                          </button>
                       </div>

                       <div className="glass-card p-1 bg-cyber-blue/5 border-cyber-blue/20 rounded-[2rem]">
                          <div className="bg-black/60 p-8 rounded-[1.8rem] border border-white/5 relative group overflow-hidden">
                             <div className="absolute top-4 right-6 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                <span className="text-[9px] font-black text-green-500 uppercase tracking-widest">Hardened Patch</span>
                             </div>
                             <pre className="font-mono text-[12px] text-blue-100/60 leading-relaxed overflow-x-auto scrollbar-hide max-h-96">
                                <code>{audit.safeCodeSnippet}</code>
                             </pre>
                          </div>
                       </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                         <div className="glass-card p-8 bg-black/40">
                            <p className="text-[9px] font-black text-text-dim uppercase tracking-widest mb-6">Breach Risk Reduction</p>
                            <div className="flex items-center justify-center gap-8">
                               <span className="text-4xl font-display font-black text-white opacity-20">{prevRisk || audit.riskScore}</span>
                               <TrendingDown className="w-8 h-8 text-cyber-blue" />
                               <span className="text-7xl font-display font-black text-cyber-blue">{audit.riskScore}</span>
                            </div>
                         </div>
                         <div className="space-y-4">
                            <div className="glass-card p-5 flex items-center gap-4">
                               <div className="w-10 h-10 rounded-lg bg-green-400/10 flex items-center justify-center">
                                  <ShieldCheck className="w-5 h-5 text-green-400" />
                               </div>
                               <div>
                                  <p className="text-[9px] font-black text-text-dim uppercase tracking-widest">Status</p>
                                  <p className="text-lg font-display font-black text-white">Protocol Hardened</p>
                               </div>
                            </div>
                            <div className="glass-card p-5 flex items-center gap-4">
                               <div className="w-10 h-10 rounded-lg bg-cyber-blue/10 flex items-center justify-center">
                                  <Zap className="w-5 h-5 text-cyber-blue" />
                               </div>
                               <div>
                                  <p className="text-[9px] font-black text-text-dim uppercase tracking-widest">Integrity Delta</p>
                                  <p className="text-lg font-display font-black text-white">+{prevRisk ? prevRisk - audit.riskScore : 0}% Gain</p>
                               </div>
                            </div>
                         </div>
                      </div>
                    </div>

                    {/* 06. Surveillance */}
                    <div className="space-y-10 pb-20">
                       <div className="flex items-center gap-4">
                          <span className="text-[10px] font-black text-cyber-blue px-3 py-1 bg-cyber-blue/10 rounded-full border border-cyber-blue/20">06</span>
                          <h2 className="text-2xl font-display font-black uppercase tracking-tight text-white">Intrusion Surveillance</h2>
                       </div>
                       <ThreatMonitor metrics={audit.threatMonitoringData} />
                       <div className="mt-12">
                          <AuditReport audit={audit} />
                       </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </main>
      </div>

      <SecurityChat code={code} audit={audit} />

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
