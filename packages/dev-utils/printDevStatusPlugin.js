const kleur = require('kleur')
const logger = require('@dvan/cli-utils/logger')

module.exports = (host, port) =>
  class PrintDevStatusPlugin {
    apply(compiler) {
      compiler.hooks.done.tap('print-dev-status', stats => {
        if (stats.hasErrors() || stats.hasWarnings()) return

        logger.log()
        logger.success('Running dev server with')
        logger.log(
          `Local:\t\t\t${kleur.underline(`http://${host}:${kleur.bold(port)}`)}`
        )
        logger.log(
          `On your network:\t${kleur.underline(
            `http://${require('ip').address()}:${kleur.bold(port)}`
          )}`
        )
        logger.log()
      })
    }
  }
