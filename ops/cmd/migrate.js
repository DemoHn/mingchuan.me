const Executor = require('../lib/executor')

class MigrateCommand {
  static make () {
    return new MigrateCommand()
  }

  run (subcmd = 'up') {
    const env = {
      'DATABASE_URL': 'mysql://general-user:password@127.0.0.1:3306/mce_main?multipleStatements=true'
    }

    new Executor(env, './packages/api-main').run(`node ./node_modules/.bin/db-migrate ${subcmd}`)
  }
}

module.exports = MigrateCommand