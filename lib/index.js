const path = require('upath')
const webpack = require('webpack')
const chalk = require('chalk')
const chokidar = require('chokidar')
const fs = require('fs-extra')
const createEngine = require('./app/create-engine')
const Config = require('./app/config')

class Dvan {
  constructor (options) {
    this.options = options

    this.options.baseDir = path.resolve(this.options.baseDir || '.')

    this.engine = {}
    this.config = {}
  }

  chainWebpack (config) {
    // if (typeof config === 'object') {}
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
    console.log(`> Running ${dev ? 'server' : 'compiler'}...`)

    this.mode = dev ? 'development' : 'production'

    this.config = new Config(this).normalizeConfig()
    this.engine = createEngine(this)
    this.clientConfig = require('./webpack/client')(this)

    await this.engine.createEngineFiles()

    if (this.config.chainWebpack) {
      this.chainWebpack(this.config.chainWebpack)
    }
  }

  async dev () {
    await this.prepare({ dev: true })

    const { host, port } = this.config

    const pagesWacther = chokidar.watch([
      '**/*.vue',
      '**/*.js'
    ], {
      cwd: this.resolveBaseDir('pages')
    })
    const overrideRouter = async () => {
      await this.engine.createRouter(this.resolveBaseDir('pages'))
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
      stats: 'minimal',
      historyApiFallback: true,
      overlay: true,
      hot: true
    })

    server.listen(port, host, () => {
      console.log(`
${chalk.cyan('Running dev server in:')}
  ${chalk.green.underline(
    `http://localhost:${port}`
  )}
  ${chalk.green.underline(
    `http://127.0.0.1:${port}`
  )}
${chalk.cyan('In your network:')}
  ${chalk.green.underline(
    `http://${require('ip').address()}:${port}`
  )}

${chalk.yellow('Waitting for webpack compiled...')}`
      )
    })
  }

  async build () {
    await this.prepare({ dev: false })

    const outputPath = this.resolveBaseDir(this.config.dest)

    this.clientConfig
      .entry('app')
      .add(`${this.engine.resolveEngineDir('client-entry')}`)
      .end()
      .output
      .path(outputPath)
      .end()
      .plugin('webpackbar')
      .use(require('webpackbar'), [
        {
          name: 'client'
        }
      ])

    const compiler = webpack(this.clientConfig.toConfig())

    await fs.emptyDir(outputPath)

    compiler.run((err, stats) => {
      if (err) throw new Error(stats.toString('errors-only'))
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
