module.exports = (config, jsx) => {
  const options = {
    babelrc: false,
    presets: [require.resolve('@babel/preset-env')],
    plugins: [require.resolve('@babel/plugin-syntax-dynamic-import')]
  }

  // vue-jsx preset
  // https://github.com/dvanjs/dvan/tree/master/packages/babel-preset-jsx
  // for temporary
  if (jsx) {
    options.presets.push(
      '@dvan/babel-preset-jsx'
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
