import { Column, DataType, Model, HasOne, Table, PrimaryKey } from "sequelize-typescript";
import { LeumiWallet } from "./LeumiWallet.model";

@Table({ tableName: "users", timestamps: true })
export class User extends Model {
  @PrimaryKey
  @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4 })
  declare id: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare name: string;

  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  declare email: string;

  @Column({ type: DataType.STRING })
  declare picture?: string;

  @HasOne(() => LeumiWallet)
  wallet!: LeumiWallet;
}
