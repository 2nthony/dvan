const path = require('upath')
const isLocalPath = require('../utils/isLocalPath')

exports.name = 'built-in:html.config'

exports.extend = api => {
  const { html = {} } = api.config
  const { pkg } = api

  api.hook('onCreateWebpackConfig', config => {
    config.plugin('html').use('html-webpack-plugin', [
      Object.assign(
        {
          inject: true,
          filename: 'index.html'
        },
        {
          title: pkg.name || 'Dvan App',
          meta: pkg.description
            ? [
                {
                  name: 'description',
                  content: pkg.description
                }
              ]
            : []
        },
        html,
        {
          template: html.template
            ? isLocalPath(html.template)
              ? api.resolveCwd(html.template)
              : html.template
            : require.resolve(
                path.join(__dirname, '../webpack/default.template.html')
              )
        }
      )
    ])
  })
}
