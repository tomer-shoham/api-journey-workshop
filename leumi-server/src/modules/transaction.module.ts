import { TransactionController } from "../controllers/transaction.controller";
import { TransactionRouter } from "../router/transaction.router";

export class TransactionModule {
  public transactionRouter: TransactionRouter;
  constructor(transactionController: TransactionController) {
    this.transactionRouter = new TransactionRouter(transactionController);
  }
}
