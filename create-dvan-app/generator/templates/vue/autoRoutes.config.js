const path = require('path')

module.exports = {
  entry: 'src/main.js',
  chainWebpack(config) {
    config.plugin('auto-routes').use(
      require('vue-auto-routes/plugin'), [
        {
          dir: path.resolve(__dirname, 'src/views')
        }
      ]
    )
  }
}
