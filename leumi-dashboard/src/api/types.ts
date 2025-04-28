export enum EAsset {
  BTC_TEST = "BTC_TEST",
  ETH_TEST6 = "ETH_TEST6",
  SOL_TEST = "SOL_TEST"
}

export interface Asset {
  id: string;
  assetId: EAsset;
  address: string;
  amount: number;
  vaultId?:string;
}

export interface Transaction {
  id: string;
  source: string;
  destination: string;
  amount: number;
  assetId: string;
}

export interface Wallet {
  id: string;
  usdBalance: number;
}

export type TUser = {
  id: string;
  name: string;
  email: string;
  picture: string;
  wallet: Wallet;
};
