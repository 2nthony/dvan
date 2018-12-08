const path = require('upath')
const globby = require('globby')
const resolveFrom = require('resolve-from')

module.exports = ({ files = [], matches = [], dir, packageKey }) => {
  const matchFiles = files.concat(matches)
  const configFiles = globby.sync(matchFiles, { cwd: dir })

  let config
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
        resolveConfig(dir, configFilePath, packageKey)
      )
    }
  }

  return config
}

function resolveConfig(dir, fp, packageKey) {
  if (/\.js(on)?$/.test(fp)) {
    if (fp.endsWith('package.json')) {
      const configFromPkg = require(fp)[packageKey]
      return Object.assign(
        configFromPkg ? {} : { configPath: undefined },
        configFromPkg
      )
    }

    return require(fp)
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

  return JSON.parse(readFileSync(fp, 'utf8'))
}
