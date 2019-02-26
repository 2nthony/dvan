const path = require('path')
const VueAutoRoutesPlugin = require('vue-auto-routes/plugin')

module.exports = {
  entry: 'src/index.js',
  chainWebpack(config) {
    config.plugin('auto-routes').use(VueAutoRoutesPlugin, [
      {
        pagesDir: path.resolve(__dirname, 'src/pages')
      }
    ])
  }
}
