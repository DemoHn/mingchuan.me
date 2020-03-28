const Logger = require('../lib/logger')
const cp = require('child_process')

class DevCommand {
  targets = ['api-main', 'web-main']
  procs = []

  static make () {
    return new DevCommand()
  }

  run () {
    this.procs = [
      this.spawnTarget('api-main'),
      this.spawnTarget('web-main'),
    ]
  }

  spawnTarget (target) {    
    switch (target) {
      case 'api-main':
        return cp.spawn('node', [`./node_modules/nodemon/bin/nodemon.js`, 'src/index.ts', '--exec', 'node ./node_modules/ts-node/dist/bin.js'], {
          cwd: './packages/api-main',
          env: {
            ...process.env,
            'NODE_ENV': 'development',
            'DATABASE_URL': 'mysql://general-user:password@127.0.0.1:3306/mce_main?multipleStatements=true'
          },
          stdio: 'inherit'          
        })
      case 'web-main':
        return cp.spawn('node', [`./node_modules/nodeamon/bin/nodemon.js`, 'server.js'], {
          cwd: './packages/web-main',
          env: {
            ...process.env,
            'NODE_ENV': 'development',            
          },
          stdio: 'inherit'          
        })
    }
  }
}

module.exports = DevCommand