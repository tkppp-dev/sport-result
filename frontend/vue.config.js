const path = require('path')

module.exports = {
  devServer: {
    port: 4000,
    proxy: {
      '/api/*': {
        target: 'http://localhost:8080/'
      }
    }
  },
}