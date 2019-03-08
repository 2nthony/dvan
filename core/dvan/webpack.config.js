const Dvan = require('.')

const dvan = new Dvan()

module.exports = dvan.createWebpackConfig().toConfig()
