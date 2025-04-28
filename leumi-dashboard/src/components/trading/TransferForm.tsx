import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { transferAsset } from "@/api/api";
import { Card } from "@/components/ui/card";
import { Asset, EAsset, Wallet } from "@/api/types.ts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.tsx";
import { getAssetImage } from "@/lib/utils.ts";

interface IProps {
  leumiWallet: Wallet;
  leumiWalletAssets: Asset[];
}

export const TransferForm: React.FC<IProps> = ({ leumiWallet, leumiWalletAssets }) => {
  const [amount, setAmount] = useState("");
  const [assetId, setAssetId] = useState<EAsset | "">("");
  const [address, setAddress] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    if (refreshKey > 0) {
      // Simulate data refresh for 'wallet' and 'assets'
      console.log("Data refreshed for wallet and assets");
    }
  }, [refreshKey]);

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);

    try {
      if (assetId) {
        await transferAsset(leumiWallet.id, assetId, amount, address);
        toast.success("Transfer successful");
        setAmount("");
        setAssetId("");
        setAddress("");
        setRefreshKey(prev => prev + 1);
      }
    } catch (error) {
      toast.error("Failed to complete withdrawal");
      console.error("Transfer error:", error);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Card className="p-6 shadow-md hover:shadow-lg transition-shadow duration-200">
      <form onSubmit={handleTransfer} className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="withdraw-amount" className="text-sm font-medium text-gray-700">
            Amount
          </label>
          <Input
            id="withdraw-amount"
            type="number"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            placeholder="Enter amount"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="withdraw-assetId" className="text-sm font-medium text-gray-700">
            Asset ID
          </label>
          <Select value={assetId} onValueChange={(value: EAsset) => setAssetId(value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select a asset" />
            </SelectTrigger>
            <SelectContent>
              {leumiWalletAssets.map((asset: Asset) => (
                <SelectItem key={asset.id} value={asset.assetId}>
                  <div className="flex items-center gap-2">
                    <img alt="asset" src={getAssetImage(asset.assetId)} className="h-6 w-6 object-contain" />
                    <span className="text-sm font-medium"> {asset.assetId}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <label htmlFor="withdraw-address" className="text-sm font-medium text-gray-700">
            Transfer Address
          </label>
          <Input
            id="withdraw-address"
            value={address}
            onChange={e => setAddress(e.target.value)}
            placeholder="Enter withdrawal address"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          />
        </div>
        <Button
          type="submit"
          disabled={isPending}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md shadow-sm hover:shadow transition-all duration-200 disabled:bg-gray-400"
        >
          {isPending ? "Processing..." : "Transfer Asset"}
        </Button>
      </form>
    </Card>
  );
};
