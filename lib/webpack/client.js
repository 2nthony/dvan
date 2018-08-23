const base = require('./base')
const path = require('upath')

module.exports = ctx => {
  const config = base(ctx)

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
