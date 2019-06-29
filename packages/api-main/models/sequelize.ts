import { Sequelize } from 'sequelize'
import config from '../config/default'

var sequelizeInstance: any = null

if (sequelizeInstance) {
  const dbConfig = config.database
  sequelizeInstance = new Sequelize(dbConfig.url, dbConfig.sequelize)
}

export const sequelize = sequelizeInstance

export function close() {
  if (sequelizeInstance) {
    return sequelizeInstance.close()
  } else {
    return Promise.resolve(null)
  }
}
