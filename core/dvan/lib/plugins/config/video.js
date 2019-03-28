exports.name = 'built-in:config-video'

exports.apply = api => {
  api.hook('createWebpackChain', config => {
    const createMediaRule = require('../shared/createMediaRule')(api, config)

    createMediaRule(
      'video',
      /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
      'file-loader'
    )
  })
}
