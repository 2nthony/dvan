const fs = require('fs-extra')

exports.extend = api => {
  const command = api.registerCommand(
    'build',
    'Build app',
    async () => {
      if (api.flags.help) return

      await build()
    }
  )
  command.option('clean', 'Clean output directory before build app')

  function build () {
    if (api.flags.clean) {
      fs.emptyDirSync(api.resolve(api.config.outDir))
    }
    return api.compiler(api.resolveWebpackConfig())
  }

  if (api.command === 'build') {
    api.chainWebpack(config => {
      config.output
        .path(api.resolve(api.config.outDir))
        .publicPath(api.config.publicPath)
    })
  }
}
