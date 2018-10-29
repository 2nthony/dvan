const path = require('upath')
const globby = require('globby')

module.exports = ({
  files = [],
  matches = [],
  dir
}) => {
  const matchFiles = files.concat(matches)
  const configFiles = globby.sync(
    matchFiles,
    { cwd: dir }
  )

  let config, configFilePath

  if (configFiles.length > 0) {
    for (const configFile of configFiles) {
      configFilePath = path.join(dir, configFile)
      config = Object.assign({},
        require(configFilePath),
        { path: configFilePath }
      )
      if (config && config !== '{}') break
    }
  }

  return config
}
