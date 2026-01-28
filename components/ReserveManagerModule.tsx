
import React, { useState } from 'react';
import { ProtocolStats, UserState } from '../types';

interface ReserveManagerModuleProps {
  stats: ProtocolStats;
  user: UserState;
  setUser: React.Dispatch<React.SetStateAction<UserState>>;
}

const ReserveManagerModule: React.FC<ReserveManagerModuleProps> = ({ stats, user, setUser }) => {
  const [activeTab, setActiveTab] = useState<'MINT' | 'REDEEM'>('MINT');
  const [amount, setAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleAction = () => {
    if (!amount) return;
    setIsProcessing(true);
    setTimeout(() => {
      const val = Number(amount);
      if (activeTab === 'MINT') {
        setUser(prev => ({
          ...prev,
          usdcBalance: prev.usdcBalance - val,
          usdSovrBalance: prev.usdSovrBalance + val
        }));
      } else {
        setUser(prev => ({
          ...prev,
          usdSovrBalance: prev.usdSovrBalance - val,
          usdcBalance: prev.usdcBalance + val
        }));
      }
      setIsProcessing(false);
      setAmount('');
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800">
          <p className="text-xs text-slate-500 uppercase font-bold mb-1">Current Ratio</p>
          <p className="text-3xl font-mono text-emerald-400">{stats.collateralRatio}%</p>
          <div className="mt-4 h-1 w-full bg-slate-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-emerald-500" 
              style={{ width: `${Math.min(100, stats.collateralRatio)}%` }}
            ></div>
          </div>
          <p className="text-[10px] text-slate-500 mt-2">Target Min: 110%</p>
        </div>
        <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800">
          <p className="text-xs text-slate-500 uppercase font-bold mb-1">Total Reserves</p>
          <p className="text-3xl font-mono text-white">${(stats.usdcReserves / 1000000).toFixed(2)}M</p>
          <p className="text-[10px] text-orange-400 mt-2 flex items-center gap-1">
            <i className="fas fa-check-circle"></i> Verifiable on-chain
          </p>
        </div>
        <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800">
          <p className="text-xs text-slate-500 uppercase font-bold mb-1">Circulating usdSOVR</p>
          <p className="text-3xl font-mono text-white">{(stats.usdSovrSupply / 1000000).toFixed(2)}M</p>
          <p className="text-[10px] text-slate-500 mt-2 italic">Pegged 1:1 to USD</p>
        </div>
      </div>

      <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden">
        <div className="flex border-b border-slate-800">
          <button 
            onClick={() => setActiveTab('MINT')}
            className={`flex-1 py-4 text-sm font-bold transition-all ${activeTab === 'MINT' ? 'bg-orange-600/10 text-orange-400 border-b-2 border-orange-500' : 'text-slate-500 hover:text-slate-300'}`}
          >
            MINT usdSOVR
          </button>
          <button 
            onClick={() => setActiveTab('REDEEM')}
            className={`flex-1 py-4 text-sm font-bold transition-all ${activeTab === 'REDEEM' ? 'bg-orange-600/10 text-orange-400 border-b-2 border-orange-500' : 'text-slate-500 hover:text-slate-300'}`}
          >
            REDEEM usdSOVR
          </button>
        </div>

        <div className="p-8">
          <div className="max-w-md mx-auto space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <div className="flex justify-between mb-4">
                <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">
                  {activeTab === 'MINT' ? 'Deposit USDC' : 'Burn usdSOVR'}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  Balance: {activeTab === 'MINT' ? user.usdcBalance.toLocaleString() : user.usdSovrBalance.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center gap-4">
                <input 
                  type="number" 
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="bg-transparent text-3xl font-mono text-white outline-none w-full"
                  placeholder="0.00"
                />
                <div className="bg-slate-800 px-3 py-1 rounded-lg font-bold text-xs">
                  {activeTab === 'MINT' ? 'USDC' : 'usdSOVR'}
                </div>
              </div>
            </div>

            <div className="space-y-3 px-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">You will receive</span>
                <span className="text-orange-400 font-mono">{amount || '0.00'} {activeTab === 'MINT' ? 'usdSOVR' : 'USDC'}</span>
              </div>
            </div>

            <button 
              onClick={handleAction}
              disabled={!amount || isProcessing}
              className={`w-full py-4 rounded-xl text-lg font-bold transition-all ${
                !amount || isProcessing 
                  ? 'bg-slate-800 text-slate-600 cursor-not-allowed'
                  : 'bg-orange-600 text-white hover:bg-orange-500 active:scale-[0.98]'
              }`}
            >
              {isProcessing ? <i className="fas fa-spinner animate-spin"></i> : activeTab === 'MINT' ? 'Confirm Minting' : 'Confirm Redemption'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReserveManagerModule;
