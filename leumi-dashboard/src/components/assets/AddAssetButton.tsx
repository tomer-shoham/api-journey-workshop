import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import { AddAssetModal } from "./AddAssetModal";
import { EAsset } from "@/api/types.ts";

interface AddAssetButtonProps {
  onAssetSelect: (asset: EAsset) => Promise<void>;
}

export const AddAssetButton = ({ onAssetSelect }: AddAssetButtonProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => setIsModalOpen(true)}>
        <Plus className="mr-2" />
        Add Asset
      </Button>
      <AddAssetModal isOpen={isModalOpen} onOpenChange={setIsModalOpen} onAssetSelect={onAssetSelect} />
    </>
  );
};
