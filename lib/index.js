const webpack = require('webpack')

class Dvan {
  constructor (options) {
    this.options = Object.assign(
      {
        port: 8080
      },
      options
    )
  }

  compiler ({ dev }) {
    console.log('> Compiling...')

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
Running dev server in:
  http://localhost:${this.options.port}
  http://127.0.0.1:${this.options.port}
In your network:
  http://${require('ip').address()}:${this.options.port}
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
