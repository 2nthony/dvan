const fs = require('fs-extra')

exports.isExistsPath = src => {
  return fs.existsSync(src)
}
