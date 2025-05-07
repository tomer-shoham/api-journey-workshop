import dotenv from "dotenv";

import { Asset } from "../db/models/Asset.model";
import { LeumiWalletService } from "./leumi-wallet.service";
import { FireblocksService } from "./fireblocks/fireblocks.service";
import { Transaction } from "../db/models/Transaction.model";
import { db } from "..";
import { LeumiWallet } from "../db/models/LeumiWallet.model";
import pollFbTxStatus from "../utils/pullTxStatus";
import { DestinationTransferPeerPath } from "@fireblocks/ts-sdk";

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
const withdrawalsVaultId = process.env.WITHDRAWALS_VAULT_ID;

export class AssetService {
  constructor(
    private readonly fireblocksService: FireblocksService,
    private readonly leumiWalletService: LeumiWalletService
  ) {}

  public async getFbVaultAccount(vaultAccountId: string) {
    try {
      const fireblocksBalances = await this.fireblocksService.fireblocksSDK.vaults.getVaultAccount({ vaultAccountId });
      return fireblocksBalances.data;
    } catch (err: any) {
      const errorMessage = err.message || JSON.stringify(err);
      console.error(`getFbVaultAccount error - ${errorMessage}`);
    }
  }

  public async getAssets(leumiWalletId: string) {
    try {
      const assets = await Asset.findAll({ where: { leumiWalletId: leumiWalletId } });
      return assets;
    } catch (err: any) {
      const errorMessage = err.message || JSON.stringify(err);
      console.error(`get assets error - ${errorMessage}`);
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
      console.error(`Error getting asset ${assetId} - ${(err as any).message || JSON.stringify(err)}`);
    }
  }

  public async createAsset(leumiWalletId: string, assetId: string) {
    const transactionScope = await db.sequelize.transaction();
    try {
      const leumiWallet = await this.leumiWalletService.getLeumiWallet(leumiWalletId);
      const leumiWalletAssets = await this.getAssets(leumiWalletId);

      const assetList = leumiWalletAssets?.map(asset => {
        const { assetId: currentAssetId, address, vaultId } = asset.dataValues;
        return { assetId: currentAssetId, address, vaultId };
      });

      if (assetList?.some(asst => asst.assetId === assetId)) return {}; // Asset already exists

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
        let vaultId = assetList?.find(asst => asst.assetId !== "BTC_TEST")?.vaultId || "";
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
      console.error(`Error creating asset - ${(err as any).message || JSON.stringify(err)}`);
    }
  }

  public async withdrawal(leumiWalletId: string, assetId: string, amount: number, destinationAddress: string) {
    const transactionScope = await db.sequelize.transaction();
    let transactionRecord;
    try {
      const asset = await Asset.findOne({
        where: { leumiWalletId, assetId },
        transaction: transactionScope,
        lock: transactionScope.LOCK.UPDATE
      });
      if (!asset || !asset.amount || asset.amount < amount) {
        throw new Error("Insufficient funds or asset not found");
      }
      await asset.decrement({ amount }, { transaction: transactionScope });

      const isUTXO = asset.assetId === "BTC_TEST";

      transactionRecord = await Transaction.create(
        {
          source: withdrawalsVaultId,
          destination: destinationAddress,
          amount,
          assetId,
          leumiWalletId
        },
        { transaction: transactionScope }
      );

      const destination: DestinationTransferPeerPath = isUTXO
        ? {
            type: "ONE_TIME_ADDRESS",
            oneTimeAddress: { address: destinationAddress }
          }
        : {
            type: "VAULT_ACCOUNT",
            id: destinationAddress
          };
      const txResponse = await this.fireblocksService.fireblocksSDK.transactions.createTransaction({
        transactionRequest: {
          assetId,
          amount: amount.toString(),
          source: { type: "VAULT_ACCOUNT", id: withdrawalsVaultId },
          destination: destination,
          externalTxId: `${leumiWalletId}_${transactionRecord.id}`,
          note: `User withdrawal for Leumi wallet ${leumiWalletId}`
        }
      });
      const txId = txResponse.data.id;
      if (!txId) {
        throw new Error("Fireblocks transaction error");
      }
      const finalStatus = await pollFbTxStatus(txId);
      if (finalStatus !== "COMPLETED") {
        throw new Error(`Fireblocks transaction failed or was dropped (status: ${finalStatus})`);
      }

      await transactionScope.commit();
      return { success: true, txId: txResponse.data.id };
    } catch (err) {
      await transactionScope.rollback();
      if (transactionRecord?.id) {
        try {
          await this.fireblocksService.fireblocksSDK.transactions.cancelTransaction({ txId: transactionRecord.id });
        } catch (cancelErr) {
          console.warn(`Fireblocks cancellation failed for tx ${transactionRecord.id}`);
        }
      }

      console.error(`Error withdrawal asset - ${(err as any).message || JSON.stringify(err)}`);
      return { success: false, error: (err as any).message || "Withdrawal failed" };
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

      const isUTXO = asset.assetId === "BTC_TEST";

      if (!isUTXO) {
        // Sweep ETH or SOL to treasury
        await asset.decrement({ amount });
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

      await Transaction.create(
        {
          source: isUTXO ? "external" : asset.vaultId,
          destination: isUTXO ? asset.address : asset.vaultId,
          amount,
          assetId: asset.assetId,
          leumiWalletId
        },
        { transaction: transactionScope }
      );

      const updatedAsset = await asset.increment({ amount }, { transaction: transactionScope });
      await transactionScope.commit();
      return updatedAsset.toJSON();
    } catch (err) {
      await transactionScope.rollback();
      console.error(`Error deposit asset - ${(err as any).message || JSON.stringify(err)}`);
    }
  }

  public async buy(leumiWalletId: string, assetId: Assets, amount: number) {
    const transactionScope = await db.sequelize.transaction();
    try {
      const asset = await Asset.findOne({
        where: {
          assetId,
          leumiWalletId
        },
        transaction: transactionScope
      });

      const leumiWallet = await LeumiWallet.findByPk(leumiWalletId, {
        transaction: transactionScope
      });

      if (!asset || !leumiWallet) {
        throw new Error("Asset or wallet not found in DB");
      }
      const isUTXO = asset.assetId === "BTC_TEST";

      const lwBalance = leumiWallet.usdBalance;
      const assetCost = rates[assetId] * amount;

      if (lwBalance < assetCost) {
        throw new Error("Insufficient USD balance in Leumi Wallet");
      }

      leumiWallet.usdBalance -= assetCost;
      await leumiWallet.save({ transaction: transactionScope });

      asset.amount = (asset.amount || 0) + amount;
      await asset.save({ transaction: transactionScope });

      await Transaction.create(
        {
          source: "USD Balance",
          destination: isUTXO ? asset.address : asset.vaultId,
          amount: amount,
          assetId: asset.assetId,
          leumiWalletId: leumiWalletId
        },
        { transaction: transactionScope }
      );

      await transactionScope.commit();

      return { success: true, message: `Bought ${amount} ${assetId} for $${assetCost}` };
    } catch (err) {
      await transactionScope.rollback();
      console.error(`Error buying asset - ${(err as any).message || JSON.stringify(err)}`);
    }
  }
}
