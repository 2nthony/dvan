const logger = require('@dvan/cli-utils/logger')

module.exports = fp => {
  if (/\.js(on)?$/.test(fp)) {
    return logger.color('yellow', fp)
  }
  if (/\.ts$/.test(fp)) {
    return logger.color('blue', fp)
  }
  if (/\.toml$/.test(fp)) {
    return logger.color('cyan', fp)
  }
  if (/\.ya?ml$/.test(fp)) {
    return logger.color('red', fp)
  }

  return fp
}
