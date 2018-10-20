const path = require('upath')
const Config = require('webpack-chain')
const { VueLoaderPlugin } = require('vue-loader')

module.exports = (ctx, type) => {
  const config = new Config()
  const isDev = ctx.mode === 'development'
  const isServer = type === 'server'

  config.mode(ctx.mode)

  config.devtool(isDev ? 'cheap-source-map' : false)

  config.output
    .filename(
      !isDev
        ? path.join('assets', 'js', '[name].[chunkhash:6].js')
        : '[name].js'
    )
    .publicPath(ctx.publicPath)

  config.resolve.alias
    .set('vue$', 'vue/dist/vue.esm.js')
    .set('@app', path.join(ctx.resolveBaseDir()))
    .set('@pages', path.join(ctx.resolveBaseDir(ctx.config.pagesDir)))

  config.resolve.extensions
    .add('.vue').add('.js').add('.json')

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
   * Resolve media files
   */
  function createMediaRule (type, test) {
    if (type) {
      config.module
        .rule(type)
        .test(test)
        .use('file-loader')
        .loader('file-loader')
        .options({
          name: path.join('assets', type, '[name].[hash:6].[ext]')
        })
    }
  }

  createMediaRule('images', /\.(png|jp?eg|gif)(\?.*)?$/)
  createMediaRule('fonts', /\.(woff2?|eot|ttf|otf)(\?.*)?$/)
  createMediaRule('medias', /\.(mp4|webm|ogg|mp3|wav|flac|aac)?$/)

  // do not base64-inline SVGs.
  // https://github.com/facebookincubator/create-react-app/pull/1180
  createMediaRule('svg', /\.(svg)(\?.*)?$/)

  /**
   * CSS Pre-Processors
   */
  function createCSSRule (lang, test, loader, options = {}) {
    const baseRule = config.module.rule(lang).test(test)

    // From dev-server HMR inline param: &lang
    const langRule = baseRule.oneOf('modules').resourceQuery(/lang/)
    const normalRule = baseRule.oneOf('normal')

    applyLoader(langRule)
    applyLoader(normalRule)

    function applyLoader (rule) {
      const sourceMap = isDev

      if (!isServer) {
        if (!isDev) {
          rule
            .use('css-extract-loader')
            .loader(require('mini-css-extract-plugin').loader)
        } else {
          rule.use('vue-style-loader').loader('vue-style-loader')
        }
      }

      rule
        .use('css-loader')
        .loader(isServer ? 'css-loader/locals' : 'css-loader')
        .options({
          sourceMap,
          importLoaders: 1,
          minimize: !isDev
        })

      rule
        .use('postcss-loader')
        .loader('postcss-loader')
        .options(
          Object.assign({ sourceMap },
            ctx.config.postcss || {
              plugins: [require('autoprefixer')({
                browsers: ['ie>9', '>1%']
              })]
            }
          )
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
  }
  createCSSRule('css', /\.css$/)
  createCSSRule('stylus', /\.styl(us)?$/, 'stylus-loader', {
    preferPathResolve: 'webpack'
  })
  createCSSRule('sass', /\.sass$/, 'sass-loader', {
    indentedSyntax: true
  })
  createCSSRule('scss', /\.scss$/, 'sass-loader')
  createCSSRule('less', /\.less$/, 'less-loader')

  config.module
    .rule('vue')
    .test(/\.vue$/)
    .use('vue-loader')
    .loader('vue-loader')

  /**
   * Plugins
   */
  config.plugin('vue-loader').use(VueLoaderPlugin)

  if (!isDev && !isServer) {
    config.plugin('css-extract')
      .use(require('mini-css-extract-plugin'), [{
        filename: path.join('assets', 'css', 'styles.[chunkhash:6].css')
      }])
  }

  // No need to minimize in dev mode
  if (!isDev) {
    const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
    const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
    config.optimization.minimize(true)
    config.optimization.minimizer([
      new OptimizeCSSAssetsPlugin(),
      new UglifyJSPlugin({
        cache: true,
        parallel: true
      })
    ])
  }

  config
    .plugin('constants')
    .use(require('webpack').DefinePlugin, [{
      'process.env.NODE_ENV': JSON.stringify(ctx.mode),
      __PUBLIC_PATH__: JSON.stringify(ctx.publicPath)
    }])

  return config
}
