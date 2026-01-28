
import React, { useState } from 'react';
import { UserState } from '../types';

interface SwapHistoryItem {
  id: string;
  from: string;
  to: string;
  amount: string;
  timestamp: string;
  status: 'SUCCESS' | 'PENDING';
}

interface RouterConsoleProps {
  user: UserState;
  setUser: React.Dispatch<React.SetStateAction<UserState>>;
  addLog: (msg: string, type?: 'info' | 'warn' | 'success' | 'cmd') => void;
}

const RouterConsole: React.FC<RouterConsoleProps> = ({ user, setUser, addLog }) => {
  const [fromToken, setFromToken] = useState('USDC');
  const [toToken, setToToken] = useState('usdSOVR');
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState<SwapHistoryItem[]>([]);

  const currentBalance = fromToken === 'USDC' ? user.usdcBalance : user.usdSovrBalance;
  const numAmount = Number(amount);
  const isInsufficient = numAmount > currentBalance;
  const isInvalid = numAmount <= 0 && amount !== '';

  const handleSwap = () => {
    if (!amount || isInsufficient || isInvalid || isLoading) return;
    
    setIsLoading(true);
    addLog(`Initiating Router Request: ${amount} ${fromToken} -> ${toToken}`, 'cmd');
    
    setTimeout(() => {
      setIsLoading(false);
      const val = Number(amount);
      const txId = Math.random().toString(16).slice(2, 10);
      addLog(`Swap Confirmed. Block #19432108. Hash: 0x${txId}`, 'success');
      
      const newHistoryItem: SwapHistoryItem = {
        id: txId,
        from: fromToken,
        to: toToken,
        amount: amount,
        timestamp: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
        status: 'SUCCESS'
      };

      setHistory(prev => [newHistoryItem, ...prev].slice(0, 5));
      
      setUser(prev => ({
        ...prev,
        usdcBalance: fromToken === 'USDC' ? prev.usdcBalance - val : prev.usdcBalance + val,
        usdSovrBalance: fromToken === 'usdSOVR' ? prev.usdSovrBalance - val : prev.usdSovrBalance + val
      }));
      setAmount('');
    }, 2400);
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val === '' || (/^\d*\.?\d*$/.test(val))) {
      setAmount(val);
    }
  };

  const setMaxAmount = () => {
    setAmount(currentBalance.toString());
  };

  return (
    <div className="max-w-6xl mx-auto flex flex-col xl:flex-row gap-8 items-start animate-in slide-in-from-bottom-4 duration-700">
      {/* Main Terminal */}
      <div className="flex-1 glass-panel rounded-[32px] p-8 border-glow-orange relative overflow-hidden w-full">
        <div className="flex justify-between items-center mb-10">
           <h3 className="text-lg font-bold text-white uppercase tracking-widest">Router Terminal</h3>
           <div className="flex items-center gap-2">
             <span className="text-[10px] font-bold text-slate-500 uppercase">Slippage</span>
             <span className="text-[10px] mono text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded border border-orange-500/20">0.1%</span>
           </div>
        </div>

        <div className="space-y-4">
           <div className={`bg-slate-900/80 p-6 rounded-2xl border transition-colors ${isInsufficient || isInvalid ? 'border-rose-500/50' : 'border-slate-800'}`}>
              <div className="flex justify-between mb-4">
                 <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Input</span>
                 <div className="flex items-center gap-3">
                   <span className={`text-[11px] mono ${isInsufficient ? 'text-rose-400 font-bold' : 'text-slate-500'}`}>
                     Bal: {currentBalance.toLocaleString()}
                   </span>
                   <button 
                    onClick={setMaxAmount}
                    className="text-[10px] font-black text-orange-500 hover:text-orange-400 uppercase tracking-tighter bg-orange-500/10 px-2 py-0.5 rounded border border-orange-500/20 transition-all"
                   >
                     MAX
                   </button>
                 </div>
              </div>
              <div className="flex items-center gap-6">
                 <input 
                   type="text" 
                   value={amount} 
                   onChange={handleAmountChange} 
                   placeholder="0.00" 
                   className={`bg-transparent text-4xl mono font-bold outline-none w-full transition-colors ${isInsufficient || isInvalid ? 'text-rose-400' : 'text-white'}`}
                 />
                 <select value={fromToken} onChange={(e) => setFromToken(e.target.value)} className="bg-slate-800 text-white font-bold rounded-xl px-4 py-2 text-sm border border-slate-700 outline-none">
                    <option value="USDC">USDC</option>
                    <option value="usdSOVR">usdSOVR</option>
                 </select>
              </div>
              {(isInsufficient || isInvalid) && (
                <p className="text-[10px] text-rose-500 font-bold mt-3 uppercase tracking-widest animate-pulse">
                  {isInsufficient ? 'Warning: Insufficient liquidity in wallet' : 'Warning: Amount must be greater than zero'}
                </p>
              )}
           </div>

           <div className="flex justify-center -my-6 relative z-10">
              <button 
                onClick={() => {setFromToken(toToken); setToToken(fromToken);}}
                className="w-12 h-12 rounded-2xl bg-orange-600 text-white flex items-center justify-center shadow-2xl shadow-orange-600/40 hover:scale-110 active:scale-95 transition-all border-4 border-[#020617]"
              >
                <i className="fas fa-shuffle"></i>
              </button>
           </div>

           <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800">
              <div className="flex justify-between mb-4">
                 <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Output</span>
                 <span className="text-[11px] mono text-slate-500">Bal: {(toToken === 'USDC' ? user.usdcBalance : user.usdSovrBalance).toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-6">
                 <div className="text-4xl mono font-bold text-slate-600 w-full">
                   {amount && !isInvalid ? (Number(amount) * 0.998).toFixed(2) : '0.00'}
                 </div>
                 <select value={toToken} onChange={(e) => setToToken(e.target.value)} className="bg-slate-800 text-white font-bold rounded-xl px-4 py-2 text-sm border border-slate-700 outline-none">
                    <option value="usdSOVR">usdSOVR</option>
                    <option value="USDC">USDC</option>
                 </select>
              </div>
           </div>
        </div>

        <button 
          onClick={handleSwap} 
          disabled={!amount || isInsufficient || isInvalid || isLoading}
          className={`w-full mt-10 py-5 rounded-2xl text-md font-bold uppercase tracking-widest transition-all ${
            isLoading || !amount || isInsufficient || isInvalid
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50' 
              : 'bg-orange-600 text-white hover:bg-orange-500 shadow-xl shadow-orange-600/20 active:scale-[0.98]'
          }`}
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-3">
              <i className="fas fa-circle-notch animate-spin"></i>
              Synthesizing Transaction...
            </span>
          ) : isInsufficient ? (
            'Insufficient Balance'
          ) : isInvalid ? (
            'Invalid Amount'
          ) : (
            'Execute Atomic Swap'
          )}
        </button>
      </div>

      {/* Side Utilities */}
      <div className="w-full xl:w-80 space-y-6">
         {/* Execution Path */}
         <div className="glass-panel rounded-2xl p-6 border-slate-800 bg-slate-900/20">
            <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-6 flex items-center gap-2">
              <i className="fas fa-route text-orange-400"></i>
              Execution Path
            </h4>
            <div className="relative space-y-8 pl-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-px before:bg-slate-800">
               <div className="relative">
                  <div className="absolute -left-5 w-2 h-2 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.5)]"></div>
                  <span className="block text-[10px] text-slate-400 font-bold uppercase">Liquidity Source</span>
                  <span className="block text-xs text-white mono mt-1">Uniswap V3 Vault</span>
               </div>
               <div className="relative">
                  <div className="absolute -left-5 w-2 h-2 rounded-full bg-slate-700"></div>
                  <span className="block text-[10px] text-slate-400 font-bold uppercase">Protocol Bridge</span>
                  <span className="block text-xs text-white mono mt-1">SOVR_Router_V2</span>
               </div>
               <div className="relative">
                  <div className="absolute -left-5 w-2 h-2 rounded-full bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.5)]"></div>
                  <span className="block text-[10px] text-slate-400 font-bold uppercase">Settlement</span>
                  <span className="block text-xs text-white mono mt-1">usdSOVR_Minter</span>
               </div>
            </div>
         </div>

         {/* Swap History */}
         <div className="glass-panel rounded-2xl p-6 border-slate-800 bg-slate-900/20">
            <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-6 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <i className="fas fa-clock-rotate-left text-orange-400"></i>
                Recent Swaps
              </span>
              <span className="text-[9px] text-slate-600 mono">{history.length} TX</span>
            </h4>
            
            {history.length === 0 ? (
              <div className="py-10 text-center border border-dashed border-slate-800 rounded-xl">
                 <p className="text-[10px] text-slate-600 uppercase tracking-widest font-bold">No active history</p>
              </div>
            ) : (
              <div className="space-y-3">
                {history.map(item => (
                  <div key={item.id} className="p-3 bg-black/40 rounded-xl border border-slate-800/50 group hover:border-orange-500/20 transition-all">
                    <div className="flex justify-between items-start mb-2">
                       <div className="flex items-center gap-2">
                          <span className="text-[10px] mono text-white font-bold">{item.amount}</span>
                          <span className="text-[9px] text-slate-500 uppercase font-bold">{item.from}</span>
                          <i className="fas fa-arrow-right text-[8px] text-slate-600"></i>
                          <span className="text-[9px] text-orange-400 uppercase font-bold">{item.to}</span>
                       </div>
                       <span className="text-[8px] mono text-slate-600">{item.timestamp}</span>
                    </div>
                    <div className="flex justify-between items-center">
                       <span className="text-[8px] mono text-slate-700">HASH: 0x{item.id}</span>
                       <div className="flex items-center gap-1">
                          <div className="w-1 h-1 rounded-full bg-emerald-500"></div>
                          <span className="text-[8px] font-black text-emerald-500 uppercase">Success</span>
                       </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
         </div>
      </div>
    </div>
  );
};

export default RouterConsole;
