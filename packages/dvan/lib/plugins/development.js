exports.name = 'built-in:development'

exports.extend = api => {
  api.hook('onInitCLI', ({ command, args }) => {
    command.option('--dev', 'Start develop mode on local server')

    if (!args.has('dev')) return

    const cmd = require('../utils/easyCmdOption')(command)
    cmd('--host', 'Development server host', '0.0.0.0')
    cmd('--port', 'Development server port', 4000)
    cmd('--hot', 'Hot reload', true)
    cmd('-o, --open', 'Open in browser')

    command.action(async () => {
      api.logger.debug('Using development action')

      const { devServer } = api.config
      delete devServer.hotEntries

      const { host: _host, port: _port, open } = devServer

      const port = await require('get-port')({ port: _port })

      const config = api.createWebpackConfig()

      const isUnSpecifiedHost = _host === '0.0.0.0' || _host === '::'
      const host = isUnSpecifiedHost ? 'localhost' : _host

      config
        .plugin('print-dev-status')
        .use(require('@dvan/dev-utils/printDevStatusPlugin')(host, port))

      if (open) {
        config
          .plugin('open-browser')
          .use(require('@dvan/dev-utils/openBrowserPlugin')(host, port))
      }

      const compiler = api.createWebpackCompiler(config.toConfig())

      const devServerOptions = Object.assign(
        {
          quiet: true,
          historyApiFallback: true,
          overlay: true,
          stats: {
            colors: true
          }
        },
        devServer
      )

      const server = new (require('webpack-dev-server'))(
        compiler,
        devServerOptions
      )
      server.listen(port, host)
    })
  })

  api.hook(
    'onCreateWebpackConfig',
    /**
     * @param {import('webpack-chain')} config
     */
    config => {
      if (!api.cli.options.dev) return

      config.devtool('cheap-source-map')

      const { hotEntries = ['index'] } = api.config.devServer || {}
      const { hot } = api.config.devServer

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
  )
}
