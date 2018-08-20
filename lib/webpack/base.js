const Config = require('webpack-chain')
const VueLoaderPlugin = require('vue-loader/lib/plugin')

module.exports = ctx => {
  const config = new Config()

  config.merge({
    mode: ctx.mode
  })

  config.resolve.alias
    .set('vue$', 'vue/dist/vue.esm.js')

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
      presets: ['@babel/preset-env'],
      plugins: ['@babel/plugin-syntax-dynamic-import']
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

  config
    .plugin('vue-loader')
    .use(VueLoaderPlugin)

  return config
}
