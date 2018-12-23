exports.name = 'built-in:video.config'

exports.extend = api => {
  api.hook('onCreateWebpackConfig', config => {
    const createMediaRule = require('./shared/createMediaRule')(api, config)

    createMediaRule('video', /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/)
  })
}
