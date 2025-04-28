import { LeumiWalletService } from "../services/leumi-wallet.service";
import { Request, Response } from "express";
export class LeumiWalletController {
  constructor(private readonly leumiWalletService: LeumiWalletService) {}
  public async getLeumiWallet(req: Request, res: Response) {
    const leumiWallet = await this.leumiWalletService.getLeumiWallet(req.params.leumiWalletId);
    res.json(leumiWallet);
  }
  public getLeumiWalletByUserId() {}
}
