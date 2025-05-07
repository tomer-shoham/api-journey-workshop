import { balanceReconciliation } from "../jobs/reconcileBalancesJob";
import { LeumiWalletService } from "../services/leumi-wallet.service";
import { Request, Response } from "express";
export class LeumiWalletController {
  constructor(private readonly leumiWalletService: LeumiWalletService) {}
  public async getLeumiWallet(req: Request, res: Response) {
    try {
      const leumiWallet = await this.leumiWalletService.getLeumiWallet(req.params.leumiWalletId);
      res.json(leumiWallet);
    } catch (err: any) {
      console.error("Error in reconcile:", err);
      res.status(500).json({
        message: "Failed to reconcile.",
        error: err.message || "An unexpected error occurred"
      });
    }
  }
  public getLeumiWalletByUserId() {}

  public async reconcile(_req: Request, res: Response) {
    try {
      const reconcileResponse = await balanceReconciliation();
      res.status(200).json(reconcileResponse);
    } catch (err: any) {
      console.error("Error in reconcile:", err);
      res.status(500).json({
        message: "Failed to reconcile.",
        error: err.message || "An unexpected error occurred"
      });
    }
  }
}
