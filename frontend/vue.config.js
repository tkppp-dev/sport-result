const path = require('path')

module.exports = {
  outputDir: path.resolve(__dirname, '../node-backend/src/public'),
  devServer: {
    port: 3001,
    proxy: {
      '/api/*': {
        target: 'http://localhost:8080/'
      }
    }
  },
}