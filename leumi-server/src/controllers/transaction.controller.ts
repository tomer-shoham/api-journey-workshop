import { TransactionService } from "../services/transaction.service";
import { Request, Response } from "express";

export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}
  public async getTransactions(req: Request, res: Response) {
    const txs = await this.transactionService.getTransactions();
    res.json(txs);
  }
}
