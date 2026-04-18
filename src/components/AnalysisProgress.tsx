import { motion } from 'motion/react';
import { Search, Shield, Zap, Cpu, CheckCircle2 } from 'lucide-react';

interface Step {
  id: string;
  label: string;
  icon: any;
}

const steps: Step[] = [
  { id: 'parsing', label: 'Parsing Code', icon: Search },
  { id: 'scanning', label: 'Security Scan', icon: Shield },
  { id: 'vulnerabilities', label: 'Finding Flaws', icon: Zap },
  { id: 'logic', label: 'Logic Review', icon: Cpu },
];

export function AnalysisProgress({ currentStep, progress }: { currentStep: string; progress: number }) {
  const currentIndex = steps.findIndex(s => s.id === currentStep);

  return (
    <div className="w-full max-w-2xl mx-auto py-8">
      <div className="relative flex justify-between items-center px-4">
        {/* Progress Line */}
        <div className="absolute top-1/2 left-0 w-full h-px bg-white/5 -translate-y-1/2 z-0" />
        <motion.div 
          className="absolute top-1/2 left-0 h-px bg-cyber-blue -translate-y-1/2 z-0"
          initial={{ width: 0 }}
          animate={{ width: `${(currentIndex / (steps.length - 1)) * 100}%` }}
        />

        {steps.map((step, idx) => {
          const Icon = step.icon;
          const isActive = idx <= currentIndex;
          const isCurrent = idx === currentIndex;

          return (
            <div key={step.id} className="relative z-10 flex flex-col items-center gap-3">
              <motion.div 
                className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-colors duration-500 ${
                  isActive ? 'bg-cyber-blue/10 border-cyber-blue/50 text-cyber-blue shadow-[0_0_15px_rgba(0,229,255,0.2)]' : 'bg-black/50 border-white/10 text-text-dim'
                }`}
                animate={isCurrent ? { scale: [1, 1.1, 1] } : {}}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                {isActive && idx < currentIndex ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : (
                  <Icon className="w-5 h-5" />
                )}
              </motion.div>
              <span className={`text-[10px] font-black uppercase tracking-widest ${isActive ? 'text-white' : 'text-text-dim'}`}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
      
      <div className="mt-8 flex flex-col items-center gap-2">
        <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-cyber-blue"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
          />
        </div>
        <span className="text-[10px] font-mono text-cyber-blue animate-pulse uppercase tracking-widest mt-2">
          {progress}% Analysis Complete
        </span>
      </div>
    </div>
  );
}
