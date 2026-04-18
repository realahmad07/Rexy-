import React from 'react';
import { Shield, LucideIcon } from 'lucide-react';
import { motion } from 'motion/react';

interface CardProps {
  title: string;
  icon?: LucideIcon;
  children: React.ReactNode;
  className?: string;
  delay?: number;
  key?: React.Key;
}

export function GlassCard({ title, icon: Icon, children, className = "", delay = 0 }: CardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay }}
      className={`glass-card ${className}`}
    >
      <div className="accent-glow" />
      
      {title && (
        <div className="flex items-center justify-between mb-4">
          <p className="card-title">{title}</p>
          {Icon && <Icon className="w-4 h-4 text-cyber-blue opacity-50" />}
        </div>
      )}
      
      <div className="relative z-10 h-full flex flex-col">
        {children}
      </div>
    </motion.div>
  );
}

export function Badge({ children, variant = 'blue' }: { children: React.ReactNode, variant?: 'blue' | 'purple' | 'green' }) {
  const colors = {
    blue: 'bg-cyber-blue/10 text-cyber-blue border-cyber-blue/30',
    purple: 'bg-cyber-purple/10 text-cyber-purple border-cyber-purple/30',
    green: 'bg-green-500/10 text-green-400 border-green-500/30',
  };
  
  return (
    <span className={`px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-bold border ${colors[variant]}`}>
      {children}
    </span>
  );
}

export function ScoreIndicator({ label, value, color }: { label: string, value: number, color: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="relative w-12 h-12 flex items-center justify-center">
        <svg className="w-full h-full -rotate-90">
          <circle
            cx="24"
            cy="24"
            r="20"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            className="text-white/5"
          />
          <motion.circle
            cx="24"
            cy="24"
            r="20"
            fill="none"
            stroke={color}
            strokeWidth="3"
            strokeDasharray="125.6"
            initial={{ strokeDashoffset: 125.6 }}
            animate={{ strokeDashoffset: 125.6 - (125.6 * value) / 100 }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </svg>
        <span className="absolute text-[10px] font-bold">{value}</span>
      </div>
      <span className="text-[8px] uppercase tracking-widest text-text-dim mt-2 font-bold">{label}</span>
    </div>
  );
}
