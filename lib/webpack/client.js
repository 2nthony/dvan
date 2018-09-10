const base = require('./base')

module.exports = ctx => {
  const config = base(ctx, 'client')

  config
    .entry('app')
    .add(`${ctx.engine.resolveEngineDir('client-entry')}`)

  config
    .output
    .path(ctx.resolveDvanDir())

  config
    .plugin('vue-ssr')
    .use(require('vue-server-renderer/client-plugin'), [{
      filename: 'manifest/client.json'
    }])
    .end()
    .plugin('webpackbar')
    .use(require('webpackbar'), [{
      name: 'Client',
      color: '#2a7'
    }])

  return config
}
