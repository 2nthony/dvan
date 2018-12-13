exports.name = 'built-in:eject.html.command'

exports.extend = api => {
  api.hook('onInitCLI', () => {
    api.cli
      .command('eject-html [file-path]', 'Eject default template HTML file')
      .option('--override', 'Override existing file')
      .action(async (filePath = 'public/template.html', { override } = {}) => {
        const fs = require('fs-extra')
        const path = require('path')
        if (!override && (await fs.pathExists(api.resolveCwd(filePath)))) {
          api.logger.error(
            `${filePath} already existing, try \`--override\` flag to override file if you want`
          )
          return
        }
        await fs.copy(
          path.resolve(__dirname, '../webpack/default.template.html'),
          api.resolveCwd(filePath)
        )
        api.logger.done(`Ejected to ${filePath}`)
      })
  })
}
