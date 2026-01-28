
import React from 'react';
import { ModuleType } from '../types';

interface SidebarProps {
  activeModule: ModuleType;
  onModuleChange: (module: ModuleType) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeModule, onModuleChange }) => {
  const items = [
    { id: ModuleType.DASHBOARD, label: 'Control', icon: 'fa-cube' },
    { id: ModuleType.SIMULATOR, label: 'War Room', icon: 'fa-tower-observation' },
    { id: ModuleType.ROUTER, label: 'Router', icon: 'fa-compass' },
    { id: ModuleType.LIQUIDITY, label: 'Liquidity', icon: 'fa-droplet' },
    { id: ModuleType.RESERVE, label: 'Vault', icon: 'fa-vault' },
    { id: ModuleType.ATTESTATION, label: 'Proofs', icon: 'fa-fingerprint' },
    { id: ModuleType.CREDIT_REGISTRY, label: 'Ledger', icon: 'fa-book-open' },
    { id: ModuleType.ADMIN, label: 'Security', icon: 'fa-shield-halved' },
  ];

  return (
    <aside className="w-[88px] lg:w-64 bg-[#010409] border-r border-slate-800/80 flex flex-col transition-all duration-300 relative z-20">
      <div className="h-16 flex items-center px-6 border-b border-slate-800/50">
        <div className="w-8 h-8 rounded-lg bg-orange-600 flex items-center justify-center text-white shadow-lg shadow-orange-600/30 font-bold text-lg">
          Ω
        </div>
        <div className="ml-3 hidden lg:block overflow-hidden">
          <h1 className="text-lg font-bold tracking-tighter text-white">SOVR<span className="text-orange-500 ml-1">ENGINE</span></h1>
          <p className="text-[9px] text-slate-600 font-bold uppercase tracking-widest leading-none">V2.4 Secure</p>
        </div>
      </div>

      <nav className="flex-1 px-3 py-6 space-y-2">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => onModuleChange(item.id)}
            className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all relative group ${
              activeModule === item.id
                ? 'bg-white/[0.03] text-white border border-white/10'
                : 'text-slate-500 hover:text-slate-300 hover:bg-white/[0.02]'
            }`}
          >
            <div className={`w-5 h-5 flex items-center justify-center transition-all ${activeModule === item.id ? 'text-orange-400' : ''}`}>
              <i className={`fas ${item.icon} text-sm`}></i>
            </div>
            <span className={`text-[11px] font-bold uppercase tracking-widest hidden lg:block transition-all ${activeModule === item.id ? 'translate-x-1' : ''}`}>
              {item.label}
            </span>
            {activeModule === item.id && (
              <div className="absolute left-0 w-1 h-4 bg-orange-500 rounded-r-full"></div>
            )}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800/50">
        <div className="hidden lg:block space-y-4">
           <div className="p-4 glass-panel rounded-xl border border-slate-800/80">
              <div className="flex items-center justify-between mb-3">
                 <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Network Load</span>
                 <span className="mono text-[9px] text-emerald-400">Stable</span>
              </div>
              <div className="flex gap-1">
                 {[40, 60, 30, 80, 50, 90, 40].map((h, i) => (
                   <div key={i} className="flex-1 bg-slate-800 rounded-t-sm relative h-6">
                      <div className="absolute bottom-0 w-full bg-orange-500/30 transition-all" style={{ height: `${h}%` }}></div>
                   </div>
                 ))}
              </div>
           </div>
           
           <div className="flex items-center gap-3 px-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="mono text-[10px] text-slate-600">Sync: 100%</span>
           </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
