const webpack = require('webpack')
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

    return new Promise((resolve, reject) => {
      webpack(api.resolveWebpackConfig(), (err, stats) => {
        if (err) return reject(err)
        if (stats.hasErrors()) {
          stats.toJson().errors.forEach(err => {
            console.error(err)
          })
          return reject(new Error('Failed to build with error.'))
        }
        resolve(stats.toJson())
      })
    })
  }

  if (api.command === 'build') {
    api.chainWebpack(config => {
      config.output
        .path(api.resolve(api.config.outDir))
        .publicPath(api.config.publicPath)
    })
  }
}
