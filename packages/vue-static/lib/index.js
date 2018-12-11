exports.name = '@dvan/vue-static'

exports.extend = api => {
  api.hook('onInitCLI', () => {
    // TODO
    // Override default command action to build client manifest and server bundle
    /* api.defaultCommand.action(async () => {
      const runCompiler = require('@dvan/dev-utils/runCompiler')

      const clientConfig = api.createWebpackConfig().toConfig()
      const serverConfig = api.createWebpackConfig({ type: 'server' }).toConfig()

      const clientCompiler = api.createWebpackCompiler(clientConfig)
      const serverCompiler = api.createWebpackCompiler(serverConfig)

      await Promise.all([
        runCompiler(clientCompiler),
        runCompiler(serverCompiler)
      ])
    }) */

    api.cli
      .command('vue-gen', 'Generate to static HTML files')
      .action(entry => {
        api.logger.done('Done right', entry)
      })
  })

  api.hook(
    'onCreateWebpackConfig',
    /**
     * @param {import('webpack-chain')} config
     */
    (config, { type }) => {
      config.plugins.delete('html')

      const clientManifestFilename = '__ssr/client.manifest.json'
      const serverBundleFilename = '__ssr/server.bundle.json'

      if (type === 'client') {
        config.plugin('vue-ssr').use('vue-server-renderer/client-plugin', [
          {
            filename: clientManifestFilename
          }
        ])
      }

      if (type === 'server') {
        config.target('node')

        config.entryPoints.clear()

        config.output.libraryTarget('commonjs2')

        config.optimization.minimize(false)

        config.plugin('vue-ssr').use('vue-server-renderer/server-plugin', [
          {
            filename: serverBundleFilename
          }
        ])
      }
    }
  )
}
