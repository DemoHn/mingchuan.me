import { Model, DataTypes } from 'sequelize'
import { sequelize } from './_sequelize'

export default class AlbumFile extends Model {
  public id!: number
  public directoryId!: number
  public hashKey!: string
  public mimeType!: number
  public size!: number
  public name!: string

  public readonly createdAt!: Date
  public readonly updatedAt!: Date
}

export interface AlbumFilePayload {
  directoryId: number
  hashKey: string
  mimeType: number
  size: number
  name: string
}

AlbumFile.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    directoryId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    hashKey: {
      type: DataTypes.STRING,
      allowNull: false
    },
    mimeType: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    size: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  {
    sequelize,
    tableName: 'album_file'
  }
)