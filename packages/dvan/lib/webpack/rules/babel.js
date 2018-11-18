module.exports = (config, jsx) => {
  const options = {
    babelrc: false,
    presets: [require.resolve('@babel/preset-env')],
    plugins: [require.resolve('@babel/plugin-syntax-dynamic-import')]
  }

  // vue-jsx preset
  // https://github.com/vuejs/jsx
  if (jsx) {
    options.presets.push(
      '@vue/babel-preset-jsx'
    )
  }

  config.resolve.extensions.add('.jsx')

  config.module
    .rule('js')
    .test(/\.m?jsx?$/)
    .include.add(file => !/node_modules/.test(file))
    .end()
    .use('babel-loader')
    .loader('babel-loader')
    .options(options)
}
