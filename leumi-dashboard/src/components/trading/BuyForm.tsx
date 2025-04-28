import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useState, useEffect } from "react";
import { toast, Toaster } from "sonner";
import { buyAsset } from "@/api/api";
import { Card } from "@/components/ui/card";
import { EAsset, Wallet } from "@/api/types.ts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.tsx";

interface IProps {
  leumiWallet: Wallet;
}

export const BuyForm: React.FC<IProps> = ({ leumiWallet }) => {
  const [amount, setAmount] = useState("");
  const [assetId, setAssetId] = useState<EAsset | "">("");
  const [isPending, setIsPending] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    if (refreshKey > 0) {
      console.log("Data refreshed for wallet and assets");
    }
  }, [refreshKey]);

  const handleBuy = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);

    try {
      if (assetId) {
        await buyAsset(leumiWallet.id, assetId, amount);
        toast.success("Purchase successful"); // Ensure toast is called
        setAmount("");
        setAssetId("");
        setRefreshKey(prev => prev + 1);
      }
    } catch (error) {
      toast.error("Failed to complete purchase");
      console.error("Buy error:", error);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Card className="p-6 shadow-md hover:shadow-lg transition-shadow duration-200">
      <Toaster /> {/* Ensure Toaster is included */}
      <form onSubmit={handleBuy} className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="amount" className="text-sm font-medium text-gray-700">
            Amount
          </label>
          <Input
            id="amount"
            type="number"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            placeholder="Enter amount"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="assetId" className="text-sm font-medium text-gray-700">
            Asset ID
          </label>
          <Select
            value={assetId}
            onValueChange={(value: EAsset) => {
              setAssetId(value);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select an asset" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="BTC_TEST">
                <div className="flex items-center gap-2">
                  <img src="/btc_logo.jpg" alt="BTC_TEST" className="h-6 w-6 object-contain" />
                  <span className="text-sm font-medium">BTC_TEST</span>
                </div>
              </SelectItem>
              <SelectItem value="ETH_TEST6">
                <div className="flex items-center gap-2">
                  <img src="/eth_logo.jpg" alt="Ethereum" className="h-6 w-6 object-contain" />
                  <span className="text-sm font-medium">ETH_TEST6</span>
                </div>
              </SelectItem>
              <SelectItem value="SOL_TEST">
                <div className="flex items-center gap-2">
                  <img src="/sol_logo.jpg" alt="Solana" className="h-6 w-6 object-contain" />
                  <span className="text-sm font-medium">SOL_TEST</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button
          type="submit"
          disabled={isPending}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md shadow-sm hover:shadow transition-all duration-200 disabled:bg-gray-400"
        >
          {isPending ? "Processing..." : "Buy Asset"}
        </Button>
      </form>
    </Card>
  );
};
