import { TransactionService } from "../services/transaction.service";
import { Request, Response } from "express";

export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}
  public async getTransactions(req: Request, res: Response) {
    try {
      const { leumiWalletId } = req.params;

      const txs = await this.transactionService.getTransactions(leumiWalletId);
      res.json(txs);
    } catch (e) {
      console.error(e);
      res.sendStatus(400);
    }
  }
}
