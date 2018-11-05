const path = require('upath')
const fs = require('fs-extra')

exports.name = 'static-site-generate'

exports.extend = api => {
  api.registerCommand(
    'generate',
    'Generate static HTML files.',
    async () => {
      await fs.emptyDir(api.resolve(api.config.outDir))

      const clientConfig = api.resolveWebpackConfig()
      const serverConfig = api.resolveWebpackConfig({ type: 'server' })

      await Promise.all([
        api.compiler(clientConfig),
        api.compiler(serverConfig)
      ])

      const paths =
        (
          fs.readFileSync(require.resolve('vue-auto-routes'), 'utf8')
            .match(/path:\s+(\S+)/gi) ||
          []
        )
          .map(route => route.match(/'(\S+)'/)[1])

      await require('./renderHTML')(api, paths)
    }
  )

  if (api.command === 'generate') {
    api.chainWebpack((config, { type }) => {
      config.entryPoints.delete('app')
      config.plugins.delete('html-plugin')

      config
        .plugin('constants')
        .tap(([options]) => [
          Object.assign({}, options, {
            'process.server': JSON.stringify(type === 'server'),
            'process.client': JSON.stringify(type === 'client'),
            '__GLOBAL_META__': JSON.stringify(api.config.html)
          })
        ])
      if (type === 'server') {
        config.target('node')

        config
          .entry('server')
          .add(path.join(__dirname, '../app/server.entry'))

        config.output.libraryTarget('commonjs2')

        config.optimization.minimize(false)

        config
          .plugin('vue-ssr')
          .use(require('vue-server-renderer/server-plugin'), [
            {
              filename: 'ssr/server.bundle.json'
            }
          ])

        config
          .externals([
            require('webpack-node-externals')({
              whitelist: /\.css$/
            })
          ])

        config
          .plugin('webpackbar')
          .tap(([options]) => [
            Object.assign(options, {
              name: 'server',
              color: '#58a'
            })
          ])
      } else if (type === 'client') {
        config
          .entry('client')
          .add(path.join(__dirname, '../app/client.entry'))

        config
          .plugin('vue-ssr')
          .use(require('vue-server-renderer/client-plugin'), [
            {
              filename: 'ssr/client.manifest.json'
            }
          ])
      }
    })
  }
}
