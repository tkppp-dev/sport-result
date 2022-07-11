const path = require('path')

module.exports = {
  publicPath: '/sport-result/',
  outputDir: '../docs',
  devServer: {
    port: 4000,
    proxy: {
      '/api/*': {
        target: 'http://localhost:8080/'
      }
    }
  },
}