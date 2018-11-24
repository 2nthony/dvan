module.exports = (config, api) => {
  config.resolve.alias.set(
    'vue',
    api.resolve('node_modules', 'vue/dist/vue.esm')
  )

  config.resolve.extensions.add('.vue')

  config.module
    .rule('vue')
    .test(/\.vue$/)
    .use('vue-loader')
    .loader('vue-loader')

  config.plugin('vue-loader').use(require('vue-loader/lib/plugin'))
}
