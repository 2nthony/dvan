module.exports = (config, api) => {
  config.plugin('constants').use(require('webpack').DefinePlugin, [
    Object.assign(
      {
        __PUBLIC_PATH__: JSON.stringify(api.config.publicPath),
        __DVAN_APP__: JSON.stringify(process.env.DVAN_APP),
        __IS_VUE__: JSON.stringify(process.env.DVAN_APP === 'vue')
      },
      api.config.constants
    )
  ])
}
