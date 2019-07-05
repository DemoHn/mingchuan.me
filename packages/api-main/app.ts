// app.ts
// This is the main file for `api-main` for local deploy
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import compression from 'compression'
// middlewares
import errorHandler from './middlewares/errorHandler'
import authHandler from './middlewares/authHandler'

// controllers
import accountController from './controllers/accountController'

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
  app.post('/accounts/login', accountController.login)
  app.patch('/accounts/password', authHandler, accountController.updatePassword)

  app.use(errorHandler)
  return app
}
