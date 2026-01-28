
import React, { useState } from 'react';

const CreditRegistry: React.FC = () => {
  const [filter, setFilter] = useState('ALL');

  const logs = [
    { id: 'E-1024', type: 'ISSUANCE', amount: 500000, date: '2024-05-24 14:22', status: 'VERIFIED', counterparty: 'Institutional Vault A' },
    { id: 'E-1023', type: 'SETTLEMENT', amount: 25000, date: '2024-05-24 12:10', status: 'VERIFIED', counterparty: 'Retail Merchant Bridge' },
    { id: 'E-1022', type: 'PAYMENT', amount: 12000, date: '2024-05-24 10:45', status: 'PENDING', counterparty: 'E-Commerce Gateway' },
    { id: 'E-1021', type: 'SETTLEMENT', amount: 142000, date: '2024-05-24 09:12', status: 'VERIFIED', counterparty: 'Liquidity Provider 09' },
    { id: 'E-1020', type: 'DEFAULT', amount: 450, date: '2024-05-23 23:55', status: 'FAILED', counterparty: 'Micro-Credit Pool X' },
    { id: 'E-1019', type: 'ISSUANCE', amount: 1000000, date: '2024-05-23 18:30', status: 'VERIFIED', counterparty: 'SOVR Reserve Manager' },
  ];

  return (
    <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden">
      <div className="p-6 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <i className="fas fa-book-bookmark text-amber-400"></i>
            Credit Event Ledger
          </h2>
          <p className="text-xs text-slate-500 mt-1">Immutable on-chain audit trail for all protocol settlements</p>
        </div>
        <div className="flex gap-2">
          {['ALL', 'VERIFIED', 'PENDING', 'FAILED'].map(t => (
            <button 
              key={t}
              onClick={() => setFilter(t)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                filter === t ? 'bg-orange-600/10 text-orange-400 border-orange-500/30' : 'bg-slate-900 text-slate-500 border-slate-800 hover:border-slate-700'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-900/50 border-b border-slate-800">
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-500">Event ID</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-500">Type</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-500">Counterparty</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-500">Amount</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-500">Timestamp</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-500">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {logs.filter(l => filter === 'ALL' || l.status === filter).map(log => (
              <tr key={log.id} className="hover:bg-slate-900/30 transition-colors group">
                <td className="px-6 py-4">
                  <span className="mono text-orange-400 text-xs font-bold">{log.id}</span>
                </td>
                <td className="px-6 py-4">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase ${
                    log.type === 'DEFAULT' ? 'text-rose-400 bg-rose-400/5 border-rose-400/20' : 
                    log.type === 'ISSUANCE' ? 'text-emerald-400 bg-emerald-400/5 border-emerald-400/20' :
                    'text-orange-400 bg-orange-400/5 border-orange-400/20'
                  }`}>
                    {log.type}
                  </span>
                </td>
                <td className="px-6 py-4 text-xs text-slate-300 font-medium">{log.counterparty}</td>
                <td className="px-6 py-4 text-xs font-mono text-white">${log.amount.toLocaleString()}</td>
                <td className="px-6 py-4 text-[10px] text-slate-500 mono">{log.date}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full ${
                      log.status === 'VERIFIED' ? 'bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.5)]' : 
                      log.status === 'FAILED' ? 'bg-rose-500 shadow-[0_0_5px_rgba(244,63,94,0.5)]' : 
                      'bg-amber-500 animate-pulse'
                    }`}></div>
                    <span className="text-[10px] font-bold text-slate-400">{log.status}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="p-4 border-t border-slate-800 flex justify-between items-center text-[10px] text-slate-500 font-bold uppercase tracking-widest">
        <span>Displaying latest 50 events</span>
        <div className="flex gap-4">
          <button className="hover:text-white transition-colors">Export CSV</button>
          <button className="hover:text-white transition-colors">Verify Merkle Root</button>
        </div>
      </div>
    </div>
  );
};

export default CreditRegistry;
