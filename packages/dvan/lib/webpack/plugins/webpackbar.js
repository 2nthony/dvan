module.exports = (config, name) => {
  config
    .plugin('webpackbar')
    .use(require('webpackbar'), [{
      name: name || 'Client',
      color: '#2a7'
    }])
}
