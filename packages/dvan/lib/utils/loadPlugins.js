const resolveFrom = require('resolve-from')

const isLocalPlugin = p => /^[./]|(^[a-zA-Z]:)/.test(p)

module.exports = (baseDir, plugins) => {
  return plugins.map(plugin => {
    if (plugin && typeof plugin === 'object') {
      if (!plugin.name) plugin.name = 'Unnamed plugin from "dvan.config".plugins'

      return plugin
    }

    if (typeof plugin === 'string') {
      const _plugin = isLocalPlugin(plugin)
        ? require(require('upath').join(baseDir, plugin))
        : require(resolveFrom(baseDir, plugin))

      if (!_plugin.name) _plugin.name = `Unnamed plugin from "${plugin}"`

      return _plugin
    }
  })
}
