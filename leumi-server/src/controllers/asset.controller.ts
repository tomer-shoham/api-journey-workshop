import { AssetService } from "../services/asset.service";
import { Request, Response } from "express";

export class AssetController {
  constructor(private readonly assetService: AssetService) {}
  public async getAssets(req: Request, res: Response) {
    const leumiWalletId = req.params.leumiWalletId;
    console.log("leumiWalletId", leumiWalletId);
    const assets = await this.assetService.getAssets(leumiWalletId);
    res.json(assets);
  }
  public async getAsset(req: Request, res: Response) {
    const asset = await this.assetService.getAsset();
    res.json(asset);
  }
  public async createAsset(req: Request, res: Response) {
    const assetId = req.params.assetId;
    const leumiWalletId = req.params.leumiWalletId;

    // console.log("assetId", assetId);
    // console.log("leumiWalletId", leumiWalletId);

    // if (assetId === "ETH_TEST6" || assetId === "SOL_TEST") {
    //   const assets = await this.assetService.getAssets(leumiWalletId);
    //   const newVault = this.
    // }

    const asset = await this.assetService.createAsset(leumiWalletId, assetId);
    // res.json(asset);
    res.sendStatus(200);
  }
  public async withdrawal(req: Request, res: Response) {
    await this.assetService.withdrawal();
    res.sendStatus(200);
  }
  public async deposit(req: Request, res: Response) {
    await this.assetService.deposit();
    res.sendStatus(200);
  }
  public async buy(req: Request, res: Response) {
    await this.assetService.buy();
    res.sendStatus(200);
  }
}
