const defaultTimeFormatter = (date) => {
    function padZero(x) {
        if (x < 10) {
            return '0' + x
        }
        return '' + x            
    }

    const year = date.getFullYear()
    const month = padZero(date.getMonth() + 1)
    const dateT = padZero(date.getDate())
    const hour = padZero(date.getHours())
    const minute = padZero(date.getMinutes())
    const second = padZero(date.getSeconds())

    return `${year}-${month}-${dateT} ${hour}:${minute}:${second}`
}

class Logger {
    // timeFormatter: a callback function to format date
    timeFormatter = defaultTimeFormatter
    timers = {}

    static make() {
        return new Logger()
    }

    log(...args) {
        const date = new Date()
        console.log(`[${this.timeFormatter(date)}]`, ...args)
    }

    logWithTimerStart(...args) {
        const date = new Date()
        const tsInSec = Math.floor(date.getTime() / 1000)
        const timerFlag = `${this.genRandomString(4)}:${tsInSec}`

        this.timers[timerFlag] = process.hrtime()
        console.log(`[${this.timeFormatter(date)}]`, ...args)        
    }

    logWithTimerEnd(timer, ...args) {
        const date = new Date()
        console.log(`[${this.timeFormatter(date)}]`, ...args)

        var oldT = this.timers[timer]
        var newT = process.hrtime()

        if (oldT == null) {
            return 0
        }
        var diff = (oldT[0] * 1e9 + oldT[1] - newT[0] * 1e9 - newT[1])
        // unset timer
        delete this.timers[timer]
        return diff
    }

    genRandomString(len = 4) {
        const dict = 'abcdefghijklmnopqrstuvwxyz0123456789'
        var result = ''
        for (var i = 0; i < len; i++) {
            var key = Math.floor(Math.random() * dict.length)
            result = result + dict[key]
        }
        
        return result
    }
}

module.exports = Logger