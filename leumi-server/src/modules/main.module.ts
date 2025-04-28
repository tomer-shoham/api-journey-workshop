import { MainService } from "../services/main.service";
import { MainController } from "../controllers/main.controller";
import { AuthModule } from "./auth.module";
import { LeumiWalletModule } from "./leumi-wallet.module";
import { AssetModule } from "./asset.module";
import { TransactionModule } from "./transaction.module";
import { WebhookModule } from "./webhook.module";

export class MainModule {
  public mainController: MainController;
  public mainService = new MainService();
  public authModule: AuthModule;
  public leumiWalletModule: LeumiWalletModule;
  public assetModule: AssetModule;
  public transactionModule: TransactionModule;
  public webhookModule: WebhookModule;
  constructor() {
    this.mainService.init();
    this.mainController = new MainController(this.mainService);
    this.webhookModule = new WebhookModule(this.mainController.webhookController);
    this.authModule = new AuthModule(this.mainController.authController);
    this.assetModule = new AssetModule(this.mainController.assetController);
    this.transactionModule = new TransactionModule(this.mainController.transactionController);
    this.leumiWalletModule = new LeumiWalletModule(
      this.mainController.leumiWalletController,
      this.assetModule,
      this.transactionModule
    );
  }
}
