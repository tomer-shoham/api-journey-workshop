export const rates = {
  BTC_TEST: 86388,
  ETH_TEST6: 2223,
  SOL_TEST: 138
};

const assetLogos: Record<string, string> = {
  BTC_TEST: "/btc_logo.jpg",
  ETH_TEST6: "/eth_logo.jpg",
  SOL_TEST: "/sol_logo.jpg"
};

export function AssetRates() {
  return (
    <div className="p-6">
      <h2 className="text-lg font-semibold mb-4">Asset Rates</h2>
      <div className="space-y-3">
        {Object.entries(rates).map(([key, value]) => (
          <div
            key={key}
            className="flex justify-between items-center p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200"
          >
            <div className="flex items-center gap-3">
              <img src={assetLogos[key]} alt={key} className="h-6 w-6 object-contain" />
              <span className="font-medium">{key}</span>
            </div>
            <div className="text-right">
              <div className="font-semibold">${value.toLocaleString()}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
