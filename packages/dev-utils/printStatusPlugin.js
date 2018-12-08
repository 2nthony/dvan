const logger = require('@dvan/cli-utils/logger')
const formatWebpackMessages = require('./formatWebpackMessages')

module.exports = class PrintStatusPlugin {
  apply(compiler) {
    compiler.hooks.done.tap('print-status', stats => {
      if (stats.hasErrors() || stats.hasWarnings()) {
        if (stats.hasErrors()) {
          process.exitCode = 1
        }

        const messages = formatWebpackMessages(stats.toJson())
        if (messages) {
          // Print full stats first
          logger.debug(() =>
            stats.toString({
              colors: true
            })
          )

          // These are points
          const { errors, warnings } = messages
          for (const error of errors) {
            logger.error(error)
          }
          for (const warning of warnings) {
            logger.error(warning)
          }
        }
      } else {
        logger.done(`Build completed in ${stats.endTime - stats.startTime} ms`)
      }
    })
  }
}
