import { Router } from "express";
import { TransactionController } from "../controllers/transaction.controller";

export class TransactionRouter {
  public router = Router({ mergeParams: true });
  constructor(transactionController: TransactionController) {
    this.router.get("/", (req, res) => transactionController.getTransactions(req, res));
  }
}
