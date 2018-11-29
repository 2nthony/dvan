module.exports = (cli = {}, pkg = {}) => ({
  srcDir: 'src',
  outDir: '__dist',
  publicPath: '/',
  html: {
    title: pkg.name || 'Dvan App',
    meta: pkg.description
      ? [
          {
            name: 'description',
            content: pkg.description
          }
        ]
      : []
  },
  match: 'vue',
  sourceMap: true,
  minimize: true,
  plugins: [],
  constants: {},

  // Configure webpack-dev-server
  devServer: {
    host: process.env.HOST || cli.host || '0.0.0.0',
    port: process.env.PORT || cli.port || 4000
  },

  css: {
    extract: true,
    loaderOptions: {}
  },

  // Vue-jsx
  jsx: Boolean(cli.jsx)
})
