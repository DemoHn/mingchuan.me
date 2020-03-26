#!/usr/bin/env node
const BuildCmd = require('./ops/cmd/build')
const DevCmd = require('./ops/cmd/dev')
const MigrateCmd = require('./ops/cmd/migrate')

function main (argv) {
    switch (argv[2]) {
        case 'build':
            const cmd = BuildCmd.make()
            cmd.build()
            break
        case 'dev':
            DevCmd.make().run()
            break
        case 'migrate':
            MigrateCmd.make().run(argv[3] || 'up')
            break
        default:
            console.log('unknown command')
    }

}

main(process.argv)