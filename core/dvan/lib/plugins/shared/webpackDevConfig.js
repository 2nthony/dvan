module.exports = (api, config) => {
  if (!api.cli.options.serve) return

  const { hotEntries = ['index'], hot } = api.config.devServer || {}

  config.output.filename('[name].js')

  if (hot) {
    for (const entry of hotEntries) {
      if (config.entryPoints.has(entry)) {
        config.entry(entry).prepend('#webpack-hot-client')
      }
    }

    config.plugin('hot').use(require('webpack').HotModuleReplacementPlugin)
  }
}
