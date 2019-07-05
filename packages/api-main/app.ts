// app.ts
// This is the main file for `api-main` for local deploy
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import compression from 'compression'
import accountController from './controllers/accountController'
import { AppError } from './utils/errors'

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

  app.post('/accounts/register', accountController.register)

  app.use((error: any, _: any, res: any, __: any) => {
    if (error.$type === 'AppError') {
      const e = error as AppError
      res.status(e.statusCode).json({
        data: e.data,
        message: e.message,
        name: e.name,
      })
    } else {
      // unknown error
      res.status(500).json({
        message: error.message,
        name: 'UnknownError',
      })
    }
  })
  return app
}
