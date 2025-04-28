import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { buyAsset, fetchLeumiWallet, fetchLeumiWalletAssets } from "@/api/api.ts";
import { AnimatePresence, motion } from "framer-motion";
import { Asset, EAsset, Wallet } from "@/api/types.ts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.tsx";

interface IProps {
  leumiWallet: Wallet;
  setLeumiWalletAssets: (assets: Asset[]) => void;
  setLeumiWallet: (wallet: Wallet) => void;
}

export const BuyModal: React.FC<IProps> = ({ leumiWallet, setLeumiWalletAssets, setLeumiWallet }) => {
  const [amount, setAmount] = useState("");
  const [assetId, setAssetId] = useState<EAsset | "">("");
  const [open, setOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    if (refreshKey > 0) {
      console.log("Data refreshed");
    }
  }, [refreshKey]);

  const handleBuy = async () => {
    setIsPending(true);

    try {
      console.log("Starting buyAsset request...");
      if (assetId) {
        const buyPromise = buyAsset(leumiWallet.id, assetId, amount);
        toast.promise(buyPromise, {
          loading: "Processing purchase...",
          success: "Purchase successful!",
          error: "Failed to complete purchase"
        });
        await buyPromise;
        console.log("Purchase successful, closing modal...");
        setOpen(false);
        setAmount("");
        setAssetId("");
        setRefreshKey(prev => prev + 1);
        const wallet = await fetchLeumiWallet(leumiWallet.id);
        setLeumiWallet(wallet);
        const updatedAssets = await fetchLeumiWalletAssets(leumiWallet.id);
        setLeumiWalletAssets(updatedAssets);
      }
    } catch (error) {
      console.error("Buy error:", error);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">Buy</Button>
      </DialogTrigger>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
          >
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Buy Assets</DialogTitle>
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
                <Button onClick={handleBuy} disabled={isPending} className="bg-blue-600 hover:bg-blue-700 text-white">
                  {isPending ? "Processing..." : "Confirm Purchase"}
                </Button>
              </div>
            </DialogContent>
          </motion.div>
        )}
      </AnimatePresence>
    </Dialog>
  );
};
