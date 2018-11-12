exports.name = 'built-in:webpack.base.config'

exports.extend = api => {
  api.chainWebpack((config, { type }) => {
    config.mode(api.mode)

    config.output
      .filename(require('upath').join('assets', 'js', '[name].[chunkhash:6].js'))
      .publicPath(api.config.publicPath)
      .path(api.resolve(api.config.outDir))

    config.devtool(api.mode === 'production' ? false : 'cheap-dev-source')

    config.resolve.extensions.add('.js').add('.json')

    // minimize
    const { minimize } = api.config.minimize
    const isMinimizeObject = typeof minimize === 'object'
    const shouldMinimize =
      minimize === 'auto' || minimize === undefined || isMinimizeObject
        ? api.mode === 'production'
        : minimize

    if (shouldMinimize) {
      const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
      const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')

      const minimizeOptions = [
        new OptimizeCSSAssetsPlugin(
          Object.assign({}, isMinimizeObject ? minimize.css : undefined)
        ),
        new UglifyJSPlugin(
          Object.assign({
            cache: true,
            parallel: true,
            sourceMap: api.config.sourceMap
          }, isMinimizeObject ? minimize.js : undefined)
        )
      ]

      config.optimization.minimize(shouldMinimize)
      config.optimization.minimizer(minimizeOptions)
    }

    // rules
    require('../webpack/rules/babel')(config)
    require('../webpack/rules/vue')(config)
    require('../webpack/rules/media')(config)
    require('../webpack/rules/css')(config, api, type === 'server')
    require('../webpack/rules/yaml')(config)
    require('../webpack/rules/toml')(config)

    // plugins
    require('../webpack/plugins/progress')(config, type)
    require('../webpack/plugins/constants')(config, api)

    return config
  })
}
