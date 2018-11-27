const fs = require('fs-extra')
const setSharedCLIOptions = require('@dvan/cli-utils/sharedOptions')

exports.name = 'built-in:build.command'

exports.extend = api => {
  const command = api.registerCommand('build', 'Build app', async () => {
    if (api.flags.help) return
    if (!api.flags.clean) {
      fs.emptyDirSync(api.resolve(api.config.outDir))
    }

    await api.compiler(api.resolveWebpackConfig())
  })

  setSharedCLIOptions(command)
  command
    .option('spa', 'Only build spa(Client-side). (default: false)')
    .option('clean', 'Clean output directory before compile. (default: true)')
}
