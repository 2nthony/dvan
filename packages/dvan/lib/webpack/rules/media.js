const path = require('upath')

module.exports = config => {
  const inlineMaxLimit = 5000

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
              name: path.join('__assets', type, '[name].[hash:6].[ext]')
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
  createMediaRule('font', /\.(woff2?|eot|ttf|otf)(\?.*)?$/)
  createMediaRule('media', /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/)
}
