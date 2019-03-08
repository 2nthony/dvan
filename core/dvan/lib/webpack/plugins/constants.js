module.exports = (config, api) => {
  config.plugin('constants').use(require('webpack').DefinePlugin, [
    Object.assign(
      {
        PUBLIC_PATH: JSON.stringify(api.config.output.publicUrl),
        DVAN_APP: JSON.stringify(process.env.DVAN_APP),
        IS_VUE: JSON.stringify(process.env.DVAN_APP === 'vue')
      },
      api.config.constants
    )
  ])
}
