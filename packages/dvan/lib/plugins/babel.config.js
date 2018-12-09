exports.name = 'built-in:babel.config'

exports.extend = api => {
  api.hook('onInitCLI', ({ command }) => {
    command.option('--jsx <syntax>', 'Set jsx syntax', { default: 'react' })
  })

  api.hook('onCreateWebpackConfig', config => {
    const { jsx } = api.config
    const isReactJSX = jsx === 'react'
    const isVueJSX = jsx === 'vue'

    const presets = [
      require('@babel/preset-env'),
      !isVueJSX && [
        require('@babel/preset-react'),
        {
          pragma: isReactJSX ? 'React.createElement' : jsx
        }
      ],
      isVueJSX && '@dvan/vue-jsx'
    ].filter(Boolean)

    const plugins = [
      require('@babel/plugin-syntax-dynamic-import'),
      [
        require('@babel/plugin-transform-runtime'),
        {
          helpers: false,
          regenerator: true,
          absoluteRuntime: require('path').dirname(
            require.resolve('@babel/runtime/package.json')
          )
        }
      ]
    ]

    const babelOptions = {
      presets,
      plugins
    }

    config.module
      .rule('js')
      .test(/\.m?jsx?$/)
      .include.add(fp => !/node_modules/.test(fp))
      .end()
      .use('babel-loader')
      .loader('babel-loader')
      .options(Object.assign(babelOptions, api.config.loaderOptions.babel))
  })
}
