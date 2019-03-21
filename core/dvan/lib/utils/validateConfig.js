const { struct } = require('superstruct')

module.exports = (api, config) => {
  const entry = struct.optional(
    struct.union(['string', 'array', 'object']),
    'index'
  )
  const srcDir = struct('string', 'src')
  const html = struct.optional(
    struct.union(['boolean', 'object']),
    struct.interface(
      {
        title: struct.optional('string'),
        meta: struct.optional(struct.union(['array', 'object']))
      },
      {}
    )
  )
  const output = struct(
    {
      dir: 'string',
      sourceMap: 'boolean',
      minimize: 'boolean',
      publicUrl: 'string',
      clean: 'boolean',
      format: struct.enum(['iife', 'umd', 'cjs']),
      moduleName: struct.optional('string'),
      fileNames: struct.optional(
        struct.object({
          js: struct.optional('string'),
          css: struct.optional('string'),
          font: struct.optional('string'),
          image: struct.optional('string'),
          video: struct.optional('string')
        })
      ),
      html
    },
    {
      dir: 'dist',
      sourceMap: !api.isProd,
      minimize: api.isProd,
      publicUrl: '/',
      clean: true,
      format: 'iife'
    }
  )
  const publicFolder = struct('string', 'public')
  const plugins = struct('array', [])
  const constants = struct('object', {})
  const devServer = struct.interface(
    {
      hot: 'boolean',
      host: 'string',
      port: struct.union(['number', 'string']),
      hotEntries: struct(['string']),
      https: struct.optional(struct.union(['boolean', 'object'])),
      before: struct.optional('function'),
      after: struct.optional('function'),
      open: 'boolean',
      historyApiFallback: struct.optional(struct.union(['boolean', 'object']))
    },
    {
      hot: true,
      // Cloud IDEs use envs
      host: process.env.HOST || '0.0.0.0',
      port: process.env.PORT || 4000,
      hotEntries: ['index'],
      open: false
    }
  )
  const extractCss = struct('boolean', api.isProd)
  const jsx = struct.optional(struct.union(['boolean', 'string']), false)
  const loaderOptions = struct('object', {})
  const evergreen = struct('boolean', false)

  // Build pipeline
  const configureWebpack = struct.optional(struct.union(['object', 'function']))
  const chainWebpack = struct.optional('function')

  const Struct = struct({
    entry,
    srcDir,
    output,
    publicFolder,
    plugins,
    constants,
    devServer,
    extractCss,
    jsx,
    loaderOptions,
    evergreen,
    configureWebpack,
    chainWebpack,
    // Config file path
    configPath: struct.optional('string')
  })

  const [err, res] = Struct.validate(config)

  if (err) throw err

  res.output.fileNames = Object.assign(
    {
      js: 'assets/js/[name].[chunkhash:8].js',
      css: 'assets/css/style.[chunkhash:8].css',
      font: 'assets/font/[name].[hash:8].[ext]',
      image: 'assets/image/[name].[hash:8].[ext]',
      video: 'assets/video/[name].[hash:8].[ext]'
    },
    res.output.fileNames
  )

  // Ensure publicUrl
  res.output.publicUrl = res.output.publicUrl
    // Must end with slash
    .replace(/\/?$/, '/')
    // Remove leading ./
    .replace(/^\.\//, '')

  api.logger.debug('Validated config', res)

  return res
}
