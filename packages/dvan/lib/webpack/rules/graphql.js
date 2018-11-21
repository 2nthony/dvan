module.exports = config => {
  config.module
    .rule('graphql')
    .test(/\.(g(raph)?ql)$/)
    .use('graphql-tag')
    .loader('graphql-tag/loader')
}
