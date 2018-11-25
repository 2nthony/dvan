const path = require('upath')
const logger = require('@dvan/cli-utils/logger')
const Plugin = require('./plugin')
const Hooks = require('./hooks')
const loadConfig = require('./utils/loadConfig')
const loadPlugins = require('./utils/loadPlugins')

class Dvan {
  constructor(options, flags) {
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

    this.pkg = Object.assign(
      {},
      loadConfig({
        files: ['package.json'],
        dir: this.options.baseDir
      })
    )
  }

  applyPlugins() {
    let plugins = [
      require('./plugins/base.config'),
      require('./plugins/dev.command'),
      require('./plugins/build.command'),
      require('@dvan/app')
    ]

    if (this.config.plugins.length > 0) {
      plugins = plugins.concat(
        loadPlugins(this.options.baseDir, this.config.plugins)
      )
    }

    this.plugins = plugins

    for (const plugin of plugins) {
      if (plugin.extend) {
        logger.tips(`Using plugin: '${plugin.name}'`)

        const pluginAPI = new Plugin(this, plugin.name)
        plugin.extend(pluginAPI)
      }
    }
  }

  start() {
    return new Promise(resolve => {
      logger.tips(
        `Using config: '${
          this.config.path
            ? `user:${colorful(path.relative(process.cwd(), this.config.path))}`
            : `built-in:${colorful('preset.config.js')}`
        }'`
      )

      this.applyPlugins()

      this.cli.parse([this.command])
      if (this.flags.help) {
        this.cli.showHelp()
      }
      return resolve()
    })
  }
}

module.exports = (...args) => new Dvan(...args)

function colorful(fp) {
  if (/\.js$/.test(fp)) {
    return logger.color('yellow', fp)
  }
  if (/\.toml$/.test(fp)) {
    return logger.color('cyan', fp)
  }
  if (/\.ya?ml$/.test(fp)) {
    return logger.color('red', fp)
  }
}
