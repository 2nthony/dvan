const resolveFrom = require('resolve-from')

const isLocalPlugin = p => /^[./]|(^[a-zA-Z]:)/.test(p)

module.exports = (baseDir, plugins) => {
  return plugins.map(plugin => {
    if (plugin && typeof plugin === 'object') {
      return plugin
    }
    if (typeof plugin === 'string') {
      return isLocalPlugin(plugin)
        ? require(plugin)
        : require(resolveFrom(baseDir, plugin))
    }
  })
}
