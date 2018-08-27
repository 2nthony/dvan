const fs = require('fs-extra')
const path = require('upath')

class Config {
  constructor (lib) {
    this.lib = lib

    this.configPath = path.resolve(lib.resolveBaseDir('dvan.config.js'))

    this.config =
      fs.existsSync(this.configPath)
        ? require(this.configPath)
        : {}
  }

  normalizeConfig () {
    return Object.assign({}, {

      // Basic Config
      head: {},
      outputDir: '.dvan/dist',
      assetsDir: 'assets',
      host: this.lib.options.host || '0.0.0.0',
      port: this.lib.options.port || 8080,
      pagesDir: 'pages',
      root: '/',

      // Build Pipeline
        // postcss, stylus, sass, scss, less default options is in `webpack/base.js`
      chainWebpack: undefined

    }, this.config)
  }

  $head () {
    return JSON.stringify(this.normalizeConfig().head)
  }
}

module.exports = Config
