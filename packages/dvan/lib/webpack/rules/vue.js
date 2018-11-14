module.exports = config => {
  config.resolve.alias.set('vue$', 'vue/dist/vue.esm')

  config.resolve.extensions.add('.vue')

  config.module
    .rule('vue')
    .test(/\.vue$/)
    .exclude.add(file => /node_modules/.test(file) && !/\.vue/.test(file))
    .end()
    .use('vue-loader')
    .loader('vue-loader')

  config.plugin('vue-loader').use('vue-loader/lib/plugin')
}
