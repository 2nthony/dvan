const path = require('upath')
const Plugin = require('./plugin')
const loadConfig = require('./utils/load-config')
const loadPlugins = require('./utils/load-plugins')

class Dvan {
  constructor (options, flags) {
    this.options = Object.assign({}, options, {
      baseDir: path.resolve(options.baseDir || '.')
    })
    this.mode = options.command === 'dev' ? 'development' : 'production'
    this.command = options.command
    this.flags = flags
    this.cli = require('cac')()

    this.config = Object.assign(
      require('./config-preset')(flags),
      loadConfig({
        matches: ['dvan.config.*'],
        dir: this.options.baseDir
      })
    )

    this.pkg = Object.assign(
      {},
      loadConfig({
        files: ['package.json'],
        dir: this.options.baseDir
      })
    )
  }

  applyPlugins () {
    let plugins = [
      require('./plugins/config-base'),
      require('./plugins/config-app'),
      require('./plugins/command-dev'),
      require('./plugins/command-build')
    ]

    plugins = plugins.concat(
      loadPlugins(this.options.baseDir, this.config.plugins)
    )
    this.plugins = plugins

    for (const plugin of plugins) {
      if (plugin.extend) {
        const rootAPI = new Plugin(this)
        plugin.extend(rootAPI)
      }
    }
  }

  start () {
    return new Promise(resolve => {
      this.applyPlugins()
      this.cli.parse([
        this.command
      ])
      if (this.flags.help) {
        this.cli.showHelp()
      }
      return resolve()
    })
  }
}

module.exports = (...args) => new Dvan(...args)
