import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.tsx";
import React, { useState } from "react";
import { Asset } from "@/api/types.ts";
import { getAssetImage } from "@/lib/utils.ts";

interface IProps {
  leumiWalletAssets: Asset[];
}

export const AddressModal: React.FC<IProps> = ({ leumiWalletAssets = [] }) => {
  const assetAddresses = leumiWalletAssets.reduce((acc, asset) => {
    acc[asset.assetId] = asset.address;
    return acc;
  }, {});
  const [selectedAsset, setSelectedAsset] = useState<string>("");
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">Get Address</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Get Asset Address</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label htmlFor="network">Select Network</label>
            <Select value={selectedAsset} onValueChange={setSelectedAsset}>
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
          {selectedAsset && (
            <div className="grid gap-2">
              <label>Asset Deposit Address</label>
              <div className="flex items-center gap-2">
                <code className="flex-1 p-2 bg-gray-100 rounded text-sm break-all">
                  {assetAddresses[selectedAsset]}
                </code>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
