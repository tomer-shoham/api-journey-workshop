import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";

export class AuthRouter {
  public router = Router();
  constructor(authController: AuthController) {
    this.router.post("/google", async (req, res) => authController.googleLogin(req, res));
    this.router.get("/user/:id", async (req, res) => authController.getLoggedInUser(req, res));
  }
}
