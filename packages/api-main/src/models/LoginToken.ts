import { Model, DataTypes } from 'sequelize'
import { sequelize } from './_sequelize'

export default class LoginToken extends Model {
  public id!: number
  public accountID!: number
  public publicKey!: string

  /** tokenIdentifier: the unique identifer for each publicKey
   * For security reason, we won't expose publicKey to login credentials, so
   * we use this identifier to locate the right publicKey.
   *
   * Thus we can support login for multiple devices.
   */
  public deviceIdentifier!: string
  public readonly createdAt!: Date
  public readonly updatedAt!: Date
}

export interface LoginTokenPayload {
  accountID: number
  publicKey: string
  deviceIdentifier: string
}

LoginToken.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    accountID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'account_id',
    },
    publicKey: {
      type: DataTypes.TEXT,
      allowNull: false,
      field: 'public_key',
    },
    deviceIdentifier: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      field: 'device_identifier',
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
    tableName: 'login_tokens',
  }
)
