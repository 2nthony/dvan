exports.name = 'built-in:font.config'

exports.extend = api => {
  api.hook('onCreateWebpackConfig', config => {
    config.module
      .rule('font')
      .test(/\.(woff2?|eot|ttf|otf)(\?.*)?$/)
      .use('file-loader')
      .loader('file-loader')
      .options({
        name: '__assets/font/[name].[hash].[ext]'
      })
  })
}
