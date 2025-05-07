import { FireblocksService } from "../services/fireblocks/fireblocks.service";

const fireblocksService = new FireblocksService();

export default async function pollFbTxStatus(txId: string, maxRetries = 150, intervalMs = 2000): Promise<string> {
  try {
    for (let i = 0; i < maxRetries; i++) {
      const tx = await fireblocksService.fireblocksSDK.transactions.getTransaction({ txId });
      const status = tx.data.status;
      if (status && ["COMPLETED", "FAILED", "CANCELLED", "REJECTED", "DROPPED"].includes(status)) {
        return status;
      }
      await new Promise(res => setTimeout(res, intervalMs));
    }
    return "TIMEOUT";
  } catch (err: any) {
    console.error(`Error pulling tx status - ${err.message || JSON.stringify(err)}`);
    return "FB_ERROR";
  }
}
