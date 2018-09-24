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
      title: '',
      description: '',
      head: [],
      host: this.lib.options.host || '0.0.0.0',
      port: this.lib.options.port || 8080,
      pagesDir: 'pages',
      exts: ['vue'],
      pwa: false,
      root: '/',

      // Build Pipeline
        // postcss, stylus, sass, scss, less default options is in `webpack/base.js`
      chainWebpack: undefined

    }, this.config)
  }
}

module.exports = Config
