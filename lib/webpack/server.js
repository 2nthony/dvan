const base = require('./base.js')

module.exports = ctx => {
  const config = base(ctx, 'server')

  config.target('node')

  // No need to minimize server build
  config.optimization.minimize(false)

  config
    .entry('app')
    .add(`${ctx.engine.resolveEngineDir('server-entry')}`)

  config
    .output
    .path(ctx.resolveDvanDir())
    .libraryTarget('commonjs2')

  config
    .plugin('vue-ssr')
    .use(require('vue-server-renderer/server-plugin'), [{
      filename: 'manifest/server.json'
    }])
    .end()
    .plugin('webpackbar')
    .use(require('webpackbar'), [{
      name: 'Server',
      color: '#58a'
    }])

  return config
}
