const path = require('path')
const runCompiler = require('@dvan/dev-utils/runCompiler')

exports.name = '@dvan/vue-static'

exports.apply = api => {
  api.hook('onInitCLI', () => {
    // TODO
    // Override default command action to build client manifest and server bundle
    api.defaultCommand.action(async () => {
      const clientConfig = api.createWebpackChain().toConfig()
      const serverConfig = api.createWebpackChain({ type: 'server' }).toConfig()

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

  api.hook('createWebpackChain', (config, { type }) => {
    config.plugins.delete('html')

    const CLIENT_MANIFEST = 'ssr/clientManifest.json'
    const SERVER_BUNDLE = 'ssr/serverBundle.json'

    if (type === 'client') {
      config.plugin('vue-ssr').use('vue-server-renderer/client-plugin', [
        {
          filename: CLIENT_MANIFEST
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
          filename: SERVER_BUNDLE
        }
      ])
    }
  })
}
