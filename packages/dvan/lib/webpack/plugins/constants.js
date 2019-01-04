module.exports = (config, api) => {
  config.plugin('constants').use(require('webpack').DefinePlugin, [
    Object.assign(
      {
        __PUBLIC_PATH__: JSON.stringify(api.config.publicPath),
        __DVAN_APP__: JSON.stringify(process.env.DVAN_APP)
      },
      api.config.constants
    )
  ])
}
