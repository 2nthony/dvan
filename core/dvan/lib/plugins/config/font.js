exports.name = 'built-in:config-font'

exports.extend = api => {
  api.hook('onCreateWebpackConfig', config => {
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
