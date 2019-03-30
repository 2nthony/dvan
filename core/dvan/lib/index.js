const path = require('path')
const merge = require('lodash.merge')
const resolveFrom = require('resolve-from')
const cac = require('cac')
const logger = require('@dvan/logger')
const runCompiler = require('@dvan/dev-utils/runCompiler')
const Hooks = require('./Hooks')
const loadConfig = require('./utils/loadConfig')
const loadPlugins = require('./utils/loadPlugins')
const parseArgs = require('./utils/parseArgs')
const validateConfig = require('./utils/validateConfig')

module.exports = class DvanCore {
  constructor(rawArgs = process.argv) {
    this.hooks = new Hooks()
    this.rawArgs = rawArgs
    this.args = parseArgs(rawArgs)
    this.logger = logger

    if (this.args.has('debug')) {
      logger.setOptions({ debug: true })
    }

    this.mode =
      this.args.has('prod') || this.args.has('production')
        ? 'production'
        : this.args.get('mode') || 'development'

    logger.debug(`Running in ${this.mode} mode`)

    this.cwd = this.args.get('cwd')
    if (!this.cwd) {
      this.cwd = process.cwd()
    }

    this.pkg = loadConfig({
      files: ['package.json'],
      dir: this.cwd
    })

    this.config = {}
    if (this.args.has('no-config')) {
      logger.debug('Config file was disabled')
    } else {
      const config = loadConfig(
        {
          files: ['package.json'],
          matches: ['dvan.config.*', '.dvanrc*'],
          dir: this.cwd,
          packageKey: 'dvan'
        },
        this
      )
      const { configPath } = config
      if (configPath) {
        logger.debug(
          `Using config: '${require('./utils/colorfulFile')(
            path.basename(configPath)
          )}'`
        )
      } else {
        logger.debug('Not using any config file')
      }

      this.config = Object.assign(
        config,
        this.args.has('config')
          ? require(this.resolveCwd(this.args.get('config')))
          : {}
      )
    }

    /**
     * Set process.env
     */
    if (!process.env.NODE_ENV) {
      process.env.NODE_ENV = this.mode
    }
    process.env.DVAN_APP = this.hasDependency('vue') ? 'vue' : 'react'

    // init plugins
    this.initPlugins()

    // init CLI instance, call plugin.cli parse CLI args
    this.initCLI()

    // merge CLI config with config file
    this.mergeConfig()

    // call plugin.apply
    this.applyPlugins()
  }

  get isProd() {
    return this.mode === 'production'
  }

  get isServe() {
    return this.args.has('s') || this.args.has('serve')
  }

  resolveCwd(...args) {
    return path.resolve(this.cwd, ...args)
  }

  resolveSrc(...args) {
    return this.resolveCwd(this.config.srcDir, ...args)
  }

  resolveOutDir(...args) {
    return this.resolveCwd(this.config.output.dir, ...args)
  }

  initCLI() {
    const cli = (this.cli = cac())

    this.command = cli
      .command('[...entries]', 'Entry files for App', {
        ignoreOptionDefaultValue: true
      })
      .usage('[...entries] [options]')
      .action(async () => {
        logger.debug('Using default action')
        const chain = this.createWebpackChain()
        const compiler = this.createWebpackCompiler(chain.toConfig())
        await runCompiler(compiler)
      })

    this.extendCLI()

    /**
     * Global cli options
     */
    cli
      .option('--mode <mode>', 'Set mode', { default: 'development' })
      .option('--prod, --production', 'Alias for --mode production')
      .option('--debug', 'Show debug logs')
      .option('--config [path]', 'Specify config file')
      .option('--no-config', 'Disable config file')
      .option('--no-clean', 'Do not clean output directory before bundling')
      .option('--no-clear-console', 'Do not clear console')
      .version(require('../package.json').version)
      .help()

    this.cli.parse(this.rawArgs, { run: false })

    logger.debug('Command args', this.cli.args)
    logger.debug('Command options', this.cli.options)
  }

  initConfigFromCLIOptions() {
    const {
      srcDir,
      publicUrl,
      publicFolder,
      html,
      sourceMap,
      minimize,
      constants,
      host,
      hot,
      port,
      open,
      extractCss,
      jsx,
      local
    } = this.cli.options

    return {
      entry: this.cli.args.length > 0 ? this.cli.args : undefined,
      srcDir,
      output: {
        publicUrl,
        sourceMap,
        minimize,
        html
      },
      publicFolder,
      constants,
      devServer: {
        host: local ? 'localhost' : host,
        hot,
        port,
        open
      },
      extractCss,
      jsx
    }
  }

  hasDependency(name) {
    return [
      ...Object.keys(this.pkg.dependencies || {}),
      ...Object.keys(this.pkg.devDependencies || {})
    ].includes(name)
  }

  createWebpackChain(opts) {
    this.createWebpackOptions = opts
    const { configureWebpack } = this.config

    const WebpackChain = require('webpack-chain')

    opts = Object.assign({ type: 'client' }, opts)

    const config = new WebpackChain()

    require('./webpack/webpack.config')(config, this)

    this.hooks.invoke('createWebpackChain', config, opts)

    if (this.config.chainWebpack) {
      this.config.chainWebpack(config, opts)
    }

    if (typeof configureWebpack === 'function') {
      this.hook('resolveWebpackConfig', configureWebpack)
    } else if (typeof configureWebpack === 'object') {
      config.merge(configureWebpack)
    }

    return config
  }

  createWebpackCompiler(config) {
    this.hooks.invoke('resolveWebpackConfig', config, this.createWebpackOptions)
    return require('webpack')(config)
  }

  initPlugins() {
    this.plugins = [
      require('./plugins/config/commandOptions'),
      require('./plugins/serve'),

      /**
       * Cli commands
       */
      require('./plugins/command/ejectHtml'),

      /**
       * Webpack config
       */
      require('./plugins/config/html'),
      require('./plugins/config/babel'),
      require('./plugins/config/css'),
      require('./plugins/config/vue'),
      require('./plugins/config/font'),
      require('./plugins/config/image'),
      require('./plugins/config/video'),
      require('./plugins/config/misc-loaders')
    ]
  }

  extendCLI() {
    for (const plugin of this.plugins) {
      if (plugin.cli) {
        plugin.cli(this)
      }
    }
  }

  applyPlugins() {
    let plugins = this.plugins.filter(plugin => {
      return !plugin.when || plugin.when(this)
    })

    if ((this.config.plugins || []).length > 0) {
      plugins = this.plugins.concat(loadPlugins(this, this.config.plugins))
    }

    for (const plugin of plugins) {
      if (plugin.apply) {
        logger.debug(`Apply plugin: '${plugin.name}'`)

        plugin.apply(this)
      }
    }
  }

  mergeConfig() {
    const cliConfig = this.initConfigFromCLIOptions()
    logger.debug('Config from command options', cliConfig)

    this.config = validateConfig(this, merge({}, this.config, cliConfig))
  }

  hook(name, fn) {
    return this.hooks.add(name, fn)
  }

  async run() {
    await this.cli.runMatchedCommand()
  }

  localResolve(name, cwd = this.cwd) {
    return resolveFrom.silent(cwd, name)
  }

  localRequire(name, cwd) {
    const resolved = this.localResolve(name, cwd)
    return resolved ? require(resolved) : null
  }
}
