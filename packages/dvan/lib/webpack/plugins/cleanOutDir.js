const { emptyDir } = require('fs-extra')

module.exports = (config, api) => {
  config.plugin('clean-out-dir').use(
    class CleanOutDir {
      apply(compiler) {
        compiler.hooks.beforeRun.tapPromise('clean-out-dir', async () => {
          if (api.resolveOutDir() === api.cwd) {
            api.logger.error('Refused to clean current working directory')
            return
          }

          await emptyDir(api.resolveOutDir())
        })
      }
    }
  )
}
