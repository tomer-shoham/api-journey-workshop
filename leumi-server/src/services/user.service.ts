import { User } from "../db/models/User.model";
import { LeumiWallet } from "../db/models/LeumiWallet.model";

export class UserService {
  constructor() {}
  public async createUser({ name, email, picture }: { name: string; email: string; picture?: string }): Promise<User> {
    const newUser = await User.create({ name, email, picture }, { returning: true });
    return newUser.toJSON();
  }
  public async getUserById(userId: string): Promise<User | null> {
    return User.findOne({ where: { id: userId }, include: [LeumiWallet] });
  }
  public async getUserByEmail(email: string): Promise<User | null> {
    const user = await User.findOne({ where: { email }, include: [LeumiWallet] });
    return user?.toJSON() ?? null;
  }
}
