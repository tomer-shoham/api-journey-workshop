import { config } from "../config";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import { UserService } from "./user.service";
import { LeumiWalletService } from "./leumi-wallet.service";

export class AuthService {
  private readonly _oAuth2Client = new OAuth2Client(
    config.google.CLIENT_ID,
    config.google.CLIENT_SECRET,
    config.google.REDIRECT_URL
  );

  constructor(
    private readonly userService: UserService,
    private readonly leumiWalletService: LeumiWalletService
  ) {}

  public async googleLogin(googleToken: string) {
    try {
      const ticket = await this._oAuth2Client.verifyIdToken({
        idToken: googleToken,
        audience: config.google.CLIENT_ID
      });
      const payload = ticket.getPayload();
      if (payload && payload.email) {
        let user = await this.userService.getUserByEmail(payload.email);
        if (!user) {
          user = await this.userService.createUser({
            email: payload.email || "",
            name: payload.name || "",
            picture: payload.picture || ""
          });
          await this.leumiWalletService.createLeumiWallet({ userId: user.id });
          user = await this.userService.getUserById(user.id);
        }
        const token = jwt.sign(
          { user: { id: user?.id, name: user?.name, email: user?.email } },
          config.google.CLIENT_SECRET,
          {
            expiresIn: "4h"
          }
        );
        return { token, user };
      }
    } catch (err: any) {
      const errorMessage = err.message || JSON.stringify(err);
      console.error(`login error - ${errorMessage}`);
    }
  }

  public async getLoggedInUser(userId: string) {
    try {
      return this.userService.getUserById(userId);
    } catch (err: any) {
      const errorMessage = err.message || JSON.stringify(err);
      console.error(`getLoggedInUser error - ${errorMessage}`);
    }
  }
}
