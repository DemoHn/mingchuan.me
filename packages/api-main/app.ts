// app.ts
// This is the main file for `api-main` for local deploy
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import compression from 'compression'
import { register } from './controllers/accountController'

export async function createApiServer() {
  const app = express()

  const corsInstance = cors({
    // FIXME: better config!?
    exposedHeaders: ['Content-Type', 'Authorization'],
  })

  app.use(helmet())
  app.use(compression())
  app.use(corsInstance)

  app.use(express.json())
  app.use(express.urlencoded({ extended: false }))
  app.disable('x-powered-by')
  app.options('*', corsInstance)

  app.post('/accounts/register', register)

  // catch 404 and forward to error handler
  /*app.use(function(req, res, next) {
    next(new error.ResourceNotFoundError(req))
  })

  // Invoke audit logger for failed calls
  app.use(auditLogger.expressErrorHandler)

  app.use(errorHandler.generalErrorHandler)
  */
  return app
}
