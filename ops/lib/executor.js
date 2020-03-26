const cp = require('child_process')
const Logger = require('./logger')

class Executor {
  cwd = null
  /**
   * command: command in string
   */
  command = null

  env = {}
  constructor(env = {}, cwd = null) {
    this.cwd = cwd
    this.env = Object.assign({}, process.env, env)
    this.logger = Logger.make()
  }

  /**
   * 
   * @param {string} cmd command in string
   * @returns {number} exit code
   */
  run (cmd) {
    const options = {
      cwd: this.cwd,
      env: this.env,
      windowsHide: true,
      stdio: 'inherit'
    }

    this.logger.log(`execute cmd: ‹${cmd}›`)
    try {
      cp.execSync(cmd, options)
      this.logger.log(`[OK] execute success (code=0)`)
      return 0
    } catch (e) {
      this.logger.log(`[FAIL] execute fail (code=${e.status})`)
      return e.status
    }

  }

  /**
   * 
   * @param {array} cmdBatch 
   */
  runBatch (cmdBatch) {
    for (let i = 0; i < cmdBatch.length; i++) {
      this.logger.log(`running batch [${i + 1}/${cmdBatch.length}] ...`)
      const code = this.run(cmdBatch[i])
      if (code != 0) {
        break
      }
    }
  }
}

module.exports = Executor