const resolveFrom = require('resolve-from')

exports.name = 'built-in:config-vue'

exports.extend = api => {
  api.hook('onCreateWebpackConfig', config => {
    config.resolve.extensions.add('.vue')

    config.module
      .rule('vue')
      .test(/\.vue$/)
      .use('vue-loader')
      .loader('vue-loader')
      .options(
        Object.assign({}, api.config.loaderOptions.vue, {
          compiler: require(resolveFrom(api.cwd, 'vue-template-compiler'))
        })
      )

    config.plugin('vue-loader').use(require('vue-loader/lib/plugin'))
  })
}
