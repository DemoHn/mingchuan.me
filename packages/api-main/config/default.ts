import { config } from 'dotenv'

config()

const defaultConfig: any = {
  database: {
    type: 'mysql',
    url: process.env.DATABASE_URL,
    sequelize: {
      logging: false,
      define: {
        underscored: true,
        freezeTableName: false,
        charset: 'utf8mb4',
        dialectOptions: {
          collate: 'utf8mb4_bin',
        },
        timestamps: true,
      },
    },
  },
}

export default defaultConfig
