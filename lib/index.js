const path = require('upath')
const webpack = require('webpack')
const chalk = require('chalk')
const chokidar = require('chokidar')
const fs = require('fs-extra')
const createEngine = require('./app/create-engine')
const Config = require('./app/config')
const [ webpackbar, webpackbarConfig ] = [ require('webpackbar'), [{ name: 'client' }] ]

class Dvan {
  constructor (options) {
    this.options = options

    this.options.baseDir = path.resolve(this.options.baseDir || '.')

    this.engine = {}
    this.config = {}
  }

  chainWebpack (config) {
    if (typeof config === 'function') {
      config(this.clientConfig)
    }

    return this
  }

  resolveBaseDir (...args) {
    return path.join(this.options.baseDir, ...args)
  }

  resolveDvanDir (...args) {
    return this.resolveBaseDir('.dvan', ...args)
  }

  async prepare ({ dev }) {
    this.mode = dev ? 'development' : 'production'

    this.config = new Config(this).normalizeConfig()
    this.engine = createEngine(this)
    this.clientConfig = require('./webpack/client')(this)

    this.clientConfig.plugin('webpackbar')
      .use(webpackbar, webpackbarConfig)

    await this.engine.createEngineFiles()

    if (this.config.chainWebpack) {
      this.chainWebpack(this.config.chainWebpack)
    }
  }

  async dev () {
    await this.prepare({ dev: true })

    const { host, port, pagesDir } = this.config

    console.log(
      `${chalk.cyan('> Running server...')}\n`,
      `${chalk.green.underline(`http://localhost:${port}`)}\n`,
      `${chalk.green.underline(`http://127.0.0.1:${port}`)}`
    )
    console.log(
      `${chalk.cyan('> In your network')}\n`,
      `${chalk.green.underline(`http://${require('ip').address()}:${port}`)}\n`,
    )

    const pagesWacther = chokidar.watch([
      '**/*.vue',
      '**/*.js'
    ], {
      cwd: this.resolveBaseDir(pagesDir)
    })
    const overrideRouter = async () => {
      await this.engine.createRouter(this.resolveBaseDir(pagesDir))
    }
    pagesWacther.on('add', overrideRouter)
    pagesWacther.on('unlink', overrideRouter)
    pagesWacther.on('addDir', overrideRouter)
    pagesWacther.on('unlinkDir', overrideRouter)

    this.clientConfig
      .entry('app')
      .add(`webpack-dev-server/client?http://${host}:${port}`)
      .add('webpack/hot/dev-server')
      .add(`${this.engine.resolveEngineDir('client-entry')}`)

    this.clientConfig
      .plugin('HMR')
      .use(webpack.HotModuleReplacementPlugin)

    const WebpackDevServer = require('webpack-dev-server')
    const server = new WebpackDevServer(webpack(this.clientConfig.toConfig()), {
      noInfo: true,
      historyApiFallback: true,
      overlay: true,
      hot: true
    })

    server.listen(port, host, (err, stats) => {})
  }

  async build () {
    await this.prepare({ dev: false })
    console.log(chalk.cyan('> Running compiler...'))

    const outputPath = this.resolveBaseDir(this.config.outputDir)

    this.clientConfig
      .entry('app')
      .add(`${this.engine.resolveEngineDir('client-entry')}`)
      .end()
      .output
      .path(outputPath)

    const compiler = webpack(this.clientConfig.toConfig())

    await fs.emptyDir(outputPath)

    compiler.run((err, stats) => {
      if (stats.hasErrors()) throw new Error(stats.toString('errors-only'))
      console.log(
        `${chalk.green('Done!')} Generated files in ${chalk.cyan(
          path.relative(process.cwd(), outputPath)
        )}`
      )
    })
  }
}

module.exports = function (options) {
  return new Dvan(options)
}
