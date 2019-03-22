exports.name = 'built-in:serve'

exports.extend = api => {
  api.hook('onInitCLI', ({ command }) => {
    command.option('-s, --serve', 'Serve assets on local server')

    if (!api.isServe) return

    command
      .option('--host <host>', 'Serve host', { default: '0.0.0.0' })
      .option('-p, --port <port>', 'Serve port', { default: '4000' })
      .option('-o, --open', 'Open in browser')
      .option('--no-hot', 'Disable hot reloading')
      .option('--local', 'Alias for --host localhost')

    command.action(async () => {
      api.logger.debug('Starting server...')

      const { devServer } = api.config
      delete devServer.hotEntries

      const config = api.createWebpackChain()

      const { host: _host, port: _port, open } = devServer

      const isUnSepecifiedHost = _host === '0.0.0.0' || _host === '::'
      const host = isUnSepecifiedHost ? 'localhost' : _host
      const port = await require('get-port')({ port: _port, host })

      config
        .plugin('print-serve-message')
        .use(require('@dvan/dev-utils/printServeMessage')({ host, port }))

      if (open) {
        config
          .plugin('open-browser')
          .use(require('@dvan/dev-utils/openBrowserPlugin')({ host, port }))
      }

      const webpackConfig = config.toConfig()
      const compiler = api.createWebpackCompiler(webpackConfig)

      const devServerOpts = Object.assign(
        {
          quiet: true,
          historyApiFallback: true,
          overlay: true,
          disableHostCheck: true,
          publicPath: webpackConfig.output.publicPath,
          contentBase:
            api.config.publicFolder && api.resolveCwd(api.config.publicFolder),
          watchContentBase: true,
          stats: {
            colors: true
          }
        },
        devServer
      )

      const server = new (require('webpack-dev-server'))(
        compiler,
        devServerOpts
      )

      server.listen(port, host)
    })
  })

  api.hook('onCreateWebpackChain', config => {
    if (!api.isServe) return

    const { hotEntries = ['index'], hot } = api.config.devServer

    config.output.filename('[name].js')

    if (hot) {
      for (const entry of hotEntries) {
        if (config.entryPoints.has(entry)) {
          config.entry(entry).prepend('#webpack-hot-client')
        }
      }

      config.plugin('hot').use(require('webpack').HotModuleReplacementPlugin)
    }
  })
}
