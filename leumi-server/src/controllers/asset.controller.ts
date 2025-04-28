import { AssetService } from "../services/asset.service";
import { Request, Response } from "express";

export class AssetController {
  constructor(private readonly assetService: AssetService) {}
  public async getAssets(req: Request, res: Response) {
    const assets = await this.assetService.getAssets();
    res.json(assets);
  }
  public async getAsset(req: Request, res: Response) {
    const asset = await this.assetService.getAsset();
    res.json(asset);
  }
  public async createAsset(req: Request, res: Response) {
    const asset = await this.assetService.createAsset();
    res.json(asset);
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
