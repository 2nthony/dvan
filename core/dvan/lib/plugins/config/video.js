exports.name = 'built-in:config-video'

exports.extend = api => {
  api.hook('onCreateWebpackChain', config => {
    const createMediaRule = require('../shared/createMediaRule')(api, config)

    createMediaRule(
      'video',
      /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
      'file-loader'
    )
  })
}
