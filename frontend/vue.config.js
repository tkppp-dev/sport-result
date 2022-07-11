const path = require('path')

module.exports = {
  outputDir: '../node-backend/src/public',
  devServer: {
    port: 4000,
    proxy: {
      '/api/*': {
        target: 'http://localhost:8080/'
      }
    }
  },
}