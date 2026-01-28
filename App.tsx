
import React, { useState, useEffect } from 'react';
import { ModuleType, ProtocolStats, UserState } from './types';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import RouterConsole from './components/RouterConsole';
import LiquidityManager from './components/LiquidityManager';
import ReserveManagerModule from './components/ReserveManagerModule';
import AttestationCenter from './components/AttestationCenter';
import CreditRegistry from './components/CreditRegistry';
import AdminConsole from './components/AdminConsole';
import TerminalFeed from './components/TerminalFeed';
import ShadowSimulator from './components/ShadowSimulator';

const App: React.FC = () => {
  const [activeModule, setActiveModule] = useState<ModuleType>(ModuleType.DASHBOARD);
  const [logs, setLogs] = useState<{msg: string, type: 'info' | 'warn' | 'success' | 'cmd', timestamp: string}[]>([]);
  
  const [stats, setStats] = useState<ProtocolStats>({
    tvl: 125400000,
    usdSovrSupply: 45000000,
    collateralRatio: 125.4,
    usdcReserves: 56430000,
    activePools: 14,
    totalTransactions: 8432
  });

  const [user, setUser] = useState<UserState>({
    usdcBalance: 250000,
    usdSovrBalance: 120000,
    role: 'ADMIN',
    address: undefined 
  });

  const addLog = (msg: string, type: 'info' | 'warn' | 'success' | 'cmd' = 'info') => {
    const timestamp = new Date().toLocaleTimeString('en-GB', { hour12: false });
    setLogs(prev => [...prev.slice(-49), { msg, type, timestamp }]);
  };

  const connectWallet = (address: string) => {
    setUser(prev => ({ ...prev, address }));
    addLog(`Wallet Connected: ${address.slice(0, 6)}...${address.slice(-4)}`, "success");
  };

  const disconnectWallet = () => {
    setUser(prev => ({ ...prev, address: undefined }));
    addLog("Wallet Disconnected", "warn");
  };

  useEffect(() => {
    addLog("Initializing SOVR V2 Secure Environment...", "info");
    addLog("Listening to EIP-712 Attestation Events...", "cmd");
    
    const interval = setInterval(() => {
      const events = [
        "Block #19432105 validated by Keeper Node #04",
        "Liquidity Pool #01 TWAP update: $0.9984",
        "New Settlement Request [TX-9029] pending signature",
        "Reserve Manager: Collateral Ratio sweep completed",
      ];
      addLog(events[Math.floor(Math.random() * events.length)], "info");
    }, 12000);
    return () => clearInterval(interval);
  }, []);

  const renderModule = () => {
    switch (activeModule) {
      case ModuleType.DASHBOARD:
        return <Dashboard stats={stats} user={user} />;
      case ModuleType.ROUTER:
        return <RouterConsole user={user} setUser={setUser} addLog={addLog} />;
      case ModuleType.LIQUIDITY:
        return <LiquidityManager user={user} />;
      case ModuleType.RESERVE:
        return <ReserveManagerModule stats={stats} user={user} setUser={setUser} />;
      case ModuleType.ATTESTATION:
        return <AttestationCenter user={user} addLog={addLog} />;
      case ModuleType.CREDIT_REGISTRY:
        return <CreditRegistry />;
      case ModuleType.ADMIN:
        return <AdminConsole user={user} />;
      case ModuleType.SIMULATOR:
        return <ShadowSimulator stats={stats} addLog={addLog} />;
      default:
        return <Dashboard stats={stats} user={user} />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-950 text-slate-200 overflow-hidden relative">
      <div className="scanline"></div>
      
      <Sidebar activeModule={activeModule} onModuleChange={setActiveModule} />
      
      <div className="flex-1 flex flex-col min-w-0 border-l border-slate-800/50">
        <Header 
          user={user} 
          stats={stats} 
          onModuleChange={setActiveModule} 
          onConnect={connectWallet} 
          onDisconnect={disconnectWallet} 
        />
        
        <main className="flex-1 overflow-y-auto p-8 relative bg-[#020617]">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-600/5 blur-[120px] rounded-full -mr-64 -mt-64"></div>
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyan-600/5 blur-[120px] rounded-full -ml-64 -mb-64"></div>
          
          <div className="max-w-7xl mx-auto space-y-8 relative z-10">
            {renderModule()}
          </div>
        </main>

        <TerminalFeed logs={logs} />
      </div>
    </div>
  );
};

export default App;
