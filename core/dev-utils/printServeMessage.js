const chalk = require('chalk')
const logger = require('@dvan/logger')

module.exports = (host, port) =>
  class PrintServeMessage {
    apply(compiler) {
      compiler.hooks.done.tap('print-serve-message', stats => {
        if (stats.hasErrors() || stats.hasWarnings()) return

        logger.log()
        logger.success('Running server with')
        logger.log(
          `Local:\t\t\t${chalk.underline(`http://${host}:${chalk.bold(port)}`)}`
        )
        logger.log(
          `On your network:\t${chalk.underline(
            `http://${require('ip').address()}:${chalk.bold(port)}`
          )}`
        )
        logger.log()
      })
    }
  }
