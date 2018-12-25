const { struct } = require('superstruct')

module.exports = (api, config) => {
  const entry = struct.optional(
    struct.union(['string', 'array', 'object']),
    'index'
  )
  const srcDir = struct('string', 'src')
  const outDir = struct('string', 'dist')
  const output = struct(
    {
      format: struct.enum(['iife', 'umd', 'cjs']),
      moduleName: struct.optional('string'),
      fileNames: struct.optional(
        struct.object({
          js: struct('string?'),
          css: struct('string?'),
          font: struct('string?'),
          image: struct('string?'),
          video: struct('string?')
        })
      )
    },
    {
      format: 'iife'
    }
  )
  const publicPath = struct('string', '/')
  const publicFolder = struct('string', 'public')
  const html = struct.optional(
    struct.union(['boolean', 'object']),
    struct.interface(
      {
        title: 'string',
        meta: struct('array|object')
      },
      {
        title: api.pkg.name || 'Dvan App',
        meta: api.pkg.description
          ? [
              {
                name: 'description',
                content: api.pkg.description
              }
            ]
          : []
      }
    )
  )
  const sourceMap = struct('boolean', !api.isProd)
  const minimize = struct('boolean|object', api.isProd)
  const plugins = struct('array', [])
  const constants = struct('object', {})
  const devServer = struct.interface(
    {
      hot: 'boolean',
      host: 'string',
      port: 'number|string',
      hotEntries: struct.tuple(['string']),
      https: struct.optional('boolean|object'),
      before: 'function?',
      after: 'function?',
      open: 'boolean'
    },
    {
      hot: true,
      host: '0.0.0.0',
      port: 4000,
      hotEntries: ['index'],
      open: false
    }
  )
  const extractCss = struct('boolean', true)
  const jsx = struct('boolean|string', false)
  const loaderOptions = struct('object', {})
  const evergreen = struct('boolean', false)

  // Build pipeline
  const chainWebpack = struct.optional('function')

  const Struct = struct({
    entry,
    srcDir,
    outDir,
    output,
    publicPath,
    publicFolder,
    html,
    sourceMap,
    minimize,
    plugins,
    constants,
    devServer,
    extractCss,
    jsx,
    loaderOptions,
    evergreen,
    chainWebpack,
    // Config file path
    configPath: 'string?'
  })

  const [err, res] = Struct.validate(config)

  if (err) throw err

  res.output.fileNames = Object.assign(
    {
      js: 'assets/js/[name].[contenthash].js',
      css: 'assets/css/style.[contenthash].css',
      font: 'assets/font/[name].[hash].[ext]',
      image: 'assets/image/[name].[hash].[ext]',
      video: 'assets/video/[name].[hash].[ext]'
    },
    res.output.fileNames
  )

  api.logger.debug('Validated config', res)

  return res
}
