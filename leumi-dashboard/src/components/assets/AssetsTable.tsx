import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getAssetImage } from "@/lib/utils.ts";
import React from "react";
import { Asset } from "@/api/types.ts";

interface IProps {
  assets: Asset[];
  isLoading: boolean;
  error: Error | null;
}

export const AssetsTable: React.FC<IProps> = ({ assets, isLoading, error }) => {
  return (
    <div className="bg-white rounded-lg shadow">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Asset ID</TableHead>
            <TableHead>Address</TableHead>
            <TableHead className="text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-8">
                Loading assets...
              </TableCell>
            </TableRow>
          ) : error ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-8 text-red-500">
                Error loading assets. Please try again later.
              </TableCell>
            </TableRow>
          ) : assets?.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-8">
                No assets found.
              </TableCell>
            </TableRow>
          ) : (
            assets?.map(asset => (
              <TableRow key={asset.id}>
                <TableCell>
                  <div className="flex gap-2 items-center">
                    <img className="h-6 w-6 object-contain" src={getAssetImage(asset.assetId)} alt="asset" />
                    <span className="text-sm font-medium"> {asset.assetId}</span>
                  </div>
                </TableCell>
                <TableCell className="font-mono">{asset.address}</TableCell>
                <TableCell className="text-right">{asset.amount}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};
