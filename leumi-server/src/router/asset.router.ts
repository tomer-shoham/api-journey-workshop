import { Router } from "express";
import { AssetController } from "../controllers/asset.controller";

export class AssetRouter {
  public router = Router({ mergeParams: true });
  constructor(assetController: AssetController) {
    this.router.get("/", (req, res) => assetController.getAssets(req, res));
    this.router.get("/:assetId", (req, res) => assetController.getAsset(req, res));
    this.router.post("/:assetId", (req, res) => assetController.createAsset(req, res));
    this.router.post("/:assetId/withdrawal", (req, res) => assetController.withdrawal(req, res));
    this.router.post("/:assetId/deposit", (req, res) => assetController.deposit(req, res));
    this.router.post("/:assetId/buy", (req, res) => assetController.buy(req, res));
  }
}
