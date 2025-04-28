import dotenv from "dotenv";

export type TConfigDB = { DB_HOST: string; DB_USER: string; DB_PASSWORD: string; DB_NAME: string };

export type TConfigGoogle = { CLIENT_ID: string; CLIENT_SECRET: string; REDIRECT_URL: string };

export type TConfigFireblocks = { BASE_PATH: string; API_KEY: string };

dotenv.config();

export const config: {
  db: TConfigDB;
  google: TConfigGoogle;
  fireblocks: TConfigFireblocks;
  port: number;
} = {
  port: Number(process.env.PORT) || 3001,
  db: {
    DB_HOST: process.env.DB_HOST || "",
    DB_USER: process.env.DB_USER || "",
    DB_PASSWORD: process.env.DB_PASSWORD || "",
    DB_NAME: process.env.DB_NAME || ""
  },
  google: {
    CLIENT_ID: process.env.GOOGLE_CLIENT_ID || "",
    CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET || "",
    REDIRECT_URL: process.env.GOOGLE_REDIRECT_URL || ""
  },
  fireblocks: {
    BASE_PATH: process.env.FIREBLOCKS_BASE_PATH || "",
    API_KEY: process.env.FIREBLOCKS_API_KEY || ""
  }
};
