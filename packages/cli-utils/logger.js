const chalk = require('chalk')

class Logger {
  constructor(options) {
    this.options = Object.assign({}, options)
  }

  log(...args) {
    console.log(...args)
  }

  success(...args) {
    console.log(
      chalk.green('success'),
      ...args
    )
  }

  error(...args) {
    console.error(chalk.hex('#f04')(...args))
  }

  tips(...args) {
    console.log(
      chalk.cyan('tips'),
      ...args
    )
  }

  warning(...args) {
    console.warn(
      chalk.yellow('warning'),
      ...args
    )
  }

  color(color, text) {
    return chalk[color](text)
  }
}

module.exports = new Logger()
