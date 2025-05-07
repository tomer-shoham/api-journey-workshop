import { TransactionResponse } from "@fireblocks/ts-sdk";
import { FireblocksService } from "./fireblocks/fireblocks.service";
import { LeumiWallet } from "../db/models/LeumiWallet.model";
import { AssetService } from "./asset.service";
import { Asset } from "../db/models/Asset.model";
export class WebhookService {
  constructor(
    private readonly fireblocksService: FireblocksService,
    private readonly assetService: AssetService
  ) {}
  public async handleWebhook(type: string, tx: TransactionResponse) {
    try {
      if (
        type === "TRANSACTION_STATUS_UPDATED" &&
        tx.status === "COMPLETED" &&
        tx.amountInfo &&
        tx.amountInfo?.amount &&
        tx.destination?.id
      ) {
        console.log("webhook tx", tx);
        const vaultId = tx.destination.id;
        const assetId = tx.assetId;
        const amount = parseFloat(tx.amountInfo.amount);
        console.log("web hook service", vaultId, assetId, amount);
        const asset = await Asset.findOne({ where: { vaultId } });
        if (!asset || !assetId) {
          throw new Error("Error fetching asset data");
        }
        const leumiWallet = await LeumiWallet.findByPk(asset.leumiWalletId);
        if (!leumiWallet) {
          throw new Error("Error fetching LW data");
        }
        await this.assetService.deposit(leumiWallet.id, assetId, amount);
        console.log("handleWebhook - done");
      }
    } catch (err: any) {
      console.error(`Error handling webhook - ${err.message || JSON.stringify(err)}`);
    }
  }
}
