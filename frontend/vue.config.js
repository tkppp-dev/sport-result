const path = require('path')

module.exports = {
  outputDir: path.resolve(__dirname, '../backend/src/main/resources/static'),
  devServer: {
    port: 3001,
    proxy: {
      '/api/*': {
        target: 'http://localhost:8080/'
      }
    }
  },
}