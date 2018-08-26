const path = require('upath')
const Config = require('webpack-chain')
const { VueLoaderPlugin } = require('vue-loader')

module.exports = ctx => {
  const config = new Config()
  const isDev = ctx.mode === 'development'
  const publicPath = isDev ? '/' : ctx.config.root

  config.merge({
    mode: ctx.mode
  })

  config.devtool(isDev ? 'cheap-source-map' : false)

  config.output
    .filename(
      !isDev
        ? '_dvan/assets/js/[name].[chunkhash:6].js'
        : '_dvan/assets/js/[name].js'
    )
    .publicPath(publicPath)

  config.resolve.alias
    .set('vue$', 'vue/dist/vue.esm.js')
    .set('@app', path.join(ctx.resolveBaseDir()))
    .set('@pages', path.join(ctx.resolveBaseDir(ctx.config.pagesDir)))

  config.resolve.extensions
    .add('.vue')
    .add('.js')
    .add('.json')

  /**
   * Modules
   */
  config.module
    .rule('js')
    .test(/\.js$/)
    .exclude.add(file => (
      /node_modules/.test(file) && !/\.vue\.js/.test(file)
    ))
    .end()
    .use('babel-loader')
    .loader('babel-loader')
    .options({
      babelrc: false,
      presets: [
        require.resolve('@babel/preset-env')
      ],
      plugins: [
        require.resolve('@babel/plugin-syntax-dynamic-import')
      ]
    })

  /**
   * CSS Pre-Processors
   */
  function cssRule (lang, test, loader, options = {}) {
    const baseRule = config.module.rule(lang).test(test)

    // From dev-server HMR inline param: &lang
    const langRule = baseRule.oneOf('lang').resourceQuery(/lang/)

    function addRule (rule) {
      const sourceMap = isDev
      rule.use('vue-style-loader').loader('vue-style-loader')

      rule
        .use('css-loader')
        .loader('css-loader')
        .options({
          sourceMap,
          importLoaders: 1,
          minimize: !isDev
        })

      rule
        .use('postcss-loader')
        .loader('postcss-loader')
        .options(
          ctx.config.postcss || {
            plugins: [require('autoprefixer')]
          }
        )

      if (loader) {
        rule
          .use(loader)
          .loader(loader)
          .options(
            Object.assign({ sourceMap },
              ctx.config[lang] || options
            )
          )
      }
    }

    addRule(langRule)
  }
  cssRule('css', /\.css$/)
  cssRule('stylus', /\.styl(us)?$/, 'stylus-loader', {
    preferPathResolve: 'webpack'
  })
  cssRule('sass', /\.sass$/, 'sass-loader', {
    indentedSyntax: true
  })
  cssRule('scss', /\.scss$/, 'sass-loader')
  cssRule('less', /\.less$/, 'less-loader')

  config.module
    .rule('vue')
    .test(/\.vue$/)
    .use('vue-loader')
    .loader('vue-loader')

  /**
   * Plugins
   */
  config.plugin('vue-loader').use(VueLoaderPlugin)

  config
    .plugin('constants')
    .use(require('webpack').DefinePlugin, [
      {
        'process.env.NODE_ENV': JSON.stringify(ctx.mode),
        __PUBLIC_PATH__: JSON.stringify(publicPath)
      }
    ])

  return config
}
