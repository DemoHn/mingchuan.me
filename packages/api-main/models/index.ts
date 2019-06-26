import { Sequelize } from 'sequelize'
import Account, { initAccount } from './Account'
import Post, { initPost } from './Post'
import config from '../config/default'

export const sequelize = new Sequelize(config.database.url)

var initFlag = false
// init functions
if (!initFlag) {
  initAccount(sequelize)
  initPost(sequelize)

  // use initFlag to avoid duplicate initialization
  initFlag = true
}

export default {
  Account,
  Post,
  sequelize,
}
