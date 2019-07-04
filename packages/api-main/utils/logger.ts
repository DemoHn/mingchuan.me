import winston from 'winston'

const debugFormat = winston.format.printf(info => {
  return `${info.timestamp} ${info.level}: ${info.message}`
})

const logger = winston.createLogger({
  level: (() => {
    if (process.env.LOG_LEVEL) return process.env.LOG_LEVEL
    return 'info'
  })(),
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.splat(),
    winston.format.colorize(),
    debugFormat
  ),
  transports: [new winston.transports.Console()],
})

export default logger
