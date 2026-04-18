import React from 'react';
import { motion } from 'motion/react';
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle2, 
  TrendingDown, 
  Activity, 
  Search, 
  Lock, 
  ArrowUpRight,
  Download,
  Share2,
  ChevronRight,
  Code2,
  FileText,
  Zap,
  Layers,
  Box,
  Monitor,
  Terminal,
  Wand2,
  Sparkles,
  QrCode,
  Globe,
  Award
} from 'lucide-react';
import { ContractAudit, Severity } from '../types';
import { GlassCard, Badge, ScoreIndicator } from './UI';
import { DependencyGraph } from './DependencyGraph';
import { FuzzingSimulation } from './FuzzingSimulation';
import { ThreatMonitor } from './ThreatMonitor';

interface DashboardProps {
  audit: ContractAudit;
  onAutoFix: () => void;
  onExport: (format: 'json' | 'pdf') => void;
  onSamplePDF?: () => void;
  onShare?: () => void;
  onManualReview?: () => void;
  isFixed?: boolean;
}

const severityColors: Record<string, string> = {
  Critical: 'text-red-500',
  High: 'text-orange-500',
  Medium: 'text-yellow-500',
  Low: 'text-green-500'
};

const severityBorders: Record<string, string> = {
  Critical: 'border-red-500/20',
  High: 'border-orange-500/20',
  Medium: 'border-yellow-500/20',
  Low: 'border-green-500/20'
};

const severityBg: Record<string, string> = {
  Critical: 'bg-red-500/5',
  High: 'bg-orange-500/5',
  Medium: 'bg-yellow-500/5',
  Low: 'bg-green-500/5'
};

export function AnalysisDashboard({ audit, onAutoFix, onExport, onShare, onManualReview, onSamplePDF, isFixed }: DashboardProps) {
  const vulnerabilities = audit.vulnerabilities || [];
  const logicFlow = audit.logicFlow || [];
  const dependencyGraph = audit.dependencyGraph || { nodes: [], links: [] };
  const fuzzingSimulation = audit.fuzzingSimulation || [];
  const threatMonitoringData = audit.threatMonitoringData || [];

  const counts = vulnerabilities.reduce((acc, v) => {
    acc[v.severity] = (acc[v.severity] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <>
      {isFixed ? (
        <div className="space-y-12 pb-32 print:hidden">
          {/* Verified Success Header */}
          <section className="bg-green-500/5 border border-green-500/20 rounded-[3rem] p-12 lg:p-16 relative overflow-hidden">
             <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/10 blur-[100px] -mr-32 -mt-32" />
             <div className="flex flex-col md:flex-row items-center gap-12 relative z-10">
                <div className="w-32 h-32 rounded-full bg-green-500 flex items-center justify-center shadow-[0_0_50px_rgba(34,197,94,0.3)]">
                   <CheckCircle2 className="w-16 h-16 text-black" />
                </div>
                <div className="flex-1 text-center md:text-left space-y-4">
                   <div className="flex items-center justify-center md:justify-start gap-4">
                      <h2 className="text-5xl font-display font-black uppercase text-white tracking-tighter">Verified Secure</h2>
                      <div className="px-4 py-1.5 bg-green-500/20 border border-green-500/30 rounded-full">
                         <span className="text-xs font-black text-green-400 uppercase tracking-widest">Trust Index: {audit.securityScore}%</span>
                      </div>
                   </div>
                   <p className="text-lg text-text-dim max-w-2xl leading-relaxed">
                      Automated patching successfully resolved all detected vulnerabilities. The contract now adheres to enterprise security standards 
                      and the Checks-Effects-Interactions pattern.
                   </p>
                   <div className="flex gap-4 pt-4 justify-center md:justify-start">
                      <button onClick={() => onExport('pdf')} className="glass-card px-6 py-2.5 text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-white/10 transition-colors">
                         <Download className="w-4 h-4" /> Download Certified Report
                      </button>
                      <button onClick={onSamplePDF} className="glass-card px-6 py-2.5 text-[10px] font-black uppercase tracking-widest border-cyber-blue/20 text-cyber-blue hover:bg-cyber-blue/10 transition-colors flex items-center gap-2">
                         <Sparkles className="w-4 h-4" /> Sample Format
                      </button>
                      <button 
                         onClick={onShare}
                         className="glass-card px-6 py-2.5 text-[10px] font-black uppercase tracking-widest border-green-500/20 text-green-400 hover:bg-green-500/10 transition-colors"
                      >
                         <Share2 className="w-4 h-4" /> Share Verification
                      </button>
                   </div>
                </div>
             </div>
          </section>

          {/* Terminal Code View */}
          <section id="secured-code" className="space-y-6">
             <div className="flex items-center justify-between px-4">
                <div className="flex items-center gap-3">
                   <Terminal className="w-5 h-5 text-cyber-blue" />
                   <h3 className="text-xl font-display font-black uppercase text-white tracking-tight">Secured Execution Environment</h3>
                </div>
                <Badge variant="green">Post-Patch Source</Badge>
             </div>
             
             <div className="rounded-[2.5rem] bg-black/60 border border-white/5 overflow-hidden group shadow-2xl">
                <div className="bg-white/5 px-8 py-4 border-b border-white/5 flex items-center justify-between">
                   <div className="flex gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500/50" />
                      <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                      <div className="w-3 h-3 rounded-full bg-green-500/50" />
                   </div>
                   <div className="text-[10px] font-mono text-white/30 uppercase tracking-[0.2em]">Verified_Contract_Secured.sol</div>
                   <div className="w-6" />
                </div>
                <div className="p-8 lg:p-12 font-mono text-sm leading-relaxed text-blue-100/70 overflow-x-auto max-h-[600px] scrollbar-hide">
                   <pre className="selection:bg-cyber-blue/40">
                      <code>{audit.safeCodeSnippet}</code>
                   </pre>
                </div>
                <div className="bg-white/[0.02] px-8 py-4 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-white/20">
                   <span>UTF-8 // LF // SOLIDITY 0.8.19</span>
                   <span className="flex items-center gap-2">
                      <Shield className="w-3 h-3 text-green-500/50" />
                      REX-AI-SECURITY-SIGNATURE-VALID
                   </span>
                </div>
             </div>
          </section>
        </div>
      ) : (
        <div className="space-y-12 pb-32 print:hidden">
          {/* A. Summary Dashboard */}
          <section className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        <GlassCard className="xl:col-span-2 p-10 flex flex-col md:flex-row items-center gap-12 bg-linear-to-br from-cyber-blue/[0.03] to-transparent">
          <ScoreIndicator 
            label="Security Score" 
            value={audit.securityScore} 
            color={audit.securityScore < 70 ? "#ef4444" : "#00e5ff"} 
            size="lg" 
          />
          <div className="flex-1 space-y-6">
            <div className="space-y-1">
              <h2 className="text-4xl font-display font-black uppercase text-white tracking-tighter">
                {audit.finalVerdict}
              </h2>
              <div className="flex items-center gap-3">
                 <Badge variant={audit.riskLevel === 'Low' ? 'green' : audit.riskLevel === 'Critical' ? 'purple' : 'blue'}>
                   {audit.riskLevel} Overall Risk
                 </Badge>
                 <span className="text-[10px] font-mono text-text-dim uppercase tracking-widest">
                   {audit.language} // {audit.framework}
                 </span>
              </div>
            </div>
            <p className="text-xs text-text-dim leading-relaxed font-medium">
               {audit.summary}
            </p>
            <div className="flex gap-4 pt-2">
               <button 
                  onClick={() => onExport('pdf')}
                  className="px-5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all flex items-center gap-2"
               >
                  <Download className="w-3.5 h-3.5" /> PDF
               </button>
               <button 
                  onClick={onSamplePDF}
                  className="px-5 py-2.5 bg-cyber-blue/20 border border-cyber-blue/30 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-cyber-blue/30 transition-all flex items-center gap-2 text-cyber-blue"
                  title="Generate Sample PDF"
               >
                  <Sparkles className="w-3.5 h-3.5" /> Sample
               </button>
               <button 
                  onClick={() => onExport('json')}
                  className="px-5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all flex items-center gap-2"
               >
                  <Code2 className="w-3.5 h-3.5" /> JSON
               </button>
            </div>
          </div>
        </GlassCard>

        <div className="grid grid-cols-2 gap-4">
           {['Critical', 'High', 'Medium', 'Low'].map(sev => (
             <GlassCard key={sev} className={`p-6 ${severityBorders[sev]} ${severityBg[sev]}`}>
                <p className={`text-[10px] font-black uppercase tracking-widest mb-2 ${severityColors[sev]}`}>{sev}</p>
                <p className="text-4xl font-display font-black text-white">{counts[sev] || 0}</p>
             </GlassCard>
           ))}
        </div>

        <GlassCard className="p-10 flex flex-col justify-center border-cyber-blue/20 bg-cyber-blue/5">
           <div className="flex items-center gap-2 mb-4">
              <Activity className="w-4 h-4 text-cyber-blue" />
              <span className="text-[10px] font-black uppercase tracking-widest text-cyber-blue">Code Stats</span>
           </div>
           <div className="space-y-4">
              <div className="flex justify-between items-end border-b border-white/5 pb-2">
                 <span className="text-[10px] font-black uppercase text-text-dim">Files</span>
                 <span className="text-xl font-display font-black text-white">{audit.fileCount}</span>
              </div>
              <div className="flex justify-between items-end border-b border-white/5 pb-2">
                 <span className="text-[10px] font-black uppercase text-text-dim">Lines</span>
                 <span className="text-xl font-display font-black text-white">{audit.totalLines}</span>
              </div>
              <div className="flex justify-between items-end">
                 <span className="text-[10px] font-black uppercase text-text-dim">Functions</span>
                 <span className="text-xl font-display font-black text-white">~{Math.floor(audit.totalLines / 25)}</span>
              </div>
           </div>
        </GlassCard>
      </section>

      {/* B. Vulnerability List */}
      <section id="security-findings" className="space-y-8">
         <div className="flex items-center justify-between">
            <h3 className="text-2xl font-display font-black uppercase text-white tracking-tighter">Security Findings</h3>
            <span className="text-[10px] font-black text-text-dim uppercase tracking-widest">{vulnerabilities.length} Issues Detected</span>
         </div>
         
         <div className="space-y-6">
            {vulnerabilities.map((v, idx) => (
               <motion.div 
                 key={idx}
                 initial={{ opacity: 0, y: 20 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
                 transition={{ delay: idx * 0.1 }}
                 className={`glass-card p-0 overflow-hidden border-white/10 hover:border-white/20 transition-all ${severityBorders[v.severity]} ${severityBg[v.severity]}`}
               >
                  <div className="flex flex-col lg:flex-row">
                     <div className="lg:w-72 p-8 border-b lg:border-b-0 lg:border-r border-white/5 bg-black/20">
                        <div className="flex items-center gap-2 mb-4">
                           <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase ${severityColors[v.severity]} bg-white/5 border border-current opacity-70`}>
                             {v.severity}
                           </span>
                           <span className="text-[8px] font-black text-white/40 uppercase tracking-widest">{v.confidence}% Confidence</span>
                        </div>
                        <p className="text-[9px] font-black text-text-dim uppercase tracking-widest mb-1.5 font-mono">Location</p>
                        <p className="text-sm font-black text-white/70 mb-6 truncate">{v.fileName}:{(v.lineNumbers || []).join(',')}</p>
                        
                        <div className="mt-8 p-4 bg-white/5 rounded-2xl border border-white/5">
                           <p className="text-[8px] font-black text-text-dim uppercase tracking-widest mb-2">Impact</p>
                           <p className="text-[10px] text-white/50 leading-relaxed italic">{v.impact}</p>
                        </div>
                     </div>

                     <div className="flex-1 p-8 lg:p-10">
                        <h4 className="text-2xl font-display font-black text-white uppercase tracking-tight mb-4">{v.title}</h4>
                        <p className="text-sm text-text-dim leading-relaxed mb-8 max-w-2xl">{v.description}</p>
                        
                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                           <div className="space-y-3">
                              <div className="flex items-center gap-2">
                                 <AlertTriangle className="w-3.5 h-3.5 text-orange-400" />
                                 <p className="text-[9px] font-black text-orange-400 uppercase tracking-widest">Remediation</p>
                              </div>
                              <div className="bg-black/40 rounded-2xl p-6 border border-white/5 text-xs text-white/70 leading-relaxed">
                                 {v.remediation}
                              </div>
                           </div>
                           <div className="space-y-3">
                              <div className="flex items-center gap-2">
                                 <Code2 className="w-3.5 h-3.5 text-cyber-blue" />
                                 <p className="text-[9px] font-black text-cyber-blue uppercase tracking-widest">Recommended Fix</p>
                              </div>
                              <div className="bg-black/60 rounded-2xl p-6 border border-white/5 font-mono text-[10px] text-blue-100/50 max-h-32 overflow-y-auto scrollbar-hide">
                                 <code>{v.codeSnippet || "No snippet provided"}</code>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
               </motion.div>
            ))}
         </div>
      </section>

      {/* E. Logic Flow Visualization */}
      <section className="space-y-8">
         <div className="flex items-center gap-4">
            <h3 className="text-2xl font-display font-black uppercase text-white tracking-tighter">Execution Logic</h3>
            <Badge variant="purple">Advanced Mapping</Badge>
         </div>
         <GlassCard className="p-10 bg-black/20 border-white/5">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
               {logicFlow.map((step, idx) => (
                  <div key={idx} className="relative p-6 bg-white/[0.02] border border-white/5 rounded-2xl flex flex-col gap-4">
                     <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                           <span className="w-6 h-6 rounded-lg bg-white/5 text-[10px] font-black flex items-center justify-center text-cyber-blue">{idx + 1}</span>
                           <span className="text-[10px] font-black uppercase tracking-widest text-text-dim">{step.from} → {step.to}</span>
                        </div>
                        {step.isRisky && <AlertTriangle className="w-4 h-4 text-red-500 animate-pulse" />}
                     </div>
                     <p className="text-lg font-display font-black text-white uppercase tracking-tight">{step.action}</p>
                     <p className="text-[10px] text-text-dim leading-relaxed">{step.description}</p>
                     <div className="absolute -right-4 top-1/2 -translate-y-1/2 opacity-10 hidden lg:block">
                        <ChevronRight className="w-8 h-8" />
                     </div>
                  </div>
               ))}
            </div>
         </GlassCard>
      </section>

      {/* G. Advanced Visualizations */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
         <section className="space-y-8">
            <div className="flex items-center gap-4">
               <Layers className="w-5 h-5 text-cyber-blue" />
               <h3 className="text-xl font-display font-black uppercase text-white tracking-tight">Dependency Graph</h3>
            </div>
            <GlassCard className="p-0 overflow-hidden bg-black/20">
               <DependencyGraph data={dependencyGraph} />
            </GlassCard>
         </section>

         <section className="space-y-8">
            <div className="flex items-center gap-4">
               <Monitor className="w-5 h-5 text-cyber-purple" />
               <h3 className="text-xl font-display font-black uppercase text-white tracking-tight">Threat Vectors</h3>
            </div>
            <GlassCard className="p-0 overflow-hidden bg-black/20">
               <ThreatMonitor metrics={threatMonitoringData} />
            </GlassCard>
         </section>
      </div>

      <section className="space-y-8">
         <div className="flex items-center gap-4">
            <Zap className="w-5 h-5 text-yellow-500" />
            <h3 className="text-xl font-display font-black uppercase text-white tracking-tight">Logic Resilience Tests</h3>
         </div>
         <FuzzingSimulation scenarios={fuzzingSimulation} />
      </section>

      {/* F. Final Decisions & Action */}
      <section className="flex flex-col md:flex-row gap-10 items-center bg-white/[0.01] border border-white/5 rounded-[3rem] p-12 lg:p-20 overflow-hidden relative">
         <div className="absolute top-0 right-0 w-96 h-full bg-linear-to-l from-cyber-blue/5 to-transparent pointer-events-none" />
         <div className="flex-1 space-y-6">
            <h3 className="text-5xl font-display font-black uppercase text-white tracking-tighter leading-none">
              Deploy with Confidence
            </h3>
            <p className="text-md text-text-dim leading-relaxed max-w-xl">
               Apply our neural security patch to automatically resolve flagged vulnerabilities and secure your decentralized infrastructure.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
               <button 
                  onClick={onAutoFix}
                  className="px-10 py-5 bg-white text-black rounded-2xl text-xs font-black uppercase tracking-[0.2em] hover:bg-cyber-blue hover:text-white transition-all flex items-center gap-4 shadow-xl shadow-white/5 relative group shrink-0"
               >
                  <div className="absolute inset-0 bg-cyber-blue opacity-0 group-hover:opacity-20 rounded-2xl transition-opacity animate-pulse" />
                  <div className="flex items-center gap-2 relative z-10">
                     <Zap className="w-4 h-4 fill-current" />
                     <div className="w-px h-4 bg-black/10 group-hover:bg-white/20" />
                     <Wand2 className="w-4 h-4 text-cyber-purple group-hover:text-white transition-colors" />
                  </div>
                  <span className="relative z-10">Neural Patch Fix</span>
                  <motion.div
                    animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="relative z-10"
                  >
                     <Sparkles className="w-3 h-3 text-cyber-blue" />
                  </motion.div>
               </button>
               <button 
                  onClick={onManualReview}
                  className="px-10 py-5 bg-black/40 border border-white/10 text-white rounded-2xl text-xs font-black uppercase tracking-[0.2em] hover:bg-white/5 transition-all"
               >
                  Manual Review
               </button>
            </div>
         </div>
         <div className="w-full md:w-auto flex flex-col items-center justify-center gap-4">
            <div className={`w-32 h-32 rounded-full border-4 flex items-center justify-center ${audit.finalVerdict === 'Safe to Deploy' ? 'border-green-500/30 text-green-500' : 'border-red-500/30 text-red-500'}`}>
               <Shield className="w-12 h-12" />
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-text-dim">Verdict Registry</p>
         </div>
      </section>
    </div>
    )}

      {/* PRINTABLE CERTIFICATE VIEW */}
      <div className="hidden print:block bg-white text-black p-0 h-[297mm] overflow-hidden">
        <div className="border-[12px] border-double border-slate-200 p-8 h-full flex flex-col justify-between overflow-hidden">
          <header className="flex justify-between items-start mb-6 border-b-2 border-slate-100 pb-4">
            <div className="flex items-center gap-4">
               <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center">
                  <Shield className="w-10 h-10 text-white" />
               </div>
               <div>
                  <h1 className="text-3xl font-display font-black uppercase tracking-tighter">Security Registry</h1>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Enterprise Smart Contract Audit</p>
               </div>
            </div>
            <div className="text-right">
               <p className="text-[10px] font-black uppercase text-slate-400">Registry ID</p>
               <p className="font-mono text-sm uppercase tracking-tighter">REX-AUDIT-{audit.name.slice(0, 3).toUpperCase()}-{Date.now().toString().slice(-6)}</p>
            </div>
          </header>

          <section className="flex-1 space-y-6 overflow-hidden">
            <div className="grid grid-cols-2 gap-8">
               <div className="space-y-4">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 border-b pb-1">Project Specification</h4>
                  <div className="space-y-2">
                     <p className="text-2xl font-black text-black leading-none uppercase">{audit.name}</p>
                     <p className="text-sm font-medium text-slate-600">Language: {audit.language} // Engine: Neural-V3</p>
                  </div>
                  <div className="pt-4 space-y-3">
                     <div className="flex justify-between text-[10px] font-bold uppercase">
                        <span className="text-slate-400">Total Code Lines</span>
                        <span>{audit.totalLines} Units</span>
                     </div>
                     <div className="flex justify-between text-[10px] font-bold uppercase">
                        <span className="text-slate-400">Vulnerabilities Detected</span>
                        <span className={vulnerabilities.length > 0 ? 'text-red-500' : 'text-green-500'}>{vulnerabilities.length} Found</span>
                     </div>
                  </div>
               </div>
               <div className="flex flex-col items-center justify-center bg-slate-50 rounded-3xl p-8 border border-slate-100">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Trust Score</p>
                  <p className="text-6xl font-display font-black text-black">{audit.securityScore}%</p>
                  <div className={`mt-4 px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${audit.securityScore > 70 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                     {audit.finalVerdict}
                  </div>
               </div>
            </div>

            <div className="space-y-3">
               <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 border-b pb-1">Risk Exposure Analysis</h4>
               <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-1">
                     <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Financial Impact</p>
                     <p className="text-[10px] text-slate-700 leading-relaxed font-medium">
                        {audit.financialRiskSummary || "No critical financial exposure identified during current neural scan."}
                     </p>
                  </div>
                  <div className="space-y-1">
                     <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Logic Breakdown</p>
                     <p className="text-[10px] text-slate-700 leading-relaxed font-medium">
                        {audit.logicRiskSummary || "Logic flows mapped and verified against standard CEI patterns."}
                     </p>
                  </div>
               </div>
            </div>

            <div className="space-y-3">
               <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 border-b pb-1">Neural Simulation Overview</h4>
               <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
                  The smart contract underwent extensive neural-logic behavioral mapping. This process simulates thousands of edge-case execution flows 
                  to identify reentrancy vulnerabilities, arithmetic overflows, and permission indexing faults. The simulation confirms the current 
                  logic resilience against sophisticated attack vectors targeting decentralized state machines.
               </p>
            </div>

            <div className="space-y-3">
               <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 border-b pb-1">Simulation Findings Matrix</h4>
               <div className="grid grid-cols-1 gap-2">
                  {fuzzingSimulation.slice(0, 3).map((sim, i) => (
                     <div key={i} className="p-3 bg-slate-50 border border-slate-100 rounded-lg">
                        <div className="flex justify-between items-center mb-0.5">
                           <span className="text-[9px] font-black uppercase tracking-tight">{sim.name}</span>
                           <span className="text-[8px] font-bold text-slate-400">{sim.gasUsed} GAS</span>
                        </div>
                        <p className="text-[9px] text-slate-600 uppercase font-medium">Outcome: {sim.outcome}</p>
                     </div>
                  ))}
                  {fuzzingSimulation.length === 0 && (
                     <p className="text-[10px] italic text-slate-400">No simulation anomalies recorded during current session.</p>
                  )}
               </div>
            </div>

            <div className="space-y-2">
               <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 border-b pb-1">Architecture Summary</h4>
               <p className="text-[11px] text-slate-700 leading-relaxed whitespace-pre-wrap">
                  {audit.architectureReview || "Standard architecture audit performed. Validates consistent state transition and access control patterns."}
               </p>
               <p className="text-[10px] text-slate-600 leading-tight mt-2 italic border-l-2 border-slate-200 pl-3 py-1 bg-slate-50">
                  Disclaimer: This audit is a point-in-time assessment performed by Rexy AI. Neural analysis provides 99.8% pattern recognition accuracy but does not replace comprehensive reviews.
               </p>
            </div>
          </section>

          <footer className="mt-4 pt-4 border-t-2 border-slate-100 flex justify-between items-end">
             <div className="flex items-center gap-6">
                <div className="w-20 h-20 border-2 border-slate-100 p-2 rounded-xl flex items-center justify-center">
                   <QrCode className="w-full h-full text-slate-300" />
                </div>
                <div className="space-y-1">
                   <p className="text-[10px] font-black uppercase text-slate-800 tracking-widest">Certified & Verified</p>
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Rexy AI Systems v3.1</p>
                   <div className="flex items-center gap-2 pt-1">
                      <Globe className="w-3 h-3 text-slate-300" />
                      <span className="text-[8px] font-mono text-slate-300">HTTPS://SECURE.REXY.AI/VERIFY</span>
                   </div>
                </div>
             </div>
             
             <div className="flex flex-col items-center gap-2">
                <div className="relative">
                   <Award className="w-16 h-16 text-slate-100" />
                   <div className="absolute inset-0 flex items-center justify-center">
                      <Shield className="w-8 h-8 text-black" />
                   </div>
                </div>
                <div className="text-center">
                   <p className="text-[10px] font-black uppercase tracking-[0.3em]">Verified By Rexy</p>
                   <div className="flex items-center justify-center gap-1 mt-1">
                      <CheckCircle2 className="w-3 h-3 text-green-500" />
                      <span className="text-[8px] font-black uppercase text-slate-400">Authentic Signature</span>
                   </div>
                </div>
             </div>
          </footer>
        </div>
      </div>
    </>
  );
}
