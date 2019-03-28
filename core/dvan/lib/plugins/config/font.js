exports.name = 'built-in:config-font'

exports.apply = api => {
  api.hook('createWebpackChain', config => {
    config.module
      .rule('font')
      .test(/\.(woff2?|eot|ttf|otf)(\?.*)?$/)
      .use('file-loader')
      .loader('file-loader')
      .options({
        name: api.config.output.fileNames.font
      })
  })
}
