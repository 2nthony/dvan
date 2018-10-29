const WebpackChain = require('webpack-chain')
const webpackChainConfig = new WebpackChain()
const path = require('upath')

module.exports = class Plugin {
  constructor (d) {
    this.root = d
    this.options = d.options
    this.command = d.command
    this.flags = d.flags
    this.mode = d.mode
    this.config = d.config
    this.pkg = d.pkg
    this.chainConfig = webpackChainConfig
  }

  chainWebpack (fn) {
    fn(this.chainConfig)
    return this
  }

  resolve (...args) {
    return path.join(this.options.baseDir, ...args)
  }

  resolveDvan (...args) {
    return this.resolve('.dvan', ...args)
  }

  resolveWebpackConfig () {
    return this.chainConfig.toConfig()
  }

  registerCommand (command, desc, handler) {
    return this.root.cli.command(command, desc, handler)
  }
}
