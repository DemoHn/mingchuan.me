import { Model, DataTypes } from 'sequelize'
import { sequelize } from './_sequelize'
export default class Post extends Model {
  public id!: number
  public title!: string
  public content!: string
  public status!: string
  public permission!: string

  public createdAt!: Date
  public updatedAt!: Date
}

export interface PostPayload {
  title: string
  content: string
  status: string
  permission: string
}

Post.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING(32),
      allowNull: false,
    },
    permission: {
      type: DataTypes.STRING(32),
      allowNull: false,
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
    tableName: 'posts',
  }
)
