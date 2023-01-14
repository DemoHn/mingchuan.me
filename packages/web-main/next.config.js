const withSass = require('@zeit/next-sass')
const withImage = require('next-images')
const path = require('path')
const webpack = require('webpack')

const localEnv = {
  API_ROOT: 'http://localhost:4000',
}

const config = withImage({  
    webpack (config, options) {
      config.resolve.alias['components'] = path.join(__dirname, 'components')
      config.resolve.alias['assets'] = path.join(__dirname, 'assets')
      config.resolve.alias['services'] = path.join(__dirname, 'services')
      config.resolve.alias['utils'] = path.join(__dirname, 'utils')

      config.plugins.push(new webpack.EnvironmentPlugin(localEnv))
      return config
    },
  })

module.exports = config