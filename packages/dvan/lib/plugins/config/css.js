exports.name = 'built-in:config-css'

exports.extend = api => {
  api.hook('onInitCLI', ({ command }) => {
    const cmd = require('../../utils/easyCmdOption')(command)
    if (api.isProd) {
      cmd('--no-extract-css', 'Do not extract CSS files')
    } else {
      cmd('--extract-css', 'Extract CSS to standalone files')
    }
  })

  api.hook(
    'onCreateWebpackConfig',
    /**
     * @param {import('webpack-chain')} config
     */
    (config, { type }) => {
      const {
        loaderOptions,
        extractCss: shouldExtract,
        sourceMap,
        minimize
      } = api.config
      const shouldMinimize = Boolean(minimize)
      const isServer = type === 'server'

      const hasPostcssConfig = require('../../utils/loadConfig')({
        files: ['package.json'],
        matches: ['.postcssrc*', 'postcss.config.*'],
        dir: api.cwd,
        packageKey: 'postcss'
      })

      if (hasPostcssConfig.configPath) {
        api.logger.debug(
          'Applying postcss config at',
          require('../../utils/colorfulFile')(
            require('path').relative(api.cwd, hasPostcssConfig.configPath)
          )
        )
      }

      const extractOptions = {
        filename: api.config.output.fileNames.css,
        chunkFilename: api.config.output.fileNames.css.replace(
          /\.css$/,
          '.chunk.css'
        )
      }

      const cssnanoOptions = {
        safe: true,
        autoprefixer: { disable: true },
        mergeLonghand: false
      }

      if (sourceMap) {
        cssnanoOptions.map = { inline: false }
      }

      const createCSSRule = (lang, test, loader, options) => {
        const applyLoader = (rule, modules = false) => {
          if (!isServer) {
            if (shouldExtract) {
              rule
                .use('extract-css-loader')
                .loader(require('mini-css-extract-plugin').loader)
            } else {
              rule
                .use('vue-style-loader')
                .loader('vue-style-loader')
                .options({ sourceMap })
            }
          }

          rule
            .use('css-loader')
            .loader(isServer ? 'css-loader/locals' : 'css-loader')
            .options(
              Object.assign(
                {
                  modules,
                  sourceMap,
                  importLoaders: 1 + (hasPostcssConfig ? 1 : 0),
                  localIdentName: api.isProd
                    ? '[local]_[hash:base64:6]'
                    : '[path][name]__[local]--[hash:base64:6]'
                },
                loaderOptions.css
              )
            )

          if (loader) {
            rule
              .use(loader)
              .loader(loader)
              .options(
                Object.assign(
                  { sourceMap },
                  options,
                  loaderOptions[loader.replace('-loader', '')]
                )
              )
          }
        }

        const baseRule = config.module.rule(lang).test(test)

        const vueModuleRule = baseRule
          .oneOf('vue-modules')
          .resourceQuery(/module/)
        applyLoader(vueModuleRule, true)

        const vueNormalRule = baseRule
          .oneOf('vue-normal')
          .resourceQuery(/\?vue/)
        applyLoader(vueNormalRule)

        const moduleRule = baseRule
          .oneOf('normal-modules')
          .test(/\.module\.\w+$/)
        applyLoader(moduleRule, true)

        const normalRule = baseRule.oneOf('normal')
        applyLoader(normalRule)
      }

      if (shouldExtract) {
        config
          .plugin('extract-css')
          .use('mini-css-extract-plugin', [extractOptions])

        if (shouldMinimize) {
          config
            .plugin('optimize-css')
            .use(require('@intervolga/optimize-cssnano-plugin'), [
              {
                sourceMap,
                cssnanoOptions
              }
            ])
        }
      }

      createCSSRule('css', /\.css$/)
      createCSSRule('postcss', /\.p(ost)?css$/)
      createCSSRule('stylus', /\.styl(us)?$/, 'stylus-loader', {
        preferPathResolve: 'webpack'
      })
      createCSSRule('less', /\.less$/, 'less-loader')
      createCSSRule('sass', /\.sass$/, 'sass-loader', {
        indentedSyntax: true
      })
      createCSSRule('scss', /\.scss$/, 'sass-loader')
    }
  )
}
