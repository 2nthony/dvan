const fs = require('fs-extra')
const path = require('path')
const chalk = require('chalk')

class PWAPlugin {
  constructor (lib) {
    this.lib = lib

    const pwa = lib.config.pwa
    this.pwaEnabled = Boolean(pwa)
    this.pwaOptions = Object.assign(
      {
        updateText: 'New content is available.',
        updateButtonText: 'Refresh'
      },
      typeof pwa === 'object' ? pwa : {}
    )
  }

  apply () {
    if (!this.pwaEnabled) return

    this.lib.chainWebpack(config => {
      config
        .plugin('constants').tap(([options]) => [
          Object.assign(options, {
            __PWA_ENABLED__: JSON.stringify(this.pwaEnabled),
            __PWA_OPTIONS__: JSON.stringify(this.pwaOptions)
          })
        ])
    })
  }

  async generateSW () {
    if (!this.pwaEnabled) return

    const { generateSW } = require('workbox-build')
    await generateSW({
      swDest: this.lib.resolveDistDir('sw.js'),
      importWorkboxFrom: 'local',
      globDirectory: this.lib.resolveDistDir(),
      globPatterns: [
        '**/*.{js,css,html,png,jpg,jpeg,gif,svg,woff,woff2,eot,ttf,otf}'
      ]
    })

    await fs.appendFile(
      this.lib.resolveDistDir('sw.js'),
      await fs.readFile(path.resolve(__dirname, 'skip-waiting.js'), 'utf8')
    )

    console.log(
      chalk.cyan(`--------------------- PWA ---------------------\n`) +
      `> Generated file ${
        path.relative(process.cwd(), this.lib.resolveDistDir('sw.js'))
      }`
    )
  }
}

module.exports = function (lib) {
  const _pwa = new PWAPlugin(lib)
  _pwa.apply()
  return _pwa
}
