const base = require('./base')
const path = require('path')

module.exports = ctx => {
  const config = base(ctx)

  config
    .entry('app')
    .add(path.resolve(__dirname, '../app/client-entry'))
    .end()
    .output
    .path(path.resolve(__dirname, '../app/dist'))
    .filename('[name].[hash:7].js')

  config
    .plugin('html')
    .use(require('html-webpack-plugin'), [
      {
        template: path.resolve(__dirname, '../app/index.dev.html'),
        inject: true
      }
    ])

  return config
}
