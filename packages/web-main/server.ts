import express from 'express'
import next from 'next'

const devProxy: any = {
  '/api': {
    target: 'http://localhost:4000/api/',
    pathRewrite: { '^/api': '/' },
    changeOrigin: true,
  },
}

const port = process.env.PORT || 3000
const env = process.env.NODE_ENV
const dev = env !== 'production'
const app = next({
  dir: '.', // base directory where everything is, could move to src later
  dev,
})

const handle = app.getRequestHandler()

let server: any
app
  .prepare()
  .then(() => {
    server = express()

    // Set up the proxy.
    if (dev && devProxy) {
      const proxyMiddleware = require('http-proxy-middleware')
      Object.keys(devProxy).forEach(function(context) {
        server.use(proxyMiddleware(context, devProxy[context]))
      })
    }

    // Default catch-all handler to allow Next.js to handle all other routes
    server.all('*', (req: any, res: any) => handle(req, res))

    server.listen(port, (err: Error) => {
      if (err) {
        throw err
      }
      console.log(`> Ready on port ${port} [${env}]`)
    })
  })
  .catch(err => {
    console.log('An error occurred, unable to start the server')
    console.log(err)
  })
