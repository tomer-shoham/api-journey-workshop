import { UserService } from "./user.service";
import { LeumiWalletService } from "./leumi-wallet.service";
import { AssetService } from "./asset.service";
import { TransactionService } from "./transaction.service";
import { FireblocksService } from "./fireblocks/fireblocks.service";
import { AuthService } from "./auth.service";
import { WebhookService } from "./webhook.service";
import { SchedulerService } from "./scheduler.service";
export class MainService {
  private fireblocksService!: FireblocksService;
  public authService!: AuthService;
  public userService!: UserService;
  public leumiWalletService!: LeumiWalletService;
  public assetService!: AssetService;
  public transactionService!: TransactionService;
  public webhookService!: WebhookService;
  public schedulerService!: SchedulerService;
  constructor() {}

  init() {
    this.fireblocksService = new FireblocksService();
    this.schedulerService = new SchedulerService(this.fireblocksService);
    this.webhookService = new WebhookService(this.fireblocksService);
    this.userService = new UserService();
    this.leumiWalletService = new LeumiWalletService(this.fireblocksService);
    this.assetService = new AssetService(this.fireblocksService, this.leumiWalletService);
    this.authService = new AuthService(this.userService, this.leumiWalletService);
    this.transactionService = new TransactionService(this.fireblocksService);
  }
}
