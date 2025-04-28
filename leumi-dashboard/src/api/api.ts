import { AxiosResponse } from "axios";
import { Asset, EAsset, Transaction, TUser, Wallet } from "./types.ts";
import apiClient from "@/api/api-client.ts";

const wrapRequest = async <T>(request: Promise<AxiosResponse<T>>): Promise<T> => {
  try {
    const response = await request;
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const fetchLoggedInUser = async (userId: string): Promise<TUser> => {
  return wrapRequest(apiClient.get<TUser>(`${import.meta.env.VITE_API_BASE_URL}/auth/user/${userId}`));
};

export const fetchTransactions = async (leumiWalletId: string): Promise<Transaction[]> => {
  return wrapRequest(apiClient.get(`${import.meta.env.VITE_API_BASE_URL}/leumi-wallets/${leumiWalletId}/transactions`));
};

export const fetchLeumiWallet = async (leumiWalletId: string): Promise<Wallet> => {
  return wrapRequest(apiClient.get(`${import.meta.env.VITE_API_BASE_URL}/leumi-wallets/${leumiWalletId}`));
};

export const fetchLeumiWalletAssets = async (leumiWalletId: string): Promise<Asset[]> => {
  return wrapRequest(apiClient.get(`${import.meta.env.VITE_API_BASE_URL}/leumi-wallets/${leumiWalletId}/assets`));
};

export const addAssetToLeumiWallet = async (leumiWalletId: string, assetId: EAsset): Promise<Asset[]> => {
  return wrapRequest(
    apiClient.post(`${import.meta.env.VITE_API_BASE_URL}/leumi-wallets/${leumiWalletId}/assets/${assetId}`)
  );
};

export const buyAsset = async (leumiWalletId: string, assetId: EAsset, amount: string) => {
  const data = {
    amount
  };
  return wrapRequest(
    apiClient.post(`${import.meta.env.VITE_API_BASE_URL}/leumi-wallets/${leumiWalletId}/assets/${assetId}/buy`, data, {
      headers: { "Content-Type": "application/json" }
    })
  );
};

export const transferAsset = async (leumiWalletId: string, assetId: EAsset, amount: string, address: string) => {
  const data = {
    amount,
    address
  };
  return wrapRequest(
    apiClient.post(
      `${import.meta.env.VITE_API_BASE_URL}/leumi-wallets/${leumiWalletId}/assets/${assetId}/withdrawal`,
      data,
      {
        headers: { "Content-Type": "application/json" }
      }
    )
  );
};
