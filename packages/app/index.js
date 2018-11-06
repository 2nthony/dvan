exports.name = 'built-in:app'

exports.extend = api => {
  api.chainWebpack(config => {
    config
      .plugin('vue-auto-routes')
      .use('vue-auto-routes/lib/plugin', [{
        dir: api.resolve(api.config.pagesDir),
        dynamicImport: true,
        env: api.mode
      }])
  })
}
