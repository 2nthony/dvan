// need to configurable
module.exports = config => {
  config.module
    .rule('js')
    .test(/\.js$/)
    .exclude.add(file => (
      /node_modules/.test(file) && !/\.js/.test(file)
    ))
    .end()
    .use('babel-loader')
    .loader('babel-loader')
    .options({
      babelrc: false,
      presets: [
        require.resolve('@babel/preset-env')
      ],
      plugins: [
        require.resolve('@babel/plugin-syntax-dynamic-import')
      ]
    })
}
