import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { rates } from "@/components/dashboard/AssetRates.tsx";
import { Asset } from "@/api/types.ts";
import React from "react";

const COLORS = ["#ea384c", "#0EA5E9", "#F97316"];

const calculateAssetDistribution = (assets = []) => {
  return assets.map(asset => ({
    name: asset.assetId,
    value: (asset.amount || 0) * rates[asset.assetId]
  }));
};

interface IProps {
  leumiWalletAssets: Asset[];
}

export const AssetDistribution: React.FC<IProps> = ({ leumiWalletAssets }) => {
  const assetDistribution = calculateAssetDistribution(leumiWalletAssets);
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={assetDistribution}
          cx="50%"
          cy="50%"
          innerRadius={30}
          outerRadius={50}
          fill="#8884d8"
          paddingAngle={5}
          dataKey="value"
        >
          {Object.keys(rates).map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
};
