const path = require('upath')

exports.extend = api => {
  const {
    html,
    pagesDir
  } = api.config

  api.chainWebpack(config => {
    config
      .entry('app')
      .add(path.resolve(__dirname, '../app/entry-client'))

    config.resolve.alias
      .set('@app', api.resolve())
      .set('@pages', api.resolve(pagesDir))

    config
      .plugin('html-plugin')
      .use('html-webpack-plugin', [
        Object.assign({
          template: path.resolve(__dirname, '../app/template.html'),
          inject: true,
          filename: 'index.html',
          title: 'Dvan App'
        }, html)
      ])

    config
      .plugin('auto-routes')
      .use('vue-auto-routes/lib/plugin', [{
        dir: api.resolve(pagesDir),
        env: api.mode
      }])
  })
}
