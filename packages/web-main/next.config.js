const withTypescript = require('@zeit/next-typescript')
const withCSS = require('@zeit/next-css')
const path = require('path')

module.exports = withCSS(
  withTypescript({
    target: 'serverless',
    webpack(config, options) {
      config.resolve.alias['components'] = path.join(__dirname, 'components')

      return config
    },
  })
)
