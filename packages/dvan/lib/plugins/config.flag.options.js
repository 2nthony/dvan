exports.name = 'built-in:config.flag.options'

exports.extend = api => {
  api.hook('onInitCLI', ({ command }) => {
    const cmd = require('../utils/easyCmdOption')(command)
    cmd('-s, --src-dir <dir>', 'Source directory', 'src')
    cmd('-d, --out-dir <dir>', 'Output directory', '__dist')
    cmd('--public-path <path>', 'Public path', '/')
    cmd('--constants', 'Global constants')
    cmd('--evergreen', 'Only targeting evergreen browsers', false)

    if (api.isProd) {
      cmd('--no-minimize', 'Disable minimization')
      cmd('--no-source-map', 'Disable source map')
    } else {
      cmd('--minimize', 'Minimize output')
      cmd('--source-map', 'Enable source map')
    }
  })
}
