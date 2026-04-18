import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Shield, Zap, Cpu, CheckCircle2, Terminal as TerminalIcon } from 'lucide-react';

interface Step {
  id: string;
  label: string;
  icon: any;
}

const steps: Step[] = [
  { id: 'parsing', label: 'Bytecode Parsing', icon: Search },
  { id: 'scanning', label: 'Threat Indexing', icon: Shield },
  { id: 'vulnerabilities', label: 'Stack Trace Analysis', icon: Zap },
  { id: 'logic', label: 'Logic Simulation', icon: Cpu },
];

const LOGS: Record<string, string[]> = {
  parsing: [
    "Reading ABI definition...",
    "Validating compiler version 0.8.19",
    "Mapping state variables to storage slots",
    "Detecting external dependencies",
    "Parsing AST for recursive definitions"
  ],
  scanning: [
    "Initializing Symbolic Execution Engine",
    "Checking for known CVE signatures",
    "Evaluating Access Control modifiers",
    "Testing for Hardcoded Address patterns",
    "Mapping Transfer sequence hooks"
  ],
  vulnerabilities: [
    "CRITICAL: Reentrancy vector identified at L.88",
    "Simulating recursive call exploitation...",
    "Analyzing 'Check-Interaction-Effect' violations",
    "Underflow check: uint256 subtraction at L.102",
    "Warning: Unchecked external call detected"
  ],
  logic: [
    "Running Fuzzing Scenario: Flashloan Attack",
    "Simulation: Outcome reverted (Balance preserved)",
    "Fuzzing Scenario: Owner Lockout test",
    "Neural mapping logic consistency: 99.8%",
    "Generating automated security patches"
  ]
};

export function AnalysisProgress({ currentStep, progress }: { currentStep: string; progress: number }) {
  const currentIndex = steps.findIndex(s => s.id === currentStep);
  const [activeLogs, setActiveLogs] = useState<string[]>([]);

  useEffect(() => {
    const currentLogs = LOGS[currentStep] || [];
    let i = 0;
    const interval = setInterval(() => {
      if (i < currentLogs.length) {
        setActiveLogs(prev => [...prev.slice(-4), `[${new Date().toLocaleTimeString('en-GB', { hour12: false })}] INF: ${currentLogs[i]}`]);
        i++;
      }
    }, 1200);
    return () => clearInterval(interval);
  }, [currentStep]);

  return (
    <div className="w-full max-w-2xl mx-auto py-8 space-y-10">
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
              <span className={`text-[9px] font-black uppercase tracking-widest ${isActive ? 'text-white' : 'text-text-dim'}`}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
      
      <div className="flex flex-col items-center gap-6">
        <div className="w-full space-y-2">
           <div className="flex justify-between items-end">
             <span className="text-[10px] font-mono text-cyber-blue uppercase tracking-widest">Neural Engine active</span>
             <span className="text-[10px] font-mono text-cyber-blue">{progress}%</span>
           </div>
           <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
             <motion.div 
               className="h-full bg-cyber-blue"
               initial={{ width: 0 }}
               animate={{ width: `${progress}%` }}
               style={{ boxShadow: '0 0 10px rgba(0, 229, 255, 0.5)' }}
             />
           </div>
        </div>

        <div className="w-full glass-card p-0 border-white/5 bg-black/40 overflow-hidden">
           <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border-b border-white/5">
              <TerminalIcon className="w-3 h-3 text-cyber-blue" />
              <span className="text-[9px] font-black uppercase tracking-widest text-text-dim">Neural Simulation Feed</span>
           </div>
           <div className="p-4 h-32 font-mono text-[10px] text-cyber-blue/60 leading-relaxed overflow-hidden">
              <AnimatePresence mode="popLayout">
                {activeLogs.map((log, i) => (
                  <motion.div
                    key={log + i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="truncate py-0.5 border-l border-cyber-blue/10 pl-3 mb-1 bg-linear-to-r from-cyber-blue/5 to-transparent"
                  >
                    {log}
                  </motion.div>
                ))}
              </AnimatePresence>
           </div>
        </div>
      </div>
    </div>
  );
}
