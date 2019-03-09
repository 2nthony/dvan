exports.name = 'built-in:config-toml'

exports.extend = api => {
  api.hook('onCreateWebpackChain', config => {
    config.module
      .rule('toml')
      .test(/\.toml$/)
      .use('toml-loader')
      .loader('toml-loader')
  })
}
