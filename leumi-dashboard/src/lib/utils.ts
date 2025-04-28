import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { EAsset } from "@/api/types.ts";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getAssetImage(assetId: EAsset) {
  switch (assetId) {
    case EAsset.BTC_TEST:
      return "/btc_logo.jpg";
    case EAsset.ETH_TEST6:
      return "/eth_logo.jpg";
    case EAsset.SOL_TEST:
      return "/sol_logo.jpg";
  }
}
