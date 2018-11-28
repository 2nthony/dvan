const fs = require('fs-extra')
const setSharedCLIOptions = require('@dvan/cli-utils/sharedOptions')

exports.name = 'built-in:build.command'

exports.extend = api => {
  const command = api.registerCommand(
    'build [dir]?',
    'Build App as an SPA.',
    async () => {
      if (!api.flags.clean) {
        await fs.emptyDir(api.resolve(api.config.outDir))
      }

      await api.compiler(api.resolveWebpackConfig())
    }
  )

  setSharedCLIOptions(command)
  command
    .option('--clean', 'Clean output directory before compile.', {
      default: true
    })
    .option('--nossr', 'Do not generate ssr file.', {
      default: false
    })
}
