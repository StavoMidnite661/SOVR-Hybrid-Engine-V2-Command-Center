
import React from 'react';
import { ProtocolStats, UserState } from '../types';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface DashboardProps {
  stats: ProtocolStats;
  user: UserState;
}

const mockChartData = [
  { name: '01 May', tvl: 110, volume: 12 },
  { name: '05 May', tvl: 115, volume: 18 },
  { name: '10 May', tvl: 108, volume: 15 },
  { name: '15 May', tvl: 122, volume: 22 },
  { name: '20 May', tvl: 125, volume: 19 },
  { name: '25 May', tvl: 128, volume: 25 },
  { name: '30 May', tvl: 125.4, volume: 21 },
];

const Dashboard: React.FC<DashboardProps> = ({ stats, user }) => {
  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            Command Center
            <span className="text-xs font-mono font-bold bg-orange-500/10 text-orange-400 px-2 py-1 rounded border border-orange-500/20 uppercase tracking-widest">Live Node</span>
          </h2>
          <p className="text-slate-500 mt-1 max-w-lg">Operational overview of the SOVR Hybrid Engine. Metrics reflect real-time consensus on <strong>usdSOVR</strong> stability.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 glass-panel border border-slate-700 rounded-lg text-xs font-bold hover:border-orange-500/50 transition-all flex items-center gap-2">
            <i className="fas fa-rotate text-orange-400"></i> Hard Refresh
          </button>
          <button className="px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-lg text-xs font-bold shadow-lg shadow-orange-600/20 transition-all">
            Snapshot State
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatModule label="Capital In-Custody" value={`$${(stats.tvl / 1000000).toFixed(1)}M`} sub="Total Value Locked" color="orange" />
        <StatModule label="usdSOVR Supply" value={`$${(stats.usdSovrSupply / 1000000).toFixed(1)}M`} sub="Total usdSOVR Minted" color="orange" />
        <StatModule label="Reserve Liquidity" value={`$${(stats.usdcReserves / 1000000).toFixed(1)}M`} sub="USDC Liquid Reserves" color="cyan" />
        <StatModule label="Node Topology" value={`${stats.activePools} Active`} sub="Isolated Liquidity Pools" color="amber" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-panel rounded-2xl p-6 border-glow-orange">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400">Reserve Expansion Analysis</h3>
              <p className="text-xs text-slate-600 mt-1">Correlation: USDC Inflow / usdSOVR Minting</p>
            </div>
            <div className="flex bg-slate-900/50 p-1 rounded-lg border border-slate-800">
              {['1H', '1D', '1W', 'ALL'].map(t => (
                <button key={t} className={`px-3 py-1 text-[10px] font-bold rounded ${t === '1W' ? 'bg-orange-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}>
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockChartData}>
                <defs>
                  <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} strokeOpacity={0.5} />
                <XAxis dataKey="name" stroke="#475569" fontSize={10} tickLine={false} axisLine={false} tickMargin={10} />
                <YAxis stroke="#475569" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val}M`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#020617', border: '1px solid rgba(249, 115, 22, 0.2)', borderRadius: '12px' }}
                  itemStyle={{ color: '#fb923c', fontSize: '12px' }}
                  labelStyle={{ color: '#64748b', fontSize: '10px', marginBottom: '4px' }}
                />
                <Area type="monotone" dataKey="tvl" stroke="#f97316" strokeWidth={3} fillOpacity={1} fill="url(#chartGradient)" animationDuration={1500} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="glass-panel rounded-2xl p-6 border-glow-orange flex-1">
             <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-6">Engine Vitality</h3>
             <div className="space-y-6">
               <VitalBar label="usdSOVR Peg" value={99.98} color="cyan" unit="%" />
               <VitalBar label="Oracle Latency" value={0.84} color="orange" unit="s" inverse />
               <VitalBar label="Reserve Ratio" value={stats.collateralRatio} color="emerald" unit="%" />
               <VitalBar label="Memory Pool" value={14} color="amber" unit="TX" />
             </div>
          </div>
          
          <div className="glass-panel rounded-2xl p-6 border border-emerald-500/20 bg-emerald-500/[0.02]">
            <div className="flex justify-between items-center mb-4">
               <h3 className="text-sm font-bold text-emerald-400">Compliance Verified</h3>
               <i className="fas fa-shield-check text-emerald-400"></i>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed mb-4">
              Audit matched circulating <strong>usdSOVR</strong> supply within 0.001% variance.
            </p>
            <button className="w-full py-2 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold rounded uppercase transition-all">
              Download Audit Hash
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatModule: React.FC<{ label: string; value: string; sub: string; color: string }> = ({ label, value, sub, color }) => {
  const colors: any = {
    orange: 'from-orange-500/10 border-orange-500/20 text-orange-400 icon-orange',
    cyan: 'from-cyan-500/10 border-cyan-500/20 text-cyan-400 icon-cyan',
    amber: 'from-amber-500/10 border-amber-500/20 text-amber-400 icon-amber',
    purple: 'from-orange-500/10 border-orange-500/20 text-orange-400 icon-orange', // mapped purple to orange
  };

  return (
    <div className={`glass-panel p-5 rounded-2xl border bg-gradient-to-br ${colors[color].split(' ')[0]} ${colors[color].split(' ')[1]} transition-all hover:scale-[1.02] duration-300 group`}>
      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.15em] mb-1">{label}</p>
      <p className={`text-2xl font-bold mono ${colors[color].split(' ')[2]}`}>{value}</p>
      <p className="text-[10px] text-slate-600 mt-3 font-medium flex items-center gap-1">
        <span className="w-1 h-1 rounded-full bg-slate-700"></span> {sub}
      </p>
    </div>
  );
};

const VitalBar: React.FC<{ label: string; value: number; color: string; unit: string; inverse?: boolean }> = ({ label, value, color, unit, inverse }) => {
  const colorMap: any = {
    cyan: 'bg-cyan-500',
    orange: 'bg-orange-500',
    emerald: 'bg-emerald-500',
    amber: 'bg-amber-500',
  };
  
  const percentage = Math.min(100, inverse ? (100 - (value * 10)) : value);

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center text-[10px] font-bold">
        <span className="text-slate-500 uppercase tracking-widest">{label}</span>
        <span className="mono text-white">{value}{unit}</span>
      </div>
      <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
        <div className={`h-full ${colorMap[color]} transition-all duration-1000`} style={{ width: `${percentage}%` }}></div>
      </div>
    </div>
  );
};

export default Dashboard;
