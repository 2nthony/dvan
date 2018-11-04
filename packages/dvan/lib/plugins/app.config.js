exports.name = 'built-in:app.config'

exports.extend = api => {
  const {
    html,
    pagesDir
  } = api.config

  api.chainWebpack(config => {
    config
      .entry('app')
      .add('@dvan/app/client.entry')

    config.resolve.alias
      .set('@app', api.resolve())
      .set('@pages', api.resolve(pagesDir))

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
              : require.resolve('@dvan/app/template.html')
          }
        )
      ])

    config
      .plugin('auto-routes')
      .use('vue-auto-routes/lib/plugin', [{
        dir: api.resolve(pagesDir),
        dynamicImport: true,
        env: api.mode
      }])
  })
}
