const path = require('path')
const isLocalPath = require('@dvan/utils/isLocalPath')
const { emptyDir } = require('fs-extra')
const webpack = require('webpack')

const normalizeEntry = v => {
  if (v.startsWith('module:')) {
    return v.replace(/^module:/, '')
  }

  if (isLocalPath(v)) {
    return v
  }

  return `./${v}`
}

module.exports = (config, api) => {
  /**
   * Set entry
   */
  const webpackEntry = {}
  const { entry, srcDir } = api.config

  if (typeof entry === 'string') {
    webpackEntry.index = [entry]
  } else if (Array.isArray(entry)) {
    webpackEntry.index = entry
  } else if (typeof entry === 'object') {
    Object.assign(webpackEntry, entry)
  }

  for (const name of Object.keys(webpackEntry)) {
    webpackEntry[name] = Array.isArray(webpackEntry[name])
      ? webpackEntry[name].map(v => normalizeEntry(v))
      : normalizeEntry(webpackEntry[name])
  }

  config.merge({ entry: webpackEntry })

  /**
   * Set mode
   */
  config.mode(api.mode)

  /**
   * Set extensions
   */
  config.resolve.extensions.merge(['.mjs', '.js', '.jsx', '.json'])

  /**
   * Output
   */
  config.output
    .filename(api.config.output.fileNames.js)
    .publicPath(api.config.output.publicUrl)
    .path(api.resolveOutDir())
    .chunkFilename(api.config.output.fileNames.js.replace(/\.js$/, '.chunk.js'))

  /**
   * output.sourceMap defaults to false in production mode
   */
  config.devtool(
    api.config.output.sourceMap === false
      ? false
      : api.isProd
      ? 'source-map'
      : 'cheap-module-source-map'
  )

  /**
   * Format
   */
  const { format, moduleName } = api.config.output
  if (format === 'cjs') {
    config.output.libraryTarget('commonjs2')
  } else if (format === 'umd') {
    config.output.libraryTarget('umd')
    config.output.library(moduleName)
  }

  /**
   * Alias `@` to source directory
   * Alias `@@` to root directory
   * Alias `@views` to views directory
   * Alias `@pages` to pages directory
   * Alias `@plugins` to plugins directory
   * Alias `@components` to components directory
   */
  config.resolve.alias
    .set('@', api.resolveCwd(srcDir))
    .set('@@', api.cwd)
    .set('@views', api.resolveSrc('views'))
    .set('@pages', api.resolveSrc('pages'))
    .set('@plugins', api.resolveSrc('plugins'))
    .set('@components', api.resolveSrc('components'))

  config.resolve.alias.set(
    '#webpack-hot-client$',
    require.resolve('@dvan/dev-utils/hotDevClient')
  )

  config.merge({
    /**
     * Disable webpack's default minimizer
     */
    optimization: {
      minimize: false
    },
    /**
     * Disalbe webpack's default performance hints
     */
    performance: {
      hints: false
    }
  })

  /**
   * Minimize js files
   */
  if (api.config.output.minimize) {
    config.plugin('minimize').use(require('terser-webpack-plugin'), [
      {
        cache: true,
        parallel: true,
        sourceMap: api.config.output.sourceMap,
        terserOptions: {
          parse: {
            // We want terser to parse ecma 8 code. However, we don't want it
            // to apply any minfication steps that turns valid ecma 5 code
            // into invalid ecma 5 code. This is why the 'compress' and 'output'
            // sections only apply transformations that are ecma 5 safe
            // https://github.com/facebook/create-react-app/pull/4234
            ecma: 8
          },
          compress: {
            ecma: 5,
            warnings: false,
            // Disabled because of an issue with Uglify breaking seemingly valid code:
            // https://github.com/facebook/create-react-app/issues/2376
            // Pending further investigation:
            // https://github.com/mishoo/UglifyJS2/issues/2011
            comparisons: false,
            // Disabled because of an issue with Terser breaking valid code:
            // https://github.com/facebook/create-react-app/issues/5250
            // Pending futher investigation:
            // https://github.com/terser-js/terser/issues/120
            inline: 2
          },
          mangle: {
            safari10: true
          },
          output: {
            ecma: 5,
            comments: false,
            // Turned on because emoji and regex is not minified properly using default
            // https://github.com/facebook/create-react-app/issues/2488
            ascii_only: true
          }
        }
      }
    ])
  }

  /**
   * Split vendors and common chunks
   */
  if (api.isProd && api.config.output.format === 'iife') {
    config.optimization.splitChunks({
      cacheGroups: {
        vendors: {
          name: `chunk-vendors`,
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          chunks: 'initial'
        },
        common: {
          name: `chunk-common`,
          minChunks: 2,
          priority: -20,
          chunks: 'initial',
          reuseExistingChunk: true
        }
      }
    })

    // Keep the runtime chunk seperated to enable long term caching
    // https://twitter.com/wSokra/status/969679223278505985
    config.optimization.runtimeChunk(true)
  }

  /**
   * Constants
   */
  config.plugin('constants').use(webpack.DefinePlugin, [
    Object.assign(
      {
        PUBLIC_URL: JSON.stringify(api.config.output.publicUrl),
        DVAN_APP: JSON.stringify(process.env.DVAN_APP),
        IS_VUE: JSON.stringify(process.env.DVAN_APP === 'vue')
      },
      api.config.constants
    )
  ])

  /**
   * Building progress
   */
  config.plugin('progress').use(webpack.ProgressPlugin, [
    (per, message, ...args) => {
      const spinner = require('@dvan/utils/spinner')

      const msg = `${(per * 100).toFixed(2)}% ${message} ${args
        .map(arg => {
          const message = path.relative(api.cwd, arg)
          return message.length > 40
            ? `...${message.substr(message.length - 39)}`
            : message
        })
        .join(' ')}`

      if (per === 0) {
        spinner.start(msg)
      } else if (per === 1) {
        spinner.stop()
      } else {
        spinner.text = msg
      }
    }
  ])

  /**
   * Empty dist
   */
  config.plugin('empty-dist').use(
    class EmptyDist {
      apply(compiler) {
        compiler.hooks.before.tapPromise('empty-dist', async () => {
          if (api.resolveOutDir() === api.cwd) {
            api.logger.error('Refused to empty current working directory')
            return
          }
          await emptyDir(api.resolveOutDir())
        })
      }
    }
  )

  /**
   * Copy public folder
   */
  config.plugin('copy-public-folder').use(require('copy-webpack-plugin'), [
    [
      {
        from: {
          glob: '**/*',
          dot: true
        },
        context: api.resolveCwd(api.config.publicFolder),
        to: '.',
        ignore: ['.DS_Store']
      }
    ]
  ])

  config
    .plugin('print-status')
    .use(require('@dvan/dev-utils/printStatusPlugin'), [api.cli.options])
}
