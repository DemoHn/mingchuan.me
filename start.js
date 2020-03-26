#! /usr/bin/env node
const BuildCmd = require('./ops/cmd/build')

function main(argv) {
    switch (argv[2]) {
        case 'build':
            const cmd = BuildCmd.make()
            cmd.build()
            break
        default:
            console.log('unknown command')
    }

}

main(process.argv)