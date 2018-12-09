const chalk = require('chalk')
const logger = require('@dvan/cli-utils/logger')

module.exports = (host, port) =>
  class PrintDevStatusPlugin {
    apply(compiler) {
      compiler.hooks.done.tap('print-dev-status', stats => {
        if (stats.hasErrors() || stats.hasWarnings()) return

        logger.log()
        logger.success('Running dev server with')
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
