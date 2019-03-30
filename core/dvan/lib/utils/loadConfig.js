const path = require('path')
const globby = require('globby')
const resolveFrom = require('resolve-from')

module.exports = ({ files = [], matches = [], dir, packageKey }, api) => {
  const matchFiles = files.concat(matches)
  const configFiles = globby.sync(matchFiles, { cwd: dir })

  let config = {}
  let configFilePath

  if (configFiles.length > 0) {
    for (const configFile of configFiles) {
      configFilePath = path.join(dir, configFile)
      config = Object.assign(
        {},
        config,
        {
          configPath: configFilePath
        },
        resolveConfig(dir, configFilePath, packageKey, api)
      )
    }
  }

  return config
}

function resolveConfig(dir, fp, packageKey, api) {
  if (/\.js(on)?$/.test(fp)) {
    if (fp.endsWith('package.json')) {
      const pkg = require(fp)
      return packageKey ? pkg[packageKey] || { configPath: undefined } : pkg
    }

    const config = require(fp)
    return typeof config === 'function' ? config(api) : config
  }

  const { readFileSync } = require('fs')

  if (/\.toml$/.test(fp)) {
    return require(resolveFrom(dir, 'toml')).parse(readFileSync(fp, 'utf8'))
  }

  if (/\.ya?ml$/.test(fp)) {
    return require(resolveFrom(dir, 'js-yaml')).safeLoad(
      readFileSync(fp, 'utf8')
    )
  }

  // To resolve config file like `.dvanrc` with no extension
  return JSON.parse(readFileSync(fp, 'utf8'))
}
