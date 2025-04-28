import { LeumiWallet } from "../db/models/LeumiWallet.model";
import { FireblocksService } from "./fireblocks/fireblocks.service";
import { User } from "../db/models/User.model";

export class LeumiWalletService {
  constructor(private readonly fireblocksService: FireblocksService) {}
  public async createLeumiWallet({ userId }: { userId: string }) {
    return LeumiWallet.create({ userId });
  }
  public async getLeumiWallet(leumiWalletId: string) {
    return LeumiWallet.findOne({
      where: {
        id: leumiWalletId
      },
      include: [User]
    });
  }
  public async updateLeumiWallet() {
    return {};
  }
}
