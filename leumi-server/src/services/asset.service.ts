import dotenv from "dotenv";
import { TransactionsApiCreateTransactionRequest, TransferPeerPathType } from "@fireblocks/ts-sdk";

import { Asset } from "../db/models/Asset.model";
import { LeumiWalletService } from "./leumi-wallet.service";
import { FireblocksService } from "./fireblocks/fireblocks.service";
import { Transaction } from "../db/models/Transaction.model";
import { db } from "..";
import { LeumiWallet } from "../db/models/LeumiWallet.model";

dotenv.config();

export enum Assets {
  btcTest = "BTC_TEST",
  ethTest6 = "ETH_TEST6",
  solTest = "SOL_TEST"
}

const rates = {
  BTC_TEST: 86388,
  ETH_TEST6: 2223,
  SOL_TEST: 138
};

const treasuryVaultId = process.env.DEPOSIT_OMNIBUS_VAULT_ID;

export class AssetService {
  constructor(
    private readonly fireblocksService: FireblocksService,
    private readonly leumiWalletService: LeumiWalletService
  ) {}

  public async getAssets(leumiWalletId: string) {
    try {
      const test = await Asset.findAll({ where: { leumiWalletId: leumiWalletId } });
      // const vaultAccount = await this.fireblocksService.fireblocksSDK.vaults.getVaultAccount({
      // vaultAccountId: leumiWalletId
      // });
      // console.log("test1", test);
      return test;
    } catch (err: any) {
      const errorMessage = err.message || JSON.stringify(err);
      throw new Error(`get assets error - ${errorMessage}`);
    }
  }

  public async getAsset(leumiWalletId: string, assetId: string) {
    try {
      const asset = await Asset.findOne({
        where: {
          assetId: assetId,
          leumiWalletId: leumiWalletId
        }
      });
      return asset ? asset.toJSON() : null;
    } catch (err) {
      throw new Error(`Error getting asset ${assetId} - ${(err as any).message || JSON.stringify(err)}`);
    }
  }

  public async createAsset(leumiWalletId: string, assetId: string) {
    const transactionScope = await db.sequelize.transaction();
    try {
      const leumiWallet = await this.leumiWalletService.getLeumiWallet(leumiWalletId);
      const leumiWalletAssets = await this.getAssets(leumiWalletId);

      const assetList = leumiWalletAssets.map(asset => {
        const { assetId: currentAssetId, address, vaultId } = asset.dataValues;
        return { assetId: currentAssetId, address, vaultId };
      });

      if (assetList.some(asst => asst.assetId === assetId)) return {}; // Asset already exists

      const assetCreationConfig = {
        address: "",
        vaultId: "",
        leumiWalletId: leumiWalletId,
        assetId: assetId,
        balance: 0
      };

      if (assetId === "BTC_TEST") {
        if (!treasuryVaultId) throw new Error("missing DEPOSIT_OMNIBUS_VAULT_ID .env variable");

        const newAddressResponse = await this.fireblocksService.fireblocksSDK.vaults.createVaultAccountAssetAddress({
          vaultAccountId: treasuryVaultId,
          assetId,
          createAddressRequest: { description: `${leumiWallet?.user.name}'s Address` }
        });

        assetCreationConfig["address"] = newAddressResponse.data.address || "";
        assetCreationConfig["vaultId"] = treasuryVaultId;
      } else {
        let vaultId = assetList.find(asst => asst.assetId !== "BTC_TEST")?.vaultId || "";
        if (!vaultId) {
          const newVault = await this.fireblocksService.fireblocksSDK.vaults.createVaultAccount({
            createVaultAccountRequest: { name: `${leumiWallet?.user.name}'s Vault` }
          });
          vaultId = newVault.data.id;
        }

        const newWalletResponse = await this.fireblocksService.fireblocksSDK.vaults.createVaultAccountAsset({
          vaultAccountId: vaultId,
          assetId: assetId
        });

        assetCreationConfig["address"] = newWalletResponse.data.address || "";
        assetCreationConfig["vaultId"] = vaultId;
      }

      const newAsset = await Asset.create(assetCreationConfig, { returning: true });
      await transactionScope.commit();
      return newAsset.toJSON();
    } catch (err) {
      await transactionScope.rollback();
      throw new Error(`Error creating asset - ${(err as any).message || JSON.stringify(err)}`);
    }
  }

  public async withdrawal(leumiWalletId: string, assetId: string, amount: number, address: string) {
    try {
    } catch (err) {
      throw new Error(`Error withdrawal asset - ${(err as any).message || JSON.stringify(err)}`);
    }
  }

  public async deposit(leumiWalletId: string, assetId: string, amount: number) {
    const transactionScope = await db.sequelize.transaction();
    try {
      const asset = await Asset.findOne({
        where: {
          assetId: assetId,
          leumiWalletId: leumiWalletId
        }
      });
      const leumiWallet = await LeumiWallet.findByPk(leumiWalletId);
      if (!asset || !leumiWallet) throw new Error("error getting asset data from db");

      let txId: string | undefined;
      const isUTXO = asset.assetId === "BTC_TEST";

      if (!isUTXO) {
        // Sweep ETH or SOL to treasury
        await this.fireblocksService.fireblocksSDK.transactions.createTransaction({
          transactionRequest: {
            assetId: asset.assetId,
            amount: amount.toString(),
            source: { type: "VAULT_ACCOUNT", id: asset.vaultId },
            destination: { type: "VAULT_ACCOUNT", id: treasuryVaultId },
            note: `Deposit from Leumi wallet ${leumiWalletId}`
          }
        });
      }

      await Transaction.create({
        source: isUTXO ? "external" : asset.vaultId,
        destination: treasuryVaultId,
        amount,
        assetId: asset.assetId,
        leumiWalletId,
        id: txId
      });

      const updatedAsset = await asset.increment({ amount });
      await transactionScope.commit();
      return updatedAsset.toJSON();
    } catch (err) {
      await transactionScope.rollback();
      throw new Error(`Error deposit asset - ${(err as any).message || JSON.stringify(err)}`);
    }
  }

  public async buy(leumiWalletId: string, assetId: Assets, amount: number) {
    const transactionScope = await db.sequelize.transaction();
    try {
      const asset = await Asset.findOne({
        where: {
          assetId: assetId,
          leumiWalletId: leumiWalletId
        }
      });

      const leumiWallet = await LeumiWallet.findOne({
        where: {
          id: leumiWalletId
        }
      });
      if (!asset || !leumiWallet) throw new Error("error getting asset data from db");

      const lwBalance = leumiWallet.usdBalance;
      const assetCost = rates[assetId] * amount;

      if (lwBalance < assetCost) throw new Error("Leumi Wallet balance too low");
      console.log("balance", assetId, lwBalance, assetCost);
      console.log("asset check", asset, asset.address);
      await this.leumiWalletService.updateLeumiWallet(leumiWalletId, { usdBalance: lwBalance - assetCost });

      if (assetId === "BTC_TEST") {
        const dbTx = await Transaction.create({
          source: treasuryVaultId,
          destination: asset.address,
          amount: amount,
          assetId: assetId,
          leumiWalletId: leumiWalletId
        });
        console.log("dbTx id", dbTx.id, asset.address);

        const transactionParams: TransactionsApiCreateTransactionRequest = {
          transactionRequest: {
            source: {
              type: TransferPeerPathType.VaultAccount,
              id: treasuryVaultId
            },
            destination: {
              type: TransferPeerPathType.OneTimeAddress,
              oneTimeAddress: { address: asset.assetId }
            },
            assetId: "BTC_TEST",
            amount: amount.toString(),
            note: "Buying BTC_TEST",
            externalTxId: dbTx.id
          }
        };

        console.log(asset.address, typeof asset.address);

        const fbTransactionResponse =
          await this.fireblocksService.fireblocksSDK.transactions.createTransaction(transactionParams);
        console.log("Transaction initiated:", fbTransactionResponse.data);
        await transactionScope.commit();
      } else {
        const dbTx = await Transaction.create(
          {
            source: "FundingVault",
            destination: asset.vaultId,
            amount: amount,
            assetId: assetId,
            leumiWalletId: leumiWalletId
          },
          { transaction: transactionScope }
        );
      }
    } catch (err) {
      await transactionScope.rollback();
      throw new Error(`Error buying asset - ${(err as any).message || JSON.stringify(err)}`);
    }
  }
}
