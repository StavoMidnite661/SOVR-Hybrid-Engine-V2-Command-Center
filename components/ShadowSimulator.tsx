
import React, { useState, useEffect } from 'react';
import { ProtocolStats } from '../types';

interface Node {
  id: string;
  x: number;
  y: number;
  label: string;
  type: 'VAULT' | 'HUB' | 'ORACLE' | 'USER';
  status: 'OPTIMAL' | 'REBALANCING' | 'AT_RISK' | 'OFFLINE';
  value: string;
}

const ShadowSimulator: React.FC<{ stats: ProtocolStats, addLog: (m: string, t?: any) => void }> = ({ stats, addLog }) => {
  const [simulationActive, setSimulationActive] = useState(false);
  const [stressLevel, setStressLevel] = useState(2);
  const [scenario, setScenario] = useState('NORMAL');
  const [stagedTx, setStagedTx] = useState({ amount: '500000', type: 'SWAP' });
  const [stabilityScore, setStabilityScore] = useState(98);
  const [projectedImpact, setProjectedImpact] = useState<string | null>(null);

  const nodes: Node[] = [
    { id: 'U1', x: 10, y: 250, label: 'Your Wallet', type: 'USER', status: 'OPTIMAL', value: 'Staged' },
    { id: 'V1', x: 30, y: 120, label: 'Vault Alpha (USDC)', type: 'VAULT', status: stressLevel > 7 ? 'AT_RISK' : 'OPTIMAL', value: '$12.4M' },
    { id: 'V2', x: 30, y: 380, label: 'Vault Beta (ETH)', type: 'VAULT', status: scenario === 'CASCADE' ? 'REBALANCING' : 'OPTIMAL', value: '$8.1M' },
    { id: 'H1', x: 60, y: 250, label: 'Settlement Hub', type: 'HUB', status: 'OPTIMAL', value: '99.9% Sync' },
    { id: 'O1', x: 90, y: 250, label: 'Global Oracle', type: 'ORACLE', status: 'OPTIMAL', value: '1.0001' },
  ];

  const scenarios = [
    { id: 'NORMAL', label: 'Standard Load', desc: 'Baseline protocol performance under typical volume.' },
    { id: 'DEPEG', label: 'USDC Volatility', desc: 'Simulates a 5% deviation in external stablecoin peg.' },
    { id: 'CASCADE', label: 'Black Swan', desc: 'Mass liquidation event and rapid vault rebalancing.' },
  ];

  const startSimulation = () => {
    setSimulationActive(true);
    setProjectedImpact(null);
    addLog(`War Room: Injecting hypothetical ${stagedTx.amount} ${stagedTx.type} into shadow state...`, 'cmd');
    
    // Simulate kinetic calculation stages
    setTimeout(() => {
      const impact = (Number(stagedTx.amount) / stats.tvl) * 100 * (stressLevel / 2);
      setProjectedImpact(impact.toFixed(4));
      setStabilityScore(Math.max(40, 98 - (stressLevel * 4) - (scenario === 'CASCADE' ? 20 : 0)));
      addLog("Shadow Projection: State mapping complete. See Stability Gauge for delta.", "success");
      setSimulationActive(false);
    }, 2500);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      {/* Purpose Header */}
      <div className="glass-panel rounded-3xl p-6 border-orange-500/20 bg-orange-600/[0.02]">
        <div className="flex flex-col md:flex-row justify-between gap-6">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
              <i className="fas fa-tower-observation text-orange-500"></i>
              Shadow Execution Sandbox
            </h2>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed uppercase tracking-wider font-medium">
              This is a <span className="text-orange-400">risk-free environment</span>. Use the controls below to stage complex transactions or simulate external market shocks. The engine calculates the "Kinetic Delta"—how the protocol's liquidity and stability rebalance *before* you sign on-chain.
            </p>
          </div>
          <div className="flex items-center gap-4 bg-black/40 p-4 rounded-2xl border border-slate-800">
             <div className="text-right">
                <p className="text-[9px] font-bold text-slate-500 uppercase">Current Stability Projection</p>
                <p className={`text-2xl font-mono font-bold ${stabilityScore > 80 ? 'text-emerald-500' : stabilityScore > 60 ? 'text-amber-500' : 'text-rose-500'}`}>
                   {stabilityScore}%
                </p>
             </div>
             <div className="w-12 h-12 rounded-full border-4 border-slate-800 flex items-center justify-center relative">
                <svg className="w-full h-full transform -rotate-90">
                   <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-slate-800" />
                   <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="4" fill="transparent" 
                     className={stabilityScore > 80 ? 'text-emerald-500' : 'text-orange-500'}
                     strokeDasharray={125.6}
                     strokeDashoffset={125.6 - (125.6 * stabilityScore) / 100}
                   />
                </svg>
             </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Visual Mapping Engine */}
        <div className="lg:col-span-3 glass-panel rounded-[32px] border-glow-orange h-[540px] relative overflow-hidden bg-slate-950/40">
           {/* Grid Pattern */}
           <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'linear-gradient(#f97316 1px, transparent 1px), linear-gradient(90deg, #f97316 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
           
           <svg className="absolute inset-0 w-full h-full pointer-events-none">
             {/* Dynamic Network Pathing */}
             <path d="M 10% 250 L 30% 120 L 60% 250 L 90% 250" stroke="url(#flowGradient)" strokeWidth="1" fill="none" className={`transition-opacity duration-1000 ${simulationActive ? 'opacity-100 animate-pulse' : 'opacity-10'}`} />
             <path d="M 10% 250 L 30% 380 L 60% 250 L 90% 250" stroke="url(#flowGradient)" strokeWidth="1" fill="none" className={`transition-opacity duration-1000 ${simulationActive ? 'opacity-100 animate-pulse' : 'opacity-10'}`} />
             <defs>
               <linearGradient id="flowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                 <stop offset="0%" stopColor="#f97316" />
                 <stop offset="100%" stopColor="#06b6d4" />
               </linearGradient>
             </defs>
           </svg>

           {nodes.map(node => (
             <div 
              key={node.id} 
              className="absolute transform -translate-x-1/2 -translate-y-1/2 group transition-all duration-700"
              style={{ left: `${node.x}%`, top: `${node.y}px` }}
             >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border-2 transition-all duration-500 relative ${
                  simulationActive ? 'border-orange-500 bg-orange-500/10 scale-110 shadow-[0_0_30px_rgba(249,115,22,0.4)]' : 
                  node.status === 'AT_RISK' ? 'border-rose-500 bg-rose-500/10' :
                  node.status === 'REBALANCING' ? 'border-amber-500 bg-amber-500/10 animate-pulse' :
                  'border-slate-800 bg-slate-900 text-slate-400'
                }`}>
                   <i className={`fas ${node.type === 'VAULT' ? 'fa-vault' : node.type === 'HUB' ? 'fa-microchip' : node.type === 'USER' ? 'fa-user-astronaut' : 'fa-satellite-dish'}`}></i>
                   
                   {/* Status Indicator Dot */}
                   <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-slate-950 ${
                     node.status === 'OPTIMAL' ? 'bg-emerald-500' : node.status === 'AT_RISK' ? 'bg-rose-500 animate-ping' : 'bg-amber-500'
                   }`}></div>
                </div>
                <div className="absolute top-full mt-4 left-1/2 transform -translate-x-1/2 whitespace-nowrap text-center">
                   <p className="text-[10px] font-bold text-white uppercase tracking-widest">{node.label}</p>
                   <p className={`text-[9px] mono font-bold mt-0.5 ${simulationActive ? 'text-orange-400' : 'text-slate-600'}`}>{node.value}</p>
                </div>
             </div>
           ))}

           {projectedImpact && (
             <div className="absolute top-8 left-1/2 transform -translate-x-1/2 p-6 glass-panel rounded-3xl border border-emerald-500/30 animate-in zoom-in duration-500 text-center">
                <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-[0.3em] mb-1">State Analysis Result</p>
                <p className="text-xl font-mono text-white">Projected Slippage: <span className="text-emerald-400">{projectedImpact}%</span></p>
                <p className="text-[9px] text-slate-500 mt-2 italic uppercase">System can absorb this volume with high stability.</p>
             </div>
           )}
        </div>

        {/* Sidebar Controls */}
        <div className="space-y-6">
           <div className="glass-panel rounded-3xl p-6 border-slate-800">
              <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-4">Stage Transaction</h3>
              <div className="space-y-4">
                 <div className="bg-black/40 p-4 rounded-2xl border border-slate-800">
                    <label className="text-[9px] font-bold text-slate-500 uppercase block mb-2">Amount (USDC)</label>
                    <input 
                      type="text" 
                      value={stagedTx.amount}
                      onChange={(e) => setStagedTx({ ...stagedTx, amount: e.target.value })}
                      className="bg-transparent text-xl mono font-bold text-white outline-none w-full"
                    />
                 </div>
                 <div className="flex gap-2">
                    <button className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-[10px] font-bold rounded-xl transition-all">SWAP</button>
                    <button className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-[10px] font-bold rounded-xl transition-all">MINT</button>
                 </div>
              </div>
           </div>

           <div className="glass-panel rounded-3xl p-6 border-slate-800">
              <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-4">Select Shock Scenario</h3>
              <div className="space-y-2">
                 {scenarios.map(s => (
                   <button 
                    key={s.id}
                    onClick={() => setScenario(s.id)}
                    className={`w-full p-3 rounded-2xl border text-left transition-all ${
                      scenario === s.id ? 'bg-orange-600/10 border-orange-500/50' : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                    }`}
                   >
                      <p className={`text-[11px] font-bold uppercase ${scenario === s.id ? 'text-orange-400' : 'text-slate-300'}`}>{s.label}</p>
                      <p className="text-[9px] text-slate-500 mt-1 leading-tight">{s.desc}</p>
                   </button>
                 ))}
              </div>
           </div>

           <div className="glass-panel rounded-3xl p-6 border-slate-800">
              <div className="flex justify-between mb-4">
                 <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Global Stress</span>
                 <span className="text-[10px] mono text-white">{stressLevel}x</span>
              </div>
              <input 
                type="range" min="1" max="10" 
                value={stressLevel} onChange={(e) => setStressLevel(Number(e.target.value))}
                className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-orange-500" 
              />
              <div className="flex justify-between mt-2 text-[8px] font-bold text-slate-600 uppercase">
                <span>Safe</span>
                <span>Critical</span>
              </div>
           </div>

           <button 
             onClick={startSimulation}
             disabled={simulationActive}
             className="w-full py-4 bg-orange-600 hover:bg-orange-500 text-white rounded-2xl font-bold uppercase tracking-widest shadow-xl shadow-orange-600/20 transition-all flex items-center justify-center gap-3"
           >
             {simulationActive ? (
               <><i className="fas fa-circle-notch animate-spin"></i> PROJECTING...</>
             ) : (
               <><i className="fas fa-bolt"></i> RUN PROJECTION</>
             )}
           </button>
        </div>
      </div>
    </div>
  );
};

export default ShadowSimulator;
