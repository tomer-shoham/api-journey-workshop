import { Assets, AssetService } from "../services/asset.service";
import { Request, Response } from "express";

export class AssetController {
  constructor(private readonly assetService: AssetService) {}

  public async getVaultAccount(req: Request, res: Response) {
    try {
      console.log("getVaultAccount");
      const vaultAccountId = String(req.params.vaultAccountId);
      console.log("getVaultAccount", vaultAccountId);
      const vaultAccount = await this.assetService.getFbVaultAccount(vaultAccountId);
      res.status(200).json(vaultAccount);
    } catch (err: any) {
      console.error("Error in getVaultAccount:", err);
      res.status(500).json({
        message: "Failed to fetch vault account.",
        error: err.message || "An unexpected error occurred"
      });
    }
  }

  public async getAssets(req: Request, res: Response) {
    try {
      const leumiWalletId = req.params.leumiWalletId;
      console.log("leumiWalletId", leumiWalletId);
      const assets = await this.assetService.getAssets(leumiWalletId);
      res.status(200).json(assets);
    } catch (err: any) {
      console.error("Error in getAssets:", err);
      res.status(500).json({
        message: "Failed to fetch assets.",
        error: err.message || "An unexpected error occurred"
      });
    }
  }
  public async getAsset(req: Request, res: Response) {
    try {
      const { leumiWalletId, assetId } = req.params;
      const asset = await this.assetService.getAsset(leumiWalletId, assetId);
      res.status(200).json(asset);
    } catch (err: any) {
      console.error("Error in getAsset:", err);
      res.status(500).json({
        message: "Failed to fetch asset.",
        error: err.message || "An unexpected error occurred"
      });
    }
  }

  public async createAsset(req: Request, res: Response) {
    try {
      const { leumiWalletId, assetId } = req.params;

      await this.assetService.createAsset(leumiWalletId, assetId);
      res.sendStatus(200);
    } catch (err: any) {
      console.error("Error in createAsset:", err);
      res.status(500).json({
        message: "Failed to create asset.",
        error: err.message || "An unexpected error occurred"
      });
    }
  }

  public async withdrawal(req: Request, res: Response) {
    try {
      const { leumiWalletId, assetId } = req.params;
      const address = req.body.address;
      const amount = Number(req.body.amount);

      await this.assetService.withdrawal(leumiWalletId, assetId, amount, address);
      res.sendStatus(200);
    } catch (err: any) {
      console.error("Error in withdrawal:", err);
      res.status(500).json({
        message: "Failed to withdrawal asset.",
        error: err.message || "An unexpected error occurred"
      });
    }
  }

  public async deposit(req: Request, res: Response) {
    try {
      const { leumiWalletId, assetId } = req.params;
      const amount = Number(req.body.amount);
      await this.assetService.deposit(leumiWalletId, assetId, amount);
      res.sendStatus(200);
    } catch (err: any) {
      console.error("Error in createAsset:", err);
      res.status(500).json({
        message: "Failed to deposit asset.",
        error: err.message || "An unexpected error occurred"
      });
    }
  }
  public async buy(req: Request, res: Response) {
    try {
      const leumiWalletId = req.params.leumiWalletId;
      const assetId = req.params.assetId as Assets;
      const amount = Number(req.body.amount);
      console.log(amount);
      await this.assetService.buy(leumiWalletId, assetId, amount);
      res.sendStatus(200);
    } catch (err: any) {
      console.error("Error in buy asset:", err);
      res.status(500).json({
        message: "Failed to create asset.",
        error: err.message || "An unexpected error occurred"
      });
    }
  }
}
