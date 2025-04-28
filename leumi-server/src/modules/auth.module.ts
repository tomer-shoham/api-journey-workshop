import { AuthController } from "../controllers/auth.controller";
import { AuthRouter } from "../router/auth.router";

export class AuthModule {
  public authRouter: AuthRouter;
  constructor(authController: AuthController) {
    this.authRouter = new AuthRouter(authController);
  }
}
