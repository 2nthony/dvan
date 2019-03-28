exports.name = 'built-in:config-misc-loaders'

exports.apply = api => {
  api.hook('createWebpackChain', config => {
    // GraphQL
    config.module
      .rule('graphql')
      .test(/\.g(raph)?ql$/)
      .use('graphql-tag')
      .loader('graphql-tag/loader')

    // TOML
    config.module
      .rule('toml')
      .test(/\.toml$/)
      .use('toml-loader')
      .loader('toml-loader')

    // YAML
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
