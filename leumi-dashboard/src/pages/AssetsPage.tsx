import React from "react";
import { useToast } from "@/components/ui/use-toast";
import { useState, useEffect } from "react";
import { AddAssetButton } from "@/components/assets/AddAssetButton";
import { AssetsTable } from "@/components/assets/AssetsTable";
import { Card } from "@/components/ui/card";
import { addAssetToLeumiWallet, fetchLeumiWalletAssets } from "@/api/api.ts";
import { Asset, EAsset } from "@/api/types.ts";

interface IProps {
  leumiWalletId: string;
  initialAssets: Asset[];
}

const AssetsPage: React.FC<IProps> = ({ leumiWalletId, initialAssets }) => {
  const { toast } = useToast();
  const [leumiWalletAssets, setLeumiWalletAssets] = useState<Asset[]>(initialAssets);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchAssets();
  }, []);

  const fetchAssets = async () => {
    try {
      setIsLoading(true);
      const data = await fetchLeumiWalletAssets(leumiWalletId);
      console.log("assets data", data);
      setLeumiWalletAssets(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      console.error("Error fetching assets:", err);
      setError(err instanceof Error ? err : new Error("Failed to fetch assets"));
      setLeumiWalletAssets([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddAsset = async (assetId: EAsset) => {
    try {
      await addAssetToLeumiWallet(leumiWalletId, assetId);

      toast({
        title: "Asset Added",
        description: `Successfully added ${assetId} to your assets`
      });

      // Refresh assets list after adding new asset
      await fetchAssets();
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to add asset: ${error instanceof Error ? error.message : "Unknown error"}`,
        variant: "destructive"
      });
    }
  };

  return (
    <div className="w-full mx-auto">
      <Card className="p-6 mb-6 bg-gradient-to-r from-purple-500 to-indigo-600">
        <div className="text-white">
          <h2 className="text-2xl font-bold mb-2">Active Assets</h2>
          <p className="text-lg">Across {leumiWalletAssets.length} cryptocurrencies</p>
        </div>
      </Card>

      <div className="flex justify-end mb-6">
        <AddAssetButton onAssetSelect={handleAddAsset} />
      </div>

      <AssetsTable assets={leumiWalletAssets} isLoading={isLoading} error={error} />
    </div>
  );
};

export default AssetsPage;
