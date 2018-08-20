const path = require('upath')
const Config = require('webpack-chain')
const { VueLoaderPlugin } = require('vue-loader')

module.exports = ctx => {
  const config = new Config()
  const isDev = ctx.mode === 'development'
  const publicPath = isDev ? '/' : ''

  config.merge({
    mode: ctx.mode
  })

  config.output
    .filename(
      !isDev
        ? '_dvan/assets/js[name].[chunkhash:6].js'
        : '_dvan/assets/js[name].js'
    )
    .publicPath(publicPath)

  config.resolve.alias
    .set('vue$', 'vue/dist/vue.esm.js')
    .set('@pages', path.join(ctx.options.baseDir, 'pages'))

  config.resolve.extensions
    .add('.vue')
    .add('.js')
    .add('.json')

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
      presets: [require.resolve('@babel/preset-env')],
      plugins: [
        require.resolve('@babel/plugin-syntax-dynamic-import'),
        [
          require.resolve('fast-async'),
          {
            spec: true
          }
        ]
      ]
    })

  config.module
    .rule('css')
    .test(/\.css$/)
    .use('vue-style-loader')
    .loader('vue-style-loader')
    .end()
    .use('css-loader')
    .loader('css-loader')

  config.module
    .rule('vue')
    .test(/\.vue$/)
    .use('vue-loader')
    .loader('vue-loader')

  config.plugin('vue-loader').use(VueLoaderPlugin)

  config
    .plugins('constants')
    .use(require('webpack').DefinePlugin, [
      {
        'process.env.NODE_ENV': `'${ctx.mode}'`,
        __PUBLIC_PATH__: `'${publicPath}'`
      }
    ])

  return config
}
