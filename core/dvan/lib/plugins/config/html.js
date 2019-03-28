const path = require('path')
const { existsSync } = require('fs-extra')
const isLocalPath = require('../../utils/isLocalPath')

exports.name = 'built-in:config-html'

exports.cli = ({ command }) => {
  command.option('--html', 'HTML template options')
  command.option('--no-html', 'Disable HTML template')
}

exports.apply = api => {
  api.hook('createWebpackChain', config => {
    const {
      isProd,
      pkg,
      config: {
        output: { html = {} }
      }
    } = api

    if (html === false) return
    config.plugin('html').use('html-webpack-plugin', [
      Object.assign(
        {
          inject: true,
          filename: 'index.html',
          minify: isProd
            ? {
                removeComments: true,
                collapseWhitespace: true,
                removeRedundantAttributes: true,
                useShortDoctype: true,
                removeEmptyAttributes: true,
                removeStyleLinkTypeAttributes: true,
                keepClosingSlash: true,
                minifyJS: true,
                minifyCSS: true,
                minifyURLs: true
              }
            : undefined
        },
        {
          title: pkg.productName || pkg.name || 'Dvan App',
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
            : existsSync(api.resolveCwd('public/template.html'))
            ? api.resolveCwd('public/template.html')
            : require.resolve(
                path.join(__dirname, '../../webpack/default-template.html')
              )
        }
      )
    ])
  })
}
