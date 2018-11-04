exports.name = 'built-in:dev.command'

exports.extend = api => {
  const webpack = require('webpack')

  const command = api.registerCommand(
    'dev',
    'Develop mode',
    async () => {
      if (api.flags.help) return

      const { host, port } = api.config.devServer
      const actualPort = await require('get-port')({ host, port })
      const WebpackDevServer = require('webpack-dev-server')
      const server = new WebpackDevServer(
        webpack(api.resolveWebpackConfig()),
        Object.assign(
          {
            noInfo: true,
            historyApiFallback: true,
            overlay: true,
            hot: true
          },
          api.config.devServer
        )
      )

      server.listen(actualPort, host)
    }
  )
  command.option('host', 'default: 0.0.0.0')
  command.option('port', 'default: 4000')

  if (api.command === 'dev') {
    api.chainWebpack(config => {
      config.output.filename('[name].js')

      config.entryPoints
        .get('app')
        .add('webpack-dev-server/client?/')
        .add('webpack/hot/dev-server')

      config.plugin('hmr').use(webpack.HotModuleReplacementPlugin)
    })
  }
}
