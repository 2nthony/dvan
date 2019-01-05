const path = require('path')
const fs = require('fs-extra')
const runCompiler = require('@dvan/dev-utils/runCompiler')

exports.name = 'built-in:command-vue-sfc'

exports.extend = api => {
  api.hook('onInitCLI', ({ args }) => {
    const command = api.cli.command('vue-sfc <file-path>', 'Vue SFC')
    command.option('--dev', 'Start develop vue file on local server')

    require('../shared/extractCssOptions')(api, command)
    require('../shared/devOptions')(command)

    command.action(async filePath => {
      api.logger.debug('Using vue-sfc action')

      if (
        !api.hasDependency('vue') ||
        !api.hasDependency('vue-template-compiler')
      ) {
        api.logger.error(
          '`vue-sfc` cannot run without `vue` and `vue-template-compiler`, please install them then try again.'
        )
        return
      }

      /**
       * Create an entry file for serve Vue SFC
       */
      const entry = {
        name: path.basename(filePath).replace(path.extname(filePath), ''),
        filePath: api.resolveCwd('node_modules/@dvan/.temp/vue-sfc/main.js')
      }
      await fs.outputFile(
        entry.filePath,
        `import Vue from 'vue'
        import dotvue from '${api.resolveCwd(filePath)}'

        new Vue({
          el: '#app',
          template: '<dotvue />',
          components: {
            dotvue
          }
        })`
      )

      /**
       * Serve Vue SFC on local server
       */
      if (args.has('dev')) {
        const { config, run } = await require('../../utils/createDevServer')(
          api
        )
        config.entry('index').add(entry.filePath)

        run()
        return
      }

      /**
       * Build Vue SFC
       */
      api.config = Object.assign(api.config, {
        entry: api.resolveCwd(filePath),
        output: {
          format: 'cjs',
          fileNames: {
            css: `${entry.name}.css`,
            js: `${entry.name}.js`
          }
        },
        html: false
      })

      /**
       * Recommend to use rollup to build library
       */
      api.logger.warn('Recommend to use `Rollup` to build Vue SFC library')

      const config = api.createWebpackConfig()
      const compiler = api.createWebpackCompiler(config.toConfig())
      await runCompiler(compiler)
    })
  })

  api.hook('onCreateWebpackConfig', config => {
    require('../shared/webpackDevConfig')(api, config)
  })
}
