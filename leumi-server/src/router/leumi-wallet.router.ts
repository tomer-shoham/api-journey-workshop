import { Router } from "express";
import { LeumiWalletController } from "../controllers/leumi-wallet.controller";
import { AssetModule } from "../modules/asset.module";
import { TransactionModule } from "../modules/transaction.module";

export class LeumiWalletRouter {
  public router = Router();
  constructor(
    leumiWalletController: LeumiWalletController,
    assetModule: AssetModule,
    transactionModule: TransactionModule
  ) {
    this.router.get("/:leumiWalletId", (req, res) => leumiWalletController.getLeumiWallet(req, res));
    this.router.use("/:leumiWalletId/assets", assetModule.assetRouter.router);
    this.router.use("/:leumiWalletId/transactions", transactionModule.transactionRouter.router);
  }
}
