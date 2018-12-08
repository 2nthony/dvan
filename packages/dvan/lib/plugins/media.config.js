exports.name = 'built-in:media.config'

exports.extend = api => {
  const inlineMaxLimit = 5000

  api.hook('onCreateWebpackConfig', config => {
    const createMediaRule = (type, test, loader = 'file-loader') => {
      if (type) {
        config.module
          .rule(type)
          .test(test)
          .use(loader)
          .loader(loader)
          .options(
            Object.assign(
              {
                name: `__assets/${type}/[name].[hash].[ext]`
              },
              loader === 'url-loader' ? { limit: inlineMaxLimit } : {}
            )
          )
      }
    }

    createMediaRule('image', /\.(png|jpe?g|webp|bmp|gif)(\?.*)?$/, 'url-loader')

    // SVG with file-loader
    // https://github.com/facebookincubator/create-react-app/pull/1180
    createMediaRule('svg', /\.(svg)(\?.*)?$/)
    createMediaRule('media', /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/)
  })
}
