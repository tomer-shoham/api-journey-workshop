import { NextFunction, Request, Response, Router } from "express";
import { MainModule } from "../modules/main.module";
import jwt from "jsonwebtoken";
import { config } from "../config";
import { TLoggedInUser } from "../types/user.types";

const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({ error: "Unauthorized: No token provided" });
      return;
    }
    const token = authHeader.split(" ")[1];
    const decode = jwt.verify(token, config.google.CLIENT_SECRET) as { user: TLoggedInUser };
    req.user = decode.user;
    next();
  } catch (error) {
    res.status(401).json({ error: "Unauthorized: Invalid token" });
    return;
  }
};

export class MainRouter {
  public router = Router();
  constructor(mainModule: MainModule) {
    this.router.use("/auth", mainModule.authModule.authRouter.router);
    this.router.use("/leumi-wallets", authMiddleware, mainModule.leumiWalletModule.leumiWalletRouter.router);
    this.router.use("/webhooks", mainModule.webhookModule.webhookRouter.router);
  }
}
