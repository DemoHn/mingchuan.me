#!/usr/bin/env node
const BuildCmd = require('./ops/cmd/build')
const DevCmd = require('./ops/cmd/dev')
function main (argv) {
    switch (argv[2]) {
        case 'build':
            const cmd = BuildCmd.make()
            cmd.build()
            break
        case 'dev':
            DevCmd.make().run()
            break
        default:
            console.log('unknown command')
    }

}

main(process.argv)