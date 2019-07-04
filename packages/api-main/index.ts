#!/usr/bin/env node
/* eslint no-unreachable: "off" */

/**
 * Module dependencies.
 */
import http from 'http'
import { createTerminus } from '@godaddy/terminus'
import logger from './utils/logger'

async function main() {
  const app = await require('./app').createApiServer()

  /**
   * Get port from environment and store in Express.
   */

  const port = normalizePort(process.env.PORT || '3000')
  app.set('port', port)

  /**
   * Create HTTP server.
   */

  const server = http.createServer(app)

  /**
   * Listen on provided port, on all network interfaces.
   */

  server.listen(port, () => {
    const addr = server.address()
    const bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr.port}`
    logger.info(`Listening on ${bind}`)
    logger.info(`NODE_ENV: ${process.env.NODE_ENV}`)
    if (process.send) {
      process.send('ready') // notify PM2
    }
  })

  server.on('error', (error: any) => {
    if (error.syscall && error.syscall !== 'listen') {
      throw error
    }

    const bind = typeof port === 'string' ? `Pipe ${port}` : `Port ${port}`

    // handle specific listen errors with friendly messages
    switch (error.code) {
      case 'EACCES':
        logger.error(`${bind} requires elevated privileges`)
        process.exit(1)
        break
      case 'EADDRINUSE':
        logger.error(`${bind} is already in use`)
        process.exit(1)
        break
      default:
        throw error
    }
  })

  // listen stop signals & handle server down gracefully
  createTerminus(server, {
    timeout: 5000,
    signals: ['SIGINT', 'SIGTERM', 'SIGHUP'],
    logger: (_, err: Error) => {
      logger.error(err)
    },
    onSignal: () => {
      logger.info('going to close the server...')
      // 01. close sequelize
      const sequelize = require('./models/sequelize')
      return Promise.all([sequelize.close()])
    },
    onShutdown: () => {
      logger.info('teardown process finished, ready to close server...')
      return Promise.resolve(null)
    },
  })
}

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val: string) {
  const port = parseInt(val, 10)

  if (isNaN(port)) {
    // named pipe
    return val
  }

  if (port >= 0) {
    // port number
    return port
  }

  return false
}

/**
 * run the main function to start the app
 */
main()
