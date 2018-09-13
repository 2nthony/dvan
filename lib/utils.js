const fs = require('fs-extra')

exports.isEmptyFile = src => {
  return fs.existsSync(src) && fs.readFileSync(src, 'utf8') !== ''
}
