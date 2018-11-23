const path = require('upath')

exports.name = 'built-in:app.config'

exports.extend = api => {
  const { html, pagesDir, srcDir, match } = api.config

  api.chainWebpack(config => {
    if (api.mode === 'production') {
      config.optimization.splitChunks({
        cacheGroups: {
          vendors: {
            name: `chunk-vendors`,
            test: /[\\/]node_modules[\\/]/,
            priority: -10,
            chunks: 'initial'
          },
          common: {
            name: `chunk-common`,
            minChunks: 2,
            priority: -20,
            chunks: 'initial',
            reuseExistingChunk: true
          }
        }
      })
    }

    config.entry('app').add(path.join(__dirname, 'client.entry'))

    config.resolve.alias
      .set('@@', api.resolve())
      .set('@', api.resolve(srcDir))
      .set('@pages', api.resolve(srcDir, pagesDir))
      .set('@modules', api.resolve('node_modules'))

    config.plugin('html-plugin').use('html-webpack-plugin', [
      Object.assign(
        {
          inject: true,
          filename: 'index.html'
        },
        html,
        {
          template: html.template
            ? html.template.startsWith('.')
              ? api.resolve(html.template)
              : html.template
            : require.resolve(path.join(__dirname, 'template.html'))
        }
      )
    ])

    config.plugin('constants').tap(([options]) => [
      Object.assign({}, options, {
        // https://router.vuejs.org/api/#mode
        // keep router.mode default in client side
        __ROUTER_MODE__: JSON.stringify(undefined)
      })
    ])

    config
      .plugin('vue-auto-routes')
      .use(require('vue-auto-routes/lib/plugin'), [
        {
          pagesDir: api.resolve(srcDir, pagesDir),
          match,
          env: api.mode
        }
      ])
  })
}
