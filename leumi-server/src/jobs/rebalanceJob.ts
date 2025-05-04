import cron from "node-cron";
import dotenv from "dotenv";
import { FireblocksService } from "../services/fireblocks/fireblocks.service";

dotenv.config();

const fireblocksService = new FireblocksService();

const assets = ["BTC_TEST", "ETH_TEST6", "SOL_TEST"];

const depositVaultId = process.env.DEPOSIT_OMNIBUS_VAULT_ID;
const withdrawalsVaultId = process.env.WITHDRAWALS_VAULT_ID;

export function startRebalanceJob() {
  cron.schedule(
    "0 * * * *",
    async () => {
      try {
        if (depositVaultId && withdrawalsVaultId) {
          console.log("rebalancing job started");
          for (const assetId of assets) {
            const depositVaultAccountAsset = await fireblocksService.fireblocksSDK.vaults.getVaultAccountAsset({
              vaultAccountId: depositVaultId,
              assetId: assetId
            });

            const withdrawalVaultAccountAsset = await fireblocksService.fireblocksSDK.vaults.getVaultAccountAsset({
              vaultAccountId: withdrawalsVaultId,
              assetId: assetId
            });

            const depositBalance = Number(depositVaultAccountAsset.data.total);
            const withdrawalBalance = Number(withdrawalVaultAccountAsset.data.total);
            const totalBalance = depositBalance + withdrawalBalance;

            const idealWithdrawalBalance = totalBalance * 0.1;

            if (withdrawalBalance < idealWithdrawalBalance) {
              const amountToMove = idealWithdrawalBalance - withdrawalBalance;
              await fireblocksService.fireblocksSDK.transactions.createTransaction({
                transactionRequest: {
                  assetId,
                  amount: amountToMove,
                  source: { type: "VAULT_ACCOUNT", id: depositVaultId },
                  destination: { type: "VAULT_ACCOUNT", id: withdrawalsVaultId },
                  note: "rebalance"
                }
              });
            } else if (withdrawalBalance > idealWithdrawalBalance) {
              const amountToMove = withdrawalBalance - idealWithdrawalBalance;

              await fireblocksService.fireblocksSDK.transactions.createTransaction({
                transactionRequest: {
                  assetId,
                  amount: amountToMove,
                  source: { type: "VAULT_ACCOUNT", id: withdrawalsVaultId },
                  destination: { type: "VAULT_ACCOUNT", id: depositVaultId },
                  note: "rebalance"
                }
              });
            }
          }
        }
      } catch (error) {
        console.error("Error rebalancing vaults:", error);
      }
    },
    {
      scheduled: true,
      timezone: "America/New_York"
    }
  );
}
