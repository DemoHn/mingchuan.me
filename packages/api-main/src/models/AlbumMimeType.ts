import { Model, DataTypes } from 'sequelize'
import { sequelize } from './_sequelize'

export default class AlbumMimeType extends Model {
  public id!: number
  public mimeType!: string
  public handlerType!: number

  public readonly createdAt!: Date
  public readonly updatedAt!: Date
}

export interface AlbumMimeTypePayload {
  mimeType: string
  handlerType: number
}

AlbumMimeType.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    mimeType: {
      type: DataTypes.STRING,
      allowNull: false
    },
    handlerType: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  },
  {
    sequelize,
    tableName: 'album_mime_type'
  }
)