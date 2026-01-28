
import React from 'react';
import { UserState } from '../types';

const LiquidityManager: React.FC<{ user: UserState }> = ({ user }) => {
  const pools = [
    { id: 'POOL-01', tokens: ['USDC', 'usdSOVR'], fee: 0.05, tvl: 45000000, apr: 12.4, type: 'PRIVATE' },
    { id: 'POOL-02', tokens: ['usdSOVR', 'ETH'], fee: 0.3, tvl: 12000000, apr: 28.1, type: 'PROGRAMMABLE' },
    { id: 'POOL-03', tokens: ['USDT', 'usdSOVR'], fee: 0.01, tvl: 8500000, apr: 8.5, type: 'PRIVATE' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-white">Liquidity Pools</h2>
          <p className="text-sm text-slate-500">Manage programmable and private liquidity instances</p>
        </div>
        <button className="bg-orange-600 hover:bg-orange-500 text-white font-bold px-6 py-2.5 rounded-xl transition-all shadow-lg shadow-orange-500/20">
          Create New Pool
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {pools.map(pool => (
          <div key={pool.id} className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden hover:border-slate-700 transition-all group">
            <div className="p-5 border-b border-slate-800 bg-slate-900/30 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  <div className="w-6 h-6 rounded-full bg-orange-500 border border-slate-900 flex items-center justify-center text-[10px] font-bold">U</div>
                  <div className="w-6 h-6 rounded-full bg-emerald-500 border border-slate-900 flex items-center justify-center text-[10px] font-bold">S</div>
                </div>
                <span className="font-bold text-slate-200">{pool.tokens.join(' / ')}</span>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${pool.type === 'PRIVATE' ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20' : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'}`}>
                {pool.type}
              </span>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-slate-500 mb-1">TVL</p>
                  <p className="text-lg font-mono text-white">${(pool.tvl / 1000000).toFixed(1)}M</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">APR</p>
                  <p className="text-lg font-mono text-emerald-400">{pool.apr}%</p>
                </div>
              </div>
              <div className="pt-2">
                <button className="w-full py-2 bg-slate-800 hover:bg-slate-700 group-hover:bg-orange-600/10 group-hover:text-orange-400 group-hover:border-orange-500/30 border border-slate-700 rounded-lg text-xs font-bold transition-all">
                  Manage Position
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LiquidityManager;
