import { useState, useEffect } from 'react';
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
  PlayCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GlassCard, Badge, ScoreIndicator } from './components/UI';
import { auditSmartContract, ContractAudit, ExploitStep } from './services/geminiService';
import { ExploitSimulator } from './components/ExploitSimulator';

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
  const [activeTab, setActiveTab] = useState<'vulnerabilities' | 'review' | 'patch' | 'poc'>('vulnerabilities');
  const [activeSimSteps, setActiveSimSteps] = useState<ExploitStep[] | null>(null);

  const handleAudit = async () => {
    if (!code.trim() || loading) return;
    setLoading(true);
    const result = await auditSmartContract(code);
    if (result) {
      setAudit(result);
      setActiveTab('vulnerabilities');
    }
    setLoading(false);
  };

  const handleAutoFix = async () => {
    if (audit?.safeCodeSnippet) {
      const fixedCode = audit.safeCodeSnippet;
      setCode(fixedCode);
      // Immediately trigger a re-audit on the fixed code to show it's now secure
      setLoading(true);
      const result = await auditSmartContract(fixedCode);
      if (result) {
        setAudit(result);
        setActiveTab('patch'); // Keep it on patch or switch to vulnerabilities to show they are gone
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    handleAudit();
  }, []);

  return (
    <div className="min-h-screen bg-dark-bg p-6 md:p-8 max-w-[1400px] mx-auto flex flex-col gap-6">
      <nav className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <Shield className="w-8 h-8 text-cyber-blue drop-shadow-[0_0_10px_rgba(0,229,255,0.5)]" />
          <h1 className="text-xl font-display font-bold">REXY<span className="text-cyber-blue">AI</span></h1>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant="blue">Rexy Core v3.0</Badge>
          <div className="flex items-center gap-2 text-[10px] font-bold text-cyber-blue/80 uppercase tracking-widest">
            <Activity className="w-3 h-3 animate-pulse" />
            Vulnerability Scanner Online
          </div>
        </div>
      </nav>

      <div className="bento-grid flex-grow">
        {/* Code Input Area */}
        <section className="col-span-12 lg:col-span-5 glass-card flex flex-col gap-4 border-cyber-blue/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Code className="w-4 h-4 text-cyber-blue" />
              <p className="card-title">Contract Source</p>
            </div>
            <div className="flex gap-2">
              {audit?.safeCodeSnippet && (
                <button 
                  onClick={handleAutoFix}
                  className="flex items-center gap-2 px-3 py-1 bg-green-500/10 hover:bg-green-500/20 text-green-400 border border-green-500/30 rounded-lg text-[10px] font-bold uppercase transition-all"
                >
                  <Wand2 className="w-3 h-3" />
                  Auto-Fix Code
                </button>
              )}
              <Badge variant="purple">Solidity</Badge>
            </div>
          </div>
          
          <div className="relative flex-grow">
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Paste smart contract code here..."
              className="w-full h-full min-h-[400px] bg-black/40 border border-border rounded-xl p-6 text-xs font-mono text-white/90 focus:outline-none focus:border-cyber-blue/50 transition-all resize-none shadow-inner"
              spellCheck={false}
            />
          </div>

          <button 
            onClick={handleAudit}
            disabled={loading || !code.trim()}
            className="w-full py-5 bg-white text-black font-extrabold rounded-full uppercase tracking-[0.2em] text-[10px] hover:bg-cyber-blue hover:shadow-[0_0_20px_rgba(0,229,255,0.3)] transition-all disabled:opacity-50 flex items-center justify-center gap-3 group"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
            Execute Deep Audit
          </button>
        </section>

        {/* Intelligence Output */}
        <div className="col-span-12 lg:col-span-7 flex flex-col gap-4">
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div 
                key="loading"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="flex-grow glass-card items-center justify-center py-40 border-dashed bg-cyber-blue/5 overflow-hidden relative"
              >
                <div className="absolute inset-0 cyber-grid opacity-10" />
                <div className="relative z-10 flex flex-col items-center">
                  <Shield className="w-16 h-16 text-cyber-blue animate-pulse mb-6" />
                  <p className="font-mono text-xs text-cyber-blue uppercase tracking-[0.4em] animate-pulse">
                    Rexy is dissecting the contract logic...
                  </p>
                </div>
              </motion.div>
            ) : audit ? (
              <motion.div 
                key="audit" 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }}
                className="flex flex-col gap-4"
              >
                {/* Executive Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <section className="md:col-span-2 glass-card bg-linear-to-r from-[#111] to-[#1a1a1a]">
                    <p className="card-title">Audit Overview</p>
                    <h3 className="text-3xl font-display font-bold uppercase tracking-tight text-white mb-2">
                       {audit.contractName}
                    </h3>
                    <p className="text-xs text-text-dim leading-relaxed mb-4">
                      {audit.architectureReview}
                    </p>
                  </section>

                  <section className="glass-card flex flex-col items-center justify-center">
                    <p className="card-title">Threat Score</p>
                    <ScoreIndicator 
                      label="Security Risk" 
                      value={audit.riskScore} 
                      color={audit.riskScore > 70 ? "#ff4444" : audit.riskScore > 40 ? "#bc13fe" : "#00E5FF"} 
                    />
                  </section>
                </div>

                {/* Dashboard Tabs */}
                <div className="flex gap-1 p-1 bg-black/40 border border-border rounded-full self-start overflow-x-auto">
                  {[
                    { id: 'vulnerabilities', icon: AlertTriangle, label: 'Vulnerabilities' },
                    { id: 'poc', icon: Bug, label: 'Exploit PoC' },
                    { id: 'patch', icon: ShieldCheck, label: 'Automated Patch' },
                    { id: 'review', icon: History, label: 'Risk Review' }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all flex items-center gap-2 whitespace-nowrap ${
                        activeTab === tab.id ? 'bg-white text-black' : 'text-text-dim hover:text-white'
                      }`}
                    >
                      <tab.icon className="w-3 h-3" />
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Sub-sections */}
                <AnimatePresence mode="wait">
                  {activeTab === 'vulnerabilities' && (
                    <motion.div 
                      key="vuln" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                      className="grid gap-4"
                    >
                      {audit.vulnerabilities.length > 0 ? (
                        audit.vulnerabilities.map((v, i) => (
                          <div key={i} className="glass-card group hover:border-cyber-blue/30 transition-colors">
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center gap-3">
                                <AlertTriangle className={`w-4 h-4 ${v.severity === 'Critical' ? 'text-red-500' : 'text-orange-500'}`} />
                                <h4 className="font-display font-bold uppercase tracking-tight text-white">{v.title}</h4>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                                  v.severity === 'Critical' ? 'border-red-500/20 text-red-500 bg-red-500/5' : 'border-cyber-blue/20 text-cyber-blue bg-cyber-blue/5'
                                }`}>
                                  {v.severity.toUpperCase()}
                                </span>
                                <Badge variant="blue">{v.swcId}</Badge>
                              </div>
                            </div>
                            
                            <div className="space-y-4">
                              <div className="flex items-center justify-between mb-2">
                                 <div className="px-2 py-1 bg-white/5 border border-white/10 rounded text-[9px] font-mono text-text-dim uppercase tracking-widest">
                                   Mapping: {v.owaspCategory}
                                 </div>
                                 <button 
                                   onClick={() => setActiveSimSteps(v.simulationSteps)}
                                   className="flex items-center gap-2 px-3 py-1 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 rounded-lg text-[9px] font-bold uppercase transition-all"
                                 >
                                   <PlayCircle className="w-3 h-3" />
                                   Run Live Shadow-Run
                                 </button>
                              </div>
                              <div>
                                <p className="text-[10px] font-bold uppercase text-cyber-blue mb-1">Attack Vector</p>
                                <p className="text-xs text-slate-300 leading-relaxed bg-cyber-blue/5 p-3 rounded-lg border border-cyber-blue/10">
                                  {v.attackVector}
                                </p>
                              </div>
                              <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                  <p className="text-[8px] font-bold uppercase text-text-dim mb-1">Description</p>
                                  <p className="text-[11px] text-text-dim">{v.description}</p>
                                </div>
                                <div>
                                  <p className="text-[8px] font-bold uppercase text-text-dim mb-1">Remediation</p>
                                  <p className="text-[11px] text-text-dim italic">{v.remediation}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="glass-card py-20 flex flex-col items-center justify-center border-green-500/20 bg-green-500/5">
                          <ShieldCheck className="w-12 h-12 text-green-500 mb-4" />
                          <h4 className="text-xl font-display font-bold text-white uppercase tracking-tight">System Secure</h4>
                          <p className="text-sm text-text-dim mt-2">No active vulnerabilities detected in this contract.</p>
                        </div>
                      )}
                    </motion.div>
                  )}

                  {activeTab === 'poc' && (
                    <motion.div 
                      key="poc" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                      className="grid gap-4"
                    >
                      {audit.vulnerabilities.map((v, i) => (
                        <GlassCard key={i} title={`PoC: ${v.title}`} icon={Bug}>
                          <p className="text-xs text-text-dim mb-4 italic">"{v.attackVector}"</p>
                          <pre className="bg-black/60 p-4 rounded-xl border border-white/5 font-mono text-[10px] text-red-400 overflow-x-auto">
                            <code>{v.exploitPoC}</code>
                          </pre>
                        </GlassCard>
                      ))}
                    </motion.div>
                  )}

                  {activeTab === 'patch' && (
                    <motion.div 
                      key="patch" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                      className="glass-card"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <p className="card-title">REX-FIX: Automated Patch</p>
                        <button 
                          onClick={handleAutoFix}
                          className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded-lg text-xs font-bold uppercase hover:bg-cyber-blue transition-all"
                        >
                          <Wand2 className="w-3 h-3" />
                          Apply Patch to Editor
                        </button>
                      </div>
                      <pre className="bg-black/60 p-6 rounded-2xl border border-white/5 font-mono text-xs text-cyber-blue overflow-x-auto">
                        <code>{audit.safeCodeSnippet}</code>
                      </pre>
                    </motion.div>
                  )}

                  {activeTab === 'review' && (
                    <motion.div 
                      key="review" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                      className="grid md:grid-cols-2 gap-4"
                    >
                      <GlassCard title="Security Review" icon={ShieldCheck}>
                        <p className="text-xs text-slate-300 leading-relaxed font-mono">
                          {audit.architectureReview}
                        </p>
                      </GlassCard>
                      <GlassCard title="Gas Optimization" icon={Zap}>
                        <ul className="space-y-2">
                          {audit.gasOptimizationTips.map((tip, i) => (
                            <li key={i} className="text-xs text-slate-400 flex items-start gap-2">
                              <ChevronRight className="w-3 h-3 text-cyber-blue mt-1 shrink-0" />
                              {tip}
                            </li>
                          ))}
                        </ul>
                      </GlassCard>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>

      <footer className="mt-auto pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4 text-text-dim text-[10px] font-bold uppercase tracking-widest">
        <p>© 2026 Rexy AI - Automated Smart Contract Security</p>
        <div className="flex gap-8">
          <span className="text-[8px] opacity-40 italic">Engine: Rexy-Semantic-v3</span>
          <a href="#" className="hover:text-white transition-colors">Audit History</a>
          <a href="#" className="hover:text-white transition-colors text-cyber-blue">HackerOne Integration</a>
        </div>
      </footer>

      {activeSimSteps && (
        <ExploitSimulator 
          steps={activeSimSteps} 
          onClose={() => setActiveSimSteps(null)} 
        />
      )}
    </div>
  );
}
