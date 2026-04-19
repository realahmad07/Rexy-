import { motion } from 'motion/react';
import { Bug, Zap, Activity } from 'lucide-react';
import { FuzzingScenario } from '../types';

interface Props {
  scenarios: FuzzingScenario[];
}

export const FuzzingSimulation = ({ scenarios }: Props) => {
  return (
    <div className="space-y-6 flex flex-col h-full">
      <div className="grid grid-cols-1 gap-4">
        {scenarios.map((s, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card bg-linear-to-br from-white/[0.02] to-transparent p-6 group hover:border-cyber-purple/40 transition-all duration-500 flex flex-col justify-between h-full"
          >
            <div className="flex items-center justify-between mb-6">
               <div className="flex items-center gap-3">
                  <Bug className="w-4 h-4 text-cyber-purple" />
                  <span className="text-[10px] font-black uppercase text-cyber-purple tracking-widest">{s.name}</span>
               </div>
               <div className={`px-3 py-1 rounded-full border text-[9px] font-black uppercase tracking-widest ${
                 s.outcome === 'Fail' ? 'bg-green-500/10 border-green-500/30 text-green-400' : 'bg-red-500/10 border-red-500/30 text-red-400'
               }`}>
                 {s.outcome === 'Fail' ? 'Resisted' : 'Vulnerable'}
               </div>
            </div>
            
            <p className="text-xs text-text-dim mb-6 leading-relaxed flex-1">
              {s.description}
            </p>

            <div className="space-y-4">
               <div className="p-4 bg-black/40 rounded-2xl border border-white/5 font-mono text-[11px] group-hover:border-cyber-purple/20 transition-all">
                  <p className="text-[9px] font-black text-cyber-blue uppercase mb-2">Injected Payload</p>
                  <code className="text-blue-100/70 break-all whitespace-pre-wrap block">{s.attackInput}</code>
               </div>
               
               <div className="flex items-center justify-between px-2">
                  <div className="flex items-center gap-2">
                     <Zap className="w-3 h-3 text-orange-400" />
                     <span className="text-[10px] font-bold text-text-dim uppercase tracking-tighter">Gas: {s.gasUsed}</span>
                  </div>
                  <div className="flex items-center gap-2">
                     <Activity className="w-3 h-3 text-cyber-blue animate-pulse" />
                     <span className="text-[10px] font-bold text-text-dim uppercase tracking-tighter">Simulated</span>
                  </div>
               </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
