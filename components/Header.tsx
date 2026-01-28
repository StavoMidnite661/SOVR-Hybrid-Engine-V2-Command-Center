
import React, { useState, useRef, useEffect } from 'react';
import { UserState, ProtocolStats, ModuleType } from '../types';

interface HeaderProps {
  user: UserState;
  stats: ProtocolStats;
  onModuleChange: (module: ModuleType) => void;
  onConnect: (address: string) => void;
  onDisconnect: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, stats, onModuleChange, onConnect, onDisconnect }) => {
  const [isQuickActionsOpen, setIsQuickActionsOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  
  const [notifSettings, setNotifSettings] = useState({
    critical: true,
    attestations: true,
    liquidity: false,
    system: true
  });

  const quickActionsRef = useRef<HTMLDivElement>(null);
  const settingsRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const quickActions = [
    { label: 'Initiate Swap', icon: 'fa-shuffle', module: ModuleType.ROUTER, color: 'text-orange-400' },
    { label: 'Deposit Liquidity', icon: 'fa-droplet', module: ModuleType.LIQUIDITY, color: 'text-cyan-400' },
    { label: 'View Latest Attestation', icon: 'fa-fingerprint', module: ModuleType.ATTESTATION, color: 'text-emerald-400' },
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (quickActionsRef.current && !quickActionsRef.current.contains(event.target as Node)) {
        setIsQuickActionsOpen(false);
      }
      if (settingsRef.current && !settingsRef.current.contains(event.target as Node)) {
        setIsSettingsOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAction = (module: ModuleType) => {
    onModuleChange(module);
    setIsQuickActionsOpen(false);
  };

  const toggleSetting = (key: keyof typeof notifSettings) => {
    setNotifSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const simulateConnect = (provider: string) => {
    const mockAddress = `0x${Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`;
    onConnect(mockAddress);
    setIsWalletModalOpen(false);
  };

  return (
    <header className="h-16 bg-[#020617] border-b border-slate-800/50 flex items-center justify-between px-8 relative z-20">
      <div className="flex items-center gap-10">
        <div className="hidden md:flex flex-col">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-[9px] font-bold uppercase tracking-widest text-slate-500">Stability Margin</span>
            <span className="text-[9px] mono text-emerald-500 font-bold">+15.4%</span>
          </div>
          <div className="flex items-center gap-3">
             <span className="text-sm font-bold mono text-white">{stats.collateralRatio.toFixed(2)}%</span>
             <div className="w-24 h-1 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500" style={{ width: '85%' }}></div>
             </div>
          </div>
        </div>

        <div className="w-px h-8 bg-slate-800/50 hidden md:block"></div>

        <div className="hidden lg:flex flex-col">
          <span className="text-[9px] font-bold uppercase tracking-widest text-slate-500 mb-0.5">Asset Bridge</span>
          <div className="flex items-center gap-4">
            <span className="text-[10px] mono text-orange-400 font-bold">ETH: $3,402.12</span>
            <span className="text-[10px] mono text-cyan-400 font-bold">USDC: $1.00</span>
            <span className="text-[10px] mono text-orange-500 font-bold">usdSOVR: $1.00</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-6">
        {/* Quick Actions Menu */}
        <div className="relative" ref={quickActionsRef}>
          <button 
            onClick={() => setIsQuickActionsOpen(!isQuickActionsOpen)}
            className={`flex items-center gap-3 px-4 py-2 rounded-xl border transition-all duration-300 ${
              isQuickActionsOpen 
                ? 'bg-orange-600/10 border-orange-500/50 text-white shadow-[0_0_15px_rgba(249,115,22,0.2)]' 
                : 'bg-slate-900/50 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
            }`}
          >
            <i className={`fas ${isQuickActionsOpen ? 'fa-times' : 'fa-plus-circle'} text-xs`}></i>
            <span className="text-[11px] font-bold uppercase tracking-widest hidden sm:block">Quick Actions</span>
            <i className="fas fa-chevron-down text-[8px] opacity-50 ml-1"></i>
          </button>

          {isQuickActionsOpen && (
            <div className="absolute right-0 mt-3 w-64 glass-panel border border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 z-50">
              <div className="p-3 bg-slate-900/30 border-b border-slate-800/50">
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest px-2">Operational Shortcuts</span>
              </div>
              <div className="p-2 space-y-1">
                {quickActions.map((action, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleAction(action.module)}
                    className="w-full flex items-center gap-4 px-3 py-3 rounded-xl hover:bg-white/[0.04] transition-all group"
                  >
                    <div className={`w-8 h-8 rounded-lg bg-slate-800/50 flex items-center justify-center ${action.color} group-hover:scale-110 transition-transform`}>
                      <i className={`fas ${action.icon} text-xs`}></i>
                    </div>
                    <span className="text-xs font-medium text-slate-300 group-hover:text-white">{action.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Wallet Connection */}
        <div className="flex items-center gap-3">
          {!user.address ? (
            <button 
              onClick={() => setIsWalletModalOpen(true)}
              className="flex items-center gap-3 px-5 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-[11px] font-bold uppercase tracking-[0.15em] transition-all shadow-lg shadow-orange-600/20"
            >
              <i className="fas fa-wallet text-xs"></i>
              Connect Wallet
            </button>
          ) : (
            <div className="relative" ref={profileRef}>
              <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-3 p-1.5 glass-panel rounded-full border border-slate-800 group hover:border-orange-500/30 transition-all"
              >
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-orange-500 to-amber-600 border border-white/10 flex items-center justify-center text-[10px] font-bold shadow-xl">
                  {user.role[0]}
                </div>
                <div className="hidden md:flex flex-col pr-4 text-left">
                  <span className="text-[11px] font-bold text-white leading-none">
                    {user.address.slice(0, 6)}...{user.address.slice(-4)}
                  </span>
                  <span className="text-[9px] font-black text-orange-400 uppercase tracking-tighter mt-1">{user.role} ACCESS</span>
                </div>
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-3 w-64 glass-panel border border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 z-50">
                  <div className="p-4 bg-slate-900/30 border-b border-slate-800/50">
                     <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1">Connected Address</p>
                     <p className="text-xs mono text-white break-all">{user.address}</p>
                  </div>
                  <div className="p-2 space-y-1">
                    <button className="w-full flex items-center gap-4 px-3 py-2.5 rounded-xl hover:bg-white/[0.04] transition-all text-slate-400 hover:text-white group">
                      <i className="fas fa-copy text-xs opacity-50"></i>
                      <span className="text-xs font-medium">Copy Address</span>
                    </button>
                    <button className="w-full flex items-center gap-4 px-3 py-2.5 rounded-xl hover:bg-white/[0.04] transition-all text-slate-400 hover:text-white group">
                      <i className="fas fa-arrow-up-right-from-square text-xs opacity-50"></i>
                      <span className="text-xs font-medium">View on Explorer</span>
                    </button>
                    <div className="h-px bg-slate-800 my-1"></div>
                    <button 
                      onClick={() => { onDisconnect(); setIsProfileOpen(false); }}
                      className="w-full flex items-center gap-4 px-3 py-2.5 rounded-xl hover:bg-rose-500/10 transition-all text-rose-500 group"
                    >
                      <i className="fas fa-power-off text-xs"></i>
                      <span className="text-xs font-bold uppercase tracking-widest">Disconnect</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button className="w-9 h-9 flex items-center justify-center text-slate-500 hover:text-white glass-panel rounded-xl border-slate-800 transition-all">
            <i className="fas fa-search text-xs"></i>
          </button>
          
          <div className="flex items-center gap-2" ref={settingsRef}>
            <button className="w-9 h-9 flex items-center justify-center text-slate-500 hover:text-white glass-panel rounded-xl border-slate-800 transition-all relative">
              <i className="fas fa-bell text-xs"></i>
              <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-rose-500 rounded-full"></span>
            </button>
            
            <div className="relative">
              <button 
                onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                className={`w-9 h-9 flex items-center justify-center transition-all glass-panel rounded-xl border ${
                  isSettingsOpen ? 'border-orange-500/50 text-white bg-orange-500/10' : 'border-slate-800 text-slate-500 hover:text-white'
                }`}
              >
                <i className="fas fa-cog text-xs"></i>
              </button>

              {isSettingsOpen && (
                <div className="absolute right-0 mt-3 w-72 glass-panel border border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 z-50">
                  <div className="p-4 bg-slate-900/30 border-b border-slate-800/50">
                    <h4 className="text-[11px] font-bold text-white uppercase tracking-widest">Notification Preferences</h4>
                    <p className="text-[9px] text-slate-500 mt-1 uppercase tracking-tighter">Manage protocol alert visibility</p>
                  </div>
                  <div className="p-4 space-y-4">
                    <SettingToggle label="Critical System Alerts" active={notifSettings.critical} onToggle={() => toggleSetting('critical')} />
                    <SettingToggle label="New Attestation Requests" active={notifSettings.attestations} onToggle={() => toggleSetting('attestations')} />
                    <SettingToggle label="Liquidity Sweep Events" active={notifSettings.liquidity} onToggle={() => toggleSetting('liquidity')} />
                    <SettingToggle label="General Protocol Updates" active={notifSettings.system} onToggle={() => toggleSetting('system')} />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* WALLET SELECT MODAL */}
      {isWalletModalOpen && (
        <div className="fixed inset-0 bg-[#020617]/90 backdrop-blur-xl flex items-center justify-center z-[200] p-6 animate-in fade-in duration-300">
          <div className="max-w-md w-full glass-panel rounded-[32px] border-orange-500/30 shadow-2xl overflow-hidden">
            <div className="p-8 border-b border-slate-800/50 flex justify-between items-center bg-slate-900/30">
              <div>
                <h2 className="text-xl font-bold text-white tracking-tight">Connect Wallet</h2>
                <p className="text-[10px] text-slate-500 uppercase tracking-[0.2em] mt-1">Select a cryptographic provider</p>
              </div>
              <button onClick={() => setIsWalletModalOpen(false)} className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-all">
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            <div className="p-6 space-y-3">
              <WalletProviderButton 
                name="MetaMask" 
                icon="https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Logo.svg" 
                onClick={() => simulateConnect('MetaMask')} 
              />
              <WalletProviderButton 
                name="Coinbase Wallet" 
                icon="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQhQ277z67yYwN16E16U-I6qW5X_O04m84y2w&s" 
                onClick={() => simulateConnect('Coinbase')} 
              />
              <WalletProviderButton 
                name="WalletConnect" 
                icon="https://avatars.githubusercontent.com/u/37784886?s=200&v=4" 
                onClick={() => simulateConnect('WalletConnect')} 
              />
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

const WalletProviderButton: React.FC<{ name: string; icon: string; onClick: () => void }> = ({ name, icon, onClick }) => (
  <button 
    onClick={onClick}
    className="w-full flex items-center justify-between p-4 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-orange-500/50 hover:bg-orange-500/5 transition-all group"
  >
    <div className="flex items-center gap-4">
      <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center overflow-hidden p-2 group-hover:scale-110 transition-transform">
        <img src={icon} alt={name} className="w-full h-full object-contain" />
      </div>
      <span className="font-bold text-slate-200 group-hover:text-white">{name}</span>
    </div>
    <i className="fas fa-chevron-right text-[10px] text-slate-600 group-hover:text-orange-400 group-hover:translate-x-1 transition-all"></i>
  </button>
);

const SettingToggle: React.FC<{ label: string; active: boolean; onToggle: () => void }> = ({ label, active, onToggle }) => (
  <div className="flex items-center justify-between group cursor-pointer" onClick={onToggle}>
    <span className={`text-[10px] font-bold transition-colors uppercase tracking-widest ${active ? 'text-slate-200' : 'text-slate-600'}`}>{label}</span>
    <div className={`w-8 h-4 rounded-full p-0.5 transition-all ${active ? 'bg-orange-600' : 'bg-slate-800'}`}>
      <div className={`w-3 h-3 rounded-full bg-white shadow-sm transition-all ${active ? 'translate-x-4' : ''}`}></div>
    </div>
  </div>
);

export default Header;
