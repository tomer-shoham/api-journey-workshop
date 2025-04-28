import { AssetDistribution } from "@/components/dashboard/AssetDistribution.tsx";
import { Card } from "@/components/ui/card";
import { TransferModal } from "@/components/dashboard/TransferModal.tsx";
import { BuyModal } from "@/components/dashboard/BuyModal.tsx";
import { AssetRates } from "@/components/dashboard/AssetRates.tsx";
import { TotalBalance } from "@/components/dashboard/TotalBalance.tsx";
import { AddressModal } from "@/components/dashboard/AddressModal.tsx";
import { useEffect } from "react";
import { fetchLeumiWalletAssets } from "@/api/api.ts";
import { Asset, TUser, Wallet } from "@/api/types.ts";
import * as React from "react";

interface IProps {
  user: TUser;
  leumiWallet: Wallet;
  leumiWalletAssets: Asset[];
  setLeumiWallet: (wallet: Wallet) => void;
  setLeumiWalletAssets: (assets: Asset[]) => void;
}

const DashboardPage: React.FC<IProps> = ({
  user,
  leumiWallet,
  leumiWalletAssets,
  setLeumiWalletAssets,
  setLeumiWallet
}) => {
  useEffect(() => {
    const fetchAssetsData = async () => {
      console.log("leumiWallet.id", leumiWallet.id);
      const assets = await fetchLeumiWalletAssets(leumiWallet.id);
      console.log("assets", assets);
      setLeumiWalletAssets(assets);
    };
    fetchAssetsData();
  }, []);

  return (
    <div className="space-y-10 mx-auto pb-8">
      <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Welcome back, {`${user.name}`}</h1>
      <TotalBalance leumiWallet={leumiWallet} leumiWalletAssets={leumiWalletAssets} />
      <div className="grid grid-cols-3 sm:grid-cols-3 gap-8">
        <Card className="p-6 card-shadow ">
          <AssetRates />
        </Card>

        <Card className="p-6 card-shadow">
          <h2 className="text-lg font-semibold mb-4">Asset Distribution</h2>
          <div className="h-[180px]">
            <AssetDistribution leumiWalletAssets={leumiWalletAssets} />
          </div>
        </Card>

        <Card className="p-6 card-shadow space-y-6">
          <h2 className="text-lg font-semibold mb-6">Quick Actions</h2>
          <BuyModal
            leumiWallet={leumiWallet}
            setLeumiWalletAssets={setLeumiWalletAssets}
            setLeumiWallet={setLeumiWallet}
          />
          <TransferModal leumiWallet={leumiWallet} leumiWalletAssets={leumiWalletAssets} />
          <AddressModal leumiWalletAssets={leumiWalletAssets} />
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
