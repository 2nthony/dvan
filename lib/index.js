const path = require('upath')
const webpack = require('webpack')
const chalk = require('chalk')
const createEngine = require('./app/create-engine')
const chokidar = require('chokidar')

class Dvan {
  constructor (options) {
    this.options = Object.assign(
      {
        port: 8080
      },
      options
    )

    this.options.baseDir = path.resolve(this.options.baseDir || '.')

    this.engine = createEngine(this)
  }

  resolveBaseDir (...args) {
    return path.join(this.options.baseDir, ...args)
  }

  resolveDvanDir (...args) {
    return this.resolveBaseDir('.dvan', ...args)
  }

  async compiler ({ dev }) {
    console.log('> Running server...')

    await this.engine.createEnhanceApp()

    this.mode = dev ? 'development' : 'production'

    this.clientConfig = require('./webpack/client')(this)
  }

  async dev () {
    await this.compiler({ dev: true })

    const pagesWacther = chokidar.watch([
      '**/*.vue'
    ], {
      cwd: this.resolveBaseDir('pages')
    })
    const overrideRoutes = async () => {
      await this.engine.createRoutes(this.resolveBaseDir('pages'))
    }
    pagesWacther.on('ready', overrideRoutes)
    pagesWacther.on('add', overrideRoutes)
    pagesWacther.on('unlink', overrideRoutes)
    pagesWacther.on('addDir', overrideRoutes)
    pagesWacther.on('unlinkDir', overrideRoutes)

    this.clientConfig.entryPoints
      .get('app')
      .add(`webpack-dev-server/client?http://0.0.0.0:${this.options.port}`)
      .add('webpack/hot/dev-server')

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

    server.listen(this.options.port, '0.0.0.0', () => {
      console.log(
        `
${chalk.cyan('Running dev server in:')}
  ${chalk.green.underline(
    `http://localhost:${this.options.port}`
  )}
  ${chalk.green.underline(
    `http://127.0.0.1:${this.options.port}`
  )}
${chalk.cyan('In your network:')}
  ${chalk.green.underline(
    `http://${require('ip').address()}:${this.options.port}`
  )}

${chalk.yellow('Waitting for webpack compiled...')}`
      )
    })
  }

  async build () {
    // await this.compiler({ dev: false })

    console.log('Build command coming soon!')
  }
}

module.exports = function (options) {
  return new Dvan(options)
}
