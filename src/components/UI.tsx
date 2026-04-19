import React from 'react';
import { Shield, LucideIcon } from 'lucide-react';
import { motion } from 'motion/react';

interface CardProps {
  title?: string;
  icon?: LucideIcon;
  children: React.ReactNode;
  className?: string;
  delay?: number;
  key?: React.Key;
}

export function GlassCard({ title, icon: Icon, children, className = "", delay = 0 }: CardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
      className={`glass-card group ${className}`}
    >
      <div className="accent-glow group-hover:opacity-30 transition-opacity duration-500" />
      
      {title && (
        <div className="flex items-center justify-between mb-6">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/50 group-hover:text-cyber-blue transition-colors">{title}</p>
          {Icon && <Icon className="w-4 h-4 text-cyber-blue opacity-30 group-hover:opacity-100 transition-all duration-500" />}
        </div>
      )}
      
      <div className="relative z-10 h-full flex flex-col">
        {children}
      </div>
    </motion.div>
  );
}

export function Badge({ children, variant = 'blue', className = "" }: { children: React.ReactNode, variant?: 'blue' | 'purple' | 'green', className?: string }) {
  const colors = {
    blue: 'bg-cyber-blue/5 text-cyber-blue border-cyber-blue/20',
    purple: 'bg-cyber-purple/5 text-cyber-purple border-cyber-purple/20',
    green: 'bg-emerald-500/5 text-emerald-400 border-emerald-500/20',
  };
  
  return (
    <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold tracking-tight border backdrop-blur-sm ${colors[variant]} ${className}`}>
      {children}
    </span>
  );
}

export function ScoreIndicator({ label, value, color, size = "md" }: { label: string, value: number, color: string, size?: "sm" | "md" | "lg" }) {
  const dimensions = {
    sm: 64,
    md: 88,
    lg: 140
  };
  
  const textSize = {
    sm: "text-xs",
    md: "text-xl",
    lg: "text-4xl"
  };

  const dim = dimensions[size];
  const center = dim / 2;
  const strokeWidth = size === "lg" ? 8 : 4;
  const radius = (dim - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className="flex flex-col items-center group">
      <div className="relative flex items-center justify-center p-4 border border-white/5 rounded-3xl bg-white/[0.01]" style={{ width: dim + 40, height: dim + 40 }}>
        <div className="absolute inset-0 bg-white/[0.01] rounded-3xl group-hover:bg-white/[0.03] transition-all" />
        <svg 
          width={dim} 
          height={dim} 
          viewBox={`0 0 ${dim} ${dim}`} 
          className="-rotate-90 relative z-10"
        >
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-white/[0.03]"
          />
          <motion.circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: circumference - (circumference * value) / 100 }}
            transition={{ duration: 1.5, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            strokeLinecap="round"
          />
        </svg>
        <span className={`absolute ${textSize[size]} font-display font-medium tracking-tight text-white z-20`}>{value}</span>
      </div>
      <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-dim/60 mt-4 px-1">{label}</span>
    </div>
  );
}
