const withTypescript = require('@zeit/next-typescript')
const withCSS = require('@zeit/next-css')
const withImage = require('next-images')
const path = require('path')

module.exports = withImage(
  withCSS(
    withTypescript({
      target: 'serverless',
      webpack(config, options) {
        config.resolve.alias['components'] = path.join(__dirname, 'components')
        config.resolve.alias['assets'] = path.join(__dirname, 'assets')
        return config
      },
    })
  )
)
