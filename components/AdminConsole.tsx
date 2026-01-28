
import React from 'react';
import { UserState } from '../types';

const AdminConsole: React.FC<{ user: UserState }> = ({ user }) => {
  return (
    <div className="space-y-6">
      <div className="bg-slate-950 rounded-2xl border border-slate-800 p-6">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <i className="fas fa-shield-halved text-orange-400"></i>
          Role-Based Access Control (RBAC)
        </h2>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-slate-900 rounded-xl border border-slate-800">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-orange-600/10 rounded-lg flex items-center justify-center text-orange-400">
                <i className="fas fa-user-shield"></i>
              </div>
              <div>
                <p className="text-sm font-bold">MINTER_ROLE</p>
                <p className="text-xs text-slate-500">Authorized to create new usdSOVR supply</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-slate-900 rounded-xl border border-slate-800">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-emerald-600/10 rounded-lg flex items-center justify-center text-emerald-400">
                <i className="fas fa-bolt"></i>
              </div>
              <div>
                <p className="text-sm font-bold">KEEPER_ROLE</p>
                <p className="text-xs text-slate-500">Authorized for automated pool rebalancing</p>
              </div>
            </div>
            <button className="text-xs text-orange-400 font-bold hover:underline">Manage Addresses</button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-950 rounded-2xl border border-slate-800 p-6">
          <h3 className="font-bold text-white mb-4">Risk Management Configuration</h3>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-xs text-slate-500 uppercase font-bold">Minimum Collateral Ratio</span>
                <span className="text-xs font-mono text-white">110.0%</span>
              </div>
              <input type="range" className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-orange-500" min="100" max="150" defaultValue="110" />
            </div>
            <button className="w-full py-3 bg-orange-600/10 text-orange-400 border border-orange-500/30 rounded-xl text-sm font-bold hover:bg-orange-600 hover:text-white transition-all">
              Update System Parameters
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminConsole;
