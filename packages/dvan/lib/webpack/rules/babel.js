module.exports = config => {
  config.module
    .rule('js')
    .test(/\.m?js$/)
    .include.add(file => !/node_modules/.test(file))
    .end()
    .use('babel-loader')
    .loader('babel-loader')
    .options({
      babelrc: false,
      presets: [require.resolve('@babel/preset-env')],
      plugins: [require.resolve('@babel/plugin-syntax-dynamic-import')]
    })
}
