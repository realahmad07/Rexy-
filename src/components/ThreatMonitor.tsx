import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ThreatMetric } from '../services/geminiService';
import { Shield, Eye, AlertCircle } from 'lucide-react';

interface Props {
  metrics: ThreatMetric[];
}

export const ThreatMonitor = ({ metrics }: Props) => {
  // Generate some random chart data based on metrics
  const chartData = metrics.map((m, i) => ({
    name: m.timestamp,
    threatLevel: m.severity === 'Critical' ? 90 : m.severity === 'High' ? 70 : m.severity === 'Medium' ? 40 : 20,
    volume: Math.floor(Math.random() * 100)
  }));

  return (
    <div className="grid grid-cols-12 gap-8">
      <div className="col-span-12 lg:col-span-8 bg-black/40 rounded-[2.5rem] p-8 border border-white/5 relative overflow-hidden group">
        <div className="absolute inset-0 bg-cyber-blue/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
        <div className="flex items-center justify-between mb-10">
           <div>
              <h4 className="text-[10px] font-black uppercase text-cyber-blue tracking-[0.4em] mb-2">Live Intrusion Telemetry</h4>
              <p className="text-2xl font-display font-black text-white uppercase tracking-tight">Post-Patch Surveillance</p>
           </div>
           <div className="flex gap-4">
              <div className="flex items-center gap-2 bg-green-500/10 px-4 py-2 rounded-full border border-green-500/30">
                 <Shield className="w-3.5 h-3.5 text-green-400" />
                 <span className="text-[9px] font-black text-green-400 uppercase">Guardian Active</span>
              </div>
           </div>
        </div>

        <div className="h-[300px] w-full">
           <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                 <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                 <XAxis 
                   dataKey="name" 
                   stroke="rgba(255,255,255,0.3)" 
                   fontSize={10} 
                   fontWeight={700}
                   tickFormatter={(val) => val.split(' ')[0]}
                 />
                 <YAxis stroke="rgba(255,255,255,0.3)" fontSize={10} fontWeight={700} />
                 <Tooltip 
                   contentStyle={{ 
                     backgroundColor: '#111', 
                     borderRadius: '1rem', 
                     border: '1px solid rgba(255,255,255,0.1)',
                     fontSize: '10px',
                     fontFamily: 'Inter'
                   }} 
                 />
                 <Line type="monotone" dataKey="threatLevel" stroke="#bc13fe" strokeWidth={3} dot={{ fill: '#bc13fe', r: 4 }} />
                 <Line type="monotone" dataKey="volume" stroke="#00E5FF" strokeWidth={2} strokeDasharray="5 5" />
              </LineChart>
           </ResponsiveContainer>
        </div>
      </div>

      <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
         {metrics.slice(0, 4).map((m, i) => (
           <div key={i} className="glass-card p-6 flex flex-row items-center gap-5 border-white/5 hover:border-white/10 transition-all">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                m.severity === 'Critical' ? 'bg-red-500/10' : m.severity === 'High' ? 'bg-orange-500/10' : 'bg-cyber-blue/10'
              }`}>
                 {m.severity === 'Critical' ? (
                   <AlertCircle className="w-6 h-6 text-red-500" />
                 ) : (
                   <Eye className="w-6 h-6 text-cyber-blue" />
                 )}
              </div>
              <div className="flex-1 overflow-hidden">
                 <p className="text-[8px] font-black text-text-dim uppercase tracking-widest mb-1">{m.timestamp}</p>
                 <p className="text-sm font-bold text-white uppercase tracking-tight truncate">{m.event}</p>
              </div>
              <div className={`w-2 h-2 rounded-full ${
                m.severity === 'Critical' ? 'bg-red-500 shadow-[0_0_10px_#ef4444]' : 'bg-green-500 animate-pulse'
              }`} />
           </div>
         ))}
      </div>
    </div>
  );
};
