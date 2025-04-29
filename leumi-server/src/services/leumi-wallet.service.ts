import { LeumiWallet } from "../db/models/LeumiWallet.model";
import { FireblocksService } from "./fireblocks/fireblocks.service";
import { User } from "../db/models/User.model";
import { LeumiWalletType } from "../types/leumi-wallet.types";

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
  public async updateLeumiWallet(leumiWalletId: string, fieldsToUpdate: Partial<LeumiWalletType>) {
    try {
      const leumiWallet = await LeumiWallet.findOne({ where: { id: leumiWalletId } });
      if (!leumiWallet) {
        throw new Error("Leumi Wallet not found");
      }

      const updatedWallet = await leumiWallet.update(fieldsToUpdate);

      console.log("Leumi Wallet updated successfully:", updatedWallet);
      return updatedWallet.toJSON();
    } catch (error) {
      console.error("Error updating Leumi Wallet:", error);
      throw new Error("Failed to update Leumi Wallet");
    }
  }
}
