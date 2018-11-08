exports.name = 'built-in:app'

exports.extend = api => {
  api.chainWebpack(config => {
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
        dir: api.resolve(api.config.pagesDir),
        dynamicImport: true,
        env: api.mode
      }])
  })
}
