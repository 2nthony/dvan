const ProgressBar = require('progress')
const chalk = require('chalk')

module.exports = (config, type) => {
  config.plugin('progress').use(require('webpack').ProgressPlugin, [
    (percent, msg, modules, active) => {
      const bar = new ProgressBar(
        chalk.hex('#2a7')(
          `>>> Compiling ${chalk.bold(type)} ${Math.floor(
            percent * 100
          )}% ${modules || ''} ${active || ''}`
        ),
        {
          total: 100
        }
      )

      bar.update(percent)
    }
  ])
}
