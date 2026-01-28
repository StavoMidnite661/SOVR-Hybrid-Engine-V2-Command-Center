
export enum ModuleType {
  DASHBOARD = 'DASHBOARD',
  ROUTER = 'ROUTER',
  LIQUIDITY = 'LIQUIDITY',
  RESERVE = 'RESERVE',
  ATTESTATION = 'ATTESTATION',
  CREDIT_REGISTRY = 'CREDIT_REGISTRY',
  ADMIN = 'ADMIN',
  SIMULATOR = 'SIMULATOR'
}

export interface ProtocolStats {
  tvl: number;
  usdSovrSupply: number;
  collateralRatio: number;
  usdcReserves: number;
  activePools: number;
  totalTransactions: number;
}

export interface UserState {
  usdcBalance: number;
  usdSovrBalance: number;
  role: 'USER' | 'GUARDIAN' | 'KEEPER' | 'ADMIN';
  address?: string;
}
