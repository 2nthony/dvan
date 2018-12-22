exports.name = 'built-in:art.template.config'

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
