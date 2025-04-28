import { AuthService } from "../services/auth.service";
import { Request, Response } from "express";

export class AuthController {
  constructor(private readonly authService: AuthService) {}

  public async googleLogin(req: Request, res: Response) {
    try {
      const result = await this.authService.googleLogin(req.body.idToken);
      res.status(200).json(result);
    } catch (e) {
      res.sendStatus(400);
    }
  }
  public async getLoggedInUser(req: Request, res: Response) {
    try {
      const result = await this.authService.getLoggedInUser(req.params.id);
      if (!result) {
        res.sendStatus(404);
        return;
      }
      res.status(200).json(result);
    } catch (e) {
      res.sendStatus(400);
    }
  }
}
