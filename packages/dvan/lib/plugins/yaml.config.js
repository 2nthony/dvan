exports.name = 'built-in:yaml.config'

exports.extend = api => {
  api.hook('onCreateWebpackConfig', config => {
    config.module
      .rule('yaml')
      .test(/\.ya?ml$/)
      .merge({
        type: 'json'
      })
      .use('yaml-loader')
      .loader('yaml-loader')
  })
}
