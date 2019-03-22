const chalk = require('chalk')
const logger = require('@dvan/logger')
const prettyBytes = require('./prettyBytes')

module.exports = ({ host, port }) =>
  class PrintServeMessage {
    apply(compiler) {
      compiler.hooks.done.tap('print-serve-message', stats => {
        if (stats.hasErrors() || stats.hasWarnings()) return

        const { heapUsed } = process.memoryUsage()
        const ip = require('ip').address()

        logger.log()
        logger.success('Running server with')
        logger.log(`Local:             ${`http://${host}:${chalk.bold(port)}`}`)
        logger.log(`On Your Network:   ${`http://${ip}:${chalk.bold(port)}`}`)
        logger.log()
        logger.log(chalk.dim(`> ${prettyBytes(heapUsed)} memory used`))
        logger.log()
      })
    }
  }
