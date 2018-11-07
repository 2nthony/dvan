const chalk = require('chalk')

class Logger {
  constructor (options) {
    this.options = Object({}, options)
  }

  log () {
    console.log(...arguments)
  }

  success () {
    console.log(
      chalk.green('success'),
      ...arguments
    )
  }

  error () {
    console.error(chalk.hex('#f04')(...arguments))
  }

  tips () {
    console.log(
      chalk.cyan('tips'),
      ...arguments
    )
  }

  warning () {
    console.warn(
      chalk.yellow('warning'),
      ...arguments
    )
  }

  color (color, text) {
    return chalk[color](text)
  }
}

module.exports = new Logger()
