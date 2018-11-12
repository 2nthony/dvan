const path = require('upath')

exports.name = 'built-in:app.config'

exports.extend = api => {
  const { html, pagesDir } = api.config

  api.chainWebpack(config => {
    config
      .entry('app')
      .add(path.join(__dirname, 'client.entry'))

    config.resolve.alias
      .set('@app', api.resolve())
      .set('@pages', api.resolve(pagesDir))
      .set('@modules', api.resolve('node_modules'))

    config
      .plugin('html-plugin')
      .use('html-webpack-plugin', [
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

    config
      .plugin('constants')
      .tap(([options]) => [
        Object.assign({}, options, {
          // https://router.vuejs.org/api/#mode
          // keep router.mode default in client side
          __ROUTER_MODE__: JSON.stringify(undefined)
        })
      ])

    config
      .plugin('vue-auto-routes')
      .use('vue-auto-routes/lib/plugin', [{
        pagesDir: api.resolve(api.config.pagesDir),
        match: api.config.match,
        env: api.mode
      }])
  })
}
