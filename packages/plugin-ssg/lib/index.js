const path = require('upath')
const fs = require('fs-extra')
const setSharedCLIOptions = require('@dvan/cli-utils/sharedOptions')

exports.name = 'dvan:static-site-generate'

exports.extend = api => {
  const __clientManifest__ = '__ssr/client.manifest.json'
  const __serverBundle__ = '__ssr/server.bundle.json'

  const command = api.registerCommand(
    'generate [dir]?',
    'Build App and prerender to static HTML files.',
    async () => {
      if (api.flags.clean) {
        await fs.emptyDir(api.resolve(api.config.outDir))
      }

      // RoutesMap for render static HTML files
      const {
        collectRoutes,
        renderRoutesMap
      } = require('vue-auto-routes/lib/collect-fs-routes')

      const routes = await collectRoutes({
        pagesDir: api.resolve(api.config.srcDir, 'pages'),
        match: api.config.match
      })

      const routesMap = JSON.parse(renderRoutesMap(routes)).filter(
        route => route !== '/404'
      )

      // Check is need to build client manifest
      if (await fs.exists(api.resolve(api.config.outDir, __clientManifest__))) {
        api.logger.warning(
          `SSR: 'client.manifest.json' is exists, skip compiling client.`
        )
      } else {
        await api.compiler(api.resolveWebpackConfig())
      }

      // Check is need to build server bundle
      if (await fs.exists(api.resolve(api.config.outDir, __serverBundle__))) {
        api.logger.warning(
          `SSR: 'server.bundle.json' is exists, skip compiling server.`
        )
      } else {
        await api.compiler(api.resolveWebpackConfig({ type: 'server' }))
      }

      await require('./renderHTML')(api, {
        routesMap,
        __clientManifest__,
        __serverBundle__
      })
    }
  )

  setSharedCLIOptions(command)
  command.option('--clean', 'Clean output directory before compile.', {
    default: false
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
              filename: __serverBundle__
            }
          ])

        config.externals([
          require('webpack-node-externals')({
            whitelist: /\.css$/
          })
        ])
      }
    })
  }

  if (
    api.command === 'generate' ||
    (api.command === 'build' && !api.flags.nossr)
  ) {
    api.chainWebpack((config, { type }) => {
      if (type === 'client') {
        config
          .plugin('vue-ssr')
          .use(require('vue-server-renderer/client-plugin'), [
            {
              filename: __clientManifest__
            }
          ])
      }
    })
  }
}
