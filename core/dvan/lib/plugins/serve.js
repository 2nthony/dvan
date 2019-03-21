exports.name = 'built-in:serve'

exports.extend = api => {
  api.hook('onInitCLI', ({ command }) => {
    command.option('-s, --serve', 'Serve assets on local server')

    if (!api.isServe) return

    require('./shared/serveOptions')(command)

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
