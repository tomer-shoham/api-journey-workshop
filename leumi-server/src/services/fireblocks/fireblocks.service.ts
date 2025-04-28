import { Fireblocks } from "@fireblocks/ts-sdk";
import { config } from "../../config";
import fs from "fs";
import path from "path";

export class FireblocksService {
  private readonly _fireblocksSDK: Fireblocks;

  constructor() {
    const privateKey = fs
      .readFileSync(path.resolve(__dirname, "fireblocks_secret.key"), "utf8")
      .split(String.raw`\n`)
      .join("\n");
    this._fireblocksSDK = new Fireblocks({
      apiKey: config.fireblocks.API_KEY,
      secretKey: privateKey
    });
  }

  public get fireblocksSDK() {
    return this._fireblocksSDK;
  }
}
