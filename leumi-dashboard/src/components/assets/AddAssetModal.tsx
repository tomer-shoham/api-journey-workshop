import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { EAsset } from "@/api/types.ts";

interface AddAssetModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onAssetSelect: (asset: EAsset) => Promise<void>; // Calls server
}

export const AddAssetModal = ({ isOpen, onOpenChange, onAssetSelect }: AddAssetModalProps) => {
  const [selectedAsset, setSelectedAsset] = useState<EAsset | "">("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleApprove = async () => {
    if (!selectedAsset) return;
    try {
      setLoading(true);
      await onAssetSelect(selectedAsset);
      onOpenChange(false);
      setSelectedAsset("");
    } catch (error) {
      console.error("Failed to select asset:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Asset</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label htmlFor="asset">Select Asset</label>
            <Select
              value={selectedAsset}
              onValueChange={(value: EAsset) => {
                setSelectedAsset(value);
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
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-red-500 text-red-500 hover:bg-red-50"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleApprove}
              disabled={!selectedAsset || loading}
              className="bg-[#9b87f5] hover:bg-[#8b77e5] text-white"
            >
              {loading ? "Processing..." : "Approve"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
