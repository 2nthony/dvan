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
    console.error(chalk.red(...arguments))
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
}

module.exports = new Logger()
