const path = require('upath')
const globby = require('globby')
const resolveFrom = require('resolve-from')

module.exports = ({ files = [], matches = [], dir }) => {
  const matchFiles = files.concat(matches)
  const configFiles = globby.sync(matchFiles, { cwd: dir })

  let config
  let configFilePath

  if (configFiles.length > 0) {
    for (const configFile of configFiles) {
      configFilePath = path.join(dir, configFile)
      config = Object.assign({}, resolveConfig(dir, configFilePath), {
        path: configFilePath
      })
      if (config && config !== '{}') break
    }
  }

  return config
}

function resolveConfig(dir, fp) {
  if (/\.js$/.test(fp)) {
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
}
