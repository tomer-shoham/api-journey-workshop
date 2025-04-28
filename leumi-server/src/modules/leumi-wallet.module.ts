import { LeumiWalletRouter } from "../router/leumi-wallet.router";
import { LeumiWalletController } from "../controllers/leumi-wallet.controller";
import { AssetModule } from "./asset.module";
import { TransactionModule } from "./transaction.module";

export class LeumiWalletModule {
  public leumiWalletRouter: LeumiWalletRouter;
  constructor(
    leumiWalletController: LeumiWalletController,
    assetModule: AssetModule,
    transactionModule: TransactionModule
  ) {
    this.leumiWalletRouter = new LeumiWalletRouter(leumiWalletController, assetModule, transactionModule);
  }
}
