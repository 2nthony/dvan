const path = require('upath')
const webpack = require('webpack')
const chalk = require('chalk')
const chokidar = require('chokidar')
const fs = require('fs-extra')
const createEngine = require('./app/create-engine')
const Config = require('./app/config')
const webpackbar = require('webpackbar')

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
      config(this.serverConfig)
    }

    return this
  }

  resolveBaseDir (...args) {
    return path.join(this.options.baseDir, ...args)
  }

  resolveDvanDir (...args) {
    return this.resolveBaseDir('.dvan', ...args)
  }

  resolveDistDir (...args) {
    return this.resolveDvanDir('dist', ...args)
  }

  async prepare ({ dev }) {
    this.mode = dev ? 'development' : 'production'

    this.config = new Config(this).normalizeConfig()
    this.engine = createEngine(this)

    this.clientConfig = require('./webpack/client')(this)
    this.clientConfig.plugin('webpackbar')
      .use(webpackbar, [
        {
          name: 'Client',
          color: '#2a7'
        }
      ])

    if (!dev) {
      this.serverConfig = require('./webpack/server.js')(this)
      this.serverConfig.plugin('webpackbar')
        .use(webpackbar, [
          {
            name: 'Server',
            color: '#58a'
          }
        ])
    }

    await this.engine.createEngineFiles()

    if (this.config.chainWebpack) {
      this.chainWebpack(this.config.chainWebpack)
    }

    if (!dev) {
      await fs.emptyDir(this.resolveDistDir())
    }
  }

  async compile (config) {
    return new Promise((resolve, reject) => {
      webpack(config, (err, stats) => {
        if (err) return reject(err)
        if (stats.hasErrors()) {
          stats.toJson().errors.forEach(err => {
            console.error(chalk.red(err))
          })
          return reject(new Error('Failed to compile with error.'))
        }
        resolve(stats.toJson({ modules: false }))
      })
    })
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
      .entryPoints
      .get('app')
      .add(`webpack-dev-server/client?http://${host}:${port}`)
      .add('webpack/hot/dev-server')

    this.clientConfig
      .plugin('html')
      .use(require('html-webpack-plugin'), [
        {
          template: path.resolve(__dirname, './app/index.dev.html'),
          inject: true
        }
      ])

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

    server.listen(port, host)
  }

  async build () {
    await this.prepare({ dev: false })

    console.log(chalk.cyan('> Running compiler...'))

    const routes = this.engine.routes

    const { createBundleRenderer } = require('vue-server-renderer')

    await this.compile([
      this.clientConfig.toConfig(),
      this.serverConfig.toConfig()
    ])

    const serverBundle = require(
      this.resolveDvanDir(
        'manifest/server.json'
      )
    )

    const clientManifest = require(
      this.resolveDvanDir(
        'manifest/client.json'
      )
    )

    const renderer = createBundleRenderer(serverBundle, {
      clientManifest,
      template: await fs.readFile(
        path.join(__dirname, './app/index.ssr.html'),
        'utf8'
      ),
      runInNewContext: false,
      inject: false
    })

    function handleRoute (route) {
      if (route.endsWith('/')) {
        route += 'index'
      }
      return route + '.html'
    }

    function renderHead (head) {
      if (!head || !head.length > 0) return ''
      return head.map(h => {
        let res = `<${h[0]}`
        Object.keys(h[1]).forEach(key => {
          res += ` ${key}="${h[1][key]}"`
        })
        return h[2]
          ? `${res}>${h[2]}</${h[0]}>`
          : res + '>'
      }).join('')
    }

    const filePath = filename => this.resolveDistDir(filename)
    routes.map(async route => {
      route = this.engine.routePath(route)
      const { title, description, head } = this.config
      const context = {
        url: route,
        title,
        description,
        renderHead: () => renderHead(head)
      }

      let html
      try {
        html = await renderer.renderToString(context)
      } catch (e) {
        console.log(chalk.red(`Error rendering ${route}:`))
        throw e
      }

      await fs.outputFile(
        filePath(handleRoute(route)),
        html,
        'utf8'
      )
      await console.log(
        `> Generated file ${
          path.relative(process.cwd(), filePath(handleRoute(route))
        )}`
      )
    })

    // Move assets
    await fs.move(
      this.resolveDvanDir('assets'),
      this.resolveDistDir('assets')
    )

    // Remove manifest
    await fs.remove(this.resolveDvanDir('manifest'))

    console.log(
      chalk.green(`> Done! Check out`),
      chalk.cyan(path.relative(process.cwd(), this.resolveDistDir()))
    )
  }
}

module.exports = function (options) {
  return new Dvan(options)
}
