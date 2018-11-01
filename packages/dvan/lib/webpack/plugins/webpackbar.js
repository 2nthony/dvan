module.exports = config => {
  config
    .plugin('webpackbar')
    .use(require('webpackbar'), [{
      name: 'client',
      color: '#2a7'
    }])
}
