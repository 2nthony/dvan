const ProgressBar = require('progress')

module.exports = (config, type) => {
  config
    .plugin('progress')
    .use(require('webpack').ProgressPlugin, [(percent) => {
      const bar = new ProgressBar(
        `Building ${type} [:bar] ${Math.floor(percent * 100)}%`,
        {
          complete: '=',
          incomplete: ' ',
          width: 25,
          total: 100
        }
      )

      bar.update(percent)
    }])
}
