const path = require('path')
const fs = require('fs-extra')
const runCompiler = require('@dvan/dev-utils/runCompiler')

exports.name = 'built-in:command-vue-sfc'

exports.extend = api => {
  api.hook('onInitCLI', ({ args }) => {
    const command = api.cli.command('vue-sfc <file-path>', 'Vue SFC')
    command
      .option('--dev', 'Start develop vue file on local server')
      .option('--out-dir [path]', 'Output directory')

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
          components: {
            dotvue
          },
          render(h) {
            return h('dotvue')
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
        outDir: command.cli.options.outDir || 'dist',
        output: {
          format: 'cjs',
          fileNames: {
            css: `${entry.name}.css`,
            js: `${entry.name}.js`
          }
        },
        html: false,
        extractCss: true
      })

      /**
       * Recommend to use rollup to build library
       */
      api.logger.tips(
        'You are using `Webpack` to build Vue SFC library, DONNOT use use production mode'
      )
      api.logger.tips('RECOMMEND to use `Rollup` to build Vue SFC library')

      const config = api.createWebpackConfig()
      /**
       * Do not use babel to build standalone Vue SFC
       * Because it just a SFC to run under the based Vue
       * TODO: JSX
       */
      config.module.rules.delete('babel')
      const compiler = api.createWebpackCompiler(config.toConfig())
      await runCompiler(compiler)
    })
  })

  api.hook('onCreateWebpackConfig', config => {
    require('../shared/webpackDevConfig')(api, config)
  })
}
