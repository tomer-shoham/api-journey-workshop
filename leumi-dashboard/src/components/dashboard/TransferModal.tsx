import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { transferAsset } from "@/api/api.ts";
import { Asset, EAsset, Wallet } from "@/api/types.ts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.tsx";
import { getAssetImage } from "@/lib/utils.ts"; // Assumes transferAsset is a function that performs the transfer

interface IProps {
  leumiWallet: Wallet;
  leumiWalletAssets: Asset[];
}

export const TransferModal: React.FC<IProps> = ({ leumiWallet, leumiWalletAssets }) => {
  const [amount, setAmount] = useState("");
  const [assetId, setAssetId] = useState<EAsset | "">("");
  const [address, setAddress] = useState("");
  const [open, setOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    if (refreshKey > 0) {
      console.log("Data refreshed for wallet and assets");
    }
  }, [refreshKey]);

  const handleTransfer = async () => {
    setIsPending(true);
    try {
      if (assetId) {
        await transferAsset(leumiWallet.id, assetId, amount, address);
        toast.success("Transfer successful");
        setOpen(false);
        setAmount("");
        setAssetId("");
        setAddress("");
        setRefreshKey(prev => prev + 1);
      }
    } catch (error) {
      toast.error("Failed to complete transfer");
      console.error("Transfer error:", error);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">Transfer</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Transfer Assets</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label htmlFor="amount">Amount</label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              placeholder="Enter amount"
            />
          </div>
          <div className="grid gap-2">
            <label htmlFor="assetId">Asset ID</label>
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
          <div className="grid gap-2">
            <label htmlFor="address">Transfer Address</label>
            <Input
              id="address"
              value={address}
              onChange={e => setAddress(e.target.value)}
              placeholder="Enter transfer address"
            />
          </div>
          <Button onClick={handleTransfer} disabled={isPending} className="bg-blue-600 hover:bg-blue-700 text-white">
            {isPending ? "Processing..." : "Confirm Transfer"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
