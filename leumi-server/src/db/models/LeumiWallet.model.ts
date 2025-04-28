import { Table, Column, Model, DataType, ForeignKey, BelongsTo, PrimaryKey } from "sequelize-typescript";
import { User } from "./User.model";

@Table({ tableName: "leumi_wallets", timestamps: true })
export class LeumiWallet extends Model {
  @PrimaryKey
  @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4 })
  declare id: string;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, allowNull: false, unique: true })
  declare userId: string;

  @BelongsTo(() => User)
  declare user: User;

  @Column({ type: DataType.FLOAT, defaultValue: 1000000, allowNull: true })
  declare usdBalance: number;
}
