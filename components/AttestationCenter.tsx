
import React, { useState } from 'react';
import { UserState } from '../types';

interface EIP712Domain {
  name: string;
  version: string;
  chainId: number;
  verifyingContract: string;
}

interface AttestationRequest {
  id: string;
  type: string;
  target: string;
  amount: number;
  domain: string;
  domainData: EIP712Domain;
  payload: any;
}

const AttestationCenter: React.FC<{ user: UserState; addLog: (m: string, t?: any) => void; onConnectRequest?: () => void }> = ({ user, addLog, onConnectRequest }) => {
  const [isSigning, setIsSigning] = useState(false);
  const [signStep, setSignStep] = useState(0);
  const [signature, setSignature] = useState<string | null>(null);
  const [inspecting, setInspecting] = useState<AttestationRequest | null>(null);
  const [showWalletReminder, setShowWalletReminder] = useState(false);

  const pendingRequests: AttestationRequest[] = [
    { 
      id: 'AUTH-1209', 
      type: 'Settlement', 
      target: 'Central Bank Hub', 
      amount: 500000,
      domain: 'SOVR_SETTLEMENT_V2',
      domainData: {
        name: "SOVR Settlement Hub",
        version: "2.4.1",
        chainId: 1,
        verifyingContract: "0x472f6023C912C00000000000000000000000912c"
      },
      payload: {
        nonce: 4321,
        expiry: 1716584400,
        recipient: '0x9928527a...f21b',
        asset: 'usdSOVR',
        amount: 500000000000n.toString()
      }
    },
    { 
      id: 'AUTH-1210', 
      type: 'Reserve Sync', 
      target: 'Institutional Vault A', 
      amount: 0,
      domain: 'SOVR_RESERVE_V2',
      domainData: {
        name: "SOVR Reserve Manager",
        version: "2.4.0",
        chainId: 1,
        verifyingContract: "0x883a6023C912C00000000000000000000000882d"
      },
      payload: {
        merkleRoot: '0x772b9a2c...cc12',
        vaultId: 1,
        timestamp: 1716552000,
        consensusHeight: 19432105
      }
    },
  ];

  const handleSign = (req: AttestationRequest) => {
    if (!user.address) {
      setShowWalletReminder(true);
      return;
    }

    setIsSigning(true);
    setSignStep(0);
    addLog(`Initiating Cryptographic Attestation for ${req.id}...`, 'cmd');
    
    const steps = [
      "Hashing EIP-712 Payload...",
      "Communicating with Secure Enclave...",
      "Finalizing ECDSA Signature..."
    ];

    let current = 0;
    const interval = setInterval(() => {
      current++;
      if (current < steps.length) {
        setSignStep(current);
        addLog(steps[current], 'info');
      } else {
        clearInterval(interval);
        setIsSigning(false);
        const sig = '0x' + Array.from({ length: 130 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
        setSignature(sig);
        addLog(`Attestation Complete. Signature: ${sig.slice(0, 10)}...`, 'success');
      }
    }, 1200);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in zoom-in-95 duration-700">
      <div className="lg:col-span-2 space-y-8">
        <div className="glass-panel rounded-3xl p-8 border-glow-orange relative overflow-hidden">
           {showWalletReminder && !user.address && (
             <div className="absolute inset-0 z-20 bg-orange-950/40 backdrop-blur-md flex items-center justify-center p-8 animate-in fade-in duration-300">
                <div className="max-w-xs w-full glass-panel rounded-2xl border border-orange-500/30 p-6 text-center shadow-2xl">
                   <div className="w-12 h-12 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-400 mx-auto mb-4">
                      <i className="fas fa-wallet"></i>
                   </div>
                   <h4 className="text-white font-bold mb-2">Connection Required</h4>
                   <p className="text-[10px] text-slate-400 leading-relaxed mb-6 uppercase tracking-wider">You must connect a cryptographic wallet before signing protocol attestations.</p>
                   <button 
                    onClick={() => setShowWalletReminder(false)}
                    className="w-full py-3 bg-orange-600 hover:bg-orange-500 text-white rounded-xl text-xs font-bold uppercase tracking-widest transition-all"
                   >
                    Understood
                   </button>
                </div>
             </div>
           )}

           <div className="flex justify-between items-center mb-8">
              <div>
                 <h3 className="text-xl font-bold text-white tracking-tight">Attestation Center</h3>
                 <p className="text-xs text-slate-500 mt-1">Verify off-chain credit events through secure EIP-712 signatures.</p>
              </div>
              <div className="flex items-center gap-2">
                 <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Protocol Version:</span>
                 <span className="text-[10px] mono text-orange-400 font-bold">V2.4_SECURE</span>
              </div>
           </div>

           <div className="space-y-6">
              {pendingRequests.map(req => (
                <div key={req.id} className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 hover:border-orange-500/30 transition-all group relative overflow-hidden">
                   <div className="absolute top-0 left-0 w-1 h-full bg-orange-500/50 scale-y-0 group-hover:scale-y-100 transition-transform origin-top"></div>
                   
                   <div className="flex justify-between items-center mb-6">
                      <div className="flex items-center gap-4">
                         <div className="w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400 group-hover:shadow-[0_0_15px_rgba(249,115,22,0.2)] transition-all">
                            <i className="fas fa-fingerprint text-lg"></i>
                         </div>
                         <div>
                            <h4 className="font-bold text-white text-lg">{req.type} <span className="text-slate-600 ml-1 font-mono text-sm">#{req.id}</span></h4>
                            <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">Target Enclave: <span className="text-slate-300">{req.target}</span></p>
                         </div>
                      </div>
                      <div className="text-right">
                         <p className="text-xl mono font-bold text-white">${req.amount.toLocaleString()}</p>
                         <p className="text-[10px] text-orange-500 font-bold uppercase tracking-tighter">Settlement Value</p>
                      </div>
                   </div>

                   <div className="flex gap-4">
                      <button 
                        onClick={() => handleSign(req)}
                        className={`flex-[2] py-3.5 rounded-xl text-xs font-bold uppercase tracking-[0.2em] transition-all shadow-lg ${
                          !user.address 
                            ? 'bg-slate-800 text-slate-500 cursor-not-allowed shadow-none' 
                            : 'bg-orange-600 hover:bg-orange-500 text-white shadow-orange-600/10'
                        }`}
                      >
                         {user.address ? 'Sign Attestation' : 'Connect to Sign'}
                      </button>
                      <button 
                        onClick={() => setInspecting(req)}
                        className="flex-1 py-3.5 glass-panel border border-slate-700 rounded-xl text-xs font-bold text-slate-400 hover:text-white hover:border-slate-500 transition-all uppercase tracking-widest"
                      >
                         Inspect Payload
                      </button>
                   </div>
                </div>
              ))}
           </div>
        </div>
      </div>

      <div className="space-y-8">
         <div className="glass-panel rounded-3xl p-8 border-slate-800 bg-orange-600/[0.02] border-glow-orange">
            <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-4">EIP-712 Technical Spec</h3>
            <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
               The <span className="text-orange-400">SOVR Engine</span> utilizes strictly typed data structures to mitigate phishing. Signatures are mapped to unique <span className="text-slate-300">Domain Separators</span> specific to the Hybrid V2 deployment.
            </p>
            <div className="mt-6 grid grid-cols-2 gap-4">
               <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-center">
                  <p className="text-[9px] text-slate-500 uppercase font-bold mb-1">Standard</p>
                  <p className="text-xs text-white mono">EIP-712</p>
               </div>
               <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-center">
                  <p className="text-[9px] text-slate-500 uppercase font-bold mb-1">Curve</p>
                  <p className="text-xs text-white mono">secp256k1</p>
               </div>
            </div>
         </div>
      </div>

      {/* INSPECTION MODAL */}
      {inspecting && (
        <div className="fixed inset-0 bg-[#020617]/95 backdrop-blur-2xl flex items-center justify-center z-[110] p-6 animate-in fade-in zoom-in-95 duration-300">
           <div className="max-w-2xl w-full glass-panel rounded-[32px] border-orange-500/30 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
              <div className="p-8 border-b border-slate-800/50 flex justify-between items-center bg-slate-900/30">
                 <div>
                    <h2 className="text-xl font-bold text-white tracking-tight">Inspect EIP-712 Payload</h2>
                    <p className="text-[10px] text-slate-500 uppercase tracking-[0.2em] mt-1">Verification Required: {inspecting.id}</p>
                 </div>
                 <button onClick={() => setInspecting(null)} className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-all">
                    <i className="fas fa-times"></i>
                 </button>
              </div>
              <div className="p-8 overflow-y-auto space-y-8">
                 <div className="space-y-4">
                    <h4 className="text-[10px] font-bold text-orange-400 uppercase tracking-widest flex items-center gap-2">
                       <i className="fas fa-layer-group"></i>
                       Domain Parameters
                    </h4>
                    <div className="grid grid-cols-2 gap-px bg-slate-800/50 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                       <div className="bg-black/40 p-4 border-r border-b border-slate-800/50">
                          <p className="text-[9px] text-slate-500 uppercase font-bold mb-1">Name</p>
                          <p className="text-xs text-white font-mono break-all leading-tight">{inspecting.domainData.name}</p>
                       </div>
                       <div className="bg-black/40 p-4 border-b border-slate-800/50">
                          <p className="text-[9px] text-slate-500 uppercase font-bold mb-1">Version</p>
                          <p className="text-xs text-white font-mono leading-tight">{inspecting.domainData.version}</p>
                       </div>
                       <div className="bg-black/40 p-4 border-r border-slate-800/50">
                          <p className="text-[9px] text-slate-500 uppercase font-bold mb-1">Chain ID</p>
                          <p className="text-xs text-white font-mono leading-tight">{inspecting.domainData.chainId}</p>
                       </div>
                       <div className="bg-black/40 p-4">
                          <p className="text-[9px] text-slate-500 uppercase font-bold mb-1">Verifying Contract</p>
                          <p className="text-[10px] text-orange-300 font-mono break-all leading-tight">{inspecting.domainData.verifyingContract}</p>
                       </div>
                    </div>
                 </div>
                 <div className="space-y-4">
                    <h4 className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest flex items-center gap-2">
                       <i className="fas fa-code"></i>
                       Typed Message (Struct)
                    </h4>
                    <div className="p-6 bg-black/60 rounded-2xl border border-slate-800 shadow-inner font-mono text-[11px] text-slate-300 leading-relaxed overflow-x-auto">
                       <pre className="whitespace-pre-wrap">
                          {JSON.stringify(inspecting.payload, null, 3)}
                       </pre>
                    </div>
                 </div>
              </div>
              <div className="p-8 border-t border-slate-800/50 flex gap-4 bg-slate-900/10">
                 <button 
                  onClick={() => { handleSign(inspecting); setInspecting(null); }}
                  className="flex-1 py-4 bg-orange-600 hover:bg-orange-500 text-white rounded-2xl text-sm font-bold uppercase tracking-widest shadow-xl shadow-orange-600/20 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                 >
                    Confirm & Execute Sign
                 </button>
              </div>
           </div>
        </div>
      )}

      {/* SIGNING MODAL overlay */}
      {isSigning && (
        <div className="fixed inset-0 bg-[#020617]/90 backdrop-blur-2xl flex items-center justify-center z-[120] p-6">
           <div className="max-w-sm w-full p-10 text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-orange-600/5 blur-[100px] rounded-full"></div>
              
              <div className="relative w-28 h-28 mx-auto mb-10">
                 <div className="absolute inset-0 border-[6px] border-orange-500/10 rounded-full"></div>
                 <div className="absolute inset-0 border-[6px] border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                 <div className="absolute inset-0 flex items-center justify-center text-orange-400 text-3xl">
                    <i className="fas fa-fingerprint animate-pulse"></i>
                 </div>
              </div>
              
              <h2 className="text-2xl font-bold text-white mb-3 tracking-tight">Cryptographic Signing</h2>
              <div className="flex flex-col gap-2 items-center mb-10">
                 <div className={`text-[11px] font-bold uppercase tracking-[0.2em] transition-all duration-300 ${signStep >= 0 ? 'text-orange-400' : 'text-slate-800'}`}>Hashing Structured Data</div>
                 <div className={`text-[11px] font-bold uppercase tracking-[0.2em] transition-all duration-300 ${signStep >= 1 ? 'text-orange-400' : 'text-slate-800'}`}>HSM Handshake</div>
                 <div className={`text-[11px] font-bold uppercase tracking-[0.2em] transition-all duration-300 ${signStep >= 2 ? 'text-orange-400' : 'text-slate-800'}`}>Finalizing ECDSA Signature</div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

const SecurityToggle: React.FC<{ label: string; active?: boolean }> = ({ label, active }) => (
  <div className="flex items-center justify-between group cursor-pointer py-1">
     <span className={`text-[11px] font-bold transition-colors uppercase tracking-widest ${active ? 'text-slate-300' : 'text-slate-600'}`}>{label}</span>
     <div className={`w-9 h-5 rounded-full p-1 transition-all ${active ? 'bg-orange-600/50 border border-orange-500/30 shadow-[0_0_10px_rgba(249,115,22,0.2)]' : 'bg-slate-900 border border-slate-800'}`}>
        <div className={`w-2.5 h-2.5 rounded-full bg-white transition-all ${active ? 'translate-x-4' : 'opacity-20'}`}></div>
     </div>
  </div>
);

export default AttestationCenter;
