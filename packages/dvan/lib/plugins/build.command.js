const fs = require('fs-extra')

exports.name = 'built-in:build.command'

exports.extend = api => {
  const command = api.registerCommand('build', 'Build app', async () => {
    if (api.flags.help) return
    if (api.flags.clean) {
      fs.emptyDirSync(api.resolve(api.config.outDir))
    }

    await api.build(api.resolveWebpackConfig())
  })
  command.option('clean', 'Clean output directory before build app')

  if (api.command === 'build') {
    api.chainWebpack(config => {
      config.output.path(api.resolve(api.config.outDir))
    })
  }
}
