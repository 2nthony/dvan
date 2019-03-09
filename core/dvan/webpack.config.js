const Dvan = require('.')

const dvan = new Dvan()

module.exports = dvan.createWebpackChain().toConfig()
