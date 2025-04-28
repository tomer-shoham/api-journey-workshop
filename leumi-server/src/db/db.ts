import { Sequelize } from "sequelize-typescript";
import { config } from "../config";
import { User } from "./models/User.model";
import { LeumiWallet } from "./models/LeumiWallet.model";
import { Asset } from "./models/Asset.model";
import { Transaction } from "./models/Transaction.model";

export class DbClient {
  private _sequelize: Sequelize;
  constructor() {
    this._sequelize = new Sequelize({
      database: config.db.DB_NAME,
      username: config.db.DB_USER,
      password: config.db.DB_PASSWORD,
      host: config.db.DB_HOST,
      dialect: "postgres",
      logging: false,
      models: [User, LeumiWallet, Asset, Transaction]
    });
  }

  public async authenticate() {
    await this.sequelize.authenticate();
    console.log("✅ Database connected successfully");
  }

  public async connect() {
    try {
      await this.sequelize.sync({ alter: true });
      console.log("✅ Database synchronized");
    } catch (error) {
      process.exit(1);
    }
  }

  public async reset() {
    try {
      console.warn("⚠️ WARNING: Resetting the database! All data will be lost.");
      await this.sequelize.drop(); // Drop all tables
      console.log("✅ All tables dropped successfully.");
      await this.sequelize.sync({ force: true }); // Recreate tables
      console.log("✅ Database reset successfully.");
    } catch (error) {
      console.error("❌ Error resetting database:", error);
    }
  }

  public get sequelize(): Sequelize {
    return this._sequelize;
  }
}
