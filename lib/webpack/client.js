const base = require('./base')
const path = require('upath')

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
    .use(require('vue-server-renderer/client-plugin'), [
      {
        filename: 'manifest/client.json'
      }
    ])

  return config
}
