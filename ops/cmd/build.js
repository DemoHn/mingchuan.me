const Logger = require('../lib/logger')

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

    static make(targets = null) {
        return new BuildCommand(targets)
    }

    build() {
        for (var i = 0; i < this.targets.length; i++) {
            const tgt = this.targets[i]
            try {
                this.buildTarget(tgt)
            } catch (e) {
                console.log(e) // TODO
                break
            }            
        }
    }
    /**
     * private function
     * @param {string} target build target name
     */
    buildTarget(target) {
        this.logger.log(`start to build target: ${target}`)
    }
}

module.exports = BuildCommand