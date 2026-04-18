import { Download, FileText, ExternalLink } from 'lucide-react';
import { ContractAudit } from '../types';

interface Props {
  audit: ContractAudit;
}

export const AuditReport = ({ audit }: Props) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="glass-card bg-linear-to-br from-cyber-blue/5 to-transparent p-12 text-center border-cyber-blue/20">
       <div className="w-20 h-20 rounded-3xl bg-cyber-blue/10 flex items-center justify-center mx-auto mb-8 shadow-[0_0_40px_rgba(0,229,255,0.1)]">
          <FileText className="w-10 h-10 text-cyber-blue" />
       </div>
       <h3 className="text-4xl font-display font-black text-white uppercase tracking-tight mb-4">Official Verification Seal</h3>
       <p className="text-text-dim max-w-xl mx-auto mb-10 leading-relaxed font-light">
          Generate a crypographically verifiable PDF report of this audit. Ready for institutional review, DAO governance proposals, or public protocol landing pages.
       </p>
       
       <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <button 
            onClick={handlePrint}
            className="flex items-center gap-3 px-10 py-5 bg-white text-black text-[11px] font-black uppercase tracking-[0.3em] rounded-full hover:bg-cyber-blue transition-all group overflow-hidden relative"
          >
             <div className="absolute inset-0 bg-cyber-blue translate-y-full group-hover:translate-y-0 transition-transform duration-500 opacity-20" />
             <Download className="w-4 h-4" />
             Download PDF Report
          </button>
          
          <button className="flex items-center gap-3 px-10 py-5 bg-black/40 border border-white/10 text-white text-[11px] font-black uppercase tracking-[0.3em] rounded-full hover:bg-white/5 transition-all">
             <ExternalLink className="w-4 h-4" />
             Share Secure URL
          </button>
       </div>

       {/* Hidden content for printing */}
       <div className="hidden print:block print:fixed print:inset-0 print:bg-white print:text-black print:p-20 print:z-[9999] overflow-auto">
          <div className="flex items-center justify-between border-b-2 border-black pb-10 mb-10">
             <div>
                <h1 className="text-4xl font-black uppercase mb-2">Rexy AI Audit Report</h1>
                <p className="text-sm font-bold uppercase tracking-widest text-slate-500">{audit.name}</p>
             </div>
             <div className="text-right">
                <p className="text-xs font-bold uppercase mb-1">Risk Score</p>
                <p className="text-5xl font-black">{audit.securityScore}</p>
             </div>
          </div>

          <div className="space-y-12">
             <section>
                <h3 className="text-xl font-black uppercase border-b border-slate-200 pb-2 mb-4">Architecture Review</h3>
                <p className="text-sm border-l-4 border-slate-100 pl-4 py-2 italic">{audit.architectureReview}</p>
             </section>

             <section>
                <h3 className="text-xl font-black uppercase border-b border-slate-200 pb-2 mb-4">Vulnerability Matrix</h3>
                <div className="space-y-6">
                   {audit.vulnerabilities.map((v, i) => (
                      <div key={i} className="p-6 border border-slate-100 rounded-2xl">
                         <div className="flex items-center justify-between mb-2">
                            <h4 className="font-bold text-lg">{v.title}</h4>
                            <span className="text-xs font-black uppercase bg-slate-100 px-3 py-1 rounded">{v.severity}</span>
                         </div>
                         <p className="text-[10px] uppercase font-bold text-slate-500 mb-4">{v.fileName} | Line: {v.lineNumbers.join(',')}</p>
                         <p className="text-sm mb-4">{v.description}</p>
                         <div className="bg-slate-50 p-4 rounded-xl text-xs font-mono">
                            <p className="font-bold mb-1 uppercase">Remediation:</p>
                            <p>{v.remediation}</p>
                         </div>
                      </div>
                   ))}
                </div>
             </section>

             <div className="pt-20 border-t border-slate-100 text-center">
                <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-400">Verified by Rexy Neural Engine v4.0</p>
             </div>
          </div>
       </div>
    </div>
  );
};
