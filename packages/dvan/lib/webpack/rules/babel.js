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
      require.resolve('@vue/babel-preset-jsx')
    )
  }

  config.module
    .rule('js')
    .test(/\.m?js$/)
    .include.add(file => !/node_modules/.test(file))
    .end()
    .use('babel-loader')
    .loader('babel-loader')
    .options(options)
}
