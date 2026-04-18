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
  Code
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
  const [activeTab, setActiveTab] = useState<'vulnerabilities' | 'review' | 'patch'>('vulnerabilities');

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

  useEffect(() => {
    // Initial auto-audit for splash effect
    handleAudit();
  }, []);

  return (
    <div className="min-h-screen bg-dark-bg p-6 md:p-8 max-w-[1400px] mx-auto flex flex-col gap-6">
      <nav className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <Shield className="w-8 h-8 text-cyber-blue drop-shadow-[0_0_10px_rgba(0,229,255,0.5)]" />
          <h1 className="text-xl font-display font-bold">SENTINEL<span className="text-cyber-blue">3</span></h1>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant="blue">Core V2.5 Running</Badge>
          <div className="flex items-center gap-2 text-[10px] font-bold text-cyber-blue/80 uppercase tracking-widest">
            <Activity className="w-3 h-3 animate-pulse" />
            Network Secure
          </div>
        </div>
      </nav>

      <div className="bento-grid flex-grow">
        {/* Code Input Area */}
        <section className="col-span-12 lg:col-span-5 glass-card flex flex-col gap-4 border-cyber-blue/20">
          <div className="flex items-center justify-between">
            <p className="card-title">Contract Source (Solidity)</p>
            <Badge variant="purple">Mainnet Safe Check</Badge>
          </div>
          
          <div className="relative flex-grow">
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Paste smart contract code here..."
              className="w-full h-full min-h-[400px] bg-black/40 border border-border rounded-xl p-6 text-xs font-mono text-white/90 focus:outline-none focus:border-cyber-blue/50 transition-all resize-none shadow-inner"
              spellCheck={false}
            />
            <div className="absolute top-4 right-4 text-[8px] font-mono text-text-dim uppercase bg-black/60 px-2 py-1 rounded">
              ReadOnly: False
            </div>
          </div>

          <button 
            onClick={handleAudit}
            disabled={loading || !code.trim()}
            className="w-full py-5 bg-white text-black font-extrabold rounded-full uppercase tracking-[0.2em] text-[10px] hover:bg-cyber-blue hover:scale-[1.01] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-3 group"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Eye className="w-4 h-4 group-hover:rotate-12 transition-transform" />}
            Initiate Security Deep-Dive
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
                  <div className="w-20 h-20 relative mb-8">
                    <div className="absolute inset-0 bg-cyber-blue blur-2xl opacity-20 animate-pulse" />
                    <Shield className="w-full h-full text-cyber-blue animate-bounce" />
                  </div>
                  <p className="font-mono text-xs text-cyber-blue uppercase tracking-[0.4em] animate-pulse">
                    Scanning semantic vulnerability vectors...
                  </p>
                  <div className="mt-4 w-48 h-1 bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-cyber-blue"
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 3, repeat: Infinity }}
                    />
                  </div>
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
                    <p className="card-title">Executive Intelligence</p>
                    <h3 className="text-3xl font-display font-bold uppercase tracking-tight text-white mb-2">
                       {audit.contractName || "Untitled Audit"}
                    </h3>
                    <p className="text-xs text-text-dim leading-relaxed max-w-lg mb-4">
                      {audit.architectureReview}
                    </p>
                    <div className="flex gap-2">
                      <Badge variant="blue">Semantics Pass</Badge>
                      <Badge variant={audit.riskScore > 50 ? 'purple' : 'green'}>
                        {audit.riskScore > 50 ? 'High Risk' : 'Low Risk'}
                      </Badge>
                    </div>
                  </section>

                  <section className="glass-card flex flex-col items-center justify-center border-cyber-purple/20">
                    <p className="card-title">Threat Index</p>
                    <ScoreIndicator 
                      label="Cumulative Risk" 
                      value={audit.riskScore} 
                      color={audit.riskScore > 70 ? "#ff4e00" : audit.riskScore > 40 ? "#bc13fe" : "#00E5FF"} 
                    />
                  </section>
                </div>

                {/* Dashboard Tabs */}
                <div className="flex gap-1 p-1 bg-black/40 border border-border rounded-full self-start">
                  {[
                    { id: 'vulnerabilities', icon: AlertTriangle, label: 'Detected Flaws' },
                    { id: 'review', icon: History, label: 'Gas & Logic' },
                    { id: 'patch', icon: Code, label: 'Secure Patch' }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`px-6 py-2 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
                        activeTab === tab.id ? 'bg-white text-black shadow-lg' : 'text-text-dim hover:text-white'
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
                      {audit.vulnerabilities.map((v, i) => (
                        <div key={i} className="glass-card group hover:border-cyber-blue/30 transition-colors">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <div className={`p-2 rounded-lg bg-black/40 border ${
                                v.severity === 'Critical' ? 'border-red-500/30 text-red-500' : 
                                v.severity === 'High' ? 'border-orange-500/30 text-orange-500' :
                                'border-cyber-blue/30 text-cyber-blue'
                              }`}>
                                <AlertTriangle className="w-4 h-4" />
                              </div>
                              <h4 className="font-display font-bold uppercase tracking-tight text-white">{v.title}</h4>
                            </div>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                              v.severity === 'Critical' ? 'border-red-500/20 text-red-500 bg-red-500/5' : 'border-cyber-blue/20 text-cyber-blue bg-cyber-blue/5'
                            }`}>
                              {v.severity.toUpperCase()}
                            </span>
                          </div>
                          <p className="text-xs text-text-dim leading-relaxed mb-4">{v.description}</p>
                          <div className="grid md:grid-cols-2 gap-4 pt-4 border-t border-white/5">
                            <div>
                              <p className="text-[8px] font-bold uppercase text-text-dim mb-1">Target</p>
                              <code className="text-xs text-cyber-blue font-mono">{v.location}</code>
                            </div>
                            <div>
                              <p className="text-[8px] font-bold uppercase text-text-dim mb-1">Remediation</p>
                              <p className="text-[10px] text-slate-300 italic">"{v.remediation}"</p>
                            </div>
                          </div>
                          {v.historicalContext && (
                            <div className="mt-4 p-3 bg-red-500/5 border border-red-500/10 rounded-lg flex items-start gap-2">
                              <History className="w-3 h-3 text-red-400 mt-0.5 shrink-0" />
                              <p className="text-[10px] text-red-400 leading-relaxed italic">
                                <span className="font-bold underline uppercase mr-1">Historical Context:</span>
                                {v.historicalContext}
                              </p>
                            </div>
                          )}
                        </div>
                      ))}
                    </motion.div>
                  )}

                  {activeTab === 'review' && (
                    <motion.div 
                      key="review" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                      className="grid md:grid-cols-2 gap-4"
                    >
                      <GlassCard title="Gas Optimization" icon={Zap}>
                        <div className="space-y-3">
                          {audit.gasOptimizationTips.map((tip, i) => (
                            <div key={i} className="flex items-start gap-2 text-xs text-slate-300">
                              <ChevronRight className="w-3 h-3 text-cyber-blue mt-1 shrink-0" />
                              {tip}
                            </div>
                          ))}
                        </div>
                      </GlassCard>
                      <GlassCard title="Architectural Insights" icon={Terminal}>
                        <div className="p-4 bg-black/40 rounded-xl border border-white/5 font-mono text-xs text-slate-300 leading-relaxed">
                          {audit.architectureReview}
                        </div>
                      </GlassCard>
                    </motion.div>
                  )}

                  {activeTab === 'patch' && (
                    <motion.div 
                      key="patch" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                      className="glass-card"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <p className="card-title">Hardened Patch Suggestion</p>
                        <Badge variant="green">Verified Pattern</Badge>
                      </div>
                      <pre className="bg-black/60 p-6 rounded-2xl border border-white/5 font-mono text-xs text-cyber-blue leading-relaxed overflow-x-auto">
                        <code>{audit.safeCodeSnippet}</code>
                      </pre>
                      <div className="mt-6 p-4 bg-white/5 rounded-xl border border-white/5 flex items-center gap-4">
                        <Lock className="w-6 h-6 text-green-400" />
                        <div>
                          <p className="text-[10px] font-bold text-white uppercase mb-1">Audit Consensus</p>
                          <p className="text-xs text-text-dim italic">Implementing this hardened pattern significantly reduces re-entrancy attack surfaces and ensures state atomic integrity.</p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>

      <footer className="mt-auto pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4 text-text-dim text-[10px] font-bold uppercase tracking-widest">
        <p>© 2026 Sentinel3 Security Architecture - Web3 Protection</p>
        <div className="flex gap-8">
          <span className="text-[8px] opacity-40 italic">System: Gemini 3 Advanced Semantic Kernel</span>
          <a href="#" className="hover:text-white transition-colors">Risk Documentation</a>
          <a href="#" className="hover:text-white transition-colors text-cyber-blue">Submit for manual Audit</a>
        </div>
      </footer>
    </div>
  );
}
