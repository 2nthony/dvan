exports.name = 'built-in:config-graphql'

exports.extend = api => {
  api.hook('onCreateWebpackConfig', config => {
    config.module
      .rule('graphql')
      .test(/\.g(raph)?ql$/)
      .use('graphql-tag')
      .loader('graphql-tag/loader')
  })
}
