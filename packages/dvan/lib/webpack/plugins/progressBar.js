module.exports = (config, api) => {
  const path = require('upath')

  config.plugin('progress').use(require('webpack').ProgressPlugin, [
    (per, message, ...args) => {
      const spinner = require('@dvan/cli-utils/spinner')

      const msg = `${Math.floor(per * 100)}% ${message} ${args
        .map(arg => path.relative(api.cwd, arg))
        .join(' ')}`

      if (per === 0) {
        spinner.start(msg)
      } else if (per === 1) {
        spinner.stop()
      } else {
        spinner.text = msg
      }
    }
  ])
}
