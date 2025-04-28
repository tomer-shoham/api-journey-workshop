import { AuthController } from "./auth.controller";
import { MainService } from "../services/main.service";
import { LeumiWalletController } from "./leumi-wallet.controller";
import { AssetController } from "./asset.controller";
import { TransactionController } from "./transaction.controller";
import { WebhookController } from "./webhook.controller";

export class MainController {
  public authController: AuthController;
  public leumiWalletController: LeumiWalletController;
  public assetController: AssetController;
  public transactionController: TransactionController;
  public webhookController: WebhookController;
  constructor(mainService: MainService) {
    this.authController = new AuthController(mainService.authService);
    this.webhookController = new WebhookController(mainService.webhookService);
    this.leumiWalletController = new LeumiWalletController(mainService.leumiWalletService);
    this.assetController = new AssetController(mainService.assetService);
    this.transactionController = new TransactionController(mainService.transactionService);
  }
}
