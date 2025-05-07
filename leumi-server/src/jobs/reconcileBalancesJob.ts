import cron from "node-cron";
import dotenv from "dotenv";
import { Asset } from "../db/models/Asset.model";
import { Transaction } from "../db/models/Transaction.model";
import { FireblocksService } from "../services/fireblocks/fireblocks.service";

dotenv.config();

const fireblocksService = new FireblocksService();

const fromTime = Date.now() - 24 * 60 * 60 * 1000;
const toTime = Date.now();

export const balanceReconciliation = async () => {
  try {
    const assets = await Asset.findAll();
    const txHistory = await fireblocksService.fireblocksSDK.transactions.getTransactions({
      after: `${fromTime}`,
      before: `${toTime}`,
      status: "COMPLETED",
      orderBy: "createdAt",
      sort: "DESC",
      limit: 500
    });

    if (txHistory.data.length === 0) throw new Error("No Fireblocks transaction history in the past 24h");

    for (const asset of assets) {
      try {
        const { assetId, address, vaultId, leumiWalletId } = asset;
        if (!vaultId) {
          console.warn(`Asset ${asset.id} has no vaultId`);
          continue;
        }

        const isUTXO = assetId === "BTC_TEST";
        const fbIdentifier = isUTXO ? address.toLowerCase() : vaultId;

        const incomeFbTxs = txHistory.data.filter(tx =>
          isUTXO ? tx.destinationAddress === fbIdentifier : tx.destination?.id === fbIdentifier
        );
        const totalFbIncome = incomeFbTxs.reduce((sum, tx) => sum + parseFloat(tx?.amountInfo?.amount || "0"), 0);

        const outgoingFbTxs = txHistory.data.filter(tx =>
          isUTXO ? tx.externalTxId?.includes(leumiWalletId) : tx.source?.id === fbIdentifier
        );
        const totalFbOutgoing = outgoingFbTxs.reduce((sum, tx) => sum + parseFloat(tx?.amountInfo?.amount || "0"), 0);

        const fbBalance = totalFbIncome - totalFbOutgoing;

        const incomeDBTxs = await Transaction.findAll({
          where: {
            destination: fbIdentifier,
            assetId
          }
        });
        const totalDbIncome = incomeDBTxs.reduce((sum, tx) => sum + tx.amount, 0);

        const outgoingDBTxs = await Transaction.findAll({
          where: {
            source: fbIdentifier,
            assetId
          }
        });
        const totalDbOutgoing = outgoingDBTxs.reduce((sum, tx) => sum + tx.amount, 0);

        const dbBalance = totalDbIncome - totalDbOutgoing;

        const label = isUTXO ? "(UTXO)" : "(Account)";
        const diff = Math.abs(fbBalance - dbBalance);
        const msg = `Asset ${assetId} ${label} — FB: ${fbBalance}, DB: ${dbBalance}`;

        if (diff > 0.01) {
          console.warn(`Discrepancy: ${msg}`);
        } else {
          console.log(`Match: ${msg}`);
        }
      } catch (err) {
        console.error(`Reconciliation failed for asset ${asset.assetId}:`, err);
      }
    }

    console.log("Reconciliation complete");
  } catch (error) {
    console.error("Error in reconciliation process:", error);
  }
};

export function startReconciliationJob() {
  cron.schedule("0 23 * * *", balanceReconciliation, {
    scheduled: true,
    timezone: "Asia/Jerusalem"
  });
}
