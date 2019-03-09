const path = require('path')
const runCompiler = require('@dvan/dev-utils/runCompiler')

exports.name = '@dvan/vue-static'

exports.extend = api => {
  api.hook('onInitCLI', () => {
    // TODO
    // Override default command action to build client manifest and server bundle
    api.defaultCommand.action(async () => {
      const clientConfig = api.createWebpackConfig().toConfig()
      const serverConfig = api
        .createWebpackConfig({ type: 'server' })
        .toConfig()

      const clientCompiler = api.createWebpackCompiler(clientConfig)
      const serverCompiler = api.createWebpackCompiler(serverConfig)

      await Promise.all([
        runCompiler(clientCompiler),
        runCompiler(serverCompiler)
      ])
    })

    api.cli
      .command('vue-gen', 'Generate to static HTML files')
      .action(entry => {
        api.logger.done('Done right', entry)
      })
  })

  api.hook('onCreateWebpackConfig', (config, { type }) => {
    config.plugins.delete('html')

    const __CLIENT_MANIFEST__ = 'ssr/clientManifest.json'
    const __SERVER_BUNDLE__ = 'ssr/serverBundle.json'

    if (type === 'client') {
      config.plugin('vue-ssr').use('vue-server-renderer/client-plugin', [
        {
          filename: __CLIENT_MANIFEST__
        }
      ])
    }

    if (type === 'server') {
      config.target('node')
      config.entryPoints.clear()
      config.entry('server').add(path.join(__dirname, '../app/entryServer'))
      config.output.libraryTarget('commonjs2')
      config.optimization.minimize(false)

      config.plugin('vue-ssr').use('vue-server-renderer/server-plugin', [
        {
          filename: __SERVER_BUNDLE__
        }
      ])
    }
  })
}