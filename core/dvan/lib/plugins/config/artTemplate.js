exports.name = 'built-in:config-art-template'

exports.extend = api => {
  api.hook('onCreateWebpackConfig', config => {
    config.module
      .rule('art-template')
      .test(/\.art$/)
      .use('art-template-loader')
      .loader('art-template-loader')
      .options(Object.assign({}, api.config.loaderOptions.artTemplate))
  })
}
