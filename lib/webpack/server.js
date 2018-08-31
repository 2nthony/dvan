const base = require('./base.js')

module.exports = ctx => {
  const config = base(ctx, 'server')

  config.target('node')

  config.output
    .path(ctx.resolveBaseDir(ctx.config.outputDir))
    .libraryTarget('commonjs2')

  return config
}