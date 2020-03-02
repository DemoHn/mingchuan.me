import { Model, DataTypes } from 'sequelize'
import { sequelize } from './_sequelize'

export default class AlbumDirectory extends Model {
  public id!: number
  public parentNode!: number
  public name!: string

  public readonly createdAt!: Date
  public readonly updatedAt!: Date
}

export interface AlbumDirectoryPayload {
  parentNode: number
  name: string
}

AlbumDirectory.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    parentNode: {
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
    tableName: 'album_directory'
  }
)