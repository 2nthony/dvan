const webpack = require('webpack')
const path = require('upath')
const logger = require('@dvan/cli-utils/logger')

module.exports = class Plugin {
  constructor(d, name) {
    this.root = d
    this.name = name
    this.logger = logger
    this.options = d.options
    this.command = d.command
    this.flags = d.flags
    this.mode = d.mode
    this.hooks = d.hooks
    this.config = d.config
    this.pkg = d.pkg
    this.commands = new Map()
  }

  chainWebpack(fn) {
    this.hooks.add('chainWebpack', fn)
    return this
  }

  registerCommand(command, desc, handler) {
    if (this.commands.has(command)) {
      logger.warning(
        `Plugin "${
          this.name
        }" overrided the "${command}" that was previously added by "${this.commands.get(
          command
        )}"`
      )
    }
    this.commands.set(command, this.name)

    return this.root.cli.command(command, desc, handler)
  }

  resolve(...args) {
    return path.join(this.options.baseDir, ...args)
  }

  resolveWebpackConfig(opts) {
    const WebpackChain = require('webpack-chain')
    const config = new WebpackChain()

    opts = Object.assign({ type: 'client' }, opts)

    this.hooks.invoke('chainWebpack', config, opts)

    if (this.config.chainWebpack) {
      this.config.chainWebpack(config, opts)
    }

    return config.toConfig()
  }

  compiler(config) {
    return new Promise((resolve, reject) => {
      webpack(config, (err, stats) => {
        if (err) return reject(err)
        if (stats.hasErrors()) {
          stats.toJson().errors.forEach(err => {
            logger.error(err)
          })
          return reject(new Error('Failed to build with error.'))
        }
        resolve(stats.toJson())
      })
    })
  }
}
