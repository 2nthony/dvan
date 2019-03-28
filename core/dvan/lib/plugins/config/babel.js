exports.name = 'built-in:config-babel'

exports.cli = ({ command }) => {
  command.option('--jsx [syntax]', 'Set jsx syntax or pragma', {
    default: 'false|react'
  })
}

exports.apply = api => {
  api.hook('createWebpackChain', config => {
    const { jsx } = api.config
    const isReactJSX = jsx === true || jsx === 'react'
    const isVueJSX = jsx === 'vue'

    const presets = [
      require('@babel/preset-env'),
      jsx &&
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
      .rule('babel')
      .test(/\.m?jsx?$/)
      .include.add(fp => !/node_modules/.test(fp))
      .end()
      .use('babel-loader')
      .loader('babel-loader')
      .options(Object.assign(babelOptions, api.config.loaderOptions.babel))
  })
}
