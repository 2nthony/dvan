const path = require('upath')
const webpack = require('webpack')
const chalk = require('chalk')
const createEngine = require('./app/create-engine')
const chokidar = require('chokidar')
const fs = require('fs-extra')

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

  async prepare ({ dev }) {
    console.log(`> Running ${ dev ? 'server' : 'compiler' }...`)

    await this.engine.createEngineFiles()

    this.mode = dev ? 'development' : 'production'

    this.clientConfig = require('./webpack/client')(this)
  }

  async dev () {
    await this.prepare({ dev: true })

    const pagesWacther = chokidar.watch([
      '**/*.vue'
    ], {
      cwd: this.resolveBaseDir('pages')
    })
    const overrideRoutes = async () => {
      await this.engine.createRoutes(this.resolveBaseDir('pages'))
    }
    pagesWacther.on('add', overrideRoutes)
    pagesWacther.on('unlink', overrideRoutes)
    pagesWacther.on('addDir', overrideRoutes)
    pagesWacther.on('unlinkDir', overrideRoutes)

    this.clientConfig
      .entry('app')
      .add(`webpack-dev-server/client?http://0.0.0.0:${this.options.port}`)
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

    server.listen(this.options.port, '0.0.0.0', () => {
      console.log(`
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
    await this.prepare({ dev: false })

    this.clientConfig
      .entry('app')
      .add(`${this.engine.resolveEngineDir('client-entry')}`)
      .end()
      .output
      .path(this.resolveDvanDir('dist'))
      .end()
      .plugin('webpackbar')
      .use(require('webpackbar'), [
        {
          name: 'client'
        }
      ])

    const compiler = webpack(this.clientConfig.toConfig())

    await fs.emptyDir(this.resolveDvanDir('dist'))

    compiler.run(() => {
      console.log(`
${chalk.green('Done!')} Generated files in ${chalk.cyan(path.relative(process.cwd(), this.resolveDvanDir('dist')))}
      `)
    })
  }
}

module.exports = function (options) {
  return new Dvan(options)
}
