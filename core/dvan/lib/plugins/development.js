exports.name = 'built-in:development'

exports.extend = api => {
  api.hook('onInitCLI', ({ command, args }) => {
    command.option('--dev', 'Start develop mode on local server')

    if (!args.has('dev')) return

    require('./shared/devOptions')(command)

    command.action(async () => {
      api.logger.debug('Using development action')

      const { run } = await require('../utils/createDevServer')(api)

      run()
    })
  })

  api.hook('onCreateWebpackChain', config => {
    require('./shared/webpackDevConfig')(api, config)
  })
}
