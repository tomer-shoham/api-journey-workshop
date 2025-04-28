import { Table, Column, Model, DataType, ForeignKey, PrimaryKey } from "sequelize-typescript";
import { LeumiWallet } from "./LeumiWallet.model";

@Table({ tableName: "assets", timestamps: true })
export class Asset extends Model {
  @PrimaryKey
  @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4 })
  declare id: string;

  @ForeignKey(() => LeumiWallet)
  @Column({ type: DataType.UUID, allowNull: false })
  declare leumiWalletId: string;

  @Column({ type: DataType.STRING, allowNull: true })
  declare vaultId?: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare assetId: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare address: string;

  @Column({ type: DataType.FLOAT, defaultValue: 0 })
  declare amount?: number;
}
