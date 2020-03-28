import { config } from 'dotenv'

config()

const defaultConfig: any = {
  database: {
    type: 'mysql',
    url: process.env.DATABASE_URL,
    sequelize: {
      logging: console.log,
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
  album: {
    rootDir: process.env.ALBUM_ROOT_DIR || `${process.cwd()}/files`
  }
}

export default defaultConfig
