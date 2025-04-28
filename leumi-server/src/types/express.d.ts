import { TLoggedInUser } from "./user.types";

declare global {
  namespace Express {
    export interface Request {
      user: TLoggedInUser;
    }
  }
}
export {};
