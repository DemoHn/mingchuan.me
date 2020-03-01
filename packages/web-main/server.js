const next = require('next')
const express = require('express')
const proxyMiddleware = require('http-proxy-middleware')

const devProxy = {
  '/api': {
    target: 'http://localhost:4000/api/',
    pathRewrite: { '^/api': '/' },
    changeOrigin: true,
  },
}

const host = '127.0.0.1'
const port = process.env.PORT || 3000
const env = process.env.NODE_ENV
const dev = env !== 'production'
const app = next({
  dir: '.', // base directory where everything is, could move to src later
  dev,
})

const handle = app.getRequestHandler()

let server
app
  .prepare()
  .then(() => {
    server = express()

    // Set up the proxy.
    if (dev && devProxy) {
      Object.keys(devProxy).forEach(function (context) {
        server.use(proxyMiddleware(context, devProxy[context]))
      })
    }
    // e.g. /admin/posts/edit/1
    server.get('/admin/posts/edit/:slug', (req, res) => {
      return app.render(req, res, '/admin/posts/edit', { id: req.params.slug })
    })

    server.get('/posts/:slug', (req, res) => {
      return app.render(req, res, '/post', { id: req.params.slug })
    })

    // Default catch-all handler to allow Next.js to handle all other routes
    server.all('*', (req, res) => handle(req, res))

    server.listen(port, host, err => {
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
