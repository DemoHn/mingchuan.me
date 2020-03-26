const Logger = require('../lib/logger')
const Executor = require('../lib/executor')

class BuildCommand {
    static allTargets = ['api-main', 'web-main']

    logger = null
    /**
     * set build targets
     * @param {array} targets 
     */
    constructor(targets = null) {
        this.logger = Logger.make()
        if (targets === null) {
            this.targets = BuildCommand.allTargets
        } else {
            // filter targets
            this.targets = targets
        }
    }

    static make (targets = null) {
        return new BuildCommand(targets)
    }

    build () {
        for (var i = 0; i < this.targets.length; i++) {
            const tgt = this.targets[i]
            try {
                this.buildTarget(tgt)
            } catch (e) {
                this.logger.log(e)
                break
            }
        }
    }
    /**
     * private function
     * @param {string} target build target name
     */
    buildTarget (target) {
        var timer = this.logger.logWithTimerStart(`start to build target: ${target}`)
        switch (target) {
            case 'web-main':
                new Executor({}, './packages/web-main').runBatch([
                    'yarn',
                    'yarn build'
                ])
                this.logger.logWithTimerEnd(timer)
            case 'api-main':
                new Executor({}, './packages/api-main').runBatch([
                    'yarn',
                    'yarn build'
                ])
                this.logger.logWithTimerEnd(timer)
        }
    }
}

module.exports = BuildCommand