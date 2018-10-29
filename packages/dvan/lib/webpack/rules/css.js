const path = require('upath')

module.exports = (config, api) => {
  const { loaderOptions, extract } = api.config.css
  const { sourceMap } = api.config
  const shouldExtractCSS =
    extract === 'auto' || extract === undefined
      ? api.mode === 'production'
      : extract

  const createCSSRule = (lang, test, loader, options) => {
    const applyLoader = (rule, modules = false) => {
      if (shouldExtractCSS) {
        rule
          .use('css-extract-loader')
          .loader(require('mini-css-extract-plugin').loader)
      } else {
        rule.use('vue-style-loader').loader('vue-style-loader').options({ sourceMap })
      }

      rule
        .use('css-loader')
        .loader('css-loader')
        .options(Object.assign(
          {
            modules,
            sourceMap,
            importLoaders: 1,
            localIdentName: '[local]_[hash:base64:6]'
          },
          loaderOptions.css
        ))

      rule
        .use('postcss-loader')
        .loader('postcss-loader')
        .options(Object.assign(
          {
            plugins: [
              require('autoprefixer')({
                browsers: ['ie>9', '>1%']
              })
            ]
          },
          loaderOptions.postcss
        ))

      if (loader) {
        rule
          .use(loader)
          .loader(loader)
          .options(Object.assign(
            {},
            options,
            loaderOptions[loader.replace('-loader', '')]
          ))
      }
    }

    const baseRule = config.module.rule(lang).test(test)

    // this matches `<style module>`
    const moduleRule = baseRule.oneOf('module').resourceQuery(/module/)
    applyLoader(moduleRule, true)

    const normalRule = baseRule.oneOf('normal')
    applyLoader(normalRule)
  }

  createCSSRule('css', /\.css$/)
  createCSSRule('postcss', /\.p(ost)?css$/)
  createCSSRule('stylus', /\.styl(us)?$/, 'stylus-loader', {
    perferPathResolve: 'webpack'
  })
  createCSSRule('less', /\.less$/, 'less-loader')
  createCSSRule('sass', /\.sass$/, 'sass-loader', {
    indentedSyntax: true
  })
  createCSSRule('scss', /\.scss$/, 'sass-loader')

  if (shouldExtractCSS) {
    config
      .plugin('css-extract')
      .use('mini-css-extract-plugin', [{
        filename: path.join('assets', 'css', 'styles.[chunkhash:6].css')
      }])
  }
}
