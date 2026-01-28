
import React, { useEffect, useRef, useState } from 'react';

interface Log {
  msg: string;
  type: 'info' | 'warn' | 'success' | 'cmd';
  timestamp: string;
}

const TerminalFeed: React.FC<{ logs: Log[] }> = ({ logs }) => {
  const endRef = useRef<HTMLDivElement>(null);
  const [latency, setLatency] = useState(24);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  // Simulate real-time protocol pulse latency updates
  useEffect(() => {
    const interval = setInterval(() => {
      const delta = Math.floor(Math.random() * 5) - 2; // -2 to +2 variation
      setLatency(prev => Math.max(12, Math.min(60, prev + delta)));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const typeColor = (type: Log['type']) => {
    switch (type) {
      case 'success': return 'text-emerald-400';
      case 'warn': return 'text-rose-400';
      case 'cmd': return 'text-orange-400';
      default: return 'text-slate-500';
    }
  };

  return (
    <div className="h-32 bg-[#010409] border-t border-slate-800/80 flex flex-col overflow-hidden group">
      <div className="flex items-center justify-between px-6 py-2 bg-slate-900/30 border-b border-slate-800/50">
        <div className="flex items-center gap-6">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">System Logs / Protocol Pulse</span>
          
          <div className="flex items-center gap-5 border-l border-slate-800 pl-6">
            <div className="flex items-center gap-2">
              <div className="relative w-1.5 h-1.5">
                <div className="absolute inset-0 bg-orange-500 rounded-full animate-ping opacity-40"></div>
                <div className="relative w-1.5 h-1.5 rounded-full bg-orange-500"></div>
              </div>
              <span className="text-[9px] mono text-orange-400/90 font-bold tracking-tight animate-pulse">Secure_Socket: Est.</span>
            </div>

            <div className="flex items-center gap-2 px-3 py-0.5 rounded-full bg-black/40 border border-slate-800/50">
              <span className="text-[8px] font-black text-slate-600 uppercase tracking-tighter">Latency</span>
              <span className={`text-[9px] mono font-bold transition-all duration-500 ${latency > 45 ? 'text-amber-500' : 'text-emerald-500'}`}>
                {latency}ms
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex gap-4">
          <button className="text-[9px] mono text-slate-600 hover:text-slate-400 transition-colors uppercase font-bold">Clear Feed</button>
          <button className="text-[9px] mono text-slate-600 hover:text-slate-400 transition-colors uppercase font-bold">Export .log</button>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-1 font-mono text-[11px] leading-relaxed">
        {logs.map((log, i) => (
          <div key={i} className="flex gap-4 group/item hover:bg-white/[0.02] transition-colors">
            <span className="text-slate-700 select-none">[{log.timestamp}]</span>
            <span className={`flex-1 ${typeColor(log.type)}`}>
              <span className="mr-2 text-slate-800 opacity-30">|</span>
              {log.msg}
            </span>
          </div>
        ))}
        <div ref={endRef} />
      </div>
    </div>
  );
};

export default TerminalFeed;
