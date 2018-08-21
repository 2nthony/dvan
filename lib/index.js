const path = require('upath')
const webpack = require('webpack')
const chalk = require('chalk')

class Dvan {
  constructor (options) {
    this.options = Object.assign(
      {
        port: 8080
      },
      options
    )

    this.options.baseDir = path.resolve(this.options.baseDir || '.')
  }

  compiler ({ dev }) {
    console.log('> Running server...')

    this.mode = dev ? 'development' : 'production'

    this.clientConfig = require('./webpack/client')(this)
  }

  async dev () {
    await this.compiler({ dev: true })

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
`
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
