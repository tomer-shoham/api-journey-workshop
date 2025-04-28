import { Card } from "@/components/ui/card.tsx";
import { Asset, Wallet } from "@/api/types.ts";
import * as React from "react";

const rates = [
  { name: "Bitcoin", assetId: "BTC_TEST", price: 86388 },
  { name: "Ethereum", assetId: "ETH_TEST6", price: 2223 },
  { name: "Solana", assetId: "SOL_TEST", price: 138 }
];

const calculateWalletBalanceByAssets = (assets: Asset[] = []): number => {
  return assets.reduce((accumulator, asset) => {
    const rate = rates.find(r => r.assetId === asset.assetId);
    return rate ? accumulator + asset.amount * rate.price : accumulator;
  }, 0);
};

interface IProps {
  leumiWallet: Wallet;
  leumiWalletAssets: Asset[];
}

export const TotalBalance: React.FC<IProps> = ({ leumiWallet, leumiWalletAssets }) => {
  const assetsBalance = calculateWalletBalanceByAssets(leumiWalletAssets);

  return (
    <Card className="mb-2 p-4 bg-gradient-to-r from-purple-500 to-indigo-600 ">
      <div className="text-white gap-4 flex-col flex">
        <div>
          <h2 className="text-2xl font-bold">Leumi Wallet Balance (USD)</h2>
          <p className="text-3xl font-bold">${leumiWallet.usdBalance}</p>
        </div>
        <div>
          <h2 className="text-2xl font-bold">Total Assets Balance</h2>
          <p className="text-3xl font-bold">{assetsBalance}</p>
        </div>
      </div>
    </Card>
  );
};
