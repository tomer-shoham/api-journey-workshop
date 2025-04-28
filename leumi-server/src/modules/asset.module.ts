import { AssetRouter } from "../router/asset.router";
import { AssetController } from "../controllers/asset.controller";

export class AssetModule {
  public assetRouter: AssetRouter;
  constructor(assetController: AssetController) {
    this.assetRouter = new AssetRouter(assetController);
  }
}
