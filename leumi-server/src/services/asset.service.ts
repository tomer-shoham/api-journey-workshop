import { FireblocksService } from "./fireblocks/fireblocks.service";
import { LeumiWalletService } from "./leumi-wallet.service";
export class AssetService {
  constructor(
    private readonly fireblocksService: FireblocksService,
    private readonly leumiWalletService: LeumiWalletService
  ) {}
  public async getAssets() {
    return [];
  }
  public async getAsset() {
    return {};
  }
  public async createAsset() {
    return {};
  }
  public async withdrawal() {}
  public async deposit() {}
  public async buy() {
  }
}
