module.exports = ({
  host,
  port
}) => ({
  outDir: 'dist',
  publicPath: '/',
  html: {},
  pagesDir: 'pages',
  sourceMap: true,
  minimize: 'auto',
  plugins: [],
  constants: {},

  // configure webpack-dev-server
  devServer: {
    host: process.env.HOST || host || '0.0.0.0',
    port: process.env.PORT || port || 4000
  },

  css: {
    extract: 'auto',
    loaderOptions: {}
  }
})
