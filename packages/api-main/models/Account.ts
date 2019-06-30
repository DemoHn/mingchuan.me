import { Model, DataTypes } from 'sequelize'
import { sequelize } from './sequelize'

export default class Account extends Model {
  public id!: number
  public name!: string
  public passwordHash!: Buffer
  public permissionMask?: number

  public readonly createdAt!: Date
  public readonly updatedAt!: Date
}

export interface AccountPayload {
  name: string
  passwordHash: Buffer
  permissionMask?: number
}

Account.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(255),
      unique: true,
      allowNull: false,
    },
    passwordHash: {
      type: DataTypes.BLOB,
      allowNull: false,
    },
    permissionMask: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'accounts',
  }
)
