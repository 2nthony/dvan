exports.name = 'built-in:serve'

exports.extend = api => {
  api.hook('onInitCLI', ({ command, args }) => {
    command.option('-s, --serve', 'Serve assets on local server')

    if (!args.has('s') && !args.has('serve')) return

    const cmd = require('../utils/easyCmdOption')(command)
    cmd('--host <host>', 'Serve host', '0.0.0.0')
    cmd('-p, --port <port>', 'Serve port', '4000')
    cmd('-o, --open', 'Open in browser')
    cmd('--no-hot', 'Disable hot reloading')
    cmd('--local', 'Alias for --host localhost')

    command.action(async () => {
      api.logger.debug('Starting server...')
      const { run } = await require('../utils/createDevServer')(api)
      run()
    })
  })

  api.hook('onCreateWebpackChain', config => {
    require('./shared/webpackDevConfig')(api, config)
  })
}
