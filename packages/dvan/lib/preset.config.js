module.exports = ({ host, port, jsx } = {}, pkg) => ({
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
  minimize: 'auto',
  plugins: [],
  constants: {},

  // Configure webpack-dev-server
  devServer: {
    host: process.env.HOST || host || '0.0.0.0',
    port: process.env.PORT || port || 4000
  },

  css: {
    extract: 'auto',
    loaderOptions: {}
  },

  // Vue-jsx
  jsx: jsx || false
})
