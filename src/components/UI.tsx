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
    blue: 'bg-cyber-blue/10 text-cyber-blue border-cyber-blue/30 shadow-[0_0_15px_rgba(0,229,255,0.1)]',
    purple: 'bg-cyber-purple/10 text-cyber-purple border-cyber-purple/30 shadow-[0_0_15px_rgba(188,19,254,0.1)]',
    green: 'bg-green-500/10 text-green-400 border-green-500/30 shadow-[0_0_15px_rgba(34,197,94,0.1)]',
  };
  
  return (
    <span className={`px-3 py-1 rounded-full text-[9px] uppercase tracking-widest font-black border backdrop-blur-md ${colors[variant]} ${className}`}>
      {children}
    </span>
  );
}

export function ScoreIndicator({ label, value, color, size = "md" }: { label: string, value: number, color: string, size?: "sm" | "md" | "lg" }) {
  const dimensions = {
    sm: 64,
    md: 96,
    lg: 160
  };
  
  const textSize = {
    sm: "text-xs",
    md: "text-xl",
    lg: "text-5xl"
  };

  const dim = dimensions[size];
  const center = dim / 2;
  const strokeWidth = size === "lg" ? 6 : 4;
  const radius = (dim - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className="flex flex-col items-center group">
      <div className="relative flex items-center justify-center" style={{ width: dim, height: dim }}>
        <div className="absolute inset-0 bg-white/[0.02] rounded-full blur-xl group-hover:blur-2xl transition-all" />
        <svg 
          width={dim} 
          height={dim} 
          viewBox={`0 0 ${dim} ${dim}`} 
          className="-rotate-90"
        >
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-white/5"
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
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            style={{ filter: `drop-shadow(0 0 8px ${color})` }}
          />
        </svg>
        <span className={`absolute ${textSize[size]} font-display font-black tracking-tighter`}>{value}</span>
      </div>
      <span className="text-[10px] uppercase tracking-widest text-text-dim mt-4 font-black">{label}</span>
    </div>
  );
}
