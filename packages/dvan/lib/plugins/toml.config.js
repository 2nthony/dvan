exports.name = 'built-in:toml.config'

exports.extend = api => {
  api.hook('onCreateWebpackConfig', config => {
    config.module
      .rule('toml')
      .test(/\.toml$/)
      .use('toml-loader')
      .loader('toml-loader')
  })
}
