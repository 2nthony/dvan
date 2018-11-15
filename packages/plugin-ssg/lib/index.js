const path = require('upath')
const fs = require('fs-extra')

exports.name = 'dvan:static-site-generate'

exports.extend = api => {
  api.registerCommand('generate', 'Generate static HTML files.', async () => {
    await fs.emptyDir(api.resolve(api.config.outDir))

    const clientConfig = api.resolveWebpackConfig()
    const serverConfig = api.resolveWebpackConfig({ type: 'server' })

    await api.compiler(clientConfig)
    await api.compiler(serverConfig)

    const routesMap = require('vue-auto-routes').routesMap.filter(
      route => route !== '/404'
    )

    await require('./renderHTML')(api, { routesMap })
  })

  if (api.command === 'generate') {
    api.chainWebpack((config, { type }) => {
      config.plugins.delete('html-plugin')

      config.plugin('constants').tap(([options]) => [
        Object.assign({}, options, {
          'process.server': JSON.stringify(type === 'server'),
          'process.client': JSON.stringify(type === 'client'),
          __ROUTER_MODE__: JSON.stringify('history'),
          __GLOBAL_META__: JSON.stringify(api.config.html)
        })
      ])
      if (type === 'server') {
        config.entryPoints.delete('app')

        config.target('node')

        config.entry('server').add(path.join(__dirname, '../app/server.entry'))

        config.output.libraryTarget('commonjs2')

        config.optimization.minimize(false)

        config
          .plugin('vue-ssr')
          .use(require('vue-server-renderer/server-plugin'), [
            {
              filename: 'ssr/server.bundle.json'
            }
          ])

        config.plugin('vue-auto-routes').tap(([options]) => [
          Object.assign({}, options, {
            routesMap: true
          })
        ])

        config.externals([
          require('webpack-node-externals')({
            whitelist: /\.css$/
          })
        ])
      } else if (type === 'client') {
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
