// app.ts
// This is the main file for `api-main` for local deploy
import express from 'express'
import cors from 'cors'
import mkdirp from 'mkdirp'
import multer from 'multer'
import helmet from 'helmet'
import compression from 'compression'
// middlewares
import errorHandler from './middlewares/errorHandler'
import authHandler from './middlewares/authHandler'

// controllers
import accountController from './controllers/accountController'
import postController from './controllers/postController'
import publicPostController from './controllers/publicPostController'
import albumController from './controllers/albumController'

// config
import config from './config/default'

export async function createApiServer() {
  const app = express()

  const upload = multer({
    dest: config.album.rootDir
  })
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
  // mkdirp dir
  mkdirp.sync(config.album.rootDir)
  // accounts
  app.post('/api/accounts/register', accountController.register)
  app.post('/api/accounts/login', accountController.login)
  app.patch('/api/accounts/password', authHandler, accountController.updatePassword)
  app.patch('/api/accounts/username', authHandler, accountController.updateUsername)
  app.get('/api/accounts/verify', authHandler, accountController.verifyToken)

  // posts
  app.post('/api/admin/posts', authHandler, postController.createPost)
  app.get('/api/admin/posts/:id', authHandler, postController.getOnePost)
  app.get('/api/admin/posts', authHandler, postController.listAllPosts)
  app.patch('/api/admin/posts/:id', authHandler, postController.updatePostContent)
  app.patch('/api/admin/posts/status/:id', authHandler, postController.updateStatus)
  app.patch(
    '/api/admin/posts/permission/:id',
    authHandler,
    postController.updatePermission
  )
  app.delete('/api/admin/posts/:id', authHandler, postController.deletePost)

  // public posts
  app.get('/api/posts/:id', publicPostController.getPublicPost)
  app.get('/api/posts', publicPostController.listPublicPosts)

  // album
  app.post('/api/admin/album/dir', authHandler, albumController.createDirectory)
  app.post('/api/admin/album/upload',
    authHandler,
    upload.single('uploadFile'),
    albumController.uploadFile)
  app.use(errorHandler)
  return app
}
