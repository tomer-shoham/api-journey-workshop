import dotenv from "dotenv";
import { VaultsApiCreateVaultAccountRequest } from "@fireblocks/ts-sdk";

import { Asset } from "../db/models/Asset.model";
import { LeumiWalletService } from "./leumi-wallet.service";
import { FireblocksService } from "./fireblocks/fireblocks.service";
dotenv.config();

const depositOmnibusVaultId = process.env.DEPOSIT_OMNIBUS_VAULT_ID;

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
      console.log("test1", test);
      return test;
    } catch (err: any) {
      const errorMessage = err.message || JSON.stringify(err);
      throw new Error(`get assets error - ${errorMessage}`);
    }
  }

  public async getAsset() {
    return {};
  }
  public async createAsset(leumiWalletId: string, assetId: string) {
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
        if (!depositOmnibusVaultId) throw new Error("missing DEPOSIT_OMNIBUS_VAULT_ID .env variable");

        const newAddressResponse = await this.fireblocksService.fireblocksSDK.vaults.createVaultAccountAssetAddress({
          vaultAccountId: depositOmnibusVaultId,
          assetId,
          createAddressRequest: { description: `${leumiWallet?.user.name}'s Address` }
        });

        assetCreationConfig["address"] = newAddressResponse.data.address || "";
        assetCreationConfig["vaultId"] = depositOmnibusVaultId;
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
      return newAsset.toJSON();
    } catch (err) {
      throw new Error(`Error creating asset - ${(err as any).message || JSON.stringify(err)}`);
    }
  }

  public async withdrawal() {}
  public async deposit() {}
  public async buy() {}
}
