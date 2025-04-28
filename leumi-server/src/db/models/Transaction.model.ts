import { Table, Column, Model, DataType, PrimaryKey, ForeignKey } from "sequelize-typescript";
import { LeumiWallet } from "./LeumiWallet.model";

@Table({ tableName: "transactions", timestamps: true })
export class Transaction extends Model {
  @PrimaryKey
  @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4 })
  declare id: string;

  @Column({ type: DataType.STRING })
  declare source: string;

  @Column({ type: DataType.STRING })
  declare destination: string;

  @Column({ type: DataType.FLOAT })
  declare amount: number;

  @Column({ type: DataType.STRING })
  declare assetId: string;

  @ForeignKey(() => LeumiWallet)
  @Column({ type: DataType.UUID, allowNull: false })
  declare leumiWalletId: string;
}
