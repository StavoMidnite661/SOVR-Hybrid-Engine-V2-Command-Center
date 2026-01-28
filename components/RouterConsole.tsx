
import React, { useState } from 'react';
import { UserState } from '../types';

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
      addLog(`Swap Confirmed. Block #19432108. Hash: 0x${Math.random().toString(16).slice(2)}`, 'success');
      
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
    // Allow only positive numbers and decimals
    if (val === '' || (/^\d*\.?\d*$/.test(val))) {
      setAmount(val);
    }
  };

  const setMaxAmount = () => {
    setAmount(currentBalance.toString());
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col lg:flex-row gap-8 items-start animate-in slide-in-from-bottom-4 duration-700">
      <div className="flex-1 glass-panel rounded-3xl p-8 border-glow-orange relative overflow-hidden">
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

      <div className="w-full lg:w-80 space-y-6">
         <div className="glass-panel rounded-2xl p-6 border-slate-800">
            <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-6">Execution Path</h4>
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
      </div>
    </div>
  );
};

export default RouterConsole;
