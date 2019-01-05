module.exports = (api, config) => {
  if (!api.cli.options.dev) return

  config.devtool('cheap-source-map')

  const { hotEntries = ['index'], hot } = api.config.devServer || {}

  config.output.filename('[name].js')

  if (hot) {
    for (const entry of hotEntries) {
      if (config.entryPoints.has(entry)) {
        config
          .entry(entry)
          .prepend(require.resolve('@dvan/dev-utils/webpackHotDevClient'))
      }
    }

    config.plugin('hot').use(require('webpack').HotModuleReplacementPlugin)
  }
}
