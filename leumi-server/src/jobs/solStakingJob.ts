import cron from "node-cron";
import dotenv from "dotenv";
import { FireblocksService } from "../services/fireblocks/fireblocks.service";
import { ChainDescriptor, FeeLevel, StakingProvider } from "@fireblocks/ts-sdk";

dotenv.config();

const depositVaultId = process.env.DEPOSIT_OMNIBUS_VAULT_ID;

const fireblocksService = new FireblocksService();

export function startSolStakingJob() {
  cron.schedule(
    "0 12 * * *",
    async () => {
      // This sets the job to run daily at noon
      try {
        if (depositVaultId) {
            console.log("Sol Staking job started");
            const solAsset = await fireblocksService.fireblocksSDK.vaults.getVaultAccountAsset({
            vaultAccountId: depositVaultId,
            assetId: "SOL_TEST"
          });
          const solBalance = Number(solAsset.data.total);

          const reserveRequired = solBalance * 0.1; // Reserve 10%
          const availableForStaking = solBalance - reserveRequired;

          if (availableForStaking > 0) {
            const stakeRequest = {
              stakeRequest: {
                vaultAccountId: depositVaultId,
                providerId: StakingProvider.Kiln,
                stakeAmount: availableForStaking.toString(),
                txNote: "Staking SOL through Fireblocks",
                feeLevel: FeeLevel.Medium
              },
              chainDescriptor: ChainDescriptor.SolTest,
              idempotencyKey: `stake-${Date.now()}`
            };
            const response = await fireblocksService.fireblocksSDK.staking.stake(stakeRequest);
            console.log("Staking response:", response);
          }
        } else {
          throw new Error(".env missing DEPOSIT_OMNIBUS_VAULT_ID");
        }
      } catch (error) {
        console.error("Error during staking:", error);
      }
    },
    {
      scheduled: true,
      timezone: "America/New_York"
    }
  );
}
