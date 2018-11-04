const path = require('upath')
const Plugin = require('./plugin')
const Hooks = require('./hooks')
const loadConfig = require('./utils/loadConfig')
const loadPlugins = require('./utils/loadPlugins')

class Dvan {
  constructor (options, flags) {
    this.options = Object.assign({}, options, {
      baseDir: path.resolve(options.baseDir || '.')
    })
    this.mode = options.command === 'dev' ? 'development' : 'production'
    this.command = options.command
    this.flags = flags
    this.hooks = new Hooks()
    this.cli = require('cac')()

    this.config = Object.assign(
      require('./preset.config')(flags),
      loadConfig({
        matches: ['dvan.config.*'],
        dir: this.options.baseDir
      })
    )

    this.pkg = Object.assign({},
      loadConfig({
        files: ['package.json'],
        dir: this.options.baseDir
      })
    )
  }

  applyPlugins () {
    let plugins = [
      require('./plugins/base.config'),
      require('./plugins/app.config'),
      require('./plugins/dev.command'),
      require('./plugins/build.command')
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