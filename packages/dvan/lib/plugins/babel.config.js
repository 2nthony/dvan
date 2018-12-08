exports.name = 'built-in:babel.config'

exports.extend = api => {
  api.hook('onInitCLI', ({ command }) => {
    command.option('--jsx <syntax>', 'Set jsx syntax', { default: 'react' })
  })

  api.hook('onCreateWebpackConfig', config => {
    config.module
      .rule('js')
      .test(/\.m?jsx?$/)
      .include.add(fp => !/node_modules/.test(fp))
      .end()
      .use('babel-loader')
      .loader('babel-loader')
      .options(
        Object.assign(
          {
            presets: [require.resolve('@babel/preset-env')],
            plugins: [require.resolve('@babel/plugin-syntax-dynamic-import')]
          },
          api.config.loaderOptions.babel
        )
      )
  })
}
