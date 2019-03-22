module.exports = (config, api) => {
  const path = require('path')

  config.plugin('progress').use(require('webpack').ProgressPlugin, [
    (per, message, ...args) => {
      const spinner = require('../../utils/spinner')

      const msg = `${(per * 100).toFixed(2)}% ${message} ${args
        .map(arg => {
          const message = path.relative(api.cwd, arg)
          return message.length > 40
            ? `...${message.substr(message.length - 39)}`
            : message
        })
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
