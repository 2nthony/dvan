module.exports = (config, api) => {
  config
    .plugin('constants')
    .use(require('webpack').DefinePlugin, [
      Object.assign(
        {
          'process.env.NODE_ENV': JSON.stringify(api.mode),
          __PUBLIC_PATH__: JSON.stringify(api.config.publicPath)
        },
        api.config.constants
      )
    ])
}
